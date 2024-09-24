<script setup lang="ts">
import { getEquipmentSelectApi } from "@/api/device/common/index";
import type { EquipmentModule } from "@/api/device/common/types";
import { getMaintainPlanAddApi } from "@/api/device/maintain/plan/index";
import type { MaintainProjectItem } from "@/api/device/maintain/project/types";
import TreeSelect from "@/components/DeptSelect/TreeSelect.vue";
import { addDialog } from "@/components/ReDialog";
import { useBaseData } from "@/hooks/device/baseData";
import { userListHooks } from "@/hooks/index";
import { useTagsViewStore } from "@/store/modules/tagsView";
import type { FormInstance, FormRules, TableInstance } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import AddCycle from "./components/addCycle.vue";
import StandardList from "./components/standardList.vue";
import { useAdd } from "./utils/add";
import type { CycleListType } from "./utils/types";

defineOptions({
  name: "deviceMaintainPlanAdd",
});

enum ETitle {
  "新建保养计划" = 1,
  "编辑保养计划",
}

type CycleMonthGroupType = {
  [groupName: string]: CycleListType[];
};

type CycleNoticeGroupType = {
  [key: string]: number;
};

const { userList } = userListHooks();
const tagsViewStore = useTagsViewStore();
const router = useRouter();
const route = useRoute();
const { pagination, columns, cycleColumns } = useAdd();
const { getTypeList, treeData } = useBaseData();

const standardListRef = ref<InstanceType<typeof StandardList>>();

const listId = ref(0);
const pageType = ref(1);
const headerTitle = computed(() => {
  return ETitle[pageType.value];
});
/** 设备档案列表 */
const deviceEquipmentData = ref<EquipmentModule.EquipmentItemType[]>([]);
/** 勾选的设备档案列表 */
const checkDiveceList = ref<EquipmentModule.EquipmentItemType[]>([]);

const formRef = ref<FormInstance>();
const formData = ref({
  equipment_type_id: undefined as FormNumType,
  equipment_type_name: "",
});
const equipment_type = ref("");
const tableLoading = ref(false);
/** 设备档案列表table的ref */
const prueTableRef = ref();
const selectTableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});

/** 选择周期弹窗的ref */
const addCycleRef = ref<InstanceType<typeof AddCycle>>();
/** 选择标准列表弹窗开关 */
const standardListVisible = ref(false);

const cycleMonthGroup = ref<CycleMonthGroupType>({});

const currentCycleType = ref(-1);
/** 点击添加保养标准时,记录是那个周期key */
const currentCycleKey = ref("");
/** 设置提醒时间的集合 */
const cycleNoticeGroup = ref<CycleNoticeGroupType>({});
/** 设置提醒时间最大值的集合 */
const noticeMaxGroup = ref<CycleNoticeGroupType>({});

/** 标准列表的ids数组 */
const standardIds = computed(() => {
  let cycleList = cycleMonthGroup.value[currentCycleKey.value];
  return cycleList ? cycleList.map((item) => item.maintenance_project_id) : [];
});

const rules = reactive<FormRules>({
  equipment_type_id: [
    {
      required: true,
      message: "请选择资产类型",
      trigger: "change",
    },
  ],
});

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
/** 根据key获取周期类型文本 */
function getCycleTypeName(groupName: string) {
  const match = groupName.match(/\d+/); // \d+ 匹配一个或多个数字
  if (match) {
    return match[0] + "个月";
  } else {
    return "个月";
  }
}

/** 根据key获取周期类型-返回number格式 */
// function getCycleType(groupName: string) {
//   const match = groupName.match(/\d+/); // \d+ 匹配一个或多个数字
//   if (match) {
//     return match[0] ? Number(match[0]) : 0;
//   } else {
//     return 0;
//   }
// }

const dialogOptions = {
  width: "60%",
  btnClass: "w-[80px]",
  draggable: true,
  closeOnClickModal: false,
  closeOnPressEscape: false,
  btnLoading: false,
  showClose: false,
};

// 点击新增周期
const handleAddCycle = async () => {
  const result = await formRef.value!.validate((valid, fields) => {
    if (valid) {
      console.log("submit~~~");
      return true;
    } else {
      console.log("error!");
      return false;
    }
  });

  if (!result) return;
  // if (checkDiveceList.value.length === 0) {
  //   ElMessage.warning("请先勾选设备");
  //   return;
  // }
  addDialog({
    ...dialogOptions,
    title: "新增周期标准",
    contentRenderer: () =>
      h(AddCycle, {
        ref: addCycleRef,
        cycleType: currentCycleType.value,
        treeList: treeData.value,
        userList: userList.value,
      }),
    beforeCancel: (done) => {
      console.log("点击了取消按钮");
      done();
    },
    beforeSure: async (done) => {
      let result = await addCycleRef.value?.validate();
      // console.log("🚀 ~ beforeSure: ~ result:", result);
      if (result) {
        let { cycleType, tableList } = addCycleRef.value!.getCycleData();
        currentCycleType.value = cycleType as number;
        // console.log("🚀 ~ beforeSure: ~ cycleType:", cycleType);
        cycleMonthGroup.value[`cycle_month${cycleType}`] = tableList;
        cycleNoticeGroup.value[`cycle_month${cycleType}`] = 0;
        noticeMaxGroup.value[`cycle_month${cycleType}`] = getNoticeMax(currentCycleType.value);
        done();
      }
    },
  });
};

function getNoticeMax(cycleType: number) {
  if (cycleType <= 6) {
    return cycleType * 30 - 1;
  } else {
    return 180;
  }
}

/** 点击新增保养标准时的处理事件 */
const handleAddStandard = (groupName: string) => {
  currentCycleKey.value = groupName;
  standardListVisible.value = true;
};

