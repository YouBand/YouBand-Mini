<template>
  <div class="model-container">
    <div class="model-title__h1">大模型智库</div>
    <div class="flex gap-[20px] flex-1 overflow-hidden items-start">
      <div class="model-list">
        <div class="text-[18px]">已添加的模型</div>
        <div v-for="item in modelData" class="model-list__card flex-col lg:flex-row">
          <div class="flex gap-[10px] items-center">
            <div class="model-list__card--avatar"></div>
            <div class="flex flex-col justify-between">
              <div class="text-[16px] mb-[2px] line-clamp-1">{{ item.name }}</div>
              <div>
                <n-tag size="small" type="primary">{{ item.type }}</n-tag>
              </div>
            </div>
          </div>
          <div class="flex gap-[5px] text-[var(--minor-text-color)] justify-end w-full lg:w-auto">
            <icon-hover-button type="theme" style="width: 28px; height: 28px; font-size: 18px">
              <Icon icon="solar:eye-line-duotone" />
            </icon-hover-button>
            <icon-hover-button type="theme" style="width: 28px; height: 28px; font-size: 16px">
              <Icon icon="solar:pen-new-square-line-duotone" />
            </icon-hover-button>
            <icon-hover-button type="theme-error" style="width: 28px; height: 28px; font-size: 18px" @click="">
              <Icon icon="solar:trash-bin-minimalistic-line-duotone" />
            </icon-hover-button>
          </div>
        </div>
      </div>
      <div class="model-manu-list">
        <div class="text-[18px]">可添加的模型</div>
        <div v-for="item in modelManuData" class="model-manu-list__card">
          <div class="flex items-center gap-[5px] overflow-x-hidden">
            <div class="model-manu-list__card--avatar"></div>
            <div class="model-manu-list__card--name truncate max-w-[100px] overflow-hidden">
              {{ item.name }}
            </div>
          </div>
          <Icon icon="tabler:plus" class="model-manu-list__card--icon" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import IconHoverButton from '@/components/IconHoverButton.vue'
import { Icon } from '@iconify/vue'

const modelData = [
  {
    avatar: '',
    name: '我的Tongyi-Qianwen',
    type: 'Qianwen'
  },
  {
    avatar: '',
    name: '我的Tongyi-Qianwen',
    type: 'Qianwen'
  },
  {
    avatar: '',
    name: '我的Tongyi-Qianwen',
    type: 'Qianwen'
  },
  {
    avatar: '',
    name: '我的Tongyi-Qianwen',
    type: 'Qianwen'
  },
  {
    avatar: '',
    name: '我的Tongyi-Qianwen',
    type: 'Qianwen'
  },
  {
    avatar: '',
    name: '我的Tongyi-Qianwen',
    type: 'Qianwen'
  },
  {
    avatar: '',
    name: '我的Tongyi-Qianwen',
    type: 'Qianwen'
  },
  {
    avatar: '',
    name: '我的Tongyi-Qianwen',
    type: 'Qianwen'
  },
  {
    avatar: '',
    name: '我的Tongyi-Qianwen',
    type: 'Qianwen'
  },
  {
    avatar: '',
    name: '我的Tongyi-Qianwen',
    type: 'Qianwen'
  },
  {
    avatar: '',
    name: '我的Tongyi-Qianwen',
    type: 'Qianwen'
  },
  {
    avatar: '',
    name: '我的Tongyi-Qianwen',
    type: 'Qianwen'
  },
  {
    avatar: '',
    name: '我的Tongyi-Qianwen',
    type: 'Qianwen'
  },
  {
    avatar: '',
    name: '我的Tongyi-Qianwen',
    type: 'Qianwen'
  }
]

const modelManuData = [
  {
    avatar: '',
    name: 'Qianwen',
    type: 'qingwen'
  },
  {
    avatar: '',
    name: 'Qianwen',
    type: 'qingwen'
  },
  {
    avatar: '',
    name: 'Qianwen',
    type: 'qingwen'
  },
  {
    avatar: '',
    name: 'Qianwen',
    type: 'qingwen'
  },
  {
    avatar: '',
    name: 'Qianwen',
    type: 'qingwen'
  },
  {
    avatar: '',
    name: 'Qianwen',
    type: 'qingwen'
  },
  {
    avatar: '',
    name: 'Qianwen',
    type: 'qingwen'
  },
  {
    avatar: '',
    name: 'Qianwen',
    type: 'qingwen'
  },
  {
    avatar: '',
    name: 'Qianwen',
    type: 'qingwen'
  },
  {
    avatar: '',
    name: 'Qianwen',
    type: 'qingwen'
  },
  {
    avatar: '',
    name: 'Qianwen',
    type: 'qingwen'
  },
  {
    avatar: '',
    name: 'Qianwen',
    type: 'qingwen'
  },
  {
    avatar: '',
    name: 'Qianwen',
    type: 'qingwen'
  },
  {
    avatar: '',
    name: 'Qianwen',
    type: 'qingwen'
  },
  {
    avatar: '',
    name: 'Qianwen',
    type: 'qingwen'
  },
  {
    avatar: '',
    name: 'Qianwen',
    type: 'qingwen'
  },
  {
    avatar: '',
    name: 'Qianwen',
    type: 'qingwen'
  }
]
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
        background-color: rgba(var(--primary-color), 0.1);
        border-radius: 8px;
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
        background-color: rgba(var(--primary-color), 0.1);
        border-radius: 8px;
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
