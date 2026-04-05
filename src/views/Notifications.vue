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
      <span class="date-text">Sunday, Feb 22</span>
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
    <div class="create-goal-row" @click="addGoalOpen = true">
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

    <!-- This Morning -->
    <div class="time-section-label">THIS MORNING</div>
    <div class="reminder-card">
      <div class="reminder-time">
        <span class="time-hour">8:00</span>
        <span class="time-ampm">AM</span>
      </div>
      <div class="reminder-icon-wrap" style="background:#fce4ec;">💊</div>
      <div class="reminder-info">
        <span class="reminder-name done-text">Morning Vitamins</span>
        <div class="reminder-tags">
          <span class="tag-text">Daily</span>
          <span class="dot-sep">·</span>
          <span class="tag-pill routine">Routine</span>
        </div>
      </div>
      <div class="check-circle filled">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
    </div>

    <!-- This Afternoon -->
    <div class="time-section-label">THIS AFTERNOON</div>
    <div class="reminder-card urgent-card">
      <div class="urgent-bar"></div>
      <div class="reminder-time">
        <span class="time-hour red">2:00</span>
        <span class="time-ampm">PM</span>
      </div>
      <div class="reminder-icon-wrap" style="background:#fff8e1;">⚡</div>
      <div class="reminder-info">
        <span class="reminder-name">Pay Electricity Bill</span>
        <div class="reminder-tags">
          <span class="tag-pill urgent">🔴 Urgent</span>
          <span class="dot-sep">·</span>
          <span class="tag-text">One-time</span>
        </div>
      </div>
      <div class="check-circle empty"></div>
    </div>

    <div class="reminder-card">
      <div class="reminder-time">
        <span class="time-hour orange">3:00</span>
        <span class="time-ampm">PM</span>
      </div>
      <div class="reminder-icon-wrap" style="background:#fff8e1;">🧺</div>
      <div class="reminder-info">
        <span class="reminder-name">Do Laundry</span>
        <div class="reminder-tags">
          <span class="tag-text">Every Sunday</span>
          <span class="dot-sep">·</span>
          <span class="tag-pill routine-orange">Routine</span>
        </div>
      </div>
      <div class="check-circle empty"></div>
    </div>

    <!-- FAB -->
    <button class="fab" @click="drawerOpen = true">＋</button>

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

            <button class="save-btn" @click="handleSave">Save Reminder</button>

          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Add Goal Bottom Sheet -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="addGoalOpen" class="sheet-overlay" @click.self="addGoalOpen = false"></div>
      </Transition>
      <Transition name="slide-up">
        <div v-if="addGoalOpen" class="bottom-sheet">
          <div class="drawer-handle"></div>
          <div class="drawer-header">
            <button class="back-btn" style="position:absolute;left:1.25rem;" @click="addGoalOpen = false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <h2 class="drawer-title">Add Goals</h2>
          </div>
          <div class="drawer-body">

            <!-- Goal Name -->
            <div class="field-group">
              <label class="field-label">GOAL NAME</label>
              <div class="input-box">
                <input v-model="goalForm.name" type="text" placeholder="e.g. Read 12 books this year" class="text-input" />
              </div>
            </div>

            <!-- Goal Deadline -->
            <div class="field-group">
              <label class="field-label">GOAL DEADLINE</label>
              <div class="time-date-row">
                <div class="input-box" style="flex:1">
                  <input v-model="goalForm.deadlineDate" type="date" class="text-input" />
                </div>
                <div class="input-box" style="flex:1">
                  <input v-model="goalForm.deadlineTime" type="time" class="text-input" />
                </div>
              </div>
            </div>

            <!-- Goal Type -->
            <div class="field-group">
              <label class="field-label">GOAL TYPE</label>
              <div class="goal-type-grid">
                <button
                    v-for="type in goalTypes" :key="type.value"
                    class="type-tile"
                    :class="{ active: goalForm.type === type.value }"
                    @click="goalForm.type = type.value"
                >
                  <span class="type-emoji">{{ type.emoji }}</span>
                  <span class="type-label">{{ type.label }}</span>
                </button>
              </div>
            </div>

            <!-- Reminders -->
            <div class="field-group">
              <label class="field-label">REMINDERS <span class="optional">(select multiple)</span></label>
              <div class="goal-reminders-list">
                <div
                    v-for="reminder in availableReminders" :key="reminder.id"
                    class="goal-reminder-row"
                    @click="toggleGoalReminder(reminder.id)"
                >
                  <div class="reminder-left-bar" :style="{ background: reminder.barColor }"></div>
                  <div class="reminder-time">
                    <span class="time-hour" :style="{ color: reminder.timeColor }">{{ reminder.hour }}</span>
                    <span class="time-ampm">{{ reminder.period }}</span>
                  </div>
                  <div class="reminder-icon-wrap" :style="{ background: reminder.iconBg }">{{ reminder.icon }}</div>
                  <div class="reminder-info">
                    <span class="reminder-name">{{ reminder.name }}</span>
                    <div class="reminder-tags">
                      <span v-if="reminder.urgent" class="tag-pill urgent">● Urgent</span>
                      <span v-if="reminder.urgent" class="dot-sep">·</span>
                      <span class="tag-text">{{ reminder.recur }}</span>
                      <span v-if="reminder.type" class="dot-sep">·</span>
                      <span v-if="reminder.type" class="tag-pill" :class="reminder.typeClass">{{ reminder.type }}</span>
                    </div>
                  </div>
                  <div class="check-circle" :class="goalForm.reminders.includes(reminder.id) ? 'filled' : 'empty'">
                    <svg v-if="goalForm.reminders.includes(reminder.id)" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div class="field-group">
              <label class="field-label">NOTES <span class="optional">(optional)</span></label>
              <div class="input-box textarea-box">
                <textarea v-model="goalForm.notes" placeholder="Add any extra notes..." class="notes-input"></textarea>
              </div>
            </div>

            <button class="save-btn" @click="handleSaveGoal">Save Goal</button>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const drawerOpen = ref(false)
