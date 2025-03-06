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
      <div :class="['nav-left', isCollapsed ? 'w-[60px]' : 'w-[200px]']">
        <div class="nva-left__items">
          <div
            v-for="item in navigations"
            :class="[
              'nav-left__item',
              { active: route.path === item.path },
              isCollapsed ? 'justify-center' : 'justify-start'
            ]"
            @click="() => router.push(item.path)">
            <Icon
              :icon="route.path === item.path ? item.activeIcon : item.icon"
              class="nav-left__item--icon"
              :style="{ marginRight: isCollapsed ? '0' : '20px' }" />
            <div :class="['nav-left__item--label', isCollapsed ? 'hidden' : 'block']">
              {{ item.label }}
            </div>
          </div>
        </div>
        <div class="nva-left__bottom-items">
          <div
            :class="[
              'nav-left__bottom-item',
              { sun: themeStore.theme === 'dark' },
              isCollapsed ? 'justify-center' : 'justify-start'
            ]"
            @click="handlerChangeTheme">
            <Icon
              :icon="themeStore.theme === 'light' ? 'solar:moon-stars-broken' : 'solar:sun-2-line-duotone'"
              class="nav-left__bottom-item--icon"
              :style="{ marginRight: isCollapsed ? '0' : '20px' }" />
            <div :class="['nav-left__bottom-item--label', isCollapsed ? 'hidden' : 'block']">
              {{ themeStore.theme === 'light' ? '浅色模式' : '深色模式' }}
            </div>
          </div>
          <div :class="['nav-left__bottom-item', isCollapsed ? 'justify-center' : 'justify-start']" @click="toggleMenu">
            <Icon
              :icon="
                isCollapsed ? 'solar:double-alt-arrow-right-line-duotone' : 'solar:double-alt-arrow-left-line-duotone'
              "
              class="nav-left__bottom-item--icon"
              :style="{ marginRight: isCollapsed ? '0' : '20px' }" />
            <div :class="['nav-left__bottom-item--label', isCollapsed ? 'hidden' : 'block']">
              {{ isCollapsed ? '展开菜单' : '收起菜单' }}
            </div>
          </div>
        </div>
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
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()
const isCollapsed = ref(false)

const toggleMenu = () => {
  isCollapsed.value = !isCollapsed.value
}

const navigations = [
  {
    label: '仪表盘',
    path: '/home/dashboard',
    icon: 'solar:widget-2-line-duotone',
    activeIcon: 'solar:widget-2-bold'
  },
  {
    label: '机器人',
    path: '/home/robot',
    icon: 'solar:ghost-broken',
    activeIcon: 'solar:ghost-bold'
  },
  {
    label: '聊天',
    path: '/home/chat',
    icon: 'solar:chat-line-line-duotone',
    activeIcon: 'solar:chat-line-bold'
  },
  {
    label: '配置',
    path: '/home/config',
    icon: 'solar:code-file-line-duotone',
    activeIcon: 'solar:code-file-bold'
  },
  {
    label: '人物角色',
    path: '/home/role',
    icon: 'solar:users-group-rounded-line-duotone',
    activeIcon: 'solar:users-group-rounded-bold'
  },
  {
    label: '系统设置',
    path: '/home/set',
    icon: 'solar:settings-line-duotone',
    activeIcon: 'solar:settings-bold'
  }
]

const themeStore = useThemeStore()
const handlerChangeTheme = () => {
  themeStore.setTheme(themeStore.theme === 'light' ? 'dark' : 'light')
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
    justify-content: space-between;
    background-color: var(--nav-bg);
    height: 100%;
    border-right: 1px var(--divider-bg) solid;
    color: var(--minor-text-color);
    padding: 10px;
    overflow: hidden;
    @apply transition-all duration-300 ease-in-out;

    .nva-left__items {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .nav-left__item {
        display: flex;
        align-items: center;
        height: 40px;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        font-weight: 600;
        padding: 0 10px;
        user-select: none;

        .nav-left__item--icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        &.active {
          color: #fff;
          background-color: rgba(var(--primary-color));
        }

        &:not(.active):hover {
          color: rgba(var(--primary-color));
          background-color: rgba(var(--primary-color), 0.1);
        }
      }
    }

    .nva-left__bottom-items {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .nav-left__bottom-item {
        display: flex;
        align-items: center;
        height: 40px;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        font-weight: 600;
        padding: 0 10px;
        user-select: none;

        .nav-left__bottom-item--icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        &.sun {
          color: rgb(250, 204, 21);

          &:hover {
            background-color: rgba(250, 204, 21, 0.1);
          }
        }

        &:not(.sun):hover {
          color: rgba(var(--primary-color));
          background-color: rgba(var(--primary-color), 0.1);
        }
      }
    }

    .nav-left__item,
    .nav-left__bottom-item {
      display: flex;
      align-items: center;
      height: 40px;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      font-weight: 600;
      padding: 0 10px;
      user-select: none;

      .nav-left__item--icon,
      .nav-left__bottom-item--icon {
        font-size: 20px;
        flex-shrink: 0;
      }

      .nav-left__item--label,
      .nav-left__bottom-item--label {
        @apply whitespace-nowrap transition-opacity duration-200;
      }
    }
  }
}
</style>
