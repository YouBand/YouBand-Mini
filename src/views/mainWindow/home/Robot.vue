<template>
  <div class="robot-container">
    <div class="flex justify-between items-center">
      <div class="robot-title__h1">机器人仓库</div>
      <n-button @click="handlerAddRobot" type="primary" size="large">
        <template #icon>
          <Icon icon="tabler:plus"></Icon>
        </template>
        添加机器人
      </n-button>
    </div>
    <div class="robot-search">
      <n-input
        v-model:value="searchInputValue"
        class="shrink-1"
        placeholder="搜索机器人名称、角色或模型..."
        size="large">
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
    <div v-if="robotFilterData.length > 0" class="robot-list">
      <div v-for="item in robotFilterData" class="robot-list-card">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-[5px] w-[80%]">
            <div class="robot-list__card--avatar">
              <img :src="item.avatar" class="h-[90%] w-[90%]" alt="" />
            </div>
            <div class="text-[18px] line-clamp-1">{{ item.name }}</div>
          </div>
          <n-tag size="small" :type="robotStore.robotStatus[item.id] === RobotStatus.Running ? 'primary' : 'error'">
            {{ getRobotStatus(item.id) }}
          </n-tag>
        </div>
        <div class="flex justify-between">
          <div class="text-[var(--minor-text-color)] shrink-0 mr-[10px]">类型</div>
          <div class="line-clamp-1">{{ item.type }}</div>
        </div>
        <div class="flex justify-between">
          <div class="text-[var(--minor-text-color)] shrink-0 mr-[10px]">角色</div>
          <div class="line-clamp-1">{{ item.roleName }}</div>
        </div>
        <div class="flex justify-between">
          <div class="text-[var(--minor-text-color)] shrink-0 mr-[10px]]">模型</div>
          <div class="line-clamp-1">{{ item.modelName }}</div>
        </div>
        <div class="flex text-[var(--minor-text-color)] justify-end mt-[10px]">
          <n-popover v-if="robotStore.robotStatus[item.id] !== RobotStatus.Running" trigger="hover">
            <template #trigger>
              <icon-hover-button
                @click="() => handlerStartRobot(item)"
                type="theme"
                style="width: 36px; height: 36px; font-size: 20px">
                <Icon icon="solar:play-circle-bold" />
              </icon-hover-button>
            </template>
            <span>启动</span>
          </n-popover>
          <n-popover v-if="robotStore.robotStatus[item.id] === RobotStatus.Running" trigger="hover">
            <template #trigger>
              <icon-hover-button
                @click="() => handlerStopRobot(item)"
                type="theme"
                style="width: 36px; height: 36px; font-size: 20px">
                <Icon icon="solar:pause-circle-bold" />
              </icon-hover-button>
            </template>
            <span>停止</span>
          </n-popover>
          <n-popover trigger="hover">
            <template #trigger>
              <icon-hover-button
                @click="() => handlerRecordRobot(item)"
                type="theme"
                style="width: 36px; height: 36px; font-size: 20px">
                <Icon icon="solar:laptop-minimalistic-bold" />
              </icon-hover-button>
            </template>
            <span>记录</span>
          </n-popover>
          <icon-hover-button
            @click="() => handlerEditRobot(item)"
            type="theme"
            style="width: 36px; height: 36px; font-size: 20px">
            <Icon icon="solar:pen-new-square-line-duotone" />
          </icon-hover-button>
          <icon-hover-button
            type="theme-error"
            style="width: 36px; height: 36px; font-size: 22px"
            @click="() => onDelete(item)">
            <Icon icon="solar:trash-bin-minimalistic-line-duotone" />
          </icon-hover-button>
        </div>
      </div>
    </div>
    <!--空列表-->
    <empty
      v-if="robotFilterData.length <= 0"
      title="暂无机器人数据"
      content="您当前尚未添加任何机器人。创建前请先创建所需模型和角色，再进行机器人添加操作。"
      operate-text="添加第一个机器人"
      @onOk="handlerAddRobot">
      <template #icon>
        <Icon icon="solar:ghost-broken" />
      </template>
    </empty>
    <!--添加机器人-->
    <n-modal v-model:show="showAddRobot" :mask-closable="false" :close-on-esc="false">
      <n-card style="width: 500px" title="添加机器人" :bordered="false" footer-class="flex justify-end gap-[10px]">
        <n-form ref="robotForm" :model="robotInfo" :rules="robotFormRules">
          <n-form-item path="type" label="类型">
            <n-select v-model:value="robotInfo.type" :options="typeOptions" placeholder="请选择机器人类型" />
          </n-form-item>
          <n-form-item path="name" label="名称">
            <n-input
              v-model:value="robotInfo.name"
              maxlength="16"
              show-count
              @keydown.enter.prevent
              placeholder="请输入名称" />
          </n-form-item>
          <n-form-item path="role" label="角色">
            <n-select
              v-model:value="robotInfo.role"
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
              v-model:value="robotInfo.model"
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
          <n-form-item
            v-for="item in selectTypeOption.formField"
            :path="`robotContent[${item.key}]`"
            :label="item.name"
            :rule="item.rule">
            <n-input
              v-model:value="robotInfo.robotContent[item.key]"
              @keydown.enter.prevent
              :placeholder="item.placeholder" />
          </n-form-item>
        </n-form>
        <template #header-extra>
          <icon-hover-button type="error" @click="showAddRobot = false">
            <Icon icon="carbon:close" />
          </icon-hover-button>
        </template>
        <template #footer>
          <n-button size="small" class="w-[60px]" @click="showAddRobot = false">取消</n-button>
          <n-button size="small" class="w-[60px]" type="primary" @click="onCreateRobot">保存</n-button>
        </template>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showRecordRobot" to=".robot-container">
      <div class="robot-record-wrapper">
        <div class="robot-record">
          <div class="robot-record-info">
            <div class="flex gap-[10px]">
              <div class="robot-record-info__avatar">
                <img :src="selectedRobotInfo.avatar" class="h-[90%] w-[90%]" alt="" />
              </div>
              <div class="flex flex-col">
                <div class="text-[18px] font-bold">{{ selectedRobotInfo.name }}</div>
                <div>
                  <n-tag
                    size="small"
                    :type="robotStore.robotStatus[selectedRobotInfo.id] === RobotStatus.Running ? 'primary' : 'error'">
                    {{ getRobotStatus(selectedRobotInfo.id) }}
                  </n-tag>
                </div>
              </div>
            </div>
            <div class="flex gap-[15px]">
              <n-popover trigger="hover" placement="bottom">
                <template #trigger>
                  <icon-hover-button type="theme" @click="onCleanRecord" style="font-size: 20px">
                    <Icon icon="solar:eraser-bold-duotone" />
                  </icon-hover-button>
                </template>
                <span>清空记录</span>
              </n-popover>
              <icon-hover-button type="error" @click="showRecordRobot = false">
                <Icon icon="carbon:close" />
              </icon-hover-button>
            </div>
          </div>
          <div v-if="robotRecordData.length > 0" class="robot-record-list">
            <div v-for="item in robotRecordData" :class="['robot-record__card', `${item.type}`]">
              <div class="flex justify-between">
                <div class="flex gap-[10px] items-center">
                  <n-tag size="small" :type="item.type">{{ getRecordType(item.type) }}</n-tag>
                  <div v-for="info in getTargetInfo(item.targetInfo)">
                    <div class="text-[var(--minor-text-color)]">
                      <span class="text-[var(--minor-text-color)]">{{ info.key }}</span
                      >:
                      <span>{{ info.value }}</span>
                    </div>
                  </div>
                </div>
                <div class="text-[var(--minor-text-color)]">{{ DateUtil.formatLocale(item.createTime) }}</div>
              </div>
              <div class="overflow-hidden">{{ item.recordContent }}</div>
            </div>
          </div>
          <empty v-if="robotRecordData.length <= 0" title="暂无数据记录" content="您可以尝试启动当前机器人。">
            <template #icon>
              <Icon icon="solar:ghost-broken" />
            </template>
          </empty>
        </div>
      </div>
    </n-modal>
  </div>
