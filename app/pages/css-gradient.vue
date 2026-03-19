<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useHead(() => ({
  title: `${t('tools.gradient.title')} — ${t('site_title')}`,
  meta: [
    { name: 'description', content: t('tools.gradient.description') },
    { name: 'keywords', content: 'CSS gradient generator, linear-gradient, radial-gradient, CSS background' },
  ],
}))

type GradientType = 'linear' | 'radial'

interface Stop {
  color: string
  position: number
}

const type = ref<GradientType>('linear')
const angle = ref(135)
const stops = ref<Stop[]>([
  { color: '#5C6BC0', position: 0 },
  { color: '#7E57C2', position: 100 },
])

const cssOutput = computed(() => {
  const stopStr = stops.value
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((s) => `${s.color} ${s.position}%`)
    .join(', ')

  if (type.value === 'linear') {
    return `background: linear-gradient(${angle.value}deg, ${stopStr});`
  }
  return `background: radial-gradient(circle, ${stopStr});`
})

const previewStyle = computed(() => {
  const stopStr = stops.value
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((s) => `${s.color} ${s.position}%`)
    .join(', ')

  if (type.value === 'linear') {
    return { background: `linear-gradient(${angle.value}deg, ${stopStr})` }
  }
  return { background: `radial-gradient(circle, ${stopStr})` }
})

function addStop() {
  stops.value.push({ color: '#EC407A', position: 50 })
}

function removeStop(index: number) {
  if (stops.value.length > 2) stops.value.splice(index, 1)
}

const copied = ref(false)
async function copyCSS() {
  await navigator.clipboard.writeText(cssOutput.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <v-container class="py-8" style="max-width: 900px">
    <v-btn
      :href="localePath('/')"
      variant="text"
      color="primary"
      prepend-icon="mdi-arrow-left"
      class="mb-6 px-0"
    >
      {{ t('back_to_tools') }}
    </v-btn>

    <h1 class="text-h4 font-weight-bold mb-1">{{ t('tools.gradient.title') }}</h1>
    <p class="text-body-1 text-medium-emphasis mb-6">{{ t('tools.gradient.description') }}</p>

    <v-row>
      <!-- Controls -->
      <v-col cols="12" md="5">
        <v-card rounded="lg" elevation="1" class="pa-4">
          <!-- Gradient type -->
          <p class="text-subtitle-2 font-weight-bold mb-2">{{ t('tools.gradient.type') }}</p>
          <v-btn-toggle v-model="type" mandatory density="compact" class="mb-4" color="primary">
            <v-btn value="linear">{{ t('tools.gradient.linear') }}</v-btn>
            <v-btn value="radial">{{ t('tools.gradient.radial') }}</v-btn>
          </v-btn-toggle>

          <!-- Angle (linear only) -->
          <template v-if="type === 'linear'">
            <p class="text-subtitle-2 font-weight-bold mb-1">{{ t('tools.gradient.angle') }}: {{ angle }}°</p>
            <v-slider v-model="angle" min="0" max="360" step="1" color="primary" class="mb-4" hide-details />
          </template>

          <!-- Color stops -->
          <p class="text-subtitle-2 font-weight-bold mb-2">{{ t('tools.gradient.color_stops') }}</p>
          <div v-for="(stop, i) in stops" :key="i" class="d-flex align-center ga-2 mb-3">
            <input v-model="stop.color" type="color" class="color-swatch" />
            <v-text-field
              v-model="stop.color"
              density="compact"
              hide-details
              variant="outlined"
              style="max-width: 110px"
            />
            <v-slider
              v-model="stop.position"
              min="0"
              max="100"
              step="1"
              color="primary"
              hide-details
              class="flex-grow-1"
            />
            <span class="text-caption" style="min-width: 36px">{{ stop.position }}%</span>
            <v-btn
              icon="mdi-close"
              size="x-small"
              variant="text"
              :disabled="stops.length <= 2"
              @click="removeStop(i)"
            />
          </div>

          <v-btn prepend-icon="mdi-plus" variant="tonal" color="primary" size="small" @click="addStop">
            {{ t('tools.gradient.add_stop') }}
          </v-btn>
        </v-card>
      </v-col>

      <!-- Preview + Output -->
      <v-col cols="12" md="7">
        <div class="gradient-preview rounded-lg mb-4" :style="previewStyle" />

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
              :color="copied ? 'success' : 'primary'"
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
.gradient-preview {
  width: 100%;
  height: 200px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.css-output {
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.85rem;
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
