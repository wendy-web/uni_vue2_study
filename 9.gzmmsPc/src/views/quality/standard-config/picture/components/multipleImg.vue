<script setup lang="ts">
const props = defineProps({
  topImg: { type: String, default: "" },
  bottomImg: { type: String, default: "" },
  canbodyImg: { type: String, default: "" },
});

const emit = defineEmits(["setImg"]);

const srcList = computed(() => {
  return [props.topImg, props.bottomImg, props.canbodyImg];
});

function setImg() {
  emit("setImg");
}
</script>
<template>
  <div class="h-full">
    <div class="flex items-center mb-2">
      <el-button type="primary" @click="setImg" v-hasPerm="['sc:picture:add']">设置图片</el-button>
      <!-- <p class="font-bold ml-2">标签标识图片</p> -->
    </div>
    <el-row :gutter="20" class="h-[40%]">
      <el-col :span="12" class="h-full">
        <span class="font-bold text-[14px]">顶盖图片</span>
        <el-image
          class="!block w-[80%] h-[94%] mt-2"
          :src="topImg"
          v-if="topImg"
          :preview-src-list="srcList"
          :initial-index="0"
          fit="none"
        ></el-image>
        <el-empty description="未设置图片,请您先设置图片" class="mt-10" v-else />
      </el-col>
      <el-col :span="12" class="h-full">
        <span class="font-bold text-[14px]">尾盖图片</span>
        <el-image
          class="!block w-[80%] h-[94%] mt-2"
          :src="bottomImg"
          v-if="bottomImg"
          :preview-src-list="srcList"
          :initial-index="1"
          fit="none"
        ></el-image>
        <el-empty description="未设置图片,请您先设置图片" class="mt-10" v-else />
      </el-col>
    </el-row>
    <div class="h-[50%] mt-10">
      <span class="font-bold text-[14px]">罐身图片</span>
      <el-image
        class="!block w-[80%] h-[94%]"
        :src="canbodyImg"
        v-if="canbodyImg"
        :preview-src-list="srcList"
        :initial-index="2"
        fit="none"
      ></el-image>
      <el-empty description="未设置图片,请您先设置图片" class="mt-10" v-else />
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
