<script setup lang="ts">
/* 天平校准记录-新建/编辑页面 */
import type { CollapseModelValue } from "element-plus";
import type { FormInstance, TabPaneName } from "element-plus";
import { storageSession } from "@pureadmin/utils";
import { useRoute, useRouter } from "vue-router";
import {
  balanceCalibrationApproveApi,
  balanceCalibrationDelApi,
  balanceCalibrationDetailApi,
  balanceCalibrationRecallApi,
  balanceCalibrationRejectApi,
  balanceCalibrationReportApi,
  balanceCalibrationReverseApi,
  balanceCalibrationSaveApi,
  balanceCalibrationSubmitApi,
} from "@/api/quality/instrument/balance-calibration";
import CommonSelect from "@/components/DeptSelect/CommonSelect.vue";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCommonHooks } from "@/hooks/quality";
import { useTagsViewStore } from "@/store/modules/tagsView";
import FileTable from "@/views/quality/components/FileTable/index.vue";
import OrderLog from "@/views/quality/components/OrderLog/index.vue";
import RecheckSign from "@/views/quality/components/RecheckSign/index.vue";
import AffixButton from "@/views/quality/components/affixButton.vue";
import selectInfoVue from "./components/selectInfo.vue";
import { type ScaledeviceInitType, useAdd } from "./utils/add";

const { startDownloadUrl } = useCommonHooks();

type BalanceCalibrationDataType = {
  [key: string]: string;
};

defineOptions({
  name: "InstrumentBalanceCalibrationAdd",
});

enum ETitle {
  "新建天平校准记录" = 1,
  "编辑天平校准记录",
  "天平校准记录详情",
}

const tagsViewStore = useTagsViewStore();
const router = useRouter();
const route = useRoute();

const {
  baseForm,
  baseColumns,
  fileData,
  logList,
  tableForm,
  tableColumns,
  tableData,
  pageType,
  baseRules,
  passList,
  tableRules,
  is_submit,
  getStatusText,
  useSetting,
  isDetailDisable,
  getUserOptions,
  unitForm,
  unitFormRef,
  isAddDisable,
} = useAdd();

const headerTitle = computed(() => {
  return ETitle[pageType.value];
});

/** 附件自定义组件的ref */
const fileTableRef = ref<InstanceType<typeof FileTable>>();
/** 签字复核组件的ref */
const recheckSignRef = ref<InstanceType<typeof RecheckSign>>();
const recheckSignVisible = ref(false);

/** 身份标识数组--重要! */
const assoc_type = ref<number[]>([]);
/** 选择列表弹窗 */
const selectInfoVisible = ref(false);

/** 折叠面板的数组 */
const activeNames = ref(["1", "2"]);
const PlusFormRef = ref();
/** 基础表单的ref */
const baseFormRef = computed(() => {
  return PlusFormRef.value.formInstance as FormInstance;
});

/** 表格表单的ref */
const tableFormRef = ref<FormInstance>();

/** 用于记录编辑时,从列表传过来的id */
const listId = ref(0);
/** 用于记录单据状态 */
const status = ref();

/** 勾选的id数组 */
const ids = ref<number[]>([]);

const infoIds = computed(() => {
  return tableData.value.map((item) => item.scaledevice_id);
});

/** 获取详情数据时的加载状态 */
const detailLoading = ref(false);

/** 表格勾选触发事件 */
function changeSelect(selection: any[]) {
  ids.value = selection.map((item) => {
    return item.id;
  });
}

function selectInfoChange(list: ScaledeviceInitType[]) {
  // tableData.value
  console.log("list", list);
  let inst_type_no = uniqueByInstTypeNo(list).join("/");
  baseForm.value.scaledevice_types = inst_type_no;
  list.forEach((item) => {
    tableData.value.push({
      scaledevice_id: item.id,
      inst_type_no: item.inst_type_no,
      productserial_no: item.productserial_no,
    });
  });
}
/** 处理型号 */
function uniqueByInstTypeNo(list: ScaledeviceInitType[]) {
  const seen = new Set();
  const result = [];

  for (const item of list) {
    if (!seen.has(item.inst_type_no)) {
      seen.add(item.inst_type_no);
      result.push(item.inst_type_no);
    }
  }

  return result;
}

function handleSelectInfo() {
  selectInfoVisible.value = true;
}

/** 检验信息表格点击新增 */
async function tableAdd() {
  selectInfoVisible.value = true;
}

/** 检验信息表格点击删除 */
function tableDel() {
  tableData.value = tableData.value.filter((item) => {
    return !ids.value.includes(item.scaledevice_id);
  });
}

