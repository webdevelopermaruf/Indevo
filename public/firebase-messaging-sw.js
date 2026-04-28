// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDNx46HmAWLDDIPTqzf2UPA56SVWQ1Gu-E",
    authDomain: "indevo-94d02.firebaseapp.com",
    projectId: "indevo-94d02",
    storageBucket: "indevo-94d02.firebasestorage.app",
    messagingSenderId: "545390617505",
    appId: "1:545390617505:web:bc11e52c5c7d6717f7e1e0"
});

const messaging = firebase.messaging();

// Handle messages received while the page is in the background or closed
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Background message received:', payload);

    const notificationTitle = payload.notification?.title || 'Notification';
    const notificationOptions = {
        body: payload.notification?.body || '',
        icon: '/icon.png', // change to your real icon path, or remove this line
        badge: '/badge.png', // optional, remove if you don't have one
        data: payload.data || {},
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const urlToOpen = event.notification.data?.FCM_MSG?.data?.route
        || event.notification.data?.route
        || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (const client of windowClients) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.navigate(urlToOpen);
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});