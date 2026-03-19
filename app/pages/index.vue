<script setup lang="ts">
import { toolsMeta } from '~/data/tools'

const { t } = useI18n()
const localePath = useLocalePath()

useHead(() => ({
  title: `${t('site_title')} — ${t('home.hero_subtitle').slice(0, 50)}`,
  meta: [
    { name: 'description', content: t('home.hero_subtitle') },
    { name: 'keywords', content: 'CSS tools, CSS generator, gradient, box shadow, border radius, text shadow' },
    { property: 'og:title', content: t('site_title') },
    { property: 'og:description', content: t('home.hero_subtitle') },
    { property: 'og:type', content: 'website' },
  ],
}))

// Build translated tool list for the cards
const tools = computed(() =>
  toolsMeta.map((meta) => ({
    ...meta,
    routePath: `/${meta.route}`,
    title: t(`${meta.key}.title`),
    description: t(`${meta.key}.description`),
  })),
)
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="hero-section py-16 px-4 text-center">
      <h1 class="text-h3 font-weight-bold text-white mb-4">{{ t('home.hero_title') }}</h1>
      <p class="text-h6 text-white opacity-80 mx-auto" style="max-width: 560px">
        {{ t('home.hero_subtitle') }}
      </p>
    </section>

    <!-- Tool cards grid -->
    <v-container class="py-10">
      <v-row justify="center">
        <v-col
          v-for="tool in tools"
          :key="tool.route"
          cols="12"
          sm="6"
          lg="4"
          xl="3"
        >
          <NuxtLink :to="localePath(tool.routePath)" class="text-decoration-none">
            <v-card
              class="tool-card h-100"
              rounded="lg"
              elevation="2"
              hover
            >
              <v-card-item>
                <template #prepend>
                  <v-avatar :color="tool.color" size="48" class="mr-2">
                    <v-icon :icon="tool.icon" color="white" />
                  </v-avatar>
                </template>
                <v-card-title class="text-body-1 font-weight-bold">
                  {{ tool.title }}
                </v-card-title>
              </v-card-item>

              <v-card-text class="text-body-2 text-medium-emphasis pt-0">
                {{ tool.description }}
              </v-card-text>

              <v-card-actions class="pt-0 pb-3 px-4">
                <v-chip
                  v-for="tag in tool.tags"
                  :key="tag"
                  size="x-small"
                  variant="tonal"
                  :color="tool.color"
                  class="mr-1"
                >
                  {{ tag }}
                </v-chip>
                <v-spacer />
                <v-icon icon="mdi-arrow-right" :color="tool.color" size="20" />
              </v-card-actions>
            </v-card>
          </NuxtLink>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
}

.tool-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.tool-card:hover {
  transform: translateY(-4px);
}
</style>
