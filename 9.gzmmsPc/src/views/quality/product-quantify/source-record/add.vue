<script setup lang="ts">
/* 新建定量测定原始记录 */
import type { CollapseModelValue } from "element-plus";
import type { FormInstance, TabPaneName } from "element-plus";
import { storageSession } from "@pureadmin/utils";
import { useRoute, useRouter } from "vue-router";
import {
  getSourceRecordDetailApi,
  sourceRecordApproveApi,
  sourceRecordDelApi,
  sourceRecordRecallApi,
  sourceRecordRejectApi,
  sourceRecordReportApi,
  sourceRecordReverseApi,
  sourceRecordSaveApi,
  sourceRecordSubmitApi,
} from "@/api/quality/product-quantify/source-record";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCommonHooks } from "@/hooks/quality";
import { useTagsViewStore } from "@/store/modules/tagsView";
import FileTable from "@/views/quality/components/FileTable/index.vue";
import OrderLog from "@/views/quality/components/OrderLog/index.vue";
import RecheckSign from "@/views/quality/components/RecheckSign/index.vue";
import AffixButton from "@/views/quality/components/affixButton.vue";
import otherTableVue from "./components/otherTable.vue";
import plumbumTableVue from "./components/plumbumTable.vue";
import vitaminTableVue from "./components/vitaminTable.vue";
import { useAdd } from "./utils/add";
import type { SourceRecordDataType } from "./utils/hook";

const { startDownloadUrl } = useCommonHooks();

defineOptions({
  name: "ProductQuantifySourceRecordAdd",
});

enum ETitle {
  "新增" = 1,
  "编辑",
  "详情",
}

enum EOrderTitle {
  "定量测定原始记录" = 1,
  "VB12测定记录",
  "A道原始数据",
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
  isDetailDisable,
  isOtherPage,
  isvitaminPage,
  isPlumbumPage,
  formulaValue,
  getUserOptions,
  isAddDisable,
  getBrandMap,
  getSkuMap,
  orderType,
} = useAdd();

type OtherTableVueType = InstanceType<typeof otherTableVue>;
type VitaminTableVueType = InstanceType<typeof vitaminTableVue>;
type PlumbumTableVueType = InstanceType<typeof plumbumTableVue>;

type AnyOfTheTables = OtherTableVueType | VitaminTableVueType | PlumbumTableVueType;

const dynamicComponent = computed(() => {
  if (isPlumbumPage.value) {
    return plumbumTableVue;
  } else if (isvitaminPage.value) {
    return vitaminTableVue;
  } else {
    return otherTableVue;
  }
});

const headerTitle = computed(() => {
  let orderTitle = EOrderTitle[orderType.value];
  let pageTypeTitle = ETitle[pageType.value];

  let pageTitle = pageType.value === 3 ? orderTitle + pageTypeTitle : pageTypeTitle + orderTitle;

  return pageTitle;
});

const checkTableRef = ref<AnyOfTheTables>();

/** 附件自定义组件的ref */
const fileTableRef = ref<InstanceType<typeof FileTable>>();
/** 签字复核组件的ref */
const recheckSignRef = ref<InstanceType<typeof RecheckSign>>();
const recheckSignVisible = ref(false);

/** 身份标识数组--重要! */
const assoc_type = ref<number[]>([]);

/** 折叠面板的数组 */
const activeNames = ref(["1", "2"]);
const PlusFormRef = ref();
/** 基础表单的ref */
const baseFormRef = computed(() => {
  return PlusFormRef.value?.formInstance as FormInstance;
});

/** 表格表单的ref */
const tableFormRef = ref<FormInstance>();

/** 用于记录编辑时,从列表传过来的id */
const listId = ref(0);
/** 用于记录单据状态 */
const status = ref();

/** 获取详情数据时的加载状态 */
const detailLoading = ref(false);

