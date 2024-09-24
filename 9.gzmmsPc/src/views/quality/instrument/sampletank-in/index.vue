<script setup lang="ts">
/* 标准样罐入库记录列表页面 */
import { Plus } from "@element-plus/icons-vue";
import { type FormInstance, dayjs } from "element-plus";
import { isArray } from "@pureadmin/utils";
import type { AxiosResponse } from "axios";
import {
  getSampletankInListApi,
  sampletankInApproveApi,
  sampletankInDelApi,
  sampletankInRecallApi,
  sampletankInRejectApi,
  sampletankInReportApi,
  sampletankInReverseApi,
  sampletankInSaveApi,
  sampletankInSubmitApi,
} from "@/api/quality/instrument/sampletank-in";
import signDialogVue from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCommonHooks } from "@/hooks/quality";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useUserStoreHook } from "@/store/modules/user";
import ExportDownVue from "@/views/quality/components/ExportDown/index.vue";
import ListOperationBtn from "@/views/quality/components/ListOperationBtn/index.vue";
import { useList } from "./utils/hook";

const { startDownloadUrl } = useCommonHooks();

defineOptions({
  name: "InstrumentSampletankIn",
});
const useSetting = useSettingsStoreHook();
const useUser = useUserStoreHook();
const {
  pagination,
  formData,
  columns,
  searchColumns,
  addFormData,
  addFormColumns,
  addFormRules,
  addVisible,
  addLoading,
  stock_sign,
  recheck_sign,
  getUnitList,
  getUserOptions,
  check_remark,
  addDisabled,
} = useList();

/** plusform搜索表单的ref */
const plusFormRef = ref();

const dialogFormRef = ref();
/** 新建表单的ref */
const addFormRef = computed(() => {
  return dialogFormRef.value.formInstance as FormInstance;
});

const tableData = ref<any[]>([]);
const tableLoading = ref(false);

/** puretable的ref */
const prueTableRef = ref();

const plusDialogTitle = ref("新增清洗记录");
const listId = ref(0);
const ids = ref<number[]>([]);

// 勾选触发事件
function changeSelect(selection: any[]) {
  ids.value = selection.map((item) => {
    return item.id;
  });
}

// 点击导出按钮
const handleCommand = (command: number) => {
  console.log("command", command, typeof command);
  if (command === 2) {
    // 2是全部导出
    let { stock_date, ...rest } = formData.value;
    let data = {
      stock_date_start: isArray(stock_date) ? stock_date[0] : "",
      stock_date_end: isArray(stock_date) ? stock_date[1] : "",
      ...rest,
    };
    startDownloadUrl(sampletankInReportApi, data);
  } else {
    if (ids.value.length === 0) {
      return ElMessage.warning("请您至少勾选一条数据");
    }
    // 1是选择导出
    startDownloadUrl(sampletankInReportApi, { id: ids.value });
  }
};

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
  let { stock_date, ...rest } = formData.value;
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    stock_date_start: isArray(stock_date) ? stock_date[0] : "",
    stock_date_end: isArray(stock_date) ? stock_date[1] : "",
    ...rest,
  };
  tableLoading.value = true;
  const result = await getSampletankInListApi(data);
  tableData.value = result.data.list;
  pagination.total = result.data.total;
  tableLoading.value = false;
}
/** 点击新建 */
function handleAdd() {
  stock_sign.value = "";
  recheck_sign.value = "";
  listId.value = 0;
  plusDialogTitle.value = "新增样罐入库记录";
  addVisible.value = true;
  nextTick(() => {
    addFormRef.value?.resetFields();
    addFormData.value.name = "";
    addFormData.value.unit = "";
    addFormData.value.remark = "";
  });
}
/** 单元格点击编辑 */
function cellEdit(row: any) {
  stock_sign.value = "";
  recheck_sign.value = "";
  listId.value = row.id;
  plusDialogTitle.value = "修改样罐入库记录";
  addFormData.value.name = row.name;
  addFormData.value.unit = row.unit;
  addFormData.value.stock_num = row.stock_num;
  addFormData.value.stock_date = row.stock_date;
  addFormData.value.stock_user_id = row.stock_user_id;
  addFormData.value.stock_user_name = row.stock_user_name;
  addFormData.value.remark = row.remark;
  addVisible.value = true;
}

/** 新建弹窗点击取消 */
function handleAddCancel() {
  addVisible.value = false;
}

async function handleAddConfirm(handleSubmit: () => Promise<boolean>, type = 0) {
  const isPass = await handleSubmit();
  if (!isPass) return;
  // 如果点击签字确认
  if (type === 1) {
    handleSign(0);
    return;
  } else {
    sendData(0);
  }
}

