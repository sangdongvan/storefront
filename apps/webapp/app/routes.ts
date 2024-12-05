import {
  type RouteConfig,
  index,
  layout,
  prefix,
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
  route("api/get-access-token", "./routes/api/get-access-token.server.ts"),
  route("api/get-app-config", "./routes/api/get-app-config.server.ts"),
] satisfies RouteConfig;
