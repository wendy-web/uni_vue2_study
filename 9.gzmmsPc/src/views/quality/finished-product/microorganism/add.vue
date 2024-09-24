<script setup lang="ts">
/* 新建理化及微生物检验报告 */
import {
  type CollapseModelValue,
  ElSpace,
  type FormInstance,
  type TabPaneName,
} from "element-plus";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import { useRoute, useRouter } from "vue-router";
// 引入理化及微生物接口
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
} from "@/api/quality/finished-product/microorganism/index";
// 签名组件
import QualitySignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
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
  name: "FinishedProductMicroorganismAdd",
});
enum ETitle {
  "新建理化及微生物检验报告" = 1,
  "编辑理化及微生物检测报告",
  "理化及微生物检测报告详情",
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
  is_submit,
  signSubmit, // 签名提交时候需要校验 理化微生物检验是否签名
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
const activeNames = ref(["1", "2", "3"]);
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
    path: "/quality/finished-product/microorganism",
  });
}
// 点击保存：1-保存，2-提交
async function handleSave(type = 1) {
  // is_submit.value = checkTableData.value.length ? true : false;
  is_submit.value = false;
  signSubmit.value = false;
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
  let checkinfoValidateRes: any = await checkInfoRef.value!.validateForm();
  if (!checkinfoValidateRes) return;
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
  } catch (error) {}
  // 检验信息是否填写完整
  // let initCheckInfoRef = checkInfoRef.value as any;
  // initCheckInfoRef.tableFormRef.validate(async (valid: boolean, fields: any) => {
  //   if (valid) {
  //     // 检验信息
  //     formData.value.check_info = getcheckInfo();
  //     // 附件信息
  //     formData.value.file_list.forEach((item: any) => {
  //       if (!Number(item.id)) {
  //         delete item.id;
  //       }
  //     });
  //     let data = { ...formData.value };
  //     let resultMsg = "";
  //     try {
  //       const result = listId.value
  //         ? await editOrderApi({ ...data, id: listId.value })
  //         : await createOrderApi(data);
  //       resultMsg = result.msg;
  //       if (type === 2) {
  //         /* 如果是提交,保存后用返回的id,调用提交接口 */
  //         let data = {
  //           id: result.data.id,
  //           check_user_signature: formData.value.check_user_signature,
  //         };
  //         const submitResult = await reviewrderApi(data);
  //         resultMsg = submitResult.msg;
  //       }
  //       handleBack(resultMsg);
  //     } catch (error) {}
  //   } else {
  //     for (const keys in fields) {
  //       if (fields[keys]) {
  //         // 弹出每个字段的错误提示
  //         ElMessage.warning(fields[keys][0].message);
  //         console.log("initCheckInfoRef.tableFormRef.value：", initCheckInfoRef.tableFormRef);
  //         initCheckInfoRef.tableFormRef.scrollToField(keys);
  //         break;
  //       }
  //     }
  //     console.log("error submit!");
  //   }
  // });
}
// 签字提交
async function handleSubmit() {
  is_submit.value = true;
  signSubmit.value = true;

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

// 检验员签名
const handleSign = (key: string) => {
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
      console.log("result", result);
      formData.value[key] = result;
      // 更新签名地址
      updateDialog(false, "btnLoading");
      done();
    },
  });
};
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
      path: "/quality/finished-product/microorganism",
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
    formData.value.pro_date = res.pro_date;
    formData.value.brand = res.brand;
    formData.value.sku = res.sku;
    formData.value.microbe_statistical_date1 = res.microbe_statistical_date1;
    formData.value.microbe_statistical_date2 = res.microbe_statistical_date2;
    formData.value.line_id = res.line_id;
    formData.value.status = res.status;
    formData.value.check_res = res.check_res;
    formData.value.microbial_check_user_signature = res.microbial_check_user_signature;
    formData.value.physical_check_user_signature = res.physical_check_user_signature;
    formData.value.check_user_signature = res.check_user_signature;
    formData.value.report_user_signature = res.report_user_signature;
    formData.value.reviewer_user_signature = res.reviewer_user_signature;
    formData.value.liquid_level_check_res = res.liquid_level_check_res;
    formData.value.net_check_res = res.net_check_res;
    formData.value.report_uid = res.report_uid;
    formData.value.note = res.note;
    let checkinfo = res.check_info || [];
    checkTableData.value = checkinfo;
    formData.value.create_time = res.create_time;
    formData.value.ct_name = res.ct_name;
    formData.value.ct_uid = res.ct_uid;
    formData.value.dept_id = res.dept_id;
    formData.value.file_list = res.file_list;
    formData.value.act_log = res.act_log;
    formData.value.total_sample = res.total_sample;
    formData.value.total_abnorma = res.total_abnorma;
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
      // 不合格数量:不合格的行数(检验结果不合格)
      formData.value.total_abnormal = checkTableData.value.filter(
        (item) => item.check_res === 0,
      ).length;
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
      // console.log("watch formData.value.check_res: ", formData.value.check_res);
      console.log("watch checkTableData: ", checkTableData.value);
    }
  },
  {
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
    <AffixButton v-bind="affixBtnData" :order-type="13" v-on="affixBtnEvent"></AffixButton>
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
                labelWidth="90px"
                labelPosition="right"
              >
                <!-- 理化指标检验员签名 -->
                <template #plus-field-physical_check_user_signature>
                  <el-image
                    :class="'w-[100px] h-[40px]'"
                    :src="useSetting.baseHttp + formData.physical_check_user_signature"
                    :zoom-rate="1.2"
                    :max-scale="7"
                    :min-scale="0.2"
                    :preview-src-list="[
                      useSetting.baseHttp + formData.physical_check_user_signature,
                    ]"
                    :initial-index="4"
                    fit="contain"
                  >
                    <template #error>
                      <el-button @click="handleSign('physical_check_user_signature')">
                        点击签名
                      </el-button>
                    </template>
                  </el-image>
                </template>
                <!-- 微生物指标检验员签名 -->
                <template #plus-field-microbial_check_user_signature>
                  <el-image
                    :class="'w-[100px] h-[40px]'"
                    :src="useSetting.baseHttp + formData.microbial_check_user_signature"
                    :zoom-rate="1.2"
                    :max-scale="7"
                    :min-scale="0.2"
                    :preview-src-list="[
                      useSetting.baseHttp + formData.microbial_check_user_signature,
                    ]"
                    :initial-index="4"
                    fit="contain"
                  >
                    <template #error>
                      <el-button @click="handleSign('microbial_check_user_signature')">
                        点击签名
                      </el-button>
                    </template>
                  </el-image>
                </template>
              </PlusForm>
            </div>
          </el-collapse-item>
          <!-- 检验信息 -->
          <el-collapse-item name="2" class="mt-2">
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
