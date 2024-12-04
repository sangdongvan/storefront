import { redirect } from "react-router";
import { Form } from "react-router";
import { authApi, contactApi } from "~/api";
import { accessTokenCookie, refreshTokenCookie } from "~/auth/cookies.server";
import { Route } from "./+types/login";

export const action = async ({ context, request }: Route.ActionArgs) => {
  const { accessToken, refreshToken, error } =
    await authApi.authenticateWithUserCredentials(context, request);

  if (error) {
    return { error };
  }

  return redirect("/contacts", {
    headers: [
      ["Set-Cookie", await accessTokenCookie.serialize(accessToken)],
      ["Set-Cookie", await refreshTokenCookie.serialize(refreshToken)],
    ],
  });
};

export const headers = {
  "Cache-Control": "public, max-age=300, s-max-age=3600",
};

export const loader = async ({ context, request }: Route.LoaderArgs) => {
  const { error } = await authApi.authenticateOrError(context, request);
  if (error) {
    return {};
  }
  return redirect("/contacts");
};

export default function Screen({ actionData }: Route.ComponentProps) {
  const error = actionData?.error;

  return (
    <div id="index-page">
      <Form method="post">
        {error ? <div>{error}</div> : null}
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            defaultValue="abc@domain.com"
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            defaultValue="abcABC@123"
          />
        </div>

        <button>Log In</button>
      </Form>
    </div>
  );
}
