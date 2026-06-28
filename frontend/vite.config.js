import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // This forces absolute asset paths to prevent 404 errors
  plugins: [react()],
})
