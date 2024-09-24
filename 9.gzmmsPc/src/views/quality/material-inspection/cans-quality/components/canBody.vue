<script setup lang="ts">
/* 罐体高度实测值弹窗 */

type InnerCoatingTableType = {
  actual_value: string; //实测值
  standard_text: string; //标准值
};

interface Props {
  /** 顶部信息通用数据 */
  descriptionsData: {
    batch_no: string;
    group_no: number;
    unit: string;
  };
  /** 标准值文本 */
  standardText: string;
  list: string[];
  disabled?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  descriptionsData: () => ({ batch_no: "", group_no: 1, unit: "" }),
  standardText: "",
  disabled: false,
});
const tableData = ref<InnerCoatingTableType[]>([]);

defineExpose({
  tableData,
});
watch(
  () => props.list,
  (newVal) => {
    tableData.value = newVal.map((item) => {
      return {
        standard_text: props.standardText,
        actual_value: item,
      };
    });
  },
  {
    immediate: true,
  },
);

const infoColumns: PlusColumnList = [
  {
    label: "生产批号",
    prop: "batch_no",
  },
  {
    label: "组别",
    prop: "group_no",
  },
  {
    label: "单位",
    prop: "unit",
  },
];

const tableColumns: TableColumnList = [
  {
    label: "#",
    type: "index",
  },
  {
    label: "标准值",
    prop: "standard_text",
  },
  {
    label: "实测值",
    prop: "actual_value",
    slot: "actual_value",
  },
];
</script>
<template>
  <div class="measured-wrapper">
    <PlusDescriptions
      :column="3"
      :columns="infoColumns"
      :data="descriptionsData"
      class="mb-2"
    ></PlusDescriptions>
    <PureTable border :columns="tableColumns" :data="tableData">
      <template #actual_value="{ row }">
        <el-input
          v-model="row.actual_value"
          placeholder="请输入"
          :disabled="disabled"
          v-inputnum.num_point="4"
        ></el-input>
      </template>
    </PureTable>
  </div>
</template>
<style lang="scss" scoped></style>
