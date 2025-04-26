<template>
  <div class="model-container">
    <div class="model-title__h1">大模型智库</div>
    <div class="flex gap-[20px] flex-1 overflow-hidden items-start">
      <div class="model-list">
        <div class="text-[18px]">已添加的模型</div>
        <div v-for="item in modelData" :key="item.id" class="model-list__card flex-col lg:flex-row">
          <div class="flex gap-[10px] items-center">
            <div class="model-list__card--avatar">
              <img :src="item.avatar" class="h-[90%]" alt="" />
            </div>
            <div class="flex flex-col justify-between">
              <div class="text-[16px] mb-[2px] w-[100px] md:w-[150px] lg:w-[300px] truncate">{{ item.name }}</div>
              <div>
                <n-tag size="small" type="primary">{{ item.type }}</n-tag>
              </div>
            </div>
          </div>
          <div class="flex gap-[5px] text-[var(--minor-text-color)] justify-end w-full lg:w-auto">
            <n-popover trigger="hover">
              <template #trigger>
                <icon-hover-button
                  @click="() => handlerConnectedness(item)"
                  type="theme"
                  style="width: 28px; height: 28px; font-size: 18px">
                  <Icon icon="solar:heart-pulse-bold" />
                </icon-hover-button>
              </template>
              <span>连通检测</span>
            </n-popover>
            <icon-hover-button
              @click="() => handlerEditModel(item)"
              type="theme"
              style="width: 28px; height: 28px; font-size: 16px">
              <Icon icon="solar:pen-new-square-line-duotone" />
            </icon-hover-button>
            <icon-hover-button
              @click="() => onDeleteModel(item)"
              type="theme-error"
              style="width: 28px; height: 28px; font-size: 18px">
              <Icon icon="solar:trash-bin-minimalistic-line-duotone" />
            </icon-hover-button>
          </div>
        </div>
        <!--空列表-->
        <empty
          v-if="modelData.length <= 0"
          title="暂无已添加模型"
          content="您可以点击右侧列表选项，添加您需要的模型。"
          operate-text="添加DeepSeek模型"
          @onOk="() => handlerAddModel(modelManuData[0])">
          <template #icon>
            <Icon icon="solar:black-hole-line-duotone" />
          </template>
        </empty>
      </div>
      <div class="model-manu-list">
        <div class="text-[18px]">可添加的模型</div>
        <div
          v-for="item in modelManuData"
          :key="item.type"
          class="model-manu-list__card"
          @click="() => handlerAddModel(item)">
          <div class="flex items-center gap-[5px] overflow-x-hidden">
            <div class="model-manu-list__card--avatar">
              <img :src="item.avatar" class="h-[90%]" alt="" />
            </div>
            <div class="model-manu-list__card--name truncate max-w-[100px] overflow-hidden">
              {{ item.name }}
            </div>
          </div>
          <Icon icon="tabler:plus" class="model-manu-list__card--icon" />
        </div>
      </div>
    </div>
    <!--模型添加表单-->
    <n-modal v-model:show="showAddModelModal" :mask-closable="false" :close-on-esc="false">
      <n-card
        style="width: 500px"
        :title="isEditModel ? `修改已添加模型` : `添加 ${addModelTypeContent.name} 模型`"
        :bordered="false"
        footer-class="flex justify-between gap-[10px] items-center">
        <n-form ref="addModelForm" :model="modelInfo" :rules="addModelTypeContent.formRules">
          <n-form-item
            v-for="item in addModelTypeContent.formField"
            :key="item.key"
            :path="item.key"
            :label="item.name">
            <n-input
              v-if="item.type === 'input'"
              v-model:value="modelInfo[item.key]"
              @keydown.enter.prevent
              :placeholder="item.placeholder" />
            <n-slider
              v-if="item.type === 'slider'"
              v-model:value="modelInfo[item.key]"
              :step="item.step"
              :max="item.max"
              :min="item.min" />
          </n-form-item>
        </n-form>
        <template #header-extra>
          <icon-hover-button type="error" @click="showAddModelModal = false">
            <Icon icon="carbon:close" />
          </icon-hover-button>
        </template>
        <template #footer>
          <n-a :href="addModelTypeContent.operate.url" target="_blank">{{ addModelTypeContent.operate.name }}</n-a>
          <div class="flex gap-[10px]">
            <n-button size="small" class="w-[60px]" @click="showAddModelModal = false">取消</n-button>
            <n-button size="small" class="w-[60px]" type="primary" @click="onCreateModel">保存</n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
    <!--模型连通性-->
    <n-modal v-model:show="showConnectModal" :mask-closable="false" :close-on-esc="false">
      <n-card
        style="width: 500px"
        title="模型连通性"
        :bordered="false"
        footer-class="flex justify-between gap-[10px] items-center"
        class="text-[var(--primary-text-color)]">
        <template #header-extra>
          <icon-hover-button type="error" @click="showConnectModal = false">
            <Icon icon="carbon:close" />
          </icon-hover-button>
        </template>
        <div v-if="!connectResultMsg" class="flex flex-col justify-center items-center p-[10px]">
          <n-spin size="medium" />
          <div>正在请求中</div>
        </div>
        <n-alert v-if="connectResultMsg" :type="Ai.bugMsg === connectResultMsg ? 'error' : 'info'" :show-icon="false">
          {{ connectResultMsg }}
        </n-alert>
      </n-card>
    </n-modal>
  </div>
