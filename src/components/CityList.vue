<template>
   <div v-for="city in savedCity" :key="city.id">
      <city-card :city="city" @click="goToCityView(city)"></city-card>
   </div>
   <p v-if="savedCity.length === 0">
      No locations added. To start tracking a location, search in the field above.
   </p>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CityCard from "../components/CityCard.vue";

const savedCity = ref([]);

const getCities = async () => {
   if (localStorage.getItem('savedCity')) {
      savedCity.value = JSON.parse(localStorage.getItem('savedCity'));

      const requests = savedCity.value.map((city) => {
         console.log('Fetching data for:', city.coords);
         return axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
               lat: city.coords.lat,
               lon: city.coords.lng,
               appid: '7288c10f83a369a476806c4d72a10cbc',
               units: 'metric'
            }
         });
      });

      try {
         const weatherData = await Promise.all(requests);
         await new Promise((res) => setTimeout(res, 1000));

         weatherData.forEach((value, index) => {
            savedCity.value[index].weather = value.data;
         });

         console.log('Weather data for saved cities:', savedCity.value);
      } catch (error) {
         if (error.response) {
            console.error('Error fetching weather data:', error.response.data);
         } else if (error.request) {
            console.error('No response received:', error.request);
         } else {
            console.error('Error:', error.message);
         }
      }
   }
};

await getCities();

const router = useRouter();

const goToCityView = (city) => {
   router.push({
      name: "cityView",
      params: { state: city.state, city: city.city },
      query: {
         id: city.id,
         lat: city.coords.lat,
         lng: city.coords.lng,
      },
   });
};
</script>
