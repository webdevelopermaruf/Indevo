<script setup>
import {computed, onMounted, ref} from 'vue'
import {useExpenseStore} from "@/stores/expense.store.js";
import {getSymbol} from "@/services/currency.service.js";
import {useAuthStore} from "@/stores/auth.store.js";
import AddExpense from "@/Components/AddExpense.vue";

const drawerOpen = ref(false)

const expenseStore = useExpenseStore();
const today = new Date()
const todayFormatted = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const pad = (n) => String(n).padStart(2, '0');


const CATEGORY_META = {
  food:             { label: 'Food',          color: '#4caf50', icon: '🍕', bg: '#fce4ec' },
  transport:        { label: 'Transport',     color: '#f06292', icon: '🚇', bg: '#e8eaf6' },
  bills:            { label: 'Bills',         color: '#ffa726', icon: '⚡', bg: '#fff8e1' },
  health_entertain: { label: 'Health & Entertain',  color: '#ab47bc', icon: '️💖', bg: '#f3e5f5' },
  health: { label: 'Health',  color: '#ab47bc', icon: '💊', bg: '#f3e5f5' },
  entertainment: { label: 'Entertainment',  color: '#ab47bc', icon: '🎬', bg: '#f3e5f5' },
  other:            { label: 'Other',         color: '#64b5f6', icon: '📦', bg: '#e3f2fd' },
};

const circumference = 2 * Math.PI * 45; // ~283

const breakdown = computed(() => expenseStore.data?.dashboard_expense?.breakdown ?? {});
const totalSpent = computed(() => expenseStore.data?.dashboard_expense?.total_spent ?? 0);
const recentExpenses = computed(() => expenseStore.data?.recent_expenses ?? []);

const legendItems = computed(() =>
    Object.entries(breakdown.value).map(([key, v]) => ({
      key,
      label: CATEGORY_META[key]?.label ?? key,
      color: CATEGORY_META[key]?.color ?? '#999',
      percentage: v.percentage ?? 0,
      amount: v.amount ?? 0,
    }))
);

const donutSegments = computed(() => {
  let offset = 0;
  return legendItems.value
      .filter(i => i.percentage > 0)
      .map(i => {
        const length = (i.percentage / 100) * circumference;
        const seg = { key: i.key, color: i.color, length, offset };
        offset += length;
        return seg;
      });
});

