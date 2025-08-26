import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.VITEBASE_PATH || "/Social-Media-App-Supabase",
  build: {
    outDir: 'dist'
  }
})
