<script setup lang="tsx">
import { getWorkOrderDetailsApi } from "@/api/device/common/index";

const props = defineProps({
  id: {
    type: Number,
    default: 0,
  },
});

const tableData = ref([]);
const tableLoading = ref(false);

const getData = async () => {
  tableLoading.value = true;
  const result = await getWorkOrderDetailsApi({ id: props.id });
  tableData.value = result.data;
  console.log("🚀 ~ getData ~ tableData.value:", tableData.value);
  tableLoading.value = false;
};

watch(
  () => props.id,
  () => {
    getData();
  },
  {
    immediate: true,
  },
);

const columns: TableColumnList = [
  {
    label: "项目标准名称",
    prop: "name",
  },
  {
    label: "保养部位",
    prop: "maintenance_area",
  },
  {
    label: "保养要求/标准",
    prop: "maintenance_requirements",
  },
  {
    label: "是否保养",
    prop: "is_maintain",
    cellRenderer: ({ row }) => {
      return row.is_maintain === 1 ? "已保养" : "未保养";
    },
  },
  {
    label: "备注",
    prop: "note",
  },
];
</script>
<template>
  <div class="container">
    <pure-table
      ref="prueTableRef"
      :data="tableData"
      :columns="columns"
      header-cell-class-name="table-gray-header"
      :loading="tableLoading"
    ></pure-table>
  </div>
</template>
<style lang="scss" scoped></style>
