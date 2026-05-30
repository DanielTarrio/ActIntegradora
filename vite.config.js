import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'server-time-api',
      configureServer(server) {
        server.middlewares.use('/api/time', (req, res) => {
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
          const now = new Date()
          const tz = process.env.TZ || Intl.DateTimeFormat().resolvedOptions().timeZone
          res.end(JSON.stringify({
            time: now.toISOString(),
            timezone: tz
          }))
        })
      },
      configurePreviewServer(server) {
        server.middlewares.use('/api/time', (req, res) => {
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
          const now = new Date()
          const tz = process.env.TZ || Intl.DateTimeFormat().resolvedOptions().timeZone
          res.end(JSON.stringify({
            time: now.toISOString(),
            timezone: tz
          }))
        })
      }
    }
  ],
})

