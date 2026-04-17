<template>
  <div class="onboarding" ref="containerRef">

    <!-- Slide Illustrations -->
    <div class="illustration-wrapper">
      <div class="slides-wrapper" :style="{ transform: `translateX(-${currentSlide * slideWidth}px)` }">

        <!-- Slide 1: Finance -->
        <div class="slide-illustration" :style="{ width: slideWidth + 'px' }" style="background: linear-gradient(180deg, #c8e6c9 0%, #f1f8f1 100%);">
          <div class="floating-cards">
            <div class="float-card top-left">
              <span>💷</span>
              <div>
                <p class="float-title">Monthly Budget</p>
                <p class="float-value green">£1,200.00</p>
              </div>
            </div>
            <div class="float-card middle-left">
              <span>🏦</span>
              <div>
                <p class="float-title">Savings Goal</p>
                <p class="float-value green">68%</p>
              </div>
            </div>
            <div class="float-card bottom-right">
              <span>📉</span>
              <div>
                <p class="float-title">Spent This Week</p>
                <p class="float-value green">£86.40</p>
              </div>
            </div>
            <div class="center-circle green-circle">💰</div>
          </div>
        </div>

        <!-- Slide 2: Reminders -->
        <div class="slide-illustration" :style="{ width: slideWidth + 'px' }" style="background: linear-gradient(180deg, #fef3c7 0%, #fffdf5 100%);">
          <div class="floating-cards">
            <div class="float-card top-left">
              <span>⏰</span>
              <div>
                <p class="float-title">Pay Rent · <span class="green">Today</span></p>
              </div>
            </div>
            <div class="float-card middle-left">
              <span>📍</span>
              <div><p class="float-title">Near Tesco</p></div>
            </div>
            <div class="float-card bottom-right">
              <span>✅</span>
              <div><p class="float-title">Buy Groceries</p></div>
            </div>
            <div class="ring-chart">
              <svg viewBox="0 0 160 160" class="ring-svg">
                <circle cx="80" cy="80" r="65" fill="none" stroke="#dce8f0" stroke-width="12"/>
                <circle cx="80" cy="80" r="48" fill="none" stroke="#fdecc8" stroke-width="12"/>
                <circle cx="80" cy="80" r="65" fill="none" stroke="#2e7d32" stroke-width="12"
                        stroke-linecap="round" stroke-dasharray="280 408" stroke-dashoffset="50"
                        transform="rotate(-90 80 80)"/>
                <circle cx="80" cy="80" r="48" fill="none" stroke="#f59e0b" stroke-width="12"
                        stroke-linecap="round" stroke-dasharray="200 301" stroke-dashoffset="30"
                        transform="rotate(-90 80 80)"/>
              </svg>
              <div class="ring-center">
                <span class="tasks-number">8</span>
                <span class="tasks-label">TASKS TODAY</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Slide 3: Skills -->
        <div class="slide-illustration" :style="{ width: slideWidth + 'px' }" style="background: linear-gradient(180deg, #e0e7ff 0%, #f5f5ff 100%);">
          <div class="skills-grid">
            <div class="skill-circle" style="background: #fef3c7;"><span>🍳</span><p>COOKING</p></div>
            <div class="skill-circle" style="background: #f0fdf4;"><span>💰</span><p>FINANCE</p></div>
            <div class="skill-circle" style="background: #ccfbf1;"><span>🧹</span><p>CLEANING</p></div>
            <div class="skill-circle" style="background: #f0fdf4;"><span>🤝</span><p>SOCIAL</p></div>
            <div class="skill-circle" style="background: #fff7ed;"><span>📋</span><p>ADMIN</p></div>
          </div>
          <div class="xp-bar-card">
            <p class="xp-title">🥉 Level 7 — Skill Seeker</p>
            <div class="xp-row">
              <div class="xp-bar"><div class="xp-fill"></div></div>
              <span class="xp-value">⭐ 1,340 XP</span>
            </div>
          </div>
        </div>

        <!-- Slide 4: Goals -->
        <div class="slide-illustration" :style="{ width: slideWidth + 'px' }" style="background: linear-gradient(180deg, #c8e6c9 0%, #f1f8f1 100%);">
          <div class="floating-cards">
            <div class="float-card top-right wide">
              <span>🎯</span>
              <div>
                <p class="float-title bold">Save £500 Emergency Fund</p>
                <span class="goal-badge">Finance · Hard</span>
                <div class="mini-progress"><div class="mini-fill"></div></div>
                <div class="mini-row">
                  <span class="float-sub">£340 saved</span>
                  <span class="float-sub">68% complete</span>
                </div>
              </div>
            </div>
            <div class="float-card bottom-left">
              <span>🎯</span>
              <div>
                <p class="float-title bold">12 Goals</p>
                <p class="float-sub">Active</p>
              </div>
            </div>
            <div class="float-card bottom-right">
              <span style="color: #22c55e;">✅</span>
              <div>
                <p class="float-title bold">5 Done</p>
                <p class="float-sub">This month</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Bottom Content -->
    <div class="bottom-content">

      <div class="badge-pill" :style="{ background: slides[currentSlide].badgeBg }">
        <span>{{ slides[currentSlide].badgeIcon }}</span>
        <span :style="{ color: slides[currentSlide].badgeColor }">{{ slides[currentSlide].badge }}</span>
      </div>

      <h1 class="slide-title" v-html="slides[currentSlide].title"></h1>
      <p class="slide-subtitle">{{ slides[currentSlide].subtitle }}</p>

      <div class="feature-pills">
        <div class="pill" v-for="feature in slides[currentSlide].features" :key="feature.label">
          <span>{{ feature.icon }}</span>
          <span>{{ feature.label }}</span>
        </div>
      </div>

      <div class="dots">
        <div v-for="i in 4" :key="i" class="dot" :class="{ active: currentSlide === i - 1 }"></div>
      </div>

      <button class="btn-onboard" @click="handleBtn">
        {{ currentSlide === 3 ? 'Get Started' : 'Next' }}
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentSlide = ref(0)
const containerRef = ref(null)
const slideWidth = ref(window.innerWidth)

