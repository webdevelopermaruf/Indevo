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

    <!-- Stats Bar (clickable filters) -->
    <div class="stats-bar">
      <div class="stat-chip" :class="{ active: activeFilter === 'all' }" @click="activeFilter = 'all'">
        <span class="stat-num">{{ goals.length }}</span>
        <span class="stat-lbl">Total</span>
      </div>
      <div class="stat-chip" :class="{ active: activeFilter === 'pending' }" @click="activeFilter = 'pending'">
        <span class="stat-num">{{ pendingGoals.length }}</span>
        <span class="stat-lbl">Pending</span>
      </div>
      <div class="stat-chip" :class="{ active: activeFilter === 'done' }" @click="activeFilter = 'done'">
        <span class="stat-num green">{{ doneGoals.length }}</span>
        <span class="stat-lbl">Done</span>
      </div>
      <div class="stat-chip">
        <span class="stat-num green">{{ completionPct }}%</span>
        <span class="stat-lbl">Complete</span>
      </div>
    </div>

    <!-- Body -->
    <div class="page-body">

      <div v-if="loading" style="text-align:center;padding:2rem;color:#6b7280">Loading goals...</div>

      <div v-else-if="goals.length === 0" class="empty-state">
        <div class="empty-icon">🎯</div>
        <p class="empty-title">No goals yet</p>
        <p class="empty-sub">Tap + to create your first goal</p>
        <button class="empty-cta" @click="addGoalOpen = true">Create a Goal</button>
      </div>

      <template v-else>
        <div class="filter-label">
          {{ activeFilter === 'all' ? 'ALL GOALS' : activeFilter === 'pending' ? 'PENDING GOALS' : 'COMPLETED GOALS' }}
        </div>

        <div v-if="filteredGoals.length === 0" class="empty-filter">
          <span v-if="activeFilter === 'done'">🎯 No completed goals yet — keep going!</span>
          <span v-else>✅ All goals are completed!</span>
        </div>

        <transition-group name="goal-fade" tag="div" class="goals-list">
          <div v-for="goal in filteredGoals" :key="goal.id" class="goal-card" :class="{ done: goal.is_completed }">
            <div class="goal-card-inner">
              <div class="goal-emoji-wrap" :class="{ 'done-emoji': goal.is_completed }">
                {{ getEmoji(goal.category) }}
              </div>
              <div class="goal-info">
                <span class="goal-name" :class="{ strikethrough: goal.is_completed }">{{ goal.title }}</span>
                <div class="goal-meta">
                  <span v-if="goal.deadline_date" class="goal-deadline">📅 {{ formatDate(goal.deadline_date) }}</span>
                  <span class="goal-type-tag" :class="{ 'done-tag': goal.is_completed }">{{ capitalise(goal.category) }}</span>
                </div>
                <div v-if="goal.reminders && goal.reminders.length > 0" class="goal-progress-row">
                  <div class="goal-prog-bar">
                    <div class="goal-prog-fill" :style="{ width: reminderProgress(goal) + '%' }"></div>
                  </div>
                  <span class="goal-prog-pct">{{ completedReminders(goal) }}/{{ goal.reminders.length }} tasks</span>
                </div>
                <div v-if="goal.note" class="goal-notes">{{ goal.note }}</div>
              </div>

              <!-- Actions -->
              <div class="goal-actions">
                <!-- Complete button -->
                <button
                    class="check-circle"
                    :class="{ filled: goal.is_completed || completingIds.includes(goal.id) }"
                    @click="!goal.is_completed && !completingIds.includes(goal.id) && toggleDone(goal)"
                >
                  <svg v-if="goal.is_completed || completingIds.includes(goal.id)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </button>
                <!-- Delete button -->
                <button class="delete-btn" @click="confirmDelete(goal)" :disabled="deletingIds.includes(goal.id)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14H6L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </transition-group>
      </template>
    </div>

    <!-- Delete Confirmation -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="deleteConfirm" class="sheet-overlay" @click.self="deleteConfirm = null"></div>
      </Transition>
      <Transition name="slide-up">
        <div v-if="deleteConfirm" class="confirm-sheet">
          <div class="drawer-handle"></div>
          <div class="confirm-body">
            <div class="confirm-icon">🗑️</div>
            <h3 class="confirm-title">Delete Goal?</h3>
            <p class="confirm-sub">
              "<strong>{{ deleteConfirm?.title }}</strong>" will be permanently deleted. Its linked reminder will be unlinked.
            </p>
            <div class="confirm-btns">
              <button class="cancel-btn" @click="deleteConfirm = null">Cancel</button>
              <button class="confirm-delete-btn" @click="deleteGoal">Delete</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Add Goal Bottom Sheet -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="addGoalOpen" class="sheet-overlay" @click.self="closeForm"></div>
      </Transition>
      <Transition name="slide-up">
        <div v-if="addGoalOpen" class="bottom-sheet">
          <div class="drawer-handle"></div>
          <div class="drawer-header">
            <button class="back-btn" style="position:absolute;left:1.25rem;" @click="closeForm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <h2 class="drawer-title">Add Goal</h2>
          </div>
          <div class="drawer-body">

            <div class="field-group">
              <label class="field-label">GOAL NAME</label>
              <div class="input-box">
                <input v-model="goalForm.title" type="text" placeholder="e.g. Read 12 books this year" class="text-input" />
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">GOAL DEADLINE</label>
              <div class="time-date-row">
                <div class="input-box" style="flex:1">
                  <input v-model="goalForm.deadline_date" type="date" class="text-input" @change="updateAutoReminder" />
                </div>
                <div class="input-box" style="flex:1">
                  <input v-model="goalForm.deadline_time" type="time" class="text-input" @change="updateAutoReminder" />
                </div>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">GOAL TYPE</label>
              <div class="goal-type-grid">
                <button
                    v-for="type in goalTypes" :key="type.value"
                    class="type-tile"
                    :class="{ active: goalForm.category === type.value }"
                    @click="goalForm.category = type.value; updateAutoReminder()"
                >
                  <span class="type-emoji">{{ type.emoji }}</span>
                  <span class="type-lbl">{{ type.label }}</span>
                </button>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">REMINDER FOR THIS GOAL</label>
              <div class="auto-reminder-card">
                <div class="auto-reminder-top">
                  <div class="auto-reminder-icon">🔔</div>
                  <div class="auto-reminder-info">
                    <span class="auto-reminder-title">{{ autoReminder.description || 'Fill in goal name above' }}</span>
                    <span class="auto-reminder-sub">Auto-created reminder · {{ autoReminder.due_date || 'Set deadline above' }}</span>
                  </div>
                </div>
                <div class="auto-reminder-fields">
                  <div class="field-group">
                    <label class="field-label" style="font-size:0.65rem">REMINDER TIME</label>
                    <div class="input-box" style="padding:0.6rem 0.85rem">
                      <span>⏱️</span>
                      <input v-model="autoReminder.due_time" type="time" class="text-input green-text" />
                    </div>
                  </div>
                  <div class="field-group">
                    <label class="field-label" style="font-size:0.65rem">PRIORITY</label>
                    <div class="priority-grid">
                      <button class="priority-btn" :class="{ 'p-urgent': autoReminder.priority === 'high' }" @click="autoReminder.priority = 'high'">
                        <span class="p-dot" style="background:#ef4444"></span>
                        <span :style="{ color: autoReminder.priority === 'high' ? '#ef4444' : '#1a1a1a' }">High</span>
                      </button>
                      <button class="priority-btn" :class="{ 'p-medium': autoReminder.priority === 'medium' }" @click="autoReminder.priority = 'medium'">
                        <span class="p-dot" style="background:#f59e0b"></span>
                        <span :style="{ color: autoReminder.priority === 'medium' ? '#f59e0b' : '#1a1a1a' }">Medium</span>
                      </button>
                      <button class="priority-btn" :class="{ 'p-low': autoReminder.priority === 'low' }" @click="autoReminder.priority = 'low'">
                        <span class="p-dot" style="background:#22c55e"></span>
                        <span :style="{ color: autoReminder.priority === 'low' ? '#22c55e' : '#1a1a1a' }">Low</span>
                      </button>
                    </div>
                  </div>
                  <div class="field-group">
                    <label class="field-label" style="font-size:0.65rem">RECURRENCE</label>
                    <div class="input-box select-box" style="padding:0.6rem 0.85rem">
                      <span>🔄</span>
                      <div class="recurring-content">
                        <span class="recurring-title">{{ freqOptions.find(r => r.value === autoReminder.recurrence)?.label }}</span>
                      </div>
                      <select v-model="autoReminder.recurrence" class="hidden-select">
                        <option v-for="r in freqOptions" :key="r.value" :value="r.value">{{ r.label }}</option>
                      </select>
                      <span class="dropdown-arrow">▾</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">NOTES <span class="optional">(optional)</span></label>
              <div class="input-box textarea-box">
                <textarea v-model="goalForm.note" placeholder="Add any extra notes..." class="notes-input"></textarea>
              </div>
            </div>

            <button class="save-btn" :disabled="saving" @click="handleSave">
              {{ saving ? 'Saving...' : 'Save Goal' }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import api from '@/services/api.js'

const addGoalOpen = ref(false)
const loading = ref(false)
const saving = ref(false)
const goals = ref([])
const completingIds = ref([])
const deletingIds = ref([])
const deleteConfirm = ref(null)
const activeFilter = ref('all')

// ── Computed ───────────────────────────────────────────────
const pendingGoals  = computed(() => goals.value.filter(g => !g.is_completed))
const doneGoals     = computed(() => goals.value.filter(g => g.is_completed))
const completionPct = computed(() => goals.value.length ? Math.round((doneGoals.value.length / goals.value.length) * 100) : 0)
const filteredGoals = computed(() => {
  if (activeFilter.value === 'pending') return pendingGoals.value
  if (activeFilter.value === 'done')    return doneGoals.value
  return goals.value
})

// ── Goal form ──────────────────────────────────────────────
const goalForm = ref({ title: '', deadline_date: '', deadline_time: '09:00', category: 'health', note: '' })
const autoReminder = ref({ description: '', due_date: '', due_time: '09:00', priority: 'medium', category: 'personal', recurrence: 'once' })

const goalTypes = [
  { value: 'health',   emoji: '💪', label: 'Health' },
  { value: 'learning', emoji: '📚', label: 'Learning' },
  { value: 'career',   emoji: '💼', label: 'Career' },
  { value: 'finance',  emoji: '💰', label: 'Finance' },
  { value: 'personal', emoji: '🌱', label: 'Personal' },
  { value: 'other',    emoji: '✨', label: 'Other' },
]

const freqOptions = [
  { label: 'One-time', value: 'once' },
  { label: 'Daily',    value: 'daily' },
  { label: 'Weekly',   value: 'weekly' },
  { label: 'Monthly',  value: 'monthly' },
]

const categoryMap = { health: 'health', learning: 'learning', career: 'work', finance: 'personal', personal: 'personal', other: 'other' }

function updateAutoReminder() {
  autoReminder.value.description = goalForm.value.title || ''
  autoReminder.value.due_date    = goalForm.value.deadline_date || ''
  autoReminder.value.due_time    = goalForm.value.deadline_time || '09:00'
  autoReminder.value.category    = categoryMap[goalForm.value.category] ?? 'personal'
  if (goalForm.value.deadline_date) {
    const days = Math.ceil((new Date(goalForm.value.deadline_date) - new Date()) / (1000 * 60 * 60 * 24))
    autoReminder.value.priority = days <= 3 ? 'high' : days <= 14 ? 'medium' : 'low'
  }
}

watch(() => goalForm.value.title, val => { autoReminder.value.description = val })

// ── Helpers ────────────────────────────────────────────────
const emojiMap = { health: '💪', learning: '📚', career: '💼', finance: '💰', personal: '🌱', other: '✨' }
const getEmoji  = t => emojiMap[t] || '✨'
const capitalise = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
const formatDate = d => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
const completedReminders = goal => (goal.reminders ?? []).filter(r => r.is_completed).length
const reminderProgress   = goal => {
  const total = (goal.reminders ?? []).length
  return total ? Math.round((completedReminders(goal) / total) * 100) : 0
}

function closeForm() {
  addGoalOpen.value = false
  goalForm.value = { title: '', deadline_date: '', deadline_time: '09:00', category: 'health', note: '' }
  autoReminder.value = { description: '', due_date: '', due_time: '09:00', priority: 'medium', category: 'personal', recurrence: 'once' }
}

// ── API ────────────────────────────────────────────────────
async function fetchGoals() {
  loading.value = true
  try {
    const res = await api.get('/user/goals')
    if (res.data.success) goals.value = res.data.data ?? []
  } catch (e) {
    console.error('Failed to load goals', e)
  } finally {
    loading.value = false
  }
}

async function toggleDone(goal) {
  completingIds.value.push(goal.id)
  try {
    await api.post('/user/update/goal', {
      id:            goal.id,
      title:         goal.title,
      category:      goal.category,
      deadline_date: goal.deadline_date,
      deadline_time: goal.deadline_time,
      note:          goal.note ?? '',
      reminders:     JSON.stringify((goal.reminders ?? []).map(r => r.id)),
      is_completed:  true,
    })
    // Update locally
    const g = goals.value.find(g => g.id === goal.id)
    if (g) g.is_completed = true
    activeFilter.value = 'done'
  } catch (e) {
    console.error('Failed to complete goal', e)
  } finally {
    completingIds.value = completingIds.value.filter(id => id !== goal.id)
  }
}

function confirmDelete(goal) {
  deleteConfirm.value = goal
}

async function deleteGoal() {
  const goal = deleteConfirm.value
  if (!goal) return
  deletingIds.value.push(goal.id)
  deleteConfirm.value = null
  try {
    await api.delete('/user/goal/' + goal.id)
    goals.value = goals.value.filter(g => g.id !== goal.id)
  } catch (e) {
    console.error('Failed to delete goal', e)
  } finally {
    deletingIds.value = deletingIds.value.filter(id => id !== goal.id)
  }
}

async function handleSave() {
  if (!goalForm.value.title.trim() || !goalForm.value.deadline_date || !goalForm.value.deadline_time) return
  saving.value = true
  try {
    let reminderId = null
    if (autoReminder.value.due_date) {
      const reminderRes = await api.post('/user/reminder', {
        description: autoReminder.value.description || goalForm.value.title,
        priority:    autoReminder.value.priority,
        category:    autoReminder.value.category,
        due_date:    autoReminder.value.due_date,
        due_time:    autoReminder.value.due_time,
        recurrence:  autoReminder.value.recurrence,
        note:        goalForm.value.note || null,
      })
      if (reminderRes.data.success) reminderId = reminderRes.data.data.id
    }
    await api.post('/user/goal', {
      title:         goalForm.value.title,
      category:      goalForm.value.category,
      deadline_date: goalForm.value.deadline_date,
      deadline_time: goalForm.value.deadline_time,
      note:          goalForm.value.note || null,
      reminders:     JSON.stringify(reminderId ? [reminderId] : []),
    })
    closeForm()
    activeFilter.value = 'pending'
    await fetchGoals()
  } catch (e) {
    console.error('Failed to save goal', e)
  } finally {
    saving.value = false
  }
}

onMounted(fetchGoals)
</script>

<style scoped>
.goals-page { min-height: 100vh; background: #f0f2ee; font-family: 'Nunito', 'Segoe UI', sans-serif; padding-bottom: 100px; }

.page-header { padding: 1.25rem 1.25rem 0.75rem; display: flex; align-items: center; justify-content: space-between; background: #fff; border-bottom: 1px solid #eee; }
.back-btn { background: none; border: none; cursor: pointer; color: #1a1a1a; padding: 0; display: flex; align-items: center; }
.page-title { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; }
.add-btn { width: 32px; height: 32px; background: #2e7d32; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #fff; }

.stats-bar { display: flex; gap: 0.5rem; padding: 1rem 1.25rem 0; }
.stat-chip { flex: 1; background: #fff; border-radius: 12px; padding: 0.6rem 0.5rem; display: flex; flex-direction: column; align-items: center; gap: 2px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); cursor: pointer; transition: all 0.2s; border: 1.5px solid transparent; }
.stat-chip.active { border-color: #2e7d32; background: #f0fdf4; }
.stat-num { font-size: 1.1rem; font-weight: 800; color: #1a1a1a; }
.stat-num.green { color: #2e7d32; }
.stat-lbl { font-size: 0.6rem; font-weight: 600; color: #9ca3af; letter-spacing: 0.05em; text-transform: uppercase; }

.page-body { padding: 1rem 1.25rem; }
.filter-label { font-size: 0.72rem; font-weight: 700; color: #6b7280; letter-spacing: 0.08em; margin-bottom: 0.75rem; }

.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 55vh; gap: 0.5rem; }
.empty-icon { font-size: 3.5rem; margin-bottom: 0.5rem; }
.empty-title { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; }
.empty-sub { font-size: 0.85rem; color: #9ca3af; }
.empty-cta { margin-top: 1rem; padding: 0.75rem 2rem; background: linear-gradient(135deg, #4EA844, #2e7d32); color: #fff; border: none; border-radius: 14px; font-size: 0.95rem; font-weight: 700; cursor: pointer; font-family: inherit; }
.empty-filter { text-align: center; padding: 2rem; color: #6b7280; font-size: 0.9rem; }

.goals-list { display: flex; flex-direction: column; gap: 0.75rem; }
.goal-card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,0.06); }
.goal-card.done { background: #f9fdf9; }
.goal-card-inner { display: flex; align-items: center; padding: 1rem; gap: 0.75rem; }
.goal-emoji-wrap { width: 44px; height: 44px; border-radius: 12px; background: #f0f5f0; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0; }
.goal-emoji-wrap.done-emoji { background: #e8f5e9; }
.goal-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.goal-name { font-size: 0.95rem; font-weight: 700; color: #1a1a1a; }
.goal-name.strikethrough { text-decoration: line-through; color: #9ca3af; }
.goal-meta { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.goal-deadline { font-size: 0.75rem; color: #6b7280; }
.goal-type-tag { font-size: 0.7rem; font-weight: 700; color: #2e7d32; background: #e8f5e9; padding: 0.15rem 0.5rem; border-radius: 999px; }
.goal-type-tag.done-tag { color: #9ca3af; background: #f3f4f6; }
.goal-notes { font-size: 0.78rem; color: #9ca3af; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.goal-progress-row { display: flex; align-items: center; gap: 0.5rem; margin-top: 2px; }
.goal-prog-bar { flex: 1; height: 5px; background: #e5e7e3; border-radius: 999px; overflow: hidden; }
.goal-prog-fill { height: 100%; background: #2e7d32; border-radius: 999px; transition: width 0.4s ease; }
.goal-prog-pct { font-size: 0.68rem; color: #6b7280; white-space: nowrap; }

.goal-actions { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; flex-shrink: 0; }
.check-circle { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #e0e3db; background: none; cursor: pointer; transition: all 0.2s; }
.check-circle.filled { background: #2e7d32; border-color: #2e7d32; }
.delete-btn { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #fee2e2; border: none; color: #ef4444; cursor: pointer; transition: all 0.2s; }
.delete-btn:hover { background: #fecaca; }
.delete-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Goal fade animation */
.goal-fade-move, .goal-fade-enter-active, .goal-fade-leave-active { transition: all 0.4s ease; }
.goal-fade-enter-from, .goal-fade-leave-to { opacity: 0; transform: translateY(-10px); }

/* Delete confirm sheet */
.confirm-sheet { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; background: #fff; border-radius: 24px 24px 0 0; z-index: 201; }
.confirm-body { padding: 1.5rem 1.25rem 2rem; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; text-align: center; }
.confirm-icon { font-size: 2.5rem; }
.confirm-title { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; margin: 0; }
.confirm-sub { font-size: 0.85rem; color: #6b7280; margin: 0; line-height: 1.5; }
.confirm-btns { display: flex; gap: 0.75rem; width: 100%; margin-top: 0.5rem; }
.cancel-btn { flex: 1; padding: 0.9rem; background: #f5f6f3; border: none; border-radius: 14px; font-size: 0.95rem; font-weight: 700; color: #1a1a1a; cursor: pointer; font-family: inherit; }
.confirm-delete-btn { flex: 1; padding: 0.9rem; background: #ef4444; border: none; border-radius: 14px; font-size: 0.95rem; font-weight: 700; color: #fff; cursor: pointer; font-family: inherit; }

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
.green-text { color: #2e7d32 !important; font-weight: 700; }
.textarea-box { align-items: flex-start; }
.notes-input { flex: 1; border: none; background: transparent; outline: none; font-size: 0.9rem; color: #1a1a1a; font-family: inherit; resize: none; min-height: 70px; width: 100%; }
.notes-input::placeholder { color: #9ca3af; }

.goal-type-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; }
.type-tile { display: flex; flex-direction: column; align-items: center; padding: 0.85rem 0.5rem; border-radius: 14px; background: #f5f6f3; border: 1.5px solid transparent; cursor: pointer; gap: 0.3rem; transition: all 0.2s; font-family: inherit; }
.type-tile.active { border-color: #2e7d32; background: #eaf4ea; }
.type-emoji { font-size: 1.5rem; }
.type-lbl { font-size: 0.78rem; color: #555; font-weight: 500; }
.type-tile.active .type-lbl { color: #2e7d32; font-weight: 700; }

.auto-reminder-card { background: #f0fdf4; border: 1.5px solid #c8e6c9; border-radius: 16px; padding: 1rem; display: flex; flex-direction: column; gap: 1rem; }
.auto-reminder-top { display: flex; align-items: center; gap: 0.75rem; }
.auto-reminder-icon { width: 38px; height: 38px; border-radius: 10px; background: #e8f5e9; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
.auto-reminder-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.auto-reminder-title { font-size: 0.9rem; font-weight: 700; color: #1a1a1a; }
.auto-reminder-sub { font-size: 0.72rem; color: #6b7280; }
.auto-reminder-fields { display: flex; flex-direction: column; gap: 0.75rem; }

.priority-grid { display: flex; gap: 0.5rem; }
.priority-btn { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.3rem; padding: 0.65rem 0.4rem; border-radius: 12px; border: 1.5px solid #e0e3db; background: #fff; font-size: 0.8rem; font-weight: 600; color: #1a1a1a; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.p-dot { width: 16px; height: 16px; border-radius: 50%; display: block; }
.p-urgent { border-color: #ef4444; background: #fff5f5; }
.p-medium { border-color: #f59e0b; background: #fffbeb; }
.p-low    { border-color: #22c55e; background: #f0fdf4; }

.select-box { position: relative; cursor: pointer; }
.recurring-content { flex: 1; }
.recurring-title { font-size: 0.88rem; font-weight: 700; color: #1a1a1a; }
.hidden-select { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
.dropdown-arrow { color: #6b7280; font-size: 1rem; }

.save-btn { width: 100%; background: linear-gradient(0deg, #4EA844 0%, #439940 47.6%, #013119 100%); box-shadow: 0px 4px 4px rgba(0,0,0,0.25); color: #fff; border: none; border-radius: 16px; padding: 1rem; font-size: 1rem; font-weight: 700; cursor: pointer; font-family: inherit; }
.save-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.save-btn:hover { opacity: 0.92; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateX(-50%) translateY(100%); }
</style>