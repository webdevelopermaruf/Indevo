// stores/auth.store.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        accessToken: null,
        isAuthenticated: false
    }),

    actions: {
        setAuth(data) {
            this.user = data.user
            this.accessToken = data.token
            this.isAuthenticated = true
        },

        clearAuth() {
            this.user = null
            this.accessToken = null
            this.isAuthenticated = false
        }
    }
})