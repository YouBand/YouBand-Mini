<template>
  <div class="plug-container">
    <div class="flex justify-between items-center">
      <div class="plug-title__h1">插件枢纽站</div>
      <n-button @click="handlerAddPlug" type="primary" size="large">
        <template #icon>
          <Icon icon="tabler:plus"></Icon>
        </template>
        添加插件
      </n-button>
    </div>
    <div class="plug-search">
      <n-input v-model:value="searchInputValue" class="shrink-1" placeholder="搜索插件名称..." size="large">
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
    <div v-if="plugFilterData.length > 0" class="plug-list">
      <div v-for="item in plugFilterData" :key="item.id" class="plug-list-card">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-[5px]">
            <doudone-label size="48px" font-size="16px">{{ item.type }}</doudone-label>
            <div class="text-[18px] line-clamp-1">{{ item.name }}</div>
          </div>
          <n-tag size="small" :type="item.isActive ? 'primary' : 'error'">
            {{ item.isActive ? plugStatus.valueMap(plugStatus.Active) : plugStatus.valueMap(plugStatus.NoActive) }}
          </n-tag>
        </div>
        <div class="h-[40px] text-[14px] text-[var(--minor-text-color)] line-clamp-2">{{ item.describe }}</div>
        <div class="flex text-[var(--minor-text-color)] justify-end mt-[10px]">
          <n-popover v-if="!item.isActive" trigger="hover">
            <template #trigger>
              <icon-hover-button
                @click="() => onSwitchPlug(item)"
                type="theme"
                style="width: 36px; height: 36px; font-size: 20px">
                <Icon icon="solar:play-circle-bold" />
              </icon-hover-button>
            </template>
            <span>启动</span>
          </n-popover>
          <n-popover v-if="item.isActive" trigger="hover">
            <template #trigger>
              <icon-hover-button
                @click="() => onSwitchPlug(item)"
                type="theme"
                style="width: 36px; height: 36px; font-size: 20px">
                <Icon icon="solar:pause-circle-bold" />
              </icon-hover-button>
            </template>
            <span>停止</span>
          </n-popover>
          <icon-hover-button
            @click="() => handlerUpdatePlug(item)"
            type="theme"
            style="width: 36px; height: 36px; font-size: 20px">
            <Icon icon="solar:pen-new-square-line-duotone" />
          </icon-hover-button>
          <icon-hover-button
            type="theme-error"
            style="width: 36px; height: 36px; font-size: 22px"
            @click="() => onDeletePlug(item)">
            <Icon icon="solar:trash-bin-minimalistic-line-duotone" />
          </icon-hover-button>
        </div>
      </div>
    </div>
    <!--空列表-->
    <empty
      v-if="plugFilterData.length <= 0"
      title="暂无插件数据"
      content="您当前尚未添加任何插件。请点击右上方按钮，尝试添加一个吧。"
      operate-text="添加第一个插件"
      @onOk="() => {}">
      <template #icon>
        <Icon icon="solar:plug-circle-broken" />
      </template>
    </empty>
    <!--添加插件-->
    <n-modal v-model:show="showAddMcpPlug" :mask-closable="false" :close-on-esc="false">
      <n-card
        style="width: 600px; overflow-y: hidden"
        :title="`${isEditPlug ? '修改' : '添加'} MCP Server 插件`"
        :bordered="false"
        footer-class="flex justify-end gap-[10px]">
        <div class="max-h-[70vh] pr-[10px] overflow-y-scroll">
          <n-form ref="plugForm" :model="plugInfo" :rules="plugFormRules">
            <n-form-item path="name" label="名称">
              <n-input
                v-model:value="plugInfo.name"
                maxlength="16"
                show-count
                @keydown.enter.prevent
                placeholder="请输入名称" />
            </n-form-item>
            <n-form-item path="describe" label="描述">
              <n-input
                type="textarea"
                v-model:value="plugInfo.describe"
                maxlength="50"
                show-count
                :autosize="{
                  minRows: 2,
                  maxRows: 2
                }"
                @keydown.enter.prevent
                placeholder="请输入描述" />
            </n-form-item>
            <n-form-item path="plugContent[mcpType]" label="MCP Server类型" :rule="plugFormRules.mcpType">
              <n-radio-group v-model:value="plugInfo.plugContent.mcpType">
                <n-space>
                  <n-radio :value="McpType.Stdio">Stdio</n-radio>
                  <n-radio :value="McpType.Sse">SSE</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item
              v-if="plugInfo.plugContent.mcpType === McpType.Sse"
              path="plugContent[url]"
              label="URL"
              :rule="plugFormRules.url">
              <n-input
                v-model:value="plugInfo.plugContent.url"
                show-sort-button
                placeholder="例如：http://127.0.0.1:3000/sse" />
            </n-form-item>
            <template v-if="plugInfo.plugContent.mcpType === McpType.Stdio">
              <n-form-item path="plugContent[cmd]" label="运行命令" :rule="plugFormRules.cmd">
                <n-select
                  v-model:value="plugInfo.plugContent.cmd"
                  :options="cmdOption"
                  placeholder="请选运行命令"></n-select>
              </n-form-item>
              <n-form-item path="plugContent[args]" :rule="plugFormRules.args">
                <template #label>
                  <div class="flex items-center justify-center">
                    运行参数
                    <info>注意：每个参数占一行</info>
                  </div>
                </template>
                <n-input
                  type="textarea"
                  v-model:value="plugInfo.plugContent.args"
                  :autosize="{
                    minRows: 3,
                    maxRows: 3
                  }"
                  placeholder="arg1&#10;arg2" />
              </n-form-item>
              <n-form-item path="plugContent[env]" label="环境变量">
                <n-dynamic-input
                  v-model:value="plugInfo.plugContent.env"
                  :on-create="
                    () => {
                      return { key: '', value: '' }
                    }
                  ">
                  <template #default="{ value }">
                    <div style="display: flex; align-items: center; width: 100%">
                      <n-input type="text" v-model:value="value.key" placeholder="Key" />
                      <div class="mx-[5px]">=</div>
                      <n-input type="text" v-model:value="value.value" placeholder="Value" />
                    </div>
                  </template>
                </n-dynamic-input>
              </n-form-item>
            </template>
          </n-form>
        </div>
        <template #header-extra>
          <icon-hover-button type="error" @click="showAddMcpPlug = false">
            <Icon icon="carbon:close" />
          </icon-hover-button>
        </template>
        <template #footer>
          <n-button size="small" class="w-[60px]" @click="showAddMcpPlug = false">取消</n-button>
          <n-button size="small" class="w-[60px]" type="primary" @click="onCreatePlug">保存</n-button>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>
