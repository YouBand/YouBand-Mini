<template>
  <div class="message" :class="{ right: props.right }">
    <div class="message-content">{{ props.message }}</div>
  </div>
</template>
<script setup>
const props = defineProps({
  right: Boolean,
  message: Object
})
</script>
<style scoped lang="scss">
.message {
  display: flex;
  width: 100%;
  font-size: 14px;

  &.right {
    justify-content: end;
  }

  .message-content {
    background-color: var(--card-bg);
    max-width: 80%;
    padding: 10px;
    border-radius: 8px;
    word-break: break-word;
  }
}
</style>
