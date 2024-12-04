import { Form, useFetcher } from "react-router";
import invariant from "tiny-invariant";

import { authApi, contactApi } from "~/api";
import { Route } from "./+types/view";

export const action = async ({
  context,
  params,
  request,
}: Route.ActionArgs) => {
  invariant(params.id, "Missing id param");
  const { accessToken } = await authApi.authenticateOrGoLogin(context, request);
  const formData = await request.formData();
  await contactApi.markAsFavoriteContact(
    context,
    params.id,
    formData.get("favorite") === "true",
    accessToken
  );
  return {};
};

export const loader = async ({
  context,
  request,
  params,
}: Route.LoaderArgs) => {
  invariant(params.id, "Missing id param");
  const { accessToken } = await authApi.authenticateOrGoLogin(context, request);
  const contact = await contactApi.getContact(context, params.id, accessToken);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return { contact };
};

export default function Contact({ loaderData }: Route.ComponentProps) {
  const { contact } = loaderData;

  return (
    <div id="contact">
      <div>
        <img
          alt={`${contact.firstName} ${contact.lastName} avatar`}
          key={contact.avatar}
          src={contact.avatar}
        />
      </div>

      <div>
        <h1>
          {contact.firstName || contact.lastName ? (
            <>
              {contact.firstName} {contact.lastName}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite favorite={contact.favorite} />
        </h1>

        {contact.twitter ? (
          <p>
            <a href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        ) : null}

        {contact.notes ? <p>{contact.notes}</p> : null}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ favorite }: { favorite: boolean }) {
  const fetcher = useFetcher();
  const effectiveFavorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : favorite;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={
          effectiveFavorite ? "Remove from favorites" : "Add to favorites"
        }
        name="favorite"
        value={effectiveFavorite ? "false" : "true"}
      >
        {effectiveFavorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
