import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const token = ref(localStorage.getItem('token') || null)
    const loading = ref(false)
    const error = ref(null)

    const registerData = ref({
        email: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        password: '',
        confirmPassword: '',
        monthlyIncome: '',
        monthlyTargetSaving: '',
        preferredCurrency: '',
        hobbies: ''
    })

    function setError(msg) {
        error.value = msg
    }

    function clearError() {
        error.value = null
    }

    async function login(email, password) {
        loading.value = true
        clearError()
        try {
            console.log('Login with:', email, password)
        } catch (err) {
            setError('Login failed. Please try again.')
        } finally {
            loading.value = false
        }
    }

    async function register() {
        loading.value = true
        clearError()
        try {
            console.log('Register with:', registerData.value)
        } catch (err) {
            setError('Registration failed. Please try again.')
        } finally {
            loading.value = false
        }
    }

    function logout() {
        user.value = null
        token.value = null
        localStorage.removeItem('token')
    }

    return {
        user, token, loading, error, registerData,
        login, register, logout, setError, clearError
    }
})
