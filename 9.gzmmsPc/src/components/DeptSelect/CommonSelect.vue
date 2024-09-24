<script setup lang="ts">
/* 通用的 普通select选择器 */
import type { ICateItem } from "@/api/common/types";

export interface Props {
  /** 提示文字,默认 请选择 */
  placeHint?: string;
  /** 列表数据,必传 */
  list: ICateItem[];
  /** 是否多选,默认false */
  multiple?: boolean;
  /** 是否设置为警告文字样式,默认false */
  isWarning?: boolean;
  /** 是否禁止选择,默认false */
  disabled?: boolean;
  /** 是否可以清除,默认false */
  clearable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeHint: "请选择",
  list: () => [],
  multiple: false,
  isWarning: false,
  disabled: false,
  clearable: false,
});
const emit = defineEmits(["change"]);
const model = defineModel({ required: true, default: undefined });
//
function onChange(val: unknown) {
  emit("change", val);
}
</script>
<template>
  <!-- 外层不加div,深度选择器不生效 -->
  <div  style="width: 100%">
    <el-select
      v-model="model"
      :placeholder="placeHint"
      filterable
      ref="lineSelectRef"
      style="width: 100%"
      :multiple="multiple"
      :multiple-limit="5"
      :class="[isWarning ? 'warning-text' : '']"
      :disabled="disabled"
      @change="onChange"
      :clearable="clearable"
    >
      <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/warning-input.scss";
</style>
