<script setup lang="ts">
/* 新建成品发货通知单 */
import type { FormInstance, TabPaneName } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import {
  getProductNoticeDetailApi,
  productNoticApproveApi,
  productNoticDelApi,
  productNoticRecallApi,
  productNoticReportApi,
  productNoticReverseApi,
  productNoticSubmitApi,
  productNoticeAddApi,
  productNoticeEditApi,
  productNoticeRejectApi,
} from "@/api/quality/finished-product/notice";
import CommonSelect from "@/components/DeptSelect/CommonSelect.vue";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCommonHooks } from "@/hooks/quality";
import { useTagsViewStore } from "@/store/modules/tagsView";
import FileTable from "@/views/quality/components/FileTable/index.vue";
import OrderLog from "@/views/quality/components/OrderLog/index.vue";
import RecheckSign from "@/views/quality/components/RecheckSign/index.vue";
import AffixButton from "@/views/quality/components/affixButton.vue";
import waitListVue from "./components/waitList.vue";
import { type GroupedPacks, useAdd } from "./utils/add";

const { startDownloadUrl } = useCommonHooks();

defineOptions({
  name: "FinishedProductNoticeAdd",
});

enum ETitle {
  "新增成品发货通知单" = 1,
  "编辑成品发货通知单",
  "成品发货通知单详情",
}
const tagsViewStore = useTagsViewStore();
const router = useRouter();
const route = useRoute();

