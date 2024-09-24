<script setup lang="ts">
/* 战马空罐质量检验报告列表页面 */
import { Plus } from "@element-plus/icons-vue";
import type { FormInstance, TableInstance } from "element-plus";
import { isArray } from "@pureadmin/utils";
import { useRouter } from "vue-router";
import {
  cansQualityDelApi,
  cansQualityRecallApi,
  cansQualityReportApi,
  getCansQualityListApi,
} from "@/api/quality/material-inspection/cans-quality/index";
import type { CansQualityListType } from "@/api/quality/material-inspection/cans-quality/types";
import { useCommonHooks } from "@/hooks/quality";
import { useSettingsStoreHook } from "@/store/modules/settings";
import ListOperationBtn from "@/views/quality/components/ListOperationBtn/index.vue";
import { useList } from "./utils/hook";

const { startDownloadUrl } = useCommonHooks();

defineOptions({
  name: "MaterialInspectionCansQuality",
});

const useSetting = useSettingsStoreHook();
const router = useRouter();

const { pagination, formData, columns, searchColumns, cellDetail } = useList(handleSearch);

/** plusform搜索表单的ref */
const plusFormRef = ref();
/** 表单的ref */
const formRef = computed(() => {
  return plusFormRef.value.formInstance as FormInstance;
});

const tableData = ref<CansQualityListType[]>([]);
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
  const result = await getCansQualityListApi(data);
  tableData.value = result.data.list;
  pagination.total = result.data.total;
  tableLoading.value = false;
}

// 勾选触发事件
function changeSelect(selection: CansQualityListType[]) {
  ids.value = selection.map((item) => {
    return item.id;
  });
  console.log("selectData.value", ids.value);
}

/** 点击新建 */
function handleAdd() {
  router.push({
    path: "/quality/material-inspection/cans-quality/add",
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
function cellEdit(row: CansQualityListType) {
  router.push({
    path: "/quality/material-inspection/cans-quality/add",
    query: {
      id: row.id,
      pageType: 2,
    },
  });
}

/** 点击去提交 */
function cellSubmit(row: CansQualityListType) {
  router.push({
    path: "/quality/material-inspection/cans-quality/add",
    query: {
      id: row.id,
    },
  });
}
/** 点击删除 */
function cellDel(row: CansQualityListType) {
  ElMessageBox.confirm(`确认要删除单据编号为：【${row.order_no}】的该条内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定删除");
      const result = await cansQualityDelApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击撤回 */
async function cellRecall(row: CansQualityListType) {
  const result = await cansQualityRecallApi({ id: row.id });
  ElMessage.success(result.msg);
  getData();
}

/** 点击生成报告 */
function cellGenerateReport(row: CansQualityListType) {
  startDownloadUrl(cansQualityReportApi, { id: row.id });
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
            v-hasPerm="['mi:cansquality:add']"
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
                :order-type="8"
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
<style lang="scss" scoped></style>
