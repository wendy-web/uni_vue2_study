<script setup lang="ts">
import { getEquipmentSelectApi } from "@/api/device/common/index";
import type { EquipmentModule, InspecItemType } from "@/api/device/common/types";
import { getInspectionPlanAddApi } from "@/api/device/inspection/plan/index";
import TreeSelect from "@/components/DeptSelect/TreeSelect.vue";
import { addDialog } from "@/components/ReDialog";
import { useBaseData } from "@/hooks/device/baseData";
import { userListHooks } from "@/hooks/index";
import { useTagsViewStore } from "@/store/modules/tagsView";
import {
  dayjs,
  type FormInstance, type TableInstance
} from "element-plus";
import { useRouter } from "vue-router";
import AddCycle from "./components/addCycle.vue";
import InspecList from "./components/inspecList.vue";
import { useAdd } from "./utils/add";
import type { CycleListType } from "./utils/types";

defineOptions({
  name: "deviceInspectionPlanAdd",
});

const tagsViewStore = useTagsViewStore();
const { userList } = userListHooks();
const router = useRouter();
const { pagination, columns, cycleColumns, getInspecCycleName } = useAdd();
const { getTypeList, treeData } = useBaseData();

/** 选择周期弹窗的ref */
const addCycleRef = ref<InstanceType<typeof AddCycle>>();
const inspecListRef = ref<InstanceType<typeof InspecList>>();
const inspecListVisible = ref(false);
const inspecIds = computed(() => {
  switch (currentCycleType.value) {
    case 0:
      return cycle_day.value.map((item) => item.inspect_item_id);
    case 1:
      return cycle_month.value.map((item) => item.inspect_item_id);
    case 2:
      return cycle_quarter.value.map((item) => item.inspect_item_id);
    case 3:
      return cycle_year.value.map((item) => item.inspect_item_id);
    default:
      return [];
  }
});

const formRef = ref<FormInstance>();
const formData = ref({
  equipment_type_id: undefined as FormNumType,
  equipment_type_name: "",
});

const rules = {
  equipment_type_id: [
    {
      required: true,
      message: "请选择资产类型",
      trigger: "change",
    },
  ],
};

const equipment_type = ref("");
/** 设备档案列表table的ref */
const prueTableRef = ref();
const selectTableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});
/** 设备档案列表 */
const deviceEquipmentData = ref<EquipmentModule.EquipmentItemType[]>([]);
/** 勾选的设备档案列表 */
const checkDiveceList = ref<EquipmentModule.EquipmentItemType[]>([]);
const tableLoading = ref(false);

const cycle_day = ref<CycleListType[]>([]);
const cycle_month = ref<CycleListType[]>([]);
const cycle_quarter = ref<CycleListType[]>([]);
const cycle_year = ref<CycleListType[]>([]);

const cycleDayRadio = ref({
  is_must_pho: 1,
  is_must_sig: 1,
});

const cycleMonthRadio = ref({
  is_must_pho: 1,
  is_must_sig: 1,
});

const cycleQuarterRadio = ref({
  is_must_pho: 1,
  is_must_sig: 1,
});
const cycleYearRadio = ref({
  is_must_pho: 1,
  is_must_sig: 1,
});

// const noticeDay = ref(0);
const noticeMonth = ref(0);
const noticeQuarter = ref(0);
// const noticeYear = ref(0);

// const noticeDayMax = ref(10);
const noticeMonthMax = computed(() => {
  let rule_type = cycle_month.value[0].executive_rule_type;
  if (rule_type == 0) {
    // 30-1
    return 29;
  } else {
    let plan_start_time = cycle_month.value[0].plan_start_time;
    console.log("🚀 ~ noticeMonthMax ~ plan_start_time:", plan_start_time);
    let curren_day = dayjs(plan_start_time).date();
    let maxDay = curren_day - 1;
    return maxDay;
  }
});
const noticeQuarterMax = ref(89); // 90 -1
// const noticeMax = ref(10);

/** 已经选择过的周期 */
const selectedCycleType = ref<number[]>([]);
/** 点击添加检查项时记录是哪个周期添加检查项 */
const currentCycleType = ref<number>(-1);

