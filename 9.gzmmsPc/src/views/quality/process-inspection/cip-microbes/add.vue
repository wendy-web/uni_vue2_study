<script setup lang="ts">
/* CIP微生物页面-新建/编辑 */
import type { CollapseModelValue } from "element-plus";
import type { FormInstance, TabPaneName } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import dayjs from "dayjs";
import { useRoute, useRouter } from "vue-router";
import {
  cipMicrobesApproveApi,
  cipMicrobesDelApi,
  cipMicrobesDetailApi,
  cipMicrobesRecallApi,
  cipMicrobesRejectApi,
  cipMicrobesReportApi,
  cipMicrobesReverseApi,
  cipMicrobesSaveApi,
  cipMicrobesSubmitApi,
} from "@/api/quality/process-inspection/cip-microbes";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCommonHooks } from "@/hooks/quality";
import { useTagsViewStore } from "@/store/modules/tagsView";
import FileTable from "@/views/quality/components/FileTable/index.vue";
import OrderLog from "@/views/quality/components/OrderLog/index.vue";
import RecheckSign from "@/views/quality/components/RecheckSign/index.vue";
import AffixButton from "@/views/quality/components/affixButton.vue";
import { useAdd } from "./utils/add";

defineOptions({
  name: "ProcessInspectionCipMicrobesAdd",
});

enum ETitle {
  "新增CIP微生物检验报告" = 1,
  "编辑CIP微生物检验报告",
  "CIP微生物检验报告详情",
}
const { getCheckInfo, startDownloadUrl } = useCommonHooks();
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
  getLineList,
  getUserOptions,
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
const ids = ref<unknown[]>([]);
/** 获取详情数据时的加载状态 */
const detailLoading = ref(false);

/** 表格勾选触发事件 */
function changeSelect(selection: any[]) {
  ids.value = selection.map((item) => {
    return item.id || item.addId;
  });
}

/** 点击返回 */
function handleCancel() {
  router.replace({
    path: "/quality/process-inspection/cip-microbes",
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
      const result = await cipMicrobesDelApi({ id: listId.value });
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
    fileValues.status == 3 ? await cipMicrobesRejectApi(data) : await cipMicrobesApproveApi(data);
  closeCurrentPage(result.msg);
};

/** 点击撤回 */
async function hanleRecall() {
  const result = await cipMicrobesRecallApi({ id: listId.value });
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
      const result = await cipMicrobesReverseApi({ id: listId.value });
      ElMessage.success(result.msg);
      getDetailData();
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击生成报告 */
function handleReport() {
  startDownloadUrl(cipMicrobesReportApi, { id: listId.value });
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

  // const vaildTableRes = await tableFormRef.value
  //   ?.validate((valid, fields) => {
  //     for (const keys in fields) {
  //       if (fields[keys]) {
  //         // 弹出每个字段的错误提示
  //         ElMessage.warning(fields[keys][0].message);
  //         tableFormRef.value?.scrollToField(keys);
  //         break;
  //       }
  //     }
  //   })
  //   .catch((err) => {
  //     console.log("err", err);
  //   });
  // if (!vaildTableRes) return;
  let { order_no, order_status, ct_name, create_time, report_sign, recheck_sign, ...rest } =
    baseForm.value;
  let file_list = fileTableRef.value!.getChangeFileData();

  let data = {
    ...rest,
    report_sign: report_sign ? report_sign : undefined,
    checkinfo: getCheckInfo(tableData.value),
    status: 0,
    files: file_list.length > 0 ? file_list : undefined,
  };
  console.log("🚀 ~~~.then ~ data:", data);
  let loadingText = apiStatus === 0 ? "正在保存中" : "正在提交中";
  let resultMsg = "";
  console.log("🚀 ~ handleSave ~ data:", data);
  const sendLoading = ElLoading.service({
    lock: true,
    text: loadingText,
    background: "rgba(0, 0, 0, 0.7)",
  });
  try {
    const result = listId.value
      ? await cipMicrobesSaveApi({ ...data, id: listId.value })
      : await cipMicrobesSaveApi(data);
    resultMsg = result.msg;
    if (apiStatus === 1) {
      /* 如果是提交,保存后用返回的id,调用提交接口 */
      let data = {
        id: result.data.id,
        check_ret: baseForm.value.check_ret,
        report_sign: baseForm.value.report_sign,
      };
      const submitResult = await cipMicrobesSubmitApi(data);
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
      path: "/quality/process-inspection/cip-microbes",
    });
    tagsViewStore.delView(currentTag);
  });
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

  // if (!baseForm.value.check_sign) {
  //   ElMessage.warning("检验员1签名不能为空");
  //   return;
  // }
  // if (!baseForm.value.check_sign2) {
  //   ElMessage.warning("检验员2签名不能为空");
  //   return;
  // }
  if (!baseForm.value.count_date1 || !baseForm.value.count_date2) {
    ElMessage.warning("请填写检验信息中的统计日期");
    return;
  }

  showSubmitDialog(3);
}

function showSubmitDialog(signType: number) {
  let singTitleList = ["", "检验员1签名", "检验员2签名", "签名提交"];
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
      if (signType === 1) {
        baseForm.value.check_sign = result;
      } else if (signType === 2) {
        baseForm.value.check_sign2 = result;
      } else {
        baseForm.value.report_sign = result;
      }
      updateDialog(false, "btnLoading");
      done();
      if (signType === 3) {
        handleSave(1);
      }
    },
  });
}

