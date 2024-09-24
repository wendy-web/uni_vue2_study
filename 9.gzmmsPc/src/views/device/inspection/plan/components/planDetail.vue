<script setup lang="tsx">
import { getInspectionPlanDetailApi } from "@/api/device/inspection/plan/index";
import { useCommon } from "@/hooks/device/baseData";

interface Props {
  listId: number;
}

const { inspecCycleOptions, getRulePlanTime, getRecordName, getExecutiveRuleName, getLimitVal } =
  useCommon();

const props = withDefaults(defineProps<Props>(), { listId: 0 });
const model = defineModel({ required: true, default: false });

const detailLoading = ref(false);
const detailData = ref();
const inspectionList = ref<any[]>([]);

async function getDetailData() {
  detailLoading.value = true;
  const result = await getInspectionPlanDetailApi({ id: props.listId });
  detailData.value = result.data;
  console.log("🚀 ~ getDetailData ~  detailData.value:", detailData.value);
  inspectionList.value = result.data.cycle;
  detailLoading.value = false;
}

watch(
  () => props.listId,
  (newVal) => {
    if (newVal) {
      getDetailData();
    }
  },
);

const deviceColumns: PlusColumnList = [
  {
    label: "设备编码",
    prop: "asset_no",
  },
  {
    label: "资产类型",
    prop: "equipment_type_title",
  },
  {
    label: "资产条码",
    prop: "barcode",
  },
  {
    label: "资产名称",
    prop: "bar_title",
  },
  {
    label: "规格型号",
    prop: "spec",
  },
  {
    label: "使用位置",
    prop: "use_places",
  },
  {
    label: "使用部门",
    prop: "use_dept_names",
  },
];

const formColumns: PlusColumnList = [
  {
    label: "计划明细单号",
    prop: "plan_details_no",
  },

  {
    label: "计划执行时间",
    prop: "plan_start_time",
    renderDescriptionsItem: (value) => {
      let data = {
        rule_type: detailData.value?.executive_rule_type,
        start_time: detailData.value?.plan_start_time,
        end_time: detailData.value?.plan_end_time,
      };
      return <span>{getRulePlanTime(data)}</span>;
    },
  },
  {
    label: "循环周期",
    prop: "cycle_type",
    valueType: "select",
    options: inspecCycleOptions,
  },
  {
    label: "执行人",
    prop: "executor_names",
  },
  {
    label: "必须拍照",
    prop: "is_must_pho",
    valueType: "select",
    options: [
      {
        label: "是",
        value: 1,
      },
      {
        label: "否",
        value: 0,
      },
    ],
  },
  {
    label: "必须签名",
    prop: "is_must_sig",
    valueType: "select",
    options: [
      {
        label: "是",
        value: 1,
      },
      {
        label: "否",
        value: 0,
      },
    ],
  },
  {
    label: "提醒时间(天)",
    prop: "notice_day",
    hideInDescriptions: computed(() => detailData.value?.cycle_type == 0),
  },
  {
    label: "执行时间规则",
    prop: "executive_rule_type",
    renderDescriptionsItem: (value) => {
      return <span>{getExecutiveRuleName(detailData.value?.executive_rule_type)}</span>;
    },
  },
];

const inspecColumns: TableColumnList = [
  {
    label: "检查内容",
    prop: "item_content",
    align: "center",
  },
  {
    label: "检验方法",
    prop: "method",
    align: "center",
  },
  {
    label: "检查标准说明",
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
    align: "center",
    slot: "select",
    cellRenderer: ({ row }) => (
      <>
        <ul>
          {row.normal_val ? (
            <li>
              <span>正常值：</span>
              <span>{row.normal_val}</span>
            </li>
          ) : null}
          {row.abnormal_val ? (
            <li>
              <span>异常值：</span>
              <span>{row.abnormal_val}</span>
            </li>
          ) : null}
        </ul>
      </>
    ),
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
];
</script>
<template>
  <el-drawer v-model="model" title="检查计划详情" size="70%">
    <div v-loading="detailLoading">
      <el-card shadow="never" class="mb-6" header="计划基本信息">
        <PlusDescriptions :column="3" :columns="formColumns" :data="detailData" />
      </el-card>
      <el-card shadow="never" class="mb-6" header="设备和检查项目">
        <div class="mb-6">
          <div class="flex mb-2">
            <span>设备信息</span>
          </div>
          <PlusDescriptions :column="3" :columns="deviceColumns" :data="detailData" />
        </div>
        <div class="mb-4">
          <div class="flex mb-4">
            <span>检查项目</span>
          </div>
          <pure-table
            header-cell-class-name="table-gray-header"
            :data="inspectionList"
            :columns="inspecColumns"
          ></pure-table>
        </div>
      </el-card>
    </div>

    <template #footer>
      <div class="flex items-start pb-4">
        <el-button type="primary" plain size="large" class="w-[100px]" @click="model = false">
          关闭
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>
<style lang="scss" scoped>
.card-header {
  padding: 10px 0 0 10px;
  // font-weight: 600;
  font-size: 16px;
}
</style>
