<template>
  <div class="mastered-page">

    <!-- Header -->
    <div class="page-header">
      <button class="back-btn" @click="$router.push('/skills')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <h1 class="page-title">{{ skill.name }}</h1>
      <div style="width:32px"></div>
    </div>

    <!-- Confetti particles -->
    <div class="confetti-wrap" aria-hidden="true">
      <span v-for="i in 18" :key="i" class="confetti-dot" :style="confettiStyle(i)"></span>
    </div>

    <!-- Content -->
    <div class="mastered-body">
      <div class="party-icon">🎉</div>
      <h2 class="mastered-title">Skill Mastered!</h2>
      <p class="mastered-sub">You've mastered "{{ skill.name }}"! Your skills are growing every day.</p>

      <!-- XP earned pill -->
      <div class="xp-earned">
        <span>⭐</span>
        <span>+{{ skill.xp }} XP Earned!</span>
      </div>

      <!-- Stats row -->
      <div class="stats-row">
        <div class="stat-chip">
          <span class="stat-big">{{ skill.steps }}</span>
          <span class="stat-label">STEPS DONE</span>
        </div>
        <div class="stat-chip">
          <span class="stat-big">~{{ skill.duration }}</span>
          <span class="stat-label-small">min</span>
          <span class="stat-label">EST. TIME</span>
        </div>
        <div class="stat-chip">
          <span class="stat-big">Lv {{ skill.level }}</span>
          <span class="stat-label">SKILL LEVEL</span>
        </div>
      </div>

      <!-- Back to Skills -->
      <button class="back-skills-btn" @click="$router.push('/skills')">
        ‹ Back to Skills
      </button>
    </div>

  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const skillsData = {
  'perfect-pasta': { name: 'Perfect Pasta', xp: 20, steps: 4, duration: '15', level: 4 },
  'monthly-budget': { name: 'Monthly Budget', xp: 40, steps: 5, duration: '30', level: 4 },
  'deep-clean':     { name: 'Deep Clean Home', xp: 25, steps: 6, duration: '20', level: 2 },
  'tax-basics':     { name: 'Tax Basics', xp: 60, steps: 7, duration: '45', level: 1 },
}

const skill = skillsData[route.params.id] || skillsData['monthly-budget']

const confettiColors = ['#f59e0b', '#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#ec4899']

function confettiStyle(i) {
  const color = confettiColors[i % confettiColors.length]
  const left = (i * 5.8 + 2) % 100
  const delay = (i * 0.15) % 1.8
  const size = 6 + (i % 5)
  return {
    left: left + '%',
    background: color,
    width: size + 'px',
    height: size + 'px',
    animationDelay: delay + 's',
    animationDuration: (1.2 + (i % 4) * 0.3) + 's',
  }
}
</script>

<style scoped>
.mastered-page {
  min-height: 100vh;
  background: #fff;
  font-family: 'Nunito', 'Segoe UI', sans-serif;
  display: flex; flex-direction: column;
  position: relative; overflow: hidden;
}

.page-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem 1.25rem 0.75rem;
  border-bottom: 1px solid #eee;
  position: relative; z-index: 2;
}
.back-btn { background: none; border: none; cursor: pointer; color: #1a1a1a; padding: 0; display: flex; align-items: center; }
.page-title { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; }

/* Confetti */
.confetti-wrap {
  position: absolute; top: 60px; left: 0; right: 0;
  height: 200px; overflow: hidden; pointer-events: none; z-index: 1;
}
.confetti-dot {
  position: absolute;
  top: -10px;
  border-radius: 2px;
  animation: confettiFall linear infinite;
}
@keyframes confettiFall {
  0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
  80%  { opacity: 1; }
  100% { transform: translateY(220px) rotate(360deg); opacity: 0; }
}

/* Body */
.mastered-body {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 2rem 1.5rem 3rem;
  gap: 1rem;
  position: relative; z-index: 2;
}

.party-icon {
  font-size: 5rem;
  animation: pop 0.5s cubic-bezier(0.36,0.07,0.19,0.97) both;
}
@keyframes pop {
  0%   { transform: scale(0.5); opacity: 0; }
  70%  { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
}

.mastered-title {
  font-size: 1.8rem; font-weight: 900; color: #1a1a1a;
  text-align: center; margin: 0;
}
.mastered-sub {
  font-size: 0.9rem; color: #6b7280; text-align: center;
  max-width: 280px; line-height: 1.5; margin: 0;
}

/* XP Pill */
.xp-earned {
  display: flex; align-items: center; gap: 0.5rem;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #fff; font-size: 1.1rem; font-weight: 800;
  padding: 0.75rem 2rem; border-radius: 999px;
  box-shadow: 0 4px 20px rgba(245,158,11,0.4);
  animation: slideUp 0.5s 0.2s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}

/* Stats */
.stats-row {
  display: flex; gap: 0.75rem; width: 100%;
  animation: slideUp 0.5s 0.35s cubic-bezier(0.16,1,0.3,1) both;
}
.stat-chip {
  flex: 1; background: #f5f6f3; border-radius: 16px;
  padding: 1rem 0.5rem; display: flex; flex-direction: column;
  align-items: center; gap: 2px;
}
.stat-big { font-size: 1.3rem; font-weight: 900; color: #1a1a1a; line-height: 1; }
.stat-label-small { font-size: 1rem; font-weight: 700; color: #1a1a1a; }
.stat-label {
  font-size: 0.6rem; font-weight: 700; color: #9ca3af;
  letter-spacing: 0.06em; text-align: center;
}

/* Back button */
.back-skills-btn {
  width: 100%;
  background: linear-gradient(135deg, #2e7d32, #1b5e20);
  color: #fff; border: none; border-radius: 16px;
  padding: 1rem; font-size: 1rem; font-weight: 700;
  cursor: pointer; font-family: inherit;
  margin-top: 0.5rem;
  animation: slideUp 0.5s 0.5s cubic-bezier(0.16,1,0.3,1) both;
  transition: opacity 0.2s;
}
.back-skills-btn:active { opacity: 0.85; }
</style>