<script setup lang="ts">
/* 点巡检管理-点巡检记录-列表页面 */
import type { FormInstance } from "element-plus";
import { isArray } from "@pureadmin/utils";
import dayjs from "dayjs";
import type { FieldValues } from "plus-pro-components";
import { useRouter } from "vue-router";
import {
  getInspecRecordApproveApi,
  getInspecRecordListApi,
  getInspecRecordRecallApi,
  getInspecRecordRejectApi,
  getInspecRecordSubmitApi,
} from "@/api/device/inspection/record/index";
import type { InspecRecordItemType } from "@/api/device/inspection/record/types";
import TreeSelect from "@/components/DeptSelect/TreeSelect.vue";
import DeptSelect from "@/components/DeptSelect/index.vue";
import { useListHooks } from "@/hooks/list";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useList } from "./utils/hook";

defineOptions({
  name: "deviceInspectionRecord",
});

const useSetting = useSettingsStoreHook();
const router = useRouter();
const {
  columns,
  searchColumns,
  pagination,
  treeData,
  departmentList,
  getBase,
  checkAssocType,
  submitFormData,
  submitVisible,
  submitColumns,
  submitRules,
  filterList
} = useList();
const formData = ref({
  keyword: "", //关键字
  equipment_type_id: undefined as FormNumType, //资产类型
  use_dept_id: undefined as FormNumType, //使用部门
  status: undefined as FormNumType, //计划状态
  executor_uid: undefined as FormNumType, //执行人
  ct_uid: undefined as FormNumType, //创建人
  create_time: "",
});
useListHooks(formData);
const formRef = ref();
const tableData = ref<InspecRecordItemType[]>([]);
const tableLoading = ref(false);
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
  let { create_time, ...rest } = formData.value;
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    create_time_start: isArray(create_time) ? create_time[0] : "",
    create_time_end: isArray(create_time) ? create_time[1] : "",
    ...rest,
  };
  tableLoading.value = true;
  const result = await getInspecRecordListApi(data);
  tableData.value = result.data.list;
  pagination.total = result.data.total;
}

/** 单元格点击详情 */
function cellDetail(row: any) {
  router.push({
    path: "/device/inspection/record/detail",
    query: {
      id: row.id,
    },
  });
}

/** 单元格点击编辑 */
function cellEdit(row: any) {
  router.push({
    path: "/device/inspection/record/add",
    query: {
      id: row.id,
    },
  });
}
function cellRectify(row: any) {
  router.push({
    path: "/device/inspection/record/add",
    query: {
      id: row.id,
      order_type: 1,
    },
  });
}

/** 单元格点击提交验收 */
async function cellSubmit(row: any) {
  console.log("🚀 ~ cellSubmit ~ row:", row.task_time_end);
  listId.value = row.id;
  submitVisible.value = true;

  submitFormData.value.task_time_start = row.task_time_start
    ? row.task_time_start
    : dayjs().format("YYYY-MM-DD HH:mm");
  submitFormData.value.task_time_end = row.task_time_end
    ? row.task_time_end
    : dayjs().format("YYYY-MM-DD HH:mm");
}
async function submitConfirm(values: FieldValues) {
  submitVisible.value = false;
  console.log("🚀 ~ submitConfirm ~ values:", values);
  const reuslt = await getInspecRecordSubmitApi({ id: listId.value, ...values });
  ElMessage.success(reuslt.msg);
  getData();
}

/** 单元格点击验证通过 */
async function cellApprove(row: any) {
  const reuslt = await getInspecRecordApproveApi({ id: row.id });
  ElMessage.success(reuslt.msg);
  getData();
}

/** 单元格点击驳回返工 */
async function cellReject(row: any) {
  const reuslt = await getInspecRecordRejectApi({ id: row.id });
  ElMessage.success(reuslt.msg);
  getData();
}

/** 单元格点击撤回 */
async function cellRecall(row: any) {
  const reuslt = await getInspecRecordRecallApi({ id: row.id });
  ElMessage.success(reuslt.msg);
  getData();
}

/** 检查提交验收按钮是否禁用 */
function checkSubmit(is_report_rectify: number, rectify_status: number) {
  if (is_report_rectify === 1) {
    return rectify_status === 1 ? false : true;
  }
  return false;
}

onActivated(() => {
  getBase();
  getData();
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        :showNumber="5"
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
            <template #picture="{ row }">
              <!-- v-for="(item, index) in row.picture" :key="index" -->
              <template v-if="isArray(row.picture) && row.picture.length > 0">
                <el-image
                  :src="useSetting.baseHttp + row.picture[0]"
                  style="width: 100px; height: 100px; border-radius: 6px"
                  :preview-src-list="row.picture.map((m: string) => useSetting.baseHttp + m)"
                  :z-index="9999"
                  preview-teleported
                />
              </template>
              <span v-else>--</span>
            </template>
            <template #sign="{ row }">
              <template v-if="row.sign">
                <el-image
                  :src="useSetting.baseHttp + row.sign"
                  :preview-src-list="[useSetting.baseHttp + row.sign]"
                  :z-index="9999"
                  preview-teleported
                ></el-image>
              </template>
            </template>
            <template #operation="{ row }">
              <el-button
                type="primary"
                link
                @click="cellDetail(row)"
                v-hasPerm="['inspection:record:detail']"
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
                    v-hasPerm="['inspection:record:addedit']"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="primary"
                    link
                    @click="cellSubmit(row)"
                    v-hasPerm="['inspection:record:submit']"
                    :disabled="checkSubmit(row.is_report_rectify, row.rectify_status)"
                  >
                    提交验收
                  </el-button>
                </template>
                <!-- 如果是待审核状态时,显示撤回按钮 -->
                <template v-else-if="row.status === 1">
                  <el-button
                    type="info"
                    link
                    @click="cellRecall(row)"
                    v-hasPerm="['inspection:record:recall']"
                  >
                    撤回
                  </el-button>
                </template>
              </template>
              <template v-if="checkAssocType(row.assoc_type, 2)">
                <!-- 如果是待审核状态 -->
                <template v-if="row.status === 1">
                  <el-button
                    type="success"
                    link
                    @click="cellApprove(row)"
                    v-hasPerm="['inspection:record:approve']"
                  >
                    验收通过
                  </el-button>
                  <el-button
                    type="info"
                    link
                    @click="cellReject(row)"
                    v-hasPerm="['inspection:record:reject']"
                  >
                    驳回返工
                  </el-button>
                </template>
              </template>
              <template v-if="checkAssocType(row.assoc_type, 6)">
                <!-- 身份标识6,为整改人的时候 -->
                <template v-if="row.status === 0">
                  <!--只有待提审状态,才可以去整改 -->
                  <el-button
                    type="primary"
                    link
                    @click="cellRectify(row)"
                    v-hasPerm="['inspection:record:addedit']"
                  >
                    去整改
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
