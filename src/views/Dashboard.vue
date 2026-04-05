<template>
  <div class="dashboard">

    <!-- Header -->
    <div class="header">
      <div class="greeting">
        <p class="good-morning">Good morning ☀️</p>
        <h1 class="user-name">Alex Johnson</h1>
      </div>
      <div class="avatar">A</div>
    </div>

    <!-- Balance Card -->
    <div class="balance-card">
      <div class="balance-top">
        <span class="balance-label">TOTAL BALANCE</span>
        <span class="balance-date">Feb 26</span>
      </div>
      <h2 class="balance-amount">$4,285.50</h2>
      <div class="balance-stats">
        <div class="stat">
          <span class="stat-label">↑ Income</span>
          <span class="stat-value">$3,500</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-label">↓ Spent</span>
          <span class="stat-value">$3,500</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-label">♦ Saved</span>
          <span class="stat-value">$3,500</span>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="section">
      <h2 class="section-title">Quick Actions</h2>
      <div class="quick-actions">

        <!-- Add Expense → opens bottom sheet -->
        <div class="action-item" @click="expenseDrawerOpen = true">
          <div class="action-icon" style="background: #e8f5e9;">
            <span style="color: #7c3aed; font-size: 1.5rem;">＋</span>
          </div>
          <span class="action-label">Add Expense</span>
        </div>

        <!-- Reminder → goes to /notifications -->
        <div class="action-item" @click="$router.push('/notifications')">
          <div class="action-icon" style="background: #fff8e1;">
            <span style="font-size: 1.5rem;">🔔</span>
          </div>
          <span class="action-label">Reminder</span>
        </div>

        <!-- New Goal → opens Add Goal sheet -->
        <div class="action-item" @click="goalDrawerOpen = true">
          <div class="action-icon" style="background: #f3e8ff;">
            <span style="font-size: 1.5rem;">🎯</span>
          </div>
          <span class="action-label">New Goal</span>
        </div>

        <!-- Analytics → goes to /expenses -->
        <div class="action-item" @click="$router.push('/expenses')">
          <div class="action-icon" style="background: #fce4ec;">
            <span style="font-size: 1.5rem;">📊</span>
          </div>
          <span class="action-label">Analytics</span>
        </div>

      </div>
    </div>

    <!-- ── Add Expense Bottom Sheet ─────────────────────── -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="expenseDrawerOpen" class="sheet-overlay" @click.self="expenseDrawerOpen = false"></div>
      </Transition>
      <Transition name="slide-up">
        <div v-if="expenseDrawerOpen" class="bottom-sheet">
          <div class="drawer-handle"></div>
          <div class="drawer-header">
            <h2 class="drawer-title">Add Expense</h2>
          </div>
          <div class="drawer-body">

            <div class="field-group">
              <label class="field-label">DESCRIPTION</label>
              <div class="input-box">
                <span>📝</span>
                <input v-model="expenseForm.description" placeholder="Ex. Coffee, Train Fare..." class="text-input" />
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">AMOUNT</label>
              <div class="input-box amount-box">
                <span class="currency">$</span>
                <input v-model="expenseForm.amount" type="number" placeholder="0.00" class="amount-input" />
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">CATEGORY</label>
              <div class="category-grid">
                <button
                    v-for="cat in categories" :key="cat.label"
                    class="cat-btn"
                    :class="{ selected: expenseForm.category === cat.label }"
                    @click="expenseForm.category = cat.label"
                >
                  <span>{{ cat.icon }}</span> {{ cat.label }}
                </button>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">DATE</label>
              <div class="input-box">
                <span>📅</span>
                <input
                    v-model="expenseForm.date"
                    :type="dateFocused ? 'date' : 'text'"
                    :placeholder="todayFormatted"
                    class="text-input"
                    @focus="dateFocused = true"
                    @blur="dateFocused = !!expenseForm.date"
                />
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">RECURRING</label>
              <div class="input-box select-box">
                <span>🔄</span>
                <div class="recurring-content">
                  <span class="recurring-title">{{ recurringOptions.find(r => r.value === expenseForm.recurring)?.label || 'One-time' }}</span>
                  <span class="recurring-sub">Tap to set frequency</span>
                </div>
                <select v-model="expenseForm.recurring" class="hidden-select">
                  <option v-for="r in recurringOptions" :key="r.value" :value="r.value">{{ r.label }}</option>
                </select>
                <span class="dropdown-arrow">▾</span>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">NOTES <span class="optional">(optional)</span></label>
              <div class="input-box textarea-box">
                <textarea v-model="expenseForm.notes" placeholder="Add any extra notes..." class="notes-input"></textarea>
              </div>
            </div>

            <button class="save-btn" @click="handleExpenseSave">Save Expense</button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── Add Goal Bottom Sheet ────────────────────────── -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="goalDrawerOpen" class="sheet-overlay" @click.self="goalDrawerOpen = false"></div>
      </Transition>
      <Transition name="slide-up">
        <div v-if="goalDrawerOpen" class="bottom-sheet">
          <div class="drawer-handle"></div>
          <div class="drawer-header">
            <button class="sheet-back-btn" @click="goalDrawerOpen = false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <h2 class="drawer-title">Add Goals</h2>
            <div style="width:32px"></div>
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
              <div class="row-fields">
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
              <label class="field-label">NOTES <span class="optional">(optional)</span></label>
              <div class="input-box textarea-box">
                <textarea v-model="goalForm.notes" placeholder="Add any extra notes..." class="notes-input"></textarea>
              </div>
            </div>

            <button class="save-btn" @click="handleGoalSave">Save Goal</button>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref } from 'vue'