</template>
<script setup>
import IconHoverButton from '@/components/IconHoverButton.vue'
import { Icon } from '@iconify/vue'
import ModelApi from '@/api/model.js'
import { onMounted } from 'vue'
import { useDialog } from 'naive-ui'
import Empty from '@/components/Empty.vue'
import Ai from '@/ai/ai.js'

const showAddModelModal = ref(false)
const modelInfo = ref({})
const addModelForm = ref({})
const addModelTypeContent = ref({})
const modelData = ref([])
const isEditModel = ref(false)
const dialog = useDialog()
const showConnectModal = ref(false)
const connectResultMsg = ref('')

const modelManuData = [
  {
    avatar: '/deepseek.svg',
    name: 'DeepSeek',
    type: 'deepseek',
    formField: [
      { key: 'name', name: '名称', type: 'input', placeholder: '请输入名称' },
      { key: 'apiKey', name: 'API-Key', type: 'input', placeholder: '请从DeepSeek获取，并输入API密钥' },
      { key: 'model', name: '模型', type: 'input', placeholder: '请输入模型，例如：deepseek-chat' },
      { key: 'temperature', name: '温度', type: 'slider', max: 2, min: 0, step: 0.1, defaultValue: 1.3 },
      { key: 'maxToken', name: '最大Token数', type: 'slider', max: 5000, min: 20, step: 1, defaultValue: 2000 }
    ],
    formRules: {
      apiKey: [
        {
          required: true,
          message: '请输入API-Key',
          trigger: ['input', 'blur']
        }
      ],
      name: [
        {
          required: true,
          message: '请输入名称',
          trigger: ['input', 'blur']
        }
      ],
      model: [
        {
          required: true,
          message: '请输入模型',
          trigger: ['input', 'blur']
        }
      ]
    },
    operate: {
      name: '如何使用DeepSeek',
      url: 'https://api-docs.deepseek.com/zh-cn/'
    }
  },
  {
    avatar: '/ollama.svg',
    name: 'Ollama',
    type: 'ollama',
    formField: [
      { key: 'name', name: '名称', type: 'input', placeholder: '请输入名称' },
      {
        key: 'url',
        name: '基础的url',
        type: 'input',
        placeholder: '例如：http://localhost:11434',
        defaultValue: 'http://localhost:11434'
      },
      { key: 'apiKey', name: 'API-Key', type: 'input', placeholder: '本地部署可以忽略' },
      { key: 'model', name: '模型', type: 'input', placeholder: '请输入模型，例如：qwen2.5:7b' },
      { key: 'temperature', name: '温度', type: 'slider', max: 2, min: 0, step: 0.1, defaultValue: 1.3 },
      { key: 'maxToken', name: '最大Token数', type: 'slider', max: 5000, min: 20, step: 1, defaultValue: 2000 }
    ],
    formRules: {
      name: [
        {
          required: true,
          message: '请输入名称',
          trigger: ['input', 'blur']
        }
      ],
      url: [
        {
          required: true,
          message: '请输入url',
          trigger: ['input', 'blur']
        }
      ],
      model: [
        {
          required: true,
          message: '请输入模型',
          trigger: ['input', 'blur']
        }
      ]
    },
    operate: {
      name: '如何使用ollama',
      url: 'https://ollama.com/'
    }
  },
  {
    avatar: '/tongyi.svg',
    name: '通义千问',
    type: 'qwen',
    formField: [
      { key: 'name', name: '名称', type: 'input', placeholder: '请输入名称' },
      { key: 'apiKey', name: 'API-Key', type: 'input', placeholder: '请从通义千问获取，并输入API密钥' },
      { key: 'model', name: '模型', type: 'input', placeholder: '请输入模型，例如：qwq-plus' },
      { key: 'temperature', name: '温度', type: 'slider', max: 2, min: 0, step: 0.1, defaultValue: 1.3 },
      { key: 'maxToken', name: '最大Token数', type: 'slider', max: 5000, min: 20, step: 1, defaultValue: 2000 }
    ],
    formRules: {
      apiKey: [
        {
          required: true,
          message: '请输入API-Key',
          trigger: ['input', 'blur']
        }
      ],
      name: [
        {
          required: true,
          message: '请输入名称',
          trigger: ['input', 'blur']
        }
      ],
      model: [
        {
          required: true,
          message: '请输入模型',
          trigger: ['input', 'blur']
        }
      ]
    },
    operate: {
      name: '如何使用通义千问',
      url: 'https://www.aliyun.com/product/bailian'
    }
  },
  {
    avatar: '/volcEngine.svg',
    name: '火山引擎',
    type: 'volc',
    formField: [
      { key: 'name', name: '名称', type: 'input', placeholder: '请输入名称' },
      { key: 'apiKey', name: 'API-Key', type: 'input', placeholder: '请从火山引擎获取，并输入API密钥' },
      { key: 'model', name: '模型', type: 'input', placeholder: '请输入模型，例如：doubao-1-5-lite-32k-250115' },
      { key: 'temperature', name: '温度', type: 'slider', max: 2, min: 0, step: 0.1, defaultValue: 1.3 },
      { key: 'maxToken', name: '最大Token数', type: 'slider', max: 5000, min: 20, step: 1, defaultValue: 2000 }
    ],
    formRules: {
      apiKey: [
        {
          required: true,
          message: '请输入API-Key',
          trigger: ['input', 'blur']
        }
      ],
      name: [
        {
          required: true,
          message: '请输入名称',
          trigger: ['input', 'blur']
        }
      ],
      model: [
        {
          required: true,
          message: '请输入模型',
          trigger: ['input', 'blur']
        }
      ]
    },
    operate: {
      name: '如何使用火山引擎',
      url: 'https://www.volcengine.com/'
    }
  },
  {
    avatar: '/siliconflow.svg',
    name: 'SiliconFlow',
    type: 'siliconflow',
    formField: [
      { key: 'name', name: '名称', type: 'input', placeholder: '请输入名称' },
      {
        key: 'apiKey',
        name: 'API-Key',
        type: 'input',
        placeholder: '请输入SiliconFlow API密钥'
      },
      { key: 'model', name: '模型', type: 'input', placeholder: '例如：deepseek-ai/DeepSeek-R1-Distill-Qwen-7B' },
      {
        key: 'temperature',
        name: '温度',
        type: 'slider',
        max: 2,
        min: 0,
        step: 0.1,
        defaultValue: 1.3
      },
      { key: 'maxToken', name: '最大Token数', type: 'slider', max: 4000, min: 20, step: 1, defaultValue: 2000 }
    ],
    formRules: {
      apiKey: [{ required: true, message: '请输入API-Key' }],
      name: [{ required: true, message: '请输入名称' }],
      model: [{ required: true, message: '请输入模型名称' }]
    },
    operate: { name: 'SiliconFlow文档', url: 'https://docs.siliconflow.com/' }
  },
  {
    avatar: '/xunfei.svg',
    name: '讯飞星火',
    type: 'xunfei',
    formField: [
      { key: 'name', name: '名称', type: 'input', placeholder: '请输入名称' },
      {
        key: 'apiKey',
        name: 'API-Key',
        type: 'input',
        placeholder: '请输入讯飞星火 API密钥'
      },
      { key: 'model', name: '模型', type: 'input', placeholder: '例如：lite' },
      {
        key: 'temperature',
        name: '温度',
        type: 'slider',
        max: 2,
        min: 0,
        step: 0.1,
        defaultValue: 0.5
      },
      { key: 'maxToken', name: '最大Token数', type: 'slider', max: 4000, min: 20, step: 1, defaultValue: 2000 }
    ],
    formRules: {
      apiKey: [{ required: true, message: '请输入API-Key' }],
      name: [{ required: true, message: '请输入名称' }],
      model: [{ required: true, message: '请输入模型名称' }]
    },
    operate: { name: '讯飞星火文档', url: 'https://www.xfyun.cn/doc/' }
  },
  {
    avatar: '/openai.svg',
    name: 'OpenAI通用',
    type: 'common',
    formField: [
      { key: 'name', name: '名称', type: 'input', placeholder: '请输入名称' },
      {
        key: 'url',
        name: '请求url地址',
        type: 'input',
        placeholder: '请输入地址'
      },
      {
        key: 'apiKey',
        name: 'API-Key',
        type: 'input',
        placeholder: '请输相关API密钥'
      },
      { key: 'model', name: '模型', type: 'input', placeholder: '例如：lite' },
      {
        key: 'temperature',
        name: '温度',
        type: 'slider',
        max: 2,
        min: 0,
        step: 0.1,
        defaultValue: 0.5
      },
      { key: 'maxToken', name: '最大Token数', type: 'slider', max: 4000, min: 20, step: 1, defaultValue: 2000 }
    ],
    formRules: {
      apiKey: [{ required: true, message: '请输入API-Key' }],
      url: [{ required: true, message: '请输入url地址' }],
      name: [{ required: true, message: '请输入名称' }],
      model: [{ required: true, message: '请输入模型名称' }]
    },
    operate: { name: 'OpenAI文档', url: 'https://platform.openai.com/docs/overview' }
  }
]

