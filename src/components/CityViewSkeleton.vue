<template>
   <div class="flex flex-col flex-1">
      <!-- Overview -->
      <div class="flex flex-col py-12 items-center">
         <animated-placeholder class="max-w-[300px] w-full mb-2"></animated-placeholder>
         <animated-placeholder class="max-w-[300px] w-full mb-12"></animated-placeholder>
         <animated-placeholder class="max-w-[300px] h-[100px] w-full mb-12"></animated-placeholder>
         <animated-placeholder class="max-w-[300px] w-full mb-8"></animated-placeholder>
         <animated-placeholder class="max-w-[300px] h-[75px] w-full"></animated-placeholder>
      </div>
      <!-- Hourly -->
      <div class="flex flex-col py-12 px-8 items-center">
         <animated-placeholder class="max-w-screen-md h-[100px] w-full mb-12 "></animated-placeholder>
      </div>
      <!-- Weekly -->
      <div class="flex flex-col py-12 px-8 items-center">
         <animated-placeholder class="max-w-screen-md h-[100px] w-full mb-12"></animated-placeholder>
      </div>
   </div>
</template>

<script setup>
import AnimatedPlaceholder from "./AnimatedPlaceholder.vue";
</script>