/** 监听选择资产类型后的回调 */
function handleNodeChange(value: string, idList: number[]) {
  console.log("🚀 ~ handleNodeChange ~ idList:", idList);
  formData.value.equipment_type_name = value;
  if (idList.length > 0) {
    equipment_type.value = idList.reverse().join(",");
    getEquipmentList();
  }
}

/** 根据资产类型获取设备档案列表 */
async function getEquipmentList() {
  let data = {
    equipment_type: equipment_type.value,
    page: pagination.currentPage,
    size: pagination.pageSize,
  };
  tableLoading.value = true;
  const result = await getEquipmentSelectApi(data);
  tableLoading.value = false;
  deviceEquipmentData.value = result.data.list;
  pagination.total = result.data.total;
}
function handleSizeChange(val: number) {
  if (equipment_type.value) {
    getEquipmentList();
  }
}

function handleCurrentChange(val: number) {
  if (equipment_type.value) {
    getEquipmentList();
  }
}

/** 移除tag */
function tagClose(row: EquipmentModule.EquipmentItemType) {
  checkDiveceList.value = checkDiveceList.value.filter((item) => {
    return item.id !== row.id;
  });
  selectTableRef.value!.toggleRowSelection(row, false);
}
/** 设备列表勾选触发 */
function deviceCheck(selection: EquipmentModule.EquipmentItemType[]) {
  checkDiveceList.value = selection;
}

const dialogOptions = {
  width: "60%",
  btnClass: "w-[80px]",
  draggable: true,
  closeOnClickModal: false,
  closeOnPressEscape: false,
  btnLoading: false,
  showClose: false,
};

/** 点击新增周期 */
async function handleAddCycle() {
  // const validateRes = await formRef.value!.validate();
  // if (!validateRes) return;
  console.log("currentCycleType.value", currentCycleType.value);
  addDialog({
    ...dialogOptions,
    style: {
      minWidth: "540px",
    },
    title: "新增周期",
    contentRenderer: () =>
      h(AddCycle, {
        ref: addCycleRef,
        cycleType: selectedCycleType.value,
        treeList: treeData.value,
        userList: userList.value,
      }),
    beforeCancel: (done, { options, index }) => {
      console.log("点击了取消按钮");
      done();
    },
    beforeSure: async (done, { options, index }) => {
      let result = await addCycleRef.value?.validate();
      console.log("🚀 ~ beforeSure: ~ result:", result);
      if (result) {
        let { cycleType, tableList } = addCycleRef.value!.getCycleData();
        // currentCycleType.value = cycleType as number;
        selectedCycleType.value.push(cycleType as number);

        switch (cycleType) {
          case 0:
            cycle_day.value = tableList;
            break;
          case 1:
            cycle_month.value = tableList;
            break;
          case 2:
            cycle_quarter.value = tableList;
            break;
          case 3:
            cycle_year.value = tableList;
          default:
            break;
        }
        done();
      }

      // console.log("点击了addRef.formData", addRef.value?.formData);
    },
  });
}

// 点击添加检查项
function handleAddInspec(type: number) {
  // switch (type) {
  //   case 0:
  //     inspecIds.value = cycle_day.value.map((item) => item.inspect_item_id);
  //     break;
  //   case 1:
  //     inspecIds.value = cycle_month.value.map((item) => item.inspect_item_id);
  //     break;
  //   case 2:
  //     inspecIds.value = cycle_quarter.value.map((item) => item.inspect_item_id);
  //     break;
  //   default:
  //     break;
  // }

  currentCycleType.value = type;
  inspecListVisible.value = true;
}

