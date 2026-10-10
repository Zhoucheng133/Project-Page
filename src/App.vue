<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import projectsData from './json/projects.json'

interface ComponentItem {
  name: string
  framework: string
  github: string
}

interface Project {
  name: string
  github: string
  appstore?: string
  msstore?: string
  icon: string
  language: string[]
  framework: string
  platform: ('d' | 'm' | 's')[]
  components?: ComponentItem[]
  enabled?: boolean
  type: 'application' | 'service' | 'script'
  detail: {
    en: string
    cn: string
  }
}

const getProjectsByType = (type: string) => {
  return filteredProjects.value.filter(p => p.type === type)
}

const projects = ref<Project[]>(projectsData as Project[])
const searchQuery = ref('')
const selectedPlatform = ref<string>('all')

const { locale, t } = useI18n()

// Theme handling
const isDark = ref(false)

const initTheme = () => {
  const saved = localStorage.getItem('theme')
  if (saved) {
    isDark.value = saved === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  updateThemeClass()
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  updateThemeClass()
}

const updateThemeClass = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Language handling
const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'cn' : 'en'
  localStorage.setItem('locale', locale.value)
}

onMounted(() => {
  initTheme()
})

// Filtering projects
const filteredProjects = computed(() => {
  return projects.value.filter(project => {
    // Platform filter
    if (selectedPlatform.value !== 'all') {
      if (!project.platform.includes(selectedPlatform.value as 'd' | 'm' | 's')) {
        return false
      }
    }
    // Search query filter
    if (searchQuery.value.trim() !== '') {
      const q = searchQuery.value.toLowerCase()
      const nameMatch = project.name.toLowerCase().includes(q)
      const fwMatch = project.framework.toLowerCase().includes(q)
      const detailEn = project.detail.en.toLowerCase().includes(q)
      const detailCn = project.detail.cn.toLowerCase().includes(q)
      const compMatch = project.components?.some(c => c.name.toLowerCase().includes(q) || c.framework.toLowerCase().includes(q))
      return nameMatch || fwMatch || detailEn || detailCn || compMatch
    }
    return true
  })
})

