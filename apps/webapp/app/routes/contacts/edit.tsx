import { redirect } from "react-router";
import { Form, useNavigate } from "react-router";
import invariant from "tiny-invariant";
import type { Route } from "./+types/edit";

import { authApi, contactApi } from "~/api";
import { schemas } from "~/api/api.gen";

export const action = async ({ context, request }: Route.ActionArgs) => {
  const { accessToken: token, error } = await authApi.authenticateOrError(
    context,
    request
  );
  if (error) {
    return Response.json({}, { status: 401 });
  }

  // TODO: Handle validation error
  const formPayload = Object.fromEntries(await request.formData());
  const updateOneRequest = await schemas.UpdateOneContactRequest.parseAsync(
    formPayload
  );

  await contactApi.updateContact(context, updateOneRequest, token);

  return redirect(`/contacts/${updateOneRequest.id}`);
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

export default function EditContact({ loaderData }: Route.ComponentProps) {
  const { contact } = loaderData;
  const navigate = useNavigate();

  return (
    <Form id="contact-form" method="post">
      <p>
        <span>Name</span>
        <input
          defaultValue={contact.firstName}
          aria-label="First name"
          name="firstName"
          type="text"
          placeholder="First name"
        />
        <input
          aria-label="Last name"
          defaultValue={contact.lastName}
          name="lastName"
          placeholder="Last name"
          type="text"
        />
      </p>
      <input type="hidden" name="id" value={contact.id} />
      <label>
        <span>Twitter</span>
        <input
          defaultValue={contact.twitter}
          name="twitter"
          placeholder="@jack"
          type="text"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={contact.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea defaultValue={contact.notes} name="notes" rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button onClick={() => navigate(-1)} type="button">
          Cancel
        </button>
      </p>
    </Form>
  );
}
