<script setup lang="ts">
/* 本组件是选择人员列表数组 */
import type { ICateItem } from "@/api/common/types";

export interface Props {
  placeHint?: string;
  list: ICateItem[];
  /** 是否多选 */
  multiple?: boolean;
  multipleLimit?: number;
  ids?: number[];
  /** value是否为item,默认是,否则返回id */
  valueKey?: boolean;
  /** 是否禁止选择 */
  disabled?: boolean;
}

const emit = defineEmits(["change"]);
const props = withDefaults(defineProps<Props>(), {
  placeHint: "请选择",
  list: () => [],
  multiple: false,
  multipleLimit: 5,
  ids: () => [],
  valueKey: true,
  disabled: false,
});
const model = defineModel({ required: true, default: undefined });

function checkDisable(id: number) {
  return props.ids.includes(id);
}

function selectChange(value: any[] | number) {
  if (typeof value === "number") return;
  let valueList = value.map((item) => ({
    id: item.id,
    name: item.name,
  }));
  emit("change", valueList);
}

// watch(
//   () => props.ids,
//   (newVal) => {
//     idList.value = newVal;
//   },
// );
</script>
<template>
  <el-select
    v-model="model"
    :placeholder="placeHint"
    filterable
    ref="userSelectRef"
    style="width: 100%"
    value-key="id"
    :multiple="multiple"
    :multiple-limit="multipleLimit"
    @change="selectChange"
    :disabled="disabled"
  >
    <el-option
      v-for="item in list"
      :key="item.id"
      :label="item.name"
      :value="valueKey ? item : item.id"
      :disabled="checkDisable(item.id)"
    />
  </el-select>
</template>
<style lang="scss" scoped></style>
