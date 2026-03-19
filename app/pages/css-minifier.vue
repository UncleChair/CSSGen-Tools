<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useHead(() => ({
  title: `${t('tools.minifier.title')} — ${t('site_title')}`,
  meta: [
    { name: 'description', content: t('tools.minifier.description') },
    { name: 'keywords', content: 'CSS minifier, CSS compressor, minify CSS, CSS optimizer, csso' },
  ],
}))

const inputCSS = ref('')
const outputCSS = ref('')
const isProcessing = ref(false)
const copiedInput = ref(false)
const copiedOutput = ref(false)
const activeMode = ref<'normal' | 'strong' | 'restore' | null>(null)

const stats = computed(() => {
  if (!inputCSS.value || !outputCSS.value || activeMode.value === 'restore') return null
  const original = new TextEncoder().encode(inputCSS.value).length
  const minified = new TextEncoder().encode(outputCSS.value).length
  const saved = original - minified
  const ratio = original > 0 ? ((saved / original) * 100).toFixed(1) : '0.0'
  return { original, minified, saved, ratio }
})

/** Normal compression: strip comments, collapse whitespace, remove obvious redundancies. */
function minifyNormal() {
  activeMode.value = 'normal'
  let css = inputCSS.value
  // Remove block comments
  css = css.replace(/\/\*[\s\S]*?\*\//g, '')
  // Collapse all whitespace sequences (spaces, tabs, newlines) to a single space
  css = css.replace(/\s+/g, ' ')
  // Remove spaces around structural punctuation
  css = css.replace(/\s*([{}:;,>+~])\s*/g, '$1')
  // Remove trailing semicolons before closing brace
  css = css.replace(/;}/g, '}')
  outputCSS.value = css.trim()
}

/** Strong compression: delegate to csso for full optimization. */
async function minifyStrong() {
  activeMode.value = 'strong'
  isProcessing.value = true
  try {
    // Dynamic import keeps csso out of the initial bundle and avoids SSR issues
    const { minify } = await import('csso')
    outputCSS.value = minify(inputCSS.value).css
  }
  catch (err) {
    console.error('csso minification failed:', err)
  }
  finally {
    isProcessing.value = false
  }
}

/**
 * Restore: right → left. Reads compressed CSS from the output panel,
 * adds back spaces/newlines/indentation, writes readable CSS to the input panel.
 */
function restoreCSS() {
  activeMode.value = 'restore'
  const css = outputCSS.value.trim()
  let result = ''
  let indent = 0

  for (let i = 0; i < css.length; i++) {
    const ch = css[i]

    if (ch === '{') {
      // Ensure exactly one space before the opening brace
      if (result.length && result[result.length - 1] !== ' ') result += ' '
      result += '{\n'
      indent++
      result += '  '.repeat(indent)
    }
    else if (ch === '}') {
      result = result.trimEnd()
      indent = Math.max(0, indent - 1)
      // Separate top-level rules with a blank line
      result += '\n' + '  '.repeat(indent) + '}\n' + (indent === 0 ? '\n' : '  '.repeat(indent))
    }
    else if (ch === ';') {
      result += ';\n' + '  '.repeat(indent)
    }
    else if (ch === ':') {
      result += ':'
      // Add space after `:` only inside a block and not for `::` pseudo-elements
      if (indent > 0 && css[i + 1] !== ':') result += ' '
    }
    else if (ch === ',') {
      result += ','
      // Between selectors (top level) → newline; inside values → single space
      result += indent === 0 ? '\n' : ' '
    }
    else {
      result += ch
    }
  }

  inputCSS.value = result.trim()
}

async function copyInput() {
  if (!inputCSS.value) return
  await navigator.clipboard.writeText(inputCSS.value)
  copiedInput.value = true
  setTimeout(() => (copiedInput.value = false), 2000)
}

async function copyOutput() {
  if (!outputCSS.value) return
  await navigator.clipboard.writeText(outputCSS.value)
  copiedOutput.value = true
  setTimeout(() => (copiedOutput.value = false), 2000)
}

function clearAll() {
  inputCSS.value = ''
  outputCSS.value = ''
  activeMode.value = null
}

const EXAMPLE_CSS = `.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* center layout */
  padding: 16px 24px;
  margin: 0 auto;
  max-width: 1200px;
  background-color: #ffffff;
}

.button {
  display: inline-block;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  background-color: #1565C0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.button:hover {
  background-color: #0D47A1;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}`

