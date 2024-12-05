import { type LoaderFunction, type LoaderFunctionArgs } from "react-router";
import { authApi } from "~/api/.server";

export const loader: LoaderFunction = async ({
  context,
  request,
}: LoaderFunctionArgs) => {
  const { accessToken, error } = await authApi.authenticateOrError(
    context,
    request
  );
  if (error) {
    return new Response(null, { status: 401 });
  }
  return Response.json({ accessToken });
};
