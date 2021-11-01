import { defineConfig } from 'vite'
import { chromeExtension } from 'vite-plugin-chrome-extension'

export default defineConfig({
  build: {
    rollupOptions: {
      input: 'src/manifest.json'
    },
    minify: false,
    sourcemap: true
  },
  plugins: [chromeExtension()]
})
