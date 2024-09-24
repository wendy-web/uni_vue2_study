<script setup lang="ts">
/* 纸皮进货检验报告列表页面 */
import { Plus } from "@element-plus/icons-vue";
import type { FormInstance, TableInstance } from "element-plus";
import { isArray } from "@pureadmin/utils";
import {
  getLeatheroidListApi,
  leatheroidDelApi,
  leatheroidRecallApi,
  leatheroidReportApi,
} from "@/api/quality/material-inspection/leatheroid/index";
import type { LeatheroidListType } from "@/api/quality/material-inspection/leatheroid/types";
import { useCommonHooks } from "@/hooks/quality";
import { useSettingsStoreHook } from "@/store/modules/settings";
import ListOperationBtn from "@/views/quality/components/ListOperationBtn/index.vue";
import { useList } from "./utils/hook";

const { startDownloadUrl } = useCommonHooks();

defineOptions({
  name: "MaterialInspectionLeatheroid",
});
const useSetting = useSettingsStoreHook();

const { pagination, formData, columns, searchColumns, cellDetail, router } = useList(handleSearch);

/** plusform搜索表单的ref */
const plusFormRef = ref();
/** 表单的ref */
const formRef = computed(() => {
  return plusFormRef.value.formInstance as FormInstance;
});

const tableData = ref<LeatheroidListType[]>([]);
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
  const result = await getLeatheroidListApi(data);
  tableData.value = result.data.list;
  pagination.total = result.data.total;
  tableLoading.value = false;
}

// 勾选触发事件
function changeSelect(selection: any[]) {
  ids.value = selection.map((item) => {
    return item.id;
  });
  console.log("selectData.value", ids.value);
}

/** 点击新建 */
function handleAdd() {
  router.push({
    path: "/quality/material-inspection/leatheroid/add",
  });
}
/** 点击生成报告 */
// function handleGenerateReport() {
//   if (!ids.value.length) {
//     ElMessage.warning("请先勾选数据");
//     return;
//   }
//   ElMessage.info("敬请期待");
// }

/** 点击编辑 */
function cellEdit(row: LeatheroidListType) {
  router.push({
    path: "/quality/material-inspection/leatheroid/add",
    query: {
      id: row.id,
      pageType: 2,
    },
  });
}

/** 点击去提交 */
function cellSubmit(row: LeatheroidListType) {
  router.push({
    path: "/quality/material-inspection/leatheroid/add",
    query: {
      id: row.id,
    },
  });
}
/** 点击删除 */
function cellDel(row: LeatheroidListType) {
  ElMessageBox.confirm(`确认要删除单据编号为：【${row.order_no}】的该条内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定删除");
      const result = await leatheroidDelApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击撤回 */
async function cellRecall(row: LeatheroidListType) {
  const result = await leatheroidRecallApi({ id: row.id });
  ElMessage.success(result.msg);
  getData();
}

/** 点击生成报告 */
function cellGenerateReport(row: LeatheroidListType) {
  startDownloadUrl(leatheroidReportApi, { id: row.id });
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
            v-hasPerm="['mi:leatheroid:add']"
          >
            新建
          </el-button>
          <!-- <el-button type="primary" @click="handleGenerateReport">生成报告</el-button> -->
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="prueTableRef"
            row-key="id"
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
                :order-type="7"
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
