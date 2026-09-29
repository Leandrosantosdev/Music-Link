import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    {
      name: 'csp-dev-compat',
      transformIndexHtml(html) {
        // Em desenvolvimento, o plugin React injeta scripts inline (preamble/HMR),
        // que seriam bloqueados por script-src 'self'. Relaxamos o CSP SOMENTE em dev.
        // Em produção (build/preview) o CSP permanece estrito.
        if (mode === 'development') {
          return html.replace(
            "script-src 'self' https://www.googletagmanager.com https://*.googletagmanager.com https://www.clarity.ms;",
            "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.googletagmanager.com https://www.clarity.ms;",
          )
        }
        return html
      },
    },
  ],
}))
