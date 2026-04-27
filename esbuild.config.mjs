import { build } from "esbuild";

await build({
  entryPoints: ["src/server.ts"],
  outfile: "dist/index.js",
  bundle: true,
  platform: "node",
  target: "node22",
  format: "cjs",
  sourcemap: false,
  tsconfig: "tsconfig.json",
  alias: {
    "@": "./src",
  },
  external: ["pg-native"],
});