/** 点击返回 */
function handleCancel() {
  router.replace({
    path: "/quality/product-quantify/source-record",
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
      const result = await sourceRecordDelApi({ id: listId.value });
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
    reviewer_user_signature: fileValues.status === 3 ? undefined : fileValues.file_url, //审核签字图片地址 驳回不需要
    reason: fileValues.note, //意见内容
    check_remark: fileValues.note,
  };
  console.log("🚀 ~ data:", data);
  // 根据 status 请求不同接口：2 通过 3 驳回
  const result =
    fileValues.status == 3 ? await sourceRecordRejectApi(data) : await sourceRecordApproveApi(data);
  closeCurrentPage(result.msg);
};

/** 点击撤回 */
async function hanleRecall() {
  const result = await sourceRecordRecallApi({ id: listId.value });
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
      const result = await sourceRecordReverseApi({ id: listId.value });
      ElMessage.success(result.msg);
      getDetailData();
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击生成报告 */
async function handleReport() {
  startDownloadUrl(sourceRecordReportApi, { id: listId.value });
}

/** 点击保存
 * @param apiStatus 0保存 1提交
 */
async function handleSave(apiStatus = 0) {
  console.log("checkTableRef.value", checkTableRef.value?.tableData);
  // 保存需要验证基本信息表单的内容
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
  // 验证表格信息是否输入完整
  const vaildateTableRes = await checkTableRef.value!.vaildateTable();
  if (!vaildateTableRes) return;
  let {
    order_no,
    order_status,
    ct_name,
    create_time,
    check_sign,
    recheck_sign,
    heat,
    inst_name,
    insp_id,
    criterion,
    ...rest
  } = baseForm.value;
  let file_list = fileTableRef.value!.getChangeFileData();
  let tableData = checkTableRef.value?.tableData || [];
  let data = {
    ...rest,
    files: file_list.length > 0 ? file_list : undefined,
    check_sign: check_sign ? check_sign : undefined,
    checkinfo: getcheckInfo(tableData),
    // status: apiStatus,
    status: 0,
    formula: isOtherPage.value ? formulaValue.value : undefined, //公式-只有是其他项目时需要
    curve: isOtherPage.value ? (checkTableRef.value as OtherTableVueType)?.curveValue : undefined, //曲线-只有是其他项目时需要
    heat: isPlumbumPage.value ? undefined : heat, // 室温-A道原始时不需要
    inst_name: isPlumbumPage.value ? undefined : inst_name, // 仪器名称-A道原始时不需要
    insp_id: isPlumbumPage.value ? undefined : insp_id, // 仪器id-A道原始时不需要
    criterion: isPlumbumPage.value ? undefined : criterion, // 判定标准-A道原始时不需要
  };
  console.log("🚀 ~~~.then ~ data:", data);
  // return
  let loadingText = apiStatus === 0 ? "正在保存中" : "正在提交中";
  let resultMsg = "";
  const sendLoading = ElLoading.service({
    lock: true,
    text: loadingText,
    background: "rgba(0, 0, 0, 0.7)",
  });
  console.log("🚀 ~ handleSave ~ data:", data);
  try {
    const result = listId.value
      ? await sourceRecordSaveApi({ ...data, id: listId.value })
      : await sourceRecordSaveApi(data);
    resultMsg = result.msg;
    if (apiStatus === 1) {
      /* 如果是提交,保存后用返回的id,调用提交接口 */
      let data = {
        id: result.data.id,
        check_ret: baseForm.value.check_ret,
        check_sign: baseForm.value.check_sign,
      };
      const submitResult = await sourceRecordSubmitApi(data);
      resultMsg = submitResult.msg;
    }

    sendLoading.close();
    closeCurrentPage(resultMsg);
  } catch (error) {
    sendLoading.close();
  }
}
function getcheckInfo(tableList: any[]) {
  if (!tableList.length) return undefined;
  return tableList.map((item) => {
    let { id, ...rest } = item;
    return typeof id === "string"
      ? { ...rest, batch_no: baseForm.value.batch_no }
      : { ...item, batch_no: baseForm.value.batch_no };
  });
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
      path: "/quality/product-quantify/source-record",
    });
    tagsViewStore.delView(currentTag);
  });
}

const signDialogRef = ref();
/** 点击签字提交 */
async function handleSubmit() {
  let tableData = checkTableRef.value?.tableData || [];
  if (!tableData.length) {
    ElMessage.warning("请先填写检验信息数据");
    return;
  }
  // 验证表格信息是否输入完整
  const vaildateTableRes = await checkTableRef.value!.vaildateTable();
  console.log("🚀 ~ handleSubmit ~ vaildateRes:", vaildateTableRes);
  if (!vaildateTableRes) return;

  let errIndexList: number[] = [];
  tableData.map((el, i) => {
    if (el.check_ret === 0) {
      errIndexList.push(i + 1);
    }
  });

  if (errIndexList.length > 0) {
    let text = errIndexList.join(",");
    ElMessageBox.confirm(`第${text}条明细检验不合格,您确定要提交吗~`, "异常提示", {
      confirmButtonText: "继续提交",
      showClose: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      type: "warning",
    }).then(() => {
      showSubmitDialog();
    });
    return;
  }
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
  const result = await getSourceRecordDetailApi({ id: listId.value });
  const res = result.data;
  // assoc_type.value = res.assoc_type;
  fileData.value = res.files;
  logList.value = res.logs;

  baseForm.value.order_no = res.order_no; //单据编号-保存剔除
  baseForm.value.order_status = getStatusText(res.status); //单据状态文本-保存剔除
  status.value = res.status;
  baseForm.value.ct_name = res.ct_name; //单据状态-保存剔除
  baseForm.value.create_time = res.create_time; //单据状态-保存剔除

  baseForm.value.brand = res.brand; //产品大类(产品品牌)
  baseForm.value.sku = res.sku; //产品类型
  baseForm.value.batch_no = res.batch_no; //批次
  baseForm.value.pro_id = res.pro_id; //检测项目id
  baseForm.value.pro_name = res.pro_name; //检测项目名称
  baseForm.value.insp_id = res.insp_id; //检测标准(检验依据)id
  baseForm.value.insp_name = res.insp_name; //检验项目名名称

  if (!isPlumbumPage.value) {
    // 如果不是A道原始页面,才需要以下这些值
    baseForm.value.inst_id = res.inst_id; //仪器名称id--定量测定和VB12测定的表单数据
    baseForm.value.inst_name = res.inst_name; //仪器名称--定量测定和VB12测定的表单数据
    baseForm.value.heat = res.heat; //室温--定量测定和VB12测定的表单数据
    baseForm.value.criterion = res.criterion; //判断标准--定量测定和VB12测定的表单数据
  }

  baseForm.value.check_date = res.check_date; //检测日期
  baseForm.value.check_ret = res.check_ret; //检验结果
  baseForm.value.check_user_id = res.check_user_id; //检验员id
  baseForm.value.check_user_name = res.check_user_name; //检验员名称
  baseForm.value.remark = res.remark; //备注

  formulaValue.value = res.formula || ""; //公式
  checkTableRef.value?.setData(res.checkinfo, res.curve); //设置子组件的数据

  if (pageType.value === 3) {
    baseForm.value.check_sign = res.check_sign ?? "";
    baseForm.value.recheck_sign = res.recheck
      ? res.recheck.map((item) => item.recheck_sign).join(",")
      : "";
  }

  executeGetSettingConfig();

  detailLoading.value = false;
}