const handlerAddModel = (item) => {
  isEditModel.value = false
  showAddModelModal.value = true
  modelInfo.value = {}
  addModelTypeContent.value = item
  for (let i = 0; i < item.formField.length; i++) {
    //赋初始值
    if (item.formField[i].defaultValue) {
      modelInfo.value[item.formField[i].key] = item.formField[i].defaultValue
    }
  }
}

const handlerEditModel = (item) => {
  isEditModel.value = true
  showAddModelModal.value = true
  modelInfo.value = JSON.parse(item.modelContent)
  modelInfo.value.id = item.id
  for (let i = 0; i < modelManuData.length; i++) {
    if (modelManuData[i].type === item.type) {
      addModelTypeContent.value = modelManuData[i]
      break
    }
  }
}

const onListModel = () => {
  ModelApi.list().then((res) => {
    if (res.code === 0) {
      modelData.value = res.data
    }
  })
}

const onCreateModel = () => {
  modelInfo.value.type = addModelTypeContent.value.type
  const model = {
    name: modelInfo.value.name,
    avatar: addModelTypeContent.value.avatar,
    type: addModelTypeContent.value.type,
    modelContent: modelInfo.value
  }
  addModelForm.value?.validate((errors) => {
    if (!errors) {
      if (isEditModel.value) {
        model.id = modelInfo.value.id
        ModelApi.update(model).then((res) => {
          if (res.code === 0) {
            onListModel()
            showAddModelModal.value = false
          }
        })
      } else {
        ModelApi.create(model).then((res) => {
          if (res.code === 0) {
            onListModel()
            showAddModelModal.value = false
          }
        })
      }
    }
  })
}

