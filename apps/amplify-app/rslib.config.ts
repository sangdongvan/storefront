import { defineConfig } from "@rslib/core";

export default defineConfig({
  source: {
    entry: {
      serve: "./src-rslib/serve.ts",
    },
  },
  lib: [
    {
      format: "esm",
      syntax: "es2021",
    },
  ],
});
