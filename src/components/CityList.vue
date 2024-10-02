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

// Создание реактивной ссылки для хранения сохраненных городов
const savedCity = ref([]);

// Асинхронная функция для получения данных о погоде
const getCities = async () => {
   // Проверка наличия сохраненных городов в localStorage
   if (localStorage.getItem('savedCity')) {
      savedCity.value = JSON.parse(localStorage.getItem('savedCity'));

      const requests = savedCity.value.map((city) => {
         return axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
               lat: city.coords.lat, // Широта города
               lon: city.coords.lng, // Долгота города
               appid: '7288c10f83a369a476806c4d72a10cbc', // Ваш ключ API
               units: 'metric' // Установка единиц измерения на метрические
            }
         });
      });

      try {
         // Ожидание выполнения всех запросов параллельно
         const weatherData = await Promise.all(requests);
         await new Promise((res) => setTimeout(res, 1000)); // Задержка в 1 секунду

         // Присвоение данных о погоде каждому объекту города
         weatherData.forEach((value, index) => {
            savedCity.value[index].weather = value.data;
         });

         console.log('Weather data for saved cities:', savedCity.value);
      } catch (error) {
         console.error('Error fetching weather data:', error);
      }
   }
};

// Вызов функции при инициализации компонента
await getCities();

const router = useRouter();

// Функция для перехода к представлению города
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
