<script setup lang="ts">
/* 空罐照相设备验证表-列表页面 */
import { Plus } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
import { isArray } from "@pureadmin/utils";
import {
  cansCameraDelApi,
  cansCameraRecallApi,
  cansCameraReportApi,
  getCansCameraListApi,
} from "@/api/quality/environment/cans-camera";
import { useCommonHooks } from "@/hooks/quality";
import ListOperationBtn from "@/views/quality/components/ListOperationBtn/index.vue";
import { useList } from "./utils/hook";

defineOptions({
  name: "EnvironmentCansCamera",
});
const { startDownloadUrl } = useCommonHooks();
const { pagination, formData, columns, searchColumns, cellDetail, router, addPath } =
  useList(handleSearch);

const tableData = ref<any[]>([]);
const tableLoading = ref(false);
const ids = ref<number[]>([]);

/** plusform搜索表单的ref */
const plusFormRef = ref();

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
  let { check_date, create_time, ...rest } = formData.value;
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    check_date_start: isArray(check_date) ? check_date[0] : "",
    check_date_end: isArray(check_date) ? check_date[1] : "",
    create_time_start: isArray(create_time) ? create_time[0] : "",
    create_time_end: isArray(create_time) ? create_time[1] : "",
    ...rest,
  };
  tableLoading.value = true;
  const result = await getCansCameraListApi(data);
  tableData.value = result.data.list;
  pagination.total = result.data.total;
  tableLoading.value = false;
}

function handleAdd() {
  router.push({
    path: addPath,
  });
}

/** 点击编辑 */
function cellEdit(row: any) {
  router.push({
    path: addPath,
    query: {
      id: row.id,
      pageType: 2,
    },
  });
}

/** 点击删除 */
function cellDel(row: any) {
  ElMessageBox.confirm(`确认要删除单据编号为：【${row.order_no}】的该条内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定删除");
      const result = await cansCameraDelApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击撤回 */
async function cellRecall(row: any) {
  const result = await cansCameraRecallApi({ id: row.id });
  ElMessage.success(result.msg);
  getData();
}

/** 点击生成报告 */
async function cellGenerateReport(row: any) {
  startDownloadUrl(cansCameraReportApi, { id: row.id });
}

// 勾选触发事件
function changeSelect(selection: any[]) {
  ids.value = selection.map((item) => {
    return item.id;
  });
}

function handleExport() {
  if (ids.value.length === 0) {
    return ElMessage.warning("请您至少勾选一条数据");
  }
  startDownloadUrl(cansCameraReportApi, { id: ids.value });
}

onActivated(() => {
  getData();
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        :showNumber="6"
        label-position="right"
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
            v-hasPerm="['environment:canscamera:add']"
          >
            新建
          </el-button>
          <el-button
            type="primary"
            @click="handleExport"
            v-hasPerm="['environment:canscamera:report']"
          >
            导出选中数据
          </el-button>
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
                :order-type="32"
                :showReport="false"
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
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/common.scss";
</style>
