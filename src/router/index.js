import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: '/onboarding'
    },
    {
        path: '/onboarding',
        name: 'Onboarding',
        component: () => import('@/views/auth/Onboarding.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/auth/Login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/auth/Registration.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router