</template>
<script setup>
import { Icon } from '@iconify/vue'
import IconHoverButton from '@/components/IconHoverButton.vue'
import { useDialog } from 'naive-ui'
import { onMounted, watch } from 'vue'
import RoleApi from '@/api/role.js'
import ModelApi from '@/api/model.js'
import RobotApi from '@/api/robot.js'
import Robot from '@/robot/robot.js'
import { useRobotStore } from '@/stores/useRobotStore.js'
import RobotStatus from '@/constant/robotStatus.js'
import robotStatus from '@/constant/robotStatus.js'
import { useRouter } from 'vue-router'
import RecordType from '@/constant/recordType.js'
import DateUtil from '../../../utils/date.js'
import Empty from '@/components/Empty.vue'
import RecordApi from '@/api/record.js'

const router = useRouter()
const typeValue = ref()
const statusValue = ref()
const searchInputValue = ref('')
const dialog = useDialog()
const showAddRobot = ref(false)
const robotInfo = ref({ robotContent: {} })
const robotForm = ref({})
const selectTypeOption = ref({})
const roleData = ref([])
const modelData = ref([])
const robotData = ref([])
const isEditRobot = ref(false)
const robotStore = useRobotStore()
const showRecordRobot = ref(false)
const robotRecordData = ref([])
const selectedRobotInfo = ref({})