/** 获取标准配置信息 */
function executeGetSettingConfig() {
  nextTick(() => {
    let data = {
      item: 21,
      brand: baseForm.value.brand,
      sku: baseForm.value.sku,
      pro: baseForm.value.pro_name,
    };
    (checkTableRef.value as OtherTableVueType)?.getSettingConfig(data).then(() => {
      nextTick(() => {
        if (!isPlumbumPage) {
          // 如果不是A道原始的页面则执行;
          baseForm.value.criterion =
            (checkTableRef.value as OtherTableVueType)?.getCriterionText() || "";
        }
      });
    });
  });
}

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

  orderType.value = Number(route.query.orderType) || 1;
  assoc_type.value = route.query.assocType ? JSON.parse(route.query.assocType as string) : [];

  initTagsView();
  getUserOptions();
  getBrandMap();
  getSkuMap();
  if (listId.value) {
    getDetailData();
  }
  let sourceRecordData = storageSession().getItem<SourceRecordDataType>("sourceRecordData");
  console.log("🚀 ~ onActivated ~ sourceRecordData:", sourceRecordData);
  if (isAddDisable.value) {
    // 如果是新建页面
    if (!sourceRecordData || !sourceRecordData.pro_name) {
      ElMessageBox.confirm(`请您在列表中点击新增后重新进入`, "温馨提示", {
        confirmButtonText: "好的,我知道了",
        showCancelButton: false,
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "success",
      }).then(() => {
        const currentTag = router.currentRoute.value;
        router.replace({
          path: "/quality/product-quantify/source-record",
        });
        tagsViewStore.delView(currentTag);
      });
      return;
    }

    baseForm.value.brand = sourceRecordData.brand;
    baseForm.value.sku = sourceRecordData.sku;
    baseForm.value.pro_id = sourceRecordData.pro_id;
    baseForm.value.pro_name = sourceRecordData.pro_name;
    baseForm.value.insp_id = sourceRecordData.insp_id;
    baseForm.value.insp_name = sourceRecordData.insp_name;
    formulaValue.value = sourceRecordData.formula;
    baseForm.value.char = sourceRecordData.char;
    if (isOtherPage.value || isvitaminPage.value) {
      baseForm.value.inst_id = sourceRecordData.inst_id;
      baseForm.value.inst_name = sourceRecordData.inst_name;
    }
    executeGetSettingConfig();
  }
});

watchEffect(() => {
  let tableData = checkTableRef.value?.tableData || [];
  let isHaveUndefined = tableData.length
    ? tableData.some((item) => item.check_ret === undefined)
    : true;
  if (isHaveUndefined) {
    // 如果表格中 有任何一个值为undefined 则 基础信息的check_res值也设置为undefined
    baseForm.value.check_ret = undefined;
    return;
  }

  let someRes = tableData.some((item) => item.check_ret === 1);
  if (someRes) {
    // 如果表格中 有任何一个值为 1(合格), 则基础信息的check_res值先设为-部分合格;
    baseForm.value.check_ret = 2;
    let everyRes = tableData.every((item) => item.check_ret === 1);
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
</script>
<template>
  <div class="app-container !pt-0" v-loading="detailLoading">
    <AffixButton
      :page-type="pageType"
      :status="status"
      :assoc-type="assoc_type"
      :order-type="21"
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
        <el-collapse v-model="activeNames" class="mt-2">
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
                :columns="baseColumns"
                :row-props="{ gutter: 20 }"
                :col-props="{
                  span: 6,
                }"
                :hasFooter="false"
              ></PlusForm>
            </div>
          </el-collapse-item>
          <!-- 检验信息 -->
          <el-collapse-item name="2" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">检验信息</p>
            </template>
            <component
              :is="dynamicComponent"
              :formula="formulaValue"
              :disabled="isDetailDisable"
              :baseFormRef="baseFormRef"
              ref="checkTableRef"
            ></component>
          </el-collapse-item>
          <el-collapse-item name="3" class="mt-2">
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