/** 监听选择标准弹窗-点击确认选择事件 */
function standardSelectchange(selectData: InspecItemType[]) {
  let dataLength = selectData.length;
  switch (currentCycleType.value) {
    case 0:
      selectData.forEach((item) => {
        cycle_day.value.push({
          inspect_item_id: item.id,
          is_must_pho: 0,
          is_must_sig: 0,
          inspect_items_name: item.inspect_items_name,
          item_content: item.item_content,
          method: item.method,
          std_explain: item.std_explain,
          record_method: item.record_method,
          normal_val: item.normal_val,
          abnormal_val: item.abnormal_val,
          upper_limit_val: item.upper_limit_val,
          lower_limit_val: item.lower_limit_val,
          cycle_name: cycle_day.value[0].cycle_name,
          executor_uid: cycle_day.value[0].executor_uid,
          plan_start_time: cycle_day.value[0].plan_start_time,
          executor_name: cycle_day.value[0].executor_name,
          executiveRuleName: cycle_day.value[0].executiveRuleName,
          executive_rule_type: cycle_day.value[0].executive_rule_type,
          plan_end_time: cycle_day.value[0].plan_end_time,
        });
      });
      break;
    case 1:
      selectData.forEach((item) => {
        cycle_month.value.push({
          inspect_item_id: item.id,
          is_must_pho: 0,
          is_must_sig: 0,
          inspect_items_name: item.inspect_items_name,
          item_content: item.item_content,
          method: item.method,
          std_explain: item.std_explain,
          record_method: item.record_method,
          normal_val: item.normal_val,
          abnormal_val: item.abnormal_val,
          upper_limit_val: item.upper_limit_val,
          lower_limit_val: item.lower_limit_val,
          cycle_name: cycle_month.value[0].cycle_name,
          executor_uid: cycle_month.value[0].executor_uid,
          plan_start_time: cycle_month.value[0].plan_start_time,
          executor_name: cycle_month.value[0].executor_name,
          executiveRuleName: cycle_month.value[0].executiveRuleName,
          executive_rule_type: cycle_month.value[0].executive_rule_type,
          plan_end_time: cycle_month.value[0].plan_end_time,
        });
      });
      break;
    case 2:
      selectData.forEach((item) => {
        cycle_quarter.value.push({
          inspect_item_id: item.id,
          is_must_pho: 0,
          is_must_sig: 0,
          inspect_items_name: item.inspect_items_name,
          item_content: item.item_content,
          method: item.method,
          std_explain: item.std_explain,
          record_method: item.record_method,
          normal_val: item.normal_val,
          abnormal_val: item.abnormal_val,
          upper_limit_val: item.upper_limit_val,
          lower_limit_val: item.lower_limit_val,
          cycle_name: cycle_quarter.value[0].cycle_name,
          executor_uid: cycle_quarter.value[0].executor_uid,
          plan_start_time: cycle_quarter.value[0].plan_start_time,
          executor_name: cycle_quarter.value[0].executor_name,
          executiveRuleName: cycle_quarter.value[0].executiveRuleName,
          executive_rule_type: cycle_quarter.value[0].executive_rule_type,
          plan_end_time: cycle_quarter.value[0].plan_end_time,
        });
      });
    case 3:
      selectData.forEach((item) => {
        cycle_year.value.push({
          inspect_item_id: item.id,
          is_must_pho: 0,
          is_must_sig: 0,
          inspect_items_name: item.inspect_items_name,
          item_content: item.item_content,
          method: item.method,
          std_explain: item.std_explain,
          record_method: item.record_method,
          normal_val: item.normal_val,
          abnormal_val: item.abnormal_val,
          upper_limit_val: item.upper_limit_val,
          lower_limit_val: item.lower_limit_val,
          cycle_name: cycle_year.value[0].cycle_name,
          executor_uid: cycle_year.value[0].executor_uid,
          plan_start_time: cycle_year.value[0].plan_start_time,
          executor_name: cycle_year.value[0].executor_name,
          executiveRuleName: cycle_year.value[0].executiveRuleName,
          executive_rule_type: cycle_year.value[0].executive_rule_type,
          plan_end_time: cycle_year.value[0].plan_end_time,
        });
      });
      break;
  }

  ElMessage.success(`已批量添加${dataLength}条数据`);
  inspecListRef.value?.setStatus();
}

