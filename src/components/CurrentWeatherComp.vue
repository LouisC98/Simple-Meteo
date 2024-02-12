<script setup>
import { useWeatherStore } from '@/stores/weatherStore.js'
import axios from 'axios'
import ImageComp from './ImageComp.vue'
import { Loader } from '@googlemaps/js-api-loader'
import { computed, onMounted, ref, watchEffect } from 'vue'

const store = useWeatherStore()
const currentWeather = ref()

let googleMaps = null

const city = ref()

onMounted(() => {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_MAPS_KEY,
    version: 'weekly'
  })

  loader
    .load()
    .then((google) => {
      googleMaps = google.maps
      console.log('API Google Maps chargée')
    })
    .catch((error) => {
      console.error("Erreur lors du chargement de l'API Google Maps:", error)
    })
})

watchEffect(async () => {
  console.log('Position : ', store.currentPosition)
  if (store.currentPosition) {
    const geocoder = new googleMaps.Geocoder()
    const latlng = new googleMaps.LatLng(
      store.currentPosition.latitude,
      store.currentPosition.longitude
    )

    geocoder.geocode({ location: latlng }, (results, status) => {
      console.log('Récupération du nom de la ville ...')

      if (status === 'OK') {
        if (results[0]) {
          for (let i = 0; i < results[0].address_components.length; i++) {
            if (results[0].address_components[i].types.includes('locality')) {
              console.log('Ville : ', results[0].address_components[i])
              city.value = results[0].address_components[i].long_name
              break
            }
          }
        } else {
          city.value = 'Aucune ville trouvée'
        }
      } else {
        city.value = 'Erreur lors de la recherche de la ville'
      }
    })

    console.log('Récupération de la météo actuelle au point ...')

    const urlWeather = `https://api.open-meteo.com/v1/forecast?latitude=${store.currentPosition.latitude}&longitude=${store.currentPosition.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,snowfall,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto`

    const responseWeather = (await axios.get(urlWeather)).data.current
    currentWeather.value = responseWeather
    console.log('Current weather :', responseWeather)
  }
})

const weatherCode = computed(() => {
  if (currentWeather.value) {
    return currentWeather.value.weather_code
  } else {
    return null
  }
})
</script>

<template>
  <div
    v-if="currentWeather"
    class="bg-dark bg-opacity-30 rounded-lg p-2 grid grid-cols-2 gap-1 shadow-lg"
    style="text-shadow: 1px 1px 3px var(--dark)"
  >
    <div class="col-span-2 text-center">
      <h2 class="text-3xl text-white">{{ city }}</h2>
    </div>
    <hr class="col-span-2 w-3/4 mx-auto my-1 shadow-sm shadow-white" />
    <div class="grid grid-cols-1 my-auto gap-2">
      <ImageComp :weather-code="weatherCode" class="mx-auto" />
      <span class="text-white mx-auto">{{ currentWeather.cloud_cover }} % de nuage</span>
    </div>
    <div class="grid grid-cols-1">
      <span class="my-auto text-4xl text-white font-bold"
        >{{ currentWeather.temperature_2m }} <sup>°</sup>c
      </span>
      <span class="my-auto text-2xl text-white"
        >{{ currentWeather.apparent_temperature }} <sup>°</sup>c
        <span class="sm:text-base text-sm">ressenti</span></span
      >
      <span class="my-auto text-sm text-white"
        >{{ currentWeather.precipitation }} mm précipitaion</span
      >
      <span class="my-auto text-sm text-white">{{ currentWeather.rain }} mm pluie</span>
      <span v-if="currentWeather.snowfall > 0" class="my-auto text-white"
        >{{ currentWeather.snowfall }} cm de neige</span
      >
      <span class="my-auto text-sm text-white"
        >Vent : {{ currentWeather.wind_speed_10m }} km/h</span
      >
      <span class="my-auto text-sm text-white"
        >Rafales : {{ currentWeather.wind_gusts_10m }} km/h</span
      >
      <div class="flex gap-2 text-white">
        <span class="my-auto text-sm">Direction : </span>
        <img
          :style="{ transform: `rotate(${currentWeather.wind_direction_10m}deg)` }"
          src="/images/arrow.png"
          alt=""
          class="w-4 my-auto"
        />
      </div>
    </div>
  </div>
</template>
