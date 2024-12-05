import { Api, JwksClient } from "~/api";
import { AppConfig } from "~/config";

export type AppContext = {
  config: AppConfig;
  api: Api;
  jwksClient: JwksClient;
};

export function isAppContext(obj: unknown): obj is AppContext {
  const config = (obj as AppContext).config;
  const api = (obj as AppContext).api;
  const jwksClient = (obj as AppContext).jwksClient;
  return config !== undefined && api !== undefined && jwksClient !== undefined;
}
