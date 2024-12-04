import type { z } from "zod";
import type { schemas } from "./api.gen";
import { AppContext } from "~/context";

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
////////////////////////////////////////////////////////////////////////////////

export async function getContacts(
  ctx: AppContext,
  query: string | null,
  token: string
) {
  const findRes = await ctx.api.get("/api/Contact/Find", {
    ...(query === null ? {} : { queries: { Q: query } }),
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return findRes.contacts;
}

export async function createEmptyContact(ctx: AppContext, token: string) {
  const createEmptyRes = await ctx.api.post(
    "/api/Contact/CreateEmpty",
    undefined,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return createEmptyRes;
}

export async function getContact(ctx: AppContext, id: string, token: string) {
  const findOneRes = await ctx.api.get("/api/Contact/FindOne", {
    queries: { Id: id },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return findOneRes;
}

type UpdateOneRequest = z.infer<typeof schemas.UpdateOneContactRequest>;
export async function updateContact(
  ctx: AppContext,
  request: UpdateOneRequest,
  token: string
) {
  const updateOneRes = await ctx.api.post("/api/Contact/UpdateOne", request, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!updateOneRes) {
    throw new Error(`No contact found for ${request.id}`);
  }
}

export async function markAsFavoriteContact(
  ctx: AppContext,
  id: string,
  favorite: boolean,
  token: string
) {
  await ctx.api.post(
    "/api/Contact/MarkAsFavorite",
    {
      id,
      favorite,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
}

export async function deleteContact(
  ctx: AppContext,
  id: string,
  token: string
) {
  await ctx.api.post(
    "/api/Contact/DeleteOne",
    {
      id,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
}
