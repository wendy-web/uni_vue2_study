<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import type { FormInstance, TableInstance } from "element-plus";
import { isArray } from "@pureadmin/utils";
import { useStorage } from "@vueuse/core";
import {
  getSourceRecordListApi,
  sourceRecordDelApi,
  sourceRecordRecallApi,
  sourceRecordReportApi,
} from "@/api/quality/product-quantify/source-record";
import type { SourceRecordListType } from "@/api/quality/product-quantify/source-record/types";
import { useCommonHooks } from "@/hooks/quality";
import { useSettingsStoreHook } from "@/store/modules/settings";
import ListOperationBtn from "@/views/quality/components/ListOperationBtn/index.vue";
import { useList } from "./utils/hook";

const { startDownloadUrl } = useCommonHooks();

/* 定量测定原始记录 */
defineOptions({
  name: "ProductQuantifySourceRecord",
});
const useSetting = useSettingsStoreHook();
const {
  pagination,
  formData,
  columns,
  searchColumns,
  router,
  cellDetail,
  addFormData,
  addFormColumns,
  addFormRules,
  addVisible,
  getBrandMap,
  checkOrderType,
} = useList(handleSearch);

const sourceRecordData = useStorage(
  "sourceRecordData",
  {
    brand: "", //产品品牌 ND1 红牛 ND2 战马
    sku: "", //产品类型 ND1-1 普通型 ND1-2 强化型 ND2-1 战马灌装 ND2-2 战马瓶装
    pro_name: "", //项目名称
    pro_id: 0, //项目id
    char: "", //元素
    insp_id: 0, //检测依据ID
    insp_name: "", //检测依据名称
    inst_id: 0, //仪器ID
    inst_name: "", //仪器名称
    formula: "", //公式
  },
  sessionStorage,
);

/** plusform搜索表单的ref */
const plusFormRef = ref();

const dialogFormRef = ref();
/** 表单的ref */
const addFormRef = computed(() => {
  return dialogFormRef.value.formInstance as FormInstance;
});

const tableData = ref<SourceRecordListType[]>([]);
const tableLoading = ref(false);

/** puretable的ref */
const prueTableRef = ref();

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
    check_date_start: isArray(check_time) ? check_time[0] : "",
    check_date_end: isArray(check_time) ? check_time[1] : "",
    ...rest,
  };
  tableLoading.value = true;
  const result = await getSourceRecordListApi(data);
  tableData.value = result.data.list;
  pagination.total = result.data.total;
  tableLoading.value = false;
}

function handleAdd() {
  addFormRef.value?.resetFields();
  addVisible.value = true;
}

/** 点击生成报告 */
async function cellGenerateReport(row: any) {
  startDownloadUrl(sourceRecordReportApi, { id: row.id });
}

/** 点击编辑 */
function cellEdit(row: SourceRecordListType) {
  let orderType = checkOrderType(row.pro_name);
  router.push({
    path: "/quality/product-quantify/source-record/add",
    query: {
      id: row.id,
      pageType: 2,
      orderType,
      assocType: JSON.stringify(row.assoc_type),
    },
  });
}

/** 点击删除 */
function cellDel(row: SourceRecordListType) {
  ElMessageBox.confirm(`确认要删除单据编号为：【${row.order_no}】的该条内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定删除");
      const result = await sourceRecordDelApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击撤回 */
async function cellRecall(row: SourceRecordListType) {
  const result = await sourceRecordRecallApi({ id: row.id });
  ElMessage.success(result.msg);
  getData();
}

function addConfirm() {
  let { brand, sku, itemContent } = addFormData.value;

  sourceRecordData.value.brand = brand; //产品品牌 ND1 红牛 ND2 战马
  sourceRecordData.value.sku = sku; //产品类型 ND1-1 普通型 ND1-2 强化型 ND2-1 战马灌装 ND2-2 战马瓶装
  sourceRecordData.value.pro_name = itemContent.label; //项目名称
  sourceRecordData.value.pro_id = itemContent.id; //项目id
  sourceRecordData.value.char = itemContent.char; //元素
  sourceRecordData.value.insp_id = itemContent.insp_id; //检测依据ID
  sourceRecordData.value.insp_name = itemContent.insp_name; //检测依据名称
  sourceRecordData.value.inst_id = itemContent.inst_id; //仪器ID
  sourceRecordData.value.inst_name = itemContent.inst_name; //仪器名称
  sourceRecordData.value.formula = itemContent.formula; //公式

  let orderType = 1;
  if (["总砷", "铅"].includes(itemContent.label)) {
    orderType = 3;
  } else if (["维生素B12"].includes(itemContent.label)) {
    orderType = 2;
  }
  addVisible.value = false;
  router.push({
    path: "/quality/product-quantify/source-record/add",
    query: {
      orderType,
    },
  });
}

onActivated(() => {
  // 获取列表数据
  getData();
  getBrandMap();
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
            v-hasPerm="['pq:sourcerecord:addedit']"
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
          >
            <template #operation="{ row }">
              <ListOperationBtn
                :status="row.status"
                :assocType="row.assoc_type"
                :order-type="21"
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
    <PlusDialogForm
      ref="dialogFormRef"
      v-model:visible="addVisible"
      v-model="addFormData"
      :dialog="{
        title: '新建定量检测',
        draggable: true,
      }"
      :form="{
        columns: addFormColumns,
        rules: addFormRules,
        labelWidth: '100px',
      }"
      @confirm="addConfirm"
    />
  </div>
</template>
<style lang="scss" scoped></style>
