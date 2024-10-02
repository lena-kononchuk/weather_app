<template>
   <div>
      <Suspense>
         <async-city-view> </async-city-view>
         <template #fallback>
            <city-view-skeleton></city-view-skeleton>
         </template>
      </Suspense>
   </div>
</template>

<script setup>
import AsyncCityView from '../components/AsyncCityView.vue'
import CityViewSkeleton from '../components/CityViewSkeleton.vue'
</script>
