<script setup lang="ts">
interface Props {
  msg?: string;
  title?: string;
}

withDefaults(defineProps<Props>(), { msg: "暂无数据", title: "详情" });
defineEmits(["back"]);
</script>
<template>
  <el-card shadow="always" class="card-auto" body-style="height: 100%">
    <span class="header-title">{{ title }}</span>
    <el-empty :description="msg"></el-empty>
    <el-button
      class="w-[140px] absolute bottom-14"
      type="primary"
      plain
      @click="$emit('back')"
      size="large"
    >
      返回
    </el-button>
  </el-card>
</template>
<style lang="scss" scoped></style>
