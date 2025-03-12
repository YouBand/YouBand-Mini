<template>
  <div class="robot-container">
    <div class="flex justify-between items-center">
      <div class="robot-title__h1">机器人仓库</div>
      <n-button type="primary" size="large">
        <template #icon>
          <Icon icon="tabler:plus"></Icon>
        </template>
        添加机器人
      </n-button>
    </div>
    <div class="robot-search">
      <n-input class="shrink-1" placeholder="搜索机器人名称、角色或模型..." size="large">
        <template #prefix>
          <Icon icon="solar:rounded-magnifer-linear" />
        </template>
      </n-input>
      <n-select
        class="w-[100px] flex-shrink-0"
        size="large"
        placeholder="所有类型"
        clearable
        v-model:value="typeValue"
        :options="typeOptions" />
      <n-select
        class="w-[100px] flex-shrink-0"
        size="large"
        placeholder="所有状态"
        clearable
        v-model:value="statusValue"
        :options="statusOption" />
    </div>
    <div class="robot-list">
      <div v-for="item in robotData" class="robot-list-card">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-[5px]">
            <doudone-label size="48px" font-size="18px">{{ item.type }}</doudone-label>
            <div class="text-[18px]">{{ item.name }}</div>
          </div>
          <n-tag size="small" :color="{ color: '#22C55E19', textColor: '#22C55E' }"> 在线</n-tag>
        </div>
        <div class="flex justify-between">
          <div class="text-[var(--minor-text-color)]">角色</div>
          <div>{{ item.role }}</div>
        </div>
        <div class="flex justify-between">
          <div class="text-[var(--minor-text-color)]">模型</div>
          <div>{{ item.model }}</div>
        </div>
        <div class="flex justify-between">
          <div class="text-[var(--minor-text-color)]">消息数</div>
          <div>{{ item.messageNum }}</div>
        </div>
        <div class="flex gap-[5px] text-[var(--minor-text-color)] justify-end mt-[10px]">
          <icon-hover-button type="theme" style="width: 36px; height: 36px; font-size: 22px">
            <Icon icon="solar:eye-line-duotone" />
          </icon-hover-button>
          <icon-hover-button type="theme" style="width: 36px; height: 36px; font-size: 20px">
            <Icon icon="solar:pen-new-square-line-duotone" />
          </icon-hover-button>
          <icon-hover-button type="theme-error" style="width: 36px; height: 36px; font-size: 22px" @click="onDelete">
            <Icon icon="solar:trash-bin-minimalistic-line-duotone" />
          </icon-hover-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Icon } from '@iconify/vue'
import DoudoneLabel from '@/components/DoudoneLabel.vue'
import IconHoverButton from '@/components/IconHoverButton.vue'
import { useDialog } from 'naive-ui'

const typeValue = ref()
const statusValue = ref()
const dialog = useDialog()
const robotData = ref([
  {
    type: 'QQ',
    name: '我的QQ机器人',
    role: '莉莉娅',
    model: 'DeepSeek',
    messageNum: '333'
  },
  {
    type: 'QQ',
    name: '我的QQ机器人',
    role: '莉莉娅',
    model: 'DeepSeek',
    messageNum: '333'
  },
  {
    type: 'QQ',
    name: '我的QQ机器人',
    role: '莉莉娅',
    model: 'DeepSeek',
    messageNum: '333'
  },
  {
    type: 'QQ',
    name: '我的QQ机器人',
    role: '莉莉娅',
    model: 'DeepSeek',
    messageNum: '333'
  },
  {
    type: 'QQ',
    name: '我的QQ机器人',
    role: '莉莉娅',
    model: 'DeepSeek',
    messageNum: '333'
  },
  {
    type: 'QQ',
    name: '我的QQ机器人',
    role: '莉莉娅',
    model: 'DeepSeek',
    messageNum: '333'
  },
  {
    type: 'QQ',
    name: '我的QQ机器人',
    role: '莉莉娅',
    model: 'DeepSeek',
    messageNum: '333'
  },
  {
    type: 'QQ',
    name: '我的QQ机器人',
    role: '莉莉娅',
    model: 'DeepSeek',
    messageNum: '333'
  }
])
const typeOptions = [
  {
    label: 'QQ',
    value: 'QQ'
  },
  {
    label: 'WX',
    value: 'WX'
  }
]
const statusOption = [
  {
    label: '在线',
    value: 'online'
  },
  {
    label: '离线',
    value: 'offline'
  }
]

const onDelete = () => {
  dialog.error({
    title: '确认删除',
    content: '确定要删除机器人 "我的QQ机器人" 吗？此操作无法撤销。',
    positiveText: '确定',
    negativeText: '取消',
    draggable: false,
    showIcon: false,
    onPositiveClick: () => {},
    onNegativeClick: () => {}
  })
}
</script>
<style scoped lang="scss">
.robot-container {
  height: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-x: hidden;
  padding: 10px 20px;

  .robot-title__h1 {
    font-size: 26px;
    font-weight: 500;
    letter-spacing: 1px;
    user-select: none;
  }

  .robot-search {
    width: 100%;
    padding: 20px;
    background-color: var(--nav-bg);
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 20px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .robot-list {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px];
    overflow-y: scroll;

    .robot-list-card {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 20px;
      background-color: var(--nav-bg);
      border-radius: 8px;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
  }
}
</style>
