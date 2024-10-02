<template>
   <div>
      <Suspense>
         <async-city-view>
            <template #fallback>
               <p>Loading...</p>
            </template>
         </async-city-view>
      </Suspense>
   </div>
</template>

<script setup>
import AsyncCityView from '../components/AsyncCityView.vue'
</script>

<style lang="scss" scoped></style>