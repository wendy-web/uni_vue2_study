<script setup lang="ts">
const props = defineProps({
  imgUrl: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["setImg"]);

function setImg() {
  emit("setImg");
}
</script>
<template>
  <div class="h-full">
    <div class="flex items-center">
      <el-button type="primary" @click="setImg" v-hasPerm="['sc:picture:add']">设置图片</el-button>
      <p class="font-bold ml-2">纸皮图片</p>
    </div>
    <el-image
      class="!block w-[80%] h-[100%] mt-2"
      :src="imgUrl"
      v-if="imgUrl"
      fit="contain"
    ></el-image>
    <el-empty description="该类型还未设置图片,请您先设置图片" class="mt-10" v-else />
  </div>
</template>
<style lang="scss" scoped></style>
