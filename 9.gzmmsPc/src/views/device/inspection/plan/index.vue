<script setup lang="ts">
/* 点巡检管理-点巡检计划-列表页面 */
import {
  getInspectionPlanDelApi,
  getInspectionPlanListApi,
  getInspectionPlanSetApi
} from "@/api/device/inspection/plan/index";
import type { InspectionItemType } from "@/api/device/inspection/plan/types";
import TreeSelect from "@/components/DeptSelect/TreeSelect.vue";
import DeptSelect from "@/components/DeptSelect/index.vue";
import { isCreateUser } from "@/utils/auth";
import { isArray } from "@pureadmin/utils";
import type { FormInstance } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import PlanDetail from "./components/planDetail.vue";
import { useList } from "./utils/hook";

defineOptions({
  name: "deviceInspectionPlan",
});

const router = useRouter();

const { columns, searchColumns, pagination, treeData, departmentList, getBase,filterList } = useList();
const formData = ref({
  keyword: "", //关键字
  equipment_type_id: undefined as FormNumType, //资产类型
  use_dept_id: undefined as FormNumType, //使用部门
  cycle_type: undefined as FormNumType, //循环周期
  status: undefined as FormNumType, //计划状态
  executor_uid: undefined as FormNumType, //计划执行人
  create_time: "",
  is_advent: undefined as FormNumType, // 是否筛选临期任务
});
const formRef = ref();
const tableData = ref<InspectionItemType[]>([]);
const tableLoading = ref(false);
const prueTableRef = ref();
const listId = ref(0);
const detailVisible = ref(false);

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
  let { create_time, ...rest } = formData.value;

  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    create_time_start: isArray(create_time) ? create_time[0] : "",
    create_time_end: isArray(create_time) ? create_time[1] : "",
    ...rest,
  };
  tableLoading.value = true;
  const result = await getInspectionPlanListApi(data);
  tableData.value = result.data.list;
  pagination.total = result.data.total;
  tableLoading.value = false;
}

/** 点击新建 */
function handleAdd() {
  router.push({
    path: "/device/inspection/plan/add",
  });
}

/** 单元格点击详情 */
const cellDetail = (row: InspectionItemType) => {
  listId.value = row.id;
  detailVisible.value = true;
};

/** 单元格点击编辑 */
const cellEdit = (row: InspectionItemType) => {
  router.push({
    path: "/device/inspection/plan/edit",
    query: {
      id: row.id,
    },
  });
};

/** 单元格点击停用 */
function cellStop(row: InspectionItemType){
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
      const result = await getInspectionPlanSetApi({ id: row.id, status: 1 });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });


}
/** 单元格点击启用 */
async function cellStart(row:InspectionItemType){
  // status 0 启用 1 停用
  const result = await getInspectionPlanSetApi({id:row.id,  status: 0})
  ElMessage.success(result.msg);
  getData()
}

/** 单元格点击执行 */
const cellExecute = (row: InspectionItemType) => {
  router.push({
    path: "/device/inspection/record/add",
    query: {
      planId: row.id,
    },
  });
};

/** 单元格点击删除 */
const cellDel = (row: InspectionItemType) => {
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
      const result = await getInspectionPlanDelApi({ id: row.id });
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
  getBase();
  getData();
  prueTableRef.value?.setAdaptive();
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        :showNumber="6"
        :colProps="{ span: 6 }"
        ref="formRef"
      >
        <template #plus-field-equipment_type_id>
          <TreeSelect :list="treeData" v-model="formData.equipment_type_id"></TreeSelect>
        </template>
        <template #plus-field-use_dept_id>
          <!-- 选择使用部门 -->
          <DeptSelect :department-list="departmentList" v-model="formData.use_dept_id"></DeptSelect>
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
          <el-button type="primary" @click="handleAdd" v-hasPerm="['inspection:plan:add']">
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
              <el-button link type="primary" @click="cellDetail(row)" v-hasPerm="['inspection:plan:detail']">详情</el-button>
              <el-button link type="primary" @click="cellExecute(row)" v-if="row.status === 1" v-hasPerm="['inspection:record:addedit']">执行检查</el-button>
              <template v-if="row.status === 0 || row.status === 4">
                <el-button link type="primary" @click="cellEdit(row)" v-hasPerm="['inspection:plan:edit']">编辑</el-button>
              </template>
               <template v-if="row.status === 0 || row.status === 1">
                <el-button link type="warning" @click="cellStop(row)" v-hasPerm="['inspection:plan:enable']">停用</el-button>
              </template>
              <template v-if="row.status === 4"">
                <el-button link type="primary" @click="cellStart(row)" v-hasPerm="['inspection:plan:enable']">启用</el-button>
                <template v-if="isCreateUser(row.ct_uid)">
                  <el-button link type="info" @click="cellDel(row)" v-hasPerm="['inspection:plan:del']">删除</el-button>
                </template>
              </template>
                
             
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
    <PlanDetail v-model="detailVisible" :listId="listId"></PlanDetail>
  </div>
</template>
<style lang="scss" scoped></style>
