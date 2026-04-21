import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store.js'

const routes = [
    // ── Auth Routes (Guest only) ─────────────────────
    {
        path: '/onboarding',
        name: 'Onboarding',
        component: () => import('@/views/auth/Onboarding.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/auth/Login.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/forgot',
        name: 'Forget',
        component: () => import('@/views/auth/Forget.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/auth/Registration.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/verify',
        name: 'Verify',
        component: () => import('@/views/auth/Verify.vue'),
        meta: { requiresGuest: true }
    },

    // ── Main App Routes (with Bottom Nav Layout) ─────────────────────
    {
        path: '/',
        component: () => import('@/layouts/MainLayout.vue'),
        children: [
            {
                path: '',
                name: 'Dashboard',
                component: () => import('@/views/Dashboard.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'expenses',
                name: 'Expenses',
                component: () => import('@/views/Expense/Expenses.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'expenses/add',
                name: 'AddExpense',
                component: () => import('@/views/Expense/AddExpense.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'notifications',
                name: 'Notifications',
                component: () => import('@/views/User/Notifications.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'goals',
                name: 'Goals',
                component: () => import('@/views/Goal/Goals.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'skills',
                name: 'Skills',
                component: () => import('@/views/Skill/Skills.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'skills/:id',
                name: 'SkillDetail',
                component: () => import('@/views/Skill/SkillDetail.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'skills/:id/mastered',
                name: 'SkillMastered',
                component: () => import('@/views/Skill/SkillMastered.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'settings',
                name: 'Settings',
                component: () => import('@/views/User/Settings.vue'),
                meta: { requiresAuth: true }
            },

            // Optional: Not Found inside the main layout
            // {
            //     path: ':pathMatch(.*)*',
            //     name: 'NotFound',
            //     component: () => import('@/views/NotFound.vue'),
            //     meta: { requiresAuth: true }
            // }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from) => {
    const auth = useAuthStore()

    // Only call initAuth on first load, not after explicit login/logout
    if (!auth.initialized) {
        await auth.initAuth()
    }

    // console.log(auth.accessToken)

    const isAuthenticated = !!auth.accessToken
    if (to.meta.requiresAuth && !isAuthenticated) {
        return { name: 'Login' }
    }

    if (to.meta.requiresGuest && isAuthenticated) {
        return { name: 'Dashboard' }
    }

    return true;
})

export default router