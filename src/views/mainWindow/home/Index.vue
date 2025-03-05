<template>
  <div class="home-container">
    <div class="navigation-title" data-tauri-drag-region></div>
    <div class="flex w-full h-full">
      <div class="navigation-left">
        <button @click="() => handlerChangeTheme('light')">明亮主题</button>
        <button @click="() => handlerChangeTheme('dark')">暗黑主题</button>
      </div>
      <div>
        <RouterView />
      </div>
    </div>
  </div>
</template>
<script setup>
import { useThemeStore } from '@/stores/useThemeStore.js'

const themeStore = useThemeStore()
const handlerChangeTheme = (theme) => {
  themeStore.setTheme(theme)
}
</script>
<style scoped lang="scss">
.home-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .navigation-title {
    height: 60px;
    width: 100%;
    background-color: var(--navigation-bg);
    border-bottom: 1px var(--divider-bg) solid;
  }

  .navigation-left {
    display: flex;
    flex-direction: column;
    background-color: var(--navigation-bg);
    width: 200px;
    height: 100%;
    border-right: 1px var(--divider-bg) solid;
    color: var(--minor-text-color);
  }
}
</style>
