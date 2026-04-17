<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogin() {
  await authStore.login()
  if (!authStore.error) {

  }
}
</script>
<template>
  <div class="auth-layout">
    <div class="auth-card">

      <div class="logo-section">
        <img src="@/assets/indevo-logo.png" alt="InDevo" class="logo" />
      </div>

      <h2 class="auth-title">Welcome Back</h2>
      <p class="auth-subtitle">Enter your email to sign in for this app</p>
      <div v-if="authStore.error" style="color: red; text-align: center; margin-bottom: 1rem;">
        {{ authStore.error }}
      </div>
      <div class="field">

        <InputText
            v-model="authStore.LoginData.email"
            placeholder="Email or username"
            type="email"
            class="w-full"
        />
      </div>

      <div class="field">
        <Password
            v-model="authStore.LoginData.password"
            placeholder="Password"
            :feedback="false"
            toggleMask
            class="w-full"
            inputClass="w-full"
        />
      </div>

      <Button
          label="Sign In"
          class="btn-primary w-full"
          :loading="authStore.loading"
          @click="handleLogin"
      />

      <p class="forgot-text">Forgot Password?</p>

      <div class="divider"><span>or</span></div>

      <Button class="btn-social w-full mb-3">
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="social-icon" />
        <span>Continue with Google</span>
      </Button>

      <Button class="btn-social w-full">
        <i class="pi pi-apple social-icon-apple"></i>
        <span>Continue with Apple</span>
      </Button>

      <p class="signin-link">
        Don't have an account?
        <RouterLink to="/register" class="link-black font-bold">Sign Up</RouterLink>
      </p>

    </div>
  </div>
</template>


<style scoped>
@import '@/assets/auth.css';

.logo {
  height: 80px;
  object-fit: contain;
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

.forgot-text {
  text-align: center;
  font-size: 0.88rem;
  color: #6b7280;
  margin: 0.75rem 0 0;
  cursor: pointer;
}

.forgot-text:hover {
  color: #2e7d32;
}

.font-bold {
  font-weight: 700;
}

.link-black {
  color: #1a1a1a;
  text-decoration: none;
  font-weight: 700;
}

.link-black:hover {
  text-decoration: underline;
}
</style>