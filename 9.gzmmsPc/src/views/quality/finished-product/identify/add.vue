<script setup lang="ts">
/* 新建成品标签标识报告 */
import type { CollapseModelValue, FormInstance, TabPaneName } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import { useRoute, useRouter } from "vue-router";
import {
  getIdentifyDetailApi,
  identifyAddApi,
  identifyApproveApi,
  identifyDelApi,
  identifyEditApi,
  identifyRecallApi,
  identifyRejectApi,
  identifyReportApi,
  identifyReverseApi,
  identifySubmitApi,
} from "@/api/quality/finished-product/identify";
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
  name: "FinishedProductIdentifyAdd",
});

enum ETitle {
  "新增成品标签标识报告" = 1,
  "编辑成品标签标识报告",
  "成品标签标识报告详情",
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
  getVersionList,
  tableRules,
  multipleImgUrl,
  is_submit,
  getStatusText,
  useSetting,
  isDetailDisable,
  totalNum,
  abnormalNum,
  getImgConfig,
  getSkuMap
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

const isSetImg = computed(() => {
  let { top_cover_img, can_body_img, bottom_cover_img } = baseForm.value;
  if (
    typeof top_cover_img === "undefined" &&
    typeof can_body_img === "undefined" &&
    typeof bottom_cover_img === "undefined"
  ) {
    return true;
  } else {
    return false;
  }
});

/** 用于记录编辑时,从列表传过来的id */
const listId = ref(0);
/** 用于记录单据状态 */
const status = ref();
/** 勾选的id数组 */
const ids = ref<unknown[]>([]);
/** 获取详情数据时的加载状态 */
const detailLoading = ref(false);

/** 用于记录版本下拉数据 */
const versionList = ref<SelectOpitonType[]>([]);

/** 表格勾选触发事件 */
function changeSelect(selection: any[]) {
  ids.value = selection.map((item) => {
    return item.id || item.addId;
  });
}

/** 点击返回 */
function handleCancel() {
  router.replace({
    path: "/quality/finished-product/identify",
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
      const result = await identifyDelApi({ id: listId.value });
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
    fileValues.status == 3 ? await identifyRejectApi(data) : await identifyApproveApi(data);
  closeCurrentPage(result.msg);
};

/** 点击撤回 */
async function hanleRecall() {
  const result = await identifyRecallApi({ id: listId.value });
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
      const result = await identifyReverseApi({ id: listId.value });
      ElMessage.success(result.msg);
      getDetailData();
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击生成报告 */
async function handleReport() {
  startDownloadUrl(identifyReportApi, { id: listId.value });
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
  if (!baseForm.value.paper_id) {
    ElMessageBox.confirm(`该产品未设置配置图片,不可保存!`, "警告", {
      confirmButtonText: "我知道了",
      showCancelButton: false,
      type: "warning",
    }).then(() => {});
    return;
  }
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
      ? await identifyEditApi({ ...data, id: listId.value })
      : await identifyAddApi(data);
    resultMsg = result.msg;
    if (type === 2) {
      /* 如果是提交,保存后用返回的id,调用提交接口 */
      let data = {
        id: result.data.id,
        check_user_signature: baseForm.value.check_user_signature,
      };
      const submitResult = await identifySubmitApi(data);
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
          let { id, ...rest } = item;
          return {
            ...rest,
          };
        })
      : undefined;
  } else {
    return tableData.value.length > 0
      ? tableData.value.map((item) => {
          let { id, ...rest } = item;
          return typeof id === "string" ? { ...rest } : item;
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
      path: "/quality/finished-product/identify",
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

/** 检验信息表格点击删除 */
function tableDel() {
  tableData.value = tableData.value.filter((item) => {
    return !ids.value.includes(item.id);
  });
}

async function getDetailData() {
  detailLoading.value = true;
  const result = await getIdentifyDetailApi({ id: listId.value });
  const res = result.data;
  assoc_type.value = res.assoc_type;
  fileData.value = res.file_list;
  logList.value = res.act_log;

  baseForm.value.note = res.note; //备注
  baseForm.value.supplier_id = res.supplier_id; //供应商
  baseForm.value.pro_date = res.pro_date; //生产日期
  baseForm.value.check_date = res.check_date; //检测日期
  baseForm.value.brand = res.brand; //产品大类
  baseForm.value.sku = res.sku; //产品类型
 
  baseForm.value.batch_no = res.batch_no; //批次
  baseForm.value.check_res = res.check_res; //检验结果
  baseForm.value.check_uid = res.check_uid; //检验员id
  baseForm.value.paper_id = res.paper_id; //图片id
  baseForm.value.top_cover_img = res.top_cover_img; //顶盖图片地址
  baseForm.value.can_body_img = res.can_body_img; //罐身图片地址
  baseForm.value.bottom_cover_img = res.bottom_cover_img; //底盖图片地址
  baseForm.value.order_no = res.order_no; //单据编号-保存剔除
  baseForm.value.order_status = getStatusText(res.status); //单据状态文本-保存剔除
  status.value = res.status;
  baseForm.value.ct_name = res.ct_name; //单据状态-保存剔除
  baseForm.value.create_time = res.create_time; //单据状态-保存剔除
  baseForm.value.version_id = res.version_id; // 版本id
  tableData.value = res.check_info;
  if (pageType.value === 3) {
    baseForm.value.check_user_signature = res.check_user_signature ?? "";
    baseForm.value.reviewer_user_signature = res.reviewer_user_signature ?? "";
  }
   // 有sku更新
   await getSkuMap(res.brand);
  detailLoading.value = false;
}
// /** 监听表单的变化 */
const handleFormChange = (values: FieldValues, column: PlusColumn) => {
  let { prop } = column;
  let { version_id, sku } = values;
  // 根据产品类型、版本号 获取图片配置
  if (version_id && sku &&["version_id", "sku", "brand"].includes(prop)) {
    getImgConfig();
  }
};
const initTagsView = () => {
  // id存在表示是编辑
  const title = headerTitle.value;
  const new_route = Object.assign({}, route, {
    title,
  });
  tagsViewStore.updateVisitedView(new_route);
};

async function getVersionData() {
  versionList.value = await getVersionList();
}

onActivated(() => {
  listId.value = Number(route.query.id) || 0;
  pageType.value = Number(route.query.pageType) || 1;
  initTagsView();
  getVersionData();
  if (listId.value) {
    getDetailData();
  }
});

const activeName = ref("first");

const handleClick = (name: TabPaneName) => {
  activeName.value = name as string;
};

watchEffect(() => {
  let isHaveUndefined = tableData.value.length
    ? tableData.value.some((item) => item.check_res === undefined)
    : true;
  if (isHaveUndefined) {
    baseForm.value.check_res = undefined;
    return;
  }

  let someRes = tableData.value.some((item) => item.check_res === 1);
  if (someRes) {
    baseForm.value.check_res = 2;
    let everyRes = tableData.value.every((item) => item.check_res === 1);
    if (everyRes) {
      baseForm.value.check_res = 1;
    }
  } else {
    baseForm.value.check_res = 0;
  }
});
</script>
<template>
  <div class="app-container pt-40" v-loading="detailLoading">
    <AffixButton
      :page-type="pageType"
      :status="status"
      :assoc-type="assoc_type"
      :order-type="15"
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
                :columns="baseColumns"
                :row-props="{ gutter: 20 }"
                :col-props="{
                  span: 6,
                }"
                :hasFooter="false"
                @change="handleFormChange"
              >
                <!-- 标签标识图片 -->
                <template #plus-field-paper_id>
                  <div v-if="baseForm.paper_id">
                    <el-image
                      :src="item"
                      class="w-[60px] h-[60px] rounded-[4px] mr-2"
                      :preview-src-list="multipleImgUrl"
                      :initial-index="index"
                      v-for="(item, index) in multipleImgUrl"
                    ></el-image>
                  </div>
                  <span class="text-orange-500" v-else-if="isSetImg">
                    该产品类型未设置图片,如已经配置请切换产品类型后查看是否显示
                  </span>
                  <span class="text-gray-500" v-else>请先选择产品类型</span>
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
                  <!-- 检验时间 -->
                  <template #batch_number="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.batch_number`"
                      :rules="tableRules.batch_number"
                    >
                      <el-input v-model="row.batch_number" placeholder="" maxlength="5"></el-input>
                    </el-form-item>
                  </template>
                  <!-- 颜色 -->
                  <template #color_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.color_res`"
                      :rules="tableRules.color_res"
                    >
                      <CommonSelect
                        v-model="row.color_res"
                        :list="passList"
                        :disabled="isDetailDisable"
                        :isWarning="row.color_res === 0"
                      ></CommonSelect>
                    </el-form-item>
                  </template>
                  <!-- 注册商标 -->
                  <template #registered_trademark_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.registered_trademark_res`"
                      :rules="tableRules.registered_trademark_res"
                    >
                      <CommonSelect
                        v-model="row.registered_trademark_res"
                        :list="passList"
                        :disabled="isDetailDisable"
                        :isWarning="row.registered_trademark_res === 0"
                      ></CommonSelect>
                    </el-form-item>
                  </template>
                  <!-- 版面结构 -->
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
                      ></CommonSelect>
                    </el-form-item>
                  </template>
                  <!-- 保健食品标识 -->
                  <template #health_food_labeling_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.health_food_labeling_res`"
                      :rules="tableRules.health_food_labeling_res"
                    >
                      <CommonSelect
                        v-model="row.health_food_labeling_res"
                        :list="passList"
                        :disabled="isDetailDisable"
                        :isWarning="row.health_food_labeling_res === 0"
                      ></CommonSelect>
                    </el-form-item>
                  </template>
                  <!-- 强制标识内容 -->
                  <template #mandatory_identify_content_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.mandatory_identify_content_res`"
                      :rules="tableRules.mandatory_identify_content_res"
                    >
                      <CommonSelect
                        v-model="row.mandatory_identify_content_res"
                        :list="passList"
                        :disabled="isDetailDisable"
                        :isWarning="row.mandatory_identify_content_res === 0"
                      ></CommonSelect>
                    </el-form-item>
                  </template>
                  <!-- 条形码 -->
                  <template #barcode_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.barcode_res`"
                      :rules="tableRules.barcode_res"
                    >
                      <CommonSelect
                        v-model="row.barcode_res"
                        :list="passList"
                        :disabled="isDetailDisable"
                        :isWarning="row.barcode_res === 0"
                      ></CommonSelect>
                    </el-form-item>
                  </template>
                  <!-- 版本号 -->
                  <template #version_id="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.version_id`"
                      :rules="tableRules.version_id"
                    >
                      <CommonSelect
                        v-model="row.version_id"
                        :list="versionList"
                        :disabled="isDetailDisable"
                      ></CommonSelect>
                    </el-form-item>
                  </template>
                  <!-- 二维码 -->
                  <template #qr_code_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.qr_code_res`"
                      :rules="tableRules.qr_code_res"
                    >
                      <CommonSelect
                        v-model="row.qr_code_res"
                        :list="passList"
                        :disabled="isDetailDisable"
                        :isWarning="row.qr_code_res === 0"
                      ></CommonSelect>
                    </el-form-item>
                  </template>
                  <!-- 检验结果 -->
                  <template #check_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.check_res`"
                      :rules="tableRules.check_res"
                    >
                      <CommonSelect
                        v-model="row.check_res"
                        :list="passList"
                        :disabled="isDetailDisable"
                      ></CommonSelect>
                    </el-form-item>
                  </template>
                  <!-- 备注 -->
                  <template #note="{ row, $index }">
                    <el-form-item>
                      <el-input v-model="row.note"></el-input>
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
