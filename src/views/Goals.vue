<template>
  <div class="goals-page">

    <!-- Header -->
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <h1 class="page-title">Goals</h1>
      <button class="add-btn" @click="addGoalOpen = true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
    </div>

    <!-- Stats Bar -->
    <div v-if="goals.length > 0" class="stats-bar">
      <div class="stat-chip">
        <span class="stat-num">{{ goals.length }}</span>
        <span class="stat-lbl">Total</span>
      </div>
      <div class="stat-chip">
        <span class="stat-num">{{ goals.filter(g => !g.done).length }}</span>
        <span class="stat-lbl">Pending</span>
      </div>
      <div class="stat-chip">
        <span class="stat-num green">{{ goals.filter(g => g.done).length }}</span>
        <span class="stat-lbl">Done</span>
      </div>
      <div class="stat-chip">
        <span class="stat-num green">{{ goals.length ? Math.round((goals.filter(g=>g.done).length / goals.length)*100) : 0 }}%</span>
        <span class="stat-lbl">Complete</span>
      </div>
    </div>

    <!-- Body -->
    <div class="page-body">

      <!-- Empty State -->
      <div v-if="goals.length === 0" class="empty-state">
        <div class="empty-icon">🎯</div>
        <p class="empty-title">No goals yet</p>
        <p class="empty-sub">Tap + to create your first goal</p>
        <button class="empty-cta" @click="addGoalOpen = true">Create a Goal</button>
      </div>

      <!-- Goals List -->
      <div v-else class="goals-list">
        <div
            v-for="goal in goals"
            :key="goal.id"
            class="goal-card"
            :class="{ done: goal.done }"
        >
          <div class="goal-card-inner">
            <div class="goal-emoji-wrap">{{ getEmoji(goal.type) }}</div>
            <div class="goal-info">
              <span class="goal-name" :class="{ strikethrough: goal.done }">{{ goal.name }}</span>
              <div class="goal-meta">
                <span v-if="goal.deadlineDate" class="goal-deadline">📅 {{ formatDate(goal.deadlineDate) }}</span>
                <span class="goal-type-tag">{{ capitalise(goal.type) }}</span>
              </div>
              <div v-if="goal.notes" class="goal-notes">{{ goal.notes }}</div>
            </div>
            <button class="check-circle" :class="{ filled: goal.done }" @click="toggleDone(goal.id)">
              <svg v-if="goal.done" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

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

            <div class="field-group">
              <label class="field-label">GOAL NAME</label>
              <div class="input-box">
                <input v-model="goalForm.name" type="text" placeholder="e.g. Read 12 books this year" class="text-input" />
              </div>
            </div>

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
                  <span class="type-lbl">{{ type.label }}</span>
                </button>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">REMINDERS <span class="optional">(select multiple)</span></label>
              <div class="goal-reminders-list">
                <div
                    v-for="reminder in availableReminders" :key="reminder.id"
                    class="goal-reminder-row"
                    @click="toggleReminder(reminder.id)"
                >
                  <div class="reminder-left-bar" :style="{ background: reminder.barColor }"></div>
                  <div class="r-time-col">
                    <span class="r-hour" :style="{ color: reminder.timeColor }">{{ reminder.hour }}</span>
                    <span class="r-period">{{ reminder.period }}</span>
                  </div>
                  <div class="r-icon-wrap" :style="{ background: reminder.iconBg }">{{ reminder.icon }}</div>
                  <div class="r-info">
                    <span class="r-name">{{ reminder.name }}</span>
                    <div class="r-tags">
                      <span v-if="reminder.urgent" class="tag-pill urgent">● Urgent</span>
                      <span v-if="reminder.urgent" class="dot-sep">·</span>
                      <span class="tag-text">{{ reminder.recur }}</span>
                      <span v-if="reminder.type" class="dot-sep">·</span>
                      <span v-if="reminder.type" class="tag-pill routine-orange">{{ reminder.type }}</span>
                    </div>
                  </div>
                  <div class="check-circle" :class="{ filled: goalForm.reminders.includes(reminder.id) }">
                    <svg v-if="goalForm.reminders.includes(reminder.id)" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">NOTES <span class="optional">(optional)</span></label>
              <div class="input-box textarea-box">
                <textarea v-model="goalForm.notes" placeholder="Add any extra notes..." class="notes-input"></textarea>
              </div>
            </div>

            <button class="save-btn" @click="handleSave">Save Goal</button>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const addGoalOpen = ref(false)
