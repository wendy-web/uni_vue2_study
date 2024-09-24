<script setup lang="ts">
import { type CollapseModelValue, type FormInstance, type TabPaneName } from "element-plus";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import { useRoute, useRouter } from "vue-router";
// 引入成品检验接口
import {
  countertrialApi,
  createOrderApi,
  deleteOrderApi,
  finishOrderApi,
  getInfoApi,
  makeReportApi,
  rejectOrderApi,
  reviewrderApi,
  revokeOrderApi,
} from "@/api/quality/product-quantify/finished/index";
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

/* 新建成品检验报告 */
defineOptions({
  name: "ProductQuantifyFinishedAdd",
});
enum ETitle {
  "新建成品检验接口报告" = 1,
  "编辑成品检验接口报告",
  "成品检验接口报告详情",
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
  initBaseData,
  checkTablecolumns,
  checkTableForm,
  checkFormRules,
  checkTableData,
  handleAdd,
  handleDelRow,
  getStatusText,
  tableLableOptions,
  initTableClumns,
  errorCountMap,
  batchParams,
  getCheckInfoBaseData,
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
    path: "/quality/product-quantify/finished",
  });
}
// 点击保存：1-保存，2-提交
async function handleSave(type = 1) {
  is_submit.value = checkTableData.value.length ? true : false;
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

  initCheckInfoRef.tableFormRef.validate(async (valid: boolean) => {
    if (valid) {
      // 生产日期需要拆分两个字段
      formData.value.make_start_date = formData.value.makeDateArr[0];
      formData.value.make_end_date = formData.value.makeDateArr[1];
      // 检验信息
      formData.value.checkinfo = getcheckInfo();
      // 附件信息
      formData.value.files.forEach((item: any) => {
        if (!Number(item.id)) {
          delete item.id;
        }
      });
      let data = { ...formData.value };
      let loadingText = type === 1 ? "正在保存中" : "正在提交中";
      // if (type === 2) {
      //   /* 如果是提交,status改为1 待审核 */
      //   data.status = 1;
      // }
      let resultMsg = "";
      const sendLoading = ElLoading.service({
        lock: true,
        text: loadingText,
        background: "rgba(0, 0, 0, 0.7)",
      });
      try {
        const result = listId.value
          ? await createOrderApi({ ...data, id: listId.value })
          : await createOrderApi(data);
        resultMsg = result.msg;
        if (type === 2) {
          /* 如果是提交,保存后用返回的id,调用提交接口 */
          let data = {
            id: result.data.id,
            check_ret: formData.value.check_ret,
            check_sign: formData.value.check_sign,
          };
          const submitResult = await reviewrderApi(data);
          resultMsg = submitResult.msg;
        }
        sendLoading.close();
        handleBack(resultMsg);
      } catch (error) {
        sendLoading.close();
      }
    } else {
      console.log("error submit!");
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
      formData.value.check_sign = result;
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
    recheck_sign: fileValues.file_url,
    check_remark: fileValues.note,
  };
  // 根据 status 请求不同接口：2 通过 3 驳回
  const result = fileValues.status == 3 ? await rejectOrderApi(data) : await finishOrderApi(data);
  handleBack(result.msg);
};

// 操作按钮上绑定的变量
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
    }
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
  // 传参的时候 皱纹度,紧密度需要/100,展示的时候需要 *100 百分比显示
  return checkTableData.value?.length > 0
    ? checkTableData.value.map((item) => {
        let { unique_id, ...rest } = item;
        return { ...rest };
      })
    : undefined;
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
      path: "/quality/product-quantify/finished",
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
    formData.value.brand = res.brand;
    formData.value.sku = res.sku;
    formData.value.check_date = res.check_date;
    formData.value.batch_no = res.batch_no;
    formData.value.report_no = res.report_no;
    formData.value.spec = res.spec;
    formData.value.package = res.package;
    formData.value.make_start_date = res.make_start_date;
    formData.value.make_end_date = res.make_end_date;
    formData.value.makeDateArr = [res.make_start_date, res.make_end_date];
    formData.value.check_ret = res.check_ret;
    formData.value.check_ret_text = res.check_ret_text;
    formData.value.check_user_id = res.check_user_id;
    formData.value.check_sign = res.check_sign;
    formData.value.check_user_name = res.check_user_name;
    formData.value.recheck = res.recheck;
    formData.value.status = res.status;
    formData.value.order_status = getStatusText(res.status); //单据状态文本-保存剔除
    formData.value.remark = res.remark;
    formData.value.check_remark = res.check_remark;

    let checkinfo = res.checkinfo || [];
    checkTableData.value = checkinfo;
    formData.value.create_time = res.create_time;
    formData.value.ct_name = res.ct_name;
    formData.value.ct_uid = res.ct_uid;
    formData.value.dept_id = res.dept_id;
    formData.value.files = res.files;
    formData.value.logs = res.logs;
    formData.value.total = res.total;
    formData.value.total_abnormal = checkinfo.filter((item: any) => item.check_ret === 0).length;
    if (res.total_abnormal) {
      formData.value.total_abnormal = res.total_abnormal;
    }
    formData.value.up_name = res.up_name;
    formData.value.up_uid = res.up_uid;
    formData.value.update_time = res.update_time;
    formLoading.value = false;
    formData.value.oid = res.id;
    // await initTableClumns(formData.value);
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
      formData.value.total = checkTableData.value?.length;
      // 检验信息是否：不合格，合格，部分合格
      const allPassed = checkTableData.value.every((item) => item.check_ret === 1);
      const allFailed = checkTableData.value.every((item) => item.check_ret === 0);
      const somePassed = checkTableData.value.some((item) => item.check_ret === 1);
      const someFailed = checkTableData.value.some((item) => item.check_ret === 0);
      if (allPassed) {
        formData.value.check_ret = 1;
      } else if (allFailed) {
        formData.value.check_ret = 0;
      } else {
        // 部分合格
        if (somePassed || someFailed) {
          formData.value.check_ret = 2;
        }
      }
      formData.value.total_abnormal = checkTableData.value.filter(
        (item) => item.check_ret === 0,
      ).length;
      console.log("watch checkTableData: ", checkTableData.value);
    }
  },
  {
    deep: true,
  },
);
watch(
  () => errorCountMap.value,
  (newValue) => {
    // console.log("watch errorCountMap: ", errorCountMap.value);
    formData.value.abnormal = errorCountMap.value.size;
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
  // 初始化基础数据
  initBaseData();
  let { batch_no } = route.query;
  if (pageType.value === 1) {
    if (!batch_no) {
      ElMessageBox.confirm(`请您在列表中点击新增后重新进入`, "温馨提示", {
        confirmButtonText: "好的,我知道了",
        showCancelButton: false,
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning",
      }).then(() => {
        const currentTag = router.currentRoute.value;
        router.replace({
          path: "/quality/product-quantify/finished",
        });
        tagsViewStore.delView(currentTag);
      });
      return;
    }
    batchParams.value = {
      batch_no,
    };
    getCheckInfoBaseData(batchParams.value);
    console.log("onActivated batchParams: ", batchParams.value);
    return;
  }
  if (listId.value) {
    getDetailData();
    return;
  }
  // initTableClumns(formData.value);
});
</script>
<template>
  <div class="app-container !pb-[40px]">
    <AffixButton v-bind="affixBtnData" :order-type="23" v-on="affixBtnEvent"></AffixButton>
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
                labelWidth="90px"
                labelPosition="right"
                :columns="formColumns"
                :rules="formRules"
                :colProps="{ span: 6 }"
                :row-props="{ gutter: 10 }"
                :hasFooter="false"
                @change="handleFormChange"
                v-loading="formLoading"
              ></PlusForm>
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
              :fileList="formData.files"
              :disabled="editDisabled"
              ref="fileTableRef"
            ></FileTable>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="单据日志" name="second" v-if="editDisabled">
        <OrderLog :log-list="formData.logs"></OrderLog>
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
