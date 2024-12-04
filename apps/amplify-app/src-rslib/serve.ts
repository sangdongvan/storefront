// @ts-ignore
import express from "express";
import expressjsHandler from "@storefront/webapp/build/server";
import { StorefrontApi } from "./config";

// Default port of Amplify hosting
const port = 3000;

const app = express();
app.disable("x-powered-by");

app.set("Config.StorefrontApi", StorefrontApi);

app.use(expressjsHandler);

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
