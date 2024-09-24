<template>
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
    style="width: 100%"
    :disabled="disable"
    ref="cascaderRef"
    @change="cascaderChange"
  />
  <!-- :disabled="disable" -->
  <!-- @change="$emit('update:modelValue', value)" -->
</template>

<script setup lang="ts">
const props = defineProps([
  "modelValue",
  "departmentList",
  "multiple",
  "maxCollapseTags",
  "disable",
]);

const inputValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const cascaderRef = ref();

function cascaderChange(val: any) {
  const selectedNodes = cascaderRef.value.getCheckedNodes();
  let deptName = selectedNodes[0]?.pathLabels[0];
  emit("change", { name: deptName });
}

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
</script>

<style scoped lang="scss"></style>