function updateWidth() {
  slideWidth.value = containerRef.value?.offsetWidth || window.innerWidth
}

const checkOnBoard  = () => {
  const state = localStorage.getItem('onboarding')
  if (state == 1) {
    router.push('/');
  }
}

onMounted(() => {
  checkOnBoard();
  updateWidth()
  window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})

const slides = [
  {
    badge: 'FINANCE', badgeIcon: '💰', badgeBg: '#f0fdf4', badgeColor: '#2e7d32',
    title: 'Track Every <span style="color:#2e7d32">Penny</span> with Ease',
    subtitle: "Manage your money like a pro — budget tracker, expense categories, and smart alerts when you're close to your limit.",
    features: [{ icon: '📊', label: 'Micro-Finance Tracking' }, { icon: '🔔', label: 'Spend Alerts' }, { icon: '🎯', label: 'Savings Goals' }]
  },
  {
    badge: 'REMINDERS', badgeIcon: '⏰', badgeBg: '#fff7ed', badgeColor: '#d97706',
    title: 'Never Miss What <span style="color:#2e7d32">Matters</span>',
    subtitle: "Intelligent reminders for bills, chores, and errands. Get location-based alerts when you're near the shops — so nothing slips through the cracks.",
    features: [{ icon: '📍', label: 'Location Reminders' }, { icon: '🔄', label: 'Recurring Tasks' }, { icon: '⚡', label: 'Priority Levels' }]
  },
  {
    badge: 'SKILLS', badgeIcon: '⭐', badgeBg: '#f5f3ff', badgeColor: '#7c3aed',
    title: 'Learn the Skills <span style="color:#2e7d32">No One Taught You</span>',
    subtitle: 'Step-by-step guides for cooking, cleaning, budgeting, and more — with gamified XP rewards so learning actually feels good.',
    features: [{ icon: '📖', label: 'Step-by-step Guides' },{ icon: '🏆', label: 'Earn XP' }, { icon: '🎮', label: 'Gamified Learning' }]
  },
  {
    badge: 'GOALS', badgeIcon: '🎯', badgeBg: '#f0fdf4', badgeColor: '#2e7d32',
    title: 'Set Goals. <span style="color:#2e7d32">Track Progress.</span> Win.',
    subtitle: 'Define your independence goals — from building an emergency fund to landing your first flat — and track every milestone along the way.',
    features: [{ icon: '📈', label: 'Progress Visualisation' }, { icon: '🔔', label: 'Milestone Alerts' }, { icon: '📅', label: 'Tracking' }]
  }
]

function handleBtn() {
  if (currentSlide.value < 3) {
    currentSlide.value++
  } else {
    localStorage.setItem('onboarding', JSON.stringify(1))
    router.push('/login')
  }
}
</script>

<style scoped>
.onboarding {
  min-height: 100vh;
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: #fff;
  font-family: 'Nunito', 'Segoe UI', sans-serif;
  overflow: hidden;
  box-shadow: 0 0 40px rgba(0,0,0,0.12);
}

.illustration-wrapper {
  width: 100%;
  height: 300px;
  overflow: hidden;
  flex-shrink: 0;
}

.slides-wrapper {
  display: flex;
  height: 100%;
  transition: transform 0.4s ease;
}

