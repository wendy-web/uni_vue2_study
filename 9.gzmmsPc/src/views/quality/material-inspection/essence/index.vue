<script setup lang="ts">
/* 香精入厂检测记录列表页 */
import { Plus } from "@element-plus/icons-vue";
import type { Column, FormInstance, TableInstance } from "element-plus";
import { isArray } from "@pureadmin/utils";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import { useRouter } from "vue-router";
import {
  deleteOrderApi,
  doCheckApi,
  getListApi,
  makeReportApi,
  revokeOrderApi,
} from "@/api/quality/process-inspection/essence/index";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCommonHooks } from "@/hooks/quality";
import { useSettingsStoreHook } from "@/store/modules/settings";
import ListOperationBtn from "@/views/quality/components/ListOperationBtn/index.vue";
import { useList } from "./utils/hook";

defineOptions({
  name: "MaterialInspectionEssence",
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
const {
  formData,
  searchColumns,
  columns,
  pagination,
  initBaseData,
  executeFormData,
  executeFormColumns,
  executeFormRules,
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
      path: "/quality/material-inspection/essence/add",
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
    path: "/quality/material-inspection/essence/add",
    query: {
      pageType: 1,
    },
  });
};
// 单元格点击编辑
const cellEdit = (row: any) => {
  router.push({
    path: "/quality/material-inspection/essence/add",
    query: {
      pageType: 2,
      id: row.id,
      assocType: row.assoc_type,
    },
  });
};
const cellDetail = (row: any) => {
  router.push({
    path: "/quality/material-inspection/essence/add",
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
  // 供应商必选
  let { supplier_id, check_date_arr, ...rest } = formData.value;
  if (!supplier_id) {
    ElMessage.warning("请选择供应商");
    return;
  }
  let data = {
    supplier_id,
    check_date_start: isArray(check_date_arr) ? check_date_arr[0] : "",
    check_date_end: isArray(check_date_arr) ? check_date_arr[1] : "",
    ...rest,
  };
  startDownloadUrl(makeReportApi, data);
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
/** 批量执行年检相关 start */
const executeDialogFormRef = ref();
const executeDialogVisible = ref(false);
const executeLoading = ref(false);
// 勾选的id
const ids = ref<number[]>([]);
// 勾选触发事件
function changeSelect(selection: any[]) {
  ids.value = selection.map((item) => {
    return item.id;
  });
}
async function handleExecute() {
  if (!ids.value.length) {
    ElMessage.warning("请先勾选需要执行年检的数据");
    return;
  }
  executeDialogVisible.value = true;
}
// 保存执行
async function handleExecuteSave(handleSubmit?: () => Promise<boolean>) {
  if (handleSubmit) {
    const isPass = await handleSubmit();
    if (!isPass) return;
  }
  let data = {
    ids: ids.value,
    ...executeFormData.value,
  };
  const result = await doCheckApi(data);
  ElMessage.success(result.msg);
  executeDialogVisible.value = false;
  // 销毁成功 清空勾选项
  tableRef.value?.clearSelection();
  getData();
}
// 执行：签名确认
async function handleExecuteSign(handleSubmit: () => Promise<boolean>) {
  const isPass = await handleSubmit();
  if (!isPass) return;
  showSignDialog();
}
const signDialogRef = ref();
function showSignDialog() {
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
      executeFormData.value.check_user_sign = signatureResult;
      // 保存数据
      handleExecuteSave();
      updateDialog(false, "btnLoading");
      done();
    },
  });
}
/** 批量执行年检相关 end */

onActivated(() => {
  // 获取基础数据
  initBaseData();
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
          <el-button type="primary" @click="handleAdd" :icon="Plus" v-hasPerm="['mi:essence:add']">
            新建
          </el-button>
          <el-button type="primary" @click="cellGenerateReport">生成报告</el-button>
          <el-button type="success" @click="handleExecute">执行年检</el-button>
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
            @selection-change="changeSelect"
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
                  delete: () => cellDel(row),
                  recall: () => cellRecall(row),
                }"
              ></ListOperationBtn>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
    <!-- 批量执行年检 -->
    <PlusDialogForm
      ref="executeDialogFormRef"
      v-model:visible="executeDialogVisible"
      v-model="executeFormData"
      :dialog="{
        title: '执行年检',
        draggable: true,
        hasFooter: false,
      }"
      :form="{
        columns: executeFormColumns,
        rules: executeFormRules,
        labelWidth: '100px',
        labelPosition: 'right',
        hasFooter: true,
        colProps: {
          span: 12,
        },
      }"
    >
      <template #plus-label-title1="{ label }">
        <div class="font-bold color-blue justify-left">{{ label }}</div>
      </template>
      <template #plus-field-title1></template>
      <template #plus-label-title2="{ label }">
        <div class="font-bold color-blue justify-left">{{ label }}</div>
      </template>
      <template #plus-field-title2></template>
      <template #form-footer="{ handleSubmit }">
        <div class="flex justify-center mt-10 w-full">
          <el-button class="mr-4 w-[80px]" @click="executeDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="executeLoading"
            @click="handleExecuteSave(handleSubmit)"
            class="mr-4 w-[100px]"
          >
            保存
          </el-button>
          <el-button
            type="primary"
            :loading="executeLoading"
            @click="handleExecuteSign(handleSubmit)"
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