<script setup>
import { Icon } from '@iconify/vue'
import PlugStatus from '@/constant/PlugStatus.js'
import Empty from '@/components/Empty.vue'
import IconHoverButton from '@/components/IconHoverButton.vue'
import DoudoneLabel from '@/components/DoudoneLabel.vue'
import McpType from '@/constant/mcpType.js'
import PlugApi from '@/api/plug.js'
import Info from '@/components/Info.vue'
import { useDialog } from 'naive-ui'
import plugStatus from '@/constant/PlugStatus.js'
import Mcp from '@/mcp/mcp.js'

const searchInputValue = ref('')
const typeValue = ref()
const statusValue = ref()
const plugData = ref([])
const showAddMcpPlug = ref(false)
const plugInfo = ref({ plugContent: { env: [], mcpType: McpType.Stdio, args: '' } })
const plugForm = ref()
const isEditPlug = ref(false)

const dialog = useDialog()

const plugFilterData = computed(() => {
  return plugData.value.filter((item) => {
    const hasSearch = !!searchInputValue.value
    const hasTypeFilter = !!typeValue.value
    const hasStatusFilter = !!statusValue.value
    return (
      (!hasSearch || item.name.includes(searchInputValue.value)) &&
      (!hasTypeFilter || item.type === typeValue.value) &&
      (!hasStatusFilter || status === statusValue.value)
    )
  })
})