.slide-illustration {
  height: 100%;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.floating-cards {
  position: relative;
  width: 100%;
  height: 100%;
}

.float-card {
  position: absolute;
  background: #fff;
  border-radius: 16px;
  padding: 0.6rem 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  font-size: 0.82rem;
}

.float-card.top-left { top: 20px; left: 16px; }
.float-card.top-right { top: 20px; right: 16px; }
.float-card.middle-left { top: 50%; left: 16px; transform: translateY(-50%); }
.float-card.bottom-left { bottom: 20px; left: 16px; }
.float-card.bottom-right { bottom: 20px; right: 16px; }
.float-card.wide { max-width: 220px; flex-direction: column; align-items: flex-start; gap: 0.3rem; }

.float-title { font-size: 0.8rem; font-weight: 600; color: #1a1a1a; margin: 0; }
.float-title.bold { font-weight: 700; }
.float-value { font-size: 0.85rem; font-weight: 700; margin: 0; }
.float-sub { font-size: 0.7rem; color: #6b7280; margin: 0; }
.green { color: #2e7d32; }

.center-circle {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 90px; height: 90px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 2.5rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.green-circle { background: #2e7d32; }

.ring-chart {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 160px; height: 160px;
  display: flex; align-items: center; justify-content: center;
}

.ring-svg {
  position: absolute;
  width: 160px; height: 160px;
  top: 0; left: 0;
}

.ring-center {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  z-index: 1;
}

.tasks-number { font-size: 2rem; font-weight: 800; color: #1a1a1a; line-height: 1; }
.tasks-label { font-size: 0.5rem; font-weight: 700; color: #6b7280; letter-spacing: 0.05em; }

.skills-grid {
  display: flex; flex-wrap: wrap; gap: 0.75rem;
  padding: 1.5rem; justify-content: center; align-items: center;
  height: calc(100% - 60px);
}

.skill-circle {
  width: 80px; height: 80px; border-radius: 50%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  font-size: 1.5rem; gap: 2px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.skill-circle p { font-size: 0.5rem; font-weight: 700; color: #6b7280; letter-spacing: 0.05em; margin: 0; }

.xp-bar-card {
  position: absolute; bottom: 16px; left: 16px; right: 16px;
  background: #fff; border-radius: 12px; padding: 0.6rem 0.9rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.xp-title { font-size: 0.82rem; font-weight: 600; color: #1a1a1a; margin: 0 0 6px; }
.xp-row { display: flex; align-items: center; gap: 0.75rem; }
.xp-bar { flex: 1; height: 6px; background: #e5e7eb; border-radius: 999px; overflow: hidden; }
.xp-fill { width: 75%; height: 100%; background: #2e7d32; border-radius: 999px; }
.xp-value { font-size: 0.78rem; font-weight: 700; color: #f59e0b; white-space: nowrap; }

.goal-badge {
  display: inline-block; background: #dcfce7; color: #2e7d32;
  font-size: 0.7rem; font-weight: 600; padding: 2px 8px; border-radius: 999px; margin: 4px 0;
}

.mini-progress { height: 5px; background: #e5e7eb; border-radius: 999px; overflow: hidden; margin: 4px 0; width: 100%; }
.mini-fill { width: 68%; height: 100%; background: #2e7d32; border-radius: 999px; }
.mini-row { display: flex; justify-content: space-between; }

.bottom-content {
  flex: 1; padding: 1.5rem 1.5rem 2rem;
  display: flex; flex-direction: column; align-items: center; text-align: center;
}

.badge-pill {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.35rem 1rem; border-radius: 999px;
  font-size: 0.78rem; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 1rem;
}

.slide-title { font-size: 1.6rem; font-weight: 800; color: #1a1a1a; line-height: 1.25; margin: 0 0 0.75rem; }
.slide-subtitle { font-size: 0.88rem; color: #6b7280; line-height: 1.6; margin: 0 0 1.25rem; }

.feature-pills { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-bottom: 1.5rem; }

.pill {
  display: flex; align-items: center; gap: 0.4rem;
  background: #f0f2ee; border-radius: 999px; padding: 0.4rem 0.9rem;
  font-size: 0.82rem; font-weight: 500; color: #1a1a1a;
}

.dots { display: flex; gap: 6px; margin-bottom: 1.5rem; }
.dot { width: 8px; height: 8px; border-radius: 999px; background: #d1d5db; transition: all 0.3s ease; }
.dot.active { width: 28px; background: #2e7d32; }

.btn-onboard {
  width: 100%;
  background: linear-gradient(90deg, #4EA844 0%, #439940 47.6%, #013119 100%);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  color: #fff; border: none; border-radius: 8px;
  padding: 1rem; font-size: 1rem; font-weight: 700;
  cursor: pointer; font-family: inherit;
}

.btn-onboard:hover { opacity: 0.92; }
</style>