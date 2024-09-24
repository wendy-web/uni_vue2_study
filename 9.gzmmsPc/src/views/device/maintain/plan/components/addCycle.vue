<script setup lang="ts">
import type { FormInstance, FormRules, TableInstance } from "element-plus";
import type { IdNameType } from "@/api/device/common/types";
import type { MaintainProjectItem } from "@/api/device/maintain/project/types";
import UserSelect from "@/components/DeptSelect/UserSelect.vue";
import type { CycleListType } from "../utils/types";
import { useCycle } from "./columns";
import StandardList from "./standardList.vue";

interface Props {
  userList: IdNameType[];
  treeList: any[];
  cycleType: number;
}

const { cycleColumns, cycleFormColumns, formData, cycleOptions } = useCycle();

const props = defineProps<Props>();
const emit = defineEmits(["add"]);

const standardListRef = ref<InstanceType<typeof StandardList>>();
const plusFormRef = ref();
const formRef = computed(() => {
  return plusFormRef.value?.formInstance as FormInstance;
});

const standardListVisible = ref(false);
const tableList = ref<CycleListType[]>([]);
const standardIds = computed(() => {
  return tableList.value.map((item) => item.maintenance_project_id);
});

const director_uid = computed(() => {
  return formData.value.director_uid.map((m) => m.id);
});

const other_uid = computed(() => {
  return formData.value.other_uid.map((m) => m.id);
});

const rules = reactive<FormRules>({
  cycleType: [
    {
      required: true,
      message: "请选择循环周期",
      trigger: "change",
    },
  ],
  plan_start_time: [
    {
      required: true,
      message: "请选择计划日期",
      trigger: "change",
    },
  ],
  director_uid: [
    {
      required: true,
      message: "请选择保养负责人",
      trigger: "change",
    },
  ],
  other_uid: [
    {
      required: true,
      message: "请选择其他负责人",
      trigger: "change",
    },
  ],
});

/** 监听选择标准弹窗-点击确认选择事件 */
function standardSelectchange(selectData: MaintainProjectItem[]) {
  let dataLength = selectData.length;
  selectData.forEach((item) => {
    tableList.value.push({
      maintenance_project_id: item.id,
      name: item.name,
      maintenance_requirements: item.maintenance_requirements,
      maintenance_area: item.maintenance_area,
      equipment_title: item.equipment_title,
      note: item.note,
      cycle_name: `${formData.value.cycleType}个月`,
      plan_start_time: formData.value.plan_start_time,
      director_name: formData.value.director_uid.map((item) => item.name).join(","),
      director_uid: formData.value.director_uid.map((item) => item.id).join(","),
      other_name: formData.value.other_uid.map((item) => item.name).join(","),
      other_uid: formData.value.other_uid.map((item) => item.id).join(","),
    });
  });
  ElMessage.success(`已批量添加${dataLength}条数据`);
}

const clickAdd = async () => {
  const result = await formRef.value!.validate();
  if (!result) return;
  standardListVisible.value = true;
};

const cellDelete = (row: any) => {
  console.log("删除");
  tableList.value = tableList.value.filter(
    (item) => item.maintenance_project_id !== row.maintenance_project_id,
  );
};

async function validate() {
  const reuslt = await formRef.value!.validate();
  if (tableList.value.length === 0) {
    ElMessage.warning("请添加保养标准");
    return false;
  }
  return reuslt;
}

function getCycleData() {
  return {
    cycleType: formData.value.cycleType,
    tableList: tableList.value,
  };
}

defineExpose({
  validate,
  getCycleData,
});
</script>
<template>
  <div>
    <PlusForm
      ref="plusFormRef"
      v-model="formData"
      :col-props="{
        span: 12,
      }"
      :row-props="{ gutter: 20 }"
      :columns="cycleFormColumns"
      :rules="rules"
      :hasFooter="false"
      :label-width="110"
    >
      <template #plus-field-cycleType>
        <el-select
          v-model="formData.cycleType"
          placeholder="请选择"
          clearable
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="item in cycleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.value == cycleType"
          ></el-option>
        </el-select>
      </template>
      <template #plus-field-director_uid>
        <UserSelect
          :list="userList"
          v-model="formData.director_uid"
          multiple
          :ids="other_uid"
        ></UserSelect>
      </template>
      <template #plus-field-other_uid>
        <UserSelect
          :list="userList"
          v-model="formData.other_uid"
          multiple
          :ids="director_uid"
        ></UserSelect>
      </template>
    </PlusForm>
    <el-button type="primary" @click="clickAdd" class="mb-4">添加标准</el-button>
    <pure-table
      header-cell-class-name="table-gray-header"
      :columns="cycleColumns"
      :data="tableList"
    >
      <template #operation="scope">
        <el-button type="warning" link @click="cellDelete(scope.row)">删除</el-button>
      </template>
    </pure-table>
    <StandardList
      ref="standardListRef"
      v-model="standardListVisible"
      :ids="standardIds"
      :treeList="treeList"
      @change="standardSelectchange"
    ></StandardList>
  </div>
</template>
<style lang="scss" scoped></style>
