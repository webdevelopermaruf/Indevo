import { createWebHistory, createRouter } from 'vue-router'
import Login from "@/views/auth/Login.vue";
import Onboarding from "@/views/auth/Onboarding.vue";
import Registration from "@/views/auth/Registration.vue";
import {useAuthStore} from "@/stores/auth.store.js";


const routes = [
    { path: '/onboarding', component: Onboarding },
    { path: '/register', component: Registration },
    { path: '/login', component: Login},
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})


router.beforeEach((to, from) => {
    const auth = useAuthStore()
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return '/login'
    }
    return true
})