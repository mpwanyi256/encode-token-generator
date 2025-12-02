import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@types": path.resolve(__dirname, "./types"),
      "@core": path.resolve(__dirname, "./src/core"),
      "@repositories": path.resolve(__dirname, "./src/repositories"),
      "@services": path.resolve(__dirname, "./src/token"),
      "@api": path.resolve(__dirname, "./src/api"),
    },
  },
});

