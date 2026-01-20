import swc from "unplugin-swc";
import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["**/*.e2e-spec.ts"],
		globals: true,
		setupFiles: ["./tests/setup-e2e.ts"],
		root: "./",
		globalSetup: ["./tests/global-setup"],
	},
	plugins: [tsConfigPaths(), swc.vite({ module: { type: "es6" } }), swc.rollup()],
});
