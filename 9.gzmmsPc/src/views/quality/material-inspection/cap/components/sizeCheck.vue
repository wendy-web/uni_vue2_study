<script setup lang="tsx">
import { useAdd } from "../utils/add";

interface Props {
  /** 顶部信息通用数据 */
  descriptionsData: {
    batch_no: string;
  };

  /** 表格数据 */
  SizeMap: any;
  /** 父组件检验信息表格的长度 */
  tableLen: number;
  /** 父组件检验信息表格当前点击的index */
  tableIndex: number;
  /** 标准值 */
  standardValue: any;
  editDisabled?: boolean;
  /** 标准值配置 */
  standardSize?: any;
}

const props = withDefaults(defineProps<Props>(), {
  descriptionsData: () => ({
    batch_no: "",
    tableLen: 0,
    tableIndex: 0,
    editDisabled: false,
  }),
  SizeMap: {},
});
const { validatorCell } = useAdd();

const emit = defineEmits(["triggerNext", "triggerPrev"]);

const sizeData = ref<any>();

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
// 默认显示第一个tab
const activeTabName = ref("first");
watch(
  () => props.SizeMap,
  (newValue) => {
    sizeData.value = newValue.value;
  },
  {
    immediate: true,
  },
);

defineExpose({
  sizeData,
});
// 外径标准值
const outsideStandard: any = computed(() => {
  return props.standardValue?.child.outside_dimension;
});
// 埋头度标准值
const countersinkStandard: any = computed(() => {
  return props.standardValue?.child.countersink_depth;
});
// 钩边高度标准值
const crocheStandard: any = computed(() => {
  return props.standardValue?.child.croche_height;
});

const infoColumns: PlusColumnList = [
  {
    label: "批号",
    prop: "batch_no",
  },
  {
    label: "操作",
    prop: "operation",
    descriptionsItemProps: {
      span: 2,
    },
  },
];

// 外径尺寸表格配置
const outsideTableColumns: TableColumnList = [
  {
    label: `外径尺寸(${outsideStandard.value.initval})${outsideStandard.value.unit}`,
    prop: "name",
    align: "center",
    children: [
      {
        label: "#",
        slot: "index",
      },
      {
        label: "1",
        prop: "outside_dimension",
        slot: "one",
      },
      {
        label: "2",
        prop: "outside_dimension",
        slot: "two",
      },
      {
        label: "3",
        prop: "outside_dimension",
        slot: "three",
      },
      {
        label: "x",
        slot: "average",
      },
    ],
  },
];
// 埋头度表格配置
const countersinkTableColumns: TableColumnList = [
  {
    label: `埋头度(${countersinkStandard.value.initval})${countersinkStandard.value.unit}`,
    prop: "name",
    align: "center",
    children: [
      {
        label: "#",
        slot: "index",
      },
      {
        label: "1",
        prop: "countersink_depth",
        slot: "one",
      },
      {
        label: "2",
        prop: "countersink_depth",
        slot: "two",
      },
      {
        label: "3",
        prop: "countersink_depth",
        slot: "three",
      },
      {
        label: "x",
        slot: "average",
      },
    ],
  },
];
// 钩边高度表格配置
const crocheTableColumns: TableColumnList = [
  {
    label: `钩边高度(${crocheStandard.value.initval})${crocheStandard.value.unit}`,
    prop: "name",
    align: "center",
    children: [
      {
        label: "#",
        slot: "index",
      },
      {
        label: "1",
        prop: "croche_height",
        slot: "one",
      },
      {
        label: "2",
        prop: "croche_height",
        slot: "two",
      },
      {
        label: "3",
        prop: "croche_height",
        slot: "three",
      },
      {
        label: "x",
        slot: "average",
      },
    ],
  },
];

