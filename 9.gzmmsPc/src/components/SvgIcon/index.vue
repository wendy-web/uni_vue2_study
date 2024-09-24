<template>
  
  <svg aria-hidden="true" class="svg-icon" :style="'width:' + size + ';height:' + size">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
/* 其他页面使用 组件方式: <svg-icon icon-class="add_personnel"></svg-icon> */
import { computed } from "vue";

const props = defineProps({
  prefix: {
    type: String,
    default: "icon",
  },
  iconClass: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "1em",
  },
});

const symbolId = computed(() => `#${props.prefix}-${props.iconClass}`);
</script>

<style scoped>
.svg-icon {
  /* width: 1em;
  height: 1em;
  vertical-align: -0.15em; */
  overflow: hidden;
  fill: currentColor;
}
</style>
