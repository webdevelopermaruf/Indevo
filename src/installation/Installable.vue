<template>
  <Transition name="toast">
    <!-- Standard install toast (Chrome, Edge, Android) -->
    <div v-if="show" class="install-prompt">
      <div class="install-card">
        <div class="install-icon">
          <img src="/icon-192.png" alt="Indevo" />
        </div>
        <div class="install-content">
          <p class="install-title">Install Indevo</p>
          <p class="install-sub">Get the native app experience.</p>
          <button class="btn-primary" @click="handleInstall" :disabled="installing">
            {{ installing ? 'Installing…' : 'Install App' }}
          </button>
        </div>
        <button class="close-btn" aria-label="Dismiss" @click="dismiss">✕</button>
      </div>
    </div>
  </Transition>

  <!-- iOS toast (Safari users) -->
  <Transition name="toast">
    <div v-if="showIOS" class="install-prompt">
      <div class="install-card">
        <div class="install-icon">
          <img src="/icon-192.png" alt="InDevo" />
        </div>
        <div class="install-content">
          <p class="install-title">Install InDevo</p>
          <p class="install-sub">Tap <strong>Share</strong> → <strong>Add to Home Screen</strong></p>
        </div>
        <button class="close-btn" aria-label="Dismiss" @click="dismissIOS">✕</button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { usePwaInstall } from '@/composables/usePwaInstall';

const { canInstall, showIOSInstructions, install } = usePwaInstall();

const dismissed = ref(false);
const dismissedIOS = ref(false);
const installing = ref(false);

const STORAGE_KEY = 'pwa-install-dismissed-at';
const STORAGE_KEY_IOS = 'pwa-install-ios-dismissed-at';
const REMIND_AFTER_DAYS = 1;

const show = computed(() => canInstall.value && !dismissed.value);
const showIOS = computed(() => showIOSInstructions.value && !dismissedIOS.value);

onMounted(() => {
  const lastDismissed = localStorage.getItem(STORAGE_KEY);
  if (lastDismissed) {
    const daysSince = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24);
    if (daysSince < REMIND_AFTER_DAYS) dismissed.value = true;
  }

  const lastDismissedIOS = localStorage.getItem(STORAGE_KEY_IOS);
  if (lastDismissedIOS) {
    const daysSince = (Date.now() - parseInt(lastDismissedIOS)) / (1000 * 60 * 60 * 24);
    if (daysSince < REMIND_AFTER_DAYS) dismissedIOS.value = true;
  }
});

function dismiss() {
  dismissed.value = true;
  localStorage.setItem(STORAGE_KEY, Date.now().toString());
}

function dismissIOS() {
  dismissedIOS.value = true;
  localStorage.setItem(STORAGE_KEY_IOS, Date.now().toString());
}

async function handleInstall() {
  installing.value = true;
  const result = await install();
  installing.value = false;
  if (result === 'dismissed') dismiss();
}
</script>

<style scoped>
.install-prompt {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 9999;
  max-width: 360px;
  font-family: var(--indevo-font-family);
  width: calc(100% - 32px);
}

.install-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.install-icon img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: block;
}

.install-content {
  flex: 1;
  min-width: 0;
}

.install-title {
  margin: 0 0 2px;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  line-height: 1.3;
}

.install-sub {
  margin: 0 0 10px;
  font-size: 12.5px;
  color: #6b7280;
  line-height: 1.4;
}

.install-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease;
}

.install-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.install-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.close-btn {
  position: absolute;
  top: 6px;
  right: 8px;
  background: transparent;
  border: none;
  font-size: 14px;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
}

.close-btn:hover {
  color: #4b5563;
}

/* Slide-in toast animation */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* On smaller screens, span full width at the bottom */
@media (max-width: 480px) {
  .install-prompt {
    bottom: 12px;
    left: 12px;
    right: 12px;
    max-width: none;
    width: auto;
  }
}
</style>