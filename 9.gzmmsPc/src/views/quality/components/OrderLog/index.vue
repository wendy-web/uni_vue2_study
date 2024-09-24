<script setup lang="ts">
interface Props {
  logList: any[];
}

const props = defineProps<Props>();

const logColumns: TableColumnList = [
  {
    label: "操作人",
    prop: "ct_name",
    align: "center",
    cellRenderer: ({ row }) => {
      if (row.name) {
        return row.name;
      }
      return row.ct_name;
    },
  },
  {
    label: "操作类型",
    prop: "act",
    align: "center",
    cellRenderer: ({ row }) => {
      if (row.content) {
        return row.content;
      }
      let act = row.act;
      let act_msg = row.act_msg;
      return act_msg ? act + "：" + act_msg : act;
    },
  },
  {
    label: "时间",
    prop: "create_time",
    align: "center",
  },
];
</script>
<template>
  <div class="bg-white px-2 py-2">
    <PureTable
      border
      header-cell-class-name="table-gray-header"
      :data="logList"
      :columns="logColumns"
      height="calc(100vh - 240px)"
      style="width: 80%"
    ></PureTable>
  </div>
</template>
<style lang="scss" scoped></style>