/** 检验信息表格点击新增 */
async function tableAdd() {
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

async function getDetailData() {
  detailLoading.value = true;
  const result = await cipMicrobesDetailApi({ id: listId.value });
  const res = result.data;
  fileData.value = res.files;
  logList.value = res.logs;

  baseForm.value.order_no = res.order_no; //单据编号-保存剔除
  baseForm.value.order_status = getStatusText(res.status); //单据状态文本-保存剔除
  status.value = res.status;
  baseForm.value.ct_name = res.ct_name; //单据状态-保存剔除
  baseForm.value.create_time = res.create_time; //单据状态-保存剔除

  baseForm.value.line_id = res.line_id; //线别id
  baseForm.value.line_name = res.line_name; //线别id
  baseForm.value.make_date = res.make_date; //生产日期
  baseForm.value.check_date = res.check_date; //检测日期
  baseForm.value.check_sign = res.check_sign; //检验员1的签名图片
  baseForm.value.check_sign2 = res.check_sign2; //检验员2的签名图片
  baseForm.value.clean_folw = res.clean_folw; //清洗流程
  baseForm.value.clean_microbe = res.clean_microbe; //清洗杀菌

  baseForm.value.count_date1 = res.count_date1;
  baseForm.value.count_date2 = res.count_date2;

  baseForm.value.check_ret = res.check_ret; //检验结果
  baseForm.value.report_user_id = res.report_user_id; //检验员id
  baseForm.value.report_user_name = res.report_user_name; //检验员名称
  baseForm.value.remark = res.remark; //备注
  tableData.value = res.checkinfo;
  if (pageType.value === 3) {
    baseForm.value.report_sign = res.report_sign ?? "";
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
  getLineList();
  getUserOptions();
  if (listId.value) {
    getDetailData();
  }
  console.log("baseForm.value.check_ret", baseForm.value.check_ret);
});

const activeName = ref("first");

const handleClick = (name: TabPaneName) => {
  activeName.value = name as string;
};
</script>
<template>
  <div class="app-container">
    <AffixButton
      :page-type="pageType"
      :status="status"
      :assoc-type="assoc_type"
      :order-type="28"
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
              >
                <template #plus-field-check_sign>
                  <div class="flex justify-start">
                    <el-button
                      type="primary"
                      @click="showSubmitDialog(1)"
                      class="mr-4"
                      v-if="!isDetailDisable"
                    >
                      点击签名
                    </el-button>
                    <el-image
                      :src="useSetting.baseHttp + baseForm.check_sign"
                      style="width: 100px; height: 60px"
                      :preview-src-list="[useSetting.baseHttp + +baseForm.check_sign]"
                      v-if="baseForm.check_sign"
                    ></el-image>
                    <span v-else class="text-gray-400">暂无~</span>
                    <el-input v-model="baseForm.check_sign" v-show="false"></el-input>
                  </div>
                </template>
                <template #plus-field-check_sign2>
                  <div class="flex justify-start">
                    <el-button
                      type="primary"
                      @click="showSubmitDialog(2)"
                      class="mr-4"
                      v-if="!isDetailDisable"
                    >
                      点击签名
                    </el-button>
                    <el-image
                      :src="useSetting.baseHttp + baseForm.check_sign2"
                      style="width: 100px; height: 60px"
                      :preview-src-list="[useSetting.baseHttp + +baseForm.check_sign2]"
                      v-if="baseForm.check_sign2"
                    ></el-image>
                    <span v-else class="text-gray-400">暂无~</span>
                    <el-input v-model="baseForm.check_sign2" v-show="false"></el-input>
                  </div>
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
                  height="800"
                  :adaptive-config="{
                    fixHeader: true,
                  }"
                  @selection-change="changeSelect"
                >
                  <!-- 时间 -->
                  <template #time="{ row, $index }">
                    <el-form-item :prop="`tableData.${$index}.time`" :rules="tableRules.time">
                      <el-time-picker
                        v-model="row.time"
                        placeholder="检验时间"
                        format="HH:mm"
                        value-format="HH:mm"
                        :disabled="isDetailDisable"
                      />
                    </el-form-item>
                  </template>
                  <!-- 样品编号 -->
                  <template #sample_no="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.sample_no`"
                      :rules="tableRules.sample_no"
                    >
                      <el-input v-model="row.sample_no" :disabled="isDetailDisable"></el-input>
                    </el-form-item>
                  </template>

                  <template #tts="{ row, $index }">
                    <el-form-item :prop="`tableData.${$index}.tts`" :rules="tableRules.tts">
                      <el-input v-model="row.tts" :disabled="isDetailDisable"></el-input>
                    </el-form-item>
                  </template>

                  <template #pH="{ row, $index }">
                    <el-form-item :prop="`tableData.${$index}.pH`" :rules="tableRules.pH">
                      <el-input v-model="row.pH" :disabled="isDetailDisable"></el-input>
                    </el-form-item>
                  </template>
                  <template #conductivity="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.conductivity`"
                      :rules="tableRules.conductivity"
                    >
                      <el-input v-model="row.conductivity" :disabled="isDetailDisable"></el-input>
                    </el-form-item>
                  </template>

                  <!-- 大肠菌群 -->
                  <template #microbe_coliform_bacteria="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.microbe_coliform_bacteria`"
                      :rules="tableRules.microbe_coliform_bacteria"
                    >
                      <el-input
                        v-model.number="row.microbe_coliform_bacteria"
                        :disabled="isDetailDisable"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- 细菌总数 -->
                  <template #microbe_bacterial="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.microbe_bacterial`"
                      :rules="tableRules.microbe_bacterial"
                    >
                      <el-input
                        v-model.number="row.microbe_bacterial"
                        :disabled="isDetailDisable"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- 酵母菌 -->
                  <template #microbe_saccharomyces="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.microbe_saccharomyces`"
                      :rules="tableRules.microbe_saccharomyces"
                    >
                      <el-input
                        v-model.number="row.microbe_saccharomyces"
                        :disabled="isDetailDisable"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- 霉菌 -->
                  <template #microbe_mold="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.microbe_mold`"
                      :rules="tableRules.microbe_mold"
                    >
                      <el-input
                        v-model.number="row.microbe_mold"
                        :disabled="isDetailDisable"
                      ></el-input>
                    </el-form-item>
                  </template>

                  <!-- 备注 -->
                  <template #note="{ row, $index }">
                    <el-form-item>
                      <el-input v-model="row.note" :disabled="isDetailDisable"></el-input>
                    </el-form-item>
                  </template>
                </PureTable>
              </el-form>
            </div>
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
