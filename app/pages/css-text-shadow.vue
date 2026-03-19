<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useHead(() => ({
  title: `${t('tools.text_shadow.title')} — ${t('site_title')}`,
  meta: [
    { name: 'description', content: t('tools.text_shadow.description') },
    { name: 'keywords', content: 'CSS text shadow generator, text-shadow, typography, CSS text effect' },
  ],
}))

interface TextShadow {
  x: number
  y: number
  blur: number
  color: string
  opacity: number
}

const previewText = ref('Hello World')
const textColor = ref('#1A237E')
const fontSize = ref(48)

const shadows = ref<TextShadow[]>([
  { x: 2, y: 2, blur: 4, color: '#000000', opacity: 30 },
])

const cssOutput = computed(() => {
  const parts = shadows.value.map((s) => {
    const alpha = Math.round((s.opacity / 100) * 255)
      .toString(16)
      .padStart(2, '0')
    return `${s.x}px ${s.y}px ${s.blur}px ${s.color}${alpha}`
  })
  return `text-shadow: ${parts.join(',\n             ')};`
})

const previewTextStyle = computed(() => {
  const parts = shadows.value.map((s) => {
    const alpha = Math.round((s.opacity / 100) * 255)
      .toString(16)
      .padStart(2, '0')
    return `${s.x}px ${s.y}px ${s.blur}px ${s.color}${alpha}`
  })
  return {
    textShadow: parts.join(', '),
    color: textColor.value,
    fontSize: `${fontSize.value}px`,
    fontWeight: 'bold',
    fontFamily: 'Georgia, serif',
  }
})

function addShadow() {
  shadows.value.push({ x: 1, y: 1, blur: 3, color: '#000000', opacity: 20 })
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

    <h1 class="text-h4 font-weight-bold mb-1">{{ t('tools.text_shadow.title') }}</h1>
    <p class="text-body-1 text-medium-emphasis mb-6">{{ t('tools.text_shadow.description') }}</p>

    <v-row>
      <!-- Controls -->
      <v-col cols="12" md="5">
        <!-- Text settings -->
        <v-card rounded="lg" elevation="1" class="pa-4 mb-3">
          <p class="text-subtitle-2 font-weight-bold mb-3">{{ t('tools.text_shadow.preview_text_label') }}</p>
          <v-text-field
            v-model="previewText"
            :label="t('tools.text_shadow.text_input')"
            density="compact"
            variant="outlined"
            hide-details
            class="mb-3"
          />
          <v-row dense>
            <v-col cols="6" class="d-flex align-center ga-2">
              <input v-model="textColor" type="color" class="color-swatch" :title="t('tools.text_shadow.text_color')" />
              <span class="text-caption">{{ t('tools.text_shadow.text_color') }}</span>
            </v-col>
            <v-col cols="6">
              <p class="text-caption mb-1">{{ t('tools.text_shadow.size') }}: {{ fontSize }}px</p>
              <v-slider v-model="fontSize" min="16" max="96" step="2" color="orange" hide-details />
            </v-col>
          </v-row>
        </v-card>

        <!-- Shadow layers -->
        <v-card
          v-for="(shadow, i) in shadows"
          :key="i"
          rounded="lg"
          elevation="1"
          class="pa-4 mb-3"
        >
          <div class="d-flex align-center justify-space-between mb-3">
            <span class="text-subtitle-2 font-weight-bold">
              {{ t('tools.text_shadow.shadow_label') }} {{ i + 1 }}
            </span>
            <v-btn
              icon="mdi-delete-outline"
              size="x-small"
              variant="text"
              color="error"
              :disabled="shadows.length <= 1"
              @click="removeShadow(i)"
            />
          </div>

          <v-row dense>
            <v-col cols="6">
              <p class="text-caption mb-1">{{ t('tools.text_shadow.x') }}: {{ shadow.x }}px</p>
              <v-slider v-model="shadow.x" min="-30" max="30" step="1" color="orange" hide-details />
            </v-col>
            <v-col cols="6">
              <p class="text-caption mb-1">{{ t('tools.text_shadow.y') }}: {{ shadow.y }}px</p>
              <v-slider v-model="shadow.y" min="-30" max="30" step="1" color="orange" hide-details />
            </v-col>
            <v-col cols="6">
              <p class="text-caption mb-1">{{ t('tools.text_shadow.blur') }}: {{ shadow.blur }}px</p>
              <v-slider v-model="shadow.blur" min="0" max="40" step="1" color="orange" hide-details />
            </v-col>
            <v-col cols="6">
              <p class="text-caption mb-1">{{ t('tools.text_shadow.opacity') }}: {{ shadow.opacity }}%</p>
              <v-slider v-model="shadow.opacity" min="0" max="100" step="1" color="orange" hide-details />
            </v-col>
            <v-col cols="12" class="d-flex align-center ga-2 pt-1">
              <input v-model="shadow.color" type="color" class="color-swatch" />
              <v-text-field
                v-model="shadow.color"
                density="compact"
                hide-details
                variant="outlined"
                style="max-width: 120px"
              />
            </v-col>
          </v-row>
        </v-card>

        <v-btn prepend-icon="mdi-plus" variant="tonal" color="orange" size="small" @click="addShadow">
          {{ t('tools.text_shadow.add_shadow') }}
        </v-btn>
      </v-col>

      <!-- Preview + Output -->
      <v-col cols="12" md="7">
        <div class="preview-area rounded-lg mb-4">
          <span :style="previewTextStyle">{{ previewText || 'Hello World' }}</span>
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
              :color="copied ? 'success' : 'orange'"
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
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding: 24px;
  overflow: hidden;
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
