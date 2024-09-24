<script setup lang="ts">
import type { FormInstance, FormRules, TableInstance } from "element-plus";
import dayjs from "dayjs";
import type { IdNameType } from "@/api/device/common/types";
import type { InspecItemType } from "@/api/device/common/types";
import UserSelect from "@/components/DeptSelect/UserSelect.vue";
import { useCommon } from "@/hooks/device/baseData";
import type { CycleListType } from "../utils/types";
import { useCycle } from "./hook";
import InspecList from "./inspecList.vue";

interface Props {
  userList: IdNameType[];
  treeList: any[];
  cycleType: number[];
}

const props = defineProps<Props>();
const emit = defineEmits(["add"]);

const { inspecCycleOptions, getExecutiveRuleName } = useCommon();
const { cycleFormColumns, cycleColumns, formData, getInspecCycleName, cycleRules } = useCycle();

const dynamicCycleOptions = computed(() => {
  if (formData.value.executive_rule_type === 1) {
    // let arr = inspecCycleOptions.filter((item) => item.value > 0);
    let arr = inspecCycleOptions.filter((item) => item.value === 1);
    return arr;
  } else {
    return inspecCycleOptions.filter((item) => item.value < 3);
  }
});
const inspecListRef = ref<InstanceType<typeof InspecList>>();
const plusFormRef = ref();
const formRef = computed(() => {
  return plusFormRef.value?.formInstance as FormInstance;
});

const tableList = ref<CycleListType[]>([]);
const inspecListVisible = ref(false);
const inspecIds = computed(() => {
  return tableList.value.map((item) => item.inspect_item_id);
});

async function clickAdd() {
  const validateRes = await formRef.value.validate();
  console.log("🚀 ~ clickAdd ~ validateRes:", validateRes);
  if (!validateRes) return;
  inspecListVisible.value = true;
}

function cellDelete(row: CycleListType) {
  tableList.value = tableList.value.filter((item) => item.inspect_item_id !== row.inspect_item_id);
}

function userChange(valueList: IdNameType[]) {
  console.log("🚀 ~ userChange ~ valueList:", valueList);
  formData.value.executor_name = valueList.map((item) => item.name).join(",");
}

/** 监听选择标准弹窗-点击确认选择事件 */
function inpsecSelectchange(selectData: InspecItemType[]) {
  let dataLength = selectData.length;

  // 取一下循环周期名称
  let cycle_name =
    typeof formData.value.cycleType === "number"
      ? getInspecCycleName(formData.value.cycleType)
      : "";

  // 动态取一下 计划执行时间开始时间,固定周期executive_rule_type === 1,上次执行时间===0
  let plan_start_time =
    formData.value.executive_rule_type === 1
      ? formData.value.plan_start_time_list[0]
      : formData.value.plan_start_time;
  // 动态取一下 计划执行时间结束时间,固定周期executive_rule_type === 1,上次执行时间===0
  let plan_end_time =
    formData.value.executive_rule_type === 1 ? formData.value.plan_start_time_list[1] || "" : "";

  //执行时间规则名称
  let executiveRuleName =
    typeof formData.value.executive_rule_type === "number"
      ? getExecutiveRuleName(formData.value.executive_rule_type)
      : "";

  selectData.forEach((item) => {
    tableList.value.push({
      inspect_item_id: item.id,
      is_must_pho: 0,
      executor_uid: formData.value.executor_uid.join(","),
      is_must_sig: 0,
      cycle_name: cycle_name,
      inspect_items_name: item.inspect_items_name,
      item_content: item.item_content,
      method: item.method,
      std_explain: item.std_explain,
      record_method: item.record_method,
      normal_val: item.normal_val,
      abnormal_val: item.abnormal_val,
      upper_limit_val: item.upper_limit_val,
      lower_limit_val: item.lower_limit_val,
      plan_start_time: plan_start_time,
      plan_end_time: plan_end_time,
      executor_name: formData.value.executor_name,
      executiveRuleName: executiveRuleName,
      executive_rule_type: formData.value.executive_rule_type!,
      // note: item.note,
    });
  });
  ElMessage.success(`已批量添加${dataLength}条数据`);
  inspecListRef.value?.setStatus();
}

