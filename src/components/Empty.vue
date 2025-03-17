<template>
  <div class="empty-container">
    <div class="empty-icon">
      <slot name="icon"></slot>
    </div>
    <div class="empty-title">{{ props.title }}</div>
    <div class="empty-content">{{ props.content }}</div>
    <n-button v-if="props.operateText" type="primary" dashed class="empty-operate-text" @click="emits('onOk')">
      {{ props.operateText }}
    </n-button>
  </div>
</template>
<script setup>
const props = defineProps({
  title: String,
  content: String,
  operateText: String
})

const emits = defineEmits(['onOk'])
</script>
<style lang="scss" scoped>
.empty-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px 20px;
  background-color: var(--nav-bg);
  border-radius: 8px;
  gap: 5px;
  color: var(--primary-text-color);

  .empty-icon {
    height: 80px;
    width: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
    border-radius: 80px;
    background-color: var(--card-bg);
    color: var(--minor-text-color);
    margin-bottom: 20px;
  }

  .empty-title {
    font-size: 18px;
  }

  .empty-content {
    color: var(--minor-text-color);
    text-align: center;
  }

  .empty-operate-text {
    margin-top: 20px;
    font-weight: 600;
  }
}
</style>
