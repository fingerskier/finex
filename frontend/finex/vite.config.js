import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: '../dist', // Output outside frontend/ into dist/
    emptyOutDir: true
  },
  server: {
    port: 5173
  }
})
