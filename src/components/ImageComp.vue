<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps({
  weatherCode: Number
})

const imgUrl = ref()

watchEffect(() => {
  const weatherCodes = {
    0: 'images/icons/clear_sky.png',
    1: 'images/icons/mainly_clear.png',
    2: 'images/icons/mainly_clear.png',
    3: 'images/icons/overcast.png',
    45: 'images/icons/fog.png',
    48: 'images/icons/fog.png',
    51: 'images/icons/rain.png',
    53: 'images/icons/rain.png',
    55: 'images/icons/rain.png',
    56: 'images/icons/rain.png',
    57: 'images/icons/rain.png',
    61: 'images/icons/rain.png',
    63: 'images/icons/rain.png',
    65: 'images/icons/rain.png',
    66: 'images/icons/rain.png',
    67: 'images/icons/rain.png',
    80: 'images/icons/rain.png',
    81: 'images/icons/rain.png',
    82: 'images/icons/rain.png',
    71: 'images/icons/snow.png',
    73: 'images/icons/snow.png',
    75: 'images/icons/snow.png',
    77: 'images/icons/snow.png',
    85: 'images/icons/snow.png',
    86: 'images/icons/snow.png',
    95: 'images/icons/thunderstorm.png',
    96: 'images/icons/thunderstorm.png',
    99: 'images/icons/thunderstorm.png'
  }

  imgUrl.value = weatherCodes[props.weatherCode] || 'images/icons/question_mark.png'
})
</script>

<template>
  <img :src="imgUrl" alt="" class="w-16" />
</template>
