import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mkcert from 'vite-plugin-mkcert'


// Where the dev proxy sends /api and /auth.
//
// HTTPS by default, because that is what `npm run dev` in backend/ starts —
// uvicorn with the same mkcert pair vite-plugin-mkcert trusts. Override with
// DIFAAC_API_TARGET when the backend is running plain HTTP.
const apiTarget = process.env.DIFAAC_API_TARGET ?? 'https://localhost:8000'

// A proxy with no backend behind it returns a bare 500 and says nothing about
// why, which is a confusing way to discover that the API is simply not
// running. This turns that into a sentence naming the target and the command
// that starts it.
const apiProxy = {
  target: apiTarget,
  changeOrigin: false,
  // Applies to Vite's own connection to the backend, not the browser's
  // connection to Vite. Vite is what accepts the backend's certificate, over
  // loopback.
  secure: false,
  configure: (proxy: { on: (event: string, cb: (err: Error & { code?: string }) => void) => void }) => {
    let warned = false
    proxy.on('error', (err) => {
      if (warned) return
      warned = true
      const reason =
        err.code === 'ECONNREFUSED'
          ? 'nothing is listening there'
          : err.code === 'EPROTO' || err.code === 'ECONNRESET'
            ? 'it answered, but not over HTTPS — start it with TLS, or set DIFAAC_API_TARGET=http://localhost:8000'
            : err.message
      console.error(
        [
          '',
          `  The API proxy could not reach ${apiTarget}: ${reason}.`,
          '  Start the backend with:  npm run dev --prefix backend',
          '',
        ].join('\n'),
      )
    })
  },
}

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
      '/api': apiProxy,
      '/auth': apiProxy,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
