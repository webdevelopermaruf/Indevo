import { ref, computed, onMounted } from 'vue';

// ─────────────────────────────────────────────
// Module-level state — shared across all components
// that import this composable.
// ─────────────────────────────────────────────
const installPrompt = ref(null);
const isInstalled = ref(false);
const isStandalone = ref(false);
const isIOS = ref(false);

let listenersRegistered = false;

// ─────────────────────────────────────────────
// Set up listeners ONCE, as soon as the module loads.
// (Otherwise we might miss the beforeinstallprompt event
// if the user navigates around before mounting the popup.)
// ─────────────────────────────────────────────
if (typeof window !== 'undefined' && !listenersRegistered) {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        installPrompt.value = e;
        console.log('✅ PWA install prompt available');
    });

    window.addEventListener('appinstalled', () => {
        installPrompt.value = null;
        isInstalled.value = true;
        isStandalone.value = true;
        console.log('✅ PWA installed');
    });

    listenersRegistered = true;
}

export function usePwaInstall() {
    // Whether we can show the standard install button
    const canInstall = computed(
        () => installPrompt.value !== null && !isInstalled.value
    );

    // iOS users can install but never get beforeinstallprompt
    const showIOSInstructions = computed(
        () => isIOS.value && !isStandalone.value
    );

    function detectStandalone() {
        // Standard check — works on Chrome, Edge, Android
        if (window.matchMedia('(display-mode: standalone)').matches) {
            isStandalone.value = true;
            isInstalled.value = true;
        }
        // iOS-specific check
        if (window.navigator.standalone === true) {
            isStandalone.value = true;
            isInstalled.value = true;
        }
    }

    function detectIOS() {
        const ua = window.navigator.userAgent.toLowerCase();
        isIOS.value = /iphone|ipad|ipod/.test(ua);
    }

    /**
     * Trigger the native install prompt.
     * Returns: 'accepted' | 'dismissed' | 'unavailable'
     */
    async function install() {
        if (!installPrompt.value) {
            console.warn('Install prompt not available');
            return 'unavailable';
        }

        installPrompt.value.prompt();
        const { outcome } = await installPrompt.value.userChoice;

        // The event is single-use; clear it
        installPrompt.value = null;

        console.log(`Install prompt result: ${outcome}`);
        return outcome; // 'accepted' or 'dismissed'
    }

    onMounted(() => {
        detectStandalone();
        detectIOS();
    });

    return {
        canInstall,
        isInstalled,
        isStandalone,
        isIOS,
        showIOSInstructions,
        install,
    };
}