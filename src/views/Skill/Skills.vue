<template>
  <div class="skills-page">

    <!-- Header -->
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <h1 class="page-title">Skills</h1>
      <div style="width:32px"></div>
    </div>

    <div class="page-body">

      <!-- XP Level Card -->
      <div class="xp-card">
        <div class="xp-card-top">
          <div class="xp-badge-wrap">
            <div class="xp-badge">🏅</div>
          </div>
          <div class="xp-info">
            <span class="xp-level">Level 7</span>
            <span class="xp-title">Skill Seeker</span>
          </div>
          <div class="xp-total-wrap">
            <span class="xp-total-num">1,340</span>
            <span class="xp-total-lbl">TOTAL XP</span>
          </div>
        </div>
        <div class="xp-bar-wrap">
          <div class="xp-bar">
            <div class="xp-bar-fill" style="width: 67%"></div>
          </div>
        </div>
        <div class="xp-bar-labels">
          <span>1,340 XP</span>
          <span>2,000 XP — Level 8</span>
        </div>
      </div>

      <!-- Achievement Badges -->
      <div class="badges-row">
        <div class="badge-pill gold">
          <span>🔍</span> Chef Starter
        </div>
        <div class="badge-pill gold">
          <span>💰</span> Money Wise
        </div>
        <div class="badge-pill grey">
          <span>🪣</span> Clean Sweep
        </div>
      </div>

      <!-- Category Filter -->
      <div class="category-row">
        <button
            v-for="cat in categories" :key="cat.value"
            class="cat-tile"
            :class="{ active: activeCategory === cat.value }"
            @click="activeCategory = cat.value"
        >
          <span class="cat-emoji">{{ cat.emoji }}</span>
          <span class="cat-lbl">{{ cat.label }}</span>
        </button>
      </div>

      <!-- Section label -->
      <p class="section-lbl">{{ activeCategory === 'all' ? 'ALL SKILLS' : activeCategory.toUpperCase() + ' SKILLS' }}</p>

      <!-- Skill Cards -->
      <div class="skills-list">
        <div
            v-for="skill in filteredSkills" :key="skill.id"
            class="skill-card"
            @click="$router.push('/skills/' + skill.id)"
        >
          <!-- Banner -->
          <div class="skill-banner" :style="{ background: skill.color }">
            <span class="skill-banner-emoji">{{ skill.emoji }}</span>
          </div>

          <!-- Body -->
          <div class="skill-body">
            <div class="skill-body-top">
              <div>
                <h3 class="skill-name">{{ skill.name }}</h3>
                <span class="skill-cat-tag">{{ skill.category.toUpperCase() }}</span>
              </div>
              <span class="skill-difficulty" :class="skill.difficulty.toLowerCase()">
                <span class="diff-dot"></span> {{ skill.difficulty }}
              </span>
            </div>

            <div class="skill-stats">
              <div class="skill-stat-chip">
                <span>⭐</span>
                <div>
                  <span class="chip-val">{{ skill.xp }} XP</span>
                  <span class="chip-sub">Reward</span>
                </div>
              </div>
              <div class="skill-stat-chip">
                <span>⏱</span>
                <div>
                  <span class="chip-val">~{{ skill.duration }}</span>
                  <span class="chip-sub">Duration</span>
                </div>
              </div>
              <div class="skill-stat-chip">
                <span>📋</span>
                <div>
                  <span class="chip-val">{{ skill.steps }} steps</span>
                  <span class="chip-sub">Guide</span>
                </div>
              </div>
            </div>

            <div class="skill-progress-row">
              <span class="skill-lv">Lv {{ skill.currentLv }}/{{ skill.maxLv }}</span>
              <div class="skill-prog-bar">
                <div class="skill-prog-fill" :style="{ width: skill.progress + '%', background: skill.color }"></div>
              </div>
              <span class="skill-pct">{{ skill.progress }}%</span>
            </div>

            <button class="start-btn" :style="{ background: skill.color }">
              → Start Learning
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeCategory = ref('all')

