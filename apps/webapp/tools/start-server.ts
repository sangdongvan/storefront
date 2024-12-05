import express from "express";
// @ts-ignore
import compression from "compression";

import { StorefrontApi } from "../config";
// @ts-ignore
import expressjsHandler from "../build/server";

const PORT = Number.parseInt(process.env.PORT || "3001");

const app = express();
app.disable("x-powered-by");

app.set("Config.StorefrontApi", StorefrontApi);

app.use(compression());
app.use(express.static("./build/client"));
app.use(expressjsHandler);

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
