<script setup lang="ts">
import type { TableInstance } from "element-plus";
import type { uniqueLabelListType } from "@/api/common/types";

interface Props {
  data: uniqueLabelListType[];
  hideSelect?: boolean;
}

type SelectListType = {
  id?: number;
  unique_code: string;
};

const props = withDefaults(defineProps<Props>(), { data: () => [], hideSelect: false });

const pureTableRef = ref();
const tableRef = computed<TableInstance>(() => {
  return pureTableRef.value?.getTableRef();
});

const uniqueCodeList = ref<SelectListType[]>([]);

/** 表格勾选触发事件 */
function changeSelect(selection: uniqueLabelListType[]) {
  uniqueCodeList.value = selection.map((item) => {
    let { id } = item;
    let obj = {
      unique_code: item.code,
    };
    return id ? { id, ...obj } : obj;
  });
}

defineExpose({
  uniqueCodeList,
});

watch(
  () => props.data,
  (newValue) => {
    nextTick(() => {
      newValue.forEach((row) => {
        if (row.select_status) {
          tableRef.value?.toggleRowSelection(row, true);
        }
      });
    });
  },
  {
    immediate: true,
  },
);

const columns: TableColumnList = [
  {
    width: 50,
    label: "勾选列",
    type: "selection",
    hide: () => props.hideSelect,
  },
  {
    label: "标签标识ID",
    prop: "code",
  },
];
</script>
<template>
  <div>
    <pure-table
      ref="pureTableRef"
      border
      :columns="columns"
      :data="data"
      height="600"
      @selection-change="changeSelect"
    ></pure-table>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/common.scss";
</style>
