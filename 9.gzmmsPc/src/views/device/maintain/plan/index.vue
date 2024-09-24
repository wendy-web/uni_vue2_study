<script setup lang="ts">
/* 维保管理-保养计划-列表页面 */
import {
  getMaintainPlanApi,
  getMaintainPlanDelApi,
  updEnableStatusApi,
} from "@/api/device/maintain/plan/index";
import type { MaintainPlanItem } from "@/api/device/maintain/plan/types";
import CommonSelect from "@/components/DeptSelect/CommonSelect.vue";
import PlaceSelect from "@/components/DeptSelect/PlaceSelect.vue";
import TreeSelect from "@/components/DeptSelect/TreeSelect.vue";
import DeptSelect from "@/components/DeptSelect/index.vue";
import { useBaseData } from "@/hooks/device/baseData";
import { useUserStoreHook } from "@/store/modules/user";
import { isArray } from "@pureadmin/utils";
import type { FormInstance } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import PlanDetail from "./components/planDetail.vue";
import { useList } from "./utils/hook";

defineOptions({
  name: "deviceMaintainPlan",
});

const router = useRouter();
const userStore = useUserStoreHook();

const { getBase, treeData, userList, departmentList, placeList } = useBaseData();
const { columns, searchColumns, pagination, filterList } = useList();
const formData = ref({
  keyword: "",
  create_time: "", // 创建时间
  // last_maintenance_time: "", //上次保养时间
  next_maintenance_time: "", //下次保养时间
  save_addr_id: undefined as FormNumType, // 使用位置
  use_dept_id: undefined as FormNumType, // 使用部门
  equipment_type_id: undefined as FormNumType, // 资产类型
  status: undefined as FormNumType, // 状态
  ct_uid: undefined as FormNumType, // 创建人
  director_uid: undefined as FormNumType, // 保养负责人
  is_advent: undefined as FormNumType, // 是否筛选临期任务
});
const formRef = ref();
const tableData = ref<MaintainPlanItem[]>([]);
const tableLoading = ref(false);
const prueTableRef = ref();

const detailVisible = ref(false);
const listId = ref(0);

function isCreateUser(uid: number) {
  return uid === userStore.uid;
}

const handleSearch = () => {
  getData();
};
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  formData.value.is_advent = 0;
  getData();
};

async function getData() {
  const {
    create_time,
    //  last_maintenance_time,
    next_maintenance_time,
    ...rest
  } = formData.value;
  let data = {
    ...rest,
    page: pagination.currentPage,
    size: pagination.pageSize,
    create_time_start: isArray(create_time) ? create_time[0] : "",
    create_time_end: isArray(create_time) ? create_time[1] : "",
    // last_maintenance_time_start: isArray(last_maintenance_time) ? last_maintenance_time[0] : "",
    // last_maintenance_time_end: isArray(last_maintenance_time) ? last_maintenance_time[1] : "",
    next_maintenance_time_start: isArray(next_maintenance_time) ? next_maintenance_time[0] : "",
    next_maintenance_time_end: isArray(next_maintenance_time) ? next_maintenance_time[1] : "",
  };
  tableLoading.value = true;
  const result = await getMaintainPlanApi(data);
  tableData.value = result.data.list;
  pagination.total = result.data.total;
  tableLoading.value = false;
}

const handleAdd = () => {
  router.push({
    path: "/device/maintain/plan/add",
  });
};

/** 单元格点击详情 */
const cellDetail = (row: MaintainPlanItem) => {
  listId.value = row.id;
  detailVisible.value = true;
};

/** 单元格点击编辑 */
const cellEdit = (row: MaintainPlanItem) => {
  router.push({
    path: "/device/maintain/plan/edit",
    query: {
      id: row.id,
    },
  });
};

