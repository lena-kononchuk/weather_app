<template>
   <div v-for="city in savedCity" :key="city.id">
      <city-card :city="city" @click="goToCityView(city)"></city-card>
   </div>
   <p v-if="savedCity.length === 0">
      No locations added. To start tracking a location, search in
      the field above.
   </p>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CityCard from "../components/CityCard.vue"

// Define reactive reference to store saved cities
const savedCity = ref([]);

// Define an async function to fetch weather data
const getCities = async () => {
   // Check if there are saved cities in localStorage
   if (localStorage.getItem('savedCity')) {
      savedCity.value = JSON.parse(localStorage.getItem('savedCity'));

      const requests = [];
      // Push each API request into the requests array
      savedCity.value.forEach((city) => {
         requests.push(
            axios.get(
               `https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&appid=7288c10f83a369a476806c4d72a10cbc&units=imperial`
            )
         );
      });

      // Use await to handle all promises concurrently
      const weatherData = await Promise.all(requests);
      await new Promise((res) => setTimeout(res, 1000))

      // Assign weather data to each city object in savedCity array
      weatherData.forEach((value, index) => {
         savedCity.value[index].weather = value.data;
      });

      console.log('Weather data for saved cities:', savedCity.value);
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
