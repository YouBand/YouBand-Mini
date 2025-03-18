<template>
  <div class="dashboard-container">
    <div class="dash-title">
      <div class="dash-title__h1">Heath，欢迎回来</div>
      <div class="dash-title__h2">这是您的实时数据概览</div>
    </div>
    <!-- 统计卡片 -->
    <div class="dash-message">
      <div class="dash-message__card">
        <div class="dash-message__card--wrapper">
          <div class="flex flex-col">
            <div class="dash-message__card--title">今日消息数</div>
            <div class="dash-message__card--num">{{ messageStatsInfo?.today?.count }}</div>
          </div>
          <doudone-label size="48px" font-size="24px" color="primary">
            <Icon icon="solar:chat-round-dots-line-duotone" />
          </doudone-label>
        </div>
        <div class="dash-message__bottom--wrapper">
          <div :class="['dash-message__card--index', { error: messageStatsInfo?.today?.growth < 0 }]">
            <Icon icon="solar:course-up-linear" />
            {{ messageStatsInfo?.today?.growth }}%
          </div>
          <div>较昨日</div>
        </div>
      </div>
      <div class="dash-message__card">
        <div class="dash-message__card--wrapper">
          <div class="flex flex-col">
            <div class="dash-message__card--title">消息总数</div>
            <div class="dash-message__card--num">{{ messageStatsInfo?.total?.count }}</div>
          </div>
          <doudone-label size="48px" font-size="24px" color="purple">
            <Icon icon="solar:pie-chart-3-linear" />
          </doudone-label>
        </div>
        <div class="dash-message__bottom--wrapper">
          <div :class="['dash-message__card--index', { error: messageStatsInfo?.total?.growth < 0 }]">
            <Icon icon="solar:course-up-linear" />
            {{ messageStatsInfo?.total?.growth }}%
          </div>
          <div>较昨日</div>
        </div>
      </div>
      <div class="dash-message__card">
        <div class="dash-message__card--wrapper">
          <div class="flex flex-col">
            <div class="dash-message__card--title">上传速率</div>
            <div class="dash-message__card--num">{{ formatBytes(systemInfo['network_tx']) }}/s</div>
          </div>
          <doudone-label size="48px" font-size="24px" color="green">
            <Icon icon="solar:upload-minimalistic-linear" />
          </doudone-label>
        </div>
        <div class="dash-message__bottom--wrapper">
          <n-progress
            type="line"
            :show-indicator="false"
            :percentage="systemInfo['network_tx'] / (1024 * 10)"
            color="rgb(34 ,197, 94, 0.8)"
            rail-color="var(--card-bg)" />
        </div>
      </div>
      <div class="dash-message__card">
        <div class="dash-message__card--wrapper">
          <div class="flex flex-col">
            <div class="dash-message__card--title">下载速率</div>
            <div class="dash-message__card--num">{{ formatBytes(systemInfo['network_rx']) }}/s</div>
          </div>
          <doudone-label size="48px" font-size="24px" color="red">
            <Icon icon="solar:download-minimalistic-linear" />
          </doudone-label>
        </div>
        <div class="dash-message__bottom--wrapper">
          <n-progress
            type="line"
            :show-indicator="false"
            :percentage="systemInfo['network_rx'] / (1024 * 10)"
            color="rgb(239, 68, 68, 0.8)"
            rail-color="var(--card-bg)" />
        </div>
      </div>
    </div>
    <!-- 系统状态卡片 -->
    <div class="dash-system">
      <div class="dash-system__card">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <doudone-label size="32px" font-size="20px" color="primary">
              <Icon icon="solar:cpu-bold-duotone" />
            </doudone-label>
            <div class="dash-system__title">cpu使用率</div>
          </div>
          <div class="dash-system__num">{{ Math.ceil(systemInfo['cpu_usage']) }}%</div>
        </div>
        <div class="dash-system__progress">
          <n-progress
            type="line"
            :show-indicator="false"
            :percentage="systemInfo['cpu_usage']"
            color="rgb(var(--primary-color))"
            rail-color="var(--card-bg)" />
        </div>
        <div class="dash-system__bottom-info">
          <div></div>
          <div>核心数：{{ systemInfo['cpu_cores'] }}</div>
        </div>
      </div>
      <div class="dash-system__card">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <doudone-label size="32px" font-size="20px" color="primary">
              <Icon icon="solar:server-bold-duotone" />
            </doudone-label>
            <div class="dash-system__title">内存使用率</div>
          </div>
          <div class="dash-system__num">
            {{ Math.floor((systemInfo['memory_used'] / systemInfo['memory_total']) * 100) }}%
          </div>
        </div>
        <div class="dash-system__progress">
          <n-progress
            type="line"
            :show-indicator="false"
            :percentage="Math.floor((systemInfo['memory_used'] / systemInfo['memory_total']) * 100)"
            color="rgb(var(--primary-color))"
            rail-color="var(--card-bg)" />
        </div>
        <div class="dash-system__bottom-info">
          <div>已用：{{ formatBytes(systemInfo['memory_used']) }}</div>
          <div>总量： {{ formatBytes(systemInfo['memory_total']) }}</div>
        </div>
      </div>
      <div class="dash-system__card">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <doudone-label size="32px" font-size="20px" color="primary">
              <Icon icon="solar:diskette-bold-duotone" />
            </doudone-label>
            <div class="dash-system__title">磁盘使用率</div>
          </div>
          <div class="dash-system__num">
            {{ Math.floor((systemInfo['disk_used'] / systemInfo['disk_total']) * 100) }}%
          </div>
        </div>
        <div class="dash-system__progress">
          <n-progress
            type="line"
            :show-indicator="false"
            :percentage="Math.floor((systemInfo['disk_used'] / systemInfo['disk_total']) * 100)"
            color="rgb(var(--primary-color))"
            rail-color="var(--card-bg)" />
        </div>
        <div class="dash-system__bottom-info">
          <div>已用：{{ formatBytes(systemInfo['disk_used']) }}</div>
          <div>总量：{{ formatBytes(systemInfo['disk_total']) }}</div>
        </div>
      </div>
    </div>
    <!-- 在线机器人和消息趋势 -->
    <div class="dash-info">
      <div class="dash-info__robot-list">
        <div class="text-[18px] select-none">机器人</div>
        <div
          v-for="item in robotData"
          :key="item.id"
          :class="['dash-info__list-card', { active: item.id === selectedRobotInfo.id }]"
          @click="() => (selectedRobotInfo = item)">
          <div class="flex items-center">
            <div class="dash-info__card-avatar">
              <img :src="item.avatar" class="h-[90%] w-[90%]" alt="" />
            </div>
            <div class="text-[16px] text-[var(--minor-text-color)] ml-[10px]">{{ item.name }}</div>
          </div>
          <n-tag size="small" :type="robotStore.robotStatus[item.id] === RobotStatus.Running ? 'primary' : 'error'">
            {{ getRobotStatus(item.id) }}
          </n-tag>
        </div>
        <div v-if="robotData.length <= 0" class="mt-[50px] flex justify-center items-center">
          <div class="mr-[2px] text-[var(--minor-text-color)]">暂无机器人，跳转</div>
          <n-a @click="() => router.push('/home/robot')">创建机器人</n-a>
        </div>
      </div>
      <div class="dash-info__robot-details">
        <div v-if="selectedRobotInfo.id" class="dash-info__details-info">
          <div class="flex justify-center items-center">
            <div class="dash-info__details--avatar">
              <img :src="selectedRobotInfo.avatar" class="h-[90%] w-[90%]" alt="" />
            </div>
            <div class="flex flex-col justify-center ml-[10px]">
              <div class="text-[18px]">{{ selectedRobotInfo.name }}</div>
              <div class="flex justify-center items-center mt-[4px] gap-[20px] text-[14px]">
                <div class="max-w-[150px] truncate">
                  <span class="text-[var(--minor-text-color)] mr-[4px]">角色:</span>{{ selectedRobotInfo.roleName }}
                </div>
                <div class="max-w-[150px] truncate">
                  <span class="text-[var(--minor-text-color)] mr-[4px]">模型:</span> {{ selectedRobotInfo.modelName }}
                </div>
                <n-tag
                  size="small"
                  :type="robotStore.robotStatus[selectedRobotInfo.id] === RobotStatus.Running ? 'primary' : 'error'">
                  {{ getRobotStatus(selectedRobotInfo.id) }}
                </n-tag>
              </div>
            </div>
          </div>
        </div>
        <div v-if="selectedRobotInfo.id" class="dash-info__details-chart">
          <div class="flex items-center mb-[20px]">
            <div class="bg-[rgb(var(--primary-color))] w-[14px] h-[14px] rounded-full mr-[5px]"></div>
            <div class="text-[var(--minor-text-color)] mr-[20px]">7日消息数量</div>
            <div><span class="text-[var(--minor-text-color)] mr-[4px]">总计:</span>{{ dayStatsInfo.total }}</div>
          </div>
          <div class="h-[220px]">
            <v-chart :option="chartOption" autoresize />
          </div>
        </div>
        <div v-if="!selectedRobotInfo.id">
          <empty
            title="暂无机器人数据"
            content="您当前尚未添加任何机器人。"
            operate-text="跳转创建"
            @onOk="() => router.push('/home/robot')">
            <template #icon>
              <Icon icon="solar:ghost-broken" />
            </template>
          </empty>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Icon } from '@iconify/vue'