// 表单验证规则
const robotFormRules = {
  name: [
    {
      required: true,
      message: '请输入名称',
      trigger: ['input', 'blur']
    }
  ],
  type: [
    {
      required: true,
      message: '请选择类型',
      trigger: ['input', 'change']
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

const statusOption = [
  {
    label: '未启动',
    value: RobotStatus.NoRun
  },
  {
    label: '运行中',
    value: RobotStatus.Running
  },
  {
    label: '错误',
    value: RobotStatus.Error
  }
]

// 类型
const typeOptions = [
  {
    label: 'QQ(NapCat)',
    value: 'napcat',
    avatar: '/qq.svg',
    formField: [
      {
        key: 'webSocket',
        name: 'NapCat-WebSocket服务器地址',
        placeholder: '请先到NapCat中创建，例: ws://127.0.0.1:4449',
        rule: {
          required: true,
          message: '请输入NapCat-WebSocket服务器地址',
          trigger: ['input', 'blur']
        }
      }
    ]
  },
  {
    label: 'WX(Gewechat)',
    value: 'gewechat',
    avatar: '/wx.svg'
  }
]

const robotFilterData = computed(() => {
  return robotData.value.filter((item) => {
    const hasSearch = !!searchInputValue.value
    const hasTypeFilter = !!typeValue.value
    const hasStatusFilter = !!statusValue.value
    const status = robotStore.robotStatus[item.id] ? robotStore.robotStatus[item.id] : robotStatus.NoRun
    return (
      (!hasSearch ||
        item.name.includes(searchInputValue.value) ||
        item.roleName.includes(searchInputValue.value) ||
        item.modelName.includes(searchInputValue.value)) &&
      (!hasTypeFilter || item.type === typeValue.value) &&
      (!hasStatusFilter || status === statusValue.value)
    )
  })
})

const onCleanRecord = () => {
  dialog.error({
    title: '确认清空',
    content: `确定要清空 "${selectedRobotInfo.value.name}" 机器人的记录吗？此操作无法撤销。`,
    positiveText: '确定',
    negativeText: '取消',
    draggable: false,
    showIcon: false,
    onPositiveClick: () => {
      RecordApi.clean({ produceId: selectedRobotInfo.value.id }).then((res) => {
        if (res.code === 0) {
          onPageRobot(selectedRobotInfo.value)
        }
      })
    }
  })
}

watch(
  () => robotInfo.value.type,
  () => {
    if (robotInfo.value.type) {
      for (let i = 0; i < typeOptions.length; i++) {
        if (robotInfo.value.type === typeOptions[i].value) {
          selectTypeOption.value = typeOptions[i]
          break
        }
      }
    }
  }
)

const handlerRecordRobot = (item) => {
  showRecordRobot.value = true
  selectedRobotInfo.value = item
  onPageRobot(item)
}

const onPageRobot = (item) => {
  RecordApi.page({ produceId: item.id, index: 0, num: 99 }).then((res) => {
    if (res.code === 0) {
      robotRecordData.value = res.data
    }
  })
}

const getTargetInfo = (targetInfo) => {
  return JSON.parse(targetInfo)
}

const getRobotStatus = computed(() => {
  return (key) => {
    const status = robotStore.robotStatus[key]
    return RobotStatus.valueMap(status)
  }
})

const getRecordType = computed(() => {
  return (type) => RecordType.valueMap(type)
})

const handlerAddRobot = () => {
  showAddRobot.value = true
  isEditRobot.value = false
  robotInfo.value = { robotContent: {} }
}

const handlerEditRobot = (item) => {
  showAddRobot.value = true
  isEditRobot.value = true
  robotInfo.value = { ...item }
  robotInfo.value.robotContent = JSON.parse(item.robotContent)
}

const handlerStartRobot = (item) => {
  Robot.content(item)
}

const handlerStopRobot = (item) => {
  Robot.closeContent(item)
}

const onCreateRobot = () => {
  robotInfo.value.avatar = selectTypeOption.value.avatar ? selectTypeOption.value.avatar : robotInfo.value.avatar
  robotForm.value?.validate((errors) => {
    if (!errors) {
      if (isEditRobot.value) {
        RobotApi.update(robotInfo.value).then((res) => {
          if (res.code === 0) {
            onRobotList()
            showAddRobot.value = false
          }
        })
      } else {
        RobotApi.create(robotInfo.value).then((res) => {
          if (res.code === 0) {
            onRobotList()
            showAddRobot.value = false
          }
        })
      }
    }
  })
}

const onRobotList = () => {
  RobotApi.list().then((res) => {
    if (res.code === 0) {
      robotData.value = res.data
    }
  })
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

const onDelete = (item) => {
  dialog.error({
    title: '确认删除',
    content: `确定要删除机器人 "${item.name}" 吗？此操作无法撤销。`,
    positiveText: '确定',
    negativeText: '取消',
    draggable: false,
    showIcon: false,
    onPositiveClick: () => {
      RobotApi.delete({ id: item.id }).then((res) => {
        if (res.code === 0) {
          onRobotList()
        }
      })
    }
  })
}

onMounted(() => {
  onRobotList()
  onRoleList()
  onModelList()
})
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

      .robot-list__card--avatar {
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

  .robot-record-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    width: 80vw;
    height: 80vh;

    .robot-record {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow: hidden;
      background-color: var(--nav-bg);
      padding: 20px;
      border-radius: 8px;
      color: var(--primary-text-color);

      .robot-record-info {
        height: 70px;
        padding: 10px;
        border-bottom: 1px var(--card-bg) solid;
        display: flex;
        gap: 10px;
        justify-content: space-between;

        .robot-record-info__avatar {
          height: 48px;
          width: 48px;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .robot-record-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
        overflow-y: scroll;

        .robot-record__card {
          padding: 10px;
          background-color: var(--card-bg);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-weight: 500;

          &.error {
            background-color: rgb(from var(--error-color) r g b / 5%);
            color: var(--error-color);
          }

          &.info {
            background-color: rgba(var(--primary-color), 0.05);
            color: rgba(var(--primary-color));
          }
        }
      }
    }
  }
}
</style>
