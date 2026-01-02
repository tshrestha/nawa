import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/nawa',
    server: {
        port: 3000
    },
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ['import', 'if-function', 'global-builtin', 'color-functions']
            }
        }
    }
})
