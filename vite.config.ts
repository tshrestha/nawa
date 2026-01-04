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
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        // React core - frequently cached, loaded on every page
                        if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/react-router/')) {
                            return 'vendor-react'
                        }
                        // Mapbox - large library, only needed on map page
                        if (id.includes('/maplibre-gl/')) {
                            return 'vendor-maplibre'
                        }
                        // UI framework
                        if (id.includes('/bootstrap/') || id.includes('/bootstrap-icons/')) {
                            return 'vendor-ui'
                        }
                        // Utility libraries
                        if (id.includes('/lodash-es/') || id.includes('/fuse.js/')) {
                            return 'vendor-utils'
                        }
                    }
                }
            }
        }
    }
})
