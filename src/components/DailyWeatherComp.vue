<script setup>
import { useWeatherStore } from '@/stores/weatherStore.js'
import ImageComp from './ImageComp.vue'
import axios from 'axios'
import { ref, watchEffect } from 'vue'

const store = useWeatherStore()
const dailyWeather = ref()

watchEffect(async () => {
  if (store.currentPosition) {
    const latitude = store.currentPosition.latitude
    const longitude = store.currentPosition.longitude

    const urlWeather = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,apparent_temperature_max,apparent_temperature_min,rain_sum,snowfall_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`

    try {
      console.log('Récupération des prévision météo ...')

      const responseWeather = (await axios.get(urlWeather)).data.daily
      dailyWeather.value = responseWeather
      console.log('Daily Weather : ', responseWeather)
    } catch (error) {
      console.log('Erreur : ', error)
    }
  }
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  if (date.getMonth() + 1 < 10) {
    const month = '0' + (date.getMonth() + 1)
    return `${date.getDate()}/${month}`
  }
  return `${date.getDate()}/${date.getMonth() + 1}`
}
</script>

<template>
  <h2
    v-if="dailyWeather"
    style="text-shadow: 1px 1px 3px var(--dark)"
    class="text-white text-2xl text-center mt-3"
  >
    Prévisions 7 jours
  </h2>
  <div
    v-if="dailyWeather"
    class="bg-dark bg-opacity-30 rounded-lg mt-2 p-2 overflow-x-auto grid-flow-col grid gap-2 shadow-lg"
  >
    <div
      v-for="(day, index) in dailyWeather.time"
      :key="index"
      style="width: 115px"
      class="grid grid-cols-1 gap-1 text-white bg-dark bg-opacity-40 p-1 rounded shadow"
    >
      <span class="mx-auto">{{ formatDate(day) }}</span>
      <ImageComp :weather-code="dailyWeather.weather_code[index]" class="w-10 mx-auto" />
      <span style="text-shadow: 1px 1px 3px var(--dark)" class="mx-auto text-red"
        >{{ dailyWeather.apparent_temperature_max[index] }} °c</span
      >
      <span style="text-shadow: 1px 1px 3px var(--dark)" class="mx-auto text-blue"
        >{{ dailyWeather.apparent_temperature_min[index] }} °c</span
      >

      <div class="flex gap-2 mx-auto">
        <img src="/images/icons/water.png" alt="" class="w-4 my-auto" />
        <span class="my-auto">{{ dailyWeather.rain_sum[index] }} mm</span>
      </div>
      <div v-if="dailyWeather.snowfall_sum[index] > 0" class="flex gap-2 mx-auto">
        <img src="/images/icons/snowflake.png" alt="" class="w-4 my-auto" />
        <span class="my-auto">{{ dailyWeather.snowfall_sum[index] }} cm</span>
      </div>
      <span class="mx-auto">{{ dailyWeather.precipitation_probability_max[index] }}% </span>
      <div class="flex gap-2 mx-auto">
        <img src="/images/icons/wind.png" alt="" class="w-4 my-auto" />
        <span class="mx-auto">{{ dailyWeather.wind_speed_10m_max[index] }} km/h </span>
      </div>
    </div>
  </div>
</template>
