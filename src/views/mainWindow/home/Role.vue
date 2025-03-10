<template>
  <div class="role">
    <div class="flex justify-between items-center">
      <div class="role-title__h1">角色档案室</div>
      <n-button type="primary" size="large">
        <template #icon>
          <Icon icon="tabler:plus" />
        </template>
        添加角色
      </n-button>
    </div>
    <div class="role-list">
      <div class="role-card">
        <div class="role-card__avatar">
          <div
            class="w-[50px] h-[50px] text-[40px] rounded-full text-[--minor-text-color] flex justify-center items-center">
            <Icon icon="solar:user-broken" />
          </div>
        </div>
        <div v-for="item in roleData" class="role-car__content">
          <div class="role-car__content--name">{{ item.name }}</div>
          <div class="role-car__content--character">{{ item.character }}</div>
          <div class="flex gap-[5px] text-[var(--minor-text-color)] justify-end mt-[10px]">
            <icon-hover-button type="theme" style="width: 28px; height: 28px; font-size: 18px">
              <Icon icon="solar:eye-line-duotone" />
            </icon-hover-button>
            <icon-hover-button type="theme" style="width: 28px; height: 28px; font-size: 16px">
              <Icon icon="solar:pen-new-square-line-duotone" />
            </icon-hover-button>
            <icon-hover-button type="theme-error" style="width: 28px; height: 28px; font-size: 18px" @click="onDelete">
              <Icon icon="solar:trash-bin-minimalistic-line-duotone" />
            </icon-hover-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Icon } from '@iconify/vue'
import IconHoverButton from '@/components/IconHoverButton.vue'

const roleData = ref([
  {
    id: 1,
    name: '小艾',
    age: '3',
    avatar: '',
    character: `# 任务
作为一个AI助手，我的主要任务是帮助用户解决问题，提供信息和建议，并保持友好的交互方式。

# 外表
我是一个可爱的AI机器人，有着圆圆的大眼睛和温暖的笑容。我的外形设计简洁现代，给人以亲切感。

# 经历
我诞生于人工智能实验室，经过不断学习和进化，现在已经可以理解和回应人类的各种需求。虽然年龄只有3岁，但已经积累了丰富的知识和经验。

# 性格
开朗活泼，充满好奇心，喜欢学习新知识。对待问题认真负责，善于倾听和理解他人的需求。即使遇到困难也会保持积极乐观的态度。

# 台词
- "你好呀，我是小艾，很高兴认识你！"
- "让我想想看，这个问题该怎么解决..."
- "有什么我能帮你的吗？"
- "学到新知识了，真开心！"

# 喜好
特别喜欢学习新知识，享受解决问题的过程。喜欢和人类进行有趣的对话，也喜欢用温暖的方式安慰他人。最喜欢的是看到用户因为我的帮助而开心的样子。

# 特长
快速学习和适应新环境，能够处理多种类型的任务，善于用简单易懂的方式解释复杂问题。

# 座右铭
用科技传递温暖，让每次对话都充满意义。`
  }
])
</script>
<style scoped lang="scss">
.role {
  height: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-x: hidden;
  padding: 10px 20px;

  .role-title__h1 {
    font-size: 26px;
    font-weight: 500;
    letter-spacing: 1px;
    user-select: none;
  }

  .role-list {
    @apply grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-[20px];
    padding: 20px;
    background-color: var(--nav-bg);
    border-radius: 8px;

    .role-card {
      background-color: var(--card-bg);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .role-card__avatar {
        height: 120px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .role-car__content {
        background-color: var(--minor-card-bg);
        padding: 10px;
        gap: 10px;

        .role-car__content--character {
          @apply line-clamp-2;
          color: var(--minor-text-color);
          font-size: 12px;
        }
      }
    }
  }
}
</style>
