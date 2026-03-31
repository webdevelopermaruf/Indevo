<template>
  <div class="auth-layout">
    <div class="auth-card">

      <div class="logo-section">
        <img src="@/assets/indevo-logo.png" alt="InDevo" class="logo" />
      </div>

      <!-- Step Indicator -->
      <div class="step-indicator">
        <div v-for="s in 3" :key="s" class="step-dot" :class="{ active: currentStep >= s }"></div>
      </div>

      <!-- STEP 1: Email -->
      <div v-if="currentStep === 1">
        <h2 class="auth-title">Create an account</h2>
        <p class="auth-subtitle">Enter your email to sign up for this app</p>

        <div class="field">
          <InputText
              v-model="authStore.registerData.email"
              placeholder="email@domain.com"
              type="email"
              class="w-full"
          />
        </div>

        <Button label="Continue" class="btn-primary w-full" @click="async ()=>{
          try{
            const response = await api.post('/auth/check-email', {
              email: authStore.registerData.email
            });
            if(response.data.success === true){
            // Todo: redirect to login page because user is already registered
              router.push('/login')
            }else{
              // Todo: let user go to next tab
              currentStep = 2;
            }
          }catch{
            currentStep = 2;
          }
        }" />

        <p class="signin-link">
          Already have an account?
          <RouterLink to="/login" class="link-black">Sign In</RouterLink>
        </p>

        <div class="divider"><span>or</span></div>

        <Button class="btn-social w-full mb-3">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="social-icon" />
          <span>Continue with Google</span>
        </Button>

        <Button class="btn-social w-full">
          <i class="pi pi-apple social-icon-apple"></i>
          <span>Continue with Apple</span>
        </Button>

        <p class="terms-text">
          By clicking continue, you agree to our
          <a href="#" class="link-plain">Terms of Service</a>
          and <a href="#" class="link-plain">Privacy Policy</a>
        </p>
      </div>

      <!-- STEP 2: Personal Info -->
      <div v-if="currentStep === 2">
        <button class="back-btn" @click="currentStep = 1">
          <i class="pi pi-angle-left"></i>
        </button>

        <h2 class="auth-title">Personal Information</h2>
        <p class="auth-subtitle">Enter your information to sign up for this app</p>

        <div class="field">
          <InputText
              v-model="authStore.registerData.firstName"
              placeholder="First Name"
              class="w-full"
          />
        </div>

        <div class="field">
          <InputText
              v-model="authStore.registerData.lastName"
              placeholder="Last Name"
              class="w-full"
          />
        </div>

        <div class="field">
          <InputText
              v-model="authStore.registerData.dateOfBirth"
              type="date"
              placeholder="Date of Birth"
              class="custom-input"
              @focus="dateFieldFocused = true"
              @blur="dateFieldFocused = !!authStore.registerData.dateOfBirth"
          />
        </div>

        <div class="field">
          <Password
              v-model="authStore.registerData.password"
              placeholder="Password"
              toggleMask
              class="w-full"
              inputClass="w-full"
          />
        </div>

        <div class="field">
          <Password
              v-model="authStore.registerData.confirmPassword"
              placeholder="Re-Type Password"
              :feedback="false"
              toggleMask
              class="w-full"
              inputClass="w-full"
          />
        </div>

        <Button label="Continue" class="btn-primary w-full" @click="()=>{
          // Todo1 v: check fname and lname are should not be empty
          // Todo2: check the dob is should not empty and must be a valid date
          // Todo3: both password should be at least 8 characters and at least a capital a small a special a number.
          // Todo4: both passwords should be same
          // Todo5: let user go to next step
          handleContinue();
        }" />
      </div>

      <!-- STEP 3: Finance & Hobbies -->
      <div v-if="currentStep === 3">
        <button class="back-btn" @click="currentStep = 2">
          <i class="pi pi-angle-left"></i>
        </button>

        <h2 class="auth-title">Finance and Hobbies</h2>
        <p class="auth-subtitle">Enter your information to sign up for this app</p>

        <div class="field">
          <InputText
              v-model="authStore.registerData.monthlyIncome"
              placeholder="Monthly Income"
              class="w-full"
          />
        </div>

        <div class="field">
          <InputText
              v-model="authStore.registerData.monthlyTargetSaving"
              placeholder="Monthly Target Saving"
              class="w-full"
          />
        </div>

        <div class="field select-wrapper">
          <select
              v-model="authStore.registerData.preferredCurrency"
              class="custom-input"
              :class="{ 'is-placeholder': !authStore.registerData.preferredCurrency }"
          >
            <option value="" disabled>Preferred Currency</option>
            <option v-for="c in currencies" :key="c.value" :value="c.value">{{ c.label }}</option>
          </select>
          <span class="select-arrow">▾</span>
        </div>

        <div class="field">
          <InputText
              v-model="authStore.registerData.hobbies"
              placeholder="Hobbies (Ex. Cooking, Sports etc)"
              class="w-full"
          />
        </div>

        <Button
            label="Continue"
            class="btn-primary w-full"
            :loading="authStore.loading"
            @click="handleRegister"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import api from "@/services/api.js";
