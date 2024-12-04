import * as contactApi from "./contact-api";
import * as authApi from "./auth-api";
import { createApiClient } from "./api.gen";
import JwksRsa from "jwks-rsa";

type JwksClient = JwksRsa.JwksClient;
type Api = ReturnType<typeof createApiClient>;

export { authApi, contactApi, createApiClient as createApi };
export type { Api, JwksClient };