// 签字提交
const signDialogRef = ref();
/** 显示签名弹窗 type为0是新建编辑时的签字确认,1是审核确认 */
async function handleSign(type: number = 0) {
  addDialog({
    width: "60%",
    btnClass: "w-[80px]",
    draggable: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    btnLoading: false,
    showClose: false,
    title: "签名",
    contentRenderer: () =>
      h(signDialogVue, {
        ref: signDialogRef,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      updateDialog(true, "btnLoading");
      const result = await signDialogRef.value.handleGenerate();
      if (type === 1) {
        recheck_sign.value = result;
        confirmAudit();
      } else {
        stock_sign.value = result;
        sendData(1);
      }
      updateDialog(false, "btnLoading");
      done();
    },
  });
}
/** 调起新建/编辑/提审接口, status,新建编辑0,签字确认提审1 */
async function sendData(status: number = 0) {
  addLoading.value = true;
  let data = {
    ...addFormData.value,
    status: 0,
    // stock_sign: stock_sign.value ? stock_sign.value : undefined,
  };
  console.log("🚀 ~ sendData ~ data:", data);
  let result: AxiosResponse;
  let resultMsg = "";
  result = listId.value
    ? await sampletankInSaveApi({ ...data, id: listId.value })
    : await sampletankInSaveApi(data);
  resultMsg = result.msg;
  if (status === 1) {
    /* 如果是提交,保存后用返回的id,调用提交接口 */
    let data = {
      id: result.data.id,
      stock_sign: stock_sign.value ? stock_sign.value : undefined,
    };
    const submitResult = await sampletankInSubmitApi(data);
    resultMsg = submitResult.msg;
  }

  stock_sign.value = "";
  recheck_sign.value = "";
  addLoading.value = false;
  addVisible.value = false;
  ElMessage.success(result.msg);
  getData();
}
/** 签字审批确认 */
async function confirmAudit() {
  const result = await sampletankInApproveApi({
    id: listId.value,
    recheck_sign: recheck_sign.value,
  });
  ElMessage.success(result.msg);
  addLoading.value = false;
  addVisible.value = false;
  getData();
}

/** 点击生成报告 */
async function cellGenerateReport(row: any) {
  // const result = await sourceRecordReportApi({ id: row.id });
  // let _fileName = result.data.name;
  // let _fileUrl = result.data.src;
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
      const result = await sampletankInDelApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击撤回 */
async function cellRecall(row: any) {
  const result = await sampletankInRecallApi({ id: row.id });
  ElMessage.success(result.msg);
  getData();
}
/** 点击签字审核 */
function cellAudit(row: any, type: number) {
  console.log("🚀 ~ cellAudit ~ type:", type);
  addDisabled.value = true;
  stock_sign.value = "";
  recheck_sign.value = "";
  listId.value = row.id;
  plusDialogTitle.value = "入库审批";
  addFormData.value.name = row.name;
  addFormData.value.unit = row.unit;
  addFormData.value.stock_num = row.stock_num;
  addFormData.value.stock_date = row.stock_date;
  addFormData.value.stock_user_id = row.stock_user_id;
  addFormData.value.stock_user_name = row.stock_user_name;
  addFormData.value.remark = row.remark;
  addVisible.value = true;
}

/** 弹窗点击驳回 */
async function handleReject() {
  const result = await sampletankInRejectApi({ id: listId.value });
  ElMessage.success(result.msg);
  addVisible.value = false;
  addLoading.value = false;
  getData();
}

onActivated(() => {
  getData();
  getUnitList();
  getUserOptions();
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
            v-hasPerm="['inst:sampletankin:addedit']"
          >
            新建
          </el-button>
          <ExportDownVue
            @handleCommand="handleCommand"
            v-hasPerm="['inst:sampletankin:report']"
          ></ExportDownVue>
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
            <template #stock_sign="{ row }">
              <el-image
                :src="useSetting.baseHttp + row.stock_sign"
                style="width: 100px; height: 60px; border-radius: 6px"
                :preview-src-list="[useSetting.baseHttp + row.stock_sign]"
                :z-index="9999"
                preview-teleported
                v-if="row.stock_sign"
              />
              <span v-else>--</span>
            </template>
            <template #operation="{ row }">
              <ListOperationBtn
                :status="row.status"
                :assocType="row.assoc_type"
                :show-detail="false"
                :show-report="false"
                :order-type="31"
                v-on="{
                  detail: (type: number) => cellAudit(row, type),
                  edit: () => cellEdit(row),
                  delete: () => cellDel(row),
                  recall: () => cellRecall(row),
                  // report: () => cellGenerateReport(row),
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
        title: plusDialogTitle,
        draggable: true,
        hasFooter: false,
      }"
      :form="{
        columns: addFormColumns,
        rules: addFormRules,
        labelWidth: '110px',
        labelPosition: 'right',
        hasFooter: true,
        colProps: {
          span: 12,
        },
      }"
    >
      <template #form-footer="{ handleSubmit }">
        <template v-if="addDisabled">
          <el-button @click="handleReject" class="w-[80px]">驳回</el-button>
          <el-button type="primary" @click="handleSign(1)" class="w-[80px]">签字审批</el-button>
        </template>
        <template v-else>
          <el-button @click="handleAddCancel" class="w-[80px]">取消</el-button>
          <el-button type="primary" @click="handleAddConfirm(handleSubmit, 0)" class="w-[80px]">
            保存
          </el-button>
          <el-button type="primary" @click="handleAddConfirm(handleSubmit, 1)">签字确认</el-button>
        </template>
      </template>
    </PlusDialogForm>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/common.scss";
</style>
