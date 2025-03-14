<template>
  <div class="model-container">
    <div class="model-title__h1">大模型智库</div>
    <div class="flex gap-[20px] flex-1 overflow-hidden items-start">
      <div class="model-list">
        <div class="text-[18px]">已添加的模型</div>
        <div v-for="item in modelData" class="model-list__card flex-col lg:flex-row">
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
      </div>
      <div class="model-manu-list">
        <div class="text-[18px]">可添加的模型</div>
        <div v-for="item in modelManuData" class="model-manu-list__card" @click="() => handlerAddModel(item)">
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
    <n-modal v-model:show="showAddModelModal" :mask-closable="false" :on-esc="false">
      <n-card
        style="width: 500px"
        :title="isEditModel ? `修改已添加模型` : `添加 ${addModelTypeContent.name} 模型`"
        :bordered="false"
        footer-class="flex justify-end gap-[10px]">
        <n-form ref="addModelForm" :model="modelInfo" :rules="addModelTypeContent.formRules">
          <n-form-item v-for="item in addModelTypeContent.formField" :path="item.key" :label="item.name">
            <n-input v-model:value="modelInfo[item.key]" @keydown.enter.prevent placeholder="" />
          </n-form-item>
        </n-form>
        <template #header-extra>
          <icon-hover-button type="error" @click="showAddModelModal = false">
            <Icon icon="carbon:close" />
          </icon-hover-button>
        </template>
        <template #footer>
          <n-button size="small" class="w-[60px]" @click="showAddModelModal = false">取消</n-button>
          <n-button size="small" class="w-[60px]" type="primary" @click="onCreateModel">保存</n-button>
        </template>
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

const showAddModelModal = ref()
const modelInfo = ref({})
const addModelForm = ref()
const addModelTypeContent = ref({})
const modelData = ref([])
const isEditModel = ref(false)
const dialog = useDialog()

const modelManuData = [
  {
    avatar: '/deepseek.svg',
    name: 'DeepSeek',
    type: 'deepseek',
    formField: [
      { key: 'name', name: '名称' },
      { key: 'apiKey', name: 'API-Key' },
      { key: 'model', name: '模型' }
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
    }
  },
  {
    avatar: '/tongyi.svg',
    name: '通义千问',
    type: 'tongyi'
  },
  {
    avatar: '/ollama.svg',
    name: 'Ollama',
    type: 'ollama'
  },
  {
    avatar: '/volcEngine.svg',
    name: '火山引擎',
    type: 'volc'
  }
]

const handlerAddModel = (item) => {
  isEditModel.value = false
  showAddModelModal.value = true
  modelInfo.value = {}
  addModelTypeContent.value = item
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
