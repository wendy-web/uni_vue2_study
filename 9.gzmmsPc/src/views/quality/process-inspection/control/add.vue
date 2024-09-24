<script setup lang="ts">
/* 工序控制检验报告编辑页 */
import type { CollapseModelValue } from "element-plus";
import type { FormInstance, TabPaneName } from "element-plus";
import { storageSession } from "@pureadmin/utils";
import { useRoute, useRouter } from "vue-router";
import {
  controlAddApi,
  controlApproveApi,
  controlDelApi,
  controlDetailApi,
  controlRecallApi,
  controlRejectApi,
  controlReportApi,
  controlReverseApi,
  controlSubmitApi,
} from "@/api/quality/process-inspection/control";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCommonHooks } from "@/hooks/quality";
import { useTagsViewStore } from "@/store/modules/tagsView";
import FileTable from "@/views/quality/components/FileTable/index.vue";
import OrderLog from "@/views/quality/components/OrderLog/index.vue";
import RecheckSign from "@/views/quality/components/RecheckSign/index.vue";
import AffixButton from "@/views/quality/components/affixButton.vue";
// 检测说明
import checkExplainVue from "./components/checkExplain.vue";
// 打码
// import codingVue from "./components/coding.vue";
// 灌装
// import fillingVue from "./components/filling.vue";
// 包装
// import packagingVue from "./components/packaging.vue";
// 塑封
// import plasticVue from "./components/plastic.vue";
// 专检信息
// import specialCheckVue from "./components/specialCheck.vue";
// 码垛
// import stackingVue from "./components/stacking.vue";
// 拆包
// import unpackVue from "./components/unpack.vue";
// 仓库
// import warehouseVue from "./components/warehouse.vue";
// 水处理
// import waterTreatmentVue from "./components/waterTreatment.vue";
// 称配料
// import weighingVue from "./components/weighing.vue";
import { useAdd } from "./utils/add";

const { startDownloadUrl } = useCommonHooks();

// 专检信息
const specialCheckVue = defineAsyncComponent(() => import("./components/specialCheck.vue"));
// 打码
const codingVue = defineAsyncComponent(() => import("./components/coding.vue"));
// 灌装
const fillingVue = defineAsyncComponent(() => import("./components/filling.vue"));
// 包装
const packagingVue = defineAsyncComponent(() => import("./components/packaging.vue"));
// 塑封
const plasticVue = defineAsyncComponent(() => import("./components/plastic.vue"));
// 码垛
const stackingVue = defineAsyncComponent(() => import("./components/stacking.vue"));
// 拆包
const unpackVue = defineAsyncComponent(() => import("./components/unpack.vue"));
// 仓库
const warehouseVue = defineAsyncComponent(() => import("./components/warehouse.vue"));
// 水处理
const waterTreatmentVue = defineAsyncComponent(() => import("./components/waterTreatment.vue"));
// 称配料
const weighingVue = defineAsyncComponent(() => import("./components/weighing.vue"));

defineOptions({
  name: "ProcessInspectionControlAdd",
});

enum ETitle {
  "新建工序控制检验报告" = 1,
  "编辑工序控制检验报告",
  "工序控制检验报告详情",
}

const tagsViewStore = useTagsViewStore();
const router = useRouter();
const route = useRoute();

const {
  baseForm,
  baseColumns,
  fileData,
  logList,
  pageType,
  baseRules,
  getStatusText,
  useSetting,
  getUserOptions,
  isDetailDisable,
  getLineList,
  getClasstimeOptions,
  isAddDisable,
  is_submit,
} = useAdd();

