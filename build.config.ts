import { build } from "esbuild";
import { dtsPlugin } from "esbuild-plugin-d.ts";


build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  outdir: "lib",
  tsconfig: "./tsconfig.json",
  sourcemap: "external",
  format: "esm",
  minify: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  minifyWhitespace: true,
  external: [
    "react",
  ],
  plugins: [
    dtsPlugin({
      outDir: "lib",
    }),
  ],
});
