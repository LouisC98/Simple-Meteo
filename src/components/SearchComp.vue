<script setup>
import { computed, onMounted, ref } from 'vue'
import { useWeatherStore } from '@/stores/weatherStore.js'
import { Loader } from '@googlemaps/js-api-loader'

const searchInput = ref()

const results = ref([])
const inputElement = ref()
const isLoading = ref(false)

let googleMaps = null

const inputWidth = computed(() => {
  return inputElement.value.offsetWidth
})

const store = useWeatherStore()

onMounted(() => {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_MAPS_KEY,
    version: 'weekly'
  })
  loader
    .load()
    .then((google) => {
      console.log('API Google Maps chargée')
      googleMaps = google.maps
    })
    .catch((error) => {
      console.error("Erreur lors du chargement de l'API Google Maps:", error)
    })
})

async function getResults() {
  if (searchInput.value.length >= 3) {
    try {
      if (googleMaps) {
        const geocoder = new googleMaps.Geocoder()
        geocoder.geocode({ address: searchInput.value }, (data, status) => {
          if (status === 'OK') {
            results.value = []
            data.forEach((element) => {
              results.value.push(element)
            })
          } else {
            console.log('Pas de résultats')
          }
        })
      } else {
        console.error("L'API Google Maps n'a pas été chargée.")
      }
    } catch (error) {
      console.log('Erreur : ' + error)
      results.value = null
    }
  } else {
    console.log('Entrez une ville')
  }
}

function setPosition(position) {
  store.setCurrentPosition({ latitude: position.lat(), longitude: position.lng() })
  results.value = []
  searchInput.value = null
}

async function getPosition() {
  console.log('Recherche ...')
  if (searchInput.value) {
    try {
      if (googleMaps) {
        const geocoder = new googleMaps.Geocoder()
        geocoder.geocode({ address: searchInput.value }, (data, status) => {
          if (status === 'OK') {
            const latitude = data[0].geometry.location.lat()
            const longitude = data[0].geometry.location.lng()
            store.setCurrentPosition({ latitude: latitude, longitude: longitude })
            results.value = []
            searchInput.value = null
            document.activeElement.blur()
          } else {
            console.log('pas de résultats')
          }
        })
      } else {
        console.error("L'API Google Maps n'a pas été chargée.")
      }
    } catch (error) {
      console.log('Erreur : ' + error)
    }
  } else {
    console.log('Entrez une ville')
  }
}

function getCurrentPosition() {
  isLoading.value = true
  if (navigator.geolocation) {
    console.log('Géolocalisation ...')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        store.setCurrentPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
        searchInput.value = null
        isLoading.value = false
      },
      (err) => {
        if (err.code === 1) {
          console.error("L'utilisateur a refusé la demande de géolocalisation.")
          const retry = confirm(
            "Vous avez refusé l'accès à la géolocalisation. Voulez-vous réessayer ?"
          )
          if (retry) {
            getCurrentPosition()
          }
        } else {
          console.error(
            "Une erreur inconnue s'est produite lors de la récupération de la position."
          )
        }
      }
    )
  } else {
    console.error("La géolocalisation n'est pas prise en charge par ce navigateur.")
  }
}
</script>
<template>
  <form @submit.prevent="getPosition" class="flex justify-center gap-2 mt-3">
    <input
      @input="getResults"
      ref="inputElement"
      type="text"
      placeholder="Entrez le nom d'une ville"
      class="input p-2 rounded-2xl shadow-md bg-black bg-opacity-40 text-white text-opacity-70"
      v-model="searchInput"
      :class="results.length > 0 ? 'rounded-b-none' : ''"
    />
    <div
      :style="'width: ' + inputWidth + 'px;'"
      v-if="results.length > 0"
      class="bg-dark absolute opacity-80 mt-10 rounded-b-2xl me-12 grid grid-cols-1 gap-1"
    >
      <div
        @click.self="setPosition(result.geometry.location)"
        v-for="result in results"
        :key="result.place_id"
        class="text-white text-opacity-80 border-t border-slate-400 p-2"
      >
        {{ result.formatted_address }}
      </div>
    </div>
    <button class="bg-dblue py-2 px-3 rounded-2xl shadow-md">
      <i class="fa-solid fa-magnifying-glass text-white"></i>
    </button>
  </form>
  <button
    @click="getCurrentPosition"
    class="bg-dblue py-2 px-3 rounded-2xl shadow-md text-white mx-auto mt-6 text-lg font-bold"
  >
    Localisation
    <i class="fa-solid fa-location-dot"></i>
  </button>
  <img v-if="isLoading" src="/images/loading.gif" alt="" class="w-24 mx-auto" />
</template>