const {
  baseForm,
  baseColumns,
  fileData,
  logList,
  tableColumns,
  tableData,
  pageType,
  baseRules,
  getStatusText,
  useSetting,
  isDetailDisable,
  skuList,
  getSkuMap,
  groupsData,
  formatTable,
  updateGroupsWithNewData,
  cellMouseEnter,
  cellMouseLeave,
  cellClick,
  formatSendBatchList,
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

/** 选择批号列表弹窗 */
const waitListVisible = ref(false);

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
const batchNoList = ref<string[]>([]);
/** 获取详情数据时的加载状态 */
const detailLoading = ref(false);

/** 记录已从弹窗勾选的id数组 */
const batchIds = computed(() => {
  let arr = Object.values(groupsData.value).flat();
  let ids = arr.map((item) => item.unique_id);
  return ids;
});

function waitListChange(list: any[]) {
  // 根据批号分组且根据包号排序
  updateGroupsWithNewData(list, groupsData.value);
  console.log("🚀 ~ waitListChange ~ groupsData.value:", groupsData.value);
  tableData.value = formatTable(groupsData.value);
  console.log("🚀 ~ waitListChange ~ tableData.value:", tableData.value);
}

/** 表格勾选触发事件 */
function changeSelect(selection: any[]) {
  batchNoList.value = selection.map((item) => {
    return item.batch_no;
  });
}

/** 点击返回 */
function handleCancel() {
  router.replace({
    path: "/quality/finished-product/notice",
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
      const result = await productNoticDelApi({ id: listId.value });
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
      ? await productNoticeRejectApi(data)
      : await productNoticApproveApi(data);
  closeCurrentPage(result.msg);
};

/** 点击撤回 */
async function hanleRecall() {
  const result = await productNoticRecallApi({ id: listId.value });
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
      const result = await productNoticReverseApi({ id: listId.value });
      ElMessage.success(result.msg);
      getDetailData();
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击生成报告 */
async function handleReport() {
  startDownloadUrl(productNoticReportApi, { id: listId.value });
}

/** 点击保存
 * @param type 1保存 2提交
 */
async function handleSave(type = 1) {
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
    lineName,
    report_user_signature,
    reviewer_user_signature,
    ...rest
  } = baseForm.value;
  let file_list = fileTableRef.value!.getChangeFileData();

  let data = {
    ...rest,
    file_list: file_list.length > 0 ? file_list : undefined,
    report_user_signature: report_user_signature ? report_user_signature : undefined,

    batch_info: tableData.value.length > 0 ? formatSendBatchList() : undefined,
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
      ? await productNoticeEditApi({ ...data, id: listId.value })
      : await productNoticeAddApi(data);
    resultMsg = result.msg;
    if (type === 2) {
      /* 如果是提交,保存后用返回的id,调用提交接口 */
      let data = {
        id: result.data.id,
        report_user_signature: baseForm.value.report_user_signature,
      };
      const submitResult = await productNoticSubmitApi(data);
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
      path: "/quality/finished-product/notice",
    });
    tagsViewStore.delView(currentTag);
  });
}

const signDialogRef = ref();
/** 点击签字提交 */
async function handleSubmit() {
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
  if (!tableData.value.length) {
    return ElMessage.warning("请添加批次信息");
  }

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
      baseForm.value.report_user_signature = result;
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
  waitListVisible.value = true;
}

/** 检验信息点击删除 */
function tableDel() {
  batchNoList.value.forEach((item) => {
    delete groupsData.value[item];
  });
  tableData.value = tableData.value.filter((item) => {
    return !batchNoList.value.includes(item.batch_no);
  });
}

async function getDetailData() {
  detailLoading.value = true;
  const result = await getProductNoticeDetailApi({ id: listId.value });
  const res = result.data;
  assoc_type.value = res.assoc_type;
  fileData.value = res.file_list;
  logList.value = res.act_log;

  baseForm.value.check_time = res.check_time; //时间
  baseForm.value.check_date = res.check_date; //日期
  baseForm.value.report_uid = res.report_uid || undefined; //报告人id

  baseForm.value.order_no = res.order_no; //单据编号-保存剔除
  baseForm.value.order_status = getStatusText(res.status); //单据状态文本-保存剔除
  status.value = res.status;
  baseForm.value.ct_name = res.ct_name; //单据状态-保存剔除
  baseForm.value.create_time = res.create_time; //单据状态-保存剔除
  baseForm.value.note = res.note;

  groupsData.value = changeDetailData(res.batch_info);
  tableData.value = formatTable(groupsData.value);
  if (pageType.value === 3) {
    baseForm.value.report_user_signature = res.report_user_signature ?? "";
    baseForm.value.reviewer_user_signature = res.reviewer_user_signature ?? "";
  }
  detailLoading.value = false;
}
function changeDetailData(check_info: any[]) {
  let groupedObj: GroupedPacks = {};
  check_info.forEach((item) => {
    let arr = item.batch_detail.map((subItem: any) => {
      return {
        batch_no: subItem.batch_no, //批次
        batch_number: subItem.batch_number, //批号
        line: subItem.line,
        line_id: subItem.line_id,
        product_detail_id: subItem.product_detail_id, //微生物检验记录明细id
        product_order_id: subItem.product_order_id, //微生物检验单id
        sku: subItem.sku,
        check_res: subItem.check_res,
        type: subItem.type,
        batch_info_id: subItem.batch_info_id, //该batch_info_id对应为父级的id
        id: subItem.id, //记录id
        unique_id: subItem.unique_id,
      };
    });

    groupedObj[item.batch_no] = arr;
  });
  return groupedObj;
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
  getSkuMap();
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
  <div class="app-container !pt-0" v-loading="detailLoading">
    <AffixButton
      :page-type="pageType"
      :status="status"
      :assoc-type="assoc_type"
      :order-type="20"
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
              <ul class="flex items-center justify-between mb-2" v-if="!isDetailDisable">
                <li>
                  <el-button type="primary" @click="tableAdd">新增</el-button>
                  <el-button @click="tableDel">删除</el-button>
                </li>
              </ul>
              <PureTable
                ref="prueTableRef"
                row-key="id"
                border
                :columns="tableColumns"
                :data="tableData"
                height="800"
                @selection-change="changeSelect"
                @cell-mouse-enter="cellMouseEnter"
                @cell-mouse-leave="cellMouseLeave"
                @cell-click="cellClick"
              >
                <template #joint_batch_number="{ row }">
                  <span class="text-blue-500">{{ row.joint_batch_number }}</span>
                </template>
              </PureTable>
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
    <waitListVue
      v-model="waitListVisible"
      :ids="batchIds"
      :check_date="baseForm.check_date"
      :list="skuList"
      @change="waitListChange"
    ></waitListVue>
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
