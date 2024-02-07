import { defineStore } from 'pinia'

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    currentPosition: null
  }),
  actions: {
    setCurrentPosition(position) {
      this.currentPosition = position
    }
  }
})
