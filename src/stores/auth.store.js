import { defineStore } from 'pinia'
import {reactive, ref} from 'vue'
import api from "@/services/api.js";
import {useRouter} from "vue-router";

export const useAuthStore = defineStore('auth', () => {
    const initialized = ref(null)
    const user = ref(null)
    const accessToken = ref(null)

    const loading = ref(false)
    const error = ref(null)
    const router = useRouter();
    const registerData = ref({
        email: 'marufmd5040@gmail.com',
        firstName: 'Md',
        lastName: 'Maruf',
        dateOfBirth: '2004-11-08',
        password: 'Sample@1234',
        confirmPassword: 'Sample@1234',
        monthlyIncome: '1000',
        monthlyTargetSaving: '300',
        preferredCurrency: 'USD',
        hobbies: 'Nothing'
    })

    const LoginData = reactive({
        email: 'marufmd5040@gmail.com',
        password: 'Sample@1234',
    })

    const verify = reactive({
        code: ''
    });

    function setError(msg) {
        error.value = msg
    }

    function clearError() {
        error.value = null
    }

    async function initAuth() {
        try {
            const res = await api.post('/auth/refresh')
            accessToken.value = res.data.data.access_token
            user.value = res.data.data.user
        } catch (err) {
            user.value = null
            accessToken.value = null
        } finally {
            initialized.value = true  // ← always mark done, success or fail
        }
    }

    async function login() {
        loading.value = true
        clearError()
        try {
            const response = await api.post('/auth/login', {
                email: LoginData.email,
                password: LoginData.password
            })
            if (response.data.success === true) {
                accessToken.value = response.data.data.access_token
                user.value = response.data.data.user
                await router.push({ name: 'Dashboard' })
            } else {
                setError(response.data.message)
            }
        } catch (err) {
            console.error(err)
            setError('Login failed. Please try again.')
        } finally {
            loading.value = false
        }
    }

    async function register() {
        loading.value = true
        clearError()
        try {
            const response = await api.post('/auth/registration', {
                currency: registerData.value.preferredCurrency,
                firstname: registerData.value.firstName,
                lastname: registerData.value.lastName,
                email: registerData.value.email,
                password: registerData.value.password,
                password_confirmation: registerData.value.confirmPassword,
                dob: registerData.value.dateOfBirth,
                income: registerData.value.monthlyIncome,
                savings: registerData.value.monthlyTargetSaving,
                hobbies: registerData.value.hobbies
            });

            if(response.data.success === true){
                router.push('/verify');
            }else{
                setError(response.data.message);
            }

        } catch (err) {
            setError('Registration failed. Please try again.')
        } finally {
            loading.value = false
        }
    }

    async function verifyCode() {
        loading.value = true
        clearError()
        try {
            const response = await api.post('/auth/verify', {
                email: registerData.value.email,
                code: verify.code,
            });

            if(response.data.success === true){
                router.push('/');
            }else{
                setError(response.data.message);
            }

        } catch (err) {
            setError('Email Verification failed. Please try again.')
        } finally {
            loading.value = false
        }
    }

    function logout() {
        user.value = null
        accessToken.value = null
        localStorage.removeItem('token')
    }

    return {
        user, accessToken, loading, error, registerData, LoginData, initAuth,
        login, register, logout, setError, clearError, verify, verifyCode, initialized
    }
})
