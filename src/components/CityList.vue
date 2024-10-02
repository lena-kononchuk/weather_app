<template>
   <div v-for="city in savedCity" :key="city.id">
      <city-card :city="city" @click="goToCityView(city)"></city-card>
   </div>
   <p v-if="savedCity.length === 0">
      No locations added. To start tracking a location, search in the field above.
   </p>
</template>

<script setup>
import axios from 'axios'; // Importing axios for HTTP requests
import { ref } from 'vue'; // Importing ref for creating reactive references
import { useRouter } from 'vue-router'; // Importing useRouter for navigation
import CityCard from "../components/CityCard.vue"; // Importing the CityCard component

const savedCity = ref([]); // Reactive reference to store saved cities

// Async function to fetch weather data for saved cities
const getCities = async () => {
   // Check if there are saved cities in localStorage
   if (localStorage.getItem('savedCity')) {
      savedCity.value = JSON.parse(localStorage.getItem('savedCity')); // Parse saved cities from localStorage

      // Create an array of requests for each city to fetch weather data
      const requests = savedCity.value.map((city) => {
         // Convert latitude and longitude from strings to floats
         const lat = parseFloat(city.coords.lat);
         const lon = parseFloat(city.coords.lng);
         console.log('Fetching data for:', { lat, lon }); // Debug log

         // Check if coordinates are valid
         if (isNaN(lat) || isNaN(lon)) {
            console.error(`Invalid coordinates for city ${city.city}: lat = ${lat}, lon = ${lon}`);
            return null; // Return null for invalid coordinates
         }

         // Return an axios GET request promise for valid coordinates
         return axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
               lat, // Latitude
               lon, // Longitude
               appid: '7288c10f83a369a476806c4d72a10cbc', // API key for OpenWeatherMap
               units: 'metric' // Use metric units for temperature
            }
         });
      }).filter(request => request !== null); // Filter out null requests

      try {
         // Await all weather data requests to complete
         const weatherData = await Promise.all(requests);
         await new Promise((res) => setTimeout(res, 1000)); // Optional delay (e.g., for rate limiting)

         // Assign fetched weather data to the corresponding city object
         weatherData.forEach((value, index) => {
            savedCity.value[index].weather = value.data; // Update city object with weather data
         });

         console.log('Weather data for saved cities:', savedCity.value); // Log updated saved cities with weather data
      } catch (error) {
         // Log any error that occurs during the fetching process
         console.error('Error fetching weather data:', error.response ? error.response.data : error.message);
      }
   } else {
      console.log('No saved cities found in localStorage.'); // Log if no saved cities exist
   }
};

await getCities(); // Call the function to fetch cities and their weather data

const router = useRouter(); // Initialize the router for navigation

// Function to navigate to the city view when a city card is clicked
const goToCityView = (city) => {
   router.push({
      name: "cityView", // Route name to navigate to
      params: { state: city.state, city: city.city }, // Parameters for the route
      query: {
         id: city.id, // City ID as a query parameter
         lat: city.coords.lat, // Latitude as a query parameter
         lng: city.coords.lng, // Longitude as a query parameter
      },
   });
};
</script>
