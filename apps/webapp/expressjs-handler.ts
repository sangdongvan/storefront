import { createRequestHandler } from "@react-router/express";
import JwksRsa from "jwks-rsa";
import "react-router";
import { Api, createApi } from "~/api";
import { AppContext } from "~/context";

declare module "react-router" {
  export interface AppLoadContext extends AppContext {}
}

var api: Api | undefined;
function getApi(storefrontApi: string): Api {
  if (api) {
    return api;
  }
  api = createApi(storefrontApi);
  return api!;
}

var jwksClient: JwksRsa.JwksClient | undefined;
function getJwksClient(storefrontApi: string): JwksRsa.JwksClient {
  if (jwksClient) {
    return jwksClient;
  }
  jwksClient = JwksRsa({
    jwksUri: `${storefrontApi}/_connect/jwks`,
    requestHeaders: {},
    timeout: 30000, // Defaults to 30s
  });
  return jwksClient!;
}

const expressjsHandler = createRequestHandler({
  // @ts-expect-error - virtual module provided by React Router at build time
  build: () => import("virtual:react-router/server-build"),
  getLoadContext(req) {
    const storefrontApi = req.app.get("Config.StorefrontApi");
    return {
      api: getApi(storefrontApi),
      jwksClient: getJwksClient(storefrontApi),
    };
  },
});

export default expressjsHandler;
