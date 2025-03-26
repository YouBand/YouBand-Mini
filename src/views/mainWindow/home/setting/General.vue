<template>
  <div class="general-container">
    <div class="general-key">Gewechat回调信息</div>

    <!-- 回调端口 -->
    <div class="general-item">
      <div class="general-item-key">回调端口</div>
      <div class="general-item-value">
        <n-input
          v-model:value="callbackPort"
          size="small"
          placeholder=""
          @blur="
            () => {
              settingStore.setCallbackPort(callbackPort)
              if (!callbackPort) {
                callbackPort = settingStore.general['callbackPort']
              }
            }
          " />
      </div>
    </div>

    <!-- 回调IP -->
    <div class="general-item">
      <div class="general-item-key">回调IP<info>注意：需Gewechat服务可以访问到该IP</info></div>
      <div class="general-item-value" style="width: auto">
        <n-input
          size="small"
          v-model:value="callbackIp"
          placeholder=""
          @blur="
            () => {
              settingStore.setCallbackIp(callbackIp)
              if (!callbackIp) {
                callbackIp = settingStore.general['callbackIp']
              }
            }
          " />
      </div>
    </div>

    <div class="general-key">系统</div>
    <!-- 开机自启 -->
    <div class="general-item">
      <div class="general-item-key">是否开机自启</div>
      <div class="general-item-value">
        <n-switch v-model:value="isBootstrap" />
      </div>
    </div>

    <!-- 开机自启 -->
    <div class="general-item">
      <div class="general-item-key">是否折叠菜单</div>
      <div class="general-item-value">
        <n-switch v-model:value="isMenuFold" />
      </div>
    </div>

    <!-- 关闭主面板 -->
    <div class="general-item">
      <div class="general-item-key">关闭主面板时</div>
      <div class="general-item-value">
        <n-select size="small" v-model:value="closePanel" :options="closeOptions" />
      </div>
    </div>

    <!-- 主题设置 -->
    <div class="general-item">
      <div class="general-item-key">主题设置</div>
      <div class="general-item-value">
        <n-select size="small" v-model:value="theme" :options="themeOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingStore } from '@/stores/useSettingStore.js'
import { computed } from 'vue'
import Info from '@/components/Info.vue'

const settingStore = useSettingStore()

const createStoreBinding = (propName, actionName) =>
  computed({
    get: () => settingStore.general[propName],
    set: (value) => settingStore[actionName](value)
  })

const isBootstrap = createStoreBinding('isBootstrap', 'setIsBootstrap')
const closePanel = createStoreBinding('closePanel', 'setClosePanel')
const theme = createStoreBinding('theme', 'setTheme')
const isMenuFold = createStoreBinding('isMenuFold', 'setIsMenuFold')

const callbackIp = ref(settingStore.general['callbackIp'])
const callbackPort = ref(settingStore.general['callbackPort'])

const closeOptions = [
  { label: '隐藏', value: 'hidden' },
  { label: '退出系统', value: 'close' }
]

const themeOptions = [
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' }
]
</script>
<style lang="scss" scoped>
.general-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 14px;

  .general-key {
    font-size: 18px;
    margin: 20px 5px 5px 5px;
    user-select: none;
    font-weight: 600;
  }

  .general-item {
    padding: 15px 10px;
    background-color: var(--card-bg);
    border-radius: 8px;
    user-select: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;

    .general-item-key {
      font-weight: 500;
      display: flex;
      align-items: center;
    }

    .general-item-value {
      display: flex;
      width: 120px;
      justify-content: end;
    }
  }
}
</style>
