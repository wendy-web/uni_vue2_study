<script setup lang="ts">
/* 此组件-红牛成品检验和战马成品检验都使用 */

interface Props {
  /** 详情表格数据 */
  list: TableType[];
  /** 产品类型列表 */
  skuList: OptionType[];
}

type TableType = {
  check_detail_id: number;
  batch_no: string;
  batch_number: string;
  check_res: number;
  line: string;
  sku: string;
  is_send: number;
};

const props = defineProps<Props>();

const tableData = ref<TableType[]>([]);

function hanleRemove(row: TableType) {
  console.log("🚀 ~ hanleRemove ~ row:", row);
  tableData.value = tableData.value.filter((item) => item.check_detail_id !== row.check_detail_id);
}

defineExpose({
  tableData,
});

watch(
  () => props.list,
  (val) => {
    tableData.value = val;
  },
  {
    immediate: true,
  },
);

const columns: TableColumnList = [
  {
    label: "操作",
    slot: "operation",
    width: 80,
  },
  {
    label: "#",
    type: "index",
    width: 60,
  },
  {
    label: "批次",
    prop: "batch_no",
    align: "center",
  },
  {
    label: "批号",
    prop: "batch_number",
    align: "center",
  },
  {
    label: "检验结果",
    prop: "check_res",
    align: "center",
    cellRenderer: ({ row }) => {
      return row.check_res === 1 ? "合格" : "不合格";
    },
  },
  {
    label: "线别",
    prop: "line",
    align: "center",
  },
  {
    label: "产品类型",
    prop: "sku",
    align: "center",
    cellRenderer: ({ row }) => {
      return props.skuList?.find((el) => el.value === row.sku)?.label || "";
    },
  },
  {
    label: "是否发货",
    prop: "is_send",
    align: "center",
    cellRenderer: ({ row }) => {
      return row.is_send === 1 ? "是" : "否";
    },
  },
  //   {
  //     label: "检验日期",
  //     prop: "check_date",
  //     align: "center",
  //   },
];
</script>
<template>
  <div class="container">
    <pure-table
      ref="prueTableRef"
      row-key="check_detail_id"
      :data="tableData"
      :columns="columns"
      header-cell-class-name="table-gray-header"
      height="600"
    >
      <template #operation="{ row }">
        <el-button type="primary" link @click="hanleRemove(row)">移除</el-button>
      </template>
    </pure-table>
  </div>
</template>
<style lang="scss" scoped>
:deep(.plus-search__button__wrapper .el-form-item__content) {
  flex: 1 !important;
  margin-left: 40px;
}
</style>
