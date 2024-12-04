const { MY_NAME } = "plugin-express";

let watcher;

function setHttp({ inventory: { inv } }) {
  // ! keep this function fast
  const { _project } = inv;

  if (_project.arc[MY_NAME]) {
    return {
      method: "any",
      path: "/*",
      src: "./handler",
    };
  }
}

async function sandboxStart({ inventory: { inv } }) {
  const {
    _project: { arc },
  } = inv;

  if (arc[MY_NAME]) {
    console.log("Sandbox is starting React Router watch...");
  }
}

async function deployStart({ inventory: { inv } }) {
  const { _project } = inv;

  // Build ReactRouter client and server
  if (_project.arc[MY_NAME]) {
    console.log("Building React Router app for deployment...");
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
