<template>
  <div class="home-container">
    <div class="nav-title" data-tauri-drag-region>
      <div class="nav-title__logo">
        <img class="nav-title__logo--icon" src="/logo.png" alt="" draggable="false" />
        <div class="nav-title__logo--text">友伴-YouBand</div>
      </div>
      <div class="nav-title__content">
        <div class="nav-title__info">
          <icon-hover-button
            style="font-size: 22px; width: 22px; height: 22px"
            type="minor"
            @click="() => shell.open('https://space.bilibili.com/135427028')">
            <Icon icon="tabler:brand-bilibili" />
          </icon-hover-button>
          <icon-hover-button
            style="font-size: 22px; width: 22px; height: 22px"
            type="minor"
            @click="() => shell.open('https://github.com/YouBand/YouBand-Mini')">
            <Icon icon="tabler:brand-github" />
          </icon-hover-button>
        </div>
        <div class="nav-title__user">
          <div class="nav-title__user--avatar">
            <img src="/avatar.png" alt="" />
          </div>
          <div class="nav-title__user--name">Heath</div>
        </div>
        <n-divider vertical />
        <div class="nav-title__system">
          <icon-hover-button type="minor" @click="handleMinimize">
            <Icon icon="carbon:subtract" />
          </icon-hover-button>
          <icon-hover-button
            type="minor"
            style="font-size: 20px"
            @click="() => (isMaximize ? handleUnMaximize() : handleMaximize())">
            <Icon :icon="isMaximize ? 'tabler:minimize' : 'tabler:maximize'" />
          </icon-hover-button>
          <icon-hover-button type="error" @click="handleClose">
            <Icon icon="carbon:close" />
          </icon-hover-button>
        </div>
      </div>
    </div>
    <div class="home-content">
      <div :class="['nav-left', isCollapsed ? 'w-[60px]' : 'w-[200px]']">
        <div class="nva-left__items">
          <div
            v-for="item in navigations"
            :key="item.path"
            :class="['nav-left__item', { active: isActive(item) }, isCollapsed ? 'justify-center' : 'justify-start']"
            @click="() => router.push(item.path)">
            <Icon
              :icon="isActive(item) ? item.activeIcon : item.icon"
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
              { sun: settingStore.general.theme === 'dark' },
              isCollapsed ? 'justify-center' : 'justify-start'
            ]"
            @click="handlerChangeTheme">
            <Icon
              :icon="settingStore.general.theme === 'light' ? 'solar:moon-stars-broken' : 'solar:sun-2-line-duotone'"
              class="nav-left__bottom-item--icon"
              :style="{ marginRight: isCollapsed ? '0' : '20px' }" />
            <div :class="['nav-left__bottom-item--label', isCollapsed ? 'hidden' : 'block']">
              {{ settingStore.general.theme === 'light' ? '浅色模式' : '深色模式' }}
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
      <div class="w-full h-full">
        <RouterView />
      </div>
    </div>
  </div>
</template>
<script setup>
import { Icon } from '@iconify/vue'
import IconHoverButton from '@/components/IconHoverButton.vue'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, onUnmounted, ref } from 'vue'
import { WebviewWindow } from '@tauri-apps/api/webviewWindow'
import * as shell from '@tauri-apps/plugin-shell'
import { useSettingStore } from '@/stores/useSettingStore.js'
import { exit } from '@tauri-apps/plugin-process'

const route = useRoute()
const router = useRouter()
const settingStore = useSettingStore()
const isMaximize = ref(false)
let unResize

const isCollapsed = computed(() => settingStore.general.isMenuFold)

const isActive = computed(() => (item) => {
  return route.matched.some((record) => record.path === item.path)
})

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
    label: '模型',
    path: '/home/model',
    icon: 'solar:black-hole-3-line-duotone',
    activeIcon: 'solar:black-hole-line-duotone'
  },
  {
    label: '插件',
    path: '/home/plug',
    icon: 'solar:plug-circle-broken',
    activeIcon: 'solar:plug-circle-bold'
  },
  {
    label: '人物角色',
    path: '/home/role',
    icon: 'solar:users-group-rounded-line-duotone',
    activeIcon: 'solar:users-group-rounded-bold'
  },
  {
    label: '系统设置',
    path: '/home/setting/general',
    icon: 'solar:settings-line-duotone',
    activeIcon: 'solar:settings-bold'
  }
]

const handleMinimize = () => {
  WebviewWindow.getCurrent().minimize()
}

const handleClose = () => {
  if (settingStore.general.closePanel === 'close') {
    exit()
  } else {
    WebviewWindow.getCurrent().hide()
  }
}

const handleMaximize = () => {
  WebviewWindow.getCurrent().maximize()
}

const handleUnMaximize = () => {
  WebviewWindow.getCurrent().unmaximize()
}

const toggleMenu = () => {
  settingStore.setIsMenuFold(!isCollapsed.value)
}

const handlerChangeTheme = () => {
  settingStore.setTheme(settingStore.general.theme === 'light' ? 'dark' : 'light')
}

onMounted(() => {
  let window = WebviewWindow.getCurrent()
  unResize = window.listen('tauri://resize', async function () {
    isMaximize.value = await window.isMaximized()
  })
})

onUnmounted(() => {
  unResize()
})
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
    border-bottom: 1px var(--card-bg) solid;
    display: flex;
    align-items: center;
    padding: 0 10px;
    user-select: none;
    justify-content: space-between;
    flex-shrink: 0;

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

      .nav-title__info {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 5px 20px;
        border-radius: 20px;
        border: 1px rgba(var(--primary-color), 0.3) solid;
        color: var(--minor-text-color);
        margin-right: 10px;
      }

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
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          font-size: 18px;
          line-height: 18px;
          font-weight: 500;
          overflow: hidden;
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

  .home-content {
    display: flex;
    flex: 1;
    overflow: hidden;

    .nav-left {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background-color: var(--nav-bg);
      height: 100%;
      border-right: 1px var(--card-bg) solid;
      color: var(--minor-text-color);
      padding: 10px;
      overflow: hidden;
      flex-shrink: 0;
      transition-property: transform, opacity, box-shadow, width;
      transition-duration: 300ms;
      transition-timing-function: ease-in-out;

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
}
</style>
