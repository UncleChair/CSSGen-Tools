<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useHead(() => ({
  title: `${t('tools.border_radius.title')} — ${t('site_title')}`,
  meta: [
    { name: 'description', content: t('tools.border_radius.description') },
    { name: 'keywords', content: 'CSS border radius generator, border-radius, CSS shape, rounded corners' },
  ],
}))

const linked = ref(true)
const corners = ref({ tl: 12, tr: 12, br: 12, bl: 12 })

function setAll(value: number) {
  corners.value = { tl: value, tr: value, br: value, bl: value }
}

watch(
  () => corners.value.tl,
  (v) => { if (linked.value) setAll(v) },
)

const cssOutput = computed(() => {
  const { tl, tr, br, bl } = corners.value
  if (tl === tr && tr === br && br === bl) {
    return `border-radius: ${tl}px;`
  }
  return `border-radius: ${tl}px ${tr}px ${br}px ${bl}px;`
})

const previewStyle = computed(() => ({
  borderRadius: `${corners.value.tl}px ${corners.value.tr}px ${corners.value.br}px ${corners.value.bl}px`,
}))

const copied = ref(false)
async function copyCSS() {
  await navigator.clipboard.writeText(cssOutput.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

const cornerDefs = computed(() => [
  { key: 'tl', label: t('tools.border_radius.top_left') },
  { key: 'tr', label: t('tools.border_radius.top_right') },
  { key: 'bl', label: t('tools.border_radius.bottom_left') },
  { key: 'br', label: t('tools.border_radius.bottom_right') },
])
</script>

<template>
  <v-container class="py-8" style="max-width: 860px">
    <v-btn
      :to="localePath('/')"
      variant="text"
      color="primary"
      prepend-icon="mdi-arrow-left"
      class="px-0"
    >
      {{ t('back_to_tools') }}
    </v-btn>

    <h1 class="text-h4 font-weight-bold mb-1">{{ t('tools.border_radius.title') }}</h1>
    <p class="text-body-1 text-medium-emphasis mb-6">{{ t('tools.border_radius.description') }}</p>

    <v-row>
      <!-- Controls -->
      <v-col cols="12" md="5">
        <v-card rounded="lg" elevation="1" class="pa-4">
          <div class="d-flex align-center justify-space-between mb-4">
            <span class="text-subtitle-2 font-weight-bold">{{ t('tools.border_radius.corners') }}</span>
            <v-switch
              v-model="linked"
              :label="t('tools.border_radius.link_all')"
              density="compact"
              hide-details
              color="teal"
            />
          </div>

          <div v-for="corner in cornerDefs" :key="corner.key" class="mb-4">
            <p class="text-caption mb-1">
              {{ corner.label }}: {{ (corners as Record<string, number>)[corner.key] }}px
            </p>
            <v-slider
              v-model="(corners as Record<string, number>)[corner.key]"
              min="0"
              max="200"
              step="1"
              color="teal"
              hide-details
              :disabled="linked && corner.key !== 'tl'"
            />
          </div>
        </v-card>
      </v-col>

      <!-- Preview + Output -->
      <v-col cols="12" md="7">
        <div class="preview-area rounded-lg mb-4">
          <div class="preview-box bg-teal" :style="previewStyle">
            <span class="corner-label tl">{{ corners.tl }}px</span>
            <span class="corner-label tr">{{ corners.tr }}px</span>
            <span class="corner-label bl">{{ corners.bl }}px</span>
            <span class="corner-label br">{{ corners.br }}px</span>
          </div>
        </div>

        <v-card rounded="lg" elevation="1">
          <v-card-title class="text-subtitle-2 font-weight-bold pa-3 pb-0">
            {{ t('css_output') }}
          </v-card-title>
          <v-card-text>
            <pre class="css-output">{{ cssOutput }}</pre>
          </v-card-text>
          <v-card-actions class="pa-3 pt-0">
            <v-btn
              :prepend-icon="copied ? 'mdi-check' : 'mdi-content-copy'"
              :color="copied ? 'success' : 'teal'"
              variant="tonal"
              @click="copyCSS"
            >
              {{ copied ? t('copied') : t('copy_css') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.preview-area {
  background: rgba(var(--v-theme-on-surface), 0.05);
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.preview-box {
  width: 160px;
  height: 160px;
  position: relative;
  opacity: 0.85;
}

.corner-label {
  position: absolute;
  font-size: 10px;
  font-weight: bold;
  color: white;
  background: rgba(0, 0, 0, 0.35);
  padding: 1px 4px;
  border-radius: 3px;
}

.corner-label.tl { top: 6px; left: 6px; }
.corner-label.tr { top: 6px; right: 6px; }
.corner-label.bl { bottom: 6px; left: 6px; }
.corner-label.br { bottom: 6px; right: 6px; }

.css-output {
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.85rem;
  white-space: pre-wrap;
  background: rgb(var(--v-theme-surface-variant));
  padding: 12px;
  border-radius: 6px;
  margin: 0;
}
</style>
