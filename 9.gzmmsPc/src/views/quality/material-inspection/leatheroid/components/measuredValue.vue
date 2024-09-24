<script setup lang="tsx">
import type { PaperSizeListType } from "../utils/add";

interface Props {
  /** 顶部信息通用数据 */
  descriptionsData: {
    order_num: string;
    unit: string;
    img: string;
  };
  /** 样品号 */
  sample_number: number;
  /** 表格数据 */
  paperSizeList: any[];
  /** 父组件检验信息表格的长度 */
  tableLen: number;
  /** 父组件检验信息表格当前点击的index */
  tableIndex: number;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  descriptionsData: () => ({
    order_num: "",
    sample_number: 0,
    unit: "",
    img: "",
    tableLen: 0,
    tableIndex: 0,
  }),
  paperSizeList: () => [],
});

const emit = defineEmits(["triggerNext", "triggerPrev"]);

const tableData = ref<PaperSizeListType[]>();

/** 上一个按钮的禁用状态 */
const prevDisabled = computed(() => {
  return props.tableIndex === 0;
});

/** 下一个按钮的禁用状态 */
const nextDisabled = computed(() => {
  return props.tableLen === props.tableIndex + 1;
});

/** 点击下一个 */
function clickNext() {
  emit("triggerNext");
}

/** 点击上一个 */
function clickPrev() {
  emit("triggerPrev");
}

watch(
  () => props.paperSizeList,
  (newValue) => {
    tableData.value = newValue.map((item) => {
      return {
        measuredValue: "",
        ...item,
      };
    });
  },
  {
    immediate: true,
  },
);

defineExpose({
  tableData,
});

const infoColumns: PlusColumnList = [
  {
    label: "系统流水号",
    prop: "order_num",
  },
  {
    label: "样品号",
    prop: "sample_number",
  },
  {
    label: "单位",
    prop: "unit",
  },
  {
    label: "纸皮图片",
    prop: "img",
  },
  {
    label: "操作",
    prop: "operation",
    descriptionsItemProps: {
      span: 2,
    },
  },
];

const tableColumns: TableColumnList = [
  {
    label: "项目",
    prop: "name",
  },
  {
    label: "标准值",
    prop: "initval",
  },
  {
    label: "实测值",
    prop: "measuredValue",
    slot: "measuredValue",
  },
];
</script>
<template>
  <div class="measured-wrapper">
    <PlusDescriptions :column="3" :columns="infoColumns" :data="descriptionsData">
      <template #plus-desc-img="{ value }">
        <el-image :src="value" style="width: 60px" />
      </template>
      <template #plus-desc-sample_number>
        <span>{{ sample_number }}</span>
      </template>
      <template #plus-desc-operation>
        <div class="flex justify-end pr-4">
          <el-button type="primary" @click="clickPrev" :disabled="prevDisabled">上一个</el-button>
          <el-button type="primary" @click="clickNext" :disabled="nextDisabled">下一个</el-button>
        </div>
      </template>
    </PlusDescriptions>
    <PureTable border :columns="tableColumns" :data="tableData">
      <template #measuredValue="{ row }">
        <el-input
          v-model="row.measuredValue"
          placeholder="请输入"
          :disabled="disabled"
          v-inputnum.num_point="4"
        ></el-input>
      </template>
    </PureTable>
  </div>
</template>
<style lang="scss" scoped></style>