const handlerConnectedness = async (item) => {
  connectResultMsg.value = ''
  showConnectModal.value = true
  Ai.getResponseContent('', JSON.parse(item.modelContent), '你好', null, []).then((res) => {
    connectResultMsg.value = res
  })
}

const onDeleteModel = (item) => {
  dialog.error({
    title: '确认删除',
    content: `确定要删除 "${item.name}" 吗？此操作无法撤销。`,
    positiveText: '确定',
    negativeText: '取消',
    draggable: false,
    showIcon: false,
    onPositiveClick: () => {
      ModelApi.delete({ id: item.id }).then((res) => {
        if (res.code === 0) {
          onListModel()
        }
      })
    }
  })
}

onMounted(() => {
  onListModel()
})
</script>
<style scoped lang="scss">
.model-container {
  height: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 20px;

  .model-title__h1 {
    font-size: 26px;
    font-weight: 500;
    letter-spacing: 1px;
    user-select: none;
  }

  .model-list {
    padding: 20px;
    background-color: var(--nav-bg);
    flex: 1 0 240px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 100%;
    overflow-y: scroll;
    width: 100%;

    .model-list__card {
      padding: 10px;
      background-color: var(--card-bg);
      border-radius: 8px;
      display: flex;
      align-items: start;
      gap: 10px;
      justify-content: space-between;

      .model-list__card--avatar {
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

  .model-manu-list {
    padding: 20px;
    background-color: var(--nav-bg);
    flex: 0 1 260px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: scroll;
    max-height: 100%;
    width: 100%;

    .model-manu-list__card {
      padding: 10px;
      background-color: var(--card-bg);
      border-radius: 8px;
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 14px;
      justify-content: space-between;
      width: 100%;

      .model-manu-list__card--avatar {
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        background-color: #fff;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .model-manu-list__card--name {
      }

      .model-manu-list__card--icon {
        font-size: 26px;
        color: rgba(var(--primary-color));
        display: none;
      }

      &:hover {
        background-color: rgb(from var(--minor-card-bg) r g b / 100%);

        .model-manu-list__card--icon {
          display: block;
        }
      }
    }
  }
}
</style>
