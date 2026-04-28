<script setup>
import {ref, computed, onMounted} from 'vue'
import { useThemeStore } from '@/stores/theme.store.js'
import {useAuthStore} from "@/stores/auth.store.js";
import {currencies} from "@/services/currency.service.js";
import { useFcm } from '@/composables/useFcm';

const { registerForNotifications } = useFcm();


const auth = useAuthStore()
const themeStore = useThemeStore()

const darkMode = computed({ get: () => themeStore.darkMode, set: () => themeStore.toggleDark() })
const prefs = ref({ currency: auth.user.currency ?? 'GBP', dark_mode: darkMode.value, push_notification: auth.user.preferences.push_notification ?? false, reminder_alert: auth.user.preferences.reminder_alert ?? false, goal_deadline_alert: auth.user.preferences.goal_deadline_alert ?? false })

const isCurrencyOpen = ref(false)

function selectCurrency(code) {
  prefs.value.currency = code
  savePreferences();
  isCurrencyOpen.value = false
}
function currentCurrency() {
  return currencies.find(c => c.code === prefs.value.currency)
}


const notifs = ref({ push: true, reminders: true, goals: true })

const name = ref({
  firstname: '',
  lastname: '',
});

const password = ref({
  current_password: '',
  new_password: '',
  new_password_confirmation: '',

})

function handleLogout() {
  auth.logout();
}

const sheetStatus = ref({
  open: false,
  modal: 'name'
});

const handleSave = async (modal) => {
  if(modal == 'name'){
    await auth.nameChange(name.value);
  }else if(modal == 'password'){
    await auth.passwordChange(password.value);
  }
}

const savePreferences = async()=> {
  await auth.preferenceChange(prefs.value)
  // setTimeout(() => {
  //   window.location.reload();
  // }, 2000)
}

</script>

<template>
  <div class="settings-page" :class="{ dark: darkMode }">

    <!-- Header -->
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <h1 class="page-title">Settings</h1>
      <div style="width:32px"></div>
    </div>

    <div class="page-body">

      <!-- ── Profile ───────────────────────────────────────── -->
      <div class="section-label">PROFILE</div>
      <div class="card">
        <div class="profile-row">
          <div class="avatar-wrap">
            <div class="avatar">{{String(auth.user.firstname).charAt(0)}}</div>
            <input ref="avatarInput" type="file" accept="image/*" class="hidden-input" />
          </div>
          <div class="profile-info">
            <span class="profile-name">{{ auth.user.firstname }} {{ auth.user.lastname }}</span>
            <span class="profile-email">{{ auth.user.email }}</span>
          </div>
        </div>
        <div class="divider" />
        <div class="setting-row" @click="()=>{sheetStatus.open=true;sheetStatus.modal= 'name';}">
          <div class="setting-left">
            <div class="setting-icon" style="background:var(--indevo-border)">👤</div>
            <span class="setting-label">Full Name</span>
          </div>
          <div class="setting-right">
            <span class="setting-value">{{ auth.user.firstname }} {{ auth.user.lastname }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>
        <div class="setting-row" @click="()=>{sheetStatus.open=true;sheetStatus.modal= 'password';}">
          <div class="setting-left">
            <div class="setting-icon" style="background:var(--indevo-border)">🔒</div>
            <span class="setting-label">Change Password</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
        <div class="setting-row danger" @click="handleLogout">
          <div class="setting-left">
            <div class="setting-icon" style="background:var(--indevo-border)">⏻</div>
            <span class="setting-label danger-text">Log Out</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>

      <!-- ── Preferences ────────────────────────────────────── -->
      <div class="section-label">PREFERENCES</div>
      <div class="card">
        <!-- Currency row (tap to open picker) -->
        <div class="setting-row" @click="isCurrencyOpen = true">
          <div class="setting-left">
            <div class="setting-icon" style="background:#f0fdf4">💱</div>
            <span class="setting-label">Currency</span>
          </div>
          <div class="setting-right">
        <span class="setting-value">
          {{ currentCurrency().symbol }} {{ currentCurrency().code }}
        </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="#9ca3af" stroke-width="2" stroke-linecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </div>

        <div class="setting-row">
          <div class="setting-left">
            <div class="setting-icon" style="background:#1a1a2e">🌙</div>
            <span class="setting-label">Dark Mode</span>
          </div>
          <div class="toggle-wrap" @click="()=>{
            themeStore.toggleDark()
            savePreferences()
          }">
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
          <div class="toggle-wrap" @click="()=>{
            if(prefs.push_notification == false){
              registerForNotifications();
            }
            prefs.push_notification = !prefs.push_notification
            savePreferences();
          }">
            <div class="toggle" :class="{ on: prefs.push_notification }"><div class="toggle-knob"></div></div>
          </div>
        </div>
        <div class="setting-row">
          <div class="setting-left">
            <div class="setting-icon" style="background:#e8f5e9">⏰</div>
            <span class="setting-label">Reminder Alerts</span>
          </div>
          <div class="toggle-wrap" @click="()=>{
            prefs.reminder_alert = !prefs.reminder_alert
            savePreferences();
          }">
            <div class="toggle" :class="{ on: prefs.reminder_alert }"><div class="toggle-knob"></div></div>
          </div>
        </div>
