import { defineStore } from 'pinia'
import {reactive, ref} from 'vue'
import api from "@/services/api.js";
import {useRouter} from "vue-router";

export const useAuthStore = defineStore('auth', () => {
    const initialized = ref(null)
    const user = ref(null)
    const accessToken = ref(null)
    const xp = ref(null)

    const loading = ref(false)
    const error = ref(null)
    const router = useRouter();
    const registerData = ref({
        email: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        password: '',
        confirmPassword: '',
        monthlyIncome: '',
        monthlyTargetSaving: '',
        preferredCurrency: 'USD',
        hobbies: ''
    })

    const LoginData = reactive({
        email: '',
        password: '',
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

    async function fetchXp() {
        try {
            const res = await api.get('/user/me')
            if (res.data.success === true) {
                xp.value = res.data.data.xp
            }
        } catch (err) {
            console.error('Failed to fetch XP', err)
        }
    }

    async function initAuth() {
        clearError()
        try {
            const res = await api.post('/auth/refresh')
            accessToken.value = res.data.data.access_token
            user.value = res.data.data.user
            await fetchXp()
        } catch (err) {
            user.value = null
            accessToken.value = null
        } finally {
            initialized.value = true
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
                await fetchXp()
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

    async function forgotPassword() {
        loading.value = true
        clearError()
        try{
            const response = await api.post('/auth/forgot', {
                email: LoginData.email
            })
            if (response.data.success === true) {
                return true;
            }else{
                setError('Something went wrong. Please try again.')
                return false;
            }
        }catch(err){
            setError('Something went wrong. Please try again.')
        }finally {
            loading.value = false;
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

    async function logout() {
        clearError()
        try {
            await api.get('/auth/logout')
        } catch (err) {
            console.error('Logout request failed', err)
        } finally {
            user.value = null
            accessToken.value = null
            xp.value = null
            await router.push('/login')
        }
    }

    async function nameChange(body){
        loading.value = true
        try{
            const response = await api.post('/user/change/name', body);
            if(response.data.success === true){
                window.location.reload();
            }else{
                setError('Name change failed. Please try again.');
            }
        }catch(err){
            setError('Name change failed. Please try again.')
        }finally {
            loading.value = false
        }
    }

    async function passwordChange(body){
        loading.value = true
        try{
            const res = await api.post('/user/change/password', body);
            if(res.data.success === true){
                await logout();
            }else{
                setError('Password change failed. Please try again.');
            }
        }catch(err){
            setError('Name change failed. Please try again.')
        }finally {
            loading.value = false
        }
    }

    async function preferenceChange(body){
        loading.value = true
        try{
            const res = await api.post('/user/change/preference', body);
            if(res.data.success === true){
                return true;
            }else{
                setError('Preference change failed. Please try again.')
            }
        }catch(err){
            setError('Preference change failed. Please try again.')
        }finally {
            loading.value = false
        }
    }

    return {
        user, accessToken, loading, error, registerData, LoginData, initAuth, forgotPassword,
        login, register, logout, verify, verifyCode, initialized, passwordChange, nameChange,
        preferenceChange, xp, fetchXp
    }
})