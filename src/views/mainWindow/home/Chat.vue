<template>
  <div class="chat-container">
    <div class="chat-wrapper">
      <div class="chat-list px-[10px]">
        <div class="h-[60px] flex items-center">
          <n-button @click="handlerAddChat" type="primary" size="large" class="w-full">
            <template #icon>
              <Icon icon="tabler:plus"></Icon>
            </template>
            新建聊天
          </n-button>
        </div>
        <div
          v-for="item in chatData"
          @click="selectedChatInfo = item"
          :class="['chat-list__card', { active: item.id === selectedChatInfo.id }]">
          <div class="chat-list__card--name truncate">{{ item.name }}</div>
        </div>
        <div v-if="chatData.length <= 0" class="mt-[50px] flex justify-center items-center">
          <div class="mr-[2px] text-[var(--minor-text-color)]">暂无会话，点击</div>
          <n-a @click="handlerAddChat">创建聊天</n-a>
        </div>
      </div>
      <div class="chat-content">
        <div v-if="selectedChatInfo.id" class="flex flex-col h-full">
          <div class="chat-content__title">
            <div class="flex flex-col w-[150px] lg:w-[300px]">
              <div class="truncate">{{ selectedChatInfo.name }}</div>
              <div class="flex gap-[10px]">
                <n-tag size="small" type="primary" class="text-[var(--minor-text-color)]">
                  <div class="max-w-[100px] truncate">模型:{{ selectedChatInfo.modelName }}</div>
                </n-tag>
                <n-tag size="small" type="primary" class="text-[var(--minor-text-color)]">
                  <div class="max-w-[100px] truncate">模型:{{ selectedChatInfo.roleName }}</div>
                </n-tag>
              </div>
            </div>
            <div class="flex gap-[10px]">
              <n-popover trigger="hover" placement="bottom">
                <template #trigger>
                  <icon-hover-button type="theme" @click="onCleanRecord" style="font-size: 20px">
                    <Icon icon="solar:eraser-bold-duotone" />
                  </icon-hover-button>
                </template>
                <span>清空记录</span>
              </n-popover>
              <n-popover trigger="hover" placement="bottom">
                <template #trigger>
                  <icon-hover-button type="theme" @click="() => onDeleteChat(selectedChatInfo)" style="font-size: 20px">
                    <Icon icon="solar:trash-bin-minimalistic-bold-duotone" />
                  </icon-hover-button>
                </template>
                <span>删除</span>
              </n-popover>
            </div>
          </div>
          <div class="chat-content__area">
            <div class="flex-1"></div>
            <message
              v-for="item in recordData"
              :key="item.id"
              :right="item.type === RecordType.Receive"
              :message="item.recordContent" />
          </div>
          <div class="chat-content__input">
            <n-input
              v-model:value="msgInputValue"
              :resizable="false"
              class="flex-1"
              type="textarea"
              placeholder="请输入消息~" />
            <div class="flex w-full justify-end">
              <n-button type="primary" class="w-[100px]" @click="onSendMsg">
                <template #icon>
                  <Icon icon="solar:plain-3-bold"></Icon>
                </template>
                发送
              </n-button>
            </div>
          </div>
        </div>
        <empty
          v-if="!selectedChatInfo.id"
          title="暂无会话数据"
          content="您还没有创建任何聊天呢，快来发起第一个对话吧。"
          operate-text="新建第一个聊天"
          @onOk="handlerAddChat">
          <template #icon>
            <Icon icon="solar:chat-square-like-line-duotone" />
          </template>
        </empty>
      </div>
    </div>
    <n-modal v-model:show="showAddChat" :mask-closable="false" :close-on-esc="false">
      <n-card style="width: 500px" title="创建聊天" :bordered="false" footer-class="flex justify-end gap-[10px]">
        <n-form ref="chatForm" :model="chatInfo" :rules="chatFormRules">
          <n-form-item path="name" label="名称">
            <n-input
              v-model:value="chatInfo.name"
              maxlength="16"
              show-count
              @keydown.enter.prevent
              placeholder="请输入名称" />
          </n-form-item>
          <n-form-item path="role" label="角色">
            <n-select
              v-model:value="chatInfo.role"
              :options="roleData"
              placeholder="请选择角色"
              value-field="id"
              label-field="name">
              <template #action>
                点击跳转
                <n-a @click="() => router.push('/home/role')">创建角色</n-a>
              </template>
            </n-select>
          </n-form-item>
          <n-form-item path="model" label="模型">
            <n-select
              v-model:value="chatInfo.model"
              :options="modelData"
              placeholder="请选择模型"
              value-field="id"
              label-field="name">
              <template #action>
                点击跳转
                <n-a @click="() => router.push('/home/model')">创建模型</n-a>
              </template>
            </n-select>
          </n-form-item>
        </n-form>
        <template #header-extra>
          <icon-hover-button type="error" @click="showAddChat = false">
            <Icon icon="carbon:close" />
          </icon-hover-button>
        </template>
        <template #footer>
          <n-button size="small" class="w-[60px]" @click="showAddChat = false">取消</n-button>
          <n-button size="small" class="w-[60px]" type="primary" @click="onCreateChat">保存</n-button>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>
<script setup>
import { Icon } from '@iconify/vue'
import Message from '@/components/msg/Message.vue'
import Empty from '@/components/Empty.vue'
import IconHoverButton from '@/components/IconHoverButton.vue'
import { useRouter } from 'vue-router'
import RoleApi from '@/api/role.js'
import ModelApi from '@/api/model.js'
import { onMounted } from 'vue'
import ChatApi from '@/api/chat.js'
import RecordApi from '@/api/record.js'
import { useDialog } from 'naive-ui'
import RecordType from '@/constant/recordType.js'
import Ai from '@/ai/ai.js'
import { nanoid } from 'nanoid'

