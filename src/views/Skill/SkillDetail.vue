<script setup>
import {ref, computed, watch, onMounted} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {colorForSkill} from "@/services/skillcolor.service.js";
import {useSkillStore} from "@/stores/skill.store.js";
import {useAuthStore} from "@/stores/auth.store.js";
import api from "@/services/api.js";

const router = useRouter()
const route = useRoute()
const skillStore = useSkillStore()
const authStore = useAuthStore()

const skill = computed(() => skillStore.skilldata)
const steps = computed(() => skill.value?.steps ?? [])

// Reset state when navigating between skills
watch(() => route.params.id, async (newId) => {
  expandedStep.value = 0
  completedSteps.value = []
  playingVideo.value = null
  await loadSkill(newId)
})

const expandedStep = ref(0)
const completedSteps = ref([])
const playingVideo = ref(null)
const markingStep = ref(false)
const showXpToast = ref(false)
const earnedXp = ref(0)

const completedCount = computed(() => completedSteps.value.length)
const allDone = computed(() => steps.value.length > 0 && completedSteps.value.length === steps.value.length)

async function loadSkill(id) {
  await skillStore.getSpecificSkills(id)
  // Load already completed steps from API response
  if (skillStore.skilldata?.steps) {
    completedSteps.value = skillStore.skilldata.steps
        .map((step, idx) => step.is_completed ? idx : null)
        .filter(idx => idx !== null)
    // Auto expand first incomplete step
    const firstIncomplete = skillStore.skilldata.steps.findIndex(s => !s.is_completed)
    expandedStep.value = firstIncomplete >= 0 ? firstIncomplete : 0
  }
}

function toggleStep(idx) {
  expandedStep.value = expandedStep.value === idx ? null : idx
  playingVideo.value = null
}