// ── shared ──────────────────────────────────────────────────
const today = new Date()
const todayFormatted = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

// ── expense sheet ───────────────────────────────────────────
const expenseDrawerOpen = ref(false)
const dateFocused = ref(false)

const expenseForm = ref({
  description: '', amount: '', category: 'Food',
  date: '', recurring: 'one-time', notes: ''
})

const categories = [
  { icon: '🍕', label: 'Food' },
  { icon: '🚇', label: 'Transport' },
  { icon: '⚡', label: 'Bills' },
  { icon: '🎬', label: 'Entertain' },
  { icon: '💊', label: 'Health' },
  { icon: '➕', label: 'Other' },
]

const recurringOptions = [
  { label: 'One-time', value: 'one-time' },
  { label: 'Daily',    value: 'daily' },
  { label: 'Weekly',   value: 'weekly' },
  { label: 'Monthly',  value: 'monthly' },
]

function handleExpenseSave() {
  expenseDrawerOpen.value = false
  expenseForm.value = { description: '', amount: '', category: 'Food', date: '', recurring: 'one-time', notes: '' }
}

// ── goal sheet ──────────────────────────────────────────────
const goalDrawerOpen = ref(false)

const goalForm = ref({
  name: '', deadlineDate: '', deadlineTime: '09:00',
  type: 'health', notes: ''
})

const goalTypes = [
  { value: 'health',   emoji: '💪', label: 'Health' },
  { value: 'learning', emoji: '📚', label: 'Learning' },
  { value: 'career',   emoji: '💼', label: 'Career' },
  { value: 'finance',  emoji: '💰', label: 'Finance' },
  { value: 'personal', emoji: '🌱', label: 'Personal' },
  { value: 'other',    emoji: '✨', label: 'Other' },
]

function handleGoalSave() {
  goalDrawerOpen.value = false
  goalForm.value = { name: '', deadlineDate: '', deadlineTime: '09:00', type: 'health', notes: '' }
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f0f2ee;
  font-family: 'Nunito', 'Segoe UI', sans-serif;
  padding-bottom: 80px;
}

