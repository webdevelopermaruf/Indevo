<template>
  <div class="detail-page">

    <!-- Header -->
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <h1 class="page-title">{{ skill.name }}</h1>
      <div style="width:32px"></div>
    </div>

    <!-- Banner -->
    <div class="skill-banner" :style="{ background: skill.color }">
      <span class="banner-emoji">{{ skill.emoji }}</span>
    </div>

    <!-- Meta pills -->
    <div class="meta-pills">
      <span class="meta-pill diff">
        <span class="diff-dot"></span> {{ skill.difficulty }}
      </span>
      <span class="meta-pill xp">⭐ {{ skill.xp }} XP Reward</span>
      <span class="meta-pill time">⏱ ~{{ skill.duration }}</span>
      <span class="meta-pill steps">📋 {{ skill.steps.length }} Steps</span>
    </div>

    <!-- Progress -->
    <div class="progress-section">
      <span class="progress-lbl">Your Progress</span>
      <span class="progress-count">{{ completedCount }} / {{ skill.steps.length }}</span>
    </div>
    <div class="progress-bar-full">
      <div class="progress-bar-fill" :style="{ width: (completedCount / skill.steps.length * 100) + '%', background: skill.color }"></div>
    </div>

    <!-- Steps -->
    <div class="steps-list">
      <div
          v-for="(step, idx) in skill.steps"
          :key="step.id"
          class="step-card"
          :class="{ expanded: expandedStep === idx, completed: completedSteps.includes(idx) }"
      >
        <div class="step-header" @click="toggleStep(idx)">
          <div class="step-num" :class="{ done: completedSteps.includes(idx) }" :style="completedSteps.includes(idx) ? {} : { background: skill.color }">
            <svg v-if="completedSteps.includes(idx)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span v-else>{{ idx + 1 }}</span>
          </div>
          <div class="step-title-wrap">
            <span class="step-title">{{ step.title }}</span>
            <span class="step-sub">{{ step.subtitle }}</span>
          </div>
          <svg class="step-chevron" :class="{ rotated: expandedStep === idx }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>

        <!-- Expanded content -->
        <div v-if="expandedStep === idx" class="step-content">
          <!-- Image placeholder -->
          <div class="step-img" :style="{ background: step.imgBg }">
            <span class="step-img-emoji">{{ step.imgEmoji }}</span>
            <span class="step-img-caption">{{ step.imgCaption }}</span>
          </div>

          <!-- Description -->
          <p class="step-desc">{{ step.description }}</p>

          <!-- Video link -->
          <div v-if="step.video" class="video-link">
            <div class="video-play">▶</div>
            <div>
              <span class="video-title">{{ step.video }}</span>
              <span class="video-sub">Tap to watch video tutorial</span>
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
          :style="{ background: skill.color }"
          @click="markCompleted"
      >
        {{ allDone ? '✓ All Steps Done!' : 'Mark as Completed' }}
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// In a real app this would come from a store/API based on route.params.id
const skillsData = {
  'deep-clean': {
    name: 'Deep Clean Home',
    emoji: '🧽',
    color: '#0277bd',
    difficulty: 'Easy',
    xp: 25,
    duration: '20 min',
    steps: [
      { id:1, title:'Gather your supplies', subtitle:'Before you start', imgBg:'#e3f2fd', imgEmoji:'🧴', imgCaption:'Cleaning supplies ready', description:'You\'ll need a mop, microfibre cloths, all-purpose spray, glass cleaner, rubber gloves, and a bin bag. Lay everything out in one spot before you begin — it saves so much time running back and forth.', video:'Watch: Must-Have Cleaning Supplies', tip:'Microfibre cloths are far more effective than paper towels and more eco-friendly too.' },
      { id:2, title:'Declutter first', subtitle:'Clear before you clean', imgBg:'#fff8e1', imgEmoji:'📦', imgCaption:'Clearing surfaces', description:'Go room by room and remove anything that doesn\'t belong. Put items back in their place, throw away obvious rubbish, and clear surfaces before applying any cleaning products.', video:null, tip:'Set a timer for 10 minutes per room — it stops decluttering turning into a 3-hour reorganise.' },
      { id:3, title:'Top to bottom dusting', subtitle:'Work with gravity', imgBg:'#f3e8ff', imgEmoji:'🪣', imgCaption:'Dusting shelves and surfaces', description:'Always dust from high to low — ceiling corners, shelves, furniture tops, then skirting boards last. This way dust falls down onto areas you haven\'t cleaned yet rather than onto clean floors.', video:'Watch: Dusting Technique Masterclass', tip:'A barely damp cloth traps dust better than a dry one.' },
      { id:4, title:'Wipe all surfaces', subtitle:'The satisfying part', imgBg:'#e8f5e9', imgEmoji:'✨', imgCaption:'Wiping kitchen surfaces', description:'Spray surfaces with all-purpose cleaner and wipe in an S-pattern rather than circles — you\'re moving dirt off the surface rather than spreading it around. Pay extra attention to kitchen worktops and bathroom sinks.', video:null, tip:'Leave spray on for 30 seconds before wiping — it actually has time to kill bacteria.' },
      { id:5, title:'Floors last', subtitle:'Vacuum then mop', imgBg:'#fce4ec', imgEmoji:'🧹', imgCaption:'Mopping floors', description:'Vacuum all floors first to pick up loose debris, then mop hard floors. Work backwards from the far corner towards the door so you\'re never walking on wet floors.', video:'Watch: How to Mop Properly', tip:'Change your mop water halfway through — dirty water just spreads grime.' },
      { id:6, title:'Final checks', subtitle:'The finishing touches', imgBg:'#fff3e0', imgEmoji:'🪞', imgCaption:'Checking for missed spots', description:'Walk through each room and look for missed spots — fingerprints on mirrors, splashes on taps, crumbs under furniture. A final pass takes 5 minutes and makes everything look professional.', video:null, tip:'Stand in the doorway of each room to spot things you missed while up close.' },
    ],
  },
  'tax-basics': {
    name: 'Tax Basics',
    emoji: '📑',
    color: '#6a1b9a',
    difficulty: 'Hard',
    xp: 60,
    duration: '45 min',
    steps: [
      { id:1, title:'Understand your tax code', subtitle:'What the numbers mean', imgBg:'#f3e8ff', imgEmoji:'🔢', imgCaption:'Tax code on payslip', description:'Your tax code tells your employer how much tax-free income you\'re entitled to. The most common is 1257L which means £12,570 personal allowance. Check your payslip now — if it looks wrong, you may have been overtaxed.', video:'Watch: How to Read Your Tax Code', tip:'You can check and update your tax code on HMRC\'s website using your Government Gateway account.' },
      { id:2, title:'Know your National Insurance', subtitle:'NI explained simply', imgBg:'#e8f5e9', imgEmoji:'🏛', imgCaption:'National Insurance contributions', description:'National Insurance (NI) funds the NHS and your State Pension. You pay Class 1 NI on earnings above £12,570. Your NI number is unique to you — keep it safe as you\'ll need it for every job, benefit claim, and pension.', video:null, tip:'Check your NI record on the HMRC app — gaps in your record can reduce your State Pension.' },
      { id:3, title:'Self Assessment basics', subtitle:'Do you need to file?', imgBg:'#fff8e1', imgEmoji:'📝', imgCaption:'Self Assessment form', description:'You need to file a Self Assessment tax return if you\'re self-employed, earn over £100k, have income from renting property, or have other untaxed income. The deadline is 31 January each year for online returns.', video:'Watch: Do I Need to Do Self Assessment?', tip:'Register for Self Assessment by 5 October after the tax year ends — missing this has penalties.' },
      { id:4, title:'Allowable expenses', subtitle:'What you can claim', imgBg:'#e3f2fd', imgEmoji:'🧾', imgCaption:'Keeping receipts', description:'If self-employed, you can deduct legitimate business expenses from your income before tax — things like equipment, home office costs, travel, and professional subscriptions. Keep all receipts as HMRC can ask for evidence up to 6 years later.', video:null, tip:'A dedicated business bank account makes tracking expenses dramatically easier at tax time.' },
      { id:5, title:'Deadlines and penalties', subtitle:'Don\'t get caught out', imgBg:'#fce4ec', imgEmoji:'📅', imgCaption:'Tax deadlines calendar', description:'Missing tax deadlines results in automatic penalties starting at £100. Key dates: 5 April (tax year end), 31 July (payment on account), 31 January (return filing and final payment). Set calendar reminders now for all three.', video:'Watch: HMRC Penalty System Explained', tip:'Pay any tax owed on time even if you can\'t file your return — late payment interest adds up fast.' },
      { id:6, title:'Get a UTR number', subtitle:'If self-employed', imgBg:'#f0fdf4', imgEmoji:'🆔', imgCaption:'Registering with HMRC', description:'A Unique Taxpayer Reference (UTR) is a 10-digit number HMRC assigns when you register as self-employed. You\'ll need it for every tax return. Register on HMRC\'s website — it can take up to 10 days to arrive by post.', video:'Watch: How to Register as Self-Employed', tip:'You can find your UTR on any previous tax return or in your HMRC online account.' },
      { id:7, title:'Use free HMRC tools', subtitle:'Work smarter', imgBg:'#fff3e0', imgEmoji:'💻', imgCaption:'HMRC online tools', description:'HMRC\'s free tools include: the Personal Tax Account (check your tax code, NI record, refunds), the HMRC app (view your tax code, claim refunds), and Making Tax Digital for self-employed income tracking. Use them — they\'re free and reliable.', video:null, tip:'Bookmark gov.uk/personal-tax-account — it\'s the most useful financial tool most people never use.' },
    ],
  },
  'perfect-pasta': {
    name: 'Perfect Pasta',
    emoji: '🍝',
    color: '#d4501a',
    difficulty: 'Easy',
    xp: 20,
    duration: '15 min',
    steps: [
      {
        id: 1,
        title: 'Gather your ingredients',
        subtitle: 'Prep before you cook',
        imgBg: '#fff8dc',
        imgEmoji: '🛒',
        imgCaption: 'Ingredients laid out on counter',
        description: "You'll need pasta, salt, and your chosen sauce. For 2 servings, use 200g of dried pasta. Lay everything out before turning on the heat — this is called \"mise en place\" and it makes cooking effortless.",
        video: 'Watch: How to Read Pasta Labels',
        tip: 'Always weigh dry pasta — eyeballing leads to way too much or too little.',
      },
      {
        id: 2,
        title: 'Boil salted water',
        subtitle: 'The most underrated step',
        imgBg: '#e3f2fd',
        imgEmoji: '🫕',
        imgCaption: 'Boiling pot on stove',
        description: 'Use a large pot and fill it generously with water. Salt it heavily once boiling — it should taste like the sea. This is your only chance to season the pasta itself.',
        video: 'Watch: How Much Salt Is Too Much?',
        tip: 'Never add oil to pasta water — it stops the sauce from sticking later.',
      },
      {
        id: 3,
        title: 'Cook al dente',
        subtitle: 'Time it precisely',
        imgBg: '#e8f5e9',
        imgEmoji: '⏱',
        imgCaption: 'Timer set for cooking',
        description: 'Check the packet time and subtract 2 minutes. Taste at that point — the pasta should have a slight bite. Al dente pasta finishes cooking in the sauce, absorbing flavour.',
        video: null,
        tip: 'Save a cup of pasta water before draining — it\'s liquid gold for your sauce.',
      },
      {
        id: 4,
        title: 'Finish in the sauce',
        subtitle: 'The Italian secret',
        imgBg: '#fce4ec',
        imgEmoji: '🍳',
        imgCaption: 'Pasta tossed in sauce',
        description: 'Add the drained pasta straight into your sauce pan. Toss on medium heat for 1–2 minutes, adding pasta water as needed to emulsify. The starch thickens the sauce beautifully.',
        video: 'Watch: The Toss Technique',
        tip: 'Finish with a drizzle of good olive oil and fresh parsley for a restaurant result.',
      },
    ],
  },
  'monthly-budget': {
    name: 'Monthly Budget',
    emoji: '💵',
    color: '#2e7d32',
    difficulty: 'Medium',
    xp: 40,
    duration: '30 min',
    steps: [
      { id:1, title:'Track your income', subtitle:'Know what comes in', imgBg:'#e8f5e9', imgEmoji:'💳', imgCaption:'Income sources', description:'List all income sources for the month including salary, freelance, and any passive income. Be honest and realistic — only count money already received or guaranteed.', video:'Watch: Income Tracking Basics', tip:'Include irregular income as a monthly average.' },
      { id:2, title:'List fixed expenses', subtitle:'The non-negotiables', imgBg:'#fff8e1', imgEmoji:'🏠', imgCaption:'Bills and rent', description:'Write down every expense that stays the same each month — rent, subscriptions, loan repayments, insurance. These are your baseline before any discretionary spending.', video:null, tip:'Review subscriptions yearly — you\'re probably paying for things you\'ve forgotten.' },
      { id:3, title:'Track variable spending', subtitle:'The honest part', imgBg:'#fce4ec', imgEmoji:'🛍', imgCaption:'Shopping receipts', description:'Look back at last month\'s bank statement. Categorise every variable expense: groceries, eating out, entertainment, clothing. Seeing it clearly is the first step to controlling it.', video:'Watch: Categorising Bank Transactions', tip:'Use the 50/30/20 rule as a starting benchmark.' },
      { id:4, title:'Set spending limits', subtitle:'Give every pound a job', imgBg:'#e3f2fd', imgEmoji:'🎯', imgCaption:'Budget targets set', description:'Based on your income minus fixed costs, allocate limits to each variable category. Be ambitious but realistic — aim to trim 10% from your biggest category first.', video:null, tip:'Build in a small "fun money" budget so you don\'t feel deprived.' },
      { id:5, title:'Review weekly', subtitle:'Stay on track', imgBg:'#f3e8ff', imgEmoji:'📊', imgCaption:'Weekly check-in', description:'Set a 10-minute weekly money date with yourself. Check spending against your limits, adjust if needed, and celebrate wins. Consistency over perfection is the goal.', video:'Watch: Setting Up a Budget Review Habit', tip:'Friday evenings work well — you\'re reflecting on the week before weekend spending.' },
    ],
  },
}