const headerTitle = computed(() => {
  return ETitle[pageType.value];
});
/** 水处理Ref  */
const waterTreatmentRef = ref<InstanceType<typeof waterTreatmentVue>>();
/** 称配料 */
const weighingRef = ref<InstanceType<typeof weighingVue>>();
/** 拆包Ref */
const unpackRef = ref<InstanceType<typeof unpackVue>>();
/** 灌装Ref */
const fillingRef = ref<InstanceType<typeof fillingVue>>();
/** 打码Ref */
const codingRef = ref<InstanceType<typeof codingVue>>();
/** 塑封Ref */
const plasticRef = ref<InstanceType<typeof plasticVue>>();
/** 包装Ref  */
const packagingRef = ref<InstanceType<typeof packagingVue>>();
/** 码垛Ref */
const stackingRef = ref<InstanceType<typeof stackingVue>>();
/** 仓库Ref */
const warehouseRef = ref<InstanceType<typeof warehouseVue>>();
/** 专检信息ref */
const specialCheckRef = ref<InstanceType<typeof specialCheckVue>>();

/** 附件自定义组件的ref */
const fileTableRef = ref<InstanceType<typeof FileTable>>();
/** 签字复核组件的ref */
const recheckSignRef = ref<InstanceType<typeof RecheckSign>>();
const recheckSignVisible = ref(false);

const checkinfoData = ref();

/** 身份标识数组--重要! */
const assoc_type = ref<number[]>([]);

/** 折叠面板的数组 */
const activeNames = ref(["1", "2", "3", "4"]);
const PlusFormRef = ref();
/** 基础表单的ref */
const baseFormRef = computed(() => {
  return PlusFormRef.value.formInstance as FormInstance;
});

/** 用于记录编辑时,从列表传过来的id */
const listId = ref(0);
/** 用于记录单据状态 */
const status = ref();
/** 用于记录编辑时,checkinfo中的id */
const checkinfoId = ref(0);
/** 获取详情数据时的加载状态 */
const detailLoading = ref(false);

/** 记录检测次数-默认2 */
const checkNum = ref(1);
/** 记录是否检测-水温/环境湿度/环境卫生 */
const checkWaterRelated = ref(1);

/** 点击返回 */
function handleCancel() {
  router.replace({
    path: "/quality/process-inspection/control",
  });
}

