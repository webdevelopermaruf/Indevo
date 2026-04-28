import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',

            strategies: 'generateSW',
            filename: 'pwa-sw.js', // 👈 different name from FCM's

            workbox: {
                // Don't try to handle the FCM service worker
                navigateFallbackDenylist: [/^\/firebase-messaging-sw\.js$/],
                // Don't precache the FCM SW either
                globIgnores: ['**/firebase-messaging-sw.js'],
            },

            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png'],

            manifest: {
                name: 'Indevo',
                short_name: 'Indevo',
                description: 'Independent Development Companion',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                display: 'standalone',
                start_url: '/',
                icons: [
                    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
                    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
                    { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
                ],
            },

            devOptions: {
                enabled: false, // 👈 disable PWA in dev — your FCM SW handles dev
            },
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
        extensions: ['.js', '.ts', '.vue', '.json'],
    },
})