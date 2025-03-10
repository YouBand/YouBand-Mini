import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: 'light'
  }),
  actions: {
    async setTheme(newTheme) {
      this.theme = newTheme
      document.body.setAttribute('data-theme', newTheme)
    }
  },
  persist: true
})
