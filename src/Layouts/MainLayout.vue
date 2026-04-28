<template>
  <div class="main-layout">
    <div class="page-content">
      <RouterView />
    </div>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav" ref="navRef">
      <div
          class="nav-indicator"
          :style="{ left: indicatorLeft + 'px' }"
      ></div>

      <div
          v-for="(item, index) in navItems"
          :key="index"
          class="nav-item"
          :class="{ active: activeIndex === index }"
          @click="$router.push(item.path)"
          :ref="el => { if (el) navRefs[index] = el }"
      >
        <!-- Wallet -->
        <svg v-if="index === 0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
          <path d="M18 12a2 2 0 0 0 0 4h3v-4z"/>
        </svg>
        <!-- Bell -->
        <svg v-if="index === 1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <!-- Home -->
        <svg v-if="index === 2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <!-- Briefcase -->
        <svg v-if="index === 3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2"/>
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        </svg>
        <!-- Settings -->
        <svg v-if="index === 4" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const navRefs = ref([])
const navRef = ref(null)
const indicatorLeft = ref(0)

const navItems = [
  { path: '/expenses',      matches: ['/expenses', '/expenses/add'] },
  { path: '/reminders', matches: ['/reminders', '/goals'] },
  { path: '/',     matches: ['/'] },
  { path: '/skills',        matches: ['/skills'] },
  { path: '/settings',      matches: ['/settings'] },
]

const activeIndex = computed(() => {
  // Check exact matches first
  for (let i = 0; i < navItems.length; i++) {
    if (navItems[i].matches.includes(route.path)) return i
  }
  // Check prefix matches for nested routes like /skills/:id
  if (route.path.startsWith('/skills')) return 3
  if (route.path.startsWith('/reminders') || route.path.startsWith('/goals')) return 1
  if (route.path.startsWith('/expenses')) return 0
  // Default to Home
  return 2
})

function updateIndicator() {
  nextTick(() => {
    const el = navRefs.value[activeIndex.value]
    const nav = navRef.value
    if (el && nav) {
      const navRect = nav.getBoundingClientRect()
      const itemRect = el.getBoundingClientRect()
      indicatorLeft.value = itemRect.left - navRect.left + itemRect.width / 2 - 24
    }
  })
}

onMounted(() => updateIndicator())
watch(activeIndex, () => updateIndicator())
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  background-color: #f0f2ee;
  display: flex;
  flex-direction: column;
  max-width: 430px;
  margin: 0 auto;
  position: relative;
}

.page-content {
  flex: 1;
  padding-bottom: 90px;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0.75rem 0.5rem 1.25rem;
  box-shadow: 0 -2px 16px rgba(0,0,0,0.08);
  z-index: 100;
  border-radius: 20px 20px 0 0;
}

.nav-indicator {
  position: absolute;
  top: 50%;
  transform: translateY(-55%);
  width: 48px;
  height: 48px;
  background: var(--indevo-green-gradiant);
  border-radius: 50%;
  transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 14px rgba(46,125,50,0.4);
  z-index: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  color: #9ca3af;
  z-index: 1;
  position: relative;
  transition: color 0.2s;
  flex-shrink: 0;
}

.nav-item.active {
  color: #fff;
}
</style>