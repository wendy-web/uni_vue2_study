<script setup lang="ts">
/* 天平校准记录列表页面 */
import { Plus } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
import { isArray } from "@pureadmin/utils";
import {
  balanceCalibrationDelApi,
  balanceCalibrationRecallApi,
  balanceCalibrationReportApi,
  getBalanceCalibrationListApi,
  getScaledeviceInitApi,
} from "@/api/quality/instrument/balance-calibration";
import { useCommonHooks } from "@/hooks/quality";
import { useSettingsStoreHook } from "@/store/modules/settings";
import ListOperationBtn from "@/views/quality/components/ListOperationBtn/index.vue";
import { useList } from "./utils/hook";

const { startDownloadUrl } = useCommonHooks();

defineOptions({
  name: "InstrumentBalanceCalibration",
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
  addFormRules,
  addVisible,
  addLoading,
  addFormColumns,
  getScaledeviceInit,
} = useList();

/** plusform搜索表单的ref */
const plusFormRef = ref();

const tableData = ref<any[]>([]);
const tableLoading = ref(false);

/** puretable的ref */
const prueTableRef = ref();
const dialogFormRef = ref();
/** 新建表单的ref */
const addFormRef = computed(() => {
  return dialogFormRef.value.formInstance as FormInstance;
});

// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getData();
};

// 点击搜索
const handleSearch = () => {
  getData();
};

async function getData() {
  let { check_date, ...rest } = formData.value;
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    check_date_start: isArray(check_date) ? check_date[0] : "",
    check_date_end: isArray(check_date) ? check_date[1] : "",
    ...rest,
  };
  tableLoading.value = true;
  const result = await getBalanceCalibrationListApi(data);
  tableData.value = result.data.list;
  pagination.total = result.data.total;
  tableLoading.value = false;
}

function handleAdd() {
  // router.push({
  //   path: "/quality/instrument/balance-calibration/add",
  // });
  addVisible.value = true;
  nextTick(() => {
    addFormRef.value?.resetFields();
  });
}
/** 新建弹窗点击取消 */
function handleAddCancel() {
  addVisible.value = false;
}
/** 新建弹窗点击确定 */
async function handleAddConfirm(handleSubmit: () => Promise<boolean>) {
  const isPass = await handleSubmit();
  if (!isPass) return;
  router.push({
    path: "/quality/instrument/balance-calibration/add",
  });
  addVisible.value = false;
}

/** 点击生成报告 */
function cellGenerateReport(row: any) {
  startDownloadUrl(balanceCalibrationReportApi, { id: row.id });
}

/** 点击编辑 */
function cellEdit(row: any) {
  router.push({
    path: "/quality/instrument/balance-calibration/add",
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
      const result = await balanceCalibrationDelApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击撤回 */
async function cellRecall(row: any) {
  const result = await balanceCalibrationRecallApi({ id: row.id });
  ElMessage.success(result.msg);
  getData();
}

onActivated(() => {
  // 获取列表数据
  getScaledeviceInit();
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
            v-hasPerm="['inst:balancecalibration:addedit']"
          >
            新建
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
          >
            <template #check_sign="{ row }">
              <el-image
                :src="useSetting.baseHttp + row.check_sign"
                style="width: 100px; height: 60px; border-radius: 6px"
                :preview-src-list="[useSetting.baseHttp + row.check_sign]"
                :z-index="9999"
                preview-teleported
                v-if="row.check_sign"
              />
              <span v-else>--</span>
            </template>
            <template #operation="{ row }">
              <ListOperationBtn
                :status="row.status"
                :assocType="row.assoc_type"
                :order-type="30"
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
        title: '新建',
        draggable: true,
        hasFooter: false,
      }"
      :form="{
        columns: addFormColumns,
        rules: addFormRules,
        labelWidth: '110px',
        labelPosition: 'right',
        hasFooter: true,
      }"
    >
      <template #form-footer="{ handleSubmit }">
        <div class="mt-4">
          <el-button @click="handleAddCancel" class="w-[80px]">取消</el-button>
          <el-button
            type="primary"
            :loading="addLoading"
            @click="handleAddConfirm(handleSubmit)"
            class="w-[80px]"
          >
            创建
          </el-button>
        </div>
      </template>
    </PlusDialogForm>
  </div>
</template>
<style lang="scss" scoped></style>
