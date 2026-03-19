<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useHead(() => ({
  title: `${t('tools.shadow.title')} — ${t('site_title')}`,
  meta: [
    { name: 'description', content: t('tools.shadow.description') },
    { name: 'keywords', content: 'CSS box shadow generator, box-shadow, CSS shadow, drop shadow' },
  ],
}))

interface Shadow {
  x: number
  y: number
  blur: number
  spread: number
  color: string
  opacity: number
  inset: boolean
}

const shadows = ref<Shadow[]>([
  { x: 4, y: 4, blur: 16, spread: 0, color: '#000000', opacity: 20, inset: false },
])

const cssOutput = computed(() => {
  const parts = shadows.value.map((s) => {
    const alpha = Math.round((s.opacity / 100) * 255)
      .toString(16)
      .padStart(2, '0')
    return `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}${alpha}`
  })
  return `box-shadow: ${parts.join(',\n             ')};`
})

const previewBoxStyle = computed(() => {
  const parts = shadows.value.map((s) => {
    const alpha = Math.round((s.opacity / 100) * 255)
      .toString(16)
      .padStart(2, '0')
    return `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}${alpha}`
  })
  return { boxShadow: parts.join(', ') }
})

function addShadow() {
  shadows.value.push({ x: 2, y: 2, blur: 8, spread: 0, color: '#000000', opacity: 15, inset: false })
}

function removeShadow(index: number) {
  if (shadows.value.length > 1) shadows.value.splice(index, 1)
}

const copied = ref(false)
async function copyCSS() {
  await navigator.clipboard.writeText(cssOutput.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <v-container class="py-8" style="max-width: 960px">
    <v-btn
      :href="localePath('/')"
      variant="text"
      color="primary"
      prepend-icon="mdi-arrow-left"
      class="mb-6 px-0"
    >
      {{ t('back_to_tools') }}
    </v-btn>

    <h1 class="text-h4 font-weight-bold mb-1">{{ t('tools.shadow.title') }}</h1>
    <p class="text-body-1 text-medium-emphasis mb-6">{{ t('tools.shadow.description') }}</p>

    <v-row>
      <!-- Controls -->
      <v-col cols="12" md="6">
        <v-card
          v-for="(shadow, i) in shadows"
          :key="i"
          rounded="lg"
          elevation="1"
          class="pa-4 mb-3"
        >
          <div class="d-flex align-center justify-space-between mb-3">
            <span class="text-subtitle-2 font-weight-bold">
              {{ t('tools.shadow.shadow_label') }} {{ i + 1 }}
            </span>
            <div class="d-flex align-center ga-2">
              <v-switch
                v-model="shadow.inset"
                :label="t('tools.shadow.inset')"
                density="compact"
                hide-details
                color="indigo"
              />
              <v-btn
                icon="mdi-delete-outline"
                size="x-small"
                variant="text"
                color="error"
                :disabled="shadows.length <= 1"
                @click="removeShadow(i)"
              />
            </div>
          </div>

          <v-row dense>
            <v-col cols="6">
              <p class="text-caption mb-1">{{ t('tools.shadow.x_offset') }}: {{ shadow.x }}px</p>
              <v-slider v-model="shadow.x" min="-50" max="50" step="1" color="indigo" hide-details />
            </v-col>
            <v-col cols="6">
              <p class="text-caption mb-1">{{ t('tools.shadow.y_offset') }}: {{ shadow.y }}px</p>
              <v-slider v-model="shadow.y" min="-50" max="50" step="1" color="indigo" hide-details />
            </v-col>
            <v-col cols="6">
              <p class="text-caption mb-1">{{ t('tools.shadow.blur') }}: {{ shadow.blur }}px</p>
              <v-slider v-model="shadow.blur" min="0" max="100" step="1" color="indigo" hide-details />
            </v-col>
            <v-col cols="6">
              <p class="text-caption mb-1">{{ t('tools.shadow.spread') }}: {{ shadow.spread }}px</p>
              <v-slider v-model="shadow.spread" min="-20" max="50" step="1" color="indigo" hide-details />
            </v-col>
            <v-col cols="6">
              <p class="text-caption mb-1">{{ t('tools.shadow.opacity') }}: {{ shadow.opacity }}%</p>
              <v-slider v-model="shadow.opacity" min="0" max="100" step="1" color="indigo" hide-details />
            </v-col>
            <v-col cols="6" class="d-flex align-center ga-2 pt-3">
              <input v-model="shadow.color" type="color" class="color-swatch" :title="t('tools.shadow.shadow_color')" />
              <v-text-field
                v-model="shadow.color"
                density="compact"
                hide-details
                variant="outlined"
                style="max-width: 110px"
              />
            </v-col>
          </v-row>
        </v-card>

        <v-btn prepend-icon="mdi-plus" variant="tonal" color="indigo" size="small" @click="addShadow">
          {{ t('tools.shadow.add_layer') }}
        </v-btn>
      </v-col>

      <!-- Preview + Output -->
      <v-col cols="12" md="6">
        <div class="preview-area rounded-lg mb-4">
          <div class="preview-box rounded-lg bg-white" :style="previewBoxStyle" />
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
              :color="copied ? 'success' : 'indigo'"
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
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.preview-box {
  width: 120px;
  height: 120px;
}

.css-output {
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.82rem;
  white-space: pre-wrap;
  word-break: break-all;
  background: rgb(var(--v-theme-surface-variant));
  padding: 12px;
  border-radius: 6px;
  margin: 0;
}

.color-swatch {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  padding: 2px;
  background: transparent;
}
</style>
