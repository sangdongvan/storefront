const reactRouterCommands = require("@react-router/dev/cli/commands");

const config = JSON.parse(process.argv[2]);
const mode = process.argv[3];

reactRouterCommands.watch(config, mode, {
  onInitialBuild() {
    console.log("Initial React Router build complete.");
  },
});
