<script setup>
import {computed, ref} from "vue";
import {useAuthStore} from "@/stores/auth.store.js";
import {useExpenseStore} from "@/stores/expense.store.js";
import {getSymbol} from "@/services/currency.service.js";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])
const expenseStore = useExpenseStore();

const closeDrawer = () => {
  emit('update:modelValue', false)
}

const today = new Date()
const todayFormatted = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const dateFocused = ref(false)

const pad = (n) => String(n).padStart(2, '0');

const form = ref({
  description: '',
  amount: '',
  category: 'food',
  currency: useAuthStore().user.currency,
  expense_date: `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`,
  recurring: 'once',
  note: ''
})

const categories = [
  { icon: '🍕', label: 'Food', value: 'food' },
  { icon: '🚇', label: 'Transport', value: 'transport' },
  { icon: '⚡', label: 'Bills', value: 'bills' },
  { icon: '🎬', label: 'Entertain', value: 'entertainment' },
  { icon: '💊', label: 'Health', value: 'health' },
  { icon: '➕', label: 'Other', value: 'other' },
]

const recurringOptions = [
  { label: 'One-time', value: 'one-time' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
]

async function handleSave() {
  closeDrawer();
  await expenseStore.addExpense(form.value);
  await expenseStore.getExpenses();
}


</script>
<template>
  <!-- Custom Bottom Sheet (unchanged) -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="props.modelValue" class="sheet-overlay" @click.self="closeDrawer"></div>
    </Transition>
    <Transition name="slide-up">
      <div v-if="props.modelValue" class="bottom-sheet">
        <div class="drawer-handle"></div>
        <div class="drawer-header">
          <h2 class="drawer-title">Add Expense</h2>
        </div>

        <div class="drawer-body">
          <div class="field-group">
            <label class="field-label">DESCRIPTION</label>
            <div class="input-box">
              <span>📝</span>
              <input v-model="form.description" placeholder="Ex. Coffee, Train Fare..." class="text-input" />
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">AMOUNT</label>
            <div class="input-box amount-box">
              <span class="currency">{{ getSymbol('') }}</span>
              <input v-model="form.amount" type="number" placeholder="0.00" class="amount-input" />
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">CATEGORY</label>
            <div class="category-grid">
              <button
                  v-for="cat in categories"
                  :key="cat.label"
                  class="cat-btn"
                  :class="{ selected: form.category === cat.value }"
                  @click="form.category = cat.value"
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
                  v-model="form.expense_date"
                  :type="dateFocused ? 'date' : 'text'"
                  :placeholder="todayFormatted"
                  class="text-input"
                  @focus="dateFocused = true"
                  @blur="dateFocused = !!form.date"
              />
            </div>
          </div>

          <div class="field-group" style="display:none">
            <label class="field-label">RECURRING</label>
            <div class="input-box select-box">
              <span>🔄</span>
              <div class="recurring-content">
                <span class="recurring-title">{{ recurringOptions.find(r => r.value === form.recurring)?.label || 'One-time' }}</span>
                <span class="recurring-sub">Tap to set frequency</span>
              </div>
              <select v-model="form.recurring" class="hidden-select">
                <option v-for="r in recurringOptions" :key="r.value" :value="r.value">{{ r.label }}</option>
              </select>
              <span class="dropdown-arrow">▾</span>
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">NOTES <span class="optional">(optional)</span></label>
            <div class="input-box textarea-box">
              <textarea v-model="form.notes" placeholder="Add any extra notes..." class="notes-input"></textarea>
            </div>
          </div>

          <button class="save-btn" @click="handleSave">Save</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<style>
/* Bottom Sheet */
.sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 200;
}

.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  max-height: 90vh;
  background: #fff;
  border-radius: 24px 24px 0 0;
  z-index: 201;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: var(--indevo-font-family) !important;
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
}

.drawer-title { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; }

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem 1.25rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

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
  outline: none; font-size: 0.95rem; color: #1a1a1a;
}

.text-input::placeholder { color: #9ca3af; }

.currency { font-size: 1rem; font-weight: 700; color: #2e7d32; }

.amount-input {
  flex: 1; border: none; background: transparent;
  outline: none; font-size: 1.1rem; font-weight: 700;
  color: #2e7d32;
}

.amount-input::placeholder { color: #2e7d32; opacity: 0.6; }

.category-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; }

.cat-btn {
  padding: 0.5rem 1rem; border-radius: 999px;
  border: 1.5px solid #e0e3db; background: #fff;
  font-size: 0.85rem; font-weight: 500; color: #1a1a1a;
  cursor: pointer;
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
  resize: none; min-height: 70px; width: 100%;
}

.notes-input::placeholder { color: #9ca3af; }

.save-btn {
  width: 100%;
  background: linear-gradient(0deg, #4EA844 0%, #439940 47.6%, #013119 100%);
  box-shadow: 0px 4px 4px rgba(0,0,0,0.25);
  color: #fff; border: none; border-radius: 12px;
  padding: 0.9rem 1.5rem; font-size: 1rem; font-weight: 700;
  cursor: pointer;
}

.save-btn:hover { opacity: 0.92; }

body.dark h1, body.dark h2, body.dark h3, body.dark h4, body.dark h5, body.dark h6, body.dark p, body.dark span{
  color: #fff;
}

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateX(-50%) translateY(100%); }
</style>