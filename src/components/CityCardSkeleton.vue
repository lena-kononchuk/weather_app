<template>
   <div class="flex py-6 px-3  bg-primary-green rounded-md shadow-md">
      <div class="flex flex-col flex-1 gap-2">
         <animated-placeholder class="max-w-[50%]"></animated-placeholder>
         <animated-placeholder class="max-w-[40%]"></animated-placeholder>
      </div>

      <div class="flex flex-col items-end flex-1 gap-2">
         <animated-placeholder class="max-w-[50px] w-full"></animated-placeholder>
         <animated-placeholder class="max-w-[75px] w-full"></animated-placeholder>
      </div>
   </div>
</template>

<script setup>
import AnimatedPlaceholder from "./AnimatedPlaceholder.vue";
</script>
