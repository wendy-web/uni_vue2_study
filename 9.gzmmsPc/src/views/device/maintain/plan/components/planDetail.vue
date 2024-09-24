<script setup lang="ts">
import { getMaintainPlanDetailApi } from "@/api/device/maintain/plan/index";
import { useCommon } from "@/hooks/device/baseData";
import { useEdit } from "../utils//edit";

interface Props {
  listId: number;
}
const { cycleOptions } = useCommon();

const props = withDefaults(defineProps<Props>(), { listId: 0 });

const { deviceColumns } = useEdit();

const model = defineModel("visible", { required: true, default: false });
const detailLoading = ref(false);

const detailData = ref();
const standardList = ref<any[]>([]);

async function getData() {
  detailLoading.value = true;
  const result = await getMaintainPlanDetailApi({ id: props.listId });
  detailData.value = result.data;
  detailLoading.value = false;
  standardList.value = result.data.cycle_item ?? [];
  console.log("🚀 ~ getData ~ detailData.value :", detailData.value);
}

const formColumns: PlusColumnList = [
  {
    label: "计划明细单号",
    prop: "plan_details_no",
  },
  {
    label: "计划执行时间",
    prop: "plan_start_time",
  },
  {
    label: "循环周期",
    prop: "cycle_type",
    valueType: "select",
    options: cycleOptions,
  },
  {
    label: "保养负责人",
    prop: "director_names",
  },
  {
    label: "其他负责人",
    prop: "other_names",
  },
  {
    label: "提醒时间(天)",
    prop: "notice_day",
  },
];

const standardColumns: TableColumnList = [
  {
    label: "项目标准名称",
    prop: "name",
    align: "center",
  },
  {
    label: "保养部位",
    prop: "maintenance_area",
    align: "center",
  },
  {
    label: "保养要求/标准",
    prop: "maintenance_requirements",
    align: "center",
  },
];

watch(
  () => props.listId,
  (newVal) => {
    if (newVal) {
      getData();
    }
  },
);
</script>
<template>
  <el-drawer v-model="model" title="保养计划详情" size="70%">
    <el-card shadow="never" class="mb-6" header="计划基本信息">
      <PlusDescriptions :column="3" :columns="formColumns" :data="detailData" />
    </el-card>
    <el-card shadow="never" class="mb-6" header="设备和保养标准">
      <div class="mb-6">
        <div class="flex mb-2">
          <span>设备信息</span>
        </div>
        <PlusDescriptions :column="3" :columns="deviceColumns" :data="detailData" />
      </div>
      <div class="mb-4">
        <div class="flex mb-4">
          <span>保养标准</span>
        </div>
        <pure-table
          header-cell-class-name="table-gray-header"
          :data="standardList"
          :columns="standardColumns"
        ></pure-table>
      </div>
    </el-card>
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
