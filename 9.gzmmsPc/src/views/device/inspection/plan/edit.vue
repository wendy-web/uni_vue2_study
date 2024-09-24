<script setup lang="ts">
import { type FormInstance, resultProps } from "element-plus";
import dayjs from "dayjs";
import { useRoute, useRouter } from "vue-router";
import type { InspecItemType } from "@/api/device/common/types";
import {
  getInspectionPlanDetailApi,
  getInspectionPlanEditApi,
} from "@/api/device/inspection/plan/index";
import { useBaseData } from "@/hooks/device/baseData";
import { useEditHooks } from "@/hooks/edit";
import { useTagsViewStore } from "@/store/modules/tagsView";
import InspecList from "./components/inspecList.vue";
import { useEdit } from "./utils/edit";

defineOptions({
  name: "deviceInspectionPlanEdit",
});
const { isReqDetail } = useEditHooks();
const router = useRouter();
const route = useRoute();
const tagsViewStore = useTagsViewStore();
const { getTypeList, treeData } = useBaseData();
const { formData, formColumns, deviceColumns, rules, standardColumns } = useEdit();

const inspecListRef = ref<InstanceType<typeof InspecList>>();
const inspecListVisible = ref(false);
const standardList = ref<any[]>([]);
const inspecIds = computed(() => {
  return standardList.value.map((item) => item?.inspect_item_id);
});

const PlusformRef = ref();
const formRef = computed(() => {
  return PlusformRef.value.formInstance as FormInstance;
});
const listId = ref(0);
const dataLoading = ref(false);
const deviceData = ref();

/** 资产类型id */
const equipment_type_id = ref<number>();
/** 资产类型名称 */
const equipment_type_title = ref("");
/**  */
const equipment_id = ref<number>();

function getNoticeMax(cycleType?: number) {
  if (cycleType == 1) {
    // 如果循环周期为每月
    let rule_type = formData.value.executive_rule_type;
    if (rule_type == 0) {
      // 30-1
      return 29;
    } else {
      let plan_start_time = formData.value.plan_start_time;
      console.log("🚀 ~ noticeMonthMax ~ plan_start_time:", plan_start_time);
      let curren_day = dayjs(plan_start_time).date();
      let maxDay = curren_day - 1;
      return maxDay;
    }
  } else if (cycleType == 2) {
    // 如果循环周期为每季
    return 89;
  }
}

function clickAdd() {
  inspecListVisible.value = true;
}

function cellDel(row: any) {
  standardList.value = standardList.value.filter((item) => {
    return item.inspect_item_id !== row.inspect_item_id;
  });
}

/** 监听选择标准弹窗-点击确认选择事件 */
function standardSelectchange(selectData: InspecItemType[]) {
  let dataLength = selectData.length;

  let arr = selectData.map((item) => {
    let { id, ...rest } = item;
    return {
      addId: item.id,
      inspect_item_id: item.id,
      ...rest,
    };
  });

  standardList.value = standardList.value.concat(arr);
  console.log("🚀 ~ standardSelectchange ~ standardList.value:", standardList.value);

  ElMessage.success(`已批量添加${dataLength}条数据`);
  inspecListRef.value?.setStatus();
}

async function getData() {
  dataLoading.value = true;
  const result = await getInspectionPlanDetailApi({ id: listId.value });
  let data = result.data;
  deviceData.value = data.equipment;
  deviceData.value.equipment_type_title = data.equipment_type_title;
  standardList.value = data.cycle ?? [];

  equipment_id.value = data.equipment_id;
  equipment_type_id.value = data.equipment_type_id;
  equipment_type_title.value = data.equipment_type_title;

  formData.value.is_must_pho = data.is_must_pho;
  formData.value.is_must_sig = data.is_must_sig;

  formData.value.plan_details_no = data.plan_details_no;
  formData.value.plan_start_time = data.plan_start_time;
  formData.value.cycle_type = data.cycle_type;
  formData.value.executive_rule_type = data.executive_rule_type;
  formData.value.plan_end_time = data.plan_end_time;
  formData.value.notice_day = data.notice_day;

  formData.value.executor_uid = data.executor_uid
    ? data.executor_uid.split(",").map((m) => Number(m))
    : [];

  dataLoading.value = false;
}

