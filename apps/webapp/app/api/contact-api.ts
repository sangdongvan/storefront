import type { z } from "zod";
import type { createApiClient, schemas } from "./api.gen";

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
////////////////////////////////////////////////////////////////////////////////

type Api = ReturnType<typeof createApiClient>;

export async function getContacts(
  api: Api,
  query: string | null,
  token: string
) {
  const findRes = await api.get("/api/Contact/Find", {
    ...(query === null ? {} : { queries: { Q: query } }),
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return findRes.contacts;
}

export async function createEmptyContact(api: Api, token: string) {
  const createEmptyRes = await api.post("/api/Contact/CreateEmpty", undefined, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return createEmptyRes;
}

export async function getContact(api: Api, id: string, token: string) {
  const findOneRes = await api.get("/api/Contact/FindOne", {
    queries: { Id: id },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return findOneRes;
}

type UpdateOneRequest = z.infer<typeof schemas.UpdateOneContactRequest>;
export async function updateContact(
  api: Api,
  request: UpdateOneRequest,
  token: string
) {
  const updateOneRes = await api.post("/api/Contact/UpdateOne", request, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!updateOneRes) {
    throw new Error(`No contact found for ${request.id}`);
  }
}

export async function markAsFavoriteContact(
  api: Api,
  id: string,
  favorite: boolean,
  token: string
) {
  await api.post(
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

export async function deleteContact(api: Api, id: string, token: string) {
  await api.post(
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
