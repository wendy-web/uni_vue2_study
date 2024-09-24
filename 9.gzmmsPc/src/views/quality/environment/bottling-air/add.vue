<script setup lang="ts">
/* 灌装间空气沉降检测-新建/编辑/详情页面 */
import type { FormInstance, TabPaneName } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import { useRoute, useRouter } from "vue-router";
import {
  bottlingAirAddApi,
  bottlingAirApproveApi,
  bottlingAirDelApi,
  bottlingAirDetailApi,
  bottlingAirEditApi,
  bottlingAirRecallApi,
  bottlingAirRejectApi,
  bottlingAirReportApi,
  bottlingAirReverseApi,
  bottlingAirSubmitApi,
} from "@/api/quality/environment/bottling-air";
import CommonSelect from "@/components/DeptSelect/CommonSelect.vue";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCommonHooks } from "@/hooks/quality";
import { useTagsViewStore } from "@/store/modules/tagsView";
import OrderLog from "@/views/quality/components/OrderLog/index.vue";
import RecheckSign from "@/views/quality/components/RecheckSign/index.vue";
import AffixButton from "@/views/quality/components/affixButton.vue";
import { useAdd } from "./utils/add";

defineOptions({
  name: "EnvironmentBottlingAirAdd",
});

enum ETitle {
  "新建灌装间空气沉降检测" = 1,
  "编辑灌装间空气沉降检测",
  "灌装间空气沉降检测详情",
}

const { startDownloadUrl, getCheckInfo } = useCommonHooks();

const tagsViewStore = useTagsViewStore();
const router = useRouter();
const route = useRoute();

const {
  baseForm,
  baseColumns,
  logList,
  tableForm,
  tableColumns,
  tableData,
  pageType,
  baseRules,
  tableRules,
  is_submit,
  getStatusText,
  useSetting,
  isDetailDisable,
  lineList,
  getLineList,
  passList,
} = useAdd();

const headerTitle = computed(() => {
  return ETitle[pageType.value];
});
/** 签字复核组件的ref */
const recheckSignRef = ref<InstanceType<typeof RecheckSign>>();
const recheckSignVisible = ref(false);

/** 身份标识数组--重要! */
const assoc_type = ref<number[]>([]);
/** 折叠面板的数组 */
const activeNames = ref(["1", "2", "3"]);
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
const ids = ref<unknown[]>([]);
/** 获取详情数据时的加载状态 */
const detailLoading = ref(false);

/** 表格勾选触发事件 */
function changeSelect(selection: any[]) {
  ids.value = selection.map((item) => {
    return item.id || item.addId;
  });
}

/** 检验信息表格点击新增 */
async function tableAdd() {
  //   const vaildateRes = await baseFormRef.value
  //     .validate((valid, fields) => {
  //       for (const keys in fields) {
  //         if (fields[keys]) {
  //           // 弹出每个字段的错误提示
  //           ElMessage.warning(fields[keys][0].message);
  //           baseFormRef.value.scrollToField(keys);
  //           break;
  //         }
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("err", err);
  //     });
  //   if (!vaildateRes) return;
  tableData.value.push({
    id: buildUUID(),
  });
}

/** 检验信息表格点击删除 */
function tableDel() {
  tableData.value = tableData.value.filter((item) => {
    return !ids.value.includes(item.id);
  });
}

function countAVG(event: FocusEvent, row: any) {
  if (
    row.clean_room1_val &&
    row.clean_room2_val &&
    row.clean_room3_val &&
    row.clean_room4_val &&
    row.fill_machine_val &&
    row.seal_machine_val &&
    row.upper_cover_room_val
  ) {
    let count =
      Number(row.clean_room1_val) +
      Number(row.clean_room2_val) +
      Number(row.clean_room3_val) +
      Number(row.clean_room4_val) +
      Number(row.fill_machine_val) +
      Number(row.seal_machine_val) +
      Number(row.upper_cover_room_val);

    let avg = (count / 7).toFixed(2);
    row.avg_val = avg;
  }
}

/** 点击保存
 * @param type 1保存 2提交
 */