/* ── Header ─────────────────────────────────────────────── */
.header {
  background: linear-gradient(160deg, #2e7d32 0%, #1b5e20 100%);
  padding: 3rem 1.5rem 6rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.good-morning { font-size: 0.95rem; color: rgba(255,255,255,0.85); margin-bottom: 0.25rem; }
.user-name { font-size: 1.6rem; font-weight: 800; color: #fff; }

.avatar {
  width: 48px; height: 48px; border-radius: 50%;
  background: #fff; color: #1a1a1a;
  font-size: 1.2rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}

/* ── Balance Card ───────────────────────────────────────── */
.balance-card {
  border-radius: 20px;
  padding: 1.25rem 1.5rem;
  margin: -4rem 1.25rem 1.5rem;
  background: rgba(0,0,0,0.15);
  border: 1px solid rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
}

.balance-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
.balance-label { font-size: 0.75rem; font-weight: 600; color: rgba(255,255,255,0.8); letter-spacing: 0.05em; }
.balance-date { font-size: 0.85rem; color: rgba(255,255,255,0.8); }
.balance-amount { font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 1rem; }

.balance-stats { display: flex; align-items: center; }
.stat { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.stat-label { font-size: 0.75rem; color: rgba(255,255,255,0.75); }
.stat-value { font-size: 0.95rem; font-weight: 700; color: #fff; }
.stat-divider { width: 1px; height: 36px; background: rgba(255,255,255,0.25); margin: 0 1rem; }

/* ── Quick Actions ──────────────────────────────────────── */
.section { padding: 0 1.25rem; margin-top: 1rem; }
.section-title { font-size: 1.1rem; font-weight: 800; color: #1a1a1a; margin-bottom: 1rem; }

.quick-actions { display: flex; gap: 0.75rem; justify-content: space-between; }

.action-item {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; gap: 0.5rem; cursor: pointer;
}

.action-icon {
  width: 64px; height: 64px; border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: transform 0.15s, box-shadow 0.15s;
}

.action-item:active .action-icon {
  transform: scale(0.93);
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

.action-label { font-size: 0.75rem; font-weight: 500; color: #6b7280; text-align: center; }

/* ── Bottom Sheet shared ────────────────────────────────── */
.sheet-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 200;
}

.bottom-sheet {
  position: fixed; bottom: 0;
  left: 50%; transform: translateX(-50%);
  width: 100%; max-width: 430px; max-height: 90vh;
  background: #fff;
  border-radius: 24px 24px 0 0;
  z-index: 201;
  display: flex; flex-direction: column;
  overflow: hidden;
}

.drawer-handle {
  width: 40px; height: 4px;
  background: #e0e3db; border-radius: 999px;
  margin: 1rem auto 0.25rem;
  flex-shrink: 0;
}

.drawer-header {
  display: flex; align-items: center; justify-content: center;
  padding: 0.5rem 1.25rem 0.25rem;
  flex-shrink: 0;
  position: relative;
}

.drawer-title { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; }

.sheet-back-btn {
  position: absolute; left: 1.25rem;
  background: none; border: none; cursor: pointer;
  color: #1a1a1a; display: flex; align-items: center;
  padding: 0;
}

.drawer-body {
  flex: 1; overflow-y: auto;
  padding: 0.75rem 1.25rem 2rem;
  display: flex; flex-direction: column; gap: 1.1rem;
}

/* ── Form Fields ────────────────────────────────────────── */
.field-group { display: flex; flex-direction: column; }

.field-label {
  font-size: 0.72rem; font-weight: 700;
  color: #6b7280; letter-spacing: 0.08em; margin-bottom: 0.5rem;
}

.optional { font-weight: 400; color: #9ca3af; }

.input-box {
  background: #f5f6f3; border-radius: 14px;
  padding: 0.85rem 1rem;
  display: flex; align-items: center; gap: 0.75rem;
  border: 1.5px solid transparent;
}

.input-box:focus-within { border-color: #2e7d32; background: #f0fdf4; }
.amount-box { border: 1.5px solid #2e7d32 !important; background: #f0fdf4 !important; }

.text-input {
  flex: 1; border: none; background: transparent;
  outline: none; font-size: 0.95rem; color: #1a1a1a; font-family: inherit;
  width: 100%;
}

.text-input::placeholder { color: #9ca3af; }
.currency { font-size: 1rem; font-weight: 700; color: #2e7d32; }

.amount-input {
  flex: 1; border: none; background: transparent;
  outline: none; font-size: 1.1rem; font-weight: 700;
  color: #2e7d32; font-family: inherit;
}

.amount-input::placeholder { color: #2e7d32; opacity: 0.6; }

.row-fields { display: flex; gap: 0.75rem; }

.category-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; }

.cat-btn {
  padding: 0.5rem 1rem; border-radius: 999px;
  border: 1.5px solid #e0e3db; background: #fff;
  font-size: 0.85rem; font-weight: 500; color: #1a1a1a;
  cursor: pointer; font-family: inherit;
  display: flex; align-items: center; gap: 0.3rem;
  transition: all 0.2s;
}

.cat-btn.selected { border-color: #f06292; background: #fff0f5; color: #e91e63; font-weight: 700; }

.select-box { position: relative; cursor: pointer; }
.recurring-content { flex: 1; display: flex; flex-direction: column; }
.recurring-title { font-size: 0.95rem; font-weight: 700; color: #1a1a1a; }
.recurring-sub { font-size: 0.75rem; color: #9ca3af; }

.hidden-select {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 100%; opacity: 0; cursor: pointer;
}

.dropdown-arrow { color: #6b7280; font-size: 1rem; }
.textarea-box { align-items: flex-start; }

.notes-input {
  flex: 1; border: none; background: transparent;
  outline: none; font-size: 0.9rem; color: #1a1a1a;
  font-family: inherit; resize: none; min-height: 70px; width: 100%;
}

.notes-input::placeholder { color: #9ca3af; }

/* ── Goal Type Grid ─────────────────────────────────────── */
.goal-type-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; }

.type-tile {
  display: flex; flex-direction: column; align-items: center;
  padding: 0.85rem 0.5rem; border-radius: 14px;
  background: #f5f6f3; border: 1.5px solid transparent;
  cursor: pointer; gap: 0.3rem; transition: all 0.2s; font-family: inherit;
}

.type-tile.active { border-color: #2e7d32; background: #eaf4ea; }
.type-emoji { font-size: 1.5rem; }
.type-lbl { font-size: 0.78rem; color: #555; font-weight: 500; }
.type-tile.active .type-lbl { color: #2e7d32; font-weight: 700; }

/* ── Save Button ────────────────────────────────────────── */
.save-btn {
  width: 100%;
  background: linear-gradient(0deg, #4EA844 0%, #439940 47.6%, #013119 100%);
  box-shadow: 0px 4px 4px rgba(0,0,0,0.25);
  color: #fff; border: none; border-radius: 16px;
  padding: 1rem; font-size: 1rem; font-weight: 700;
  cursor: pointer; font-family: inherit;
}

.save-btn:hover { opacity: 0.92; }

/* ── Transitions ────────────────────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateX(-50%) translateY(100%); }
</style>