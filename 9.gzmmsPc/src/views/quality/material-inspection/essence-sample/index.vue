<script setup lang="ts">
/* 香精留样记录列表页 */
import { Plus } from "@element-plus/icons-vue";
import type { FormInstance, TableInstance } from "element-plus";
import { isArray } from "@pureadmin/utils";
import {
  essenceSampleDestroyApi,
  essenceSampleReportApi,
  executeSelectDestroyApi,
  getEssenceSampleListApi,
} from "@/api/quality/process-inspection/essence-sample";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCommonHooks } from "@/hooks/quality";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useList } from "./utils/hook";

const { startDownloadUrl } = useCommonHooks();

defineOptions({
  name: "MaterialInspectionEssenceSample",
});

const useSetting = useSettingsStoreHook();
const {
  pagination,
  formData,
  columns,
  searchColumns,
  router,
  addFormData,
  addFormColumns,
  addVisible,
  addFormRules,
  addLoading,
  getUserOptions,
} = useList();

/** plusform搜索表单的ref */
const plusFormRef = ref();

const tableData = ref<any[]>([]);
const tableLoading = ref(false);

/** puretable的ref */
const prueTableRef = ref();
/** 表格的ref */
const tableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});
const current_id = ref(0);

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
  let { reviewer_date, ...rest } = formData.value;
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    reviewer_date_start: isArray(reviewer_date) ? reviewer_date[0] : "",
    reviewer_date_end: isArray(reviewer_date) ? reviewer_date[1] : "",
    ...rest,
  };
  tableLoading.value = true;
  const result = await getEssenceSampleListApi(data);
  tableData.value = result.data.list;
  pagination.total = result.data.total;
  tableLoading.value = false;
}

/** 导出报告 */
async function handleGenerateReport() {
  let { reviewer_date, ...rest } = formData.value;
  let data = {
    reviewer_date_start: isArray(reviewer_date) ? reviewer_date[0] : "",
    reviewer_date_end: isArray(reviewer_date) ? reviewer_date[1] : "",
    ...rest,
  };
  startDownloadUrl(essenceSampleReportApi, data);
}

/** 点击执行销毁 */
function handleExecuteDestroy(row: any) {
  addVisible.value = true;
  current_id.value = row.id;
}

/** 新建弹窗点击取消 */
function handleAddCancel() {
  addVisible.value = false;
}

