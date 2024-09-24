<script setup lang="ts">
interface Props {
  versionList?: any;
  versionId?: number;
}
const emit = defineEmits(["versionChange"]);

const props = withDefaults(defineProps<Props>(), {
  versionList: [],
});
/** add表单验证规则 */
const formRules = {
  version_id: [
    {
      required: true,
      message: "请选择版本号",
    },
  ],
};
const version_id = ref();
watch(
  () => props.versionId,
  (newValue) => {
    version_id.value = newValue;
  },
  {
    immediate: true,
    deep: true,
  },
)
</script>
<template>
  <el-form :model="{version_id}">
    <el-form-item prop="version_id" :rules="formRules.version_id" label="版本号">
      <el-select v-model="version_id" placeholder="请选择" filterable @change="emit('versionChange', version_id)">
        <el-option v-for="item in versionList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
  </el-form>
</template>
<style lang="scss" scoped></style>
