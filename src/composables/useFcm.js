import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '@/services/firebase.service';
import axios from 'axios';
import api from "@/services/api.js";

export function useFcm() {
    /**
     * The whole flow: ask permission → get token → send to Laravel
     */
    async function registerForNotifications() {
        try {
            const messagingInstance = await messaging;
            if (!messagingInstance) {
                console.warn('FCM not supported in this browser');
                return null;
            }

            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                console.warn('Notification permission denied');
                return null;
            }

            // 3. Register the service worker
            const swRegistration = await navigator.serviceWorker.register(
                '/firebase-messaging-sw.js'
            );

            // 👇 NEW: wait for it to actually become active
            await navigator.serviceWorker.ready;

            // 4. Now safe to ask FCM for a token
            const token = await getToken(messagingInstance, {
                vapidKey: "BOnTv_gC-rjO8_7upM3NLKD1O0RLHjAh2fHmlk51bR2-V2BWEMF2wg7jHp4lpl87-qsHcGI4qThQndCMLUYYn_U",
                serviceWorkerRegistration: swRegistration,
            });

            if (!token) {
                console.warn('No FCM token received');
                return null;
            }

            console.log('✅ FCM token:', token);

            await api.post('/user/device-tokens', {
                token,
                platform: 'web',
            });

            return token;
        } catch (error) {
            console.error('❌ Error registering for notifications:', error);
            return null;
        }
    }

    /**
     * Listen for messages while the app is OPEN and FOCUSED.
     * (Background messages are handled by the service worker.)
     */
    async function listenForMessages() {
        const messagingInstance = await messaging;
        if (!messagingInstance) return;

        onMessage(messagingInstance, (payload) => {
            console.log('📨 Foreground message:', payload);

            // Manually show a system notification via the service worker
            if (Notification.permission === 'granted') {
                navigator.serviceWorker.ready.then((registration) => {
                    registration.showNotification(
                        payload.notification?.title || 'Notification',
                        {
                            body: payload.notification?.body || '',
                            icon: '/icon-192.png', // optional
                            data: payload.data || {}, // available on click
                        }
                    );
                });
            }
        });
    }

    return {
        registerForNotifications,
        listenForMessages,
    };
}