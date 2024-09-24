<template>
  <div class="mb-[20px] absolute top-[100px] left-[20px]">
    <span class="block font-bold text-[14px] mb-[10px]">流程设置</span>
    <div class="text-[12px] text-gray-500">
      <span>点击</span>
      <span class="add-btn"><i-ep-plus /></span>
      <span>按钮,</span>
      <span>添加审核人</span>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.add-btn {
  display: inline-block;
  width: 30px;
  height: 30px;
  background: #3296fa;
  border-radius: 50%;
  color: #fff;
  line-height: 30px;
  text-align: center;
  margin: 0 4px;
}
</style>
