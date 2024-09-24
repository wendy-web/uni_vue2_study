<script setup lang="ts">
/* 新建Brix、pH和成分分析检验 */
import { type CollapseModelValue, type FormInstance, type TabPaneName } from "element-plus";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import { useRoute, useRouter } from "vue-router";
// 引入pH和成分分析接口
import {
  countertrialApi,
  createOrderApi,
  deleteOrderApi,
  editOrderApi,
  finishOrderApi,
  getInfoApi,
  makeReportApi,
  rejectOrderApi,
  reviewrderApi,
  revokeOrderApi,
} from "@/api/quality/finished-product/ingredient/index";
// 签名组件
import QualitySignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
// 引入文件上传
import FileUpload from "@/components/Upload/FileUpload.vue";
import { useCommonHooks } from "@/hooks/quality";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useTagsViewStore } from "@/store/modules/tagsView";
import FileTable from "@/views/quality/components/FileTable/index.vue";
import OrderLog from "@/views/quality/components/OrderLog/index.vue";
// 复核签名+备注组件
import QualityRecheckSign from "@/views/quality/components/RecheckSign/index.vue";
// 引入订单操作按钮
import AffixButton from "@/views/quality/components/affixButton.vue";
import checkInfo from "./components/checkInfo.vue";
import { useAdd } from "./utils/add";

const { startDownloadUrl } = useCommonHooks();

defineOptions({
  name: "FinishedProductIngredientAdd",
});
enum ETitle {
  "新建Brix、pH和成分分析检验报告" = 1,
  "编辑Brix、pH和成分分析检验报告",
  "Brix、pH和成分分析检验报告详情",
}
/** 身份标识数组--重要! */
const assocType = ref<number[]>([]);
const tagsViewStore = useTagsViewStore();
const router = useRouter();
const route = useRoute();
const activeName = ref("first");
function tabChange(name: TabPaneName) {
  activeName.value = name as string;
}
const {
  pageType,
  editDisabled,
  formData,
  formColumns,
  formRules,
  initTableClumns,
  checkTablecolumns,
  checkTableForm,
  checkFormRules,
  updateBatchNo,
  checkTableData,
  handleAdd,
  handleDelRow,
  getStatusText,
  fetchSkuOptions,
  filteredSkuOptions,
  tableLableOptions,
  initProductLineList,
  errorCountMap,
  is_submit,
} = useAdd();
/** 用于记录编辑时,从列表传过来的id */
const listId = ref(0);
/** 用于记录单据状态 */
const status = ref(0);
const headerTitle = computed(() => {
  return ETitle[pageType.value];
});
const formLoading = ref(false);
/** 折叠面板的数组 */
const activeNames = ref(["1", "2", "3", "4"]);
// 页面加载状态
const pageLoading = ref(false);
const initTagsView = () => {
  const title = headerTitle.value;
  const new_route = Object.assign({}, route, {
    title,
  });
  tagsViewStore.updateVisitedView(new_route);
};
const useSetting = useSettingsStoreHook();
const PlusFormRef = ref();
/** 基础表单的ref */
const baseFormRef = computed(() => {
  return PlusFormRef.value.formInstance as FormInstance;
});
/** 附件自定义组件的ref */
const fileTableRef = ref<InstanceType<typeof FileTable>>();
// 检验信息组件ref
const checkInfoRef = ref<InstanceType<typeof checkInfo>>();
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
// 复核签名列表
const recheck_img_list = ref<string[]>([]);