function handleBlur(row: any) {
  console.log("🚀 ~ handleBlur ~ row:", row);
  let { A_val, B_val, C_val, D_val, E_val } = row;
  if (A_val && B_val && C_val && D_val && E_val) {
    let AVG_val =
      (Number(A_val) + Number(B_val) + Number(C_val) + Number(D_val) + Number(E_val)) / 5;
    row.AVG_val = AVG_val.toFixed(2);
  }
}

/** 点击返回 */
function handleCancel() {
  router.replace({
    path: "/quality/instrument/balance-calibration",
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
      const result = await balanceCalibrationDelApi({ id: listId.value });
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
    fileValues.status == 3
      ? await balanceCalibrationRejectApi(data)
      : await balanceCalibrationApproveApi(data);
  closeCurrentPage(result.msg);
};

/** 点击撤回 */
async function hanleRecall() {
  const result = await balanceCalibrationRecallApi({ id: listId.value });
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
      const result = await balanceCalibrationReverseApi({ id: listId.value });
      ElMessage.success(result.msg);
      getDetailData();
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击生成报告 */
function handleReport() {
  startDownloadUrl(balanceCalibrationReportApi, { id: listId.value });
}

/** 点击保存
 * @param apiStatus 0保存 1提交
 */
async function handleSave(apiStatus = 0) {
  is_submit.value = false;
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
  const validateUnit = await unitFormRef.value?.validate((valid, fields) => {});
  if (!validateUnit) return;
  let {
    order_no,
    order_status,
    ct_name,
    create_time,
    weight_content,
    max_content,
    check_sign,
    recheck_sign,
    ...rest
  } = baseForm.value;
  let file_list = fileTableRef.value!.getChangeFileData();
  let scaledevice_ids = tableData.value.map((item) => item.id).join(",");
  let data = {
    ...rest,
    scaledevice_ids,
    file_list: file_list.length > 0 ? file_list : undefined,
    check_sign: check_sign ? check_sign : undefined,
    unit: unitForm.value.unit,
    checkinfo: tableData.value,
    // status: apiStatus,
    status: 0,
  };
  console.log("🚀 ~~~.then ~ data:", data);
  let loadingText = apiStatus === 0 ? "正在保存中" : "正在提交中";
  let resultMsg = "";
  const sendLoading = ElLoading.service({
    lock: true,
    text: loadingText,
    background: "rgba(0, 0, 0, 0.7)",
  });
  try {
    const result = listId.value
      ? await balanceCalibrationSaveApi({ ...data, id: listId.value })
      : await balanceCalibrationSaveApi(data);
    resultMsg = result.msg;
    if (apiStatus === 1) {
      /* 如果是提交,保存后用返回的id,调用提交接口 */
      let data = {
        id: result.data.id,
        check_ret: baseForm.value.check_ret,
        check_sign: baseForm.value.check_sign,
      };
      const submitResult = await balanceCalibrationSubmitApi(data);
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
      path: "/quality/instrument/balance-calibration",
    });
    tagsViewStore.delView(currentTag);
  });
}

const signDialogRef = ref();
/** 点击签字提交 */
async function handleSubmit() {
  /* 提交需要验证输入完整 */
  is_submit.value = true;
  const vaildateBaseRes = await baseFormRef.value
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
  if (!vaildateBaseRes) return;
  if (!tableData.value.length) {
    ElMessage.warning("请先填写检验信息数据");
    return;
  }
  const validateUnit = await unitFormRef.value?.validate((valid, fields) => {});
  if (!validateUnit) return;

  const vaildateTableRes = await tableFormRef
    .value!.validate((valid, fields) => {
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
  if (!vaildateTableRes) return;

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
  const result = await balanceCalibrationDetailApi({ id: listId.value });
  const res = result.data;
  fileData.value = res.files;
  logList.value = res.logs;

  baseForm.value.order_no = res.order_no; //单据编号-保存剔除
  baseForm.value.order_status = getStatusText(res.status); //单据状态文本-保存剔除
  status.value = res.status;
  baseForm.value.ct_name = res.ct_name; //单据状态-保存剔除
  baseForm.value.create_time = res.create_time; //单据状态-保存剔除
  baseForm.value.remark = res.remark; //备注
  baseForm.value.check_user_id = res.check_user_id; //检验员id
  baseForm.value.check_user_name = res.check_user_name; //检验员名称

  baseForm.value.scaledevice_types = res.scaledevice_types; //型号
  baseForm.value.use_place_id = res.use_place_id; //使用地点id
  baseForm.value.use_place = res.use_place; //使用地点名称
  baseForm.value.check_date = res.check_date; //检测日期
  baseForm.value.temperature = res.temperature; //温度
  baseForm.value.humidity = res.humidity; //湿度
  baseForm.value.weight_val = res.weight_val; //砝码重量
  baseForm.value.weight_unit = res.weight_unit; //砝码重量单位
  baseForm.value.weight_content = res.weight_val + res.weight_unit; //砝码重量显示内容
  baseForm.value.max_val = res.max_val; //MAX重量
  baseForm.value.max_unit = res.max_unit; //MAX重量单位
  baseForm.value.max_content = res.max_val + res.max_unit; //Max规格显示内容
  baseForm.value.check_ret = res.check_ret;
  unitForm.value.unit = res.unit;
  tableData.value = res.checkinfo;

  if (pageType.value === 3) {
    baseForm.value.check_sign = res.check_sign ?? "";
    baseForm.value.recheck_sign = res.recheck
      ? res.recheck.map((item: any) => item.recheck_sign).join(",")
      : "";
  }

  detailLoading.value = false;
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
  assoc_type.value = route.query.assocType ? JSON.parse(route.query.assocType as string) : [];
  initTagsView();
  getUserOptions();
  let balanceCalibrationData =
    storageSession().getItem<BalanceCalibrationDataType>("balanceCalibrationData");
  if (isAddDisable.value) {
    if (!balanceCalibrationData || !balanceCalibrationData.use_place) {
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
          path: "/quality/instrument/balance-calibration",
        });
        tagsViewStore.delView(currentTag);
      });
      return;
    }

    baseForm.value.use_place_id = balanceCalibrationData.use_place_id;
    baseForm.value.use_place = balanceCalibrationData.use_place;
    baseForm.value.weight_val = balanceCalibrationData.weight_val;
    baseForm.value.weight_unit = balanceCalibrationData.weight_unit;
    baseForm.value.weight_content = balanceCalibrationData.weight_content;
    baseForm.value.max_val = balanceCalibrationData.max_val;
    baseForm.value.max_unit = balanceCalibrationData.max_unit;
    baseForm.value.max_content = balanceCalibrationData.max_content;
  }

  if (listId.value) {
    getDetailData();
  }
});
watchEffect(() => {
  let isHaveUndefined = tableData.value.length
    ? tableData.value.some((item) => item.check_ret === undefined)
    : true;
  if (isHaveUndefined) {
    baseForm.value.check_ret = undefined;
    return;
  }

  let someRes = tableData.value.some((item) => item.check_ret === 1);
  if (someRes) {
    baseForm.value.check_ret = 2;
    let everyRes = tableData.value.every((item) => item.check_ret === 1);
    if (everyRes) {
      baseForm.value.check_ret = 1;
    }
  } else {
    baseForm.value.check_ret = 0;
  }
});

