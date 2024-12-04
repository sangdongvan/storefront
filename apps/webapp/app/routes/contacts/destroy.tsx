import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import invariant from "tiny-invariant";

import { authApi, contactApi } from "~/api";
import { Route } from "./+types/destroy";

export const action = async ({
  context,
  request,
  params,
}: Route.ActionArgs) => {
  invariant(params.id, "Missing id param");
  const { accessToken } = await authApi.authenticateOrGoLogin(context, request);
  await contactApi.deleteContact(context, params.id, accessToken);
  return redirect("/contacts");
};