async function handleSave(type = 1) {
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

  const vaildTableRes = await tableFormRef.value
    ?.validate((valid, fields) => {
      for (const keys in fields) {
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          tableFormRef.value?.scrollToField(keys);
          break;
        }
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
  if (!vaildTableRes) return;
  let {
    order_no,
    order_status,
    ct_name,
    create_time,
    check_user_signature,
    reviewer_user_signature,
    ...rest
  } = baseForm.value;

  let data = {
    ...rest,
    check_user_signature: check_user_signature ? check_user_signature : undefined,
    check_info: getCheckInfo(tableData.value),
  };
  console.log("🚀 ~~~.then ~ data:", data);
  let loadingText = type === 1 ? "正在保存中" : "正在提交中";
  let resultMsg = "";
  const sendLoading = ElLoading.service({
    lock: true,
    text: loadingText,
    background: "rgba(0, 0, 0, 0.7)",
  });
  console.log("🚀 ~ handleSave ~ data:", data);
  try {
    const result = listId.value
      ? await bottlingAirEditApi({ ...data, id: listId.value })
      : await bottlingAirAddApi(data);
    resultMsg = result.msg;
    if (type === 2) {
      /* 如果是提交,保存后用返回的id,调用提交接口 */
      let data = {
        id: result.data.id,
        check_user_signature: baseForm.value.check_user_signature,
      };
      const submitResult = await bottlingAirSubmitApi(data);
      resultMsg = submitResult.msg;
    }
    sendLoading.close();
    closeCurrentPage(resultMsg);
  } catch (error) {
    sendLoading.close();
  }
}

const signDialogRef = ref();
/** 点击签字提交 */
async function handleSubmit() {
  /* 提交需要验证输入完整 */
  is_submit.value = true;
  if (!tableData.value.length) {
    ElMessage.warning("请先填写检验信息数据");
    return;
  }
  const vaildateRes = await tableFormRef
    .value!.validate((valid, fields) => {
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

  //   let errIndexList: number[] = [];
  //   tableData.value.map((el, i) => {
  //     if (el.check_res === 0) {
  //       errIndexList.push(i + 1);
  //     }
  //   });

  //   if (errIndexList.length > 0) {
  //     let text = errIndexList.join(",");
  //     ElMessageBox.confirm(`第${text}条明细检验不合格,您确定要提交吗~`, "异常提示", {
  //       confirmButtonText: "继续提交",
  //       showClose: false,
  //       closeOnClickModal: false,
  //       closeOnPressEscape: false,
  //       type: "warning",
  //     }).then(() => {
  //       showSubmitDialog();
  //     });
  //     return;
  //   }
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
      baseForm.value.check_user_signature = result;
      updateDialog(false, "btnLoading");
      done();
      handleSave(2);
    },
  });
}

/** 单元格点击签名 */
const signDialogCellRef = ref();
function cellClickSign(row: any) {
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
      h(SignDialog, {
        ref: signDialogCellRef,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      updateDialog(true, "btnLoading");
      const result = await signDialogCellRef.value.handleGenerate();
      row.filling_user_signature = result;
      console.log("🚀 ~ beforeSure: ~  row.filling_user_signature:", row.filling_user_signature);
      updateDialog(false, "btnLoading");
      done();
    },
  });
}

/** 点击返回 */
function handleCancel() {
  router.replace({
    path: "/quality/environment/bottling-air",
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
      const result = await bottlingAirDelApi({ id: listId.value });
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
    fileValues.status == 3 ? await bottlingAirRejectApi(data) : await bottlingAirApproveApi(data);
  closeCurrentPage(result.msg);
};

/** 点击撤回 */
async function hanleRecall() {
  const result = await bottlingAirRecallApi({ id: listId.value });
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
      const result = await bottlingAirReverseApi({ id: listId.value });
      ElMessage.success(result.msg);
      getDetailData();
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击生成报告 */
async function handleReport() {
  startDownloadUrl(bottlingAirReportApi, { id: listId.value });
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
      path: "/quality/environment/bottling-air",
    });
    tagsViewStore.delView(currentTag);
  });
}

