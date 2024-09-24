<script setup lang="ts">
import type { FormInstance } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { getMaintainPlanDetailApi, getMaintainPlanEditApi } from "@/api/device/maintain/plan/index";
import { useBaseData } from "@/hooks/device/baseData";
import { useEditHooks } from "@/hooks/edit";
import { userListHooks } from "@/hooks/index";
import { useTagsViewStore } from "@/store/modules/tagsView";
import StandardList from "./components/standardList.vue";
import { useEdit } from "./utils/edit";

defineOptions({
  name: "deviceMaintainPlanEdit",
});
const { isReqDetail } = useEditHooks();

const { getTypeList, treeData } = useBaseData();
const router = useRouter();
const route = useRoute();
const tagsViewStore = useTagsViewStore();
const { userList } = userListHooks();
const {
  formData,
  formColumns,
  deviceColumns,
  standardColumns,
  plan_start_time_copy,
  last_start_time,
  getNoticeMax,
} = useEdit();
const PlusformRef = ref();
const formRef = computed(() => {
  return PlusformRef.value.formInstance as FormInstance;
});

const standardListRef = ref<InstanceType<typeof StandardList>>();
const standardListVisible = ref(false);
const standardList = ref<any[]>([]);
const standardIds = computed(() => {
  return standardList.value.map((item) => item?.maintenance_project_id);
});

const deviceData = ref();

/** 资产类型id */
const equipment_type_id = ref<number>();
/** 资产类型名称 */
const equipment_type_title = ref("");
/**  */
const equipment_id = ref<number>();

const listId = ref(0);
const dataLoading = ref(false);

const rules = {
  cycle_type: [
    {
      required: true,
      message: "请选择循环周期",
    },
  ],
  director_uid: [
    {
      required: true,
      message: "请选择保养负责人",
    },
  ],
  other_uid: [
    {
      required: true,
      message: "请选择其他负责人",
    },
  ],
};

function standardSelectchange(selectData: any[]) {
  let dataLength = selectData.length;
  selectData.forEach((item) => {
    standardList.value.push({
      maintenance_project_id: item.id,
      name: item.name,
      maintenance_requirements: item.maintenance_requirements,
      maintenance_area: item.maintenance_area,
      equipment_title: item.equipment_title,
    });
  });
  ElMessage.success(`已批量添加${dataLength}条数据`);
  standardListRef.value?.setStatus();
}

function clickAdd() {
  standardListVisible.value = true;
}

function cellDel(row: any) {
  standardList.value = standardList.value.filter((item) => {
    return item.maintenance_project_id !== row.maintenance_project_id;
  });
}

/* 点击确定时,需要处理下保养标准列表 */
function changeStandardList() {
  return standardList.value.map((item) => {
    let data = {
      maintenance_project_id: item.maintenance_project_id,
      name: item.name,
      maintenance_requirements: item.maintenance_requirements,
      maintenance_area: item.maintenance_area,
      equipment_title: item.equipment_title,
      cycle_type: formData.value.cycle_type,
      director_uid: formData.value.director_uid.join(","),
      other_uid: formData.value.other_uid.join(","),
    };
    return item.id ? { ...data, id: item.id } : data;
  });
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
    director_uid: formData.value.director_uid.join(","),
    other_uid: formData.value.other_uid.join(","),
    notice_day: formData.value.notice_day,
    // equipment: [],
    cycle: changeStandardList(),
  };

  const result = await getMaintainPlanEditApi(data);
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
}

async function getData() {
  dataLoading.value = true;
  const reuslt = await getMaintainPlanDetailApi({ id: listId.value });
  const data = reuslt.data;
  deviceData.value = data.equipment;
  deviceData.value.equipment_type_title = data.equipment_type_title;
  standardList.value = data.cycle_item ?? [];

  equipment_id.value = data.equipment_id;
  equipment_type_id.value = data.equipment_type_id;
  equipment_type_title.value = data.equipment_type_title;
  formData.value.plan_details_no = data.plan_details_no;
  formData.value.plan_start_time = data.plan_start_time;
  formData.value.cycle_type = data.cycle_type;
  formData.value.notice_day = data.notice_day;

  plan_start_time_copy.value = data.plan_start_time;
  last_start_time.value = data.last_start_time || "";

  formData.value.director_uid = data.director_uid
    ? data.director_uid.split(",").map((m) => Number(m))
    : [];
  formData.value.other_uid = data.other_uid ? data.other_uid.split(",").map((m) => Number(m)) : [];

  dataLoading.value = false;
}

// 点击返回
function pageBack() {
  router.replace({
    path: "/device/maintain/plan",
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
        <span>编辑保养计划</span>
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
          <template #plus-field-director_uid>
            <UserSelect
              :list="userList"
              v-model="formData.director_uid"
              multiple
              :valueKey="false"
              :ids="formData.other_uid"
            ></UserSelect>
          </template>
          <template #plus-field-other_uid>
            <UserSelect
              :list="userList"
              v-model="formData.other_uid"
              multiple
              :valueKey="false"
              :ids="formData.director_uid"
            ></UserSelect>
          </template>
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
      <el-card shadow="never" class="mb-6" header="设备和保养标准">
        <div class="mb-6">
          <div class="flex mb-2">
            <span>设备信息</span>
          </div>
          <PlusDescriptions :column="3" :columns="deviceColumns" :data="deviceData" />
        </div>
        <div>
          <div class="flex items-center mb-4">
            <span>保养标准</span>
            <el-button type="primary" @click="clickAdd" class="ml-4">添加标准</el-button>
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
