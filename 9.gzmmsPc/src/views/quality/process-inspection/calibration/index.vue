<script setup lang="ts">
/* PH计校准表列表页 */
import { Plus } from "@element-plus/icons-vue";
import type { FormInstance, TableInstance } from "element-plus";
import { debounce, isArray } from "@pureadmin/utils";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import { useRouter } from "vue-router";
import {
  createOrderApi,
  deleteOrderApi,
  editApi,
  getListApi,
  makeReportApi,
  reviewOrderApi,
} from "@/api/quality/process-inspection/calibration/index";
import { checkAssocType } from "@/utils/auth";
// 签名组件
import QualitySignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCommonHooks } from "@/hooks/quality";
import { useList } from "./utils/hook";

defineOptions({
  name: "ProcessInspectionCalibration",
});
const router = useRouter();
const { startDownloadUrl } = useCommonHooks();
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
const listId = ref(0);
/** add表单的ref */
const dialogTitle = ref("新增");
const dialogFormRef = ref();
const addFormRef = computed(() => {
  return dialogFormRef.value.formInstance as FormInstance;
});
const {
  formData,
  searchColumns,
  columns,
  pagination,
  addFormData,
  addFormColumns,
  addFormRules,
  addVisible,
  initBaseData,
  useSetting,
} = useList(handleSearch);

// 签名提交
const dialogOptions = {
  width: "60%",
  btnClass: "w-[80px]",
  draggable: true,
  closeOnClickModal: false,
  closeOnPressEscape: false,
  btnLoading: false,
  showClose: false,
};
const signDialogRef = ref();
// 签字提交
async function handleSign() {
  // 新增时候没有listId，需要先校验信息是否填写完整，然后，创建单据，再拿id来提交
  if (!listId.value) {
    const result = await addFormRef.value.validate();
    if (!result) {
      return;
    }
    addFormRef.value.clearValidate();
    let params = {
      ...addFormData.value,
    };
    let resultData = await createOrderApi(params);
    let { msg, code, data } = resultData;
    console.log(resultData);
    if (Number(code) === 1) {
      listId.value = data.id;
    }
  }
  addDialog({
    ...dialogOptions,
    title: "签名",
    contentRenderer: () =>
      h(QualitySignDialog, {
        ref: signDialogRef,
      }),
    beforeCancel: (done, { options, index }) => {
      done();
    },
    beforeSure: async (done, { options, index }) => {
      updateDialog(true, "btnLoading");
      const result = await signDialogRef.value.handleGenerate();
      let params = {
        id: listId.value,
        check_user_signature: result,
      };
      // 提交签名地址
      submitSign(params);
      updateDialog(false, "btnLoading");
      done();
    },
  });
}
async function submitSign(data: any) {
  try {
    let result = await reviewOrderApi(data);
    let { msg, code } = result;
    ElMessage.success(msg);
    if (Number(code) === 1) {
      getData();
      addVisible.value = false;
    }
  } catch (error) {
    console.log("签名提交失败：", error);
  }
}
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

// 点击新建-弹窗
const handleAdd = () => {
  listId.value = 0;
  addFormRef.value?.resetFields();
  dialogTitle.value = "新增校准记录";
  addVisible.value = true;
  console.log("点击新增");
};
/** 新建/编辑弹窗点击确定 */
const addConfirm = debounce(addConfirmHandle, 1000, true);

async function addConfirmHandle() {
  const vaildateRes = await addFormRef.value
    ?.validate((valid, fields) => {
      for (const keys in fields) {
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          break;
        }
      }
    })
    .catch((err) => {
      console.log("err", err);
    });

  if (!vaildateRes) return;

  const result = listId.value
    ? await editApi({ id: listId.value, ...addFormData.value })
    : await createOrderApi({ ...addFormData.value });
  addVisible.value = false;
  ElMessage.success(result.msg);
  getData();
}
// 单元格点击编辑
const cellEdit = (row: any) => {
  addFormRef.value?.resetFields();
  dialogTitle.value = "编辑校准记录";
  listId.value = row.id;
  addFormData.value = { ...row };
  // addFormData.value.calibrate_date = row.calibrate_date;
  // addFormData.value.calibrate_uid = row.calibrate_uid;
  // addFormData.value.cal1 = row.cal1;
  // addFormData.value.cal2 = row.cal2;
  // addFormData.value.slope_val = row.slope_val;
  // addFormData.value.note = row.note;
  addVisible.value = true;
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

async function handleReport() {
  let data: any = {
    ...formData.value,
  };
  startDownloadUrl(makeReportApi, data);
}
async function getData() {
  try {
    let { check_date_arr, ...rest } = formData.value;

    let data = {
      page: pagination.currentPage,
      size: pagination.pageSize,
      calibrate_date_start: isArray(check_date_arr) ? check_date_arr[0] : "",
      calibrate_date_end: isArray(check_date_arr) ? check_date_arr[1] : "",
      ...rest,
    };
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
  // 初始化下拉数据
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
        labelWidth="80"
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
            v-hasPerm="['pi:calibration:add']"
          >
            新建
          </el-button>
          <el-button type="success" @click="handleReport" v-hasPerm="['pi:calibration:report']">
            导出数据
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
          >
            <template #operation="{ row }">
              <template v-if="row.confirm_status == 0">
                <el-button
                  type="primary"
                  link
                  @click="cellEdit(row)"
                  v-hasPerm="['pi:calibration:edit']"
                >
                  编辑
                </el-button>
              </template>
              <!-- 当前是创建人的时候 -->
              <template v-if="checkAssocType(row.assoc_type, 1)">
                <el-button
                  type="primary"
                  link
                  @click="cellDel(row)"
                  v-hasPerm="['pi:calibration:del']"
                >
                  删除
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
        title: dialogTitle,
        draggable: true,
      }"
      :form="{
        columns: addFormColumns,
        rules: addFormRules,
        labelPosition: 'right',
        colProps: { span: 12 },
        rowProps: { gutter: 10 },
      }"
      @confirm="addConfirm"
    >
      <template #dialog-footer="{ handleConfirm, handleCancel }">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">保存</el-button>
        <el-button type="primary" @click="handleSign" v-hasPerm="['pi:calibration:confirm']">
          签字确认
        </el-button>
      </template>
    </PlusDialogForm>
  </div>
</template>
<style lang="scss" scoped></style>
