import { jwtDecode } from "jwt-decode";

type Token = {
  // the token itself.
  value: string;
  // When token was issued.
  issuedAtSeconds: number;
  // How long it last til expire.
  expireInSeconds: number;
  // When it expire.
  expireAtSeconds: number;
};

/**
 * Check if token is still relevant, if it already elapsed more than half of
 * its lifetime, it's considered as invalid.
 * @param token Access token to validate
 * @returns True means token can still be used, otherwise, false.
 */
function isValid(token: Token): boolean {
  const secondsToExpire = token.expireAtSeconds - Math.floor(Date.now() / 1000);
  return secondsToExpire > token.expireInSeconds / 2;
}

// An ephemeral access token is intentionally persisted in memory for security purposes.
// DO NOT try to store this token in local storage or anywhere else!
let _tokenQueue: Promise<Token>;

export async function getConfig(): Promise<string> {
  if (_tokenQueue) {
    const _token = await _tokenQueue;
    if (isValid(_token)) {
      return _token.value;
    }
  }

  _tokenQueue = new Promise<Token>((resolve) => {
    fetch("/api/get-access-token")
      .then((res) => res.json())
      .then((json) => {
        const value = json["accessToken"] as string;
        const decoded = jwtDecode(value);
        const issuedAtSeconds = decoded.iat as number;
        const expireAtSeconds = decoded.exp as number;
        const expireInSeconds = expireAtSeconds - issuedAtSeconds;
        resolve({ value, issuedAtSeconds, expireInSeconds, expireAtSeconds });
      });
  });

  return (await _tokenQueue).value;
}