async function handleConfirm() {
  const vaildateRes = await formRef.value.validate();
  if (!vaildateRes) return;

  let data = {
    id: listId.value,
    equipment_type_id: equipment_type_id.value,
    equipment_type_title: equipment_type_title.value,
    equipment_id: equipment_id.value,
    plan_start_time: formData.value.plan_start_time,
    cycle_type: formData.value.cycle_type,
    cycle_item: changeStandardList(),
  };
  console.log("data", data);

  const result = await getInspectionPlanEditApi(data);
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
}

function changeStandardList() {
  return standardList.value.map((item) => {
    let { addId } = item;
    if (addId) {
      return {
        inspect_item_id: item.addId,
        executor_uid: formData.value.executor_uid.join(","),
        is_must_pho: formData.value.is_must_pho,
        is_must_sig: formData.value.is_must_sig,
        plan_start_time: formData.value.plan_start_time,
        notice_day: formData.value.notice_day,
      };
    } else {
      return {
        id: item.id,
        inspect_item_id: item.inspect_item_id,
        executor_uid: formData.value.executor_uid.join(","),
        is_must_pho: formData.value.is_must_pho,
        is_must_sig: formData.value.is_must_sig,
        plan_start_time: formData.value.plan_start_time,
        notice_day: formData.value.notice_day,
      };
    }
  });
}

// 点击返回
function pageBack() {
  router.replace({
    path: "/device/inspection/plan",
  });
}

onActivated(() => {
  listId.value = Number(route.query.id) || 0;
  if (listId.value && isReqDetail.value) {
    getData();
  }
  if (listId.value) {
    getTypeList();
  } else {
    const currentTag = router.currentRoute.value;
    tagsViewStore.delView(currentTag);
    router.replace({
      path: "/device/maintain/plan",
    });
  }
});
</script>
<template>
  <div class="app-container">
    <div class="app-card" v-loading="dataLoading">
      <div class="header-title">
        <span>编辑点巡检计划</span>
      </div>
      <el-card shadow="never" class="mb-6" header="计划基本信息">
        <PlusForm
          ref="PlusformRef"
          v-model="formData"
          :columns="formColumns"
          labelWidth="110"
          :row-props="{ gutter: 20 }"
          :col-props="{
            span: 8,
          }"
          :hasFooter="false"
          :rules="rules"
        >
          <template #plus-field-notice_day>
            <div>
              <el-input-number
                v-model.number="formData.notice_day"
                :min="0"
                :max="getNoticeMax(formData.cycle_type)"
                :step="1"
                :controls="true"
                class="ml-4 mr-4"
              ></el-input-number>
              <span class="text-gray-400 text-[12px]">默认0不提醒，仅到计划执行时间到时通知</span>
            </div>
          </template>
        </PlusForm>
      </el-card>
      <el-card shadow="never" class="mb-6" header="设备和检查项目">
        <div class="mb-6">
          <div class="flex mb-2">
            <span>设备信息</span>
          </div>
          <PlusDescriptions :column="3" :columns="deviceColumns" :data="deviceData" />
        </div>
        <div>
          <div class="flex items-center mb-4">
            <span>检查项目</span>
            <el-button type="primary" @click="clickAdd" class="ml-4">添加检查项</el-button>
          </div>
          <pure-table
            header-cell-class-name="table-gray-header"
            :data="standardList"
            :columns="standardColumns"
          >
            <template #operation="{ row }">
              <el-button type="primary" link @click="cellDel(row)">删除</el-button>
            </template>
          </pure-table>
        </div>
      </el-card>
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
.app-card {
  height: calc(100vh - 180px);
  overflow-y: auto;
  padding-top: 0;
  .header-title {
    position: sticky;
    top: 0px;
    background-color: #fff;
    z-index: 1;
    height: 46px;
    display: flex;
    align-items: center;
    border-bottom: 2px solid #e5e5e5;
  }
}
</style>
