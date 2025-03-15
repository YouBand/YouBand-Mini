<template>
  <div class="label-container" :class="containerClass" :style="containerStyle">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  class: String,
  style: Object,
  type: String,
  size: {
    type: String,
    default: '40px'
  },
  fontSize: {
    type: String,
    default: '14px'
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'blue', 'purple', 'green', 'red', 'yellow'].includes(value) // 颜色验证
  }
})

const colorClassMap = {
  primary: {
    bg: 'bg-[rgba(var(--primary-color),0.1)]',
    text: 'text-[rgb(var(--primary-color))]'
  },
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-500'
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-500'
  },
  green: {
    bg: 'bg-green-500/10',
    text: 'text-green-500'
  },
  red: {
    bg: 'bg-red-500/10',
    text: 'text-red-500'
  },
  yellow: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-500'
  }
}

const containerClass = computed(() => {
  const colorClasses = colorClassMap[props.color] || {}
  return [props.class, colorClasses.bg, colorClasses.text]
})

const containerStyle = computed(() => ({
  width: props.size,
  height: props.size,
  fontSize: props.fontSize,
  ...props.style
}))
</script>

<style scoped lang="scss">
.label-container {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  user-select: none;
}
</style>
