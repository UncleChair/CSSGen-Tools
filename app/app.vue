<script setup lang="ts">
import { useThemeToggle } from '~/composables/useThemeToggle'

const { t, setLocale } = useI18n()
const localePath = useLocalePath()
const { isDark, toggle: toggleTheme, init: initTheme } = useThemeToggle()

// Root URL of the current domain; set in onMounted to avoid SSR/client hydration mismatch
const mainSiteUrl = ref<string | null>(null)

onMounted(() => {
  initTheme()
  mainSiteUrl.value = document.location.origin
})

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
        <NuxtLink :to="localePath('/')" class="text-white text-decoration-none font-weight-bold">
          {{ t('site_title') }}
        </NuxtLink>
      </v-app-bar-title>

      <template #append>
        <!-- Back to main site — same node on SSR and client to avoid hydration mismatch -->
        <v-tooltip :text="t('back_to_main')" location="bottom">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              v-show="mainSiteUrl"
              icon="mdi-home-export-outline"
              variant="text"
              color="white"
              :href="mainSiteUrl || '#'"
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
