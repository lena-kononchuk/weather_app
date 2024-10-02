<template>
   <div class="flex flex-col flex-1 items-center">
      <!-- Preview message for the city being tracked -->
      <div v-if="route.query.preview" class="text-white p-4 bg-weather-secondary w-full text-center">
         <p> You are currently previewing this city, click the "+"
            icon to start tracking this city.</p>
      </div>

      <!-- Weather card displaying current weather data -->
      <div class="flex flex-col items-center text-white py-12">
         <h1 class="text-4xl mb-2">{{ route.params.city }}</h1> <!-- City name -->
         <p class="text-sm mb-12">
            {{
               new Date(weatherData.currentTime).toLocaleDateString(
                  "en-us",
                  {
                     weekday: "short",
                     day: "2-digit",
                     month: "long",
                  }
               )
            }}
            {{
               new Date(weatherData.currentTime).toLocaleTimeString(
                  "en-us",
                  {
                     timeStyle: "short",
                  }
               )
            }}
         </p>
         <p class="text-8xl mb-8">
            {{ Math.round(weatherData.current.temp) }}&deg; <!-- Current temperature -->
         </p>
         <p>
            Feels like
            {{ Math.round(weatherData.current.feels_like) }} &deg; <!-- Feels like temperature -->
         </p>
         <p class="capitalize">
            {{ weatherData.current.weather[0].description }} <!-- Weather description -->
         </p>
         <img class="w-[150px] h-auto"
            :src="`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`"
            alt="weather icon" /> <!-- Weather icon -->
      </div>

      <hr class="border-white border-opacity-10 border w-full" />

      <!-- Hourly Weather section -->
      <div class="max-w-screen-md w-full py-12">
         <div class="mx-8 text-white">
            <h2 class="mb-4">Hourly Weather</h2> <!-- Hourly weather title -->
            <div class="flex gap-10 overflow-x-scroll">
               <div v-for="hourData in weatherData.hourly" :key="hourData.dt" class="flex flex-col gap-4 items-center">
                  <p class="whitespace-nowrap text-md ">
                     {{
                        new Date(
                           hourData.currentTime
                        ).toLocaleTimeString("en-us", {
                           hour: "numeric",
                        })
                     }}
                  </p>
                  <img class="w-auto h-[50px] object-cover"
                     :src="`http://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`" alt="" />
                  <!-- Hourly weather icon -->
                  <p class="text-xl">
                     {{ Math.round(hourData.temp) }}&deg; <!-- Hourly temperature -->
                  </p>
               </div>
            </div>
         </div>
      </div>

      <hr class="border-white border-opacity-10 border w-full" />

      <!-- Weekly Weather section -->
      <div class="max-w-screen-md w-full py-12">
         <div class="mx-8 text-white">
            <h2 class="mb-4">7 Day Forecast</h2> <!-- Weekly weather title -->
            <div v-for="day in weatherData.daily" :key="day.dt" class="flex items-center">
               <p class="flex-1">
                  {{
                     new Date(day.dt * 1000).toLocaleDateString(
                        "en-us",
                        {
                           weekday: "long",
                        }
                     )
                  }}
               </p>
               <img class="w-[50px] h-[50px] object-cover"
                  :src="`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`" alt="" />
               <!-- Daily weather icon -->
               <div class="flex gap-2 flex-1 justify-end">
                  <p>H: {{ Math.round(day.temp.max) }}</p>
                  <p>L: {{ Math.round(day.temp.min) }}</p>
               </div>
            </div>
         </div>
      </div>

      <div @click="removeCity"
         class="flex items-center gap-2 text-white cursor-pointer duration-150 hover:text-red-500"></div>
   </div>
</template>

<script setup>
import axios from "axios"; // Import axios for API calls
import { useRoute, useRouter } from "vue-router"; // Import Vue Router for route handling

const route = useRoute(); // Get current route information

// Function to fetch weather data from OpenWeather API
const getWeatherData = async () => {
   try {
      // Make API request to OpenWeather's One Call endpoint
      const weatherResponse = await axios.get(
         `https://api.openweathermap.org/data/3.0/onecall`, {
         params: {
            lat: route.query.lat, // Get latitude from query parameters
            lon: route.query.lng, // Get longitude from query parameters
            exclude: 'minutely', // Exclude minutely data
            appid: '7288c10f83a369a476806c4d72a10cbc', // API key for authentication
            units: 'imperial' // Set temperature units to imperial
         } // Ensure this line ends with a comma if there are more properties to follow
      }
      );

      // Calculate current time in local timezone
      const localOffset = new Date().getTimezoneOffset() * 60000; // Get local timezone offset
      const utc = weatherResponse.data.current.dt * 1000 + localOffset; // Convert current time to UTC
      weatherResponse.data.currentTime =
         utc + 1000 * weatherResponse.data.timezone_offset; // Store adjusted current time

      // Calculate time for each hourly forecast
      weatherResponse.data.hourly.forEach((hour) => {
         const utc = hour.dt * 1000 + localOffset; // Convert each hour to UTC
         hour.currentTime =
            utc + 1000 * weatherResponse.data.timezone_offset; // Store adjusted hourly time
      });

      // Log processed weather data for debugging
      console.log('Processed Weather Data:', weatherResponse.data);


      await new Promise((res) => setTimeout(res, 1000));

      return weatherResponse.data; // Return the processed weather data

   } catch (err) {
      // Handle errors during the API request
      console.error('Error fetching data:', err.response ? err.response.data : err.message);
   }
};

// Call the function to get weather data and store it
const weatherData = await getWeatherData();

const router = useRouter(); // Get router instance

// Function to remove a city from local storage
const removeCity = () => {
   const cities = JSON.parse(localStorage.getItem("savedCities")); // Get saved cities from local storage
   const updatedCities = cities.filter(
      (city) => city.id !== route.query.id // Filter out the city to remove
   );
   localStorage.setItem(
      "savedCities",
      JSON.stringify(updatedCities) // Update local storage with remaining cities
   );
   router.push({
      name: "home", // Redirect to home page after removal
   });
};
</script>
