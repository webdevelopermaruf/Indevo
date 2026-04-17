// services/api.js
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    withCredentials: true,
})

// ── Request Interceptor ─────────────────────────────────────────────────────
api.interceptors.request.use(
    async (config) => {
        const { useAuthStore } = await import('@/stores/auth.store')
        const auth = useAuthStore()

        if (auth.accessToken) {
            config.headers.Authorization = `Bearer ${auth.accessToken}`
        }

        return config
    },
    (error) => Promise.reject(error)
)

// ── Response Interceptor ────────────────────────────────────────────────────
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        error ? reject(error) : resolve(token)
    })
    failedQueue = []
}

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`
                    return api(originalRequest)
                })
            }

            isRefreshing = true

            try {
                const { useAuthStore } = await import('@/stores/auth.store')
                const auth = useAuthStore()

                const { data } = await api.post('/auth/refresh')

                // Update store - NO .value needed in Pinia
                auth.accessToken = data.data.access_token
                auth.user = data.data.user

                processQueue(null, auth.accessToken)

                originalRequest.headers.Authorization = `Bearer ${auth.accessToken}`
                return api(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError)

                const { useAuthStore } = await import('@/stores/auth.store')
                const auth = useAuthStore()

                auth.accessToken = null
                auth.user = null

                const { default: router } = await import('@/router')
                router.push({ name: 'Login' })

                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)

export default api