import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'es2020'
  },
  plugins: [react()],
  optimizeDeps: { esbuildOptions: { target: 'es2020' } }
})
