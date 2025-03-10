<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-dialog-provider>
      <div class="app-container" :data-theme="themeStore.theme">
        <RouterView />
      </div>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup>
import { useThemeStore } from '@/stores/useThemeStore.js'

const themeStore = useThemeStore()

const themeOverrides = {
  common: {
    borderRadius: '8px',
    primaryColor: '#007efc',
    primaryColorHover: 'rgba(0,126,252,0.9)',
    primaryColorPressed: 'rgba(0,126,252,0.8)',
    errorColor: '#FF4C4C',
    errorColorHover: 'rgba(255,76,76,0.9)',
    errorColorPressed: 'rgba(255,76,76,0.8)'
  }
}
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