async function validate() {
  const reuslt = await formRef.value!.validate();
  if (tableList.value.length === 0) {
    ElMessage.warning("请添加检查项目");
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

function endDisabledDate(endDate: Date, startValue: string) {
  const startTime = dayjs(startValue);
  const endTime = dayjs(endDate);
  const startMonth = startTime.month();
  const endMonth = endTime.month();
  const startYear = startTime.year();
  const endYear = endTime.year();

  if (formData.value.cycleType === 1) {
    // 1是每月
    return dayjs(endTime).isSameOrBefore(dayjs(startValue)) || endMonth !== startMonth;
  } else if (formData.value.cycleType === 2) {
    // 2是每季度
    // 计算开始时间所在季度的最后一天
    const threeMonthsLater = dayjs(startTime).add(3, "month").format("YYYY-MM-DD");
    console.log("🚀 ~ endDisabledDate ~ threeMonthsLater:", threeMonthsLater);
    return (
      dayjs(threeMonthsLater).isBefore(endTime) || dayjs(endTime).isSameOrBefore(dayjs(startValue))
    );
  } else if (formData.value.cycleType === 3) {
    // 3是每年
    return dayjs(endTime).isSameOrBefore(dayjs(startValue)) || endYear !== startYear;
  }

  return false;
}

/** 当选择循环周期变化时-重置计划执行时间范围 */
function handleCycleChange() {
  formData.value.plan_start_time_list = [dayjs().format("YYYY-MM-DD HH:mm")];
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
      :rules="cycleRules"
      v-model="formData"
      :col-props="{
        span: 12,
      }"
      :row-props="{ gutter: 20 }"
      :columns="cycleFormColumns"
      :hasFooter="false"
      :label-width="110"
    >
      <!-- 选择循环周期 -->
      <template #plus-field-cycleType>
        <el-select
          v-model="formData.cycleType"
          placeholder="请选择"
          clearable
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="item in dynamicCycleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="cycleType.includes(item.value)"
            @change="handleCycleChange"
          ></el-option>
        </el-select>
      </template>
      <!-- 选择计划执行人 -->
      <template #plus-field-executor_uid>
        <UserSelect
          :list="userList"
          v-model="formData.executor_uid"
          multiple
          :value-key="false"
          @change="userChange"
        ></UserSelect>
      </template>
      <!-- 固定周期-选择计划执行时间 -->
      <template #plus-field-plan_start_time_list>
        <PlusDatePicker
          style="width: 100%"
          v-model="formData.plan_start_time_list"
          :startProps="{
            format: 'YYYY-MM-DD HH:mm',
            valueFormat: 'YYYY-MM-DD HH:mm',
            clearable: false,
          }"
          :endProps="{
            format: 'YYYY-MM-DD HH:mm',
            valueFormat: 'YYYY-MM-DD HH:mm',
            disabled: !formData.cycleType || !formData.plan_start_time_list[0],
            placeholder: formData.plan_start_time_list[0] ? '请选择结束时间' : '请先选择开始时间和循环周期',
            clearable: false,
          }"
          :endDisabledDate="endDisabledDate"
        />
      </template>
    </PlusForm>
    <el-button type="primary" @click="clickAdd" class="mb-4">添加检查项</el-button>
    <pure-table
      header-cell-class-name="table-gray-header"
      :columns="cycleColumns"
      :data="tableList"
    >
      <template #operation="scope">
        <el-button type="warning" link @click="cellDelete(scope.row)">删除</el-button>
      </template>
    </pure-table>
    <InspecList
      ref="inspecListRef"
      v-model="inspecListVisible"
      :ids="inspecIds"
      :treeList="treeList"
      @change="inpsecSelectchange"
    ></InspecList>
  </div>
</template>
<style lang="scss" scoped>
:deep(.plus-form .plus-form-item-extra) {
  position: absolute;
  top: 6px;
  left: 400px;
}
</style>
