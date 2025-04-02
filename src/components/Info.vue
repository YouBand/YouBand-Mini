<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <Icon class="icon" icon="solar:question-circle-linear" />
    </template>
    <div>
      <slot></slot>
    </div>
  </n-tooltip>
</template>
<script setup>
import { Icon } from '@iconify/vue'
</script>
<style scoped lang="scss">
.icon {
  outline: none;
  color: rgba(var(--primary-color));
  display: inline-block;
  font-size: 16px;
  margin-left: 5px;
}
</style>
