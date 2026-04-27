<script setup>
import {ref, computed, onMounted} from 'vue'
import {useSkillStore} from "@/stores/skill.store.js";
import {useAuthStore} from "@/stores/auth.store.js";
import {colorForSkill} from "@/services/skillcolor.service.js";

const activeCategory = ref('all')
const skillStore = useSkillStore()
const authStore = useAuthStore()

const categories = [
  { value: 'all',     emoji: '⚡', label: 'ALL',     children: [] },
  {
    value: 'living',  emoji: '🏠', label: 'LIVING',
    children: [
      { value: 'Living' },
      { value: 'Health & Wellness' },
      { value: 'Time Management' },
      { value: 'Self-Awareness' },
    ],
  },
  {
    value: 'finance', emoji: '💰', label: 'FINANCE',
    children: [{ value: 'Financial Literacy' }],
  },
  {
    value: 'career',  emoji: '💼', label: 'CAREER',
    children: [
      { value: 'Career' },
      { value: 'Communication' },
      { value: 'Digital' },
      { value: 'Critical Thinking' },
      { value: 'Social' },
    ],
  },
  {
    value: 'hobby',   emoji: '🎨', label: 'HOBBY',
    children: [{ value: 'Other' }],
  },
]

// XP computed values from auth store
const xpData = computed(() => authStore.xp)
const totalXp = computed(() => xpData.value?.total_xp ?? 0)
const level = computed(() => xpData.value?.level ?? 1)
const levelName = computed(() => xpData.value?.level_name ?? 'Beginner')
const currentLevelXp = computed(() => xpData.value?.current_level_xp ?? 0)
const nextLevelXp = computed(() => xpData.value?.next_level_xp ?? 100)
const xpProgress = computed(() => {
  const range = nextLevelXp.value - currentLevelXp.value
  const earned = totalXp.value - currentLevelXp.value
  return range > 0 ? Math.min((earned / range) * 100, 100) : 0
})

const levelBadge = computed(() => {
  if (level.value >= 10) return '👑'
  if (level.value >= 8)  return '🏆'
  if (level.value >= 6)  return '🥇'
  if (level.value >= 4)  return '🥈'
  return '🏅'
})

const normalize = (str) => String(str ?? '').toLowerCase().replace(/[\s&-]+/g, '_')

const filteredSkills = computed(() => {
  const allSkills = skillStore.data?.skills ?? []
  if (activeCategory.value === 'all') return allSkills
  const parent = categories.find(c => c.value === activeCategory.value)
  if (!parent) return allSkills
  const childValues = parent.children.map(c => normalize(c.value))
  return allSkills.filter(s => childValues.includes(normalize(s.category)))
})

onMounted(async () => {
  await skillStore.getSkills()
  await authStore.fetchXp()
})
</script>

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
            <div class="xp-badge">{{ levelBadge }}</div>
          </div>
          <div class="xp-info">
            <span class="xp-level">Level {{ level }}</span>
            <span class="xp-title">{{ levelName }}</span>
          </div>
          <div class="xp-total-wrap">
            <span class="xp-total-num">{{ totalXp.toLocaleString() }}</span>
            <span class="xp-total-lbl">TOTAL XP</span>
          </div>
        </div>
        <div class="xp-bar-wrap">
          <div class="xp-bar">
            <div class="xp-bar-fill" :style="{ width: xpProgress + '%' }"></div>
          </div>
        </div>
        <div class="xp-bar-labels">
          <span>{{ totalXp.toLocaleString() }} XP</span>
          <span>{{ nextLevelXp.toLocaleString() }} XP — Level {{ level + 1 }}</span>
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
            class="skill-card mb-4"
            @click="$router.push('/skills/' + skill.id)"
        >
          <!-- Banner -->
          <div class="skill-banner" :style="{ background: colorForSkill(skill) }">
            <span class="skill-banner-emoji">{{ skill.poster }}</span>
            <!-- Completed overlay -->
            <div v-if="skill.is_completed" class="completed-overlay">
              <span class="completed-badge">✓ Completed</span>
            </div>
          </div>

          <!-- Body -->
          <div class="skill-body">
            <div class="skill-body-top">
              <div>
                <h3 class="skill-name">{{ skill.title }}</h3>
                <span class="skill-cat-tag">{{ skill.category?.toUpperCase() ?? '' }}</span>
              </div>
              <span v-if="skill.is_completed" class="skill-difficulty completed-pill">
                ✓ Done
              </span>
              <span v-else class="skill-difficulty" :class="skill.difficulty?.toLowerCase()">
                <span class="diff-dot"></span> {{ skill.difficulty }}
              </span>
            </div>

            <div class="skill-stats">
              <div class="skill-stat-chip">
                <span>⭐</span>
                <div>
                  <span class="chip-val">{{ skill.reward }} XP</span>
                  <span class="chip-sub">Reward</span>
                </div>
              </div>
              <div class="skill-stat-chip">
                <span>⏱</span>
                <div>
                  <span class="chip-val">~{{ skill.duration }} min</span>
                  <span class="chip-sub">Duration</span>
                </div>
              </div>
              <div class="skill-stat-chip">
                <span>📋</span>
                <div>
                  <span class="chip-val">{{ skill.steps_count }} steps</span>
                  <span class="chip-sub">Guide</span>
                </div>
              </div>
            </div>

            <!-- Progress bar for partially completed skills -->
            <div v-if="skill.completed_steps > 0 && !skill.is_completed" class="skill-progress-row">
              <div class="skill-prog-bar">
                <div
                    class="skill-prog-fill"
                    :style="{ width: (skill.completed_steps / skill.steps_count * 100) + '%', background: colorForSkill(skill) }"
                ></div>
              </div>
              <span class="skill-pct">{{ skill.completed_steps }}/{{ skill.steps_count }}</span>
            </div>

            <button
                class="start-btn"
                :style="{ background: skill.is_completed ? '#2e7d32' : colorForSkill(skill) }"
            >
              {{ skill.is_completed ? '✓ Completed' : skill.completed_steps > 0 ? '→ Continue Learning' : '→ Start Learning' }}
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.skills-page {
  min-height: 100vh;
  background: #f0f2ee;
  font-family: 'Nunito', 'Segoe UI', sans-serif;
  padding-bottom: 100px;
}