const categories = [
  { value: 'all',      emoji: '⚡',  label: 'ALL' },
  { value: 'cooking',  emoji: '🔍',  label: 'COOKING' },
  { value: 'finance',  emoji: '💰',  label: 'FINANCE' },
  { value: 'cleaning', emoji: '🧹',  label: 'CLEANING' },
  { value: 'admin',    emoji: '📋',  label: 'ADMIN' },
]

const skills = ref([
  {
    id: 'perfect-pasta',
    name: 'Perfect Pasta',
    category: 'cooking',
    emoji: '🍝',
    color: '#d4501a',
    difficulty: 'Easy',
    xp: 20,
    duration: '15 min',
    steps: 4,
    currentLv: 3,
    maxLv: 5,
    progress: 60,
  },
  {
    id: 'monthly-budget',
    name: 'Monthly Budget',
    category: 'finance',
    emoji: '💵',
    color: '#2e7d32',
    difficulty: 'Medium',
    xp: 40,
    duration: '30 min',
    steps: 5,
    currentLv: 2,
    maxLv: 5,
    progress: 40,
  },
  {
    id: 'deep-clean',
    name: 'Deep Clean Home',
    category: 'cleaning',
    emoji: '🧽',
    color: '#0277bd',
    difficulty: 'Easy',
    xp: 25,
    duration: '20 min',
    steps: 6,
    currentLv: 1,
    maxLv: 5,
    progress: 20,
  },
  {
    id: 'tax-basics',
    name: 'Tax Basics',
    category: 'admin',
    emoji: '📑',
    color: '#6a1b9a',
    difficulty: 'Hard',
    xp: 60,
    duration: '45 min',
    steps: 7,
    currentLv: 0,
    maxLv: 5,
    progress: 0,
  },
])

const filteredSkills = computed(() =>
    activeCategory.value === 'all'
        ? skills.value
        : skills.value.filter(s => s.category === activeCategory.value)
)
</script>

<style scoped>
.skills-page {
  min-height: 100vh;
  background: #f0f2ee;
  font-family: 'Nunito', 'Segoe UI', sans-serif;
  padding-bottom: 100px;
}

/* Header */
.page-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem 1.25rem 0.75rem;
  background: #f0f2ee;
  border-bottom: 1px solid #e5e7e3;
}
.back-btn { background: none; border: none; cursor: pointer; color: #1a1a1a; padding: 0; display: flex; align-items: center; }
.page-title { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; }

.page-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }

