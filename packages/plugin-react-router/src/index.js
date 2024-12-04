const { fork } = require("child_process");
const { join } = require("path");
const { MY_NAME } = require("./constants");
const {
  createServerHandler,
  createFinalReactRouterConfig,
  createPluginConfigs,
} = require("./util");


let watcher;

function setHttp({ inventory: { inv } }) {
  // ! keep this function fast
  const { _project } = inv;

  if (_project.arc[MY_NAME]) {
    const { pluginConfig } = createPluginConfigs(_project);

    return {
      method: "any",
      path: pluginConfig.mount,
      src: pluginConfig.serverDirectory,
    };
  }
}

async function sandboxStart({ inventory: { inv } }) {
  const {
    _project: { arc },
  } = inv;

  if (arc[MY_NAME]) {
    console.log("Sandbox is starting React Router watch...");

    const config = await createFinalReactRouterConfig(inv);

    createServerHandler(inv);
    watcher = fork(join(__dirname, "watcher.js"), [
      JSON.stringify(config),
      "development",
    ]);
  }
}

async function deployStart({ inventory: { inv } }) {
  const { _project } = inv;

  // Build ReactRouter client and server
  if (_project.arc[MY_NAME]) {
    console.log("Building React Router app for deployment...");

    const config = await createFinalReactRouterConfig(inv);

    createServerHandler(inv);
    await build({ config, mode: "production" });
  }
}

module.exports = {
  set: {
    http: setHttp,
  },
  deploy: {
    start: deployStart,
  },
  sandbox: {
    start: sandboxStart,
    async end() {
      if (watcher) watcher.kill();
    },
  },
};
