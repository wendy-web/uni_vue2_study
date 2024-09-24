<script setup lang="ts">
import { type CollapseModelValue, type FormInstance, type TabPaneName } from "element-plus";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import { useRoute, useRouter } from "vue-router";
// 引入化验室空气沉降检测接口
import {
  countertrialApi,
  createOrderApi,
  deleteOrderApi,
  editOrderApi,
  finishOrderApi,
  getInfoApi,
  rejectOrderApi,
  reviewrderApi,
  revokeOrderApi,
} from "@/api/quality/environment/laboratory-air/index";
// 签名组件
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCommonHooks } from "@/hooks/quality";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useTagsViewStore } from "@/store/modules/tagsView";
import OrderLog from "@/views/quality/components/OrderLog/index.vue";
// 复核签名+备注组件
import QualityRecheckSign from "@/views/quality/components/RecheckSign/index.vue";
// 引入订单操作按钮
import AffixButton from "@/views/quality/components/affixButton.vue";
import checkInfo from "./components/checkInfo.vue";
import { useAdd } from "./utils/add";

const { startDownloadUrl } = useCommonHooks();

/* 化验室空气沉降检测编辑页 */
defineOptions({
  name: "EnvironmentLaboratoryAirAdd",
});
enum ETitle {
  "新建化验室空气沉降检测记录" = 1,
  "编辑化验室空气沉降检测记录",
  "化验室空气沉降检测记录详情",
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
  checkTablecolumns,
  checkTableForm,
  checkFormRules,
  checkTableData,
  initCheckTableData,
  tableLableOptions,
  errorCountMap,
  is_submit,
  getStatusText,
  disabledSku,
  initBaseData,
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
    path: "/quality/environment/laboratory-air",
  });
}
// 点击保存：1-保存，2-提交
async function handleSave(type = 1) {
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
      formData.value.files.forEach((item: any) => {
        if (!Number(item.id)) {
          delete item.id;
        }
      });
      let data: any = { ...formData.value };
      let loadingText = type === 1 ? "正在保存中" : "正在提交中";
      const sendLoading = ElLoading.service({
        lock: true,
        text: loadingText,
        background: "rgba(0, 0, 0, 0.7)",
      });
      let resultMsg = "";
      try {
        // if (type === 2) {
        //   /* 如果是提交,status改为1 待审核 */
        //   data.status = 1;
        // }
        const result = listId.value
          ? await editOrderApi({ ...data, id: listId.value })
          : await createOrderApi(data);
        resultMsg = result.msg;
        if (type === 2) {
          /* 如果是提交,保存后用返回的id,调用提交接口 */
          let data = {
            id: result.data.id,
            check_res: formData.value.check_res,
            check_user_signature: formData.value.check_user_signature,
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
      for (const keys in fields) {
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          initCheckInfoRef.tableFormRef.scrollToField(keys);
          break;
        }
      }
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
  // let { check_ret } = formData.value;
  // if (check_ret === null || check_ret === undefined) {
  //   ElMessage.warning("请先填写检验结果");
  //   return;
  // }

  addDialog({
    ...dialogOptions,
    title: "签名",
    contentRenderer: () =>
      h(SignDialog, {
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
};

// /** 监听表单的变化 */
const handleFormChange = (values: FieldValues, column: PlusColumn) => {
  let { prop } = column;

  // 修改产品大类
  if (["brand"].includes(prop)) {
    console.log("brand formChange:", values[prop]);
    disabledSku.value = values[prop] ? false : true;
    console.log("brand formChange disabledSku.value:", disabledSku.value);
    // 切换产品大类，清空产品类型
    formData.value.sku = "";
  }
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
const checkInfoEvent = {};
function getcheckInfo() {
  // 传参的时候 皱纹度,紧密度需要/100,展示的时候需要 *100 百分比显示
  return checkTableData.value?.length > 0
    ? checkTableData.value.map((item) => {
        let { ...rest } = item;
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
      path: "/quality/environment/laboratory-air",
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
    formData.value.tsa_no = res.tsa_no;
    formData.value.brand = res.brand;
    formData.value.tsa_config_uid = res.tsa_config_uid;
    formData.value.tsa_config_user_signature = res.tsa_config_user_signature;
    formData.value.tsa_config_date = res.tsa_config_date;
    formData.value.ct_time = res.ct_time;
    formData.value.check_date = res.check_date;
    formData.value.stat_date = res.stat_date;
    formData.value.pro_status = res.pro_status;
    formData.value.check_uid = res.check_uid;
    formData.value.check_user_signature = res.check_user_signature;
    formData.value.temperature_val = res.temperature_val;
    formData.value.humidity_val = res.humidity_val;
    formData.value.reviewer_user_signature = res.reviewer_user_signature;
    formData.value.reviewer_date = res.reviewer_date;
    formData.value.reviewer_uid = res.reviewer_uid;
    formData.value.status = res.status;
    formData.value.order_status = getStatusText(res.status); //单据状态文本-保存剔除
    formData.value.note = res.note;

    let checkinfo = res.check_info || [];
    checkinfo.forEach((item: any) => {
      item.title = "TAS";
      item.subtitle = "细菌总数";
    });
    checkTableData.value = checkinfo;
    formData.value.create_time = res.create_time;
    formData.value.ct_name = res.ct_name;
    formData.value.ct_uid = res.ct_uid;
    formData.value.dept_id = res.dept_id;
    formData.value.files = res.file_list;
    formData.value.logs = res.act_log;
    formData.value.oid = res.id;
    formLoading.value = false;
    // 如果没有检查数据
    if (checkinfo.length == 0) {
      initCheckTableData();
    }
    // nextTick(async () => {
    //   let initCheckInfoRef = checkInfoRef.value as any;
    //   if (initCheckInfoRef.validateForm && !editDisabled.value) {
    //     await initCheckInfoRef.validateForm();
    //   }
    // });
  } catch (error) {
    formLoading.value = false;
  }
}
// 签名弹窗
function showSubmitDialog(signType: number) {
  let singTitleList = ["签名"];
  let singTitle = singTitleList[signType];
  addDialog({
    width: "60%",
    btnClass: "w-[80px]",
    draggable: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    btnLoading: false,
    showClose: false,
    title: singTitle,
    contentRenderer: () =>
      h(SignDialog, {
        ref: signDialogRef,
      }),
    beforeCancel: (done, { options, index }) => {
      done();
    },
    beforeSure: async (done, { options, index }) => {
      updateDialog(true, "btnLoading");
      const result = await signDialogRef.value.handleGenerate();
      console.log("result", result);
      if (signType === 0) {
        formData.value.tsa_config_user_signature = result;
      }
      updateDialog(false, "btnLoading");
      done();
    },
  });
}
watch(
  () => checkTableData.value,
  (newValue) => {},
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
  baseFormRef.value?.resetFields();
  checkTableData.value = [];
  formData.value.files = [];
  formData.value.logs = [];
  initTagsView();
  // 初始化基础数据
  initBaseData();
  if (listId.value) {
    getDetailData();
    return;
  }
  initCheckTableData();
});
</script>
<template>
  <div class="app-container !pb-[40px]">
    <AffixButton v-bind="affixBtnData" :order-type="36" v-on="affixBtnEvent"></AffixButton>
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
                :row-props="{ gutter: 10 }"
                :colProps="{ span: 6 }"
                :hasFooter="false"
                @change="handleFormChange"
                v-loading="formLoading"
              >
                <template #plus-field-tsa_config_user_signature>
                  <div class="flex justify-start">
                    <el-button
                      type="primary"
                      @click="showSubmitDialog(0)"
                      class="mr-4"
                      v-if="!editDisabled"
                    >
                      点击签名
                    </el-button>
                    <el-image
                      :src="useSetting.baseHttp + formData.tsa_config_user_signature"
                      style="width: 100px; height: 60px"
                      :preview-src-list="[
                        useSetting.baseHttp + +formData.tsa_config_user_signature,
                      ]"
                      v-if="formData.tsa_config_user_signature"
                    ></el-image>
                    <span v-else class="text-gray-400">暂无~</span>
                    <el-input
                      v-model="formData.tsa_config_user_signature"
                      v-show="false"
                    ></el-input>
                  </div>
                </template>
              </PlusForm>
            </div>
          </el-collapse-item>
          <!-- 检验信息 -->
          <el-collapse-item name="2" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">检查内容</p>
            </template>
            <div class="px-8">
              <checkInfo ref="checkInfoRef" v-bind="checkInfoData" v-on="checkInfoEvent" />
            </div>
          </el-collapse-item>

          <!-- 实验步骤 -->
          <el-collapse-item name="4" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">实验步骤</p>
            </template>
            <div class="pl-8">
              <el-text tag="b">实验步骤：</el-text>
              <el-space alignment="flex-start" direction="vertical">
                <el-text>
                  ①将已配置好未长菌的TSA培养基放在各采样点处，然后从里到外逐个打开培养皿盖，使培养基表面暴露在空气中。
                </el-text>
                <el-text>
                  ②培养皿暴露时间为30min后，逐个盖好培养皿盖。放入培养箱中倒置于恒温培养箱中培养，培养温度37℃，培养时间48h。
                </el-text>
                <el-text>
                  ③培养结束后，由品管经理或化验主管对结果进行计数，方法为用肉眼对培养皿上所有的菌落直接计数，统计菌落数。化验员将检测结果记录于《化验室空气沉降检测报告》中，并计算每条线沉降菌菌落数平均值。
                </el-text>
              </el-space>
            </div>
            <div class="pl-8">
              <el-text tag="b">结果判定：</el-text>
              <el-space alignment="flex-start" direction="vertical">
                <el-text>①每个测试点的沉降和平均菌落数必须低于判定标准。</el-text>
                <el-text>
                  ②当化验室内微生物检测室或百级超净台区域某个测试点的沉降菌菌落数超过判定标准时，当班微生物检测岗位化验员应对微生物检测室和百济级超级台进行卫生清洁，并开臭氧发生器杀菌10min后，重新采取双倍量采样，每个培养皿检测结果合格才能判定合格。
                </el-text>
              </el-space>
            </div>
            <div class="pl-8">
              <el-text tag="b">注意事项：</el-text>
              <el-space alignment="flex-start" direction="vertical">
                <el-text>
                  ①采样过程中，检测人员需用75%酒精进行手部和检测用具等的消毒，防止人为对样本的污染。
                </el-text>
                <el-text>
                  ②每条线检测时，为避免培养皿运输或搬动过程造成的影响，需同时进行对照实验，与采样手皿同法操作但不需要暴露采样，然后与采样后的培养皿一起放入恒温培养箱中培养，结果应无菌落生长。
                </el-text>
              </el-space>
            </div>
            <div class="pl-8">
              <el-text tag="i">注：</el-text>
              <el-space alignment="flex-start" direction="vertical">
                <el-text>
                  1.化验室内微生物检测室5个采样点，包括检测室4个角落（不含百级超净台内）和中心，百级超净台2个采样点。
                </el-text>
                <el-text>2.化验室温度18℃-26℃、相对湿度45%-65%</el-text>
                <el-text>3.平均数=检测各点菌落总数之和/检测点数。</el-text>
                <el-text>
                  4.判定依据：参考GB/T
                  16294-2010医药工业洁净室（区）沉降菌的测试方法，以洁净室细菌总数为判定结果。
                </el-text>
              </el-space>
            </div>
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
@import "@/styles/quality/add.scss";
:deep(.el-table .el-table__cell) {
  padding: 4px 0;
}
:deep(.el-tabs__header) {
  margin-bottom: 0;
  margin-top: 10px;
  padding-left: 10px;
  background-color: #fff !important;
}
:deep(.el-table .el-table__cell) {
  padding: 4px 0;
}
</style>
