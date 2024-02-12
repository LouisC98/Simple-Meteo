<script setup>
import HeaderComp from './components/HeaderComp.vue'
import SearchComp from './components/SearchComp.vue'
import CurrentWeatherComp from './components/CurrentWeatherComp.vue'
import DailyWeatherComp from './components/DailyWeatherComp.vue'
import HourlyWeatherComp from './components/HourlyWeatherComp.vue'
</script>

<template>
  <HeaderComp />

  <main class="max-w-screen-sm mx-auto grid grid-cols-1 p-2">
    <SearchComp />
    <p class="slogan mx-auto my-6 text-white font-bold text-lg">
      Simple Météo, c'est une météo simple, rapide et fiable.
    </p>
    <CurrentWeatherComp />
    <HourlyWeatherComp />
    <DailyWeatherComp />
  </main>
</template>