async function getDetailData() {
  detailLoading.value = true;
  const result = await bottlingAirDetailApi({ id: listId.value });
  const res = result.data;
  assoc_type.value = res.assoc_type;
  logList.value = res.act_log;

  baseForm.value.note = res.note; //备注
  baseForm.value.check_date = res.check_date; //检查日期
  baseForm.value.stat_date = res.stat_date; //统计日期
  baseForm.value.tsa_config_date = res.tsa_config_date; //培养基配置日期
  baseForm.value.tsa_no = res.tsa_no; //TSA培养基批号
  baseForm.value.class_type = res.class_type; //班组
  baseForm.value.pro_status = res.pro_status; //生产状态
  baseForm.value.tsa_config_uid = res.tsa_config_uid; //培养基配置人uid

  baseForm.value.order_no = res.order_no; //单据编号-保存剔除
  baseForm.value.order_status = getStatusText(res.status); //单据状态文本-保存剔除
  status.value = res.status;
  baseForm.value.ct_name = res.ct_name; //单据状态-保存剔除
  baseForm.value.create_time = res.create_time; //单据状态-保存剔除

  tableData.value = res.check_info;
  if (pageType.value === 3) {
    baseForm.value.check_user_signature = res.check_user_signature ?? "";
    baseForm.value.reviewer_user_signature = res.reviewer_user_signature ?? "";
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
  initTagsView();
  getLineList();
  if (listId.value) {
    getDetailData();
  }
});

const activeName = ref("first");

