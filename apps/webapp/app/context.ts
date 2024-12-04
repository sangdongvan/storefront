import { Api, JwksClient } from "./api";

export interface AppContext {
  api: Api;
  jwksClient: JwksClient;
}
