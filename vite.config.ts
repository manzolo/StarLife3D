import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path for GitHub Pages project site: https://<user>.github.io/StarLife3D/
// Override with BASE_PATH env var (e.g. '/' for custom domains or local Docker).
const base = process.env.BASE_PATH ?? '/StarLife3D/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500,
  },
})
