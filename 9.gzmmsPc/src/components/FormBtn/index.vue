<script setup lang="ts">
import { Refresh, Search } from "@element-plus/icons-vue";

const emit = defineEmits(["search", "reset"]);
function handleSearch() {
  emit("search");
}
function handleReset() {
  emit("reset");
}
</script>
<template>
  <div class="flex">
    <el-button type="primary" :icon="Search" @click="handleSearch" v-deBounce>搜索</el-button>
    <el-button :icon="Refresh" @click="handleReset">重置</el-button>
    <slot name="fold"></slot>
  </div>
</template>
<style lang="scss" scoped></style>
