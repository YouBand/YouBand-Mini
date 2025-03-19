import { defineStore } from 'pinia'
import { disable, enable } from '@tauri-apps/plugin-autostart'

export const useSettingStore = defineStore('setting', {
  state: () => ({
    general: {
      isBootstrap: false,
      closePanel: 'hidden', //hidden,close
      theme: 'light', //dark,light,system
      isMenuFold: true
    }
  }),
  actions: {
    setIsBootstrap(isBootstrap) {
      this.general.isBootstrap = isBootstrap
      if (isBootstrap) {
        enable()
      } else {
        disable()
      }
    },
    setClosePanel(closePanel) {
      this.general.closePanel = closePanel
    },
    setTheme(newTheme) {
      this.general.theme = newTheme
      document.body.setAttribute('data-theme', newTheme)
    },
    setIsMenuFold(isMenuFold) {
      this.general.isMenuFold = isMenuFold
    }
  },
  persist: true
})
