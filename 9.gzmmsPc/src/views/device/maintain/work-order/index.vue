<script setup lang="ts">
/* 维保管理-保养工单任务-列表页面 */
import type { FormInstance } from "element-plus";
import dayjs from "dayjs";
import type { FieldValues } from "plus-pro-components";
import { useRouter } from "vue-router";
import {
  getMaintainWorkApi,
  getMaintainWorkApproveApi,
  getMaintainWorkRecallApi,
  getMaintainWorkRejectApi,
  getMaintainWorkSubmitApi,
} from "@/api/device/maintain/work-order/index";
import type { WorkOrderItemType } from "@/api/device/maintain/work-order/types";
import { useBaseData } from "@/hooks/device/baseData";
import { useListHooks } from "@/hooks/list";
import { useList } from "./utils/hook";

defineOptions({
  name: "deviceMaintainWorkorder",
});

const router = useRouter();

const {
  columns,
  searchColumns,
  pagination,
  submitColumns,
  submitRules,
  checkAssocType,
  submitFormData,
  submitVisible,
  filterList,
} = useList();
const { getBase, treeData, userList, departmentList, placeList } = useBaseData();
const formData = ref({
  keyword: "",
  equipment_type_id: undefined as FormNumType, // 资产类型
  save_addr_id: undefined as FormNumType, // 使用位置
  use_dept_id: undefined as FormNumType, // 使用部门
  status: undefined as FormNumType, // 状态
  director_uid: undefined as FormNumType, // 保养负责人
  plan_start_time: "", //计划开始时间
});

useListHooks(formData);
const formRef = ref();
const tableData = ref<WorkOrderItemType[]>([]);
const prueTableRef = ref();

const listId = ref(0);

const handleSearch = () => {
  getData();
};
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  formData.value.status = undefined;
  getData();
};

async function getData() {
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    ...formData.value,
  };
  const result = await getMaintainWorkApi(data);
  tableData.value = result.data.list;
  pagination.total = result.data.total;
}

/** 单元格点击详情 */
function cellDetail(row: any) {
  console.log("🚀 ~ cellDetail ~ row:", row);
  router.push({
    path: "/device/maintain/work-order/detail",
    query: {
      id: row.id,
    },
  });
}

/** 单元格点击编辑 */
function cellEdit(row: any) {
  console.log("🚀 ~ cellDetail ~ row:", row);
  router.push({
    path: "/device/maintain/work-order/add",
    query: {
      id: row.id,
    },
  });
}

/** 单元格点击提交验收 */
function cellSubmit(row: any) {
  listId.value = row.id;
  submitVisible.value = true;
  submitFormData.value.maintenance_start_time = row.maintenance_start_time
    ? row.maintenance_start_time
    : dayjs().format("YYYY-MM-DD HH:mm");
  submitFormData.value.complete_time = row.complete_time
    ? row.complete_time
    : dayjs().format("YYYY-MM-DD HH:mm");
}

async function submitConfirm(values: FieldValues) {
  submitVisible.value = false;
  console.log("🚀 ~ submitConfirm ~ values:", values);
  const reuslt = await getMaintainWorkSubmitApi({ id: listId.value, ...values });
  ElMessage.success(reuslt.msg);
  getData();
}

/** 单元格点击验证通过 */
async function cellApprove(row: any) {
  const reuslt = await getMaintainWorkApproveApi({ id: row.id });
  ElMessage.success(reuslt.msg);
  getData();
}

/** 单元格点击驳回返工 */
async function cellReject(row: any) {
  const reuslt = await getMaintainWorkRejectApi({ id: row.id });
  ElMessage.success(reuslt.msg);
  getData();
}

/** 单元格点击撤回 */
async function cellRecall(row: any) {
  const reuslt = await getMaintainWorkRecallApi({ id: row.id });
  ElMessage.success(reuslt.msg);
  getData();
}

/** 单元格点击作废 */
// async function cellVoid(row: any) {}

/** 单元格点击删除 */
// function cellDel(row: any) {
//   ElMessageBox.confirm(
//     `确认要删除保养单号为：【${row.maintenance_order_no}】的该条内容吗?`,
//     "警告",
//     {
//       confirmButtonText: "确定",
//       cancelButtonText: "取消",
//       type: "warning",
//     },
//   )
//     .then(async () => {
//       // const result = await xcxxx({ id: row.id });
//       // ElMessage.success(result.msg);
//       getData();
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// }

onActivated(() => {
  getData();
  getBase();
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
        :rowProps="{ gutter: 20 }"
        :colProps="{ span: 4.8 }"
        ref="formRef"
      >
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
        <template #footer>
          <FormBtn
            @search="handleSearch"
            @reset="handleReset(formRef?.plusFormInstance.formInstance)"
          ></FormBtn>
        </template>
      </PlusSearch>
    </div>
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch" :filter-list="filterList">
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="prueTableRef"
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
          >
            <template #operation="{ row }">
              <el-button
                type="primary"
                link
                @click="cellDetail(row)"
                v-hasPerm="['maintain:workorder:detail']"
              >
                详情
              </el-button>
              <!-- 当前是创建人的时候 -->
              <template v-if="checkAssocType(row.assoc_type, 1)">
                <!-- 如果是待提审,已撤回,已驳回状态时, 显示编辑和提审和作废  -->
                <template v-if="row.status === 0 || row.status === 3 || row.status === 4">
                  <el-button
                    type="primary"
                    link
                    @click="cellEdit(row)"
                    v-hasPerm="['maintain:workorder:edit']"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="primary"
                    link
                    @click="cellSubmit(row)"
                    v-hasPerm="['maintain:workorder:submit']"
                  >
                    提交验收
                  </el-button>
                  <!-- <el-button type="info" link @click="cellVoid(row)">作废</el-button> -->
                </template>
                <!-- 如果是待审核状态时,显示撤回按钮 -->
                <template v-else-if="row.status === 1">
                  <el-button
                    type="info"
                    link
                    @click="cellRecall(row)"
                    v-hasPerm="['maintain:workorder:recall']"
                  >
                    撤回
                  </el-button>
                </template>
                <!-- 如果是待审核状态时, 显示删除按钮 -->
                <!-- <template v-else-if="row.status === 5"> -->
                <!-- <el-button type="info" link @click="cellDel(row)">删除</el-button> -->
                <!-- </template> -->
              </template>

              <template v-if="checkAssocType(row.assoc_type, 2)">
                <!-- 如果是待审核状态 -->
                <template v-if="row.status === 1">
                  <el-button
                    type="success"
                    link
                    @click="cellApprove(row)"
                    v-hasPerm="['maintain:workorder:approve']"
                  >
                    验收通过
                  </el-button>
                  <el-button
                    type="info"
                    link
                    @click="cellReject(row)"
                    v-hasPerm="['maintain:workorder:reject']"
                  >
                    驳回返工
                  </el-button>
                </template>
              </template>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
    <PlusDialogForm
      :dialog="{
        title: '确认提交验收',
        cancelText: '取消',
        confirmText: '确定提交',
        draggable: true,
        top: '20vh',
      }"
      v-model:visible="submitVisible"
      v-model="submitFormData"
      :form="{ columns: submitColumns, rules: submitRules }"
      @confirm="submitConfirm"
    />
  </div>
</template>
<style lang="scss" scoped></style>
