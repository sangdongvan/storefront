const { join } = require("path");
const MY_NAME = "react-router";
const BUILD_DIR = `.${MY_NAME}`;

/** @type {import('@react-router-run/dev/config').AppConfig} */
const REACT_ROUTER_OVERRIDES = {
  appDirectory: "./app",
  assetsBuildDirectory: `./public/${BUILD_DIR}/`,
  cacheDirectory: `${BUILD_DIR}/.cache/`,
  publicPath: `/_static/${BUILD_DIR}/`,
  serverBuildPath: `./${BUILD_DIR}/server/build.js`,
  serverBuildTarget: "arc",
};

const PLUGIN_DEFAULTS = {
  // Arc plugin-react-router defaults
  mount: "/*",
  appDirectory: REACT_ROUTER_OVERRIDES.appDirectory,
  buildDirectory: BUILD_DIR,
  serverDirectory: `${BUILD_DIR}/server`,
  serverHandler: join(__dirname, "server", "handler.js"),
};

module.exports = {
  MY_NAME,
  BUILD_DIR,
  PLUGIN_DEFAULTS,
  REACT_ROUTER_OVERRIDES,
};
