import { createApiClient, schemas } from "../api.gen";
import * as contactApi from "../contact-api";

type Api = ReturnType<typeof createApiClient>;

export {
  contactApi as clientContactApi,
  schemas,
  createApiClient as createApi,
};
export type { Api };
