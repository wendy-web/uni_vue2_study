<script setup lang="ts">
import type { CascaderValue } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";

const locale = ref(zhCn);
const props = defineProps(["modelValue", "departmentList", "multiple", "maxCollapseTags", "info"]);

const inputValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const emit = defineEmits(["update:modelValue", "change", "blur"]);

// 部门级联选择器的配置
const selectProps = {
  // 显示方式
  expandTrigger: "hover" as const,
  emitPath: false,
  value: "id",
  label: "name",
  children: "_children",
  checkStrictly: true,
  multiple: props.multiple ? true : false,
};

const deptChange = (val: CascaderValue) => {
  console.log("888888888888888888");
  emit("change", val);
};
const blur = () => {
  console.log("w999999 ");
  emit("blur");
};
</script>

<template>
  <el-config-provider :locale="locale">
    <el-cascader
      v-model="inputValue"
      :options="departmentList"
      :props="selectProps"
      :show-all-levels="false"
      clearable
      filterable
      collapse-tags
      collapse-tags-tooltip
      :maxCollapseTags="props.maxCollapseTags ? props.maxCollapseTags : 1"
      @change="deptChange"
      @blur="blur"
      style="width: 100%"
    />
  </el-config-provider>
</template>

<style scoped lang="scss"></style>