<!--        <div class="setting-row">-->
<!--          <div class="setting-left">-->
<!--            <div class="setting-icon" style="background:#f3e8ff">🎯</div>-->
<!--            <span class="setting-label">Goal Deadline Alerts</span>-->
<!--          </div>-->
<!--          <div class="toggle-wrap" @click="()=>{-->
<!--            prefs.goal_deadline_alert = !prefs.goal_deadline_alert-->
<!--            savePreferences();-->
<!--          }">-->
<!--            <div class="toggle" :class="{ on: prefs.goal_deadline_alert }"><div class="toggle-knob"></div></div>-->
<!--          </div>-->
<!--        </div>-->
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
      </div>

      <!-- ── Logo Footer ────────────────────────────────────── -->
      <div class="brand-footer">
        <img src="../../assets/indevo-logo.png" alt="InDevo" class="brand-logo" />
      </div>

    </div>

    <!-- ── Edit Bottom Sheet ───────────────────────────────── -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="sheetStatus.open" class="sheet-overlay" @click.self="sheetStatus.open = false"></div>
      </Transition>
      <Transition name="slide-up">
        <div v-if="sheetStatus.open" class="bottom-sheet">
          <div class="drawer-handle"></div>
          <div class="drawer-header">
            <h2 class="drawer-title">{{ sheetStatus.modal == 'name' ? 'Change Name' : 'Change Password' }}</h2>
          </div>
          <div class="drawer-body">
            <template v-if="sheetStatus.open && sheetStatus.modal == 'name'">
              <div class="field-group">
                <label class="field-label">FIRST NAME</label>
                <div class="input-box">
                  <input v-model="name.firstname" class="text-input" placeholder="Your first name" />
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">LAST NAME</label>
                <div class="input-box">
                  <input v-model="name.lastname" class="text-input" placeholder="Your last name" />
                </div>
              </div>
            </template>
            <template v-if="sheetStatus.open && sheetStatus.modal == 'password'">
              <div class="field-group">
                <label class="field-label">CURRENT PASSWORD</label>
                <div class="input-box">
                  <input v-model="password.current_password" type="password" class="text-input" placeholder="Enter current password" />
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">NEW PASSWORD</label>
                <div class="input-box">
                  <input v-model="password.new_password" type="password" class="text-input" placeholder="Enter new password" />
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">CONFIRM NEW PASSWORD</label>
                <div class="input-box">
                  <input v-model="password.new_password_confirmation" type="password" class="text-input" placeholder="Repeat new password" />
                </div>
              </div>
            </template>
            <button class="save-btn" @click="()=>{
              sheetStatus.open = false
              handleSave(sheetStatus.modal);
            }">Save Changes</button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isCurrencyOpen" class="picker-overlay" @click="isCurrencyOpen = false"></div>
      </Transition>

      <Transition name="slide-up">
        <div v-if="isCurrencyOpen" class="picker-sheet">
          <div class="picker-handle"></div>
          <div class="picker-header">
            <span class="picker-title">Select Currency</span>
            <button class="picker-cancel" @click="isCurrencyOpen = false">Done</button>
          </div>

          <div class="picker-list">
            <div
                v-for="c in currencies"
                :key="c.code"
                class="picker-item"
                :class="{ selected: prefs.currency === c.code }"
                @click="selectCurrency(c.code)"
            >
              <div class="picker-item-left">
                <span class="picker-symbol">{{ c.symbol }}</span>
                <div class="picker-text">
                  <span class="picker-code">{{ c.code }}</span>
                  <span class="picker-name">{{ c.name }}</span>
                </div>
              </div>
              <svg v-if="prefs.currency === c.code"
                   width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="#007aff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>


