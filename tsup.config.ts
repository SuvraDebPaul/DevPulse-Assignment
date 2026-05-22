import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"], // adjust entry point if needed
  outDir: "dist",
  format: ["esm", "cjs"], // build both ESM and CommonJS for compatibility
  sourcemap: true, // matches tsconfig sourceMap
  dts: true, // generate .d.ts files
  clean: true, // clear dist before build
  target: "esnext", // aligns with tsconfig target
  minify: false, // keep readable output for backend
  skipNodeModulesBundle: true, // don’t bundle node_modules
  splitting: false, // disable code splitting for backend simplicity
  shims: false, // no browser shims
});
