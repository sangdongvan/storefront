const { copyFileSync, existsSync, mkdirSync, rmSync } = require("fs");
const { join } = require("path");
const {
  BUILD_DIR,
  MY_NAME,
  PLUGIN_DEFAULTS,
  REACT_ROUTER_OVERRIDES,
} = require("./constants");

// ! Use of React Router internals. API not guaranteed:
const reactRouterConfig = require("@react-router/dev/config");

/**
 * Merge defaults and plugin options to create plugin and "initial" React Router config
 * @param {*} project
 * @returns { { pluginConfig: object, initialReactRouterConfig: object } }
 */
function createPluginConfigs(project) {
  const { arc, cwd } = project;
  const initialReactRouterConfig = { ...REACT_ROUTER_OVERRIDES };
  const pluginConfig = { ...PLUGIN_DEFAULTS };

  // look at @react-router plugin options:
  for (const option of arc[MY_NAME]) {
    if (Array.isArray(option)) {
      const name = option[0];
      const value = option[1];

      if (name === "app-directory") {
        pluginConfig.appDirectory = value;
        initialReactRouterConfig.appDirectory = value;
      } else if (name === "mount") {
        pluginConfig.mount = value;
      } else if (name === "server-handler") {
        pluginConfig.serverHandler = value;
      } else if (name === "build-directory") {
        pluginConfig.buildDirectory = value;
        pluginConfig.serverDirectory = `${value}/server`;

        for (const key in initialReactRouterConfig) {
          initialReactRouterConfig[key] = initialReactRouterConfig[key].replace(
            BUILD_DIR,
            value
          );
        }
      }
    }
  }

  // patch to be a full file path
  initialReactRouterConfig.serverBuildPath = join(
    cwd,
    initialReactRouterConfig.serverBuildPath
  );

  return { pluginConfig, initialReactRouterConfig };
}

/**
 * Create Arc handler for React Router server
 * @param {*} inv
 * @param {object} options
 * @returns {void}
 */
function createServerHandler(inv, options = {}) {
  const { skipHandler = false } = options;
  const { pluginConfig } = createPluginConfigs(inv._project);

  if (!existsSync(pluginConfig.serverDirectory))
    mkdirSync(pluginConfig.serverDirectory, { recursive: true });

  if (skipHandler) return;

  copyFileSync(
    pluginConfig.serverHandler,
    join(pluginConfig.serverDirectory, "index.js")
  );
}

/**
 * Generate full React Router config
 * @param {*} inv
 * @returns {Promise<reactRouterConfig.ReactRouterConfig>}
 */
async function createFinalReactRouterConfig(inv) {
  const { _project } = inv;

  const existingConfig = await reactRouterConfig.loadConfig({ rootDirectory: _project.cwd });
  const { initialReactRouterConfig } = createPluginConfigs(_project);

  return {
    ...existingConfig,
    ...initialReactRouterConfig, // overwrite build directories
  };
}

/**
 * Removes React Router build artifacts
 * @param {*} inv
 * @returns {void}
 */
function cleanup(inv) {
  const { initialReactRouterConfig, pluginConfig } = createPluginConfigs(
    inv._project
  );

  console.log("Sandbox is cleaning up local React Router artifacts...");

  rmSync(initialReactRouterConfig.assetsBuildDirectory, {
    recursive: true,
    force: true,
  });
  rmSync(pluginConfig.buildDirectory, { recursive: true, force: true });
}

module.exports = {
  cleanup,
  createFinalReactRouterConfig,
  createPluginConfigs,
  createServerHandler,
};
