import { type LoaderFunction, type LoaderFunctionArgs } from "react-router";
import invariant from "tiny-invariant";
import { AppConfig } from "~/config";
import { isAppContext } from "~/context.server";

export const loader: LoaderFunction = async ({
  context,
}: LoaderFunctionArgs) => {
  invariant(isAppContext(context));
  const config: AppConfig = {
    storefrontApi: context.config.storefrontApi,
  };
  return Response.json(config, {
    headers: {
      "Cache-Control": "public, max-age=30, s-max-age=3600",
    },
  });
};