function playVideo(url) {
  if (!url) return
  let embedUrl = url
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  if (ytMatch) {
    embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`
  }
  playingVideo.value = embedUrl
}

async function markCompleted() {
  const idx = expandedStep.value
  if (idx === null || markingStep.value) return

  if (completedSteps.value.includes(idx)) {
    if (idx + 1 < steps.value.length) {
      expandedStep.value = idx + 1
    }
    if (allDone.value) {
      router.push('/skills/' + route.params.id + '/mastered')
    }
    return
  }

  markingStep.value = true
  try {
    const step = steps.value[idx]
    await api.post('/user/update/skill', {
      step_id: step.id,
      action: 'update'
    })

    completedSteps.value.push(idx)

    if (allDone.value) {
      earnedXp.value = skill.value?.reward ?? 0
      showXpToast.value = true
      await authStore.fetchXp()
      await skillStore.getSkills()
      setTimeout(() => {
        showXpToast.value = false
        router.push('/skills/' + route.params.id + '/mastered')
      }, 1800)
    } else {
      expandedStep.value = idx + 1
    }
  } catch (e) {
    console.error('Failed to mark step', e)
  } finally {
    markingStep.value = false
  }
}

onMounted(async () => {
  await loadSkill(route.params.id)
})
</script>

<template>
  <div class="detail-page">

    <!-- XP Toast -->
    <transition name="toast">
      <div v-if="showXpToast" class="xp-toast">
        ⭐ +{{ earnedXp }} XP Earned!
      </div>
    </transition>

    <!-- Loading state -->
    <div v-if="skillStore.loading" class="loading-wrap">
      <span>Loading Skill ...</span>
    </div>

    <!-- Error state -->
    <div v-else-if="skillStore.error" class="error-wrap">
      <span>{{ skillStore.error }}</span>
    </div>

    <!-- Skill content -->
    <template v-else-if="skill">

      <!-- Header -->
      <div class="page-header">
        <button class="back-btn" @click="$router.back()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1 class="page-title">{{ skill.title }}</h1>
        <div style="width:32px"></div>
      </div>

      <!-- Banner -->
      <div class="skill-banner" :style="{ background: colorForSkill(skill) }">
        <span class="banner-emoji">{{ skill.poster }}</span>
        <!-- Completed overlay -->
        <div v-if="skill.is_completed" class="completed-overlay">
          <span class="completed-badge">✓ Completed</span>
        </div>
      </div>

      <!-- Meta pills -->
      <div class="meta-pills">
        <span class="meta-pill diff">
          <span class="diff-dot"></span> {{ skill.difficulty }}
        </span>
        <span class="meta-pill xp">⭐ {{ skill.reward }} XP Reward</span>
        <span class="meta-pill time">⏱ ~{{ skill.duration }} min</span>
        <span class="meta-pill steps">📋 {{ steps.length }} Steps</span>
      </div>

      <!-- Progress -->
      <div class="progress-section">
        <span class="progress-lbl">Your Progress</span>
        <span class="progress-count">{{ completedCount }} / {{ steps.length }}</span>
      </div>
      <div class="progress-bar-full">
        <div
            class="progress-bar-fill"
            :style="{ width: steps.length ? (completedCount / steps.length * 100) + '%' : '0%', background: colorForSkill(skill) }"
        ></div>
      </div>

      <!-- Steps -->
      <div class="steps-list">
        <div
            v-for="(step, idx) in steps"
            :key="step.id"
            class="step-card"
            :class="{ expanded: expandedStep === idx, completed: completedSteps.includes(idx) }"
        >
          <div class="step-header" @click="toggleStep(idx)">
            <div class="step-num" :class="{ done: completedSteps.includes(idx) }" :style="completedSteps.includes(idx) ? {} : { background: colorForSkill(skill) }">
              <svg v-if="completedSteps.includes(idx)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span v-else>{{ idx + 1 }}</span>
            </div>
            <div class="step-title-wrap">
              <span class="step-title">{{ step.title }}</span>
              <span class="step-sub">{{ step.short_description }}</span>
            </div>
            <svg class="step-chevron" :class="{ rotated: expandedStep === idx }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>

          <!-- Expanded content -->
          <div v-if="expandedStep === idx" class="step-content">

            <!-- Inline Video Player -->
            <div v-if="step.video && playingVideo" class="video-player">
              <iframe
                  :src="playingVideo"
                  frameborder="0"
                  allowfullscreen
                  allow="autoplay; encrypted-media"
                  class="video-iframe"
              ></iframe>
              <button class="close-video" @click="playingVideo = null">✕ Close</button>
            </div>

            <!-- Image placeholder -->
            <div v-if="step.picture && !playingVideo" class="step-img" :style="{ background: colorForSkill(skill) + '22' }">
              <span class="step-img-emoji">{{ step.picture }}</span>
            </div>

            <!-- Description -->
            <p class="step-desc">{{ step.long_description }}</p>

            <!-- Video link -->
            <div v-if="step.video && !playingVideo" class="video-link" @click="playVideo(step.video)">
              <div class="video-play">▶</div>
              <div>
                <span class="video-title">Watch video tutorial</span>
                <span class="video-sub">Tap to watch inside the app</span>
              </div>
            </div>

            <!-- Pro tip -->
            <div v-if="step.tip" class="pro-tip">
              <span class="tip-icon">💡</span>
              <span><strong>Pro Tip:</strong> {{ step.tip }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="bottom-cta">
        <button
            class="mark-btn"
            :style="{ background: allDone ? '#2e7d32' : colorForSkill(skill) }"
            :disabled="markingStep"
            @click="markCompleted"
        >
          <span v-if="markingStep">Saving...</span>
          <span v-else-if="allDone">✓ Skill Completed!</span>
          <span v-else>Mark Step as Completed</span>
        </button>
      </div>

    </template>

  </div>
</template>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #f0f2ee;
  font-family: 'Nunito', 'Segoe UI', sans-serif;
  padding-bottom: 180px;
}

.xp-toast {
  position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
  background: #f59e0b; color: #fff;
  padding: 0.75rem 1.5rem; border-radius: 999px;
  font-size: 1rem; font-weight: 800;
  box-shadow: 0 4px 20px rgba(245,158,11,0.4);
  z-index: 999;
}
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(-10px); }

.page-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem 1.25rem 0.75rem;
  background: #fff; border-bottom: 1px solid #eee;
}
.back-btn { background: none; border: none; cursor: pointer; color: #1a1a1a; padding: 0; display: flex; align-items: center; }
.page-title { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; }

.skill-banner {
  height: 160px; display: flex;
  align-items: center; justify-content: center;
  position: relative;
}
.skill-banner::after {
  content: ''; position: absolute; inset: 0;
  background: repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 14px);
}
.banner-emoji { font-size: 4rem; filter: drop-shadow(0 6px 12px rgba(0,0,0,0.25)); z-index: 1; }

.completed-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.35);
  display: flex; align-items: center; justify-content: center; z-index: 2;
}
.completed-badge {
  background: #fff; color: #2e7d32;
  font-size: 1rem; font-weight: 800;
  padding: 0.5rem 1.5rem; border-radius: 999px;
}

.meta-pills {
  display: flex; gap: 0.4rem; padding: 0.75rem 1.25rem;
  overflow-x: hidden; background: #fff;
}
.meta-pill {
  display: flex; align-items: center; gap: 0.3rem;
  padding: 0.35rem 0.75rem; border-radius: 999px;
  background: #f5f6f3; font-size: 0.78rem; font-weight: 600;
  color: #444; white-space: nowrap; flex-shrink: 0;
}
.meta-pill.diff { background: #e8f5e9; color: #2e7d32; }
.diff-dot { width: 8px; height: 8px; border-radius: 50%; background: #2e7d32; }

.progress-section {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1rem 1.25rem 0.4rem;
}
.progress-lbl { font-size: 0.88rem; font-weight: 700; color: #1a1a1a; }
.progress-count { font-size: 0.85rem; color: #6b7280; font-weight: 600; }
.progress-bar-full { height: 4px; background: #e5e7e3; margin: 0 1.25rem 1rem; border-radius: 999px; overflow: hidden; }
.progress-bar-fill { height: 100%; border-radius: 999px; transition: width 0.4s ease; }

.steps-list { display: flex; flex-direction: column; gap: 0.75rem; padding: 0 1.25rem; }

.step-card {
  background: #fff; border-radius: 16px;
  overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,0.06);
  transition: box-shadow 0.2s;
}
.step-card.expanded { box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
.step-card.completed { border-left: 3px solid #2e7d32; }

.step-header {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.9rem 1rem; cursor: pointer;
}
.step-num {
  width: 30px; height: 30px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.85rem; font-weight: 800; color: #fff; flex-shrink: 0;
}
.step-num.done { background: #2e7d32 !important; }
.step-title-wrap { flex: 1; display: flex; flex-direction: column; gap: 1px; }
.step-title { font-size: 0.95rem; font-weight: 700; color: #1a1a1a; }
.step-sub { font-size: 0.75rem; color: #9ca3af; }
.step-chevron { flex-shrink: 0; transition: transform 0.25s; }
.step-chevron.rotated { transform: rotate(180deg); }

.step-content { padding: 0 1rem 1rem; display: flex; flex-direction: column; gap: 0.75rem; }

.step-img {
  border-radius: 12px; height: 110px;
  display: flex; align-items: center; justify-content: center;
}
.step-img-emoji { font-size: 3rem; }

.step-desc {
  font-size: 0.88rem; line-height: 1.6; color: #444;
  background: #f5f6f3; border-radius: 12px; padding: 0.85rem; margin: 0;
}

.video-player { border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; gap: 0.5rem; }
.video-iframe { width: 100%; height: 200px; border-radius: 12px; border: none; }
.close-video {
  background: #f3f4f6; border: none; border-radius: 8px;
  padding: 0.4rem 1rem; font-size: 0.8rem; font-weight: 600;
  color: #6b7280; cursor: pointer; align-self: flex-end;
}

.video-link {
  display: flex; align-items: center; gap: 0.75rem;
  background: #e8f0fe; border-radius: 12px; padding: 0.75rem 1rem; cursor: pointer;
}
.video-play {
  width: 32px; height: 32px; border-radius: 8px;
  background: #1a73e8; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem; flex-shrink: 0;
}
.video-title { font-size: 0.85rem; font-weight: 700; color: #1a73e8; display: block; }
.video-sub { font-size: 0.72rem; color: #5f6368; }

.pro-tip {
  display: flex; gap: 0.5rem;
  background: #fff8e1; border-radius: 12px; padding: 0.75rem 1rem;
  font-size: 0.82rem; color: #b45309; line-height: 1.5;
}
.tip-icon { font-size: 1rem; flex-shrink: 0; }

.bottom-cta {
  position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
  width: 100%; max-width: 430px;
  padding: 1rem 1.25rem;
  background: linear-gradient(to top, #f0f2ee 70%, transparent);
}
.mark-btn {
  width: 100%; padding: 1rem;
  color: #fff; border: none; border-radius: 16px;
  font-size: 1rem; font-weight: 700; cursor: pointer;
  font-family: inherit; transition: opacity 0.2s;
}
.mark-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.mark-btn:active { opacity: 0.85; }
</style>