const handleClick = (name: TabPaneName) => {
  activeName.value = name as string;
};
</script>
<template>
  <div class="app-container pt-40" v-loading="detailLoading">
    <AffixButton
      :page-type="pageType"
      :status="status"
      :assoc-type="assoc_type"
      :order-type="34"
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
                  row-key="id"
                  border
                  :columns="tableColumns"
                  :data="tableData"
                  header-cell-class-name="table-gray-header"
                  @selection-change="changeSelect"
                  max-height="700"
                >
                  <!-- 线别 -->
                  <template #line_id="{ row, $index }">
                    <el-form-item :prop="`tableData.${$index}.line_id`" :rules="tableRules.line_id">
                      <el-select v-model="row.line_id" :disabled="isDetailDisable">
                        <el-option
                          v-for="item in lineList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                  <!-- 洁净间-1 -->
                  <template #clean_room1_val="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.clean_room1_val`"
                      :rules="tableRules.clean_room1_val"
                    >
                      <el-input
                        v-model.lazy="row.clean_room1_val"
                        v-inputnum.num_point="4"
                        @blur="countAVG($event, row)"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- 洁净间-2 -->
                  <template #clean_room2_val="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.clean_room2_val`"
                      :rules="tableRules.clean_room2_val"
                    >
                      <el-input
                        v-model.lazy="row.clean_room2_val"
                        v-inputnum.num_point="4"
                        @blur="countAVG($event, row)"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- 洁净间-3 -->
                  <template #clean_room3_val="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.clean_room3_val`"
                      :rules="tableRules.clean_room3_val"
                    >
                      <el-input
                        v-model.lazy="row.clean_room3_val"
                        v-inputnum.num_point="4"
                        @blur="countAVG($event, row)"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- 洁净间-4 -->
                  <template #clean_room4_val="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.clean_room4_val`"
                      :rules="tableRules.clean_room4_val"
                    >
                      <el-input
                        v-model.lazy="row.clean_room4_val"
                        v-inputnum.num_point="4"
                        @blur="countAVG($event, row)"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- 灌装机 -->
                  <template #fill_machine_val="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.fill_machine_val`"
                      :rules="tableRules.fill_machine_val"
                    >
                      <el-input
                        v-model.lazy="row.fill_machine_val"
                        v-inputnum.num_point="4"
                        @blur="countAVG($event, row)"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- 封口机 -->
                  <template #seal_machine_val="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.seal_machine_val`"
                      :rules="tableRules.seal_machine_val"
                    >
                      <el-input
                        v-model.lazy="row.seal_machine_val"
                        v-inputnum.num_point="4"
                        @blur="countAVG($event, row)"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- 上盖间 -->
                  <template #upper_cover_room_val="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.upper_cover_room_val`"
                      :rules="tableRules.upper_cover_room_val"
                    >
                      <el-input
                        v-model.lazy="row.upper_cover_room_val"
                        v-inputnum.num_point="4"
                        @blur="countAVG($event, row)"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- 空白样 -->
                  <template #blank_sample_val="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.blank_sample_val`"
                      :rules="tableRules.blank_sample_val"
                    >
                      <el-input v-model.lazy="row.blank_sample_val" v-inputnum.num_point="4"></el-input>
                    </el-form-item>
                  </template>
                  <!-- 结果 -->
                  <template #check_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.check_res`"
                      :rules="tableRules.check_res"
                    >
                      <CommonSelect
                        v-model="row.check_res"
                        :list="passList"
                        :disabled="isDetailDisable"
                        :is-warning="row.check_res === 0"
                      ></CommonSelect>
                    </el-form-item>
                  </template>
                  <!-- 压差(Pa) -->
                  <template #pressure_diff_val="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.pressure_diff_val`"
                      :rules="tableRules.pressure_diff_val"
                    >
                      <el-input v-model.lazy="row.pressure_diff_val" v-inputnum.num_point="4"></el-input>
                    </el-form-item>
                  </template>
                  <!-- 温度 -->
                  <template #temperature_val="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.temperature_val`"
                      :rules="tableRules.temperature_val"
                    >
                      <el-input v-model.lazy="row.temperature_val" v-inputnum.num_point="4"></el-input>
                    </el-form-item>
                  </template>
                  <!-- 湿度 -->
                  <template #humidity_val="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.humidity_val`"
                      :rules="tableRules.humidity_val"
                    >
                      <el-input v-model.lazy="row.humidity_val" v-inputnum.num_point="4"></el-input>
                    </el-form-item>
                  </template>
                  <!-- 灌装人员 -->
                  <template #filling_user_signature="{ row, $index }">
                    <el-image
                      v-if="row.filling_user_signature"
                      style="width: 60px; height: 40px"
                      preview-teleported
                      :src="useSetting.baseHttp + row.filling_user_signature"
                      :preview-src-list="[useSetting.baseHttp + row.filling_user_signature]"
                    ></el-image>
                    <el-button type="primary" @click="cellClickSign(row)" link>点击签名</el-button>
                    <el-form-item
                      :prop="`tableData.${$index}.filling_user_signature`"
                      :rules="tableRules.filling_user_signature"
                    >
                      <el-input v-model="row.filling_user_signature" v-show="false"></el-input>
                    </el-form-item>
                  </template>
                  <!-- 备注 -->
                  <template #note="{ row, $index }">
                    <el-form-item>
                      <el-input v-model.lazy="row.note"></el-input>
                    </el-form-item>
                  </template>
                </PureTable>
              </el-form>
            </div>
          </el-collapse-item>
          <el-collapse-item name="3" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">实验步骤</p>
            </template>
            <div class="px-8">
              <ul class="mb-4 px-4 py-4 bg-gray-200">
                <li>
                  实验步骤：①将已配置好未长菌的TSA培养基放在各采样点处，然后从里到外逐个打开培养皿盖，使培养基表面暴露在空气中。②培养皿暴露时间为30min后，逐个盖好培养皿盖。放入培养箱中倒置于恒温培养箱中培养，培养温度37℃，培养时间48h.③培养结束后，由品管经理或化验主管对结果进行计数，方法为用肉眼对培养皿上所有的菌落直接计数，统计菌落数。化验员将检测结果记录于《灌装间空气沉降检测报告》中，并计算每条线沉降菌菌落数平均值。
                </li>
                <li>
                  结果判定：①每个测试点的沉降和平均菌落数必须低于判定标准。②当灌装间区域某个测试点的沉降菌菌落数超过判定标准时，应及时通知生产部进行卫生清洁后，采取双倍量采样，每个培养皿检测结果合格才能判定合格。
                </li>
                <li>
                  注意事项：①采样过程中，检测人员需用75%酒精进行手部和检测用具等的消毒，防止人为对样本的污染。②每条线检测时，为避免培养皿运输或搬动过程造成的影响，需同时进行对照实验，与采样手皿同法操作但不需要暴露采样，然后与采样后的培养皿一起放入恒温培养箱中培养，结果应无菌落生长。
                </li>
              </ul>
              <div class="mb-4 px-4 py-4 bg-gray-200 flex">
                <span>注：</span>
                <ul>
                  <li>1.采样点：洁净间7个点。</li>
                  <li>
                    2.备注内容填写空间、生产状态（熏蒸前、熏蒸后、开机、停机或者连续生产）。灌装间温度20℃-35℃、相对湿度45%-85%
                  </li>
                  <li>3.平均数=细菌总数（洁①+洁②+洁③+洁④+洁⑤+洁⑥+洁⑦）/7。</li>
                  <li>
                    4.判定依据：参考GB/T16294-2010医药工业洁净室（区）沉降菌的测试方法，以洁净室细菌总数为判定结果。
                  </li>
                </ul>
              </div>
            </div>
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
@import "@/styles/quality/add.scss";
</style>