const handleAddConfirm = async (handleSubmit: () => Promise<boolean>) => {
  const isPass = await handleSubmit();
  if (!isPass) return;
  showSubmitDialog();
};
const signDialogRef = ref();
function showSubmitDialog() {
  addDialog({
    width: "60%",
    btnClass: "w-[80px]",
    draggable: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    btnLoading: false,
    showClose: false,
    title: "签名提交",
    contentRenderer: () =>
      h(SignDialog, {
        ref: signDialogRef,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      updateDialog(true, "btnLoading");
      const signatureResult = await signDialogRef.value.handleGenerate();
      addFormData.value.destroy_user_signature = signatureResult;
      let data = {
        id: current_id.value,
        ...addFormData.value,
      };
      const result = await essenceSampleDestroyApi(data);
      ElMessage.success(result.msg);
      updateDialog(false, "btnLoading");
      done();
      addVisible.value = false;
      getData();
    },
  });
}
/** 批量销毁相关 */
const multiDialogFormRef = ref();
const multiDestroyVisible = ref(false);
const destroyIds = ref<number[]>([]);
// 勾选触发事件
function changeSelect(selection: any[]) {
  destroyIds.value = selection.map((item) => {
    return item.id;
  });
}
async function handleMultiDestroy() {
  if (!destroyIds.value.length) {
    ElMessage.warning("请先勾选需要销毁的数据");
    return;
  }
  multiDestroyVisible.value = true;
}
const handleMultiDestoryConfirm = async (handleSubmit: () => Promise<boolean>) => {
  const isPass = await handleSubmit();
  if (!isPass) return;
  showMultiSubmitDialog();
};
function showMultiSubmitDialog() {
  addDialog({
    width: "60%",
    btnClass: "w-[80px]",
    draggable: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    btnLoading: false,
    showClose: false,
    title: "签名提交",
    contentRenderer: () =>
      h(SignDialog, {
        ref: signDialogRef,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      updateDialog(true, "btnLoading");
      const signatureResult = await signDialogRef.value.handleGenerate();
      addFormData.value.destroy_user_signature = signatureResult;
      let data = {
        ids: destroyIds.value,
        ...addFormData.value,
      };
      const result = await executeSelectDestroyApi(data);
      ElMessage.success(result.msg);
      multiDestroyVisible.value = false;
      // 销毁成功 清空勾选项
      tableRef.value?.clearSelection();
      // 重置表单

      updateDialog(false, "btnLoading");
      done();
      addVisible.value = false;
      getData();
    },
  });
}

onActivated(() => {
  // 获取列表数据
  getData();
  getUserOptions();
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
        :colProps="{ span: 4 }"
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
            @click="handleMultiDestroy"
            v-hasPerm="['mi:essencesample:destroy']"
          >
            批量销毁
          </el-button>
          <el-button
            type="primary"
            @click="handleGenerateReport"
            v-hasPerm="['mi:essencesample:report']"
          >
            导出报告
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
            <template #destroy_user_signature="{ row }">
              <template v-if="row.destroy_user_signature">
                <el-image
                  :src="useSetting.baseHttp + row.destroy_user_signature"
                  style="width: 100px; height: 100px; border-radius: 6px"
                  :preview-src-list="[useSetting.baseHttp + row.destroy_user_signature]"
                  :z-index="9999"
                  preview-teleported
                />
              </template>
              <span v-else>--</span>
            </template>
            <template #operation="{ row }">
              <template v-if="row.destroy_status == 0">
                <el-button
                  type="primary"
                  @click="handleExecuteDestroy(row)"
                  link
                  v-hasPerm="['mi:essencesample:destroy']"
                >
                  执行销毁
                </el-button>
              </template>
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
        title: '执行销毁',
        draggable: true,
        hasFooter: false,
      }"
      :form="{
        columns: addFormColumns,
        rules: addFormRules,
        labelWidth: '100px',
        labelPosition: 'right',
        hasFooter: true,
        colProps: {
          span: 12,
        },
      }"
    >
      <template #form-footer="{ handleSubmit }">
        <div class="flex justify-center mt-10 w-full">
          <el-button class="mr-4 w-[80px]" @click="handleAddCancel">取消</el-button>
          <el-button
            type="primary"
            :loading="addLoading"
            @click="handleAddConfirm(handleSubmit)"
            class="mr-4 w-[100px]"
          >
            确认
          </el-button>
        </div>
      </template>
    </PlusDialogForm>
    <!-- 批量销毁 -->
    <PlusDialogForm
      ref="multiDialogFormRef"
      v-model:visible="multiDestroyVisible"
      v-model="addFormData"
      :dialog="{
        title: '批量执行销毁',
        draggable: true,
        hasFooter: false,
      }"
      :form="{
        columns: addFormColumns,
        rules: addFormRules,
        labelWidth: '100px',
        labelPosition: 'right',
        hasFooter: true,
        colProps: {
          span: 12,
        },
      }"
    >
      <template #form-footer="{ handleSubmit }">
        <div class="flex justify-center mt-10 w-full">
          <el-button class="mr-4 w-[80px]" @click="multiDestroyVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="addLoading"
            @click="handleMultiDestoryConfirm(handleSubmit)"
            class="mr-4 w-[100px]"
          >
            签名确认
          </el-button>
        </div>
      </template>
    </PlusDialogForm>
  </div>
</template>
<style lang="scss" scoped></style>
