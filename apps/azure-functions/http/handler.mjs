import serverlessExpress from "@codegenie/serverless-express";
import app from "@storefront/webapp/build/server/index.js";

const cachedServerlessExpress = serverlessExpress({ app });

const handler = async function (context, req) {
  return cachedServerlessExpress(context, req);
};

export default handler;
