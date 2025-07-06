import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    {
      format: "esm",
      syntax: ["node 18"],
      dts: true,
      // bundle: false,
      banner: { js: "#!/usr/bin/env node" },
    },
  ],
});
