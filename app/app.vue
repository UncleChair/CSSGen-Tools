<script setup lang="ts">
import { useThemeToggle } from '~/composables/useThemeToggle'

const { t, setLocale } = useI18n()
const localePath = useLocalePath()
const { isDark, toggle: toggleTheme, init: initTheme } = useThemeToggle()

// Root URL of the current domain, resolved at runtime
const mainSiteUrl = computed(() => import.meta.client ? document.location.origin : null)

onMounted(() => initTheme())

// setLocale() from @nuxtjs/i18n handles both locale state + navigation
function switchLang(code: string) {
  setLocale(code as 'en' | 'zh')
}
</script>

<template>
  <v-app>
    <!-- ── Top navigation bar ─────────────────────────────────────────── -->
    <v-app-bar flat color="primary">
      <v-app-bar-title>
        <a :href="localePath('/')" class="text-white text-decoration-none font-weight-bold">
          {{ t('site_title') }}
        </a>
      </v-app-bar-title>

      <template #append>
        <!-- Back to main site — only rendered when a home URL is detected -->
        <v-tooltip v-if="mainSiteUrl" :text="t('back_to_main')" location="bottom">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-home-export-outline"
              variant="text"
              color="white"
              :href="mainSiteUrl"
            />
          </template>
        </v-tooltip>

        <!-- Theme toggle -->
        <v-tooltip :text="isDark ? 'Light mode' : 'Dark mode'" location="bottom">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
              variant="text"
              color="white"
              @click="toggleTheme"
            />
          </template>
        </v-tooltip>

        <!-- Language switcher — setLocale() updates locale state + navigates -->
        <v-menu location="bottom">
          <template #activator="{ props }">
            <v-btn
              icon="mdi-translate"
              variant="text"
              v-bind="props"
            />
          </template>
          <v-list>
            <v-list-item
              key="zh"
              title="简体中文"
              @click="switchLang('zh')"
            />
            <v-list-item
              key="en"
              title="English"
              @click="switchLang('en')"
            />
          </v-list>
        </v-menu>

        <v-btn icon="mdi-github" href="https://github.com" target="_blank" rel="noopener" color="white" />
      </template>
    </v-app-bar>

    <!-- ── Page content ───────────────────────────────────────────────── -->
    <v-main>
      <NuxtPage />
    </v-main>

    <!-- ── Footer ─────────────────────────────────────────────────────── -->
    <v-footer class="text-center d-flex flex-column pa-4" elevation="0">
      <span class="text-caption text-medium-emphasis">
        {{ t('footer_text') }}
      </span>
    </v-footer>
  </v-app>
</template>
