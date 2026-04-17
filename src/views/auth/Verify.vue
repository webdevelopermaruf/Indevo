<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import InputOtp from 'primevue/inputotp'
import Button from 'primevue/button'

const router = useRouter()
const authStore = useAuthStore()

async function handleVerify() {
  // await authStore.verifyEmail()
  // if (!authStore.error) {
  //   router.push('/dashboard')
  // }
}
</script>

<template>
  <div class="auth-layout">
    <div class="auth-card">

      <div class="logo-section">
        <img src="@/assets/indevo-logo.png" alt="InDevo" class="logo" />
      </div>

      <section class="auth-verify-body">
        <h2 class="auth-title">Check your email</h2>
        <p class="auth-subtitle">
          We've sent a 6-digit verification code to
          <strong>{{ authStore.verify.email }}</strong>.
          Enter it below to verify your account.
        </p>

        <div v-if="authStore.error" style="color: red; text-align: center; margin-bottom: 1rem;">
          {{ authStore.error }}
        </div>

        <div class="field otp-field">
          <InputOtp
              v-model="authStore.verify.code"
              :length="6"
              integerOnly
          />
        </div>

        <Button
            label="Verify Email"
            class="btn-primary w-full"
            :loading="authStore.loading"
            @click="authStore.verifyCode()"
        />

        <p class="forgot-text" @click="()=>{}">
          Didn't receive a code? <span class="resend-link">Resend</span>
        </p>

        <p class="signin-link">
          Wrong email?
          <RouterLink to="/register" class="link-black font-bold">Go back</RouterLink>
        </p>
      </section>

    </div>
  </div>
</template>

<style scoped>
@import '@/assets/auth.css';

.auth-card {
  display: flex;
  flex-direction: column;
  justify-content: center; /* vertical center */
  min-height: 100vh; /* or whatever height your card should have */
}

.auth-verify-body {
  text-align: center;
}
.logo {
  height: 80px;
  object-fit: contain;
}

.auth-subtitle strong {
  color: #1a1a1a;
  font-weight: 600;
}

.otp-field {
  display: flex;
  justify-content: center;
  margin: 0.5rem 0 1.25rem;
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

.resend-link {
  color: #2e7d32;
  font-weight: 600;
}

.resend-link:hover {
  text-decoration: underline;
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