const signDialogRef = ref();
// 折叠面板切换
const handleChange = (val: CollapseModelValue) => {
  // console.log(val);
};
/** 点击取消 */
function handleCancel() {
  router.replace({
    path: "/quality/finished-product/ingredient",
  });
}
// 点击保存：1-保存，2-提交
async function handleSave(type = 1) {
  // is_submit.value = checkTableData.value.length ? true : false;
  is_submit.value = false;
  const vaildateRes = await baseFormRef.value
    .validate((valid, fields) => {
      for (const keys in fields) {
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          baseFormRef.value.scrollToField(keys);
          break;
        }
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
  if (!vaildateRes) return;
  // 检验信息是否填写完整
  let initCheckInfoRef = checkInfoRef.value as any;
  initCheckInfoRef.tableFormRef.validate(async (valid: boolean, fields: any) => {
    if (valid) {
      // 检验信息
      formData.value.check_info = getcheckInfo();
      // 附件信息
      formData.value.file_list.forEach((item: any) => {
        if (!Number(item.id)) {
          delete item.id;
        }
      });
      let data = { ...formData.value };
      let resultMsg = "";
      try {
        const result = listId.value
          ? await editOrderApi({ ...data, id: listId.value })
          : await createOrderApi(data);
        resultMsg = result.msg;
        if (type === 2) {
          /* 如果是提交,保存后用返回的id,调用提交接口 */
          let data = {
            id: result.data.id,
            check_user_signature: formData.value.check_user_signature,
          };
          const submitResult = await reviewrderApi(data);
          resultMsg = submitResult.msg;
        }
        handleBack(resultMsg);
      } catch (error) {
        console.log("检验信息验证catch:", error);
      }
    } else {
      for (const keys in fields) {
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          console.log("initCheckInfoRef.tableFormRef.value：", initCheckInfoRef.tableFormRef);
          initCheckInfoRef.tableFormRef.scrollToField(keys);
          break;
        }
      }
      console.log("error submit!", valid);
    }
  });
}
// 签字提交
async function handleSubmit() {
  is_submit.value = true;
  // 校验基础信息
  const vaildateRes = await baseFormRef.value.validate();
  if (!vaildateRes) return;
  // 校验检验信息
  if (checkTableData.value.length === 0) {
    ElMessage.warning("请填写检验信息");
    return;
  }
  let checkinfoValidateRes: any = await checkInfoRef.value!.validateForm();
  if (!checkinfoValidateRes) return;
  let { check_ret } = formData.value;
  if (check_ret === null) {
    ElMessage.warning("请先填写检验结果");
    return;
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

      // 更新签名地址
      formData.value.check_user_signature = result;
      handleSave(2);
      updateDialog(false, "btnLoading");
      done();
    },
  });
}
// 签字复核
async function handleRecheck() {
  recheckSignVisible.value = true;
  recheckSignRef.value?.resetValues();
}
// 撤回
async function handleRecall() {
  let data: any = {
    id: listId.value,
  };
  let result = await revokeOrderApi(data);
  handleBack(result.msg);
}
// 反审核
async function handleReverse() {
  ElMessageBox.prompt("请填写反审核理由", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(async ({ value }) => {
      let data: any = {
        id: listId.value,
        reason: value,
      };
      let result = await countertrialApi(data);
      handleBack(result.msg);
    })
    .catch(() => {});
}
// 删除：暂存状态才可删除
async function handleDelete() {
  let data: any = {
    id: listId.value,
  };
  let result = await deleteOrderApi(data);
  handleBack(result.msg);
}
// 生成报告
async function handleReport() {
  let data: any = {
    id: listId.value,
  };
  startDownloadUrl(makeReportApi, data);
}
// 签字复核
const recheckSignRef = ref<InstanceType<typeof QualityRecheckSign>>();
const recheckSignVisible = ref(false);
// 复核签字组件回调
const handleRecheckSignConfirm = async (fileValues: {
  file_url: string;
  note: string;
  status: number;
}) => {
  let data: any = {
    id: listId.value,
    reviewer_user_signature: fileValues.file_url,
    reason: fileValues.note,
    check_remark: fileValues.note,
  };
  // 根据 status 请求不同接口：2 通过 3 驳回
  const result = fileValues.status == 3 ? await rejectOrderApi(data) : await finishOrderApi(data);
  handleBack(result.msg);
};

// 操作按钮上绑定的变量
// const affixBtnData = reactive({
//   status: status.value,
//   assocType: assocType.value,
//   pageType,
// });
const affixBtnData = computed(() => {
  return {
    status: formData.value.status,
    assocType: assocType.value,
    pageType: pageType.value,
  };
});

// // 操作按钮上绑定的方法
const affixBtnEvent = {
  cancel: handleCancel,
  save: handleSave,
  submit: handleSubmit,
  recheck: handleRecheck,
  recall: handleRecall,
  reverse: handleReverse,
  delete: handleDelete,
  report: handleReport,
};

// /** 监听表单的变化 */
const handleFormChange = (values: FieldValues, column: PlusColumn) => {
  let { prop } = column;
  // 修改生产批号
  if (prop === "batch_no") {
    let { batch_no } = values;
    // 修改了生产批号需要同步给检验表格
    if (batch_no) {
      updateBatchNo(batch_no);
    }
  }
  // 修改产品大类
  if (["brand"].includes(prop) && values[prop]) {
    // 切换产品大类,默认选中第一个
    formData.value.sku = filteredSkuOptions.value[0].value;
    initTableClumns(formData.value);
  }
  // 修改产品类型:初始化表头配置
  if (["sku"].includes(prop) && values[prop]) {
    initTableClumns(formData.value);
  }
};
// 表格新增行
const tableAdd = async () => {
  // 新增检验信息，先校验基础信息表单必填项
  const vaildateRes = await baseFormRef.value
    .validate((valid, fields) => {
      for (const keys in fields) {
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          baseFormRef.value.scrollToField(keys);
          break;
        }
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
  if (!vaildateRes) return;
  handleAdd();
};
// 上传文件相关

const fileUploadRef = ref<InstanceType<typeof FileUpload>>();
const fileInfo = ref({
  fileUrl: "",
  fileName: "",
});
/** 监听文件上传改变 */
function fileChange(fileData: { name: string; src: string }) {
  formData.value.uv_graph_img = fileData.src;
  console.log("fileData.src", fileData.src);
}

// 监听上传文件点击确定后的事件
async function handleUploadConfirm(fileValues: {
  file_url: string;
  file_name: string;
  note: string;
}) {
  formData.value.uv_graph_img = fileValues.file_url;
}
// 操作按钮上绑定的变量
const checkInfoData = reactive({
  checkTablecolumns,
  checkFormRules,
  checkTableForm,
  formData,
  checkTableData,
  formLoading,
  editDisabled,
  tableLableOptions,
});

// // 操作按钮上绑定的方法
const checkInfoEvent = {
  handleAdd: tableAdd,
  handleDelRow: handleDelRow,
};
function getcheckInfo() {
  if (!listId.value) {
    return checkTableData.value?.length > 0
      ? checkTableData.value.map((item) => {
          let { unique_id, ...rest } = item;
          return {
            ...rest,
          };
        })
      : undefined;
  } else {
    return checkTableData.value?.length > 0
      ? checkTableData.value.map((item) => {
          let { unique_id, ...rest } = item;
          return typeof unique_id === "string" ? { ...rest } : item;
        })
      : undefined;
  }
}
// 操作成功返回列表
const handleBack = (msg: string) => {
  ElMessageBox.confirm(`${msg},请回到列表页面查看~`, "温馨提示", {
    confirmButtonText: "好的,我知道了",
    showCancelButton: false,
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    type: "success",
  }).then(() => {
    const currentTag = router.currentRoute.value;
    router.replace({
      path: "/quality/finished-product/ingredient",
    });
    tagsViewStore.delView(currentTag);
  });
};
async function getDetailData() {
  try {
    formLoading.value = true;
    const result = await getInfoApi({ id: listId.value });
    const res = result.data;
    formData.value.order_no = res.order_no;
    formData.value.batch_no = res.batch_no;
    formData.value.check_date = res.check_date;
    formData.value.check_time = res.check_time;
    // formData.value.pro_date = res.pro_date;
    formData.value.brand = res.brand;
    formData.value.sku = res.sku;
    formData.value.line_id = res.line_id;
    formData.value.line = res.line;
    formData.value.status = res.status;
    formData.value.check_res = res.check_res;
    formData.value.check_uid = res.check_uid;
    formData.value.check_user = res.check_user;
    formData.value.abs_avg_val = res.abs_avg_val;
    formData.value.abs_max_val = res.abs_max_val;
    formData.value.check_user_signature = res.check_user_signature;
    formData.value.reviewer_user_signature = res.reviewer_user_signature;
    formData.value.uv_check_res = res.uv_check_res;
    formData.value.uv_graph_img = res.uv_graph_img;
    formData.value.soluble_solid_val = res.soluble_solid_val;
    formData.value.ph_val = res.ph_val;
    formData.value.note = res.note;
    let checkinfo = res.check_info || [];
    checkTableData.value = checkinfo;
    formData.value.create_time = res.create_time;
    formData.value.ct_name = res.ct_name;
    formData.value.ct_uid = res.ct_uid;
    formData.value.dept_id = res.dept_id;
    formData.value.file_list = res.file_list;
    formData.value.act_log = res.act_log;
    formData.value.total_samples = res.total_samples;
    formData.value.total_abnormal = res.total_abnormal;
    formData.value.up_name = res.up_name;
    formData.value.up_uid = res.up_uid;
    formData.value.update_time = res.update_time;
    assocType.value = res.assoc_type;
    formData.value.order_status = getStatusText(res.status, res.assoc_type); //单据状态文本-保存剔除

    formLoading.value = false;
    formData.value.oid = res.id;
    // 更新表头信息
    await initTableClumns(formData.value);

    nextTick(async () => {
      let initCheckInfoRef = checkInfoRef.value as any;
      if (initCheckInfoRef.validateForm && !editDisabled.value) {
        await initCheckInfoRef.validateForm();
      }
    });
  } catch (error) {
    formLoading.value = false;
  }
}
watch(
  () => checkTableData.value,
  (newValue) => {
    if (newValue?.length > 0) {
      formData.value.total_samples = checkTableData.value?.length;
      // 检验信息是否：不合格，合格，部分合格
      const allPassed = checkTableData.value.every((item) => item.check_res === 1);
      const allFailed = checkTableData.value.every((item) => item.check_res === 0);
      const somePassed = checkTableData.value.some((item) => item.check_res === 1);
      const someFailed = checkTableData.value.some((item) => item.check_res === 0);
      if (allPassed) {
        formData.value.check_res = 1;
      } else if (allFailed) {
        formData.value.check_res = 0;
      } else {
        // 部分合格
        if (somePassed || someFailed) {
          formData.value.check_res = 2;
        }
      }
      // 获取某一列的数据
      const absColumnData = checkTableData.value.map((row) => row.abs_val || 0);
      // console.log("watch absColumnData: ", absColumnData);
      // 计算平均值
      const sum = absColumnData.reduce((acc, value) => Number(acc) + Number(value), 0);
      formData.value.abs_avg_val = sum / absColumnData.length;

      // 计算最大差值
      const max = Math.max(...absColumnData);
      const min = Math.min(...absColumnData);
      formData.value.abs_max_val = max - min;
      // console.log("watch checkTableData: ", checkTableData.value);
    }
  },
  {
    deep: true,
  },
);
watch(
  () => errorCountMap.value,
  (newValue) => {
    formData.value.total_abnormal = errorCountMap.value.size;
  },
  {
    immediate: true,
    deep: true,
  },
);

onActivated(() => {
  listId.value = Number(route.query.id) || 0;
  pageType.value = Number(route.query.pageType) || 1;
  assocType.value = [Number(route.query.assocType)];
  initTagsView();
  // 获取sku选项
  fetchSkuOptions();
  // 初始化线别下拉选项
  initProductLineList();
  formData.value.oid = listId.value;
  if (listId.value) {
    getDetailData();
    return;
  }
  initTableClumns(formData.value);
});
</script>
<template>
  <div class="app-container !pb-[40px]">
    <AffixButton v-bind="affixBtnData" :order-type="17" v-on="affixBtnEvent"></AffixButton>
    <el-tabs v-model="activeName" @tab-change="tabChange">
      <el-tab-pane label="详情信息" name="first">
        <el-collapse
          v-model="activeNames"
          @change="handleChange"
          class="mt-2"
          v-loading="pageLoading"
        >
          <!-- 基础信息 -->
          <el-collapse-item name="1">
            <template #title>
              <p class="font-bold text-[14px]">基础信息</p>
            </template>
            <div class="px-8">
              <PlusForm
                :disabled="pageType === 3"
                ref="PlusFormRef"
                v-model="formData"
                :columns="formColumns"
                :rules="formRules"
                :colProps="{ span: 6 }"
                :row-props="{ gutter: 10 }"
                :hasFooter="false"
                @change="handleFormChange"
                v-loading="formLoading"
                labelPosition="right"
              ></PlusForm>
            </div>
          </el-collapse-item>
          <!-- UV曲线图 -->
          <el-collapse-item name="2" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">UV曲线图</p>
            </template>
            <div class="px-8">
              <div class="h-[300px] border rounded flex justify-center align-middle">
                <el-image
                  :src="useSetting.baseHttp + formData.uv_graph_img"
                  :zoom-rate="1.2"
                  :max-scale="7"
                  :min-scale="0.2"
                  :preview-src-list="[useSetting.baseHttp + formData.uv_graph_img]"
                  :initial-index="1"
                  fit="fill"
                >
                  <template #error>
                    <div class="flex justify-center items-center h-[100%] text-2xl">
                      请上传UV曲线图
                    </div>
                  </template>
                </el-image>
              </div>
              <div class="mt-[20px]">
                <FileUpload
                  @fileChange="fileChange"
                  ref="fileUploadRef"
                  :editSrc="fileInfo.fileUrl"
                  :editName="fileInfo.fileName"
                ></FileUpload>
              </div>
            </div>
          </el-collapse-item>
          <!-- 检验信息 -->
          <el-collapse-item name="3" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">检验信息</p>
            </template>
            <div class="px-8">
              <checkInfo ref="checkInfoRef" v-bind="checkInfoData" v-on="checkInfoEvent" />
            </div>
          </el-collapse-item>

          <!-- 附件信息 -->
          <el-collapse-item name="4" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">附件信息</p>
            </template>
            <FileTable
              :fileList="formData.file_list"
              :disabled="editDisabled"
              ref="fileTableRef"
            ></FileTable>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="单据日志" name="second" v-if="editDisabled">
        <OrderLog :log-list="formData.act_log"></OrderLog>
      </el-tab-pane>
    </el-tabs>
    <!-- 签字复核组件 -->
    <QualityRecheckSign
      ref="recheckSignRef"
      @confirm="handleRecheckSignConfirm"
      v-model="recheckSignVisible"
    ></QualityRecheckSign>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/collapse.scss";
@import "@/styles/common.scss";
@import "@/styles/quality/add.scss";
:deep(.el-table .el-table__cell) {
  padding: 4px 0;
}
:deep(.el-tabs__header) {
  margin-bottom: 0;
  margin-top: 10px;
  padding-left: 10px;
  background-color: #fff;
}
:deep(.el-table .el-table__cell) {
  padding: 4px 0;
}
</style>
