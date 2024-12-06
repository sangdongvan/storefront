import { Api, createApi } from "~/api/.client";
import { AppConfig } from "~/config";
import { isAppConfig } from "./config/app-config";
import axios from "axios";

var api: Api | undefined;
function getApi(storefrontApi: string): Api {
  if (api) {
    return api;
  }
  api = createApi(storefrontApi, {
    axiosInstance: axios.create({
      adapter: "fetch",
    }),
  });
  return api!;
}

export interface ClientAppContext {
  config: AppConfig;
  api: Api;
}

let _configQueue: Promise<AppConfig>;

export async function getConfig(): Promise<AppConfig> {
  if (_configQueue) {
    const _config = await _configQueue;
    if (_config) {
      return _config;
    }
  }

  _configQueue = new Promise<AppConfig>((resolve, reject) => {
    fetch("/api/get-app-config")
      .then((res) => res.json())
      .then((json) => {
        if (isAppConfig(json)) {
          resolve(json);
        } else {
          reject();
        }
      });
  });

  return await _configQueue;
}

export async function getClientContext(): Promise<ClientAppContext> {
  const config = await getConfig();
  return {
    config,
    api: getApi(config.storefrontApi),
  };
}
