<script setup lang="ts">
/* 使用位置选择组件 */
import type { CascaderValue } from "element-plus";

export interface Props {
  placeHint?: string;
  multiple?: boolean;
  placeList: any[];
}

const cascaderRef = ref();

const props = withDefaults(defineProps<Props>(), {
  placeHint: "请选择使用位置",
  placeList: () => [],
});

const emit = defineEmits(["change"]);

const placeValue = defineModel({ required: true, default: undefined });

function handleChange(value: CascaderValue) {
  let nodeList = cascaderRef.value.getCheckedNodes() || [];
  let ids = nodeList[0]?.pathValues.join(",");

  emit("change", ids);
}

// 地点级联选择器的配置
const selectProps = {
  // 显示方式
  expandTrigger: "hover" as const,
  emitPath: false,
  value: "id",
  label: "place_name",
  children: "children",
  multiple: props.multiple ? true : false,
};
</script>
<template>
  <el-cascader
    ref="cascaderRef"
    :placeholder="placeHint"
    v-model="placeValue"
    :options="placeList"
    :props="selectProps"
    clearable
    filterable
    style="width: 100%"
    @change="handleChange"
  />
</template>
<style lang="scss" scoped></style>