function loadExample() {
  inputCSS.value = EXAMPLE_CSS
  outputCSS.value = ''
  activeMode.value = null
}
</script>

<template>
  <v-container class="py-8" style="max-width: 1100px">
    <v-btn
      :to="localePath('/')"
      variant="text"
      color="primary"
      prepend-icon="mdi-arrow-left"
      class="px-0"
    >
      {{ t('back_to_tools') }}
    </v-btn>

    <h1 class="text-h4 font-weight-bold mb-1">{{ t('tools.minifier.title') }}</h1>
    <p class="text-body-1 text-medium-emphasis mb-6">{{ t('tools.minifier.description') }}</p>

    <!-- Action buttons -->
    <div class="d-flex flex-wrap ga-3 mb-5">
      <v-btn
        color="primary"
        variant="tonal"
        prepend-icon="mdi-zip-box-outline"
        :disabled="!inputCSS || isProcessing"
        @click="minifyNormal"
      >
        {{ t('tools.minifier.normal_minify') }}
      </v-btn>

      <v-btn
        color="secondary"
        variant="tonal"
        prepend-icon="mdi-rocket-launch-outline"
        :loading="isProcessing"
        :disabled="!inputCSS"
        @click="minifyStrong"
      >
        {{ t('tools.minifier.strong_minify') }}
      </v-btn>

      <v-btn
        color="orange-darken-2"
        variant="tonal"
        prepend-icon="mdi-format-align-left"
        :disabled="!outputCSS || isProcessing"
        @click="restoreCSS"
      >
        {{ t('tools.minifier.restore') }}
      </v-btn>

      <v-spacer class="d-none d-sm-flex" />

      <v-btn
        variant="text"
        color="secondary"
        prepend-icon="mdi-code-tags"
        @click="loadExample"
      >
        {{ t('tools.minifier.load_example') }}
      </v-btn>

      <v-btn
        variant="text"
        color="error"
        prepend-icon="mdi-delete-outline"
        :disabled="!inputCSS && !outputCSS"
        @click="clearAll"
      >
        {{ t('tools.minifier.clear') }}
      </v-btn>
    </div>

    <!-- Stats bar -->
    <v-fade-transition>
      <v-card v-if="stats" rounded="lg" elevation="0" color="teal-lighten-5" class="mb-5 pa-3">
        <div class="d-flex flex-wrap ga-6 align-center">
          <div class="stat-item">
            <span class="text-caption text-medium-emphasis">{{ t('tools.minifier.original_size') }}</span>
            <span class="text-body-2 font-weight-bold ml-1">{{ stats.original }} B</span>
          </div>
          <v-icon icon="mdi-arrow-right" size="16" color="teal-darken-2" />
          <div class="stat-item">
            <span class="text-caption text-medium-emphasis">{{ t('tools.minifier.minified_size') }}</span>
            <span class="text-body-2 font-weight-bold ml-1">{{ stats.minified }} B</span>
          </div>
          <div class="stat-item">
            <span class="text-caption text-medium-emphasis">{{ t('tools.minifier.saved') }}</span>
            <span class="text-body-2 font-weight-bold text-teal-darken-2 ml-1">{{ stats.saved }} B</span>
          </div>
          <v-chip color="teal-darken-2" variant="tonal" size="small">
            <v-icon start icon="mdi-arrow-collapse-all" />
            {{ t('tools.minifier.compression_ratio') }}: {{ stats.ratio }}%
          </v-chip>
          <v-chip v-if="activeMode" variant="outlined" color="teal-darken-2" size="small">
            {{ activeMode === 'normal' ? t('tools.minifier.mode_normal') : t('tools.minifier.mode_strong') }}
          </v-chip>
        </div>
      </v-card>
    </v-fade-transition>

    <!-- Editor panels -->
    <v-row>
      <!-- Input -->
      <v-col cols="12" md="6">
        <v-card rounded="lg" elevation="1" class="h-100 d-flex flex-column">
          <div class="panel-header px-3">
            <v-icon icon="mdi-code-braces" size="18" class="mr-2 text-medium-emphasis" />
            <span class="text-subtitle-2 font-weight-bold">{{ t('tools.minifier.input_label') }}</span>
            <v-spacer />
            <span class="text-caption text-medium-emphasis mr-2">
              {{ inputCSS.length }} {{ t('tools.minifier.chars') }}
            </span>
            <v-tooltip :text="copiedInput ? t('copied') : t('copy_css')" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  :icon="copiedInput ? 'mdi-check' : 'mdi-content-copy'"
                  :color="copiedInput ? 'success' : 'default'"
                  variant="text"
                  size="small"
                  :disabled="!inputCSS"
                  @click="copyInput"
                />
              </template>
            </v-tooltip>
          </div>
          <v-divider />
          <v-card-text class="pa-0 flex-grow-1">
            <textarea
              v-model="inputCSS"
              class="code-editor"
              :placeholder="t('tools.minifier.input_placeholder')"
              spellcheck="false"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Output -->
      <v-col cols="12" md="6">
        <v-card rounded="lg" elevation="1" class="h-100 d-flex flex-column">
          <div class="panel-header px-3">
            <v-icon icon="mdi-zip-box-outline" size="18" class="mr-2 text-teal-darken-2" />
            <span class="text-subtitle-2 font-weight-bold">{{ t('tools.minifier.output_label') }}</span>
            <v-spacer />
            <span class="text-caption text-medium-emphasis mr-2">
              {{ outputCSS.length }} {{ t('tools.minifier.chars') }}
            </span>
            <v-tooltip :text="copiedOutput ? t('copied') : t('copy_css')" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  :icon="copiedOutput ? 'mdi-check' : 'mdi-content-copy'"
                  :color="copiedOutput ? 'success' : 'default'"
                  variant="text"
                  size="small"
                  :disabled="!outputCSS"
                  @click="copyOutput"
                />
              </template>
            </v-tooltip>
          </div>
          <v-divider />
          <v-card-text class="pa-0 flex-grow-1 position-relative">
            <textarea
              v-model="outputCSS"
              class="code-editor"
              :placeholder="t('tools.minifier.output_placeholder')"
              spellcheck="false"
            />
            <v-fade-transition>
              <div v-if="isProcessing" class="processing-overlay d-flex align-center justify-center">
                <v-progress-circular indeterminate color="teal-darken-2" />
              </div>
            </v-fade-transition>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Explanation cards -->
    <v-row class="mt-4">
      <v-col cols="12" sm="4">
        <v-card rounded="lg" elevation="0" variant="tonal" color="teal">
          <v-card-item>
            <template #prepend>
              <v-icon icon="mdi-zip-box-outline" color="teal-darken-2" />
            </template>
            <v-card-title class="text-body-2 font-weight-bold">
              {{ t('tools.minifier.normal_minify') }}
            </v-card-title>
          </v-card-item>
          <v-card-text class="text-body-2 text-medium-emphasis pt-0">
            {{ t('tools.minifier.normal_desc') }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card rounded="lg" elevation="0" variant="tonal" color="teal">
          <v-card-item>
            <template #prepend>
              <v-icon icon="mdi-rocket-launch-outline" color="teal-darken-2" />
            </template>
            <v-card-title class="text-body-2 font-weight-bold">
              {{ t('tools.minifier.strong_minify') }}
            </v-card-title>
          </v-card-item>
          <v-card-text class="text-body-2 text-medium-emphasis pt-0">
            {{ t('tools.minifier.strong_desc') }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card rounded="lg" elevation="0" variant="tonal" color="orange">
          <v-card-item>
            <template #prepend>
              <v-icon icon="mdi-format-align-left" color="orange-darken-2" />
            </template>
            <v-card-title class="text-body-2 font-weight-bold">
              {{ t('tools.minifier.restore') }}
            </v-card-title>
          </v-card-item>
          <v-card-text class="text-body-2 text-medium-emphasis pt-0">
            {{ t('tools.minifier.restore_desc') }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.code-editor {
  width: 100%;
  height: 340px;
  resize: none;
  border: none;
  outline: none;
  padding: 14px;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.82rem;
  line-height: 1.6;
  background: transparent;
  color: inherit;
}

.panel-header {
  display: flex;
  align-items: center;
  height: 48px;
  flex-shrink: 0;
}

.processing-overlay {
  position: absolute;
  inset: 0;
  background: rgba(var(--v-theme-surface), 0.7);
  backdrop-filter: blur(2px);
}

.stat-item {
  display: flex;
  align-items: center;
}
</style>
