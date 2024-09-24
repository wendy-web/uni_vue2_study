<script setup lang="ts">
/* 产品定量检验报告 */
import { Plus } from "@element-plus/icons-vue";
import type { Column, FormInstance, TableInstance } from "element-plus";
import { isArray, storageSession } from "@pureadmin/utils";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import { useRouter } from "vue-router";
// import { QualityCommonModule, SelectStringOpions } from "@/api/quality/common/types";
import { getBatchForBrandApi } from "@/api/quality/common/index";
// 产品定量检验报告列表接口
import {
  deleteOrderApi,
  getListApi,
  makeReportApi,
  revokeOrderApi,
} from "@/api/quality/product-quantify/direct/index";
import { useCommonHooks } from "@/hooks/quality";
import { useSettingsStoreHook } from "@/store/modules/settings";
import ListOperationBtn from "@/views/quality/components/ListOperationBtn/index.vue";
import { useList } from "./utils/hook";

const { startDownloadUrl } = useCommonHooks();

defineOptions({
  name: "ProductQuantifyDirect",
});
const router = useRouter();
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
const {
  formData,
  searchColumns,
  columns,
  pagination,
  getBaseData,
  addFormData,
  addFormColumns,
  addFormRules,
  addVisible,
  skuOptions,
  noBatchNo,
  batchTableData,
  batchTableColumns,
  batchTablePagination,
  batchRowStyle,
} = useList(handleSearch);
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
      path: "/quality/product-quantify/direct/add",
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
  // 获取基础数据
  getBaseData();
  addFormRef.value?.resetFields();
  addVisible.value = true;
};
// 单元格点击编辑
const cellEdit = (row: any) => {
  router.push({
    path: "/quality/product-quantify/direct/add",
    query: {
      pageType: 2,
      id: row.id,
      assocType: row.assoc_type,
    },
  });
};
const cellDetail = (row: any) => {
  router.push({
    path: "/quality/product-quantify/direct/add",
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
/** 点击生成报告 */
async function cellGenerateReport(row: any) {
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
// 新建-弹窗
const dialogFormRef = ref();
/** 表单的ref */
const addFormRef = computed(() => {
  return dialogFormRef.value.formInstance as FormInstance;
});
// /** 监听表单的变化 */
const handleFormChange = (values: FieldValues, column: PlusColumn) => {
  let { prop } = column;
  console.log("values[prop]:", values[prop]);
  // 置空产品大类时候,清空sku
  if (["brand"].includes(prop)) {
    addFormData.value.sku = "";
    addFormData.value.batch_no = "";
    addFormData.value.sample_batch_no = "";
  }
};
// 监听sku变化:查询批次信息
const handleSkuChange = (values: FieldValues) => {
  console.log("handleSkuChange:", values);
};
// 监听批号变化
const handleBatchSelect = (values: any) => {
  addFormData.value.batch_no = values.label;
  addFormData.value.make_date = values.date;
  console.log("handleBatchSelect:", values);
  // console.log("addFormData:", addFormData.value);
};
const querySearchBatch = (queryString: string, cb: any) => {
  let { brand, sku } = addFormData.value;
  getBatchForBrandApi({ brand, sku })
    .then((result) => {
      let options = result.data.map((item: any) => {
        return {
          label: item.batch_no,
          value: item.sample_batch_no,
          date: item.make_date,
        };
      });
      noBatchNo.value = options.length ? false : true;
      cb(options);
    })
    .catch((error) => {
      console.log("querySearchBatch 异步获取数据报错了：", error);
    });
};

// 监听批号下拉框显示隐藏
async function handleBatchVisible(show: any) {
  console.log("handleBatchVisible:", show);
  // 显示下拉框，更新数据
  if (show) {
    let { brand, sku } = addFormData.value;
    let result = await getBatchForBrandApi({ brand, sku });
    batchTableData.value = result.data;
  }
}
// 批号选择框
const batchSelectRef = ref();
/** 行点击 */
function onRowClick(row: any) {
  console.log("onRowClick:", row);
  addFormData.value.sample_batch_no = row.sample_batch_no;
  addFormData.value.batch_no = row.batch_no;
  addFormData.value.make_date = row.make_date;
  batchSelectRef.value.blur();
  console.log("addFormData.value:", addFormData.value);
}
// 新建弹窗-确认
async function addConfirm(values: FieldValues) {
  console.log("addConfirm:", values);
  let params = { ...values };
  storageSession().setItem("directAddParams", params);
  router.push({
    path: "/quality/product-quantify/direct/add",
    query: {
      pageType: 1,
    },
  });
  addVisible.value = false;
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
            v-hasPerm="['pq:direct:addedit']"
          >
            新建
          </el-button>
          <!-- <el-button type="primary" @click="">生成报告</el-button> -->
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
                :order-type="22"
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
    <!-- 新建定量检测弹窗 -->
    <PlusDialogForm
      ref="dialogFormRef"
      v-model:visible="addVisible"
      v-model="addFormData"
      :dialog="{
        title: '新建定量检测',
        draggable: true,
      }"
      :form="{ columns: addFormColumns, rules: addFormRules, labelWidth: '100px' }"
      @change="handleFormChange"
      @confirm="addConfirm"
    >
      <!-- 自定义插槽：产品类型 -->
      <template #plus-field-sku>
        <el-select
          class="w-full"
          v-model="addFormData.sku"
          :placeholder="`${addFormData.brand ? '请选择产品类型' : '请先选择产品大类'}`"
          :disabled="!addFormData.brand"
          @change="handleSkuChange"
        >
          <el-option
            v-for="item in skuOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </template>
      <!-- 批号 -->
      <template #plus-field-sample_batch_no>
        <!-- <el-autocomplete
          class="w-full"
          v-model="addFormData.sample_batch_no"
          :fetch-suggestions="querySearchBatch"
          :placeholder="`${addFormData.sku && addFormData.brand ? '请输入批号' : '请先选择产品大类和产品类型'}`"
          @select="handleBatchSelect"
        /> -->
        <el-select
          ref="batchSelectRef"
          v-model="addFormData.sample_batch_no"
          class="w-full"
          value-key="id"
          :disabled="!addFormData.sku || !addFormData.brand"
          :placeholder="`${addFormData.sku && addFormData.brand ? '请输入批号' : '请先选择产品大类和产品类型'}`"
          @visible-change="handleBatchVisible"
          clearable
        >
          <template #empty>
            <div class="m-4">
              <pure-table
                row-key="id"
                alignWhole="center"
                :header-cell-style="{
                  background: 'var(--el-fill-color-light)',
                  color: 'var(--el-text-color-primary)',
                }"
                :row-style="batchRowStyle"
                :data="
                  batchTableData.slice(
                    (batchTablePagination.currentPage - 1) * batchTablePagination.pageSize,
                    batchTablePagination.currentPage * batchTablePagination.pageSize,
                  )
                "
                :columns="batchTableColumns"
                :pagination="batchTablePagination"
                @row-click="onRowClick"
              />
            </div>
          </template>
        </el-select>
      </template>
    </PlusDialogForm>
  </div>
</template>
<style lang="scss" scoped></style>