/** 点击删除 */
function handleDel() {
  let { order_no } = baseForm.value;
  ElMessageBox.confirm(`确认要删除单据编号为：【${order_no}】的该条内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定删除");
      const result = await controlDelApi({ id: listId.value });
      ElMessage.success(result.msg);
      closeCurrentPage(result.msg);
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击签字复核 */
function handleRecheck() {
  recheckSignVisible.value = true;
  recheckSignRef.value?.resetValues();
}

// 复核签字组件回调
const handleRecheckSignConfirm = async (fileValues: {
  file_url: string;
  note: string;
  status: number;
}) => {
  // fileValues.status 2 通过 3 驳回
  let data = {
    id: listId.value, //单据id
    recheck_sign: fileValues.status === 3 ? undefined : fileValues.file_url, //审核签字图片地址 驳回不需要
    reason: fileValues.note, //意见内容
    check_remark: fileValues.note,
  };
  console.log("🚀 ~ data:", data);
  // 根据 status 请求不同接口：2 通过 3 驳回
  const result =
    fileValues.status == 3 ? await controlRejectApi(data) : await controlApproveApi(data);
  closeCurrentPage(result.msg);
};

/** 点击撤回 */
async function hanleRecall() {
  const result = await controlRecallApi({ id: listId.value });
  ElMessage.success(result.msg);
  getDetailData();
}

/** 点击反审核 */
function handleReverse() {
  ElMessageBox.confirm(`确认要反审核该单据吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const result = await controlReverseApi({ id: listId.value });
      ElMessage.success(result.msg);
      getDetailData();
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击生成报告 */
async function handleReport() {
  startDownloadUrl(controlReportApi, { id: listId.value });
}

/** 点击保存
 * @param apiStatus 0保存 1提交
 */
async function handleSave(apiStatus = 0) {
  is_submit.value = false;
  // 保存需要验证基本信息表单的内容
  console.log("~~~baseForm.value", baseForm.value);
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

  // return;
  let water = waterTreatmentRef.value?.water; //水处理数据
  let ingredient = weighingRef.value?.ingredient; //称配料数据
  let unpacking = unpackRef.value?.unpacking; //拆包数据
  let filling = fillingRef.value?.filling; //灌装数据
  let coding = codingRef.value?.coding; //打码数据
  let wrapping = plasticRef.value?.wrapping; //塑封数据
  let packaging = packagingRef.value?.packaging; //包装数据
  let stacking = stackingRef.value?.stacking; //码垛数据
  let warehouse = warehouseRef.value?.warehouse; //仓库数据
  let special_check = specialCheckRef.value?.special_check; //专检信息数据

  let checkinfoData = {
    id: checkinfoId.value ? checkinfoId.value : undefined,
    water,
    ingredient,
    unpacking,
    filling,
    coding,
    wrapping,
    packaging,
    stacking,
    warehouse,
    special_check,
    batch_no: baseForm.value.batch_no,
  };
  console.log("🚀 ~ handleSave ~ checkinfoData:", checkinfoData);

  let { order_no, order_status, ct_name, create_time, check_sign, recheck_sign, ...rest } =
    baseForm.value;
  let file_list = fileTableRef.value!.getChangeFileData();

  let data = {
    ...rest,
    check_sign: apiStatus ? check_sign : undefined,
    checkinfo: checkinfoData,
    status: 0,
    files: file_list.length > 0 ? file_list : undefined,
    is_water: checkWaterRelated.value, //传给接口记录一下,是否检测-水温/环境湿度/环境卫生
  };
  // return
  let loadingText = apiStatus === 0 ? "正在保存中" : "正在提交中";
  let resultMsg = "";
  const sendLoading = ElLoading.service({
    lock: true,
    text: loadingText,
    background: "rgba(0, 0, 0, 0.7)",
  });
  try {
    const result = listId.value
      ? await controlAddApi({ ...data, id: listId.value })
      : await controlAddApi(data);
    resultMsg = result.msg;
    if (apiStatus === 1) {
      /* 如果是提交,保存后用返回的id,调用提交接口 */
      let data = {
        id: result.data.id,
        check_ret: baseForm.value.check_ret,
        check_sign: baseForm.value.check_sign,
      };
      const submitResult = await controlSubmitApi(data);
      resultMsg = submitResult.msg;
    }

    sendLoading.close();
    closeCurrentPage(resultMsg);
  } catch (error) {
    sendLoading.close();
  }
}

/** 弹窗提示关闭当前页面回到列表页面 */
function closeCurrentPage(resultMsg: string) {
  ElMessageBox.confirm(`${resultMsg},请回到列表页面查看~`, "温馨提示", {
    confirmButtonText: "好的,我知道了",
    showCancelButton: false,
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    type: "success",
  }).then(() => {
    const currentTag = router.currentRoute.value;
    router.replace({
      path: "/quality/process-inspection/control",
    });
    tagsViewStore.delView(currentTag);
  });
}

const signDialogRef = ref();
/** 点击签字提交 */
async function handleSubmit() {
  is_submit.value = true;
  /* 提交需要验证输入完整 */
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
  showSubmitDialog();
}

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
      const result = await signDialogRef.value.handleGenerate();
      console.log("result", result);
      baseForm.value.check_sign = result;
      updateDialog(false, "btnLoading");
      done();
      handleSave(1);
    },
  });
}