/** 单元格点击停用 */
function cellStop(row: MaintainPlanItem) {
  // status 1 停用
  ElMessageBox.confirm(
    `确认要停用计划明细单号为：【${row.plan_details_no}】的该条内容吗?`,
    "警告",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  )
    .then(async () => {
      const result = await updEnableStatusApi({ id: row.id, status: 1 });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
}
/** 单元格点击启用 */
async function cellStart(row: MaintainPlanItem) {
  // status 0 启用 1 停用
  const result = await updEnableStatusApi({ id: row.id, status: 0 });
  ElMessage.success(result.msg);
  getData();
}

/** 单元格点击执行 */
const cellExecute = (row: MaintainPlanItem) => {
  router.push({
    path: "/device/maintain/work-order/add",
    query: {
      planId: row.id,
    },
  });
};

/** 单元格点击删除 */
const cellDel = (row: MaintainPlanItem) => {
  ElMessageBox.confirm(
    `确认要删除计划明细单号为：【${row.plan_details_no}】的该条内容吗?`,
    "警告",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  )
    .then(async () => {
      const result = await getMaintainPlanDelApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
};
const route = useRoute();
watch(
  () => route,
  (newValue, oldValue) => {
    formData.value.is_advent = newValue.query.is_advent ? Number(newValue.query.is_advent) : 0;
  },
  { immediate: true, deep: true},
);
onActivated(() => {
  getData();
  getBase();
  prueTableRef.value?.setAdaptive();
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <PlusSearch v-model="formData" :columns="searchColumns" :showNumber="5" ref="formRef">
        <template #plus-field-equipment_type_id>
          <TreeSelect :list="treeData" v-model="formData.equipment_type_id"></TreeSelect>
        </template>
        <template #plus-field-save_addr_id>
          <!-- 选择使用位置 -->
          <PlaceSelect v-model="formData.save_addr_id" :placeList="placeList"></PlaceSelect>
        </template>
        <template #plus-field-use_dept_id>
          <!-- 选择使用部门 -->
          <DeptSelect :department-list="departmentList" v-model="formData.use_dept_id"></DeptSelect>
        </template>
        <template #plus-field-director_uid>
          <!-- 选择保养负责人 -->
          <CommonSelect v-model="formData.director_uid" :list="userList"></CommonSelect>
        </template>
        <template #plus-field-ct_uid>
          <!-- 选择创建人 -->
          <CommonSelect v-model="formData.ct_uid" :list="userList"></CommonSelect>
        </template>

        <template #footer="{ handleUnfold, isShowUnfold }">
          <FormBtn
            @search="handleSearch"
            @reset="handleReset(formRef?.plusFormInstance.formInstance)"
          >
            <template #fold>
              <el-button @click="handleUnfold">
                <template #icon>
                  <i-ep-ArrowUp v-if="isShowUnfold"></i-ep-ArrowUp>
                  <i-ep-ArrowDown v-else></i-ep-ArrowDown>
                </template>
                {{ isShowUnfold ? "收起" : "展开" }}
              </el-button>
            </template>
          </FormBtn>
        </template>
      </PlusSearch>
    </div>
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch" :filter-list="filterList">
        <template #buttons>
          <el-button type="primary" @click="handleAdd" v-hasPerm="['maintain:plan:add']">
            <template #icon>
              <i-ep-plus></i-ep-plus>
            </template>
            新建
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="prueTableRef"
            row-key="id"
            :data="tableData"
            :columns="dynamicColumns"
            :size="size"
            adaptive
            :adaptiveConfig="{ offsetBottom: 120 }"
            header-cell-class-name="table-gray-header"
            :pagination="pagination"
            :paginationSmall="size === 'small' ? true : false"
            @page-size-change="getData()"
            @page-current-change="getData()"
            :loading="tableLoading"
          >
            <template #operation="{ row }">
              <el-button
                link
                type="primary"
                @click="cellDetail(row)"
                v-hasPerm="['maintain:plan:detail']"
              >
                详情
              </el-button>
              <el-button
                link
                type="primary"
                @click="cellExecute(row)"
                v-if="[0, 1].includes(row.status)"
                v-hasPerm="['maintain:workorder:add']"
              >
                执行计划
              </el-button>
              <template v-if="row.status === 0 || row.status === 4">
                <el-button
                  link
                  type="primary"
                  @click="cellEdit(row)"
                  v-hasPerm="['maintain:plan:edit']"
                >
                  编辑
                </el-button>
              </template>
              <template v-if="row.status === 0 || row.status === 1">
                <el-button
                  link
                  type="warning"
                  @click="cellStop(row)"
                  v-hasPerm="['maintain:plan:enable']"
                >
                  停用
                </el-button>
              </template>
              <template v-if="row.status === 4">
                <el-button
                  link
                  type="primary"
                  @click="cellStart(row)"
                  v-hasPerm="['maintain:plan:enable']"
                >
                  启用
                </el-button>
                <template v-if="isCreateUser(row.ct_uid)">
                  <el-button
                    link
                    type="info"
                    @click="cellDel(row)"
                    v-hasPerm="['maintain:plan:del']"
                  >
                    删除
                  </el-button>
                </template>
              </template>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
    <!-- :listId="listId" -->
    <PlanDetail v-model:visible="detailVisible" :listId="listId"></PlanDetail>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/common.scss";
</style>
