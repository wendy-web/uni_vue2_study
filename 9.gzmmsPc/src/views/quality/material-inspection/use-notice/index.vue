<script setup lang="ts">
/* 原材料使用通知单列表页面 */
import { Plus } from "@element-plus/icons-vue";
import type { FormInstance, TableInstance } from "element-plus";
import { isArray } from "@pureadmin/utils";
import {
  getUseNoticeListApi,
  useNoticeDelApi,
  useNoticeRecallApi,
  useNoticeReportApi,
} from "@/api/quality/material-inspection/use-notice/index";
import type { UseNoticeListType } from "@/api/quality/material-inspection/use-notice/types";
import { useCommonHooks } from "@/hooks/quality";
import { useSettingsStoreHook } from "@/store/modules/settings";
import ListOperationBtn from "@/views/quality/components/ListOperationBtn/index.vue";
import { useList } from "./utils/hook";

const { startDownloadUrl } = useCommonHooks();

defineOptions({
  name: "MaterialInspectionUsenotice",
});

const useSetting = useSettingsStoreHook();

const {
  pagination,
  formData,
  columns,
  searchColumns,
  router,
  cellDetail,
  // addFormData,
  // addFormColumns,
  // addFormRules,
  // addVisible,
} = useList(handleSearch);

/** plusform搜索表单的ref */
const plusFormRef = ref();
/** 表单的ref */
const formRef = computed(() => {
  return plusFormRef.value.formInstance as FormInstance;
});

const dialogFormRef = ref();
/** 表单的ref */
const addFormRef = computed(() => {
  return dialogFormRef.value.formInstance as FormInstance;
});

const tableData = ref<UseNoticeListType[]>([]);
const tableLoading = ref(false);

/** puretable的ref */
const prueTableRef = ref();
/** 表格的ref */
const tableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});

/** 记录勾选的id */
const ids = ref<number[]>([]);

// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getData();
};

// 点击搜索
function handleSearch() {
  getData();
}

async function getData() {
  let { check_time, ...rest } = formData.value;
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    check_time_start: isArray(check_time) ? check_time[0] : "",
    check_time_end: isArray(check_time) ? check_time[1] : "",
    ...rest,
  };
  tableLoading.value = true;
  const result = await getUseNoticeListApi(data);
  tableData.value = result.data.list;
  pagination.total = result.data.total;
  tableLoading.value = false;
}

// 勾选触发事件
function changeSelect(selection: UseNoticeListType[]) {
  ids.value = selection.map((item) => {
    return item.id;
  });
}

function handleAdd() {
  // addFormRef.value?.resetFields();
  // addVisible.value = true;
  router.push({
    path: "/quality/material-inspection/use-notice/add",
  });
}

/** 点击生成报告 */
function cellGenerateReport(row: UseNoticeListType) {
  startDownloadUrl(useNoticeReportApi, { id: row.id });
}

/** 点击编辑 */
function cellEdit(row: UseNoticeListType) {
  router.push({
    path: "/quality/material-inspection/use-notice/add",
    query: {
      id: row.id,
      pageType: 2,
    },
  });
}

/** 点击删除 */
function cellDel(row: UseNoticeListType) {
  ElMessageBox.confirm(`确认要删除单据编号为：【${row.order_no}】的该条内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定删除");
      const result = await useNoticeDelApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击撤回 */
async function cellRecall(row: UseNoticeListType) {
  const result = await useNoticeRecallApi({ id: row.id });
  ElMessage.success(result.msg);
  getData();
}

onActivated(() => {
  // 获取列表数据
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
        ref="plusFormRef"
        @reset="handleReset(plusFormRef?.plusFormInstance.formInstance)"
        @search="handleSearch"
      ></PlusSearch>
    </div>
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <template #buttons="scope">
          <el-button
            type="primary"
            @click="handleAdd"
            :icon="Plus"
            v-hasPerm="['mi:usenotice:add']"
          >
            新建
          </el-button>
          <!-- <el-button type="primary" @click="handleGenerateReport">生成报告</el-button> -->
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="prueTableRef"
            row-key="id"
            stripe
            header-cell-class-name="table-gray-header"
            :data="tableData"
            :columns="dynamicColumns"
            :loading="tableLoading"
            :size="size"
            adaptive
            :adaptiveConfig="{ offsetBottom: 120 }"
            :pagination="pagination"
            @page-size-change="getData()"
            @page-current-change="getData()"
            @selection-change="changeSelect"
          >
            <template #operation="{ row }">
              <ListOperationBtn
                :status="row.status"
                :assocType="row.assoc_type"
                :order-type="9"
                v-on="{
                  detail: () => cellDetail(row),
                  edit: () => cellEdit(row),
                  delete: () => cellDel(row),
                  recall: () => cellRecall(row),
                  report: () => cellGenerateReport(row),
                }"
              ></ListOperationBtn>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
    <!-- <PlusDialogForm
      ref="dialogFormRef"
      v-model:visible="addVisible"
      v-model="addFormData"
      :dialog="{
        title: '新建原材料使用通知单',
        draggable: true,
      }"
      :form="{ columns: addFormColumns, rules: addFormRules, labelWidth: '100px' }"
    /> -->
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/common.scss";
</style>