function categoryMeta(key) {
  return CATEGORY_META[key] ?? { label: key, color: '#999', icon: '💵', bg: '#eee' };
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

onMounted(async () => {
  await expenseStore.getExpenses();
})
</script>

<template>
  <div v-if="expenseStore.loading" class="loading-wrap">
    <span>Loading Expenses...</span>
  </div>

  <div v-else class="expenses-page">

    <!-- Header -->
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <h1 class="page-title">Expenses</h1>
      <div style="width:32px"></div>
    </div>

    <!-- Loading / Error -->
    <div v-if="expenseStore.loading" class="state-message">Loading…</div>
    <div v-else-if="expenseStore.error" class="state-message error">{{ expenseStore.error }}</div>

    <template v-else>
      <!-- Spending Breakdown -->
      <div class="card">
        <h2 class="card-title">Spending Breakdown</h2>
        <div class="breakdown-content">
          <div class="donut-wrapper">
            <svg viewBox="0 0 120 120" class="donut-svg">
              <circle
                  v-for="seg in donutSegments"
                  :key="seg.key"
                  cx="60" cy="60" r="45"
                  fill="none"
                  :stroke="seg.color"
                  stroke-width="18"
                  :stroke-dasharray="`${seg.length} ${circumference}`"
                  :stroke-dashoffset="-seg.offset"
                  transform="rotate(-90 60 60)"
              />
            </svg>
            <div class="donut-center">
              <span class="donut-label">Spent</span>
              <span class="donut-amount">{{ getSymbol(totalSpent, ' ') }}</span>
            </div>
          </div>
          <div class="legend">
            <div v-for="item in legendItems" :key="item.key" class="legend-item">
              <span class="legend-dot" :style="{ background: item.color }"></span>
              <span class="legend-name">{{ item.label }}</span>
              <span class="legend-pct">{{ item.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Budgets (static for now) -->
      <div class="section">
        <h2 class="section-title">Category Budgets</h2>
        <div class="budget-card">
          <div class="budget-top">
            <div class="budget-icon" style="background:#fce4ec;">🍕</div>
            <div class="budget-info">
              <span class="budget-name">Food & Dining</span>
              <span class="budget-sub">{{getSymbol(expenseStore.data?.dashboard_expense.breakdown.food.amount)}} of {{ getSymbol(totalSpent) }}</span>
            </div>
            <span class="budget-pct warning">{{getSymbol(expenseStore.data?.dashboard_expense.breakdown.food.percentage)}}%</span>
          </div>
          <div class="budget-bar">
            <div
                class="budget-fill"
                :style="{
                  width: (expenseStore.data?.dashboard_expense.breakdown.food.percentage) + '%',
                  background: 'var(--indevo-green-gradiant)'
                }"
            ></div>
          </div>
        </div>
        <div class="budget-card">
          <div class="budget-top">
            <div class="budget-icon" style="background:#e8eaf6;">🚇</div>
            <div class="budget-info">
              <span class="budget-name">Transport</span>
              <span class="budget-sub">{{getSymbol(expenseStore.data?.dashboard_expense.breakdown.transport.amount)}} of {{ getSymbol(totalSpent) }}</span>
            </div>
            <span class="budget-pct normal">{{getSymbol(expenseStore.data?.dashboard_expense.breakdown.transport.percentage)}}%</span>
          </div>
          <div class="budget-bar">
            <div
                class="budget-fill"
                :style="{
                  width: (expenseStore.data?.dashboard_expense.breakdown.transport.percentage) + '%',
                  background: 'var(--indevo-green-gradiant)'
                }"
            ></div>
          </div>
        </div>
        <div class="budget-card">
          <div class="budget-top">
            <div class="budget-icon" style="background:#fff8e1;">⚡</div>
            <div class="budget-info">
              <span class="budget-name">Bills & Utilities</span>
              <span class="budget-sub">{{getSymbol(expenseStore.data?.dashboard_expense.breakdown.bills.amount)}} of {{ getSymbol(totalSpent) }}</span>
            </div>
            <span class="budget-pct normal">{{getSymbol(expenseStore.data?.dashboard_expense.breakdown.bills.percentage)}}%</span>
          </div>
          <div class="budget-bar">
            <div
                class="budget-fill"
                :style="{
                  width: (expenseStore.data?.dashboard_expense.breakdown.bills.percentage) + '%',
                  background: 'var(--indevo-green-gradiant)'
                }"
            ></div>
          </div>
        </div>
        <div class="budget-card">
          <div class="budget-top">
            <div class="budget-icon" style="background:#fff8e1;">💊</div>
            <div class="budget-info">
              <span class="budget-name">Health & Entertainment</span>
              <span class="budget-sub">{{getSymbol(expenseStore.data?.dashboard_expense.breakdown.health_entertain.amount)}} of {{ getSymbol(totalSpent) }}</span>
            </div>
            <span class="budget-pct normal">{{getSymbol(expenseStore.data?.dashboard_expense.breakdown.health_entertain.percentage)}}%</span>
          </div>
          <div class="budget-bar">
            <div
                class="budget-fill"
                :style="{
                  width: (expenseStore.data?.dashboard_expense.breakdown.health_entertain.percentage) + '%',
                  background: 'var(--indevo-green-gradiant)'
                }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Recent Expenses -->
      <div class="section">
        <h2 class="section-title">Recent Expenses</h2>
        <div class="recent-card">
          <div v-if="recentExpenses.length === 0" class="empty-state">
            No expenses yet. Tap + to add your first one.
          </div>
          <template v-else>
            <template v-for="(item, idx) in recentExpenses" :key="item.id ?? idx">
              <div class="expense-item">
                <div class="expense-icon" :style="{ background: categoryMeta(item.category).bg }">
                  {{ categoryMeta(item.category).icon }}
                </div>
                <div class="expense-info">
                  <span class="expense-name">{{ item.description || item.name }}</span>
                  <span class="expense-sub">{{ formatDate(item.date) }} · {{ categoryMeta(item.category).label }}</span>
                </div>
                <span class="expense-amount">-{{getSymbol('')}}{{ Number(item.amount).toFixed(2) }}</span>
              </div>
              <div v-if="idx < recentExpenses.length - 1" class="expense-divider"></div>
            </template>
          </template>
        </div>
      </div>
    </template>

    <!-- FAB -->
    <button class="fab" @click="drawerOpen = true">＋</button>

    <AddExpense v-model="drawerOpen" />
  </div>
