import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: '/vite-project/',  // Убедитесь, что здесь указано название вашего репозитория на GitHub
});