const goals = ref([])

const goalForm = ref({
  name: '', deadlineDate: '', deadlineTime: '09:00',
  type: 'health', reminders: [], notes: ''
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
  { id: 1, name: 'Pay Electricity Bill', hour: '2:00', period: 'PM', icon: '⚡', iconBg: '#ffe0e0', barColor: '#ef4444', timeColor: '#ef4444', urgent: true, recur: 'One-time', type: null },
  { id: 2, name: 'Do Laundry', hour: '3:00', period: 'PM', icon: '🧺', iconBg: '#fff8e1', barColor: '#f59e0b', timeColor: '#f59e0b', urgent: false, recur: 'Every Sunday', type: 'Routine' },
]

const emojiMap = { health: '💪', learning: '📚', career: '💼', finance: '💰', personal: '🌱', other: '✨' }
const getEmoji = t => emojiMap[t] || '✨'
const capitalise = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
const formatDate = d => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

function toggleReminder(id) {
  const idx = goalForm.value.reminders.indexOf(id)
  if (idx === -1) goalForm.value.reminders.push(id)
  else goalForm.value.reminders.splice(idx, 1)
}

function toggleDone(id) {
  const g = goals.value.find(g => g.id === id)
  if (g) g.done = !g.done
}

let nextId = 1
function handleSave() {
  if (!goalForm.value.name.trim()) return
  goals.value.push({ ...goalForm.value, reminders: [...goalForm.value.reminders], id: nextId++, done: false })
  goalForm.value = { name: '', deadlineDate: '', deadlineTime: '09:00', type: 'health', reminders: [], notes: '' }
  addGoalOpen.value = false
}
</script>

<style scoped>
.goals-page { min-height: 100vh; background: #f0f2ee; font-family: 'Nunito', 'Segoe UI', sans-serif; padding-bottom: 100px; }

.page-header { padding: 1.25rem 1.25rem 0.75rem; display: flex; align-items: center; justify-content: space-between; background: #fff; border-bottom: 1px solid #eee; }
.back-btn { background: none; border: none; cursor: pointer; color: #1a1a1a; padding: 0; display: flex; align-items: center; }
.page-title { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; }
.add-btn { width: 32px; height: 32px; background: #2e7d32; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #fff; }

.stats-bar { display: flex; gap: 0.5rem; padding: 1rem 1.25rem 0; }
.stat-chip { flex: 1; background: #fff; border-radius: 12px; padding: 0.6rem 0.5rem; display: flex; flex-direction: column; align-items: center; gap: 2px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
.stat-num { font-size: 1.1rem; font-weight: 800; color: #1a1a1a; }
.stat-num.green { color: #2e7d32; }
.stat-lbl { font-size: 0.6rem; font-weight: 600; color: #9ca3af; letter-spacing: 0.05em; text-transform: uppercase; }

.page-body { padding: 1rem 1.25rem; }

.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 55vh; gap: 0.5rem; }
.empty-icon { font-size: 3.5rem; margin-bottom: 0.5rem; }
.empty-title { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; }
.empty-sub { font-size: 0.85rem; color: #9ca3af; }
.empty-cta { margin-top: 1rem; padding: 0.75rem 2rem; background: linear-gradient(135deg, #4EA844, #2e7d32); color: #fff; border: none; border-radius: 14px; font-size: 0.95rem; font-weight: 700; cursor: pointer; font-family: inherit; }

.goals-list { display: flex; flex-direction: column; gap: 0.75rem; }
.goal-card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,0.06); transition: opacity 0.2s; }
.goal-card.done { opacity: 0.65; }
.goal-card-inner { display: flex; align-items: center; padding: 1rem; gap: 0.75rem; }
.goal-emoji-wrap { width: 44px; height: 44px; border-radius: 12px; background: #f0f5f0; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0; }
.goal-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.goal-name { font-size: 0.95rem; font-weight: 700; color: #1a1a1a; }
.goal-name.strikethrough { text-decoration: line-through; color: #9ca3af; }
.goal-meta { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.goal-deadline { font-size: 0.75rem; color: #6b7280; }
.goal-type-tag { font-size: 0.7rem; font-weight: 700; color: #2e7d32; background: #e8f5e9; padding: 0.15rem 0.5rem; border-radius: 999px; }
.goal-notes { font-size: 0.78rem; color: #9ca3af; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.check-circle { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 2px solid #e0e3db; background: none; cursor: pointer; transition: all 0.2s; }
.check-circle.filled { background: #2e7d32; border-color: #2e7d32; }

/* Sheet */
.sheet-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200; }
.bottom-sheet { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; max-height: 90vh; background: #fff; border-radius: 24px 24px 0 0; z-index: 201; display: flex; flex-direction: column; overflow: hidden; }
.drawer-handle { width: 40px; height: 4px; background: #e0e3db; border-radius: 999px; margin: 1rem auto 0.25rem; flex-shrink: 0; }
.drawer-header { display: flex; align-items: center; justify-content: center; padding: 0.5rem 1.25rem 0.25rem; flex-shrink: 0; position: relative; }
.drawer-title { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; }
.drawer-body { flex: 1; overflow-y: auto; padding: 0.75rem 1.25rem 2rem; display: flex; flex-direction: column; gap: 1.1rem; }

.field-group { display: flex; flex-direction: column; }
.field-label { font-size: 0.72rem; font-weight: 700; color: #6b7280; letter-spacing: 0.08em; margin-bottom: 0.5rem; }
.optional { font-weight: 400; color: #9ca3af; font-size: 0.72rem; }
.time-date-row { display: flex; gap: 0.75rem; }
.input-box { background: #f5f6f3; border-radius: 14px; padding: 0.85rem 1rem; display: flex; align-items: center; gap: 0.75rem; border: 1.5px solid transparent; }
.input-box:focus-within { border-color: #2e7d32; background: #f0fdf4; }
.text-input { flex: 1; border: none; background: transparent; outline: none; font-size: 0.95rem; color: #1a1a1a; font-family: inherit; width: 100%; }
.text-input::placeholder { color: #9ca3af; }
.textarea-box { align-items: flex-start; }
.notes-input { flex: 1; border: none; background: transparent; outline: none; font-size: 0.9rem; color: #1a1a1a; font-family: inherit; resize: none; min-height: 70px; width: 100%; }
.notes-input::placeholder { color: #9ca3af; }

.goal-type-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; }
.type-tile { display: flex; flex-direction: column; align-items: center; padding: 0.85rem 0.5rem; border-radius: 14px; background: #f5f6f3; border: 1.5px solid transparent; cursor: pointer; gap: 0.3rem; transition: all 0.2s; font-family: inherit; }
.type-tile.active { border-color: #2e7d32; background: #eaf4ea; }
.type-emoji { font-size: 1.5rem; }
.type-lbl { font-size: 0.78rem; color: #555; font-weight: 500; }
.type-tile.active .type-lbl { color: #2e7d32; font-weight: 700; }

.goal-reminders-list { display: flex; flex-direction: column; gap: 0.6rem; }
.goal-reminder-row { display: flex; align-items: center; gap: 0.75rem; background: #fff; border-radius: 14px; padding: 0.75rem 1rem; box-shadow: 0 1px 4px rgba(0,0,0,0.06); cursor: pointer; position: relative; overflow: hidden; }
.reminder-left-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; }
.r-time-col { display: flex; flex-direction: column; align-items: center; min-width: 36px; padding-left: 6px; }
.r-hour { font-size: 0.9rem; font-weight: 800; }
.r-period { font-size: 0.6rem; color: #9ca3af; font-weight: 600; }
.r-icon-wrap { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
.r-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.r-name { font-size: 0.88rem; font-weight: 700; color: #1a1a1a; }
.r-tags { display: flex; align-items: center; gap: 0.3rem; flex-wrap: wrap; }
.tag-text { font-size: 0.72rem; color: #6b7280; }
.dot-sep { color: #d1d5db; font-size: 0.72rem; }
.tag-pill { font-size: 0.68rem; font-weight: 600; padding: 0.12rem 0.45rem; border-radius: 999px; }
.tag-pill.urgent { background: #fee2e2; color: #ef4444; }
.tag-pill.routine-orange { background: #fff8e1; color: #f59e0b; }

.save-btn { width: 100%; background: linear-gradient(0deg, #4EA844 0%, #439940 47.6%, #013119 100%); box-shadow: 0px 4px 4px rgba(0,0,0,0.25); color: #fff; border: none; border-radius: 16px; padding: 1rem; font-size: 1rem; font-weight: 700; cursor: pointer; font-family: inherit; }
.save-btn:hover { opacity: 0.92; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateX(-50%) translateY(100%); }
</style>