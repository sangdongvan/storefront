import invariant from "tiny-invariant";
import type { JwtHeader, JwtPayload, SigningKeyCallback } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { accessTokenCookie, refreshTokenCookie } from "../auth/cookies.server";
import { redirect } from "react-router";
import { AxiosError } from "axios";
import { AppContext } from "~/context";

type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export async function authenticateWithUserCredentials(
  ctx: AppContext,
  request: Request
): Promise<TokenResponse & { error?: string }> {
  const form = await request.formData();
  const email = String(form.get("email"));
  const password = String(form.get("password"));

  let res;
  try {
    res = await ctx.api.post("/api/Auth/GetUserToken", {
      email: email,
      password: password,
    });
  } catch (err) {
    let errMsg;
    if (err instanceof AxiosError) {
      if (err.code === "ECONNREFUSED") {
        errMsg = "Server is offline. ";
      } else if (err.code === "ERR_BAD_REQUEST") {
        // TODO parse error message
        errMsg = "Invalid credentials.";
      }
    } else {
      errMsg = "Server error.";
    }
    return {
      accessToken: "",
      refreshToken: "",
      error: errMsg,
    };
  }

  invariant(typeof res.accessToken === "string", "accessToken must be string");
  invariant(
    typeof res.refreshToken === "string",
    "refreshToken must be string"
  );

  return {
    accessToken: res.accessToken as string,
    refreshToken: res.refreshToken as string,
  };
}

export async function authenticateOrGoLogin(
  ctx: AppContext,
  request: Request
): Promise<TokenResponse> {
  try {
    return await authenticate(ctx, request);
  } catch (_) {
    throw redirect("/login");
  }
}

export async function authenticateOrError(
  ctx: AppContext,
  request: Request
): Promise<TokenResponse & { error?: string }> {
  try {
    return await authenticate(ctx, request);
  } catch (_) {
    return {
      accessToken: "",
      refreshToken: "",
      error: "TODO",
    };
  }
}

async function authenticate(
  ctx: AppContext,
  request: Request
): Promise<TokenResponse> {
  const unauthorized = (code: number) => {
    throw new Error("Unauthorized. Error code: " + code);
  };

  const cookieHeader = request.headers.get("Cookie");
  const token = await accessTokenCookie.parse(cookieHeader);

  if (token === null) {
    unauthorized(1);
  }

  const unverified = jwt.decode(token);
  if (typeof unverified === "string" || unverified === null) {
    // Invalid payload
    unauthorized(2);
  }

  const unverifiedPayload = unverified as JwtPayload;

  // TODO verify exp, aud, etc.
  if (unverifiedPayload.iat == null || unverifiedPayload.exp == null) {
    // Invalid payload
    unauthorized(2);
  }

  type VerifyResult =
    | {
        kind: "success";
        payload: JwtPayload;
      }
    | { kind: "error"; error: "expired" | "malformed" };

  const verifying = new Promise<VerifyResult>((resolve) => {
    jwt.verify(
      token,
      async (header: JwtHeader, callback: SigningKeyCallback) => {
        const key = await ctx.jwksClient.getSigningKey(header.kid);
        callback(null, key.getPublicKey());
      },
      (err, payload) => {
        if (err !== null && err instanceof jwt.TokenExpiredError) {
          resolve({ kind: "error", error: "expired" });
        } else if (
          err != null ||
          payload == null ||
          typeof payload == "string"
        ) {
          resolve({ kind: "error", error: "malformed" });
        } else {
          resolve({ kind: "success", payload });
        }
      }
    );
  });

  const verifiedResult = await verifying;
  if (verifiedResult.kind == "error" && verifiedResult.error == "malformed") {
    throw Error("unauthorized");
  }

  // If access token elapsed more than a half of its expire time.
  // Better to refresh the token before it comes too close.
  const refreshToken = await refreshTokenCookie.parse(cookieHeader);

  if (verifiedResult.kind == "success") {
    const verifiedPayload = verifiedResult.payload;
    const issuedAt = verifiedPayload.iat as number;
    const expireAt = verifiedPayload.exp as number;

    const expireInSeconds = expireAt - issuedAt;
    const secondsToExpire = expireAt - Math.floor(Date.now() / 1000);

    if (secondsToExpire > expireInSeconds / 2) {
      // Token is fresh
      return {
        accessToken: token,
        refreshToken: await refreshToken,
      };
    }

    // Access token is not yet expired, and refresh token is not available for some reason.
    // This is rarely happen, just simplify by consider that access token is invalid.
    if (refreshToken === null) {
      if (secondsToExpire > 0) {
        // Access token is still relevant.
        return {
          accessToken: token,
          refreshToken: await refreshToken,
        };
      } else {
        unauthorized(3);
      }
    }
  }

  // Token expired, let's refresh it.
  let newToken;
  try {
    newToken = await ctx.api.post("/api/Auth/RefreshUserToken", {
      refreshToken,
    });
  } catch (_) {
    throw new Error("Invalid token");
  }

  invariant(
    typeof newToken.accessToken === "string",
    "accessToken must be string"
  );
  invariant(
    typeof newToken.refreshToken === "string",
    "refreshToken must be string"
  );

  return {
    accessToken: newToken.accessToken,
    refreshToken: newToken.refreshToken,
  };
}
