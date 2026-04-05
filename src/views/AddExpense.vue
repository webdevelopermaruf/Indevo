<template>
  <div class="add-expense-page">

    <!-- Header -->
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <h1 class="page-title">Add Expense</h1>
      <div style="width:32px"></div>
    </div>

    <div class="form-body">

      <!-- Description -->
      <div class="field-group">
        <label class="field-label">DESCRIPTION</label>
        <div class="input-box">
          <span>📝</span>
          <input v-model="form.description" placeholder="Ex. Coffee, Train Fare..." class="text-input" />
        </div>
      </div>

      <!-- Amount -->
      <div class="field-group">
        <label class="field-label">AMOUNT</label>
        <div class="input-box amount-box">
          <span class="currency">$</span>
          <input v-model="form.amount" type="number" placeholder="0.00" class="amount-input" />
        </div>
      </div>

      <!-- Category -->
      <div class="field-group">
        <label class="field-label">CATEGORY</label>
        <div class="category-grid">
          <button
              v-for="cat in categories"
              :key="cat.label"
              class="cat-btn"
              :class="{ selected: form.category === cat.label }"
              @click="form.category = cat.label"
          >
            <span>{{ cat.icon }}</span> {{ cat.label }}
          </button>
        </div>
      </div>

      <!-- Date -->
      <div class="field-group">
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

      <!-- Recurring -->
      <div class="field-group">
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

      <!-- Notes -->
      <div class="field-group">
        <label class="field-label">NOTES <span class="optional">(optional)</span></label>
        <div class="input-box textarea-box">
          <textarea v-model="form.notes" placeholder="Add any extra notes..." class="notes-input"></textarea>
        </div>
      </div>

      <!-- Save Button -->
      <button class="save-btn" @click="handleSave">Save</button>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const dateFocused = ref(false)

const today = new Date()
const todayFormatted = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const form = ref({
  description: '',
  amount: '',
  category: 'Food',
  date: '',
  recurring: 'one-time',
  notes: ''
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
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
]

function handleSave() {
  router.push('/expenses')
}
</script>

<style scoped>
.add-expense-page {
  min-height: 100vh;
  background: #f0f2ee;
  font-family: 'Nunito', 'Segoe UI', sans-serif;
  padding-bottom: 2rem;
}

.page-header {
  padding: 1.25rem 1.25rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f0f2ee;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #1a1a1a;
  padding: 0;
  display: flex;
}

.page-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
}

.form-body {
  padding: 0.5rem 1.25rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  color: #6b7280;
  letter-spacing: 0.08em;
  margin-bottom: 0.5rem;
}

.optional {
  font-weight: 400;
  color: #9ca3af;
}

.input-box {
  background: #fff;
  border-radius: 14px;
  padding: 0.85rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1.5px solid transparent;
}

.input-box:focus-within {
  border-color: #2e7d32;
  background: #f0fdf4;
}

.amount-box {
  border: 1.5px solid #2e7d32;
  background: #f0fdf4;
}

.text-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.95rem;
  color: #1a1a1a;
  font-family: inherit;
}

.text-input::placeholder { color: #9ca3af; }

.currency {
  font-size: 1rem;
  font-weight: 700;
  color: #2e7d32;
}

.amount-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 1.1rem;
  font-weight: 700;
  color: #2e7d32;
  font-family: inherit;
}

.amount-input::placeholder { color: #2e7d32; opacity: 0.6; }

/* Category */
.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.cat-btn {
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: 1.5px solid #e0e3db;
  background: #fff;
  font-size: 0.85rem;
  font-weight: 500;
  color: #1a1a1a;
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.2s;
}

.cat-btn.selected {
  border-color: #f06292;
  background: #fff0f5;
  color: #e91e63;
  font-weight: 700;
}

/* Select box */
.select-box {
  position: relative;
  cursor: pointer;
}

.recurring-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.recurring-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a1a1a;
}

.recurring-sub {
  font-size: 0.75rem;
  color: #9ca3af;
}

.hidden-select {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  opacity: 0;
  cursor: pointer;
}

.dropdown-arrow {
  color: #6b7280;
  font-size: 1rem;
}

/* Textarea */
.textarea-box {
  align-items: flex-start;
}

.notes-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.9rem;
  color: #1a1a1a;
  font-family: inherit;
  resize: none;
  min-height: 80px;
  width: 100%;
}

.notes-input::placeholder { color: #9ca3af; }

/* Save button */
.save-btn {
  width: 130px;
  background: linear-gradient(0deg, #4EA844 0%, #439940 47.6%, #013119 100%);
  box-shadow: 0px 4px 4px rgba(0,0,0,0.25);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 0.9rem 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}

.save-btn:hover { opacity: 0.92; }
</style>