const skill = computed(() => skillsData[route.params.id] || skillsData['perfect-pasta'])

// Reset state when navigating between skills
watch(() => route.params.id, () => {
  expandedStep.value = 0
  completedSteps.value = []
})

const expandedStep = ref(0)
const completedSteps = ref([])

const completedCount = computed(() => completedSteps.value.length)
const allDone = computed(() => completedSteps.value.length === skill.value.steps.length)

function toggleStep(idx) {
  expandedStep.value = expandedStep.value === idx ? null : idx
}

function markCompleted() {
  // Mark current expanded step as done
  const idx = expandedStep.value
  if (idx !== null && !completedSteps.value.includes(idx)) {
    completedSteps.value.push(idx)
    // Auto-expand next
    if (idx + 1 < skill.value.steps.length) {
      expandedStep.value = idx + 1
    }
  }
  if (allDone.value) {
    router.push('/skills/' + route.params.id + '/mastered')
  }
}
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #f0f2ee;
  font-family: 'Nunito', 'Segoe UI', sans-serif;
  padding-bottom: 180px;
}

.page-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem 1.25rem 0.75rem;
  background: #fff;
  border-bottom: 1px solid #eee;
}
.back-btn { background: none; border: none; cursor: pointer; color: #1a1a1a; padding: 0; display: flex; align-items: center; }
.page-title { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; }

/* Banner */
.skill-banner {
  height: 160px; display: flex;
  align-items: center; justify-content: center;
  position: relative;
}
.skill-banner::after {
  content: '';
  position: absolute; inset: 0;
  background: repeating-linear-gradient(
      45deg,
      rgba(255,255,255,0.05) 0px,
      rgba(255,255,255,0.05) 1px,
      transparent 1px,
      transparent 14px
  );
}
.banner-emoji { font-size: 4rem; filter: drop-shadow(0 6px 12px rgba(0,0,0,0.25)); z-index: 1; }

/* Meta pills */
.meta-pills {
  display: flex; gap: 0.4rem; padding: 0.75rem 1.25rem;
  overflow-x: auto; background: #fff;
}
.meta-pill {
  display: flex; align-items: center; gap: 0.3rem;
  padding: 0.35rem 0.75rem; border-radius: 999px;
  background: #f5f6f3; font-size: 0.78rem; font-weight: 600;
  color: #444; white-space: nowrap; flex-shrink: 0;
}
.meta-pill.diff { background: #e8f5e9; color: #2e7d32; }
.diff-dot { width: 8px; height: 8px; border-radius: 50%; background: #2e7d32; }

/* Progress */
.progress-section {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1rem 1.25rem 0.4rem;
}
.progress-lbl { font-size: 0.88rem; font-weight: 700; color: #1a1a1a; }
.progress-count { font-size: 0.85rem; color: #6b7280; font-weight: 600; }
.progress-bar-full { height: 4px; background: #e5e7e3; margin: 0 1.25rem 1rem; border-radius: 999px; overflow: hidden; }
.progress-bar-fill { height: 100%; border-radius: 999px; transition: width 0.4s ease; }

/* Steps */
.steps-list { display: flex; flex-direction: column; gap: 0.75rem; padding: 0 1.25rem; }

.step-card {
  background: #fff; border-radius: 16px;
  overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,0.06);
  transition: box-shadow 0.2s;
}
.step-card.expanded { box-shadow: 0 4px 16px rgba(0,0,0,0.1); }

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

/* Expanded step content */
.step-content { padding: 0 1rem 1rem; display: flex; flex-direction: column; gap: 0.75rem; }

.step-img {
  border-radius: 12px; height: 110px;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 0.5rem;
  position: relative; overflow: hidden;
}
.step-img-emoji { font-size: 2.5rem; }
.step-img-caption {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: rgba(0,0,0,0.25); color: #fff;
  font-size: 0.72rem; font-weight: 600; text-align: center;
  padding: 0.3rem;
}

.step-desc {
  font-size: 0.88rem; line-height: 1.6; color: #444;
  background: #f5f6f3; border-radius: 12px; padding: 0.85rem;
  margin: 0;
}

.video-link {
  display: flex; align-items: center; gap: 0.75rem;
  background: #e8f0fe; border-radius: 12px; padding: 0.75rem 1rem;
  cursor: pointer;
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

/* Bottom CTA */
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
.mark-btn:active { opacity: 0.85; }
</style>