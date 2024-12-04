const { createRequestHandler } = import("@react-router/architect");

exports.handler = createRequestHandler({
  // @ts-expect-error - virtual module provided by React Router at build time
  build: import("./build"),
  mode: process.env.NODE_ENV || "development",
});
