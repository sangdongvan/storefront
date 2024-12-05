import { redirect } from "react-router";
import invariant from "tiny-invariant";

import { authApi, contactApi } from "~/api/.server";
import { Route } from "./+types/destroy";

export const action = async ({
  context,
  request,
  params,
}: Route.ActionArgs) => {
  invariant(params.id, "Missing id param");
  const { accessToken } = await authApi.authenticateOrGoLogin(context, request);
  await contactApi.deleteContact(context.api, params.id, accessToken);
  return redirect("/contacts");
};
