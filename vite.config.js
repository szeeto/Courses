import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // don't hard-include babel helper paths; let deps resolve normally
    include: [],
    // exclude popper from pre-bundling if it causes resolution issues
    exclude: ['@popperjs/core']
  }
})