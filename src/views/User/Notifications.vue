<template>
  <div class="reminders-page">

    <!-- Header -->
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <h1 class="page-title">Reminders</h1>
      <div style="width:32px"></div>
    </div>

    <!-- Date Row -->
    <div class="date-row">
      <span class="date-text">{{ todayDisplay }}</span>
      <button class="cal-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </button>
    </div>

    <!-- My Goals Card -->
    <div class="goals-card">
      <div class="goals-card-top">
        <div class="goals-title-row">
          <div class="goals-icon">🎯</div>
          <span class="goals-label">MY GOALS</span>
        </div>
        <span class="view-all" @click="$router.push('/goals')">View all →</span>
      </div>
      <div class="goals-stats">
        <div class="goal-stat">
          <span class="goal-num">{{ goalStats.total }}</span>
          <span class="goal-sub">TOTAL</span>
        </div>
        <div class="goal-stat">
          <span class="goal-num">{{ goalStats.pending }}</span>
          <span class="goal-sub">PENDING</span>
        </div>
        <div class="goal-stat">
          <span class="goal-num faded">{{ goalStats.done }}</span>
          <span class="goal-sub">DONE ✓</span>
        </div>
      </div>
      <div class="progress-row">
        <span class="progress-label">Overall Progress</span>
        <span class="progress-pct">{{ goalStats.pct }}% complete</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: goalStats.pct + '%' }"></div>
      </div>
    </div>

    <!-- Create New Goal -->
    <div class="create-goal-row" @click="$router.push('/goals')">
      <div class="create-goal-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </div>
      <div class="create-goal-text">
        <span class="create-goal-title">Create New Goal</span>
        <span class="create-goal-sub">Set a target with reminders & deadline</span>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>

    <!-- Filter Pills -->
    <div class="filter-row">
      <button
          v-for="f in filters" :key="f.label"
          class="filter-btn"
          :class="{ active: activeFilter === f.label }"
          @click="activeFilter = f.label"
      >
        <span v-if="f.dot" class="filter-dot" :style="{ background: f.dot }"></span>
        <span v-if="f.icon">{{ f.icon }}</span>
        {{ f.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" style="text-align:center;padding:2rem;color:#6b7280">Loading reminders...</div>

    <template v-else>
      <!-- Today sections -->
      <template v-for="(items, section) in filteredToday" :key="section">
        <div class="time-section-label">{{ sectionLabel(section) }}</div>
        <div v-for="reminder in items" :key="reminder.id"
             class="reminder-card"
             :class="{ 'urgent-card': reminder.priority === 'high' }"
        >
          <div v-if="reminder.priority === 'high'" class="urgent-bar"></div>
          <div class="reminder-time">
            <span class="time-hour" :class="priorityClass(reminder.priority)">{{ formatTime(reminder.due_time).hour }}</span>
            <span class="time-ampm">{{ formatTime(reminder.due_time).ampm }}</span>
          </div>
          <!-- Priority dot instead of icon -->
          <div class="priority-dot-wrap" :style="{ background: priorityBg(reminder.priority) }">
            <div class="priority-dot-inner" :style="{ background: priorityColor(reminder.priority) }"></div>
          </div>
          <div class="reminder-info">
            <span class="reminder-name" :class="{ 'done-text': reminder.is_completed }">
              {{ reminder.description }}
            </span>
            <div class="reminder-tags">
              <span class="tag-text">{{ recurrenceLabel(reminder.recurrence) }}</span>
              <span class="dot-sep">·</span>
              <span class="tag-pill" :class="priorityPillClass(reminder.priority)">
                {{ reminder.priority === 'high' ? '🔴 Urgent' : reminder.priority }}
              </span>
            </div>
          </div>
          <div class="card-actions">
            <div
                class="check-circle"
                :class="reminder.is_completed ? 'filled' : 'empty'"
                @click="!reminder.is_completed && markComplete(reminder)"
            >
              <svg v-if="reminder.is_completed" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <button class="delete-reminder-btn" @click="confirmDeleteReminder(reminder)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
            </button>
          </div>
        </div>
      </template>

      <!-- Upcoming -->
      <template v-if="hasUpcoming">
        <div class="time-section-label" style="margin-top:0.5rem">UPCOMING</div>
        <template v-for="(items, date) in filteredUpcoming" :key="date">
          <div class="time-section-label" style="font-size:0.68rem;color:#9ca3af">{{ formatDate(date) }}</div>
          <div v-for="reminder in items" :key="reminder.id" class="reminder-card">
            <div class="reminder-time">
              <span class="time-hour" :class="priorityClass(reminder.priority)">{{ formatTime(reminder.due_time).hour }}</span>
              <span class="time-ampm">{{ formatTime(reminder.due_time).ampm }}</span>
            </div>
            <div class="priority-dot-wrap" :style="{ background: priorityBg(reminder.priority) }">
              <div class="priority-dot-inner" :style="{ background: priorityColor(reminder.priority) }"></div>
            </div>
            <div class="reminder-info">
              <span class="reminder-name" :class="{ 'done-text': reminder.is_completed }">{{ reminder.description }}</span>
              <div class="reminder-tags">
                <span class="tag-text">{{ recurrenceLabel(reminder.recurrence) }}</span>
                <span class="dot-sep">·</span>
                <span class="tag-pill" :class="priorityPillClass(reminder.priority)">{{ reminder.priority }}</span>
              </div>
            </div>
            <div class="card-actions">
              <div
                  class="check-circle"
                  :class="reminder.is_completed ? 'filled' : 'empty'"
                  @click="!reminder.is_completed && markComplete(reminder)"
              >
                <svg v-if="reminder.is_completed" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <button class="delete-reminder-btn" @click="confirmDeleteReminder(reminder)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14H6L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4h6v2"/>
                </svg>
              </button>
            </div>
          </div>
        </template>
      </template>

      <!-- Empty state -->
      <div v-if="!hasToday && !hasUpcoming" style="text-align:center;padding:3rem 1.25rem;color:#6b7280">
        <div style="font-size:3rem">🔔</div>
        <p style="font-weight:700;color:#1a1a1a;margin:0.5rem 0 0.25rem">No reminders yet</p>
        <span style="font-size:0.85rem">Tap + to add your first reminder</span>
      </div>
    </template>

    <!-- FAB -->
    <button class="fab" @click="drawerOpen = true">＋</button>

    <!-- Delete Confirmation -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="deleteReminderConfirm" class="sheet-overlay" @click.self="deleteReminderConfirm = null"></div>
      </Transition>
      <Transition name="slide-up">
        <div v-if="deleteReminderConfirm" class="confirm-sheet">
          <div class="drawer-handle"></div>
          <div class="confirm-body">
            <div class="confirm-icon">🗑️</div>
            <h3 class="confirm-title">Delete Reminder?</h3>
            <p class="confirm-sub">"<strong>{{ deleteReminderConfirm?.description }}</strong>" will be permanently deleted.</p>
            <div class="confirm-btns">
              <button class="cancel-btn" @click="deleteReminderConfirm = null">Cancel</button>
              <button class="confirm-delete-btn" @click="deleteReminder">Delete</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Add Reminder Bottom Sheet -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="drawerOpen" class="sheet-overlay" @click.self="drawerOpen = false"></div>
      </Transition>
      <Transition name="slide-up">
        <div v-if="drawerOpen" class="bottom-sheet">
          <div class="drawer-handle"></div>
          <div class="drawer-header">
            <h2 class="drawer-title">Add Reminder</h2>
          </div>
          <div class="drawer-body">

            <div class="field-group">
              <label class="field-label">DESCRIPTION</label>
              <div class="input-box">
                <span>📝</span>
                <input v-model="form.title" placeholder="What do you need to remember?" class="text-input" />
              </div>
            </div>

            <div class="time-date-row">
              <div class="field-group" style="flex:1">
                <label class="field-label">TIME</label>
                <div class="input-box time-box">
                  <span>⏱️</span>
                  <input v-model="form.time" type="time" class="text-input green-text" />
                </div>
              </div>
              <div class="field-group" style="flex:1">
                <label class="field-label">DATE</label>
                <div class="input-box">
                  <span>📅</span>
                  <input
                      v-model="form.date"
                      :type="dateFocused ? 'date' : 'text'"
                      :placeholder="todayFormatted"
                      class="text-input"
                      @focus="dateFocused = true"
                      @blur="dateFocused = !!form.date"
                  />
                </div>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">PRIORITY</label>
              <div class="priority-grid">
                <button class="priority-btn" :class="{ 'p-urgent': form.priority === 'Urgent' }" @click="form.priority = 'Urgent'">
                  <span class="p-dot" style="background:#ef4444"></span>
                  <span :style="{ color: form.priority === 'Urgent' ? '#ef4444' : '#1a1a1a' }">Urgent</span>
                </button>
                <button class="priority-btn" :class="{ 'p-medium': form.priority === 'Medium' }" @click="form.priority = 'Medium'">
                  <span class="p-dot" style="background:#f59e0b"></span>
                  <span :style="{ color: form.priority === 'Medium' ? '#f59e0b' : '#1a1a1a' }">Medium</span>
                </button>
                <button class="priority-btn" :class="{ 'p-low': form.priority === 'Low' }" @click="form.priority = 'Low'">
                  <span class="p-dot" style="background:#22c55e"></span>
                  <span :style="{ color: form.priority === 'Low' ? '#22c55e' : '#1a1a1a' }">Low</span>
                </button>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">TYPE</label>
              <div class="category-grid">
                <button
                    v-for="t in types" :key="t.label"
                    class="cat-btn"
                    :class="{ selected: form.type === t.label }"
                    @click="form.type = t.label"
                >
                  <span>{{ t.icon }}</span> {{ t.label }}
                </button>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">RECURRING</label>
              <div class="input-box select-box">
                <span>🔄</span>
                <div class="recurring-content">
                  <span class="recurring-title">{{ freqOptions.find(r => r.value === form.frequency)?.label || 'One-time' }}</span>
                  <span class="recurring-sub">Tap to change frequency</span>
                </div>
                <select v-model="form.frequency" class="hidden-select">
                  <option v-for="r in freqOptions" :key="r.value" :value="r.value">{{ r.label }}</option>
                </select>
                <span class="dropdown-arrow">▾</span>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">PLACE <span class="optional">(optional)</span></label>
              <div class="input-box">
                <span>📍</span>
                <input v-model="form.place" placeholder="Add a location trigger..." class="text-input" />
                <span class="gps-btn">GPS</span>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">NOTES <span class="optional">(optional)</span></label>
              <div class="input-box textarea-box">
                <textarea v-model="form.notes" placeholder="Add any extra notes..." class="notes-input"></textarea>
              </div>
            </div>

            <button class="save-btn" :disabled="saving" @click="handleSave">
              {{ saving ? 'Saving...' : 'Save Reminder' }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api.js'

const drawerOpen = ref(false)
const dateFocused = ref(false)
const activeFilter = ref('All')
const loading = ref(false)
const saving = ref(false)
const deleteReminderConfirm = ref(null)

const today = new Date()
const todayDisplay = today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })
const todayFormatted = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const todayReminders = ref({})
const upcomingReminders = ref({})
const goals = ref([])

const filters = [
  { label: 'All' },
  { label: 'Urgent', dot: '#ef4444' },
  { label: 'Routine', icon: '🔄' },
  { label: 'Task', icon: '✅' },
]

const form = ref({
  title: '', priority: 'Urgent', type: 'Task',
  date: '', time: '', frequency: 'once', place: '', notes: ''
})

const types = [
  { icon: '✅', label: 'Task' },
  { icon: '🔄', label: 'Routine' },
  { icon: '👥', label: 'Social' },
]

const freqOptions = [
  { label: 'One-time', value: 'once' },
  { label: 'Daily',    value: 'daily' },
  { label: 'Weekly',   value: 'weekly' },
  { label: 'Monthly',  value: 'monthly' },
]

// ── Helpers ────────────────────────────────────────────────
function formatTime(time) {
  if (!time) return { hour: '--:--', ampm: '' }
  const [h, m] = time.split(':')
  const hour = parseInt(h)
  return { hour: `${hour % 12 || 12}:${m}`, ampm: hour >= 12 ? 'PM' : 'AM' }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

function sectionLabel(key) {
  const labels = { this_morning: 'THIS MORNING', this_afternoon: 'THIS AFTERNOON', this_evening: 'THIS EVENING', tonight: 'TONIGHT' }
  return labels[key] ?? key.toUpperCase()
}

function priorityClass(p) { return p === 'high' ? 'red' : p === 'medium' ? 'orange' : '' }
function priorityPillClass(p) { return p === 'high' ? 'urgent' : p === 'medium' ? 'routine-orange' : 'routine' }
function priorityColor(p) { return p === 'high' ? '#ef4444' : p === 'medium' ? '#f59e0b' : '#22c55e' }
function priorityBg(p) { return p === 'high' ? '#fee2e2' : p === 'medium' ? '#fff8e1' : '#f0fdf4' }
function recurrenceLabel(val) { return freqOptions.find(r => r.value === val)?.label ?? val }

// ── Goals stats ────────────────────────────────────────────
const goalStats = computed(() => {
  const total = goals.value.length
  const done = goals.value.filter(g => g.is_completed).length
  const pending = total - done
  const pct = total ? Math.round((done / total) * 100) : 0
  return { total, pending, done, pct }
})

// ── Filtering ──────────────────────────────────────────────
function filterItems(items) {
  if (activeFilter.value === 'All') return items
  return items.filter(r => {
    if (activeFilter.value === 'Urgent')  return r.priority === 'high'
    if (activeFilter.value === 'Routine') return r.recurrence !== 'once'
    if (activeFilter.value === 'Task')    return r.recurrence === 'once'
    return true
  })
}

const filteredToday = computed(() => {
  const result = {}
  for (const [section, items] of Object.entries(todayReminders.value)) {
    const filtered = filterItems(items)
    if (filtered.length) result[section] = filtered
  }
  return result
})

const filteredUpcoming = computed(() => {
  const result = {}
  for (const [date, items] of Object.entries(upcomingReminders.value)) {
    const filtered = filterItems(items)
    if (filtered.length) result[date] = filtered
  }
  return result
})

const hasToday    = computed(() => Object.keys(filteredToday.value).length > 0)
const hasUpcoming = computed(() => Object.keys(filteredUpcoming.value).length > 0)

// ── API ────────────────────────────────────────────────────
async function fetchReminders() {
  loading.value = true
  try {
    const res = await api.get('/user/reminders')
    if (res.data.success) {
      todayReminders.value    = res.data.data.today    ?? {}
      upcomingReminders.value = res.data.data.upcoming ?? {}
    }
  } catch (e) {
    console.error('Failed to load reminders', e)
  } finally {
    loading.value = false
  }
}

async function fetchGoals() {
  try {
    const res = await api.get('/user/goals')
    if (res.data.success) goals.value = res.data.data ?? []
  } catch (e) {
    console.error('Failed to load goals', e)
  }
}

async function markComplete(reminder) {
  try {
    await api.post('/user/reminder/complete', { action: 'complete', reminder_id: reminder.id })
    // Mark locally — stays visible with strikethrough
    reminder.is_completed = true
    await fetchGoals()
  } catch (e) {
    console.error('Failed to mark complete', e)
  }
}

function confirmDeleteReminder(reminder) {
  deleteReminderConfirm.value = reminder
}

async function deleteReminder() {
  const reminder = deleteReminderConfirm.value
  if (!reminder) return
  deleteReminderConfirm.value = null
  try {
    await api.delete('/user/reminder/' + reminder.id)
    // Remove from local state immediately
    for (const section of Object.keys(todayReminders.value)) {
      todayReminders.value[section] = todayReminders.value[section].filter(r => r.id !== reminder.id)
      if (todayReminders.value[section].length === 0) delete todayReminders.value[section]
    }
    for (const date of Object.keys(upcomingReminders.value)) {
      upcomingReminders.value[date] = upcomingReminders.value[date].filter(r => r.id !== reminder.id)
      if (upcomingReminders.value[date].length === 0) delete upcomingReminders.value[date]
    }
  } catch (e) {
    console.error('Failed to delete reminder', e)
  }
}

async function handleSave() {
  if (!form.value.title || !form.value.date) return
  saving.value = true
  try {
    const priorityMap = { 'Urgent': 'high', 'Medium': 'medium', 'Low': 'low' }
    const categoryMap = { 'Task': 'personal', 'Routine': 'personal', 'Social': 'social' }
    await api.post('/user/reminder', {
      description: form.value.title,
      priority:    priorityMap[form.value.priority] ?? 'medium',
      category:    categoryMap[form.value.type] ?? 'personal',
      due_date:    form.value.date,
      due_time:    form.value.time || null,
      recurrence:  form.value.frequency,
      place:       form.value.place || null,
      note:        form.value.notes || null,
    })
    drawerOpen.value = false
    form.value = { title: '', priority: 'Urgent', type: 'Task', date: '', time: '', frequency: 'once', place: '', notes: '' }
    await fetchReminders()
  } catch (e) {
    console.error('Failed to save reminder', e)
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await fetchReminders()
  await fetchGoals()
})
</script>

<style scoped>
.reminders-page {
  min-height: 100vh;
  background: #f0f2ee;
  font-family: 'Nunito', 'Segoe UI', sans-serif;
  padding-bottom: 100px;
}

.page-header { padding: 1.25rem 1.25rem 0.75rem; display: flex; align-items: center; justify-content: space-between; background: #f0f2ee; }
.back-btn { background: none; border: none; cursor: pointer; color: #1a1a1a; padding: 0; display: flex; align-items: center; }
.page-title { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; }

.date-row { display: flex; align-items: center; justify-content: space-between; padding: 0.25rem 1.25rem 1rem; }
.date-text { font-size: 1.3rem; font-weight: 800; color: #1a1a1a; }
.cal-btn { background: none; border: none; cursor: pointer; color: #1a1a1a; display: flex; align-items: center; }

.goals-card { margin: 0 1.25rem 1rem; background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%); border-radius: 20px; padding: 1.25rem; }
.goals-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.goals-title-row { display: flex; align-items: center; gap: 0.5rem; }
.goals-icon { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 1rem; }
.goals-label { font-size: 0.85rem; font-weight: 800; color: #fff; letter-spacing: 0.05em; }
.view-all { font-size: 0.8rem; color: rgba(255,255,255,0.75); cursor: pointer; }
.goals-stats { display: flex; gap: 0.75rem; margin-bottom: 1.25rem; }
.goal-stat { flex: 1; background: rgba(255,255,255,0.12); border-radius: 12px; padding: 0.75rem; display: flex; flex-direction: column; align-items: center; gap: 2px; }
.goal-num { font-size: 1.6rem; font-weight: 800; color: #fff; }
.goal-num.faded { color: rgba(255,255,255,0.5); }
.goal-sub { font-size: 0.65rem; font-weight: 600; color: rgba(255,255,255,0.7); letter-spacing: 0.05em; }
.progress-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
.progress-label { font-size: 0.8rem; color: rgba(255,255,255,0.8); }
.progress-pct { font-size: 0.8rem; font-weight: 700; color: #fff; }
.progress-bar { height: 6px; background: rgba(255,255,255,0.2); border-radius: 999px; overflow: hidden; }
.progress-fill { height: 100%; background: #69f0ae; border-radius: 999px; transition: width 0.5s ease; }

.create-goal-row { margin: 0 1.25rem 1rem; background: #fff; border: 1.5px dashed #c8e6c9; border-radius: 16px; padding: 1rem; display: flex; align-items: center; gap: 0.75rem; cursor: pointer; }
.create-goal-icon { width: 36px; height: 36px; border-radius: 10px; background: #2e7d32; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.create-goal-text { flex: 1; display: flex; flex-direction: column; }
.create-goal-title { font-size: 0.9rem; font-weight: 700; color: #1a1a1a; }
.create-goal-sub { font-size: 0.75rem; color: #6b7280; }

.filter-row { display: flex; gap: 0.5rem; padding: 0 1.25rem; margin-bottom: 1.25rem; overflow-x: auto; }
.filter-btn { display: flex; align-items: center; gap: 0.3rem; padding: 0.4rem 1rem; border-radius: 999px; border: 1.5px solid #e0e3db; background: #fff; font-size: 0.82rem; font-weight: 600; color: #6b7280; cursor: pointer; font-family: inherit; white-space: nowrap; transition: all 0.2s; }
.filter-btn.active { background: #2e7d32; border-color: #2e7d32; color: #fff; }
.filter-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }

.time-section-label { font-size: 0.72rem; font-weight: 700; color: #6b7280; letter-spacing: 0.08em; padding: 0 1.25rem; margin-bottom: 0.5rem; }

.reminder-card { margin: 0 1.25rem 0.75rem; background: #fff; border-radius: 16px; padding: 1rem; display: flex; align-items: center; gap: 0.75rem; position: relative; overflow: hidden; }
.urgent-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: #ef4444; border-radius: 4px 0 0 4px; }

.reminder-time { display: flex; flex-direction: column; align-items: center; min-width: 38px; }
.time-hour { font-size: 1rem; font-weight: 800; color: #1a1a1a; }
.time-hour.red { color: #ef4444; }
.time-hour.orange { color: #f59e0b; }
.time-ampm { font-size: 0.65rem; color: #9ca3af; font-weight: 600; }

/* Priority dot */
.priority-dot-wrap { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.priority-dot-inner { width: 14px; height: 14px; border-radius: 50%; }

.reminder-info { flex: 1; display: flex; flex-direction: column; gap: 3px; }
.reminder-name { font-size: 0.9rem; font-weight: 700; color: #1a1a1a; transition: all 0.3s ease; }
.done-text { text-decoration: line-through; color: #9ca3af; }
.reminder-tags { display: flex; align-items: center; gap: 0.3rem; flex-wrap: wrap; }
.tag-text { font-size: 0.75rem; color: #6b7280; }
.dot-sep { color: #d1d5db; font-size: 0.75rem; }
.tag-pill { font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.5rem; border-radius: 999px; text-transform: capitalize; }
.tag-pill.routine { background: #e8f5e9; color: #2e7d32; }
.tag-pill.urgent { background: #fee2e2; color: #ef4444; }
.tag-pill.routine-orange { background: #fff8e1; color: #f59e0b; }

.card-actions { display: flex; flex-direction: column; align-items: center; gap: 0.4rem; flex-shrink: 0; }
.check-circle { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; }
.check-circle.filled { background: #2e7d32; }
.check-circle.empty { border: 2px solid #e0e3db; }
.delete-reminder-btn { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #fee2e2; border: none; color: #ef4444; cursor: pointer; transition: all 0.2s; }
.delete-reminder-btn:hover { background: #fecaca; }

.fab { position: fixed; bottom: 90px; right: calc(50% - 210px); width: 52px; height: 52px; border-radius: 16px; background: #2e7d32; color: #fff; font-size: 1.6rem; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(46,125,50,0.4); z-index: 50; }

/* Delete confirm */
.confirm-sheet { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; background: #fff; border-radius: 24px 24px 0 0; z-index: 201; }
.confirm-body { padding: 1.5rem 1.25rem 2rem; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; text-align: center; }
.confirm-icon { font-size: 2.5rem; }
.confirm-title { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; margin: 0; }
.confirm-sub { font-size: 0.85rem; color: #6b7280; margin: 0; line-height: 1.5; }
.confirm-btns { display: flex; gap: 0.75rem; width: 100%; margin-top: 0.5rem; }
.cancel-btn { flex: 1; padding: 0.9rem; background: #f5f6f3; border: none; border-radius: 14px; font-size: 0.95rem; font-weight: 700; color: #1a1a1a; cursor: pointer; font-family: inherit; }
.confirm-delete-btn { flex: 1; padding: 0.9rem; background: #ef4444; border: none; border-radius: 14px; font-size: 0.95rem; font-weight: 700; color: #fff; cursor: pointer; font-family: inherit; }

.sheet-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200; }
.bottom-sheet { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; max-height: 90vh; background: #fff; border-radius: 24px 24px 0 0; z-index: 201; display: flex; flex-direction: column; overflow: hidden; }
.drawer-handle { width: 40px; height: 4px; background: #e0e3db; border-radius: 999px; margin: 1rem auto 0.25rem; flex-shrink: 0; }
.drawer-header { display: flex; align-items: center; justify-content: center; padding: 0.5rem 1.25rem 0.25rem; flex-shrink: 0; position: relative; }
.drawer-title { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; }
.drawer-body { flex: 1; overflow-y: auto; padding: 0.75rem 1.25rem 2rem; display: flex; flex-direction: column; gap: 1.1rem; }

.time-date-row { display: flex; gap: 0.75rem; }
.field-group { display: flex; flex-direction: column; }
.field-label { font-size: 0.72rem; font-weight: 700; color: #6b7280; letter-spacing: 0.08em; margin-bottom: 0.5rem; }
.optional { font-weight: 400; color: #9ca3af; font-size: 0.72rem; }
.input-box { background: #f5f6f3; border-radius: 14px; padding: 0.85rem 1rem; display: flex; align-items: center; gap: 0.75rem; border: 1.5px solid transparent; }
.input-box:focus-within { border-color: #2e7d32; background: #f0fdf4; }
.time-box { border: 1.5px solid #2e7d32 !important; background: #f0fdf4 !important; }
.text-input { flex: 1; border: none; background: transparent; outline: none; font-size: 0.95rem; color: #1a1a1a; font-family: inherit; }
.text-input::placeholder { color: #9ca3af; }
.green-text { color: #2e7d32 !important; font-weight: 700; }

.priority-grid { display: flex; gap: 0.75rem; }
.priority-btn { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.4rem; padding: 0.85rem 0.5rem; border-radius: 14px; border: 1.5px solid #e0e3db; background: #f5f6f3; font-size: 0.88rem; font-weight: 600; color: #1a1a1a; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.p-dot { width: 20px; height: 20px; border-radius: 50%; display: block; }
.p-urgent { border-color: #ef4444; background: #fff5f5; }
.p-medium { border-color: #f59e0b; background: #fffbeb; }
.p-low    { border-color: #22c55e; background: #f0fdf4; }

.category-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.cat-btn { padding: 0.5rem 1rem; border-radius: 999px; border: 1.5px solid #e0e3db; background: #fff; font-size: 0.85rem; font-weight: 500; color: #1a1a1a; cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 0.3rem; transition: all 0.2s; }
.cat-btn.selected { border-color: #2e7d32; background: #e8f5e9; color: #2e7d32; font-weight: 700; }

.select-box { position: relative; cursor: pointer; }
.recurring-content { flex: 1; display: flex; flex-direction: column; }
.recurring-title { font-size: 0.95rem; font-weight: 700; color: #1a1a1a; }
.recurring-sub { font-size: 0.75rem; color: #9ca3af; }
.hidden-select { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
.dropdown-arrow { color: #6b7280; font-size: 1rem; }
.gps-btn { font-size: 0.8rem; font-weight: 700; color: #2e7d32; cursor: pointer; flex-shrink: 0; }

.textarea-box { align-items: flex-start; }
.notes-input { flex: 1; border: none; background: transparent; outline: none; font-size: 0.9rem; color: #1a1a1a; font-family: inherit; resize: none; min-height: 70px; width: 100%; }
.notes-input::placeholder { color: #9ca3af; }

.save-btn { width: 100%; background: linear-gradient(0deg, #4EA844 0%, #439940 47.6%, #013119 100%); box-shadow: 0px 4px 4px rgba(0,0,0,0.25); color: #fff; border: none; border-radius: 16px; padding: 1rem; font-size: 1rem; font-weight: 700; cursor: pointer; font-family: inherit; }
.save-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.save-btn:hover { opacity: 0.92; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateX(-50%) translateY(100%); }
</style>