const addGoalOpen = ref(false)
const dateFocused = ref(false)
const activeFilter = ref('All')

const today = new Date()
const todayFormatted = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const filters = [
  { label: 'All' },
  { label: 'Urgent', dot: '#ef4444' },
  { label: 'Routine', icon: '🔄' },
  { label: 'Task', icon: '✅' },
]

// ── Reminder form ──────────────────────────────────────────
const form = ref({
  title: '',
  priority: 'Urgent',
  type: 'Task',
  date: '',
  time: '',
  frequency: 'one-time',
  place: '',
  notes: ''
})

const types = [
  { icon: '✅', label: 'Task' },
  { icon: '🔄', label: 'Routine' },
  { icon: '👥', label: 'Social' },
]

const freqOptions = [
  { label: 'One-time',     value: 'one-time' },
  { label: 'Daily',        value: 'daily' },
  { label: 'Every Sunday', value: 'weekly-sun' },
  { label: 'Weekly',       value: 'weekly' },
  { label: 'Monthly',      value: 'monthly' },
]

function handleSave() {
  drawerOpen.value = false
}

// ── Goals ──────────────────────────────────────────────────
const goals = ref([])

const goalStats = computed(() => {
  const total   = goals.value.length || 12
  const done    = goals.value.filter(g => g.done).length || 5
  const pending = total - done
  const pct     = total ? Math.round((done / total) * 100) : 55
  return { total, pending, done, pct }
})

const goalForm = ref({
  name: '',
  deadlineDate: '',
  deadlineTime: '09:00',
  type: 'health',
  reminders: [],
  notes: ''
})

const goalTypes = [
  { value: 'health',   emoji: '💪', label: 'Health' },
  { value: 'learning', emoji: '📚', label: 'Learning' },
  { value: 'career',   emoji: '💼', label: 'Career' },
  { value: 'finance',  emoji: '💰', label: 'Finance' },
  { value: 'personal', emoji: '🌱', label: 'Personal' },
  { value: 'other',    emoji: '✨', label: 'Other' },
]

const availableReminders = [
  {
    id: 1, name: 'Pay Electricity Bill', hour: '2:00', period: 'PM',
    icon: '⚡', iconBg: '#ffe0e0', barColor: '#ef4444', timeColor: '#ef4444',
    urgent: true, recur: 'One-time', type: null, typeClass: ''
  },
  {
    id: 2, name: 'Do Laundry', hour: '3:00', period: 'PM',
    icon: '🧺', iconBg: '#fff8e1', barColor: '#f59e0b', timeColor: '#f59e0b',
    urgent: false, recur: 'Every Sunday', type: 'Routine', typeClass: 'routine-orange'
  },
]

