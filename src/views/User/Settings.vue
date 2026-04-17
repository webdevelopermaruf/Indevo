<template>
  <div class="settings-page" :class="{ dark: darkMode }">

    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Settings</h1>
    </div>

    <div class="page-body">

      <!-- ── Profile ───────────────────────────────────────── -->
      <div class="section-label">PROFILE</div>
      <div class="card">
        <div class="profile-row">
          <div class="avatar-wrap">
            <div class="avatar">{{ initials }}</div>
            <button class="avatar-edit" @click="triggerAvatarUpload">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <input ref="avatarInput" type="file" accept="image/*" class="hidden-input" />
          </div>
          <div class="profile-info">
            <span class="profile-name">{{ profile.name }}</span>
            <span class="profile-email">{{ profile.email }}</span>
          </div>
        </div>
        <div class="divider" />
        <div class="setting-row" @click="openEdit('name')">
          <div class="setting-left">
            <div class="setting-icon" style="background:#e8f5e9">👤</div>
            <span class="setting-label">Full Name</span>
          </div>
          <div class="setting-right">
            <span class="setting-value">{{ profile.name }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>
        <div class="setting-row" @click="openEdit('email')">
          <div class="setting-left">
            <div class="setting-icon" style="background:#e3f2fd">✉️</div>
            <span class="setting-label">Email</span>
          </div>
          <div class="setting-right">
            <span class="setting-value">{{ profile.email }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>
        <div class="setting-row" @click="openEdit('password')">
          <div class="setting-left">
            <div class="setting-icon" style="background:#fff8e1">🔒</div>
            <span class="setting-label">Change Password</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
        <div class="setting-row danger" @click="handleLogout">
          <div class="setting-left">
            <div class="setting-icon" style="background:#fee2e2">🚪</div>
            <span class="setting-label danger-text">Log Out</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>

      <!-- ── Preferences ────────────────────────────────────── -->
      <div class="section-label">PREFERENCES</div>
      <div class="card">
        <div class="setting-row">
          <div class="setting-left">
            <div class="setting-icon" style="background:#f0fdf4">💱</div>
            <span class="setting-label">Currency</span>
          </div>
          <div class="setting-right">
            <div class="select-wrap">
              <select v-model="prefs.currency" class="inline-select">
                <option value="GBP">£ GBP</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="NGN">₦ NGN</option>
                <option value="INR">₹ INR</option>
              </select>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </div>
        <div class="setting-row">
          <div class="setting-left">
            <div class="setting-icon" style="background:#f3e8ff">🌍</div>
            <span class="setting-label">Language</span>
          </div>
          <div class="setting-right">
            <div class="select-wrap">
              <select v-model="prefs.language" class="inline-select">
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
                <option value="ar">العربية</option>
              </select>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </div>
        <div class="setting-row">
          <div class="setting-left">
            <div class="setting-icon" style="background:#1a1a2e">🌙</div>
            <span class="setting-label">Dark Mode</span>
          </div>
          <div class="toggle-wrap" @click="themeStore.toggleDark()">
            <div class="toggle" :class="{ on: darkMode }">
              <div class="toggle-knob"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Notifications ──────────────────────────────────── -->
      <div class="section-label">NOTIFICATIONS</div>
      <div class="card">
        <div class="setting-row">
          <div class="setting-left">
            <div class="setting-icon" style="background:#fff8e1">🔔</div>
            <span class="setting-label">Push Notifications</span>
          </div>
          <div class="toggle-wrap" @click="notifs.push = !notifs.push">
            <div class="toggle" :class="{ on: notifs.push }"><div class="toggle-knob"></div></div>
          </div>
        </div>
        <div class="setting-row">
          <div class="setting-left">
            <div class="setting-icon" style="background:#e8f5e9">⏰</div>
            <span class="setting-label">Reminder Alerts</span>
          </div>
          <div class="toggle-wrap" @click="notifs.reminders = !notifs.reminders">
            <div class="toggle" :class="{ on: notifs.reminders }"><div class="toggle-knob"></div></div>
          </div>
        </div>
        <div class="setting-row">
          <div class="setting-left">
            <div class="setting-icon" style="background:#f3e8ff">🎯</div>
            <span class="setting-label">Goal Deadline Alerts</span>
          </div>
          <div class="toggle-wrap" @click="notifs.goals = !notifs.goals">
            <div class="toggle" :class="{ on: notifs.goals }"><div class="toggle-knob"></div></div>
          </div>
        </div>
      </div>

      <!-- ── Privacy & Security ─────────────────────────────── -->
      <div class="section-label">PRIVACY & SECURITY</div>
      <div class="card">
        <div class="setting-row">
          <div class="setting-left">
            <div class="setting-icon" style="background:#e3f2fd">🔐</div>
            <span class="setting-label">PIN Lock</span>
          </div>
          <div class="toggle-wrap" @click="security.pin = !security.pin">
            <div class="toggle" :class="{ on: security.pin }"><div class="toggle-knob"></div></div>
          </div>
        </div>
        <div class="setting-row" @click="handleExport">
          <div class="setting-left">
            <div class="setting-icon" style="background:#e8f5e9">📤</div>
            <span class="setting-label">Export My Data</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
        <div class="setting-row danger" @click="confirmDelete = true">
          <div class="setting-left">
            <div class="setting-icon" style="background:#fee2e2">🗑</div>
            <span class="setting-label danger-text">Delete Account</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>

      <!-- ── About ──────────────────────────────────────────── -->
      <div class="section-label">ABOUT</div>
      <div class="card">
        <div class="setting-row">
          <div class="setting-left">
            <div class="setting-icon" style="background:#f0fdf4">📱</div>
            <span class="setting-label">App Version</span>
          </div>
          <span class="setting-value">v1.0.0</span>
        </div>
        <div class="setting-row" @click="openLink('terms')">
          <div class="setting-left">
            <div class="setting-icon" style="background:#fff8e1">📄</div>
            <span class="setting-label">Terms of Service</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
        <div class="setting-row" @click="openLink('privacy')">
          <div class="setting-left">
            <div class="setting-icon" style="background:#e3f2fd">🔏</div>
            <span class="setting-label">Privacy Policy</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
        <div class="setting-row" @click="openLink('rate')">
          <div class="setting-left">
            <div class="setting-icon" style="background:#fff8e1">⭐</div>
            <span class="setting-label">Rate the App</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>

      <!-- ── Logo Footer ────────────────────────────────────── -->
      <div class="brand-footer">
        <img src="../../assets/indevo-logo.png" alt="InDevo" class="brand-logo" />
      </div>

    </div>

    <!-- ── Edit Bottom Sheet ───────────────────────────────── -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="editSheet.open" class="sheet-overlay" @click.self="editSheet.open = false"></div>
      </Transition>
      <Transition name="slide-up">
        <div v-if="editSheet.open" class="bottom-sheet">
          <div class="drawer-handle"></div>
          <div class="drawer-header">
            <h2 class="drawer-title">{{ editSheet.title }}</h2>
          </div>
          <div class="drawer-body">
            <template v-if="editSheet.field === 'name'">
              <div class="field-group">
                <label class="field-label">FULL NAME</label>
                <div class="input-box">
                  <span>👤</span>
                  <input v-model="editSheet.value" class="text-input" placeholder="Your full name" />
                </div>
              </div>
            </template>
            <template v-if="editSheet.field === 'email'">
              <div class="field-group">
                <label class="field-label">EMAIL ADDRESS</label>
                <div class="input-box">
                  <span>✉️</span>
                  <input v-model="editSheet.value" type="email" class="text-input" placeholder="your@email.com" />
                </div>
              </div>
            </template>
            <template v-if="editSheet.field === 'password'">
              <div class="field-group">
                <label class="field-label">CURRENT PASSWORD</label>
                <div class="input-box">
                  <span>🔒</span>
                  <input v-model="editSheet.current" type="password" class="text-input" placeholder="Enter current password" />
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">NEW PASSWORD</label>
                <div class="input-box">
                  <span>🔑</span>
                  <input v-model="editSheet.value" type="password" class="text-input" placeholder="Enter new password" />
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">CONFIRM NEW PASSWORD</label>
                <div class="input-box">
                  <span>🔑</span>
                  <input v-model="editSheet.confirm" type="password" class="text-input" placeholder="Repeat new password" />
                </div>
              </div>
            </template>
            <button class="save-btn" @click="saveEdit">Save Changes</button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── Delete Confirm Modal ───────────────────────────── -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="confirmDelete" class="modal-overlay" @click.self="confirmDelete = false">
          <div class="modal-card">
            <div class="modal-icon">⚠️</div>
            <h3 class="modal-title">Delete Account?</h3>
            <p class="modal-sub">This will permanently delete your account and all your data. This action cannot be undone.</p>
            <div class="modal-actions">
              <button class="modal-cancel" @click="confirmDelete = false">Cancel</button>
              <button class="modal-confirm" @click="handleDelete">Delete</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThemeStore } from '@/stores/theme.store.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const themeStore = useThemeStore()

const profile = ref({ name: 'Alex Johnson', email: 'alex@example.com' })
const initials = computed(() => profile.value.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2))
const avatarInput = ref(null)
function triggerAvatarUpload() { avatarInput.value?.click() }