async function getDetailData() {
  detailLoading.value = true;
  const result = await controlDetailApi({ id: listId.value });
  const res = result.data;
  fileData.value = res.files;
  logList.value = res.logs;
  checkWaterRelated.value = res.is_water; //是否检测-水温/环境湿度/环境卫生

  baseForm.value.order_no = res.order_no; //单据编号-保存剔除
  baseForm.value.order_status = getStatusText(res.status); //单据状态文本-保存剔除
  status.value = res.status;
  baseForm.value.ct_name = res.ct_name; //单据状态-保存剔除
  baseForm.value.create_time = res.create_time; //单据状态-保存剔除

  baseForm.value.brand = res.brand; //产品大类(产品品牌)
  baseForm.value.batch_no = res.batch_no; //批次
  baseForm.value.line_id = res.line_id; //产线id
  baseForm.value.line_name = res.line_name; //产线名称
  baseForm.value.check_date = res.check_date; //检测日期
  baseForm.value.class_id = res.class_id; //生产班组id
  baseForm.value.class_name = res.class_name; //生产班组名称
  baseForm.value.check_ret = res.check_ret; //检验结果
  baseForm.value.check_user_id = res.check_user_id; //检验员id
  baseForm.value.check_user_name = res.check_user_name; //批次
  baseForm.value.remark = res.remark; //备注
  if (pageType.value === 3) {
    baseForm.value.check_sign = res.check_sign ?? "";
    baseForm.value.recheck_sign = res.recheck
      ? res.recheck.map((item: any) => item.recheck_sign).join(",")
      : "";
  }
  checkinfoId.value = res.checkinfo.id;
  checkinfoData.value = res.checkinfo;

  console.log("waterTreatmentRef.value", waterTreatmentRef.value);

  detailLoading.value = false;
}
watchEffect(() => {
  // 如果是新建页面 或者 detailLoading.value 为true,表示获取详情数据中,不执行赋值
  if (isAddDisable.value || detailLoading.value) return;
  waterTreatmentRef.value && waterTreatmentRef.value?.setData(checkinfoData.value?.water);
  weighingRef.value && weighingRef.value?.setData(checkinfoData.value?.ingredient);
  unpackRef.value && unpackRef.value?.setData(checkinfoData.value?.unpacking);
  fillingRef.value && fillingRef.value?.setData(checkinfoData.value?.filling);
  codingRef.value && codingRef.value?.setData(checkinfoData.value?.coding);
  plasticRef.value && plasticRef.value?.setData(checkinfoData.value?.wrapping);
  packagingRef.value && packagingRef.value?.setData(checkinfoData.value?.packaging);
  stackingRef.value && stackingRef.value?.setData(checkinfoData.value?.stacking);
  warehouseRef.value && warehouseRef.value?.setData(checkinfoData.value?.warehouse);
  specialCheckRef.value && specialCheckRef.value?.setData(checkinfoData.value?.special_check);
});

const initTagsView = () => {
  // id存在表示是编辑
  const title = headerTitle.value;
  const new_route = Object.assign({}, route, {
    title,
  });
  tagsViewStore.updateVisitedView(new_route);
};

onActivated(() => {
  listId.value = Number(route.query.id) || 0;
  pageType.value = Number(route.query.pageType) || 1;
  assoc_type.value = route.query.assocType ? JSON.parse(route.query.assocType as string) : [];
  if (isAddDisable.value) {
    // 如果是新建页面
    let controlListData = storageSession().getItem<{
      brand: string;
      checkNum: number;
      waterRelated: number;
    }>("controlListData");
    baseForm.value.brand = controlListData?.brand || "";
    checkNum.value = controlListData?.checkNum ? controlListData?.checkNum : checkNum.value;
    
    checkWaterRelated.value =
      typeof controlListData?.waterRelated != "undefined"
        ? controlListData?.waterRelated
        : checkWaterRelated.value;
  }
  initTagsView();
  getUserOptions();
  getLineList();
  getClasstimeOptions();
  if (listId.value) {
    getDetailData();
  }
});