const chatData = ref([])
const selectedChatInfo = ref({})
const showAddChat = ref(false)
const chatInfo = ref({})
const router = useRouter()
const modelData = ref([])
const roleData = ref([])
const chatForm = ref()
const dialog = useDialog()
const recordData = ref([])
const msgInputValue = ref('')

const chatFormRules = {
  name: [
    {
      required: true,
      message: '请输入名称',
      trigger: ['input', 'blur']
    }
  ],
  role: [
    {
      required: true,
      message: '请选择角色',
      trigger: ['input', 'change']
    }
  ],
  model: [
    {
      required: true,
      message: '请选择模型',
      trigger: ['input', 'change']
    }
  ]
}

const handlerAddChat = () => {
  showAddChat.value = true
  chatInfo.value = {}
}

const onCreateChat = () => {
  chatForm.value?.validate((errors) => {
    if (!errors) {
      ChatApi.create(chatInfo.value).then((res) => {
        if (res.code === 0) {
          onChatList()
          showAddChat.value = false
        }
      })
    }
  })
}

const onChatList = () => {
  ChatApi.list().then((res) => {
    if (res.code === 0) {
      chatData.value = res.data
    }
  })
}

const onSendMsg = async () => {
  if (!msgInputValue.value) return
  //获取角色提示词
  let roleCharacter = selectedChatInfo.value.roleCharacter
  //获取模型信息
  let modelContent = JSON.parse(selectedChatInfo.value.modelContent)
  // 请求消息
  let msg = {
    id: nanoid(),
    produceId: selectedChatInfo.value.id,
    type: RecordType.Receive,
    recordContent: msgInputValue.value
  }
  await RecordApi.create(msg)
  recordData.value = [msg, ...recordData.value]
  // 回复消息
  Ai.getResponseContent(roleCharacter, modelContent, msgInputValue.value, {
    produceId: selectedChatInfo.value.id
  }).then((res) => {
    msg = {
      id: nanoid(),
      produceId: selectedChatInfo.value.id,
      type: RecordType.Reply,
      recordContent: res
    }
    RecordApi.create(msg)
    recordData.value = [msg, ...recordData.value]
  })
  msgInputValue.value = ''
}

const onRoleList = () => {
  RoleApi.list().then((res) => {
    if (res.code === 0) {
      roleData.value = res.data
    }
  })
}

const onModelList = () => {
  ModelApi.list().then((res) => {
    if (res.code === 0) {
      modelData.value = res.data
    }
  })
}

const onRecordPage = (id) => {
  RecordApi.page({ produceId: id, index: 0, num: 99 }).then((res) => {
    if (res.code === 0) {
      recordData.value = res.data
    }
  })
}

const onCleanRecord = () => {
  dialog.error({
    title: '确认清空',
    content: `确定要清空该聊天记录吗？此操作无法撤销。`,
    positiveText: '确定',
    negativeText: '取消',
    draggable: false,
    showIcon: false,
    onPositiveClick: async () => {
      await RecordApi.clean({ produceId: selectedChatInfo.value.id })
      recordData.value = []
    }
  })
}

const onDeleteChat = (item) => {
  dialog.error({
    title: '确认删除',
    content: `确定要删除该会话 "${item.name}" 吗？此操作无法撤销。`,
    positiveText: '确定',
    negativeText: '取消',
    draggable: false,
    showIcon: false,
    onPositiveClick: async () => {
      await RecordApi.clean({ produceId: item.id })
      ChatApi.delete({ id: item.id }).then((res) => {
        if (res.code === 0) {
          selectedChatInfo.value = {}
          onChatList()
        }
      })
    }
  })
}

watch(
  () => chatData.value,
  () => {
    if (!selectedChatInfo.value.id && chatData.value.length > 0) {
      selectedChatInfo.value = chatData.value[0]
    }
  }
)

watch(
  () => selectedChatInfo.value,
  () => {
    if (selectedChatInfo.value.id) {
      onRecordPage(selectedChatInfo.value.id)
    }
  }
)

onMounted(() => {
  onChatList()
  onRoleList()
  onModelList()
})
</script>
<style scoped lang="scss">
.chat-container {
  height: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-x: hidden;
  padding: 10px 20px;

  .chat-wrapper {
    height: 100%;
    background-color: var(--nav-bg);
    border-radius: 8px;
    display: flex;

    .chat-list {
      height: 100%;
      border-right: 1px var(--card-bg) solid;
      width: 220px;
      max-width: 300px;
      display: flex;
      flex-direction: column;
      gap: 5px;

      .chat-list__card {
        height: 50px;
        background-color: var(--card-bg);
        padding: 10px;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;

        .chat-list__card--name {
          font-size: 14px;
          font-weight: 500;
        }

        .chat-list__card--msg {
          font-size: 12px;
          color: var(--minor-text-color);
        }

        &.active {
          background-color: rgba(var(--primary-color), 0.1);
        }

        &:not(.active):hover {
          background-color: rgba(var(--primary-color), 0.05);
        }
      }
    }

    .chat-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: center;

      .chat-content__title {
        height: 60px;
        border-bottom: 1px var(--card-bg) solid;
        display: flex;
        align-items: center;
        font-size: 18px;
        padding: 0 10px;
        font-weight: 500;
        justify-content: space-between;
      }

      .chat-content__input {
        height: 200px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .chat-content__area {
        flex: 1;
        border-bottom: 1px var(--card-bg) solid;
        padding: 20px 10px 0 10px;
        overflow-y: scroll;
        display: flex;
        flex-direction: column-reverse;
        gap: 20px;
        min-height: 0;
      }
    }
  }
}
</style>
