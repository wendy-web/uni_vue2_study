<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import type { Column, FormInstance, TableInstance } from "element-plus";
import { isArray } from "@pureadmin/utils";
import { useRouter } from "vue-router";
// 引用复检池列表接口
import {
  getListApi,
} from "@/api/quality/material-inspection/recheck-pool/index";
import ListOperationBtn from "@/views/quality/components/ListOperationBtn/index.vue";
import { useList } from "./utils/hook";

/* 复检池列表页面 */
defineOptions({
  name: "MaterialInspectionRecheckPool",
});
const router = useRouter();
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
  // 点击生产批号 打开详情不可编辑
  if (column.property === "batch_no") {
    router.push({
      path: "/quality/material-inspection/recheck-pool/add",
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
    path: "/quality/material-inspection/recheck-pool/add",
    query: {
      pageType: 1,
    },
  });
};
// 单元格点击编辑
const cellEdit = (row: any) => {
  router.push({
    path: "/quality/material-inspection/recheck-pool/add",
    query: {
      pageType: 2,
      id: row.id,
      assocType: row.assoc_type,
    },
  });
};
const cellDetail = (row: any) => {
  router.push({
    path: "/quality/material-inspection/recheck-pool/add",
    query: {
      pageType: 3,
      id: row.id,
      assocType: row.assoc_type,
    },
  });
};

async function getData() {
  let { check_date_arr, ...rest } = formData.value;

  let params = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    create_time_start: isArray(check_date_arr) ? check_date_arr[0] : "",
    create_time_end: isArray(check_date_arr) ? check_date_arr[1] : "",
    ...rest,
  };
  tableLoading.value = true;
  const result = await getListApi(params);
  tableData.value = result.data.data;
  pagination.total = result.data.total;
  tableLoading.value = false;
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
        :showNumber="6"
        ref="plusFormRef"
        @reset="handleReset(plusFormRef?.plusFormInstance.formInstance)"
        @search="handleSearch"
      ></PlusSearch>
    </div>

    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <!-- <template #buttons="scope">
          <el-button
            type="primary"
            @click="handleAdd"
            :icon="Plus"
            v-hasPerm="['mi:emptycaninfo:add']"
          >
            新建
          </el-button>
        </template> -->
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
                :order-type="10"
                :show-report="false"
                v-on="{
                  detail: () => cellDetail(row),
                  edit: () => cellEdit(row),
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