const plugFormRules = {
  name: [
    {
      required: true,
      message: '请输入名称',
      trigger: ['input', 'blur']
    }
  ],
  mcpType: {
    required: true,
    message: '请选择类型',
    trigger: ['input', 'change']
  },
  url: {
    required: true,
    message: '请输入URL',
    trigger: ['input', 'blur']
  },
  cmd: {
    required: true,
    message: '请选择/输入命令',
    trigger: ['input', 'change']
  },
  args: {
    required: true,
    message: '请输入运行参数',
    trigger: ['input', 'blur']
  }
}

const typeOptions = [
  {
    label: 'MCP服务',
    value: 'mcp'
  }
]
const statusOption = [
  {
    label: '未启动',
    value: PlugStatus.NoActive
  },
  {
    label: '已启动',
    value: PlugStatus.Active
  }
]

const cmdOption = [
  // {
  //   label: 'uvx',
  //   value: 'uvx'
  // },
  // {
  //   label: 'bun',
  //   value: 'bun'
  // },
  {
    label: 'cmd',
    value: 'cmd'
  },
  {
    label: 'sh',
    value: 'sh'
  }
]

const handlerAddPlug = () => {
  plugInfo.value = { plugContent: { env: [], mcpType: McpType.Stdio, args: '' } }
  isEditPlug.value = false
  showAddMcpPlug.value = true
}

const onListPlug = () => {
  PlugApi.list().then((res) => {
    if (res.code === 0) {
      plugData.value = res.data
    }
  })
}

const onCreatePlug = () => {
  plugInfo.value.type = 'mcp'
  plugForm.value?.validate((errors) => {
    if (!errors) {
      if (isEditPlug.value) {
        PlugApi.update(plugInfo.value).then((res) => {
          if (res.code === 0) {
            showAddMcpPlug.value = false
            onListPlug()
          }
        })
      } else {
        PlugApi.create(plugInfo.value).then((res) => {
          if (res.code === 0) {
            showAddMcpPlug.value = false
            onListPlug()
          }
        })
      }
    }
  })
}

const handlerUpdatePlug = (item) => {
  isEditPlug.value = true
  showAddMcpPlug.value = true
  plugInfo.value = { ...item }
  plugInfo.value.plugContent = JSON.parse(item.plugContent)
}

const onDeletePlug = (item) => {
  dialog.error({
    title: '确认删除',
    content: `确定要删除 "${item.name}" 吗？此操作无法撤销。`,
    positiveText: '确定',
    negativeText: '取消',
    draggable: false,
    showIcon: false,
    onPositiveClick: () => {
      PlugApi.delete({ id: item.id }).then((res) => {
        if (res.code === 0) {
          onListPlug()
        }
      })
    }
  })
}

const onSwitchPlug = (item) => {
  if (item.isActive) {
    item.isActive = 0
    PlugApi.switch(item)
    Mcp.close(item)
  } else {
    Mcp.start(item).then(() => {
      item.isActive = 1
      PlugApi.switch(item)
    })
  }
}

onMounted(() => {
  onListPlug()
})
</script>
<style lang="scss" scoped>
.plug-container {
  height: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-x: hidden;
  padding: 10px 20px;

  .plug-title__h1 {
    font-size: 26px;
    font-weight: 500;
    letter-spacing: 1px;
    user-select: none;
  }

  .plug-search {
    width: 100%;
    padding: 20px;
    background-color: var(--nav-bg);
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 20px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .plug-list {
    @apply grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-[20px];
    overflow-y: scroll;

    .plug-list-card {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 20px;
      background-color: var(--nav-bg);
      border-radius: 8px;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

      .plug-list__card--avatar {
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        background-color: #fff;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
