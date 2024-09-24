<script setup lang="ts">
import { ElSelect } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import type { ISupItem } from "@/api/common/types";

const locale = ref(zhCn);
interface Props {
  info: any;
  sup_list: ISupItem[];
  selectLoading: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  info: () => ({}) as any,
  sup_list: () => [] as ISupItem[],
  selectLoading: false,
});

const emit = defineEmits(["visibleChange", "blur"]);

const selectRef = ref<typeof ElSelect>();

// 选择供应商 触发事件
const supChange = (index: number, row: any) => {
  let item = props.sup_list[index];
  row.sup_name = item.name;
  if (row.hasOwnProperty("supplier_id")) {
    row.supplier_id = item.id;
  } else {
    row.sup_id = item.id;
  }
};

const visibleChange = (val: Boolean) => {
  emit("visibleChange", val);
};
const blur = () => {
  emit("blur");
};

nextTick(() => {
  selectRef.value?.focus();
});
</script>
<template>
  <el-config-provider :locale="locale">
    <el-select
      v-model.lazy="info.sup_name"
      :placeholder="!info.title ? '请先选择名称' : '请选择供应商'"
      filterable
      default-first-option
      @visible-change="visibleChange($event)"
      @change="supChange($event, info)"
      :disabled="!info.title"
      :loading="selectLoading"
      ref="selectRef"
      @blur="blur"
    >
      <el-option
        v-for="(item, index) in sup_list"
        :key="item.id"
        :label="item.name"
        :value="index"
        :disabled="item.disable"
      ></el-option>
    </el-select>
  </el-config-provider>
</template>
<style lang="scss" scoped></style>