const activeName = ref("first");

const handleClick = (name: TabPaneName) => {
  activeName.value = name as string;
};
</script>
<template>
  <div class="app-container" v-loading="detailLoading">
    <AffixButton
      :page-type="pageType"
      :status="status"
      :assoc-type="assoc_type"
      :order-type="30"
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
            <div class="pr-8">
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
              >
                <!-- <template #plus-field-inst_type_no>
                  <el-input
                    v-model="baseForm.inst_type_no"
                    placeholder="请选择型号"
                    @click.native="handleSelectInfo"
                    readonly
                  >
                    <template #append>
                      <el-button
                        type="primary"
                        :icon="Search"
                        @click.stop="handleSelectInfo"
                        class=""
                      >
                        搜索
                      </el-button>
                    </template>
                  </el-input>
                </template> -->
              </PlusForm>
            </div>
          </el-collapse-item>
          <!-- 检验信息 -->
          <el-collapse-item name="2" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">检验信息</p>
            </template>
            <div class="px-8">
              <ul class="flex items-center justify-between mb-2">
                <li>
                  <template v-if="!isDetailDisable">
                    <el-button type="primary" @click="tableAdd">新增</el-button>
                    <el-button @click="tableDel">删除</el-button>
                  </template>
                </li>
              </ul>
              <el-form :model="tableForm" ref="tableFormRef">
                <PureTable
                  ref="prueTableRef"
                  row-key="scaledevice_id"
                  border
                  :columns="tableColumns"
                  :data="tableData"
                  height="700"
                  @selection-change="changeSelect"
                >
                  <!-- A_val -->
                  <template #A_val="{ row, $index }">
                    <el-form-item :prop="`tableData.${$index}.A_val`" :rules="tableRules.A_val">
                      <el-input
                        v-model="row.A_val"
                        placeholder="A值"
                        @blur="handleBlur(row)"
                        v-inputnum.num_point
                        :disabled="isDetailDisable"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- B_val -->
                  <template #B_val="{ row, $index }">
                    <el-form-item :prop="`tableData.${$index}.B_val`" :rules="tableRules.B_val">
                      <el-input
                        v-model="row.B_val"
                        placeholder="B值"
                        @blur="handleBlur(row)"
                        v-inputnum.num_point
                        :disabled="isDetailDisable"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- C_val -->
                  <template #C_val="{ row, $index }">
                    <el-form-item :prop="`tableData.${$index}.C_val`" :rules="tableRules.C_val">
                      <el-input
                        v-model="row.C_val"
                        placeholder="C值"
                        @blur="handleBlur(row)"
                        v-inputnum.num_point
                        :disabled="isDetailDisable"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- D_val -->
                  <template #D_val="{ row, $index }">
                    <el-form-item :prop="`tableData.${$index}.D_val`" :rules="tableRules.D_val">
                      <el-input
                        v-model="row.D_val"
                        placeholder="D值"
                        @blur="handleBlur(row)"
                        v-inputnum.num_point
                        :disabled="isDetailDisable"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- E_val -->
                  <template #E_val="{ row, $index }">
                    <el-form-item :prop="`tableData.${$index}.E_val`" :rules="tableRules.E_val">
                      <el-input
                        v-model="row.E_val"
                        placeholder="E值"
                        @blur="handleBlur(row)"
                        v-inputnum.num_point
                        :disabled="isDetailDisable"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- AVG_val -->
                  <template #AVG_val="{ row, $index }">
                    <el-form-item :prop="`tableData.${$index}.AVG_val`">
                      <el-input v-model="row.AVG_val" placeholder="" disabled></el-input>
                    </el-form-item>
                  </template>
                  <!-- 检定结论 -->
                  <template #check_ret="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.check_ret`"
                      :rules="tableRules.check_ret"
                    >
                      <CommonSelect
                        v-model="row.check_ret"
                        :list="passList"
                        :disabled="isDetailDisable"
                      ></CommonSelect>
                    </el-form-item>
                  </template>
                </PureTable>
              </el-form>
            </div>
          </el-collapse-item>
          <el-collapse-item name="3" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">校准说明</p>
            </template>
            <ul class="px-8">
              <li class="flex items-center">
                <span>1、校准时</span>
                <div class="circle">
                  <span class="letter A">A</span>
                  <span class="letter B">B</span>
                  <span class="letter C">C</span>
                  <span class="letter D">D</span>
                  <span class="letter E">E</span>
                </div>
                <span>按图所示，A—B—C—D—E顺序进行。</span>
              </li>
              <li>
                2、8.1kg、12.2kg电子天平，用2kg砝码校验，合格判定：中心测量值：标准值±0.1g；左、右测量值：标准值±1.0e
              </li>
              <li>
                3、2.1kg、2.2kg、3.1kg、4.1
                kg电子天平，用200g砝码校验，合格判定：中心测量值：标准值±0.02g；左、右测量值：标准值±1.0e
              </li>
              <li>
                4、210g电子天平，用200g砝码校验，合格判定：中心测量值：标准值±0.0001g；左、右测量值：标准值±1.0e
              </li>
              <li>
                5、50kg、150kg电子秤。用2kg砝码校验，合格判定：中心测量值：标准值±0.5e；左、右测量值：标准值±0.5e1
              </li>
            </ul>
          </el-collapse-item>
          <el-collapse-item name="4" class="mt-2">
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
    <selectInfoVue
      v-model="selectInfoVisible"
      :use_place_id="baseForm.use_place_id"
      :weight_val="baseForm.weight_val"
      :weight_unit="baseForm.weight_unit"
      :max_val="baseForm.max_val"
      :max_unit="baseForm.max_unit"
      :ids="infoIds"
      @change="selectInfoChange"
    ></selectInfoVue>
    <!-- 签字复核组件 -->
    <RecheckSign
      ref="recheckSignRef"
      @confirm="handleRecheckSignConfirm"
      v-model="recheckSignVisible"
    ></RecheckSign>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/quality/add.scss";
.circle {
  width: 100px;
  height: 100px;
  border: 2px solid blue;
  border-radius: 50%;
  position: relative;
  margin: 0 4px;
}

.letter {
  position: absolute;
  font-size: 12px;
  &.A {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &.B {
    top: 0px;
    left: 50%;
    transform: translate(-50%, 0);
  }

  &.C {
    top: 50%;
    right: 4px;
    transform: translate(0, -50%);
  }

  &.D {
    bottom: 0px;
    left: 50%;
    transform: translate(-50%, 0);
  }
  &.E {
    top: 50%;
    left: 4px;
    transform: translate(0, -50%);
  }
}
</style>