function toggleGoalReminder(id) {
  const idx = goalForm.value.reminders.indexOf(id)
  if (idx === -1) goalForm.value.reminders.push(id)
  else goalForm.value.reminders.splice(idx, 1)
}

let nextGoalId = 1
function handleSaveGoal() {
  goals.value.push({ ...goalForm.value, id: nextGoalId++, done: false })
  goalForm.value = { name: '', deadlineDate: '', deadlineTime: '09:00', type: 'health', reminders: [], notes: '' }
  addGoalOpen.value = false
}
</script>

<style scoped>
.reminders-page {
  min-height: 100vh;
  background: #f0f2ee;
  font-family: 'Nunito', 'Segoe UI', sans-serif;
  padding-bottom: 100px;
}

.page-header {
  padding: 1.25rem 1.25rem 0.75rem;
  display: flex; align-items: center; justify-content: space-between;
  background: #f0f2ee;
}

.back-btn { background: none; border: none; cursor: pointer; color: #1a1a1a; padding: 0; display: flex; align-items: center; }
.page-title { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; }

.date-row { display: flex; align-items: center; justify-content: space-between; padding: 0.25rem 1.25rem 1rem; }
.date-text { font-size: 1.3rem; font-weight: 800; color: #1a1a1a; }
.cal-btn { background: none; border: none; cursor: pointer; color: #1a1a1a; display: flex; align-items: center; }

.goals-card {
  margin: 0 1.25rem 1rem;
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  border-radius: 20px; padding: 1.25rem;
}

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
.progress-fill { height: 100%; background: #69f0ae; border-radius: 999px; }

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

.reminder-icon-wrap { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
.reminder-info { flex: 1; display: flex; flex-direction: column; gap: 3px; }
.reminder-name { font-size: 0.9rem; font-weight: 700; color: #1a1a1a; }
.done-text { text-decoration: line-through; color: #9ca3af; }
.reminder-tags { display: flex; align-items: center; gap: 0.3rem; flex-wrap: wrap; }
.tag-text { font-size: 0.75rem; color: #6b7280; }
.dot-sep { color: #d1d5db; font-size: 0.75rem; }
.tag-pill { font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.5rem; border-radius: 999px; }
.tag-pill.routine { background: #e8f5e9; color: #2e7d32; }
.tag-pill.urgent { background: #fee2e2; color: #ef4444; }
.tag-pill.routine-orange { background: #fff8e1; color: #f59e0b; }

.check-circle { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.check-circle.filled { background: #2e7d32; }
.check-circle.empty { border: 2px solid #e0e3db; }

.fab { position: fixed; bottom: 90px; right: calc(50% - 210px); width: 52px; height: 52px; border-radius: 16px; background: #2e7d32; color: #fff; font-size: 1.6rem; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(46,125,50,0.4); z-index: 50; }

/* Bottom Sheet */
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
.save-btn:hover { opacity: 0.92; }

/* Goal Type Grid */
.goal-type-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; }
.type-tile { display: flex; flex-direction: column; align-items: center; padding: 0.85rem 0.5rem; border-radius: 14px; background: #f5f6f3; border: 1.5px solid transparent; cursor: pointer; gap: 0.3rem; transition: all 0.2s; font-family: inherit; }
.type-tile.active { border-color: #2e7d32; background: #eaf4ea; }
.type-emoji { font-size: 1.5rem; }
.type-label { font-size: 0.78rem; color: #555; font-weight: 500; }
.type-tile.active .type-label { color: #2e7d32; font-weight: 700; }

/* Goal Reminders List */
.goal-reminders-list { display: flex; flex-direction: column; gap: 0.6rem; }
.goal-reminder-row { display: flex; align-items: center; gap: 0.75rem; background: #fff; border-radius: 14px; padding: 0.75rem 1rem; box-shadow: 0 1px 4px rgba(0,0,0,0.06); cursor: pointer; position: relative; overflow: hidden; }
.reminder-left-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateX(-50%) translateY(100%); }
</style>