function handleDelCycle(cycleType: number) {
  let cycleName = getInspecCycleName(cycleType);
  ElMessageBox.confirm(`确认要删除：【${cycleName}周期】的所有内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      selectedCycleType.value = selectedCycleType.value.filter((item) => item != cycleType);
      switch (cycleType) {
        case 0:
          cycle_day.value = [];
          break;
        case 1:
          cycle_month.value = [];
          break;
        case 2:
          cycle_quarter.value = [];
          break;
        case 3:
          cycle_year.value = [];
          break;

        default:
          break;
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function cellDelete(row: any, cycleType: number) {
  switch (cycleType) {
    case 0:
      cycle_day.value = cycle_day.value.filter(
        (item) => item.inspect_item_id !== row.inspect_item_id,
      );
      if (!cycle_day.value.length) {
        selectedCycleType.value = selectedCycleType.value.filter((item) => item != cycleType);
      }
      break;
    case 1:
      cycle_month.value = cycle_month.value.filter(
        (item) => item.inspect_item_id !== row.inspect_item_id,
      );
      if (!cycle_month.value.length) {
        selectedCycleType.value = selectedCycleType.value.filter((item) => item != cycleType);
      }
      break;
    case 2:
      cycle_quarter.value = cycle_quarter.value.filter(
        (item) => item.inspect_item_id !== row.inspect_item_id,
      );
      if (!cycle_quarter.value.length) {
        selectedCycleType.value = selectedCycleType.value.filter((item) => item != cycleType);
      }
      break;
    case 3:
      cycle_year.value = cycle_year.value.filter(
        (item) => item.inspect_item_id !== row.inspect_item_id,
      );
      if (!cycle_year.value.length) {
        selectedCycleType.value = selectedCycleType.value.filter((item) => item != cycleType);
      }
      break;
    default:
      break;
  }
}

const confirmRule = [
  [() => checkDiveceList.value.length === 0, () => "您未选择设备,请选择设备"],
  // [
  //   () =>
  //     cycle_day.value.length === 0 &&
  //     cycle_month.value.length === 0 &&
  //     cycle_quarter.value.length === 0 &&
  //     cycle_year.value.length === 0,
  //   () => "您未添加保养周期,请添加保养周期",
  // ],
  [
    () =>
      cycle_day.value.length === 0 &&
      cycle_month.value.length === 0 &&
      cycle_quarter.value.length === 0,
    () => "您未添加保养周期,请添加保养周期",
  ],
];

// 点击确定
function handleConfirm() {
  formRef.value!.validate(async (valid, fields) => {
    if (valid) {
      const target = confirmRule.find((m) => m[0]!());
      console.log("🚀 ~ formRef.value!.validate ~ target:", target);
      if (target) {
        let hint = target[1]!();
        ElMessage.warning(`${hint}`);
        return;
      }
      let data = {
        equipment_ids: checkDiveceList.value.map((m) => m.id).join(","),
        equipment_type_id: formData.value.equipment_type_id,
        equipment_type_title: formData.value.equipment_type_name,
        cycle_day: changeCycleList(0),
        cycle_month: changeCycleList(1),
        cycle_quarter: changeCycleList(2),
        cycle_year: changeCycleList(3),
      };

      const result = await getInspectionPlanAddApi(data);
      ElMessageBox.confirm(`${result.msg},请回到列表页面查看~`, "温馨提示", {
        confirmButtonText: "好的,我知道了",
        showCancelButton: false,
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "success",
      })
        .then(() => {
          const currentTag = router.currentRoute.value;
          router.replace({
            path: "/device/inspection/plan",
          });
          tagsViewStore.delView(currentTag);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("error!");
    }
  });
}

function changeCycleList(type: number) {
  if (type === 0) {
    return cycle_day.value.length > 0
      ? cycle_day.value.map((item) => {
          let { is_must_pho, executiveRuleName, cycle_name, is_must_sig, ...rest } = item;
          return {
            is_must_pho: cycleDayRadio.value.is_must_pho,
            is_must_sig: cycleDayRadio.value.is_must_sig,
            ...rest,
          };
        })
      : [];
  } else if (type === 1) {
    return cycle_month.value.length > 0
      ? cycle_month.value.map((item) => {
          let { is_must_pho, executiveRuleName, cycle_name, is_must_sig, ...rest } = item;
          return {
            is_must_pho: cycleMonthRadio.value.is_must_pho,
            is_must_sig: cycleMonthRadio.value.is_must_sig,
            notice_day: noticeMonth.value,
            ...rest,
          };
        })
      : [];
  } else if (type == 2) {
    return cycle_quarter.value.length > 0
      ? cycle_quarter.value.map((item) => {
          let { is_must_pho, executiveRuleName, cycle_name, is_must_sig, ...rest } = item;
          return {
            is_must_pho: cycleQuarterRadio.value.is_must_pho,
            is_must_sig: cycleQuarterRadio.value.is_must_sig,
            notice_day: noticeQuarter.value,
            ...rest,
          };
        })
      : [];
  } else if (type == 3) {
    return cycle_year.value.length > 0
      ? cycle_year.value.map((item) => {
          let { is_must_pho, executiveRuleName, cycle_name, is_must_sig, ...rest } = item;
          return {
            is_must_pho: cycleYearRadio.value.is_must_pho,
            is_must_sig: cycleYearRadio.value.is_must_sig,
            ...rest,
          };
        })
      : [];
  }
}

// 点击返回
function pageBack() {
  router.replace({
    path: "/device/inspection/plan",
  });
}

onActivated(() => {
  getTypeList();
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <div class="header-title">
        <span>新建点巡检计划</span>
      </div>
      <el-form :model="formData" ref="formRef" :rules="rules">
        <el-card shadow="never" class="mb-6" header="计划信息">
          <el-form-item label="资产类型" class="w-[50%]" prop="equipment_type_id">
            <TreeSelect
              :list="treeData"
              v-model="formData.equipment_type_id"
              @nodeChange="handleNodeChange"
            ></TreeSelect>
          </el-form-item>
          <el-form-item label="已选择设备" class="w-full">
            <span v-if="!formData.equipment_type_id" class="text-slate-400">请先选择资产类型</span>
            <span v-else-if="!checkDiveceList.length" class="text-slate-400">
              请勾选下方设备列表
            </span>
            <el-tag
              v-for="tag in checkDiveceList"
              :key="tag.id"
              closable
              class="mr-2 mb-2"
              @close="tagClose(tag)"
            >
              {{ tag.bar_title }}
            </el-tag>
          </el-form-item>
          <pure-table
            ref="prueTableRef"
            header-cell-class-name="table-gray-header"
            @selection-change="deviceCheck"
            row-key="id"
            :data="deviceEquipmentData"
            :columns="columns"
            :pagination="pagination"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
            :loading="tableLoading"
          ></pure-table>
        </el-card>
        <el-card shadow="never">
          <template #header>
            <span>批投检查项目</span>
            <span>（对选择的设备设置检查项目）</span>
          </template>
          <el-button type="primary" @click="handleAddCycle">新增周期</el-button>
          <el-divider />
          <!-- 每天-->
          <div class="mb-6" v-if="cycle_day.length > 0">
            <div class="flex justify-between mb-2">
              <div class="flex items-end">
                <span>每天</span>
                <el-button type="primary" size="default" @click="handleAddInspec(0)" class="mx-4">
                  添加检查项
                </el-button>
                <ul class="flex items-center">
                  <li class="mr-[40px]">
                    <span>必须拍照</span>
                    <el-radio-group v-model="cycleDayRadio.is_must_pho" class="ml-4">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </li>
                  <li>
                    <span>必须签名</span>
                    <el-radio-group v-model="cycleDayRadio.is_must_sig" class="ml-4">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </li>
                </ul>
              </div>
              <el-button type="primary" size="default" @click="handleDelCycle(0)" link>
                删除周期
              </el-button>
            </div>
            <pure-table
              header-cell-class-name="table-gray-header"
              :columns="cycleColumns"
              :data="cycle_day"
            >
              <template #operation="scope">
                <el-button type="warning" link @click="cellDelete(scope.row, 0)">删除</el-button>
              </template>
            </pure-table>
          </div>
          <!-- 每月-->
          <div class="mb-6" v-if="cycle_month.length > 0">
            <div class="flex justify-between mb-2">
              <div class="flex items-end">
                <span>每月</span>
                <el-button type="primary" size="default" @click="handleAddInspec(1)" class="mx-4">
                  添加检查项
                </el-button>
                <ul class="flex items-center">
                  <li class="mr-[40px]">
                    <span>必须拍照</span>
                    <el-radio-group v-model="cycleMonthRadio.is_must_pho" class="ml-4">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </li>
                  <li>
                    <span>必须签名</span>
                    <el-radio-group v-model="cycleMonthRadio.is_must_sig" class="ml-4">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </li>
                </ul>
                <div class="ml-8">
                  <span>提醒时间(天):</span>
                  <el-input-number
                    v-model.number="noticeMonth"
                    :min="0"
                    :max="noticeMonthMax"
                    :step="1"
                    :controls="true"
                    class="ml-4 mr-4"
                  ></el-input-number>
                  <span class="text-gray-400 text-[12px]">
                    默认0不提醒，仅到计划执行时间到时通知
                  </span>
                </div>
              </div>
              <el-button type="primary" size="default" @click="handleDelCycle(1)" link>
                删除周期
              </el-button>
            </div>
            <pure-table
              header-cell-class-name="table-gray-header"
              :columns="cycleColumns"
              :data="cycle_month"
            >
              <template #operation="scope">
                <el-button type="warning" link @click="cellDelete(scope.row, 1)">删除</el-button>
              </template>
            </pure-table>
          </div>
          <!-- 每季 -->
          <div class="mb-6" v-if="cycle_quarter.length > 0">
            <div class="flex justify-between mb-2">
              <div class="flex items-end">
                <span>每季</span>
                <el-button type="primary" size="default" @click="handleAddInspec(2)" class="mx-4">
                  添加检查项
                </el-button>
                <ul class="flex items-center">
                  <li class="mr-[40px]">
                    <span>必须拍照</span>
                    <el-radio-group v-model="cycleQuarterRadio.is_must_pho" class="ml-4">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </li>
                  <li>
                    <span>必须签名</span>
                    <el-radio-group v-model="cycleQuarterRadio.is_must_sig" class="ml-4">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </li>
                </ul>
                <div class="ml-8">
                  <span>提醒时间(天):</span>
                  <el-input-number
                    v-model.number="noticeQuarter"
                    :min="0"
                    :max="noticeQuarterMax"
                    :step="1"
                    :controls="true"
                    class="ml-4 mr-4"
                  ></el-input-number>
                  <span class="text-gray-400 text-[12px]">
                    默认0不提醒，仅到计划执行时间到时通知
                  </span>
                </div>
              </div>
              <el-button type="primary" size="default" @click="handleDelCycle(2)" link>
                删除周期
              </el-button>
            </div>
            <pure-table
              header-cell-class-name="table-gray-header"
              :columns="cycleColumns"
              :data="cycle_quarter"
            >
              <template #operation="scope">
                <el-button type="warning" link @click="cellDelete(scope.row, 2)">删除</el-button>
              </template>
            </pure-table>
          </div>
          <!-- 每年 -->
          <div class="mb-6" v-if="cycle_year.length > 0">
            <div class="flex justify-between mb-2">
              <div class="flex items-end">
                <span>每年</span>
                <el-button type="primary" size="default" @click="handleAddInspec(3)" class="mx-4">
                  添加检查项
                </el-button>
                <ul class="flex items-center">
                  <li class="mr-[40px]">
                    <span>必须拍照</span>
                    <el-radio-group v-model="cycleYearRadio.is_must_pho" class="ml-4">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </li>
                  <li>
                    <span>必须签名</span>
                    <el-radio-group v-model="cycleYearRadio.is_must_sig" class="ml-4">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </li>
                </ul>
              </div>
              <el-button type="primary" size="default" @click="handleDelCycle(3)" link>
                删除周期
              </el-button>
            </div>
            <pure-table
              header-cell-class-name="table-gray-header"
              :columns="cycleColumns"
              :data="cycle_year"
            >
              <template #operation="scope">
                <el-button type="warning" link @click="cellDelete(scope.row, 3)">删除</el-button>
              </template>
            </pure-table>
          </div>
        </el-card>
      </el-form>
    </div>
    <div class="mt-6">
      <el-button plain class="w-[100px] mr-4" size="large" @click="pageBack">返回</el-button>
      <el-button type="primary" @click="handleConfirm" class="w-[100px]" size="large">
        确定
      </el-button>
    </div>
    <InspecList
      ref="inspecListRef"
      v-model="inspecListVisible"
      :ids="inspecIds"
      :treeList="treeData"
      @change="standardSelectchange"
    ></InspecList>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/common.scss";

.app-card {
  height: calc(100vh - 200px);
  overflow-y: auto;
  padding-top: 0;
  .header-title {
    position: sticky;
    top: 0px;
    background-color: #fff;
    z-index: 99;
    height: 46px;
    display: flex;
    align-items: center;
    border-bottom: 2px solid #e5e5e5;
  }
}
</style>
