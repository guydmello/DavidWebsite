import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative asset paths keep the build portable between the GitHub project URL
  // and the custom domain that will become its permanent home.
  base: './',
  plugins: [react()],
})