import DoudoneLabel from '@/components/DoudoneLabel.vue'
import * as echarts from 'echarts/core'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { DataZoomComponent, GridComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { invoke } from '@tauri-apps/api/core'
import { onMounted, onUnmounted } from 'vue'
import Empty from '@/components/Empty.vue'
import { useRouter } from 'vue-router'
import RobotApi from '@/api/robot.js'
import { useRobotStore } from '@/stores/useRobotStore.js'
import RobotStatus from '@/constant/robotStatus.js'
import RecordApi from '@/api/record.js'

let timer = null

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, TitleComponent, DataZoomComponent])
const router = useRouter()
const systemInfo = ref({})
const robotData = ref([])
const selectedRobotInfo = ref({})
const robotStore = useRobotStore()
const dayStatsInfo = ref({})
const messageStatsInfo = ref({})

//图表
const chartOption = computed(() => {
  const xdata = dayStatsInfo.value.date ? dayStatsInfo.value.date : ['01', '02', '03', '04', '05', '06', '07']
  const ydata = dayStatsInfo.value.value ? dayStatsInfo.value.value : [100, 200, 300, 300, 200, 100, 100]
  return {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '0%',
      right: '0%',
      bottom: '3%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xdata,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: 'transparent'
        }
      }
    },
    series: [
      {
        name: '消息数量',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 2,
          color: '#007EFC'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#007EFC'
            },
            {
              offset: 1,
              color: 'rgba(0, 126, 252, 0.1)'
            }
          ])
        },
        data: ydata
      }
    ]
  }
})

