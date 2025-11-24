import { resolve } from "path"
import dts from "vite-plugin-dts"
import { defineConfig } from "vitest/config"

// Define exclusion patterns once to adhere to the DRY principle.
const TEST_EXCLUDES = ["**/node_modules/**", "**/*.mock.ts"];

export default defineConfig({
  build: {
    // Ensure the output directory is cleaned before a new build starts.
    emptyOutDir: true, 
    
    // Configuration for building the library entry point.
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "CoreLib", // Renamed for clarity, often uses PascalCase.
      fileName: "core",
    },
    
    // Rollup options for fine-tuning the output bundle.
    rollupOptions: {
      output: {
        // Ensure CJS/ESM exports are correctly named for library consumers.
        exports: "named",
      },
    },
  },
  
  // Plugins for TypeScript definition file generation.
  plugins: [
    dts({
      entryRoot: resolve(__dirname, "src"),
      insertTypesEntry: true, // Generate a type entry file (e.g., index.d.ts)
    }),
  ],
  
  // Vitest configuration for unit testing.
  test: {
    environment: "happy-dom",
    // Use the shared exclusion list.
    exclude: TEST_EXCLUDES, 
    
    coverage: {
      // Use the shared exclusion list.
      exclude: TEST_EXCLUDES,
      reporter: ['text', 'json', 'html'], // Recommended for CI/CD environments
    },
    
    // Optional: Add basic setup file for environment globals if needed.
    // setupFiles: ['./vitest.setup.ts'],
  },
})
