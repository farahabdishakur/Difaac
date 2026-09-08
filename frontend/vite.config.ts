import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  plugins: [react(), tailwindcss(), mkcert()],
  server: {
    open: true,
    // The API is proxied rather than called directly, which is the same shape
    // the Caddyfile gives production: /api and /auth go to the backend, and
    // everything the browser sees comes from one origin.
    //
    // Without this the browser has to trust two certificates — Vite's, which
    // vite-plugin-mkcert installs, and the backend's, which nothing installs.
    // It rejects the second with ERR_CERT_AUTHORITY_INVALID, and because that
    // happens at the TLS layer the request never reaches the backend at all:
    // sign-in fails with no error in the server log to explain it.
    //
    // `secure: false` applies to Vite's own connection to the backend, not to
    // the browser's connection to Vite. Vite is what accepts the backend's
    // self-signed certificate, over loopback.
    proxy: {
      '/api': { target: 'https://localhost:8000', changeOrigin: false, secure: false },
      '/auth': { target: 'https://localhost:8000', changeOrigin: false, secure: false },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
