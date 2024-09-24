<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import type { Column, FormInstance, TableInstance } from "element-plus";
import { isArray } from "@pureadmin/utils";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import { useRouter } from "vue-router";
import {
  deleteOrderApi,
  getListApi,
  makeReportApi,
  revokeOrderApi,
} from "@/api/quality/environment/cleanroom-bacteria/index";
import { useCommonHooks } from "@/hooks/quality";
import { useSettingsStoreHook } from "@/store/modules/settings";
import ListOperationBtn from "@/views/quality/components/ListOperationBtn/index.vue";
import { useList } from "./utils/hook";

/* 配料洁净间浮游菌检测-列表页面 */
defineOptions({
  name: "EnvironmentCleanroomBacteria",
});
const router = useRouter();
const { startDownloadUrl } = useCommonHooks();
const useSetting = useSettingsStoreHook();
/** plusform搜索表单的ref */
const plusFormRef = ref();
/** 表单的ref */
const formRef = computed(() => {
  return plusFormRef.value.formInstance as FormInstance;
});
const tableData = ref([]);
const tableLoading = ref(false);
/** puretable的ref */
const prueTableRef = ref();
/** 表格的ref */
const tableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});
const { formData, searchColumns, columns, pagination } = useList(handleSearch);
// /** 监听表单的变化 */
const handleChange = (values: FieldValues, column: PlusColumn) => {};
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
const handleRowClick = (row: any, column: Column) => {
  // 点击单据编号 打开详情不可编辑
  if (column.property === "order_no") {
    router.push({
      path: "/quality/environment/cleanroom-bacteria/add",
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
    path: "/quality/environment/cleanroom-bacteria/add",
    query: {
      pageType: 1,
    },
  });
};
// 单元格点击编辑
const cellEdit = (row: any) => {
  router.push({
    path: "/quality/environment/cleanroom-bacteria/add",
    query: {
      pageType: 2,
      id: row.id,
      assocType: row.assoc_type,
    },
  });
};
const cellDetail = (row: any) => {
  router.push({
    path: "/quality/environment/cleanroom-bacteria/add",
    query: {
      pageType: 3,
      id: row.id,
      assocType: row.assoc_type,
    },
  });
};
// 单元格点击撤回
const cellRecall = (row: any) => {
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
const cellDel = (row: any) => {
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
const ids = ref<number[]>([]);
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
  startDownloadUrl(makeReportApi, { ids: ids.value });
}
async function getData() {
  let { check_date_arr, create_date_arr, ...rest } = formData.value;

  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    check_time_start: isArray(check_date_arr) ? check_date_arr[0] : "",
    check_time_end: isArray(check_date_arr) ? check_date_arr[1] : "",
    create_date_start: isArray(create_date_arr) ? create_date_arr[0] : "",
    create_date_end: isArray(create_date_arr) ? create_date_arr[1] : "",
    ...rest,
  };
  try {
    tableLoading.value = true;
    const result = await getListApi(data);
    tableData.value = result.data.list;
    pagination.total = result.data.total;
    tableLoading.value = false;
  } catch (error) {
    tableLoading.value = false;
  }
}

onActivated(() => {
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
        :showNumber="8"
        ref="plusFormRef"
        @change="handleChange"
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
            v-hasPerm="['environment:cleanroombacteria:add']"
          >
            新建
          </el-button>
          <el-button
            type="primary"
            @click="handleExport"
            v-hasPerm="['environment:cleanroombacteria:report']"
          >
            导出选中数据
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
            @selection-change="changeSelect"
            @row-click="handleRowClick"
          >
            <template #operation="{ row }">
              <ListOperationBtn
                :status="row.status"
                :assocType="row.assoc_type"
                :order-type="40"
                :showReport="false"
                v-on="{
                  detail: () => cellDetail(row),
                  edit: () => cellEdit(row),
                  delete: () => cellDel(row),
                  recall: () => cellRecall(row),
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
