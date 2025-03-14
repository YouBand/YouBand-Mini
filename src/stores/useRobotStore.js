import { defineStore } from 'pinia'

export const useRobotStore = defineStore('robot', {
  state: () => ({
    robotStatus: {}
  }),
  actions: {
    setRobotStatus(key, status) {
      this.robotStatus[key] = status
    },
    removeRobotStatus(key) {
      delete this.robotStatus[key]
    }
  }
})
