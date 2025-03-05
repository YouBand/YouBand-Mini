<template>
  <div class="icon-button" :class="[props.class, props.type]" :style="props.style">
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

  &:hover {
    background-color: rgba(var(--primary-color));
  }

  &.minor {
    &:hover {
      color: #000;
      background-color: #f3f5fe;
    }
  }

  &.error {
    &:hover {
      color: #fff;
      background-color: var(--error-color);
    }
  }
}
</style>