watchEffect(() => {
  let water_checkinfo = waterTreatmentRef.value?.water?.check_info || []; //水处理数据
  let ingredient_checkinfo = weighingRef.value?.ingredient?.check_info || []; //称配料数据
  let unpacking_checkinfo = unpackRef.value?.unpacking?.check_info || []; //拆包数据
  let filling_checkinfo = fillingRef.value?.filling?.check_info || []; //灌装数据
  let coding_checkinfo = codingRef.value?.coding?.check_info || []; //打码数据
  let wrapping_checkinfo = plasticRef.value?.wrapping?.check_info || []; //塑封数据
  let packaging_checkinfo = packagingRef.value?.packaging?.check_info || []; //包装数据
  let stacking_checkinfo = stackingRef.value?.stacking?.check_info || []; //码垛数据
  let warehouse_checkinfo = warehouseRef.value?.warehouse?.check_info || []; //仓库数据
  let special_check = specialCheckRef.value?.special_check; //专检信息数据

  let cooling_water_check_ret = special_check?.cooling_water?.cooling_water_ret; //冷却水检验结果
  let coding_check_ret = special_check?.coding?.check_ret; //打码岗位检验结果
  let unpacking_check_ret = special_check?.unpacking?.check_ret; // 拆包岗位检验结果
  let stacking_check_ret = special_check?.stacking?.check_ret; //码垛岗位检验结果

  let special_check_info =
    baseForm.value.batch_no === "ND1"
      ? [unpacking_check_ret, coding_check_ret, stacking_check_ret]
      : [unpacking_check_ret, coding_check_ret, cooling_water_check_ret];

  let list = [
    water_checkinfo,
    ingredient_checkinfo,
    unpacking_checkinfo,
    filling_checkinfo,
    coding_checkinfo,
    wrapping_checkinfo,
    packaging_checkinfo,
    stacking_checkinfo,
    warehouse_checkinfo,
  ];

  let allCheckRet = list.flatMap((array) => array.map((obj) => obj.check_ret));
  allCheckRet.concat(special_check_info);
  let isHaveUndefined = allCheckRet.length ? allCheckRet.some((item) => item === undefined) : true;

  if (isHaveUndefined) {
    // 如果信息中 有任何一个值为undefined 则 基础信息的check_res值也设置为undefined
    baseForm.value.check_ret = undefined;
    return;
  }

  let someRes = allCheckRet.some((item) => item === 1);
  if (someRes) {
    // 如果信息中 有任何一个值为 1(合格), 则基础信息的check_res值先设为-部分合格;
    baseForm.value.check_ret = 2;
    let everyRes = allCheckRet.every((item) => item === 1);
    if (everyRes) {
      // 如果所有的值都为 1(合格),则基础信息的check_res值设为-合格;
      baseForm.value.check_ret = 1;
    }
  } else {
    // 此条件标识, 没有一个是合格的,基础信息的check_res值设为-不合格
    baseForm.value.check_ret = 0;
  }
});

const activeName = ref("first");
const handleClick = (name: TabPaneName) => {
  activeName.value = name as string;
};