const getRobotStatus = computed(() => {
  return (key) => {
    const status = robotStore.robotStatus[key]
    return RobotStatus.valueMap(status)
  }
})

const onListRobot = () => {
  RobotApi.list().then((res) => {
    if (res.code === 0) {
      robotData.value = res.data
      if (res.data.length > 0) {
        selectedRobotInfo.value = robotData.value[0]
      }
    }
  })
}

const onGet7DayStats = (item) => {
  RecordApi.get7DayStats(item.id).then((res) => {
    if (res.code === 0) {
      dayStatsInfo.value = res.data
    }
  })
}

const onGetMessageStats = () => {
  RecordApi.getMessageStats().then((res) => {
    if (res.code === 0) {
      messageStatsInfo.value = res.data
    }
  })
}

watch(
  () => selectedRobotInfo.value,
  () => {
    onGet7DayStats(selectedRobotInfo.value)
  }
)

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handlerGetSystemInfo = async () => {
  systemInfo.value = await invoke('get_system_info')
}

onBeforeMount(() => {
  handlerGetSystemInfo()
})

onMounted(() => {
  timer = setInterval(() => {
    handlerGetSystemInfo()
  }, 1500)
  onListRobot()
  onGetMessageStats()
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>
<style scoped lang="scss">
.dashboard-container {
  height: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 10px 20px;

  .dash-title {
    .dash-title__h1 {
      font-size: 26px;
      font-weight: 500;
      letter-spacing: 1px;
      user-select: none;
    }

    .dash-title__h2 {
      font-size: 16px;
      letter-spacing: 1px;
      user-select: none;
      color: var(--minor-text-color);
    }
  }

  .dash-message {
    gap: 20px;
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4;

    .dash-message__card {
      background-color: var(--nav-bg);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      border-radius: 8px;
      padding: 20px;

      .dash-message__card--wrapper {
        display: flex;
        justify-content: space-between;

        .dash-message__card--title {
          font-size: 14px;
          color: var(--minor-text-color);
        }

        .dash-message__card--num {
          font-size: 20px;
          font-weight: 500;
        }
      }

      .dash-message__card--index {
        color: rgb(34, 197, 94);
        display: flex;
        align-items: center;
        gap: 4px;

        &.error {
          color: var(--error-color);
        }
      }

      .dash-message__bottom--wrapper {
        display: flex;
        align-items: center;
        font-size: 14px;
        margin-top: 12px;
        gap: 10px;
        height: 24px;
      }
    }
  }

  .dash-system {
    @apply grid grid-cols-1 lg:grid-cols-3 gap-6;
    .dash-system__card {
      background-color: var(--nav-bg);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      border-radius: 8px;
      padding: 20px;

      .dash-system__title {
        margin-left: 8px;
        font-size: 18px;
      }

      .dash-system__num {
        font-size: 24px;
        color: rgb(var(--primary-color));
      }

      .dash-system__progress {
        margin-top: 14px;
      }

      .dash-system__bottom-info {
        margin-top: 5px;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        color: var(--minor-text-color);
      }
    }
  }

  .dash-info {
    @apply grid grid-cols-1 lg:grid-cols-3 gap-6;
    height: 100%;

    .dash-info__robot-list {
      @apply lg:col-span-1;
      padding: 20px;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      border-radius: 8px;
      background-color: var(--nav-bg);
      display: flex;
      flex-direction: column;
      gap: 10px;

      .dash-info__list-card {
        height: 52px;
        background-color: var(--card-bg);
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        cursor: pointer;

        .dash-info__card-avatar {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          background-color: #fff;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        &.active {
          background-color: rgba(var(--primary-color), 0.1);
        }

        &:not(.active):hover {
          background-color: rgba(var(--primary-color), 0.05);
        }
      }
    }

    .dash-info__robot-details {
      @apply lg:col-span-2;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      border-radius: 8px;
      background-color: var(--nav-bg);
      display: flex;
      flex-direction: column;

      .dash-info__details-info {
        padding: 10px 20px;
        display: flex;
        border-bottom: 1px var(--card-bg) solid;

        .dash-info__details--avatar {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          background-color: #fff;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .dash-info__details-chart {
        padding: 20px 20px;
        display: flex;
        flex-direction: column;
      }
    }
  }
}
</style>
