<template>
  <div class="home-container">
    <div class="nav-title" data-tauri-drag-region>
      <div class="nav-title__logo">
        <img class="nav-title__logo--icon" src="/logo.png" alt="" draggable="false" />
        <div class="nav-title__logo--text">友伴-YouBand</div>
      </div>
      <div class="nav-title__content">
        <div class="nav-title__user">
          <div class="nav-title__user--avatar"></div>
          <div class="nav-title__user--name">Heath</div>
        </div>
        <n-divider vertical />
        <div class="nav-title__system">
          <icon-hover-button type="minor">
            <Icon icon="carbon:subtract" />
          </icon-hover-button>
          <icon-hover-button type="minor" style="font-size: 20px">
            <Icon icon="tabler:maximize" />
          </icon-hover-button>
          <icon-hover-button type="error">
            <Icon icon="carbon:close" />
          </icon-hover-button>
        </div>
      </div>
    </div>
    <div class="flex w-full h-full">
      <div class="nav-left">
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
import { Icon } from '@iconify/vue'
import IconHoverButton from '@/components/IconHoverButton.vue'

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

  .nav-title {
    height: 60px;
    width: 100%;
    background-color: var(--nav-bg);
    border-bottom: 1px var(--divider-bg) solid;
    display: flex;
    align-items: center;
    padding: 0 10px;
    user-select: none;
    justify-content: space-between;

    .nav-title__logo {
      display: flex;
      align-items: center;
      gap: 5px;

      .nav-title__logo--icon {
        width: 34px;
        height: 34px;
      }

      .nav-title__logo--text {
        font-weight: 800;
        font-size: 18px;
        letter-spacing: 1px;
      }
    }

    .nav-title__content {
      display: flex;
      align-items: center;
      gap: 10px;

      .nav-title__user {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;

        .nav-title__user--avatar {
          height: 30px;
          width: 30px;
          background-color: #6b7280;
          border-radius: 5px;
        }

        .nav-title__user--name {
          font-weight: 600;
        }
      }

      .nav-title__system {
        display: flex;
        align-items: center;
        gap: 15px;
      }
    }
  }

  .nav-left {
    display: flex;
    flex-direction: column;
    background-color: var(--nav-bg);
    width: 200px;
    height: 100%;
    border-right: 1px var(--divider-bg) solid;
    color: var(--minor-text-color);
  }
}
</style>