const checkName = ref("water");
const handleCheckSwitch = (name: TabPaneName) => {
  checkName.value = name as string;
};
</script>
<template>
  <div class="app-container !pt-0" v-loading="detailLoading">
    <AffixButton
      :page-type="pageType"
      :status="status"
      :assoc-type="assoc_type"
      :order-type="26"
      v-on="{
        cancel: handleCancel,
        save: handleSave,
        submit: handleSubmit,
        recheck: handleRecheck,
        recall: hanleRecall,
        reverse: handleReverse,
        delete: handleDel,
        report: handleReport,
      }"
    ></AffixButton>
    <el-tabs v-model="activeName" @tab-change="handleClick">
      <el-tab-pane label="单据内容" name="first">
        <el-collapse v-model="activeNames">
          <!-- 基础信息 -->
          <el-collapse-item name="1">
            <template #title>
              <p class="font-bold text-[14px]">基础信息</p>
            </template>
            <div class="px-8">
              <PlusForm
                :disabled="isDetailDisable"
                ref="PlusFormRef"
                :rules="baseRules"
                v-model="baseForm"
                labelWidth="90"
                label-position="right"
                :columns="baseColumns"
                :row-props="{ gutter: 20 }"
                :col-props="{
                  span: 6,
                }"
                :hasFooter="false"
              ></PlusForm>
            </div>
          </el-collapse-item>
          <!-- 岗位检测 -->
          <el-collapse-item name="2" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">岗位检测</p>
            </template>
            <div class="px-8">
              <el-tabs v-model="checkName" @tab-change="handleCheckSwitch" class="max-h-[640px]">
                <el-tab-pane label="水处理" name="water">
                  <waterTreatmentVue
                    ref="waterTreatmentRef"
                    :check-num="checkNum"
                    :isDetailDisable="isDetailDisable"
                    :checkAllShow="Boolean(checkWaterRelated)"
                  ></waterTreatmentVue>
                </el-tab-pane>
                <el-tab-pane label="称配料" name="ingredient">
                  <weighingVue
                    ref="weighingRef"
                    :check-num="checkNum"
                    :isDetailDisable="isDetailDisable"
                  ></weighingVue>
                </el-tab-pane>
                <el-tab-pane label="拆包" name="unpacking">
                  <unpackVue
                    ref="unpackRef"
                    :check-num="checkNum"
                    :isDetailDisable="isDetailDisable"
                  ></unpackVue>
                </el-tab-pane>
                <el-tab-pane label="灌装" name="filling">
                  <fillingVue
                    ref="fillingRef"
                    :check-num="checkNum"
                    :isDetailDisable="isDetailDisable"
                  ></fillingVue>
                </el-tab-pane>
                <el-tab-pane label="打码" name="coding">
                  <codingVue
                    ref="codingRef"
                    :check-num="checkNum"
                    :isDetailDisable="isDetailDisable"
                  ></codingVue>
                </el-tab-pane>
                <el-tab-pane label="塑封" name="wrapping">
                  <plasticVue
                    ref="plasticRef"
                    :check-num="checkNum"
                    :isDetailDisable="isDetailDisable"
                  ></plasticVue>
                </el-tab-pane>
                <el-tab-pane label="包装" :check-num="checkNum" name="packaging">
                  <packagingVue
                    ref="packagingRef"
                    :check-num="checkNum"
                    :isDetailDisable="isDetailDisable"
                  ></packagingVue>
                </el-tab-pane>
                <el-tab-pane label="码垛" name="stacking">
                  <stackingVue
                    ref="stackingRef"
                    :check-num="checkNum"
                    :isDetailDisable="isDetailDisable"
                  ></stackingVue>
                </el-tab-pane>
                <el-tab-pane label="仓库" name="warehouse">
                  <warehouseVue
                    ref="warehouseRef"
                    :check-num="checkNum"
                    :isDetailDisable="isDetailDisable"
                  ></warehouseVue>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-collapse-item>
          <el-collapse-item name="3" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">专检信息</p>
            </template>
            <div class="px-8">
              <specialCheckVue
                ref="specialCheckRef"
                :isDetailDisable="isDetailDisable"
                :brand="baseForm.brand"
              ></specialCheckVue>
            </div>
          </el-collapse-item>
          <el-collapse-item name="4" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">检测说明</p>
            </template>
            <checkExplainVue :brand="baseForm.brand"></checkExplainVue>
          </el-collapse-item>
          <el-collapse-item name="5" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">附件信息</p>
            </template>
            <FileTable
              :fileList="fileData"
              :disabled="isDetailDisable"
              ref="fileTableRef"
            ></FileTable>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="单据日志" name="second" v-if="isDetailDisable">
        <OrderLog :log-list="logList"></OrderLog>
      </el-tab-pane>
    </el-tabs>
    <!-- 签字复核组件 -->
    <RecheckSign
      ref="recheckSignRef"
      @confirm="handleRecheckSignConfirm"
      v-model="recheckSignVisible"
    ></RecheckSign>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/collapse.scss";
@import "@/styles/common.scss";
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
