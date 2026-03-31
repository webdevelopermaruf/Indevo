// services/api.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth.store'

const api = axios.create({
    baseURL: 'https://indevo-api.hostingersite.com/api/v1',
    withCredentials: true // cookie acceptor
})

// Attach token
api.interceptors.request.use(config => {
    const auth = useAuthStore()
    if (auth.accessToken) {
        config.headers.Authorization = `Bearer ${auth.accessToken}`
    }
    return config
})

// Handle expired token
api.interceptors.response.use(
    res => res,
    async error => {
        const auth = useAuthStore()
        if (error.response?.status === 401) {
            try {
                const res = await axios.post('/auth/refresh', {}, {
                    withCredentials: true
                })

                auth.accessToken = res.data.token
                error.config.headers.Authorization = `Bearer ${res.data.token}`
                return api(error.config)
            } catch {
                auth.clearAuth()
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default api