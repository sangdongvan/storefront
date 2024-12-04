import {
  type RouteConfig,
  index,
  route,
} from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),
  route("login", "./routes/login.tsx"),
  route("contacts", "./routes/contacts/layout.tsx", [
    index("./routes/contacts/list.tsx"),
    route(":id", "./routes/contacts/view.tsx"),
    route(":id/edit", "./routes/contacts/edit.tsx"),
    route(":id/destroy", "./routes/contacts/destroy.tsx"),
  ]),
  route("api/get-access-token", "./routes/api/get-access-token.tsx"),
] satisfies RouteConfig;
