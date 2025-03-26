<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div class="app-container">
      <n-modal-provider>
        <n-dialog-provider>
          <RouterView />
        </n-dialog-provider>
      </n-modal-provider>
    </div>
  </n-config-provider>
</template>

<script setup>
import { crateInit } from '@/db/init.js'
import { useSettingStore } from '@/stores/useSettingStore.js'
import GewechatRobot from '@/robot/gewechat.js'
import { invoke } from '@tauri-apps/api/core'

const settingStore = useSettingStore()
onBeforeMount(async () => {
  //数据库相关
  await crateInit()
  await settingStore.setTheme(settingStore.general.theme)
})

onMounted(() => {
  //开启web服务
  invoke('start_webserver', { port: parseInt(settingStore.general.callbackPort) }).then(() => {
    console.log('web服务开始运行')
    //监听web服务
    GewechatRobot.createWebListen()
  })
})

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