<style scoped>
.settings-page {
  min-height: 100vh;
  background: #f0f2ee;
  font-family: 'Nunito', 'Segoe UI', sans-serif;
  padding-bottom: 100px;
  transition: background 0.3s;
}
.bottom-sheet{
  font-family: 'Nunito', 'Segoe UI', sans-serif;
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
  background: linear-gradient(135deg, var(--indevo-green-mid), var(--indevo-green));
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

/* ── toggle component ─────────────────────────────────────────── */
.toggle-wrap { cursor: pointer; }
.toggle {
  width: 44px; height: 24px;
  border-radius: 999px;
  background:  var(--indevo-border);
  position: relative;
  transition: background 0.25s;
}
.toggle.on { background:  var(--indevo-green-gradiant); }
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


.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateX(-50%) translateY(100%); }
</style>

<style scoped>
/* ── Currency Picker Sheet ─────────────────────────────── */
.picker-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 200;
}

.picker-sheet {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  max-height: 70vh;
  background: #fff;
  border-radius: 24px 24px 0 0;
  z-index: 201;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Nunito', 'Segoe UI', sans-serif;
  padding-bottom: env(safe-area-inset-bottom);
}

.picker-handle {
  width: 40px;
  height: 4px;
  background: #e0e3db;
  border-radius: 999px;
  margin: 1rem auto 0.25rem;
  flex-shrink: 0;
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1.25rem 0.75rem;
  border-bottom: 1px solid #f0f2ee;
  flex-shrink: 0;
}

.picker-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
}

.picker-cancel {
  background: none;
  border: none;
  color: #2e7d32;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  padding: 4px 0;
  font-family: inherit;
}

.picker-list {
  overflow-y: auto;
  padding: 0.25rem 0 1rem;
}

.picker-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid #f5f6f3;
}

.picker-item:last-child {
  border-bottom: none;
}

.picker-item:active {
  background: #f5f6f3;
}

.picker-item.selected {
  background: #f0fdf4;
}

.picker-item-left {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.picker-symbol {
  font-size: 1.25rem;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #f0fdf4;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;
  font-weight: 700;
  flex-shrink: 0;
}

.picker-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.picker-code {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1a;
}

.picker-name {
  font-size: 0.78rem;
  color: #6b7280;
}

/* Dark mode — matches your existing .settings-page.dark pattern */
.settings-page.dark ~ * .picker-sheet,
.dark .picker-sheet { background: #2a2a2a; }
.dark .picker-header { border-bottom-color: #333; }
.dark .picker-title,
.dark .picker-code { color: #fff; }
.dark .picker-name { color: #9ca3af; }
.dark .picker-item { border-bottom-color: #333; }
.dark .picker-item:active { background: #1a1a1a; }
.dark .picker-item.selected { background: #1f3a24; }
.dark .picker-symbol { background: #1f3a24; color: #fff; }
.dark .picker-handle { background: #444; }
</style>