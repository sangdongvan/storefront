export type AppConfig = {
  storefrontApi: string;
};

export function isAppConfig(obj: unknown): obj is AppConfig {
  const storefrontApi = (obj as AppConfig).storefrontApi;
  return storefrontApi !== undefined;
}
