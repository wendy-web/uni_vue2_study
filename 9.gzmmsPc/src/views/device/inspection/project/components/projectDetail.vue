<script setup lang="tsx">
import { getInspectionProjectDetailApi } from "@/api/device/inspection/project/index";
import type { InspectionProjectDetailArr } from "@/api/device/inspection/project/types";
import { useAdd } from "../utils/add";

interface Props {
  listId: number;
}

const { getRecordName, getLimitVal } = useAdd();

const props = withDefaults(defineProps<Props>(), { listId: 0 });
const model = defineModel({ required: true, default: false });

const detailData = ref();
const detailLoading = ref(false);
const tableList = ref<InspectionProjectDetailArr[]>([]);

async function getData() {
  detailLoading.value = true;
  const result = await getInspectionProjectDetailApi({ id: props.listId });
  detailData.value = result.data;
  tableList.value = result.data.item_arr;

  detailLoading.value = false;
}

const topColumns: PlusColumnList = [
  {
    label: "检查内容组名",
    prop: "inspect_items_name",
  },
  {
    label: "资产类型",
    prop: "equipment_type_title",
  },
  {
    label: "检查目的",
    prop: "inspect_purpose",
  },
  {
    label: "备注",
    prop: "note",
  },
];

const detailColumns: TableColumnList = [
  {
    label: "检查内容",
    prop: "item_content",
    align: "center",
  },
  {
    label: "检验方法/工具/依据",
    prop: "method",
    align: "center",
  },
  {
    label: "标准说明",
    prop: "std_explain",
    align: "center",
  },
  {
    label: "记录方式",
    prop: "record_method",
    align: "center",
    cellRenderer: ({ row }) => {
      return getRecordName(row.record_method);
    },
  },
  {
    label: "结果选项",
    prop: "result_item",
    align: "center",
  },
  {
    label: "上限",
    prop: "upper_limit_val",
    align: "center",
    cellRenderer: ({ row }) => {
      return getLimitVal(row.record_method, row.upper_limit_val);
    },
  },
  {
    label: "下限",
    prop: "lower_limit_val",
    align: "center",
    cellRenderer: ({ row }) => {
      return getLimitVal(row.record_method, row.lower_limit_val);
    },
  },
  // {
  //   label: "默认值",
  //   prop: "",
  //   align: "center",
  // },
];

watch(
  () => model.value,
  (newVal) => {
    if (newVal && props.listId) {
      getData();
    }
  },
);
</script>
<template>
  <el-drawer v-model="model" title="检查项目详情" size="70%">
    <!-- <pure-table
      :data="[]"
      :columns="topColumns"
      header-cell-class-name="table-gray-header"
    ></pure-table> -->
    <PlusDescriptions
      :column="3"
      :columns="topColumns"
      :data="detailData"
      class="mb-4"
      v-loading="detailLoading"
    />
    <el-card shadow="never" class="mb-6" header="点巡检项明细">
      <pure-table
        :data="tableList"
        :columns="detailColumns"
        header-cell-class-name="table-gray-header"
        :loading="detailLoading"
      ></pure-table>
    </el-card>
  </el-drawer>
</template>
<style lang="scss" scoped></style>
