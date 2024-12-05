import { createApiClient, schemas } from "../api.gen";
import * as contactApi from "../contact-api";
import * as authApi from "./auth-api";
import JwksRsa from "jwks-rsa";

type JwksClient = JwksRsa.JwksClient;
type Api = ReturnType<typeof createApiClient>;

export { JwksRsa, authApi, contactApi, schemas, createApiClient as createApi };
export type { JwksClient, Api };
