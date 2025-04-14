import { defineStore } from 'pinia'
import { disable, enable } from '@tauri-apps/plugin-autostart'

export const useSettingStore = defineStore('setting', {
  state: () => ({
    general: {
      isBootstrap: false,
      closePanel: 'hidden', //hidden,close
      theme: 'light', //dark,light,system
      isMenuFold: true,
      callbackIp: 'http://127.0.0.1',
      callbackPort: '5222',
      nCtxRounds: 15
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
    },
    setCallbackIp(ip) {
      if (ip) {
        this.general.callbackIp = ip
      } else {
        this.general.callbackIp = 'http://127.0.0.1'
      }
    },
    setCallbackPort(port) {
      if (port) {
        this.general.callbackPort = port.toString().replace(/\D/g, '')
      } else {
        this.general.callbackPort = '5222'
      }
    },
    setNCtxRounds(num) {
      if (num <= 100 && num > -1) {
        this.general.nCtxRounds = num
      } else {
        this.general.nCtxRounds = 15
      }
    }
  },
  persist: true
})
