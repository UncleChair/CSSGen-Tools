import { useTheme } from 'vuetify'

const STORAGE_KEY = 'theme'

/**
 * Provides reactive dark/light theme toggling with localStorage persistence.
 * Theme is initialised on client mount to avoid SSR hydration mismatch.
 */
export function useThemeToggle() {
  const theme = useTheme()
  const isDark = computed(() => theme.global.current.value.dark)

  function setTheme(name: 'light' | 'dark') {
    theme.global.name.value = name
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, name)
    }
  }

  function toggle() {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  /** Call once on the root component's onMounted to restore persisted preference. */
  function init() {
    if (!import.meta.client) return
    const stored = localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | null
    if (stored === 'light' || stored === 'dark') {
      theme.global.name.value = stored
    }
  }

  return { isDark, toggle, init }
}