import {GiveAlert} from "@/services/window.js";

const router = useRouter()
const authStore = useAuthStore()
const currentStep = ref(1)
const dateFieldFocused = ref(false)

if (!authStore.registerData.preferredCurrency) {
  authStore.registerData.preferredCurrency = 'USD'
}

const currencies = [
  { label: 'GBP - British Pound', value: 'GBP' },
  { label: 'USD - US Dollar', value: 'USD' },
  { label: 'EUR - Euro', value: 'EUR' },
  { label: 'CAD - Canadian Dollar', value: 'CAD' },
  { label: 'AUD - Australian Dollar', value: 'AUD' },
]

async function handleRegister() {
  await authStore.register()
  if (!authStore.error) {
    router.push('/dashboard')
  }
}

const isValidPassword = (password) => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
  return regex.test(password)
}

const isValidDate = (date) => {
  return !isNaN(new Date(date).getTime())
}

const handleContinue = () => {
  const data = authStore.registerData

  // Empty field check
  if (!data.firstName || !data.lastName || !data.dateOfBirth) {
    return GiveAlert('All fields are required')
  }

  // Date validation
  if (!isValidDate(data.dateOfBirth)) {
    return GiveAlert('Invalid date of birth')
  }

  // Password length & complexity
  if (!isValidPassword(data.password)) {
    return GiveAlert('Password must be 8+ chars with upper, lower, number, special character')
  }

  // Password match
  if (data.password !== data.confirmPassword) {
    return GiveAlert('Passwords do not match')
  }

  // Success → go next step
  currentStep.value = 3
}


</script>

<style scoped>
@import '@/assets/auth.css';

.logo {
  height: 80px;
  object-fit: contain;
}

.step-indicator {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 1.5rem;
}

.step-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #d1d5db;
  transition: all 0.3s ease;
}

.step-dot.active {
  background: #2e7d32;
  transform: scale(1.2);
}

.link-black {
  color: #1a1a1a;
  text-decoration: none;
  font-weight: 700;
}

.link-black:hover {
  text-decoration: underline;
}

.link-plain {
  color: #030303;
  text-decoration: none;
  font-weight: 400;
}

.link-plain:hover {
  text-decoration: underline;
}

.btn-primary {
  background: linear-gradient(0deg, #4EA844 0%, #439940 47.6%, #013119 100%) !important;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25) !important;
  border: none !important;
  border-radius: 8px !important;
  color: #fff !important;
  font-family: 'Inter', sans-serif !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  padding: 0.8rem 1rem !important;
  cursor: pointer;
  width: 100%;
  margin-top: 0.25rem;
}

.custom-input {
  width: 100%;
  border: 1.5px solid #e0e3db;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  color: #1a1a1a;
  background: #fff;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
  appearance: none;
  -webkit-appearance: none;
}

.custom-input:focus {
  border-color: #2e7d32;
}

.custom-input.is-placeholder {
  color: #9ca3af;
}

.custom-input option {
  color: #1a1a1a;
}

.select-wrapper {
  position: relative;
}

.select-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
  font-size: 1rem;
}
</style>