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

    // ── Main App (with bottom nav layout) ─────────────────────
    // Uses a non-matching base path so it doesn't conflict with '/'
    {
        path: '/:pathMatch(dashboard|expenses|notifications|goals|skills|settings)(.*)*',
        component: () => import('@/layouts/MainLayout.vue'),
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () => import('@/views/Dashboard.vue'),
            },
            {
                path: '/expenses',
                name: 'Expenses',
                component: () => import('@/views/Expenses.vue')
            },
            {
                path: '/expenses/add',
                name: 'AddExpense',
                component: () => import('@/views/AddExpense.vue')
            },
            {
                path: '/notifications',
                name: 'Notifications',
                component: () => import('@/views/Notifications.vue')
            },
            {
                path: '/goals',
                name: 'Goals',
                component: () => import('@/views/Goals.vue')
            },
            {
                path: '/skills',
                name: 'Skills',
                component: () => import('@/views/Skills.vue')
            },
            {
                path: '/skills/:id',
                name: 'SkillDetail',
                component: () => import('@/views/SkillDetail.vue')
            },
            {
                path: '/skills/:id/mastered',
                name: 'SkillMastered',
                component: () => import('@/views/SkillMastered.vue')
            },
            {
                path: '/settings',
                name: 'Settings',
                component: () => import('@/views/Settings.vue')
            }
        ]
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router