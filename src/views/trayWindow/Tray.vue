<template>
  <n-flex vertical class="tray">
    <div class="menu" @click="handlerExit">退出</div>
  </n-flex>
</template>
<script setup>
import { exit } from '@tauri-apps/plugin-process'
import { onMounted } from 'vue'
import { invoke } from '@tauri-apps/api/core'

const userInfo = ref()

onMounted(() => {
  //获取用户信息
  invoke('get_user_info', {}).then((res) => {
    userInfo.value = res
  })
})

const handlerExit = () => {
  exit(0)
}
</script>
<style lang="scss" scoped>
.tray {
  padding: 5px;
  font-size: 14px;
  line-height: 20px;

  .menu {
    padding: 5px;
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    border-radius: 8px;

    &:hover {
      background-color: #e5e5e5;
    }
  }
}
</style>