/* XP Card */
.xp-card {
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  border-radius: 20px; padding: 1.25rem;
}
.xp-card-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
.xp-badge-wrap { width: 52px; height: 52px; border-radius: 14px; background: #f59e0b; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; flex-shrink: 0; }
.xp-info { flex: 1; display: flex; flex-direction: column; }
.xp-level { font-size: 1.1rem; font-weight: 800; color: #fff; }
.xp-title { font-size: 0.8rem; color: rgba(255,255,255,0.7); }
.xp-total-wrap { display: flex; flex-direction: column; align-items: flex-end; }
.xp-total-num { font-size: 1.5rem; font-weight: 800; color: #69f0ae; }
.xp-total-lbl { font-size: 0.65rem; font-weight: 600; color: rgba(255,255,255,0.6); letter-spacing: 0.05em; }
.xp-bar { height: 8px; background: rgba(255,255,255,0.2); border-radius: 999px; overflow: hidden; }
.xp-bar-fill { height: 100%; background: #69f0ae; border-radius: 999px; }
.xp-bar-labels { display: flex; justify-content: space-between; margin-top: 0.4rem; }
.xp-bar-labels span { font-size: 0.72rem; color: rgba(255,255,255,0.65); }

/* Badges */
.badges-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.badge-pill {
  display: flex; align-items: center; gap: 0.35rem;
  padding: 0.4rem 1rem; border-radius: 999px;
  font-size: 0.82rem; font-weight: 700;
}
.badge-pill.gold { background: #fff8e1; color: #b45309; border: 1.5px solid #fcd34d; }
.badge-pill.grey { background: #f3f4f6; color: #9ca3af; border: 1.5px solid #e5e7eb; }

/* Category Row */
.category-row { display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 2px; }
.cat-tile {
  display: flex; flex-direction: column; align-items: center; gap: 0.25rem;
  padding: 0.6rem 0.75rem; border-radius: 14px;
  background: #fff; border: 1.5px solid #e5e7e3;
  cursor: pointer; flex-shrink: 0; font-family: inherit;
  transition: all 0.2s;
  min-width: 64px;
}
.cat-tile.active { background: #2e7d32; border-color: #2e7d32; }
.cat-emoji { font-size: 1.2rem; }
.cat-lbl { font-size: 0.6rem; font-weight: 700; color: #6b7280; letter-spacing: 0.04em; }
.cat-tile.active .cat-lbl { color: #fff; }

/* Section label */
.section-lbl { font-size: 0.72rem; font-weight: 700; color: #6b7280; letter-spacing: 0.08em; margin: 0; }

/* Skill Card */
.skill-card {
  background: #fff; border-radius: 20px;
  overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.07);
  cursor: pointer; transition: transform 0.15s;
}
.skill-card:active { transform: scale(0.98); }

.skill-banner {
  height: 110px; display: flex;
  align-items: center; justify-content: center;
  position: relative;
}
.skill-banner::after {
  content: '';
  position: absolute; inset: 0;
  background: repeating-linear-gradient(
      45deg,
      rgba(255,255,255,0.04) 0px,
      rgba(255,255,255,0.04) 1px,
      transparent 1px,
      transparent 12px
  );
}
.skill-banner-emoji { font-size: 3rem; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2)); }

.skill-body { padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; }

.skill-body-top { display: flex; align-items: flex-start; justify-content: space-between; }
.skill-name { font-size: 1.1rem; font-weight: 800; color: #1a1a1a; margin-bottom: 4px; }
.skill-cat-tag {
  font-size: 0.65rem; font-weight: 700; letter-spacing: 0.06em;
  color: #d4501a; background: #fff3ed; padding: 0.15rem 0.5rem; border-radius: 6px;
}
.skill-difficulty {
  display: flex; align-items: center; gap: 0.3rem;
  font-size: 0.8rem; font-weight: 700; padding: 0.25rem 0.75rem;
  border-radius: 999px; background: #e8f5e9; color: #2e7d32; flex-shrink: 0;
}
.skill-difficulty.medium { background: #fff8e1; color: #b45309; }
.skill-difficulty.hard { background: #fce4ec; color: #c62828; }
.diff-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }

.skill-stats { display: flex; gap: 0.5rem; }
.skill-stat-chip {
  flex: 1; display: flex; align-items: center; gap: 0.4rem;
  background: #f5f6f3; border-radius: 10px; padding: 0.5rem 0.6rem;
}
.skill-stat-chip span:first-child { font-size: 1rem; flex-shrink: 0; }
.chip-val { font-size: 0.8rem; font-weight: 700; color: #1a1a1a; display: block; }
.chip-sub { font-size: 0.65rem; color: #9ca3af; display: block; }

.skill-progress-row { display: flex; align-items: center; gap: 0.5rem; }
.skill-lv { font-size: 0.75rem; color: #6b7280; white-space: nowrap; }
.skill-prog-bar { flex: 1; height: 6px; background: #e5e7e3; border-radius: 999px; overflow: hidden; }
.skill-prog-fill { height: 100%; border-radius: 999px; }
.skill-pct { font-size: 0.75rem; color: #6b7280; white-space: nowrap; }

.start-btn {
  width: 100%; padding: 0.9rem;
  color: #fff; border: none; border-radius: 14px;
  font-size: 0.95rem; font-weight: 700; cursor: pointer;
  font-family: inherit; letter-spacing: 0.02em;
  transition: opacity 0.2s;
}
.start-btn:active { opacity: 0.85; }
</style>