<template>
  <div class="icon-button" :class="[props.type, props.class]" :style="props.style">
    <slot></slot>
  </div>
</template>
<script setup>
const props = defineProps({
  class: String,
  style: Object,
  type: String
})
</script>
<style scoped lang="scss">
.icon-button {
  width: 26px;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-size: 26px;
  cursor: pointer;

  &:hover {
    background-color: rgba(var(--primary-color));
  }

  &.minor {
    &:hover {
      color: #000;
      background-color: #f3f5fe;
    }
  }

  &.theme {
    &:hover {
      color: rgba(var(--primary-color));
      background-color: var(--card-bg);
    }
  }

  &.theme-error {
    &:hover {
      background-color: var(--card-bg);
      color: var(--error-color);
    }
  }

  &.error {
    color: var(--primary-text-color);

    &:hover {
      color: #fff;
      background-color: var(--error-color);
    }
  }
}
</style>