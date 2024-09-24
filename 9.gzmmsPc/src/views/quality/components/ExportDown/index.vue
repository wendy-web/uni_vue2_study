<script setup lang="ts">
const emit = defineEmits(["handleCommand"]);

function clickCommand(command: number) {
  emit("handleCommand", command);
}
</script>
<template>
  <el-dropdown trigger="click" @command="clickCommand" class="ml-4">
    <el-button type="primary">
      导出数据
      <el-icon class="el-icon--right"><i-ep-arrow-down></i-ep-arrow-down></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :command="1">导出选中数据</el-dropdown-item>
        <el-dropdown-item :command="2">导出列表数据</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<style lang="scss" scoped></style>
