<template>
  <div class="app-container" :data-theme="themeStore.theme">
    <RouterView />
  </div>
</template>

<script setup>
import { useThemeStore } from '@/stores/useThemeStore.js'

const themeStore = useThemeStore()
</script>

<style scoped lang="scss">
.app-container {
  background-color: var(--main-container-bg);
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  color: var(--primary-text-color);
}
</style>
