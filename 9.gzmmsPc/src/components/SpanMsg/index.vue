<script setup lang="ts">
const porps = defineProps({
  title: {
    type: String,
    default: "查看审批日志",
  },
  msg: {
    type: String,
    default: "",
  },
});
</script>
<template>
  <span :title="title">{{ msg }}</span>
</template>
<style lang="scss" scoped></style>