.page-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem 1.25rem 0.75rem;
  background: #f0f2ee; border-bottom: 1px solid #e5e7e3;
}
.back-btn { background: none; border: none; cursor: pointer; color: #1a1a1a; padding: 0; display: flex; align-items: center; }
.page-title { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; }

.page-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }

/* XP Card */
.xp-card { background: var(--indevo-green-gradiant); border-radius: 20px; padding: 1.25rem; }
.xp-card-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
.xp-badge-wrap { width: 52px; height: 52px; border-radius: 14px; background: #f59e0b; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; flex-shrink: 0; }
.xp-info { flex: 1; display: flex; flex-direction: column; }
.xp-level { font-size: 1.1rem; font-weight: 800; color: #fff; }
.xp-title { font-size: 0.8rem; color: rgba(255,255,255,0.7); }
.xp-total-wrap { display: flex; flex-direction: column; align-items: flex-end; }
.xp-total-num { font-size: 1.5rem; font-weight: 800; color: #69f0ae; }
.xp-total-lbl { font-size: 0.65rem; font-weight: 600; color: rgba(255,255,255,0.6); letter-spacing: 0.05em; }
.xp-bar { height: 8px; background: rgba(255,255,255,0.2); border-radius: 999px; overflow: hidden; }
.xp-bar-fill { height: 100%; background: #69f0ae; border-radius: 999px; transition: width 0.5s ease; }
.xp-bar-labels { display: flex; justify-content: space-between; margin-top: 0.4rem; }
.xp-bar-labels span { font-size: 0.72rem; color: rgba(255,255,255,0.65); }

/* Category Row */
.category-row { display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 2px; justify-content: space-between; align-items: center; }
.cat-tile {
  display: flex; flex-direction: column; align-items: center; gap: 0.25rem;
  padding: 0.6rem 0.75rem; border-radius: 14px;
  background: #fff; border: 1.5px solid #e5e7e3;
  cursor: pointer; flex-shrink: 0; font-family: inherit;
  transition: all 0.2s; min-width: 64px;
}
.cat-tile.active { background: var(--indevo-green-mid); border-color: var(--indevo-green-mid); }
.cat-emoji { font-size: 1.2rem; }
.cat-lbl { font-size: 0.6rem; font-weight: 700; color: #6b7280; letter-spacing: 0.04em; }
.cat-tile.active .cat-lbl { color: #fff; }

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
  align-items: center; justify-content: center; position: relative;
}
.skill-banner::after {
  content: ''; position: absolute; inset: 0;
  background: repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 12px);
}
.skill-banner-emoji { font-size: 3rem; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2)); }

.completed-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.3);
  display: flex; align-items: center; justify-content: center; z-index: 2;
}
.completed-badge {
  background: #fff; color: #2e7d32;
  font-size: 0.85rem; font-weight: 800;
  padding: 0.4rem 1.2rem; border-radius: 999px;
}

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
  border-radius: 999px; background: #e8f5e9; color: var(--indevo-green); flex-shrink: 0;
}
.skill-difficulty.medium { background: #fff8e1; color: #b45309; }
.skill-difficulty.hard { background: #fce4ec; color: #c62828; }
.completed-pill { background: #e8f5e9; color: #2e7d32; display: flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; font-weight: 700; padding: 0.25rem 0.75rem; border-radius: 999px; flex-shrink: 0; }
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
.skill-prog-bar { flex: 1; height: 6px; background: #e5e7e3; border-radius: 999px; overflow: hidden; }
.skill-prog-fill { height: 100%; border-radius: 999px; }
.skill-pct { font-size: 0.75rem; color: #6b7280; white-space: nowrap; }

.start-btn {
  width: 100%; padding: 0.9rem;
  color: #fff; border: none; border-radius: 14px;
  font-size: 0.95rem; font-weight: 700; cursor: pointer;
  font-family: inherit; letter-spacing: 0.02em; transition: opacity 0.2s;
}
.start-btn:active { opacity: 0.85; }
</style>