/** 监听选择标准弹窗-点击确认选择事件 */
function standardSelectchange(selectData: MaintainProjectItem[]) {
  let dataLength = selectData.length;
  let cycleName = getCycleTypeName(currentCycleKey.value);
  let cycleList = cycleMonthGroup.value[currentCycleKey.value];
  selectData.forEach((item) => {
    cycleList.push({
      maintenance_project_id: item.id,
      name: item.name,
      maintenance_requirements: item.maintenance_requirements,
      maintenance_area: item.maintenance_area,
      equipment_title: item.equipment_title,
      note: item.note,
      cycle_name: cycleName,
      plan_start_time: cycleList[0].plan_start_time,
      director_name: cycleList[0].director_name,
      director_uid: cycleList[0].director_uid,
      other_name: cycleList[0].other_name,
      other_uid: cycleList[0].other_uid,
    });
  });
  ElMessage.success(`${cycleName}循环周期已批量添加${dataLength}条数据`);
}

/** 单元格点击删除 */
function cellDelete(row: CycleListType, groupName: string) {
  cycleMonthGroup.value[groupName] = cycleMonthGroup.value[groupName].filter((item) => {
    return item.maintenance_project_id !== row.maintenance_project_id;
  });
  if (cycleMonthGroup.value[groupName].length === 0) {
    delete cycleMonthGroup.value[groupName];
  }
}
/** 点击删除周期 */
function handleDelCycle(groupName: string) {
  let cycleName = getCycleTypeName(groupName);

  ElMessageBox.confirm(`确认要删除：【${cycleName}周期】的所有内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      cycleMonthGroup.value[groupName] = [];
      delete cycleMonthGroup.value[groupName];
      console.log("🚀 ~ .then ~  cycleMonthGroup.value:", cycleMonthGroup.value);

      cycleNoticeGroup.value[groupName] = 0;
      delete cycleNoticeGroup.value[groupName];

      noticeMaxGroup.value[groupName] = 1;
      delete noticeMaxGroup.value[groupName];
    })
    .catch((error) => {
      console.log(error);
    });
}

const confirmRule = [
  [() => checkDiveceList.value.length === 0, () => "您未选择设备,请选择设备"],
  [() => Object.keys(cycleMonthGroup.value).length === 0, () => "您未添加保养周期,请添加保养周期"],
];

/** 点击确定 */
const handleConfirm = () => {
  formRef.value!.validate(async (valid, fields) => {
    if (valid) {
      const target = confirmRule.find((m) => m[0]!());
      console.log("🚀 ~ formRef.value!.validate ~ target:", target);
      if (target) {
        let hint = target[1]!();
        ElMessage.warning(`${hint}`);
        return;
      }
      console.log("cycleMonthGroup.value", cycleMonthGroup.value);
      // return
      let data = {
        equipment_ids: checkDiveceList.value.map((m) => m.id).join(","),
        equipment_type_id: formData.value.equipment_type_id,
        equipment_type_title: formData.value.equipment_type_name,
        cycle: cycleMonthGroup.value,
        cycle_notice: cycleNoticeGroup.value,
      };
      console.log("🚀 ~ formRef.value!.validate ~ data:", data);
      const result = await getMaintainPlanAddApi(data);
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
            path: "/device/maintain/plan",
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
};

// 点击返回
function pageBack() {
  router.replace({
    path: "/device/maintain/plan",
  });
}

const initTagsView = () => {
  // id存在表示是编辑
  pageType.value = listId.value ? 2 : 1;
  const title = headerTitle.value;
  const new_route = Object.assign({}, route, {
    title,
  });
  tagsViewStore.updateVisitedView(new_route);
};

onActivated(() => {
  getTypeList();
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <el-form :model="formData" ref="formRef" :rules="rules">
        <div class="header-title">
          <span>{{ headerTitle }}</span>
        </div>
        <el-card shadow="never" class="mb-6">
          <template #header>计划信息</template>
          <el-form-item label="资产类型" class="w-[50%]" prop="type">
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
          <template #header>批投保养标准</template>
          <el-button type="primary" @click="handleAddCycle">新增周期</el-button>
          <el-divider />

          <div class="mb-6" v-for="(value, key) in cycleMonthGroup" :key="key">
            <div class="flex justify-between mb-2">
              <div class="flex items-center">
                <span>{{ getCycleTypeName(key as string) }}</span>
                <el-button
                  type="primary"
                  size="default"
                  @click="handleAddStandard(key as string)"
                  class="mx-4"
                >
                  添加保养标准
                </el-button>
                <div>
                  <span>提醒时间(天):</span>
                  <el-input-number
                    v-model.number="cycleNoticeGroup[key]"
                    :min="0"
                    :max="noticeMaxGroup[key]"
                    :step="1"
                    :controls="true"
                    class="ml-4 mr-4"
                  ></el-input-number>
                  <span class="text-gray-400 text-[12px]">
                    默认0不提醒，仅到计划执行时间到时通知
                  </span>
                </div>
              </div>
              <el-button type="primary" size="default" @click="handleDelCycle(key as string)" link>
                删除周期
              </el-button>
            </div>
            <pure-table
              header-cell-class-name="table-gray-header"
              @selection-change="deviceCheck"
              row-key="id"
              :columns="cycleColumns"
              :data="value"
            >
              <template #operation="scope">
                <el-button type="warning" link @click="cellDelete(scope.row, key as string)">
                  删除
                </el-button>
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
    <StandardList
      ref="standardListRef"
      v-model="standardListVisible"
      :ids="standardIds"
      :treeList="treeData"
      @change="standardSelectchange"
    ></StandardList>
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
