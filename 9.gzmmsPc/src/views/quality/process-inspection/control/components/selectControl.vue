<script setup lang="ts">
const emits = defineEmits(["target"]);

const formData = ref({
  checkNum: 2,
  waterRelated: 1,
});

function handleAddTarget(brand: string) {
  let data = {
    ...formData.value,
    brand,
  };
  emits("target", data);
}
</script>
<template>
  <div class="select-wrapper">
    <el-form
      :model="formData"
      ref="formRef"
      label-position="right"
      label-width="180"
      :inline="false"
    >
      <el-form-item label="检测次数">
        <el-radio-group v-model="formData.checkNum" class="mt-[-4px]">
          <el-radio :label="2" size="large">两次</el-radio>
          <el-radio :label="1" size="large">一次</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="水温/环境湿度/环境卫生">
        <el-radio-group v-model="formData.waterRelated" class="mt-[-4px]">
          <el-radio :label="1" size="large">检测</el-radio>
          <el-radio :label="0" size="large">不检测</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div class="flex justify-center">
      <el-button type="primary" style="height: 80px" @click="handleAddTarget('ND1')">
        红牛工序检验
      </el-button>
      <el-button type="primary" style="height: 80px" @click="handleAddTarget('ND2')">
        战马工序检验
      </el-button>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
