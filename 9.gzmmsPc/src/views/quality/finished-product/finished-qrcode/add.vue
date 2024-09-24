<script setup lang="ts">
/* 新建成品二维码确认单 */
import type { CollapseModelValue } from "element-plus";
import type { FormInstance, TabPaneName } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import dayjs from "dayjs";
import { useRoute, useRouter } from "vue-router";
import {
  finishedQrcodeAddApi,
  finishedQrcodeApproveApi,
  finishedQrcodeDelApi,
  finishedQrcodeEditApi,
  finishedQrcodeRecallApi,
  finishedQrcodeRejectApi,
  finishedQrcodeReportApi,
  finishedQrcodeReverseApi,
  finishedQrcodeSubmitApi,
  getFinishedQrcodeDetailApi,
} from "@/api/quality/finished-product/finished-qrcode/index";
import CommonSelect from "@/components/DeptSelect/CommonSelect.vue";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCommonHooks } from "@/hooks/quality";
import { useTagsViewStore } from "@/store/modules/tagsView";
import FileTable from "@/views/quality/components/FileTable/index.vue";
import OrderLog from "@/views/quality/components/OrderLog/index.vue";
import RecheckSign from "@/views/quality/components/RecheckSign/index.vue";
import AffixButton from "@/views/quality/components/affixButton.vue";
import { useAdd } from "./utils/add";

const { startDownloadUrl } = useCommonHooks();

defineOptions({
  name: "FinishedProductFinishedQrcodeAdd",
});

enum ETitle {
  "新增成品二维码确认单" = 1,
  "编辑成品二维码确认单",
  "成品二维码确认单详情",
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
  checkItemList,
  totalNum,
  abnormalNum,
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
    path: "/quality/finished-product/finished-qrcode",
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
      const result = await finishedQrcodeDelApi({ id: listId.value });
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
      ? await finishedQrcodeRejectApi(data)
      : await finishedQrcodeApproveApi(data);
  closeCurrentPage(result.msg);
};

