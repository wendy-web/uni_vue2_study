<script setup lang="ts">
/* 内涂膜检验报告列表页面 */
import { Plus } from "@element-plus/icons-vue";
import type { Column, FormInstance, TableInstance } from "element-plus";
import { isArray } from "@pureadmin/utils";
import { useRouter } from "vue-router";
// 引入获取空罐卷封检验报告列表接口
import {
  deleteOrderApi,
  getListApi,
  makeReportApi,
  revokeOrderApi,
} from "@/api/quality/material-inspection/inner-film/index";
import { InnerFilmModule } from "@/api/quality/material-inspection/inner-film/types";
import { useCommonHooks } from "@/hooks/quality";
import { useSettingsStoreHook } from "@/store/modules/settings";
import ListOperationBtn from "@/views/quality/components/ListOperationBtn/index.vue";
import { useList } from "./utils/hook";

defineOptions({
  name: "MaterialInspectionInnerFilmm",
});
const router = useRouter();
const { startDownloadUrl } = useCommonHooks();
const useSetting = useSettingsStoreHook();
/** plusform搜索表单的ref */
const plusFormRef = ref();
const tableData = ref<InnerFilmModule.ListItem[]>([]);
const tableLoading = ref(false);
/** puretable的ref */
const prueTableRef = ref();

const { formData, searchColumns, columns, pagination, getBaseData } = useList(handleSearch);

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
// 表格行-点击事件
const handleRowClick = (row: InnerFilmModule.ListItem, column: Column) => {
  // 点击单据编号 打开详情不可编辑
  if (column.property === "order_no") {
    router.push({
      path: "/quality/material-inspection/empty-cans/inner-film/add",
      query: {
        pageType: 3,
        id: row.id,
        assocType: row.assoc_type,
      },
    });
    return;
  }
  // 弹窗显示：检验信息和附件
};
// 点击新建
const handleAdd = () => {
  router.push({
    path: "/quality/material-inspection/empty-cans/inner-film/add",
    query: {
      pageType: 1,
    },
  });
};
// 单元格点击编辑
const cellEdit = (row: InnerFilmModule.ListItem) => {
  router.push({
    path: "/quality/material-inspection/empty-cans/inner-film/add",
    query: {
      pageType: 2,
      id: row.id,
      assocType: row.assoc_type,
    },
  });
};
const cellDetail = (row: InnerFilmModule.ListItem) => {
  router.push({
    path: "/quality/material-inspection/empty-cans/inner-film/add",
    query: {
      pageType: 3,
      id: row.id,
      assocType: row.assoc_type,
    },
  });
};
// 单元格点击撤回
const cellRecall = (row: InnerFilmModule.ListItem) => {
  console.log("点击撤回", row.id);
  ElMessageBox.confirm(`您确定要撤回单据【${row.order_no}】吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        let result = await revokeOrderApi({ id: row.id });
        ElMessage.success(result.msg);
        getData();
      } catch (error) {}
    })
    .catch((error) => {
      console.log(error);
    });
};
// 单元格点击删除
const cellDel = (row: InnerFilmModule.ListItem) => {
  ElMessageBox.confirm(`确认要删除单据编号为：【${row.order_no}】的该条内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let result = await deleteOrderApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
};
/** 点击生成报告 */
async function cellGenerateReport(row: InnerFilmModule.ListItem) {
  startDownloadUrl(makeReportApi, { id: row.id });
}
async function getData() {
  let { check_date_arr, ...rest } = formData.value;

  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    check_date_start: isArray(check_date_arr) ? check_date_arr[0] : "",
    check_date_end: isArray(check_date_arr) ? check_date_arr[1] : "",
    ...rest,
  };
  tableLoading.value = true;
  const result = await getListApi(data);
  tableData.value = result.data.list;
  pagination.total = result.data.total;
  tableLoading.value = false;
}
onActivated(() => {
  getBaseData();
  // 获取列表数据
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
            v-hasPerm="['mi:innerfilm:addedit']"
          >
            新建
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="prueTableRef"
            row-key="id"
            stripe
            header-cell-class-name="table-row-header"
            :data="tableData"
            :columns="dynamicColumns"
            :loading="tableLoading"
            :size="size"
            adaptive
            :adaptiveConfig="{ offsetBottom: 120 }"
            :pagination="pagination"
            @page-size-change="getData()"
            @page-current-change="getData()"
            @row-click="handleRowClick"
          >
            <template #operation="{ row }">
              <ListOperationBtn
                :status="row.status"
                :assocType="row.assoc_type"
                :order-type="1"
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
