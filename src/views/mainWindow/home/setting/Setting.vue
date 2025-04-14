<template>
  <div class="setting-container">
    <div class="set-item">
      <div v-for="item in setItemData" :key="item.path" :class="['set-item__card', { active: isActive(item) }]">
        <Icon class="set-item__icon" :icon="isActive(item) ? item.activeIcon : item.icon" />
        <div class="set-item__label">{{ item.label }}</div>
      </div>
    </div>
    <div class="set-item-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = computed(() => (item) => {
  return route.matched.some((record) => record.path === item.path)
})

const setItemData = [
  {
    label: '通用',
    path: '/home/setting/general',
    icon: 'carbon:settings-adjust',
    activeIcon: 'carbon:settings-adjust'
  }
]
</script>

<style lang="scss" scoped>
.setting-container {
  height: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  overflow-x: hidden;
  padding: 10px 20px;

  .set-item {
    height: 100%;
    width: 240px;
    background-color: var(--nav-bg);
    border-right: 1px var(--card-bg) solid;
    border-radius: 8px 0 0 8px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;

    .set-item__card {
      height: 40px;
      display: flex;
      align-items: center;
      padding: 10px;
      cursor: pointer;
      user-select: none;
      border-radius: 8px;
      gap: 5px;
      color: var(--minor-text-color);

      .set-item__icon {
        font-size: 20px;
      }

      .set-item__label {
        font-size: 16px;
        font-weight: 500;
      }

      &.active {
        background-color: var(--card-bg);
        color: var(--primary-text-color);
      }

      &:not(.active):hover {
        background-color: var(--minor-card-bg);
      }
    }
  }

  .set-item-content {
    flex: 1;
    height: 100%;
    background-color: var(--nav-bg);
    border-radius: 0 8px 8px 0;
    padding: 10px;
    overflow-x: hidden;
  }
}
</style>