const prefs = ref({ currency: 'GBP', language: 'en' })
const darkMode = computed({ get: () => themeStore.darkMode, set: () => themeStore.toggleDark() })
const notifs = ref({ push: true, reminders: true, goals: true })
const security = ref({ pin: false })

function handleExport() { alert('Your data export will be emailed to ' + profile.value.email) }

const confirmDelete = ref(false)
function handleDelete() { confirmDelete.value = false; router.push('/login') }
function handleLogout() { router.push('/login') }

const editSheet = ref({ open: false, field: '', title: '', value: '', current: '', confirm: '' })

function openEdit(field) {
  editSheet.value = { open: true, field, title: field === 'name' ? 'Edit Name' : field === 'email' ? 'Edit Email' : 'Change Password', value: field === 'name' ? profile.value.name : field === 'email' ? profile.value.email : '', current: '', confirm: '' }
}

function saveEdit() {
  if (editSheet.value.field === 'name') profile.value.name = editSheet.value.value
  else if (editSheet.value.field === 'email') profile.value.email = editSheet.value.value
  editSheet.value.open = false
}

function openLink(type) {}
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: #f0f2ee;
  font-family: 'Nunito', 'Segoe UI', sans-serif;
  padding-bottom: 100px;
  transition: background 0.3s;
}
.settings-page.dark { background: #1a1a1a; }
.settings-page.dark .card { background: #2a2a2a; }
.settings-page.dark .setting-label { color: #e5e7eb; }
.settings-page.dark .setting-value { color: #9ca3af; }
.settings-page.dark .section-label { color: #6b7280; }
.settings-page.dark .profile-name { color: #fff; }
.settings-page.dark .profile-email { color: #9ca3af; }
.settings-page.dark .page-title { color: #fff; }
.settings-page.dark .page-header { background: #2a2a2a; border-color: #333; }
.settings-page.dark .divider { background: #333; }
.settings-page.dark .inline-select { color: #e5e7eb; background: transparent; }
.settings-page.dark .setting-row { border-color: #333; }
.settings-page.dark .setting-row:active { background: #2a2a2a; }

.page-header {
  padding: 1.25rem 1.25rem 0.75rem;
  background: #fff; border-bottom: 1px solid #eee;
  transition: background 0.3s;
}
.page-title { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; text-align: center; }
.page-body { padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
.section-label {
  font-size: 0.68rem; font-weight: 700; color: #9ca3af;
  letter-spacing: 0.08em; padding: 0.5rem 0.25rem 0.25rem;
}
.card {
  background: #fff; border-radius: 16px;
  overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  transition: background 0.3s;
}
.profile-row { display: flex; align-items: center; gap: 1rem; padding: 1rem 1rem 0.75rem; }
.avatar-wrap { position: relative; flex-shrink: 0; }
.avatar {
  width: 56px; height: 56px; border-radius: 50%;
  background: linear-gradient(135deg, #2e7d32, #1b5e20);
  color: #fff; font-size: 1.3rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
}
.avatar-edit {
  position: absolute; bottom: 0; right: 0;
  width: 20px; height: 20px; border-radius: 50%;
  background: #2e7d32; border: 2px solid #fff;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.hidden-input { display: none; }
.profile-info { display: flex; flex-direction: column; gap: 2px; }
.profile-name { font-size: 1rem; font-weight: 700; color: #1a1a1a; }
.profile-email { font-size: 0.8rem; color: #6b7280; }
.divider { height: 1px; background: #f0f2ee; margin: 0 1rem; }
.setting-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.85rem 1rem; cursor: pointer; transition: background 0.15s;
  border-bottom: 1px solid #f5f6f3;
}
.setting-row:last-child { border-bottom: none; }
.setting-row:active { background: #f5f6f3; }
.setting-row.danger:active { background: #fff5f5; }
.setting-left { display: flex; align-items: center; gap: 0.75rem; flex: 1; }
.setting-icon {
  width: 34px; height: 34px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; flex-shrink: 0;
}
.setting-label { font-size: 0.9rem; font-weight: 600; color: #1a1a1a; }
.setting-label.danger-text { color: #ef4444; }
.setting-right { display: flex; align-items: center; gap: 0.4rem; }
.setting-value { font-size: 0.82rem; color: #9ca3af; }
.select-wrap { display: flex; align-items: center; gap: 0.25rem; }
.inline-select {
  border: none; background: transparent; outline: none;
  font-size: 0.82rem; color: #9ca3af; font-family: inherit;
  cursor: pointer; appearance: none; padding-right: 4px;
}
.toggle-wrap { cursor: pointer; }
.toggle {
  width: 44px; height: 24px; border-radius: 999px;
  background: #e0e3db; position: relative; transition: background 0.25s;
}
.toggle.on { background: #2e7d32; }
.toggle-knob {
  position: absolute; top: 3px; left: 3px;
  width: 18px; height: 18px; border-radius: 50%;
  background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
}
.toggle.on .toggle-knob { transform: translateX(20px); }

/* ── Logo Footer ─────────────────────────────────────────── */
.brand-footer {
  display: flex; justify-content: center;
  padding: 1.75rem 0 0.5rem;
}
.brand-logo {
  height: 70px;
  object-fit: contain;
}

/* ── Bottom Sheet ─────────────────────────────────────────── */
.sheet-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200; }
.bottom-sheet {
  position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 100%; max-width: 430px; max-height: 90vh;
  background: #fff; border-radius: 24px 24px 0 0;
  z-index: 201; display: flex; flex-direction: column; overflow: hidden;
}
.drawer-handle {
  width: 40px; height: 4px; background: #e0e3db; border-radius: 999px;
  margin: 1rem auto 0.25rem; flex-shrink: 0;
}
.drawer-header {
  display: flex; align-items: center; justify-content: center;
  padding: 0.5rem 1.25rem 0.25rem; flex-shrink: 0;
}
.drawer-title { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; }
.drawer-body {
  flex: 1; overflow-y: auto; padding: 0.75rem 1.25rem 2rem;
  display: flex; flex-direction: column; gap: 1rem;
}
.field-group { display: flex; flex-direction: column; }
.field-label {
  font-size: 0.72rem; font-weight: 700; color: #6b7280;
  letter-spacing: 0.08em; margin-bottom: 0.5rem;
}
.input-box {
  background: #f5f6f3; border-radius: 14px;
  padding: 0.85rem 1rem; display: flex; align-items: center;
  gap: 0.75rem; border: 1.5px solid transparent;
}
.input-box:focus-within { border-color: #2e7d32; background: #f0fdf4; }
.text-input {
  flex: 1; border: none; background: transparent; outline: none;
  font-size: 0.95rem; color: #1a1a1a; font-family: inherit;
}
.text-input::placeholder { color: #9ca3af; }
.save-btn {
  width: 100%;
  background: linear-gradient(0deg, #4EA844 0%, #439940 47.6%, #013119 100%);
  box-shadow: 0px 4px 4px rgba(0,0,0,0.25);
  color: #fff; border: none; border-radius: 16px;
  padding: 1rem; font-size: 1rem; font-weight: 700;
  cursor: pointer; font-family: inherit;
}

/* ── Delete Modal ─────────────────────────────────────────── */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  z-index: 300; display: flex; align-items: center; justify-content: center;
  padding: 1.5rem;
}
.modal-card {
  background: #fff; border-radius: 20px; padding: 1.75rem;
  width: 100%; max-width: 320px;
  display: flex; flex-direction: column; align-items: center;
  gap: 0.75rem; text-align: center;
}
.modal-icon { font-size: 2.5rem; }
.modal-title { font-size: 1.1rem; font-weight: 800; color: #1a1a1a; }
.modal-sub { font-size: 0.85rem; color: #6b7280; line-height: 1.5; }
.modal-actions { display: flex; gap: 0.75rem; width: 100%; margin-top: 0.5rem; }
.modal-cancel {
  flex: 1; padding: 0.85rem; border-radius: 12px;
  border: 1.5px solid #e0e3db; background: #fff;
  font-size: 0.9rem; font-weight: 600; color: #1a1a1a;
  cursor: pointer; font-family: inherit;
}
.modal-confirm {
  flex: 1; padding: 0.85rem; border-radius: 12px;
  border: none; background: #ef4444;
  font-size: 0.9rem; font-weight: 700; color: #fff;
  cursor: pointer; font-family: inherit;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateX(-50%) translateY(100%); }
</style>