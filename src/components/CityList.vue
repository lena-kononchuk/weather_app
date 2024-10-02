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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CityCard from "../components/CityCard.vue";

const savedCity = ref([]);

const getCities = async () => {
   if (localStorage.getItem('savedCity')) {
      savedCity.value = JSON.parse(localStorage.getItem('savedCity'));

      const requests = savedCity.value.map((city) => {
         // Преобразование строк в числа
         const lat = parseFloat(city.coords.lat);
         const lon = parseFloat(city.coords.lng);
         console.log('Fetching data for:', { lat, lon }); // Лог для отладки

         // Проверка валидности координат
         if (isNaN(lat) || isNaN(lon)) {
            console.error(`Invalid coordinates for city ${city.city}: lat = ${lat}, lon = ${lon}`);
            return null; // Возвращаем null для недействительных координат
         }

         return axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
               lat,
               lon,
               appid: '7288c10f83a369a476806c4d72a10cbc',
               units: 'metric'
            }
         });
      }).filter(request => request !== null); // Фильтрация недействительных запросов

      try {
         const weatherData = await Promise.all(requests);
         await new Promise((res) => setTimeout(res, 1000));

         weatherData.forEach((value, index) => {
            savedCity.value[index].weather = value.data;
         });

         console.log('Weather data for saved cities:', savedCity.value);
      } catch (error) {
         console.error('Error fetching weather data:', error.response ? error.response.data : error.message);
      }
   } else {
      console.log('No saved cities found in localStorage.');
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