/** 点击撤回 */
async function hanleRecall() {
  const result = await finishedQrcodeRecallApi({ id: listId.value });
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
      const result = await finishedQrcodeReverseApi({ id: listId.value });
      ElMessage.success(result.msg);
      getDetailData();
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击生成报告 */
async function handleReport() {
  startDownloadUrl(finishedQrcodeReportApi, { id: listId.value });
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
  let {
    order_no,
    order_status,
    ct_name,
    create_time,
    check_user_signature,
    reviewer_user_signature,
    ...rest
  } = baseForm.value;
  let file_list = fileTableRef.value!.getChangeFileData();

  let data = {
    ...rest,
    file_list: file_list.length > 0 ? file_list : undefined,
    check_user_signature: check_user_signature ? check_user_signature : undefined,
    check_info: getcheckInfo(),
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
      ? await finishedQrcodeEditApi({ ...data, id: listId.value })
      : await finishedQrcodeAddApi(data);
    resultMsg = result.msg;
    if (type === 2) {
      /* 如果是提交,保存后用返回的id,调用提交接口 */
      let data = {
        id: result.data.id,
        check_user_signature: baseForm.value.check_user_signature,
      };
      const submitResult = await finishedQrcodeSubmitApi(data);
      resultMsg = submitResult.msg;
    }
    sendLoading.close();
    closeCurrentPage(resultMsg);
  } catch (error) {
    sendLoading.close();
  }
}

function getcheckInfo() {
  if (!listId.value) {
    return tableData.value.length > 0
      ? tableData.value.map((item) => {
          let { id, reinspection_items, ...rest } = item;
          return {
            ...rest,
            reinspection_items: reinspection_items.join(","),
          };
        })
      : undefined;
  } else {
    return tableData.value.length > 0
      ? tableData.value.map((item) => {
          let { id, reinspection_items, ...rest } = item;
          let reinspectionItems = reinspection_items.join(",");
          return typeof id === "string"
            ? { ...rest, reinspection_items: reinspectionItems }
            : {
                ...item,
                reinspection_items: reinspectionItems,
              };
        })
      : undefined;
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
      path: "/quality/finished-product/finished-qrcode",
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
  let errIndexList: number[] = [];
  tableData.value.map((el, i) => {
    if (el.check_res === 0) {
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
    beforeCancel: (done, { options, index }) => {
      done();
    },
    beforeSure: async (done, { options, index }) => {
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

/** 检验信息点击删除 */
function tableDel() {
  tableData.value = tableData.value.filter((item) => {
    return !ids.value.includes(item.id);
  });
}

async function getDetailData() {
  detailLoading.value = true;
  const result = await getFinishedQrcodeDetailApi({ id: listId.value });
  const res = result.data;
  assoc_type.value = res.assoc_type;
  fileData.value = res.file_list;
  logList.value = res.act_log;

  baseForm.value.note = res.note; //备注
  baseForm.value.batch_no = res.batch_no; //批次
  baseForm.value.workshop = res.workshop; //车间
  baseForm.value.check_date = res.check_date; //检测日期
  baseForm.value.brand = res.brand; //产品大类(产品品牌)
  baseForm.value.check_res = res.check_res; //检验结果
  baseForm.value.check_uid = res.check_uid; //检验员id
  baseForm.value.line_id = res.line_id; //线别id

  baseForm.value.order_no = res.order_no; //单据编号-保存剔除
  baseForm.value.order_status = getStatusText(res.status); //单据状态文本-保存剔除
  status.value = res.status;
  baseForm.value.ct_name = res.ct_name; //单据状态-保存剔除
  baseForm.value.create_time = res.create_time; //单据状态-保存剔除
  // tableData.value = res.check_info;
  tableData.value = res.check_info.map((item) => {
    let { reinspection_items, reinspection_items_id, ...rest } = item;
    return {
      ...rest,
      reinspection_items: reinspection_items
        ? reinspection_items.split(",").map((el) => Number(el))
        : [],
    };
  });
  if (pageType.value === 3) {
    baseForm.value.check_user_signature = res.check_user_signature ?? "";
    baseForm.value.reviewer_user_signature = res.reviewer_user_signature ?? "";
  }
  detailLoading.value = false;
}

function onChangeSelect(row: any) {
  let {
    bottom_qr_code_res,
    pull_ring_qr_code_res,
    layout_structure_res,
    security_point_res,
    reinspection_situation_res,
  } = row;
  if (typeof reinspection_situation_res === "number") {
    row.check_res = reinspection_situation_res;
    return;
  }

  let arr = [bottom_qr_code_res, pull_ring_qr_code_res, layout_structure_res, security_point_res];
  let someRes = arr.some((item) => item === 0);
  if (someRes) {
    row.check_res = 0;
  } else {
    let everyRes = arr.every((item) => item === undefined);
    row.check_res = everyRes ? undefined : 1;
  }
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
      :order-type="16"
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
            <div class="px-8">
              <ul class="flex items-center justify-between mb-2">
                <li>
                  <template v-if="!isDetailDisable">
                    <el-button type="primary" @click="tableAdd">新增</el-button>
                    <el-button @click="tableDel">删除</el-button>
                  </template>
                </li>
                <li class="text-blue-500">
                  <span class="inline-block mr-4">总样品数:{{ totalNum }}</span>
                  <span>不合格数:{{ abnormalNum }}</span>
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
                  @selection-change="changeSelect"
                >
                  <!-- 检验日期 -->
                  <template #check_date="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.check_date`"
                      :rules="tableRules.check_date"
                    >
                      <el-date-picker
                        v-model="row.check_date"
                        type="date"
                        placeholder="检验日期"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        :disabled="isDetailDisable"
                        :disabledDate="
                          (date: string) => {
                            return dayjs().isBefore(date);
                          }
                        "
                      />
                    </el-form-item>
                  </template>
                  <!-- 检验时间 -->
                  <template #check_time="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.check_time`"
                      :rules="tableRules.check_time"
                    >
                      <el-time-picker
                        v-model="row.check_time"
                        placeholder="检验时间"
                        format="HH:mm"
                        value-format="HH:mm"
                        :disabled="isDetailDisable"
                      />
                    </el-form-item>
                  </template>
                  <!-- 批号 -->
                  <template #batch_number="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.batch_number`"
                      :rules="tableRules.batch_number"
                    >
                      <el-input
                        v-model="row.batch_number"
                        maxlength="5"
                        placeholder="请输入"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- 罐底二维码 -->
                  <template #bottom_qr_code_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.bottom_qr_code_res`"
                      :rules="tableRules.bottom_qr_code_res"
                    >
                      <CommonSelect
                        v-model="row.bottom_qr_code_res"
                        :list="passList"
                        :disabled="isDetailDisable"
                        :isWarning="row.bottom_qr_code_res === 0"
                        @change="() => onChangeSelect(row)"
                      ></CommonSelect>
                    </el-form-item>
                  </template>
                  <!-- 拉环二维码 -->
                  <template #pull_ring_qr_code_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.pull_ring_qr_code_res`"
                      :rules="tableRules.pull_ring_qr_code_res"
                    >
                      <CommonSelect
                        v-model="row.pull_ring_qr_code_res"
                        :list="passList"
                        :disabled="isDetailDisable"
                        :isWarning="row.pull_ring_qr_code_res === 0"
                        @change="() => onChangeSelect(row)"
                      ></CommonSelect>
                    </el-form-item>
                  </template>
                  <!-- 纸箱 -->
                  <template #layout_structure_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.layout_structure_res`"
                      :rules="tableRules.layout_structure_res"
                    >
                      <CommonSelect
                        v-model="row.layout_structure_res"
                        :list="passList"
                        :disabled="isDetailDisable"
                        :isWarning="row.layout_structure_res === 0"
                        @change="() => onChangeSelect(row)"
                      ></CommonSelect>
                    </el-form-item>
                  </template>

                  <!-- 防伪点 -->
                  <template #security_point_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.security_point_res`"
                      :rules="tableRules.security_point_res"
                    >
                      <CommonSelect
                        v-model="row.security_point_res"
                        :list="passList"
                        :disabled="isDetailDisable"
                        :isWarning="row.security_point_res === 0"
                        @change="() => onChangeSelect(row)"
                      ></CommonSelect>
                    </el-form-item>
                  </template>
                  <!-- 复检项目 -->
                  <template #reinspection_items="{ row, $index }">
                    <el-form-item :prop="`tableData.${$index}.reinspection_items`">
                      <CommonSelect
                        v-model="row.reinspection_items"
                        :list="checkItemList"
                        :disabled="isDetailDisable"
                        multiple
                        clearable
                      ></CommonSelect>
                    </el-form-item>
                  </template>
                  <!-- 复检情况 -->
                  <template #reinspection_situation_res="{ row, $index }">
                    <el-form-item :prop="`tableData.${$index}.reinspection_situation_res`">
                      <CommonSelect
                        v-model="row.reinspection_situation_res"
                        :list="passList"
                        :disabled="isDetailDisable"
                        :isWarning="row.reinspection_situation_res === 0"
                        @change="() => onChangeSelect(row)"
                        clearable
                      ></CommonSelect>
                    </el-form-item>
                  </template>
                  <!-- 备注 -->
                  <template #note="{ row, $index }">
                    <el-form-item :prop="`tableData.${$index}.note`">
                      <el-input
                        v-model="row.note"
                        placeholder="备注"
                        :disabled="isDetailDisable"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- 检验结果 -->
                  <template #check_res="{ row, $index }">
                    <el-form-item>
                      <CommonSelect
                        v-model="row.check_res"
                        :list="passList"
                        disabled
                        placeHint="自动判断"
                        :isWarning="row.check_res === 0"
                      ></CommonSelect>
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