</template>

<style scoped>
.expenses-page {
  min-height: 100vh;
  background: #f0f2ee;
  font-family: 'Nunito', 'Segoe UI', sans-serif;
  padding-bottom: 100px;
}


.back-btn {
  background: none; border: none; cursor: pointer;
  color: #1a1a1a; padding: 0; display: flex; align-items: center;
}

.page-title { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; }

.card { background: #fff; border-radius: 16px; padding: 1.25rem; margin: 0.75rem 1.25rem; }
.card-title { font-size: 1rem; font-weight: 700; color: #1a1a1a; margin-bottom: 1rem; }

.breakdown-content { display: flex; align-items: center; gap: 1.25rem; }

.donut-wrapper { position: relative; width: 120px; height: 120px; flex-shrink: 0; }
.donut-svg { width: 120px; height: 120px; }

.donut-center {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  display: flex; flex-direction: column; align-items: center;
}

.donut-label { font-size: 0.65rem; color: #6b7280; }
.donut-amount { font-size: 0.95rem; font-weight: 800; color: #1a1a1a; }

.legend { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
.legend-item { display: flex; align-items: center; gap: 0.5rem; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.legend-name { flex: 1; font-size: 0.85rem; color: #1a1a1a; }
.legend-pct { font-size: 0.85rem; font-weight: 700; color: #1a1a1a; }

.section { padding: 0 1.25rem; margin-top: 1.25rem; }
.section-title { font-size: 1.1rem; font-weight: 800; color: #1a1a1a; margin-bottom: 0.75rem; }

.budget-card { background: #fff; border-radius: 16px; padding: 1rem 1.25rem; margin-bottom: 0.75rem; }
.budget-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }

.budget-icon {
  width: 40px; height: 40px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; flex-shrink: 0;
}

.budget-info { flex: 1; display: flex; flex-direction: column; }
.budget-name { font-size: 0.9rem; font-weight: 700; color: #1a1a1a; }
.budget-sub { font-size: 0.78rem; color: #6b7280; }

.budget-pct { font-size: 0.82rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 999px; }
.budget-pct.warning { background: #fce4ec; color: #e91e63; }
.budget-pct.normal { background: #e8f5e9; color: #2e7d32; }

.budget-bar { height: 6px; background: #f3f4f6; border-radius: 999px; overflow: hidden; }
.budget-fill { height: 100%; border-radius: 999px; transition: width 0.5s ease; }

.recent-card { background: #fff; border-radius: 16px; padding: 0.5rem 1.25rem; }
.expense-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 0; }

.expense-icon {
  width: 40px; height: 40px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; flex-shrink: 0;
}

.expense-info { flex: 1; display: flex; flex-direction: column; }
.expense-name { font-size: 0.9rem; font-weight: 700; color: #1a1a1a; }
.expense-sub { font-size: 0.75rem; color: #6b7280; }
.expense-amount { font-size: 0.95rem; font-weight: 700; color: #e91e63; }
.expense-divider { height: 1px; background: #f3f4f6; }

.fab {
  position: fixed;
  bottom: 90px;
  right: calc(50% - 200px);
  width: 52px; height: 52px;
  border-radius: 16px;
  background: var(--indevo-green-gradiant);
  color: #fff; font-size: 1.6rem;
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 16px rgba(46,125,50,0.4);
  z-index: 50;
}
@media screen and (max-width: 400px) {
  .fab {
    right: calc(50% - 160px);
  }
}

</style>