<script setup>
import { useWeatherStore } from '@/stores/weatherStore.js'
import ImageComp from './ImageComp.vue'
import axios from 'axios'
import { ref, watchEffect } from 'vue'

const store = useWeatherStore()
const hourlyWeather = ref()

watchEffect(async () => {
  if (store.currentPosition) {
    const latitude = store.currentPosition.latitude
    const longitude = store.currentPosition.longitude

    const urlWeather = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,apparent_temperature,precipitation_probability,rain,snowfall,weather_code,cloud_cover,wind_speed_10m&timezone=auto&past_hours=0&models=best_match`

    try {
      console.log('Récupération des prévision météo ...')

      const responseWeather = (await axios.get(urlWeather)).data.hourly
      hourlyWeather.value = responseWeather
      console.log('Hourly Weather : ', hourlyWeather.value)
    } catch (error) {
      console.log('Erreur : ', error)
    }
  }
})

function formatDate(datetime) {
  const date = new Date(datetime)
  return date.getHours() + 'h'
}
</script>

<template>
  <h2
    v-if="hourlyWeather"
    style="text-shadow: 1px 1px 3px var(--dark)"
    class="text-white text-2xl text-center mt-3"
  >
    Prévisions 12 heures
  </h2>
  <div
    v-if="hourlyWeather"
    class="bg-dark bg-opacity-30 rounded-lg mt-2 p-2 overflow-x-auto grid-flow-col grid gap-2 shadow-lg"
  >
    <div
      v-for="(item, index) in hourlyWeather.time.slice(0, 13)"
      :key="index"
      style="width: 120px; text-shadow: 1px 1px 3px var(--dark)"
      class="grid grid-cols-1 gap-1 text-white bg-dark bg-opacity-40 p-1 rounded shadow"
    >
      <span class="mx-auto">{{ formatDate(item) }}</span>
      <ImageComp :weather-code="hourlyWeather.weather_code[index]" class="w-10 mx-auto" />
      <span
        style="text-shadow: 1px 1px 3px var(--dark)"
        class="mx-auto text-white text-xl font-bold"
        >{{ hourlyWeather.temperature_2m[index] }} <sup>°</sup>c</span
      >
      <span style="text-shadow: 1px 1px 3px var(--dark)" class="mx-auto text-white text-sm"
        >{{ hourlyWeather.apparent_temperature[index] }} <sup>°</sup>c ressenti</span
      >
      <div class="flex gap-2 mx-auto">
        <img src="/images/icons/water.png" alt="" class="w-4 my-auto" />
        <span class="my-auto">{{ hourlyWeather.rain[index] }} mm</span>
      </div>
      <div v-if="hourlyWeather.snowfall[index] > 0" class="flex gap-2 mx-auto">
        <img src="/images/icons/snowflake.png" alt="" class="w-4 my-auto" />
        <span class="my-auto">{{ hourlyWeather.snowfall[index] }} cm</span>
      </div>
      <span class="mx-auto">{{ hourlyWeather.precipitation_probability[index] }}% </span>
      <div class="flex gap-2 mx-auto">
        <img src="/images/icons/wind.png" alt="" class="w-4 my-auto" />
        <span class="mx-auto">{{ hourlyWeather.wind_speed_10m[index] }} km/h </span>
      </div>
      <div class="flex gap-2 mx-auto">
        <img src="/images/icons/overcast.png" alt="" class="w-4 my-auto" />
        <span class="mx-auto">{{ hourlyWeather.cloud_cover[index] }} % </span>
      </div>
    </div>
  </div>
</template>
