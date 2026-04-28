<template>

  <div class="dashboard">
    <Installable/>
    <!-- Header -->
    <div class="header">
      <div class="greeting">
        <p class="good-morning">{{ greeting }} 👋</p>
        <h1 class="user-name">{{ fullName }}</h1>
      </div>
      <div class="avatar">{{ initials }}</div>
    </div>

    <!-- Balance Card -->
    <div class="balance-card">
      <div class="balance-top">
        <span class="balance-label">TOTAL SPENT THIS MONTH</span>
        <span class="balance-date">{{ currentMonthLabel }}</span>
      </div>
      <h2 class="balance-amount">{{ getSymbol('') }}{{ expenseStore.data?.dashboard_expense?.total_spent }}</h2>
      <div class="balance-stats">
        <div class="stat">
          <span class="stat-label">🍔 Food</span>
          <span class="stat-value">{{ getSymbol('') }}{{ breakdown.food?.amount?.toFixed(2) ?? '0.00' }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-label">🚗 Transport</span>
          <span class="stat-value">{{ getSymbol('') }}{{ breakdown.transport?.amount?.toFixed(2) ?? '0.00' }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-label">⚡ Bills</span>
          <span class="stat-value">{{ getSymbol('') }}{{ breakdown.bills?.amount?.toFixed(2) ?? '0.00' }}</span>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="section">
      <h2 class="section-title">Quick Actions</h2>
      <div class="quick-actions">
        <div class="action-item" @click="drawerOpen = true">
          <div class="action-icon" style="background: #e8f5e9;">
            <span style="color: #7c3aed; font-size: 1.5rem;">💳</span>
          </div>
          <span class="action-label">Add Expense</span>
        </div>
        <div class="action-item" @click="$router.push('/reminders')">
          <div class="action-icon" style="background: #fff8e1;">
            <span style="font-size: 1.5rem;">🔔</span>
          </div>
          <span class="action-label">Reminder</span>
        </div>
        <div class="action-item" @click="$router.push('/skills')">
          <div class="action-icon" style="background: #f3e8ff;">
            <span style="font-size: 1.5rem;">🎯</span>
          </div>
          <span class="action-label">New Skill</span>
        </div>
      </div>
    </div>

    <!-- Recent Expenses -->
    <div class="section" style="margin-top:1.5rem">
      <div class="section-header">
        <h2 class="section-title">Recent Expenses</h2>
        <span class="see-all" @click="$router.push('/expenses')">See all →</span>
      </div>

      <div v-if="loadingExpenses" style="text-align:center;padding:1rem;color:#6b7280;font-size:0.85rem">Loading...</div>

      <div v-else-if="recentExpenses.length === 0" class="no-expenses">
        <span>No expenses this month</span>
      </div>

      <div v-else class="expense-list">
        <div v-for="expense in recentExpenses.slice(0, 5)" :key="expense.id" class="expense-item">
          <div class="expense-icon-wrap" :style="{ background: categoryBg(expense.category) }">
            {{ categoryEmoji(expense.category) }}
          </div>
          <div class="expense-info">
            <span class="expense-desc">{{ expense.description }}</span>
            <span class="expense-date">{{ formatExpenseDate(expense.expense_date) }}</span>
          </div>
          <span class="expense-amount">-{{ currency }}{{ parseFloat(expense.amount).toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
  <AddExpense v-model="drawerOpen" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store.js'
import api from '@/services/api.js'
import Installable from "@/installation/Installable.vue";
import AddExpense from "@/Components/AddExpense.vue";
import {useExpenseStore} from "@/stores/expense.store.js";
import {getSymbol} from "@/services/currency.service.js";

const authStore = useAuthStore()
const drawerOpen = ref(false)

const types = [
  { icon: '✅', label: 'Task' },
  { icon: '🔄', label: 'Routine' },
  { icon: '👥', label: 'Social' },
]

const freqOptions = [
  { label: 'One-time', value: 'once' },
  { label: 'Daily',    value: 'daily' },
  { label: 'Weekly',   value: 'weekly' },
]

const expenseStore = useExpenseStore()
const recentExpenses = computed(() => expenseStore.data?.recent_expenses ?? []);
const breakdown = computed(() => expenseStore.data?.dashboard_expense?.breakdown ?? {});


// ── User data ──────────────────────────────────────────────
const fullName = computed(() => {
  const u = authStore.user
  if (!u) return 'Welcome'
  return `${u.firstname ?? ''} ${u.lastname ?? ''}`.trim()
})

const initials = computed(() => {
  const u = authStore.user
  if (!u) return '?'
  return `${u.firstname?.[0] ?? ''}${u.lastname?.[0] ?? ''}`.toUpperCase()
})

const currency = computed(() => {
  const sym = { USD: '$', GBP: '£', EUR: '€' }
  return sym[authStore.user?.currency] ?? '£'
})

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
})

const currentMonthLabel = new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })

// ── Expenses data ──────────────────────────────────────────
const loadingExpenses = ref(false)
const goals = ref([])


// ── Helpers ────────────────────────────────────────────────
function categoryEmoji(cat) {
  const map = { food: '🍔', transport: '🚗', bills: '⚡', entertainment: '🎬', health: '💊', other: '✨' }
  return map[cat?.value ?? cat] ?? '✨'
}

function categoryBg(cat) {
  const map = { food: '#fff8e1', transport: '#e3f2fd', bills: '#fce4ec', entertainment: '#f3e8ff', health: '#e8f5e9', other: '#f5f6f3' }
  return map[cat?.value ?? cat] ?? '#f5f6f3'
}

function formatExpenseDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}



async function fetchGoals() {
  try {
    const res = await api.get('/user/goals')
    if (res.data.success) goals.value = res.data.data ?? []
  } catch (e) {
    console.error('Failed to load goals', e)
  }
}


onMounted(async () => {
  await expenseStore.getExpenses();
  await fetchGoals()
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f0f2ee;
  font-family: 'Nunito', 'Segoe UI', sans-serif;
  padding-bottom: 100px;
}

/* Header */
.header {
  background: var(--indevo-green-gradiant);
  padding: 3rem 1.5rem 6rem;
  display: flex; justify-content: space-between; align-items: flex-start;
}
.good-morning { font-size: 0.95rem; color: rgba(255,255,255,0.85); margin-bottom: 0.25rem; }
.user-name { font-size: 1.6rem; font-weight: 800; color: #fff; }
.avatar { width: 48px; height: 48px; border-radius: 50%; background: #fff; color: #1a1a1a; font-size: 1.2rem; font-weight: 700; display: flex; align-items: center; justify-content: center; }

/* Balance Card */
.balance-card {
  border-radius: 20px; padding: 1.25rem 1.5rem;
  margin: -4rem 1.25rem 1.5rem;
  background: rgb(0 0 0 / 40%);
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

/* Quick Actions */
.section { padding: 0 1.25rem; margin-top: 1rem; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.section-title { font-size: 1.1rem; font-weight: 800; color: #1a1a1a; margin-bottom: 1rem; }
.see-all { font-size: 0.82rem; color: #2e7d32; font-weight: 600; cursor: pointer; margin-bottom: 1rem; }
.quick-actions { display: flex; gap: 0.75rem; justify-content: space-between; }
.action-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; cursor: pointer; }
.action-icon { width: 64px; height: 64px; border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.06); transition: transform 0.15s; }
.action-item:active .action-icon { transform: scale(0.93); }
.action-label { font-size: 0.75rem; font-weight: 500; color: #6b7280; text-align: center; }

/* Recent Expenses */
.no-expenses { text-align: center; padding: 1.5rem; color: #9ca3af; font-size: 0.85rem; background: #fff; border-radius: 16px; }
.expense-list { display: flex; flex-direction: column; gap: 0.5rem; }
.expense-item { background: #fff; border-radius: 14px; padding: 0.85rem 1rem; display: flex; align-items: center; gap: 0.75rem; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
.expense-icon-wrap { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
.expense-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.expense-desc { font-size: 0.9rem; font-weight: 700; color: #1a1a1a; }
.expense-date { font-size: 0.72rem; color: #9ca3af; }
.expense-amount { font-size: 0.95rem; font-weight: 800; color: #ef4444; }


/* Bottom Sheet */
.sheet-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200; }
.bottom-sheet { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; max-height: 90vh; background: #fff; border-radius: 24px 24px 0 0; z-index: 201; display: flex; flex-direction: column; overflow: hidden; }
.drawer-handle { width: 40px; height: 4px; background: #e0e3db; border-radius: 999px; margin: 1rem auto 0.25rem; flex-shrink: 0; }
.drawer-header { display: flex; align-items: center; justify-content: center; padding: 0.5rem 1.25rem 0.25rem; flex-shrink: 0; position: relative; }
.drawer-title { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; }
.drawer-body { flex: 1; overflow-y: auto; padding: 0.75rem 1.25rem 2rem; display: flex; flex-direction: column; gap: 1.1rem; }

.field-group { display: flex; flex-direction: column; }
.field-label { font-size: 0.72rem; font-weight: 700; color: #6b7280; letter-spacing: 0.08em; margin-bottom: 0.5rem; }
.optional { font-weight: 400; color: #9ca3af; }
.input-box { background: #f5f6f3; border-radius: 14px; padding: 0.85rem 1rem; display: flex; align-items: center; gap: 0.75rem; border: 1.5px solid transparent; }
.input-box:focus-within { border-color: #2e7d32; background: #f0fdf4; }
.amount-box { border: 1.5px solid #2e7d32 !important; background: #f0fdf4 !important; }
.text-input { flex: 1; border: none; background: transparent; outline: none; font-size: 0.95rem; color: #1a1a1a; font-family: inherit; width: 100%; }
.text-input::placeholder { color: #9ca3af; }
.currency-sym { font-size: 1rem; font-weight: 700; color: #2e7d32; }
.amount-input { flex: 1; border: none; background: transparent; outline: none; font-size: 1.1rem; font-weight: 700; color: #2e7d32; font-family: inherit; }
.amount-input::placeholder { color: #2e7d32; opacity: 0.6; }

.category-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.cat-btn { padding: 0.5rem 1rem; border-radius: 999px; border: 1.5px solid #e0e3db; background: #fff; font-size: 0.85rem; font-weight: 500; color: #1a1a1a; cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 0.3rem; transition: all 0.2s; }
.cat-btn.selected { border-color: #2e7d32; background: #e8f5e9; color: #2e7d32; font-weight: 700; }

.select-box { position: relative; cursor: pointer; }
.recurring-content { flex: 1; display: flex; flex-direction: column; }
.recurring-title { font-size: 0.95rem; font-weight: 700; color: #1a1a1a; }
.recurring-sub { font-size: 0.75rem; color: #9ca3af; }
.hidden-select { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
.dropdown-arrow { color: #6b7280; font-size: 1rem; }
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