// 计算平均值
function calculateAverage(row: any, index: number) {
  const values = [row[1], row[2], row[3]];
  const validValues = values.filter((value) => !isNaN(parseFloat(value)));
  const sum = validValues.reduce((acc, val) => acc + parseFloat(val), 0);
  row.x = validValues.length > 0 ? (sum / validValues.length).toFixed(2) : 0;
}
// 检查单元格是否符合标准值 自定义class 异常标红显示
function checkCellClass(value: any, key: string) {
  let className = "";
  if (!props.standardSize) return className;
  let ok = validatorCell(props.standardSize?.child[key], value);
  className = ok ? "" : "warn-text";
  return className;
}
</script>
<template>
  <div class="measured-wrapper">
    <PlusDescriptions :column="2" :columns="infoColumns" :data="descriptionsData">
      <template #plus-desc-img="{ value }">
        <el-image :src="value" style="width: 60px" />
      </template>
      <template #plus-desc-sample_number></template>
      <template #plus-desc-operation>
        <div class="flex justify-end pr-4">
          <el-button type="primary" @click="clickPrev" :disabled="prevDisabled">上一个</el-button>
          <el-button type="primary" @click="clickNext" :disabled="nextDisabled">下一个</el-button>
        </div>
      </template>
    </PlusDescriptions>
    <el-tabs v-model="activeTabName">
      <el-tab-pane label="外径尺寸" name="first">
        <PureTable border :columns="outsideTableColumns" :data="sizeData.outside_dimension">
          <template #index="{ row, $index }">
            <span>第{{ $index + 1 }}片</span>
          </template>
          <template #one="{ row, $index }">
            <el-input
              v-model="row[1]"
              placeholder="请输入"
              :disabled="editDisabled"
              @input="calculateAverage(row, $index)"
              :class="checkCellClass(row[1], 'outside_dimension')"
            ></el-input>
          </template>
          <template #two="{ row, $index }">
            <el-input
              v-model="row[2]"
              placeholder="请输入"
              :disabled="editDisabled"
              @input="calculateAverage(row, $index)"
              :class="checkCellClass(row[2], 'outside_dimension')"
            ></el-input>
          </template>
          <template #three="{ row, $index }">
            <el-input
              v-model="row[3]"
              placeholder="请输入"
              :disabled="editDisabled"
              @input="calculateAverage(row, $index)"
              :class="checkCellClass(row[3], 'outside_dimension')"
            ></el-input>
          </template>
          <template #average="{ row, $index }">
            <span>{{ row["x"] }}</span>
          </template>
        </PureTable>
      </el-tab-pane>
      <el-tab-pane label="埋头度" name="second">
        <PureTable border :columns="countersinkTableColumns" :data="sizeData.countersink_depth">
          <template #index="{ row, $index }">
            <span>第{{ $index + 1 }}片</span>
          </template>
          <template #one="{ row, $index }">
            <el-input
              v-model="row[1]"
              placeholder="请输入"
              :disabled="editDisabled"
              @input="calculateAverage(row, $index)"
              :class="checkCellClass(row[1], 'countersink_depth')"
            ></el-input>
          </template>
          <template #two="{ row, $index }">
            <el-input
              v-model="row[2]"
              placeholder="请输入"
              :disabled="editDisabled"
              @input="calculateAverage(row, $index)"
              :class="checkCellClass(row[2], 'countersink_depth')"
            ></el-input>
          </template>
          <template #three="{ row, $index }">
            <el-input
              v-model="row[3]"
              placeholder="请输入"
              :disabled="editDisabled"
              @input="calculateAverage(row, $index)"
              :class="checkCellClass(row[3], 'countersink_depth')"
            ></el-input>
          </template>
          <template #average="{ row, $index }">
            <span>{{ row["x"] }}</span>
          </template>
        </PureTable>
      </el-tab-pane>
      <el-tab-pane label="勾边高度" name="third">
        <PureTable border :columns="crocheTableColumns" :data="sizeData.croche_height">
          <template #index="{ row, $index }">
            <span>第{{ $index + 1 }}片</span>
          </template>
          <template #one="{ row, $index }">
            <el-input
              v-model="row[1]"
              placeholder="请输入"
              :disabled="editDisabled"
              @input="calculateAverage(row, $index)"
              :class="checkCellClass(row[1], 'croche_height')"
            ></el-input>
          </template>
          <template #two="{ row, $index }">
            <el-input
              v-model="row[2]"
              placeholder="请输入"
              :disabled="editDisabled"
              @input="calculateAverage(row, $index)"
              :class="checkCellClass(row[2], 'croche_height')"
            ></el-input>
          </template>
          <template #three="{ row, $index }">
            <el-input
              v-model="row[3]"
              placeholder="请输入"
              :disabled="editDisabled"
              @input="calculateAverage(row, $index)"
              :class="checkCellClass(row[3], 'croche_height')"
            ></el-input>
          </template>
          <template #average="{ row, $index }">
            <span>{{ row["x"] }}</span>
          </template>
        </PureTable>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/quality/add.scss";
</style>