// Platform icon helpers
const getPlatformName = (p: string) => {
  switch (p) {
    case 'd': return t('desktop')
    case 'm': return t('mobile')
    case 's': return t('server')
    default: return p
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
    <!-- Header / Navbar -->
    <header class="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <img src="/icon.svg" alt="Logo" class="w-10 h-10 rounded-xl object-cover" />
          <div>
            <h1 class="text-lg font-bold tracking-tight bg-linear-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
              {{ t('title') }}
            </h1>
            <p class="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">{{ t('subtitle') }}</p>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <!-- Language Toggle -->
          <button
            @click="toggleLanguage"
            class="cursor-pointer px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
            :title="t('switchLang')"
          >
            <svg class="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span>{{ t('switchLang') }}</span>
          </button>

          <!-- Theme Toggle -->
          <button
            @click="toggleTheme"
            class="cursor-pointer p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
            :title="t('themeToggle')"
          >
            <!-- Sun icon -->
            <svg v-if="isDark" class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <!-- Moon icon -->
            <svg v-else class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search and Filter Section -->
      <div class="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <!-- Search Bar -->
        <div class="relative w-full md:w-96">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('search')"
            class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all shadow-sm"
          />
        </div>

        <!-- Platform Filter Tabs -->
        <div class="flex items-center space-x-1 bg-slate-200/60 dark:bg-slate-900 p-1 rounded-xl border border-slate-300/50 dark:border-slate-800 w-full md:w-auto overflow-x-auto">
          <button
            @click="selectedPlatform = 'all'"
            :class="[
              'cursor-pointer px-4 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap',
              selectedPlatform === 'all'
                ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            ]"
          >
            {{ t('all') }}
          </button>
          <button
            @click="selectedPlatform = 'd'"
            :class="[
              'cursor-pointer px-4 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap',
              selectedPlatform === 'd'
                ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            ]"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>{{ t('desktop') }}</span>
          </button>
          <button
            @click="selectedPlatform = 'm'"
            :class="[
              'cursor-pointer px-4 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap',
              selectedPlatform === 'm'
                ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            ]"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>{{ t('mobile') }}</span>
          </button>
          <button
            @click="selectedPlatform = 's'"
            :class="[
              'cursor-pointer px-4 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap',
              selectedPlatform === 's'
                ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            ]"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
            <span>{{ t('server') }}</span>
          </button>
        </div>
      </div>

      <!-- Projects Categorized Sections -->
      <div v-if="filteredProjects.length > 0" class="space-y-12">
        <template v-for="cat in ['application', 'service', 'script']" :key="cat">
          <div v-if="getProjectsByType(cat).length > 0" class="space-y-6">
            <!-- Category Header -->
            <div class="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 class="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 capitalize">
                {{ t(cat) }}
              </h2>
              <span class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {{ getProjectsByType(cat).length }}
              </span>
            </div>

            <!-- Category Projects Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="(project, index) in getProjectsByType(cat)"
                :key="index"
                :class="[
                  'bg-white dark:bg-slate-900 rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group',
                  project.enabled === false
                    ? 'opacity-70 border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40'
                    : 'border-slate-200 dark:border-slate-800'
                ]"
              >
                <div>
                  <!-- Top Row: Icon & Platforms -->
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center space-x-3">
                      <img
                        :src="project.icon"
                        :alt="project.name"
                        class="w-12 h-12 rounded-xl object-cover shrink-0"
                        @error="($event.target as HTMLElement).style.display = 'none'"
                      />
                      <div>
                        <h3
                          :class="[
                            'text-base font-semibold transition-colors',
                            project.enabled === false
                              ? 'line-through text-slate-500 dark:text-slate-400'
                              : 'text-slate-900 dark:text-slate-100'
                          ]"
                        >
                          {{ project.name }}
                        </h3>
                        <span class="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-medium bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 rounded-md border border-teal-100 dark:border-teal-900/50">
                          {{ project.framework }}
                        </span>
                      </div>
                    </div>

                    <!-- Platform Icons (Hidden for script type) -->
                    <div v-if="project.type !== 'script' && project.platform && project.platform.length > 0" class="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-lg">
                      <template v-for="p in project.platform" :key="p">
                        <!-- Desktop -->
                        <span v-if="p === 'd'" class="text-slate-600 dark:text-slate-300" :title="getPlatformName('d')">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </span>
                        <!-- Mobile -->
                        <span v-else-if="p === 'm'" class="text-slate-600 dark:text-slate-300" :title="getPlatformName('m')">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </span>
                        <!-- Server -->
                        <span v-else-if="p === 's'" class="text-slate-600 dark:text-slate-300" :title="getPlatformName('s')">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                          </svg>
                        </span>
                      </template>
                    </div>
                  </div>

            <!-- Detail Description -->
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
              {{ locale === 'cn' ? project.detail.cn : project.detail.en }}
            </p>

            <!-- Language Tags -->
            <div class="mb-4 flex flex-wrap gap-1">
              <span
                v-for="lang in project.language"
                :key="lang"
                class="px-2 py-0.5 text-[10px] uppercase font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded"
              >
                {{ lang }}
              </span>
            </div>

            <!-- Components List (Optional) -->
            <div v-if="project.components && project.components.length > 0" class="mb-4 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
              <div class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                {{ t('components') }}
              </div>
              <div class="space-y-2">
                <div v-for="(comp, cIdx) in project.components" :key="cIdx" class="flex items-center justify-between text-xs">
                  <div class="flex items-center space-x-2">
                    <span class="font-medium text-slate-800 dark:text-slate-200">{{ comp.name }}</span>
                    <span class="px-1.5 py-0.5 text-[9px] bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                      {{ comp.framework }}
                    </span>
                  </div>
                  <a
                    :href="comp.github"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="cursor-pointer text-teal-600 dark:text-teal-400 hover:underline flex items-center space-x-1"
                  >
                    <span>GitHub</span>
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons / Links -->
          <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <!-- GitHub Link -->
            <a
              :href="project.github"
              target="_blank"
              rel="noopener noreferrer"
              class="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>{{ t('github') }}</span>
            </a>

            <!-- Optional App Store & MS Store -->
            <div class="flex items-center space-x-2">
              <a
                v-if="project.appstore"
                :href="project.appstore"
                target="_blank"
                rel="noopener noreferrer"
                class="cursor-pointer inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors border border-teal-100 dark:border-teal-900/50"
                :title="t('appStore')"
              >
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <g transform="translate(-7.29 -7.61)">
                    <path d="M24.76888,20.30068a4.94881,4.94881,0,0,1,2.35656-4.15206,5.06566,5.06566,0,0,0-3.99116-2.15768c-1.67924-.17626-3.30719,1.00483-4.1629,1.00483-.87227,0-2.18977-.98733-3.6085-.95814a5.31529,5.31529,0,0,0-4.47292,2.72787c-1.934,3.34842-.49141,8.26947,1.3612,10.97608.9269,1.32535,2.01018,2.8058,3.42763,2.7533,1.38706-.05753,1.9051-.88448,3.5794-.88448,1.65876,0,2.14479.88448,3.591.8511,1.48838-.02416,2.42613-1.33124,3.32051-2.66914a10.962,10.962,0,0,0,1.51842-3.09251A4.78205,4.78205,0,0,1,24.76888,20.30068Z"/>
                    <path d="M22.03725,12.21089a4.87248,4.87248,0,0,0,1.11452-3.49062,4.95746,4.95746,0,0,0-3.20758,1.65961,4.63634,4.63634,0,0,0-1.14371,3.36139A4.09905,4.09905,0,0,0,22.03725,12.21089Z"/>
                  </g>
                </svg>
                <span>App Store</span>
              </a>

              <a
                v-if="project.msstore"
                :href="project.msstore"
                target="_blank"
                rel="noopener noreferrer"
                class="cursor-pointer inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-900 transition-colors border border-sky-100 dark:border-sky-900/50"
                :title="t('msStore')"
              >
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="9.5" height="9.5" />
                  <rect x="12.5" y="2" width="9.5" height="9.5" />
                  <rect x="2" y="12.5" width="9.5" height="9.5" />
                  <rect x="12.5" y="12.5" width="9.5" height="9.5" />
                </svg>
                <span>MS Store</span>
              </a>
            </div>
          </div>
        </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-slate-500 dark:text-slate-400 text-sm">{{ t('noProjects') }}</p>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
      <div class="max-w-7xl mx-auto px-4">
        <p>Copyright © {{ new Date().getFullYear() }} ZhouC</p>
      </div>
    </footer>
  </div>
</template>
