// src/services/firebase.service.js
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as analyticsSupported } from "firebase/analytics";
import { getMessaging, isSupported as messagingSupported, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDNx46HmAWLDDIPTqzf2UPA56SVWQ1Gu-E",
    authDomain: "indevo-94d02.firebaseapp.com",
    projectId: "indevo-94d02",
    storageBucket: "indevo-94d02.firebasestorage.app",
    messagingSenderId: "545390617505",
    appId: "1:545390617505:web:bc11e52c5c7d6717f7e1e0",
    measurementId: "G-7SNQ028BQK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Analytics only works in browser, so guard it
export const analytics = (async () => {
    if (await analyticsSupported()) {
        return getAnalytics(app);
    }
    return null;
})();

// Messaging instance for FCM
export const messaging = (async () => {
    if (await messagingSupported()) {
        const messagingInstance = getMessaging(app);

        // Handle messages received while the app/tab is in the FOREGROUND.
        // Background messages are handled by public/firebase-messaging-sw.js
        onMessage(messagingInstance, (payload) => {
            console.log('[firebase.service.js] Foreground message received:', payload);

            // The browser does NOT auto-show notifications when the tab is focused.
            // We must manually trigger one. (Or replace this with an in-app toast.)
            if (Notification.permission === 'granted') {
                const title = payload.notification?.title || 'Notification';
                const options = {
                    body: payload.notification?.body || '',
                    icon: '/icon.png', // change or remove if you don't have one
                    data: payload.data || {},
                };

                // Use the service worker's showNotification if registered,
                // so clicks are handled by your existing notificationclick listener.
                navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js')
                    .then((registration) => {
                        if (registration) {
                            registration.showNotification(title, options);
                        } else {
                            // Fallback: plain Notification API
                            new Notification(title, options);
                        }
                    })
                    .catch(() => {
                        new Notification(title, options);
                    });
            }
        });

        return messagingInstance;
    }
    return null;
})();