import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api/rest": {
                target: "https:/lasting-parrot-91.hasura.app/",
                changeOrigin: true,
                secure: true,
            },
        },
    },
})