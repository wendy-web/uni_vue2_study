<script setup lang="ts">
/** 新增纸皮进货检验报告页面 */
import type { CollapseModelValue, FormInstance, TabPaneName } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import { useRoute, useRouter } from "vue-router";
import {
  getLeatheroidDetailApi,
  leatheroidAddApi,
  leatheroidApproveApi,
  leatheroidDelApi,
  leatheroidEditApi,
  leatheroidRecallApi,
  leatheroidRejectApi,
  leatheroidReportApi,
  leatheroidReverseApi,
  leatheroidSubmitApi,
} from "@/api/quality/material-inspection/leatheroid/index";
import type { TableDataType } from "@/api/quality/material-inspection/leatheroid/types";
import CommonSelect from "@/components/DeptSelect/CommonSelect.vue";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCommonHooks } from "@/hooks/quality/index";
import { useTagsViewStore } from "@/store/modules/tagsView";
import FileTable from "@/views/quality/components/FileTable/index.vue";
import OrderLog from "@/views/quality/components/OrderLog/index.vue";
import RecheckSign from "@/views/quality/components/RecheckSign/index.vue";
import AffixButton from "@/views/quality/components/affixButton.vue";
import MeasuredValue from "./components/measuredValue.vue";
import NoteTable from "./components/noteTable.vue";
import { useAdd } from "./utils/add";
import type { PaperSizeListType, SizeColumnType } from "./utils/add";

defineOptions({
  name: "MaterialInspectionLeatheroidAdd",
});

enum ETitle {
  "新建纸皮进货检验报告" = 1,
  "编辑纸皮进货检验报告",
  "纸皮进货检验报告详情",
}

const { validatorCell, startDownloadUrl } = useCommonHooks();
const tagsViewStore = useTagsViewStore();
const router = useRouter();
const route = useRoute();

const {
  baseForm,
  baseColumns,
  tableColumns,
  tableForm,
  tableData,
  passList,
  getSummaries,
  prueTableRef,
  logList,
  fileData,
  baseRules,
  singImgUrl,
  paperSizeList,
  check_view,
  getSettingConfig,
  pageType,
  getStatusText,
  checkSignatureImgUrl,
  reviewSignatureImgUrl,
  tableRules,
  is_submit,
  useSetting,
  isDetailDisable,
  weightConfig,
  barcodeLengthConfig,
  barcodewidthConfig,
  getSkuMap,
  checkSizeValue,
  tableCheckObj,
  getImgConfig
} = useAdd();

/** 实际值弹窗组件的ref */
const MeasuredValueRef = ref();

/** 用于记录编辑时,从列表传过来的id */
const listId = ref(0);
/** 用于记录单据状态 */
const status = ref();

const headerTitle = computed(() => {
  return ETitle[pageType.value];
});

const noteTableRef = ref<InstanceType<typeof NoteTable>>();

/** 附件自定义组件的ref */
const fileTableRef = ref<InstanceType<typeof FileTable>>();
/** 签字复核组件的ref */
const recheckSignRef = ref<InstanceType<typeof RecheckSign>>();
const recheckSignVisible = ref(false);

/** 身份标识数组--重要! */
const assoc_type = ref<number[]>([]);

/** 折叠面板的数组 */
const activeNames = ref(["1", "2"]);
// const activeNames = ref(["2"]);
const PlusFormRef = ref();
/** 基础表单的ref */
const baseFormRef = computed(() => {
  return PlusFormRef.value.formInstance as FormInstance;
});
/** 表格表单的ref */
const tableFormRef = ref<FormInstance>();

/** 勾选的id数组 */
const ids = ref<unknown[]>([]);
/** 获取详情数据时的加载状态 */
const detailLoading = ref(false);

const tableLen = computed(() => {
  return tableData.value.length;
});

/** 总样品数 */
const totalNum = computed(() => {
  return tableData.value.length;
});

const abnormalNum = computed(() => {
  let sum = 0;
  // 尺寸是否符合标准列表
  let sizeResList = tableData.value.map((item) => item.custom_size_res).flat();
  // 尺寸是否符合标准列表中为false的总数
  let sizeResSum = sizeResList.filter((item) => !item).length;
  // console.log("🚀 ~ abnormalNum ~ sizeResSum:", sizeResSum);

  // 选择框数据列表
  let noPassList = tableData.value
    .map((item) => {
      return [
        item.color_res,
        item.red_bull_res,
        item.warhorse_res,
        item.printing_quality_res,
        item.opening_crack_res,
        item.barcode_res,
        item.laser_code_res,
        item.laser_qr_code_res,
        item.position_res,
        item.scan_reading_res,
      ];
    })
    .flat();
  // 选择框数据列表中为0的总数
  let noPassSum = noPassList.filter((item) => !item).length;

  let weightResList = tableData.value.map((item) => {
    return validatorCell(weightConfig.value, item.weight_res);
  });

  let weightResSum = weightResList.filter((item) => item === false).length;

  if (baseForm.value.class !== 1) {
    return sum + sizeResSum + noPassSum + weightResSum;
  }

  let barcodeLengthResList = tableData.value.map((item) => {
    return validatorCell(barcodeLengthConfig.value, item.barcode_length);
  });

  let barcodeLengthResSum = barcodeLengthResList.filter((item) => item === false).length;

  let barcodeWidthResList = tableData.value.map((item) => {
    return validatorCell(barcodewidthConfig.value, item.barcode_width);
  });

  let barcodeWidthResSum = barcodeWidthResList.filter((item) => item === false).length;

  return sum + sizeResSum + noPassSum + weightResSum + barcodeLengthResSum + barcodeWidthResSum;
});

const handleChange = (val: CollapseModelValue) => {
  // console.log(val);
};

/** 表格点击新增 */
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
    custom_size_res: [],
  });
  // console.log("tableData.value", tableData.value);
}
/** 表格勾选触发事件 */
function changeSelect(selection: any[]) {
  ids.value = selection.map((item) => {
    return item.id || item.addId;
  });
}

/** 表格点击删除 */
function tableDel() {
  tableData.value = tableData.value.filter((item) => {
    return !ids.value.includes(item.id);
  });
}

/** 点击删除 */
function handleDel() {
  ElMessageBox.confirm(`确认要删除该单据吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定删除");
      const result = await leatheroidDelApi({ id: listId.value });
      ElMessage.success(result.msg);
      closeCurrentPage(result.msg);
    })
    .catch((error) => {});
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
      path: "/quality/material-inspection/leatheroid",
    });
    tagsViewStore.delView(currentTag);
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
    fileValues.status == 3 ? await leatheroidRejectApi(data) : await leatheroidApproveApi(data);
  closeCurrentPage(result.msg);
};

/** 点击撤回 */
async function hanleRecall() {
  const result = await leatheroidRecallApi({ id: listId.value });
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
      const result = await leatheroidReverseApi({ id: listId.value });
      ElMessage.success(result.msg);
      getDetailData();
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击生成报告 */
function handleReport() {
  startDownloadUrl(leatheroidReportApi, { id: listId.value });
}

const currentIndex = ref(-1);
const sampleNumber = computed(() => {
  return currentIndex.value + 1;
});
const childList = ref<PaperSizeListType[]>([]);

/** 单元格点击实测值 */
function cellMeasuredValue(row: any, index: number) {
  childList.value = getChildlist(row);
  currentIndex.value = index;
  let unit = childList.value[0]?.unit || "mm";

  const descriptionsData = {
    order_num: baseForm.value.system_serial_number,
    unit,
    img: singImgUrl.value,
  };

  addDialog({
    width: "60%",
    btnClass: "w-[80px]",
    draggable: true,
    closeOnClickModal: false,
    btnLoading: false,
    title: "尺寸实测值录入",
    contentRenderer: () =>
      h(MeasuredValue, {
        ref: MeasuredValueRef,
        descriptionsData,
        paperSizeList: childList.value,
        sample_number: sampleNumber.value,
        tableLen: tableLen.value,
        tableIndex: currentIndex.value,
        disabled: isDetailDisable.value,
        onTriggerNext: () => {
          /* 点击下一个触发事件 */
          // 记录当前索引的row数据
          let currentRow = tableData.value[currentIndex.value];
          setTableSize(currentRow);
          // 记录完成之后currentIndex+1
          currentIndex.value = currentIndex.value + 1;
          let nextRow = tableData.value[currentIndex.value];
          childList.value = getChildlist(nextRow);
          // console.log("🚀 ~ cellMeasuredValue ~ childList.value:", childList.value);
        },
        onTriggerPrev: () => {
          /* 点击上一个触发事件 */
          // 记录当前索引的row数据
          let currentRow = tableData.value[currentIndex.value];
          setTableSize(currentRow);
          currentIndex.value = currentIndex.value - 1;
          let prevRow = tableData.value[currentIndex.value];
          childList.value = getChildlist(prevRow);
        },
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      let currentRow = tableData.value[currentIndex.value];
      setTableSize(currentRow);
      done();
    },
  });
}
/** 设置弹窗的表格数据 */
function getChildlist(row: TableDataType) {
  return paperSizeList.value.map((item, i) => {
    let fieldName = `paper_size_v${i + 1}`;
    return {
      ...item,
      measuredValue: row[fieldName as keyof SizeColumnType] ?? "",
    };
  });
}
/** 将弹窗的表格数据保存到尺寸列表中 */
function setTableSize(row: TableDataType) {
  row.custom_size_res = [];
  row.custom_size_res = MeasuredValueRef.value.tableData.map(
    (item: PaperSizeListType, i: number) => {
      console.log("item.measuredValu", item.measuredValue);
      let fieldName = `paper_size_v${i + 1}`;
      // row[fieldName as keyof SizeColumnType] =
      //   typeof item.measuredValue === "string" ? item.measuredValue.trim() : item.measuredValue;
      row[fieldName as keyof SizeColumnType] = item.measuredValue;
      return checkSizePass(item);
    },
  );
}
// 检测尺寸输入的值 是否符合标准
function checkSizePass(item: PaperSizeListType) {
  if (typeof item.measuredValue === "string" && item.measuredValue === "") {
    // 如果实测是空字符串，表示还没录入值,直接返回-1
    return -1;
  }
  return validatorCell(item, item.measuredValue) ? 1 : 0;
}
function checkOrangeClass(row: TableDataType) {
  if (row.custom_size_res?.length) {
    let someRes = row.custom_size_res.some((item) => !item);
    return someRes ? "text-orange-500" : "text-blue-500";
  }
  return "text-blue-500";
}

/** 获取尺寸实测值录入的数量 */
function getSizeInputNum(row: any) {
  let num = 0;
  for (const key in row) {
    if (key.includes("paper_size") && row[key]) {
      num++;
    }
  }
  return num;
}

/** 点击取消 */
function handleCancel() {
  router.replace({
    path: "/quality/material-inspection/leatheroid",
  });
}

/** 点击保存
 * @param type 1保存 2提交
 */
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
  if (!baseForm.value.paper_id) {
    ElMessageBox.confirm(`该产品未设置配置图片,不可保存!`, "警告", {
      confirmButtonText: "我知道了",
      showCancelButton: false,
      type: "warning",
    }).then(() => {});
    return;
  }
  let {
    order_no,
    order_status,
    ct_name,
    create_time,
    singImg,
    check_user_signature,
    reviewer_user_signature,
    ...rest
  } = baseForm.value;
  let file_list = fileTableRef.value!.getChangeFileData();

  let noteTableData = noteTableRef.value?.getNoteValue();

  let data = {
    paper_img: singImg, //纸皮图片
    ...rest,
    file_list: file_list.length > 0 ? file_list : undefined, //附件列表
    check_user_signature: check_user_signature ? check_user_signature : undefined, //检验员签字图片
    check_info: getcheckInfo(), //检验信息
    check_view: check_view.value, //检验意见
    weight_res_note: noteTableData?.weight_res_note,
    color_res_note: noteTableData?.color_res_note,
    red_bull_res_note: noteTableData?.red_bull_res_note,
    warhorse_res_note: noteTableData?.warhorse_res_note,
    printing_quality_res_note: noteTableData?.printing_quality_res_note,
    opening_crack_res_note: noteTableData?.opening_crack_res_note,
    barcode_res_note: noteTableData?.barcode_res_note,
    laser_code_res_note: noteTableData?.laser_code_res_note,
    laser_qr_code_res_note: noteTableData?.laser_qr_code_res_note,
  };

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
      ? await leatheroidEditApi({ ...data, id: listId.value })
      : await leatheroidAddApi(data);
    resultMsg = result.msg;
    if (type === 2) {
      /* 如果是提交,保存后用返回的id,调用提交接口 */
      let data = {
        id: result.data.id,
        check_user_signature: baseForm.value.check_user_signature,
      };
      const submitResult = await leatheroidSubmitApi(data);
      resultMsg = submitResult.msg;
    }
    sendLoading.close();
    closeCurrentPage(result.msg);
  } catch (error) {
    sendLoading.close();
  }
}

function getcheckInfo() {
  // let arr = tableData.value.length > 0 ? tableData.value : undefined;
  if (!listId.value) {
    return tableData.value.length > 0
      ? tableData.value.map((item) => {
          let { id, custom_size_res, ...rest } = item;
          return {
            ...rest,
          };
        })
      : undefined;
  } else {
    return tableData.value.length > 0
      ? tableData.value.map((item) => {
          let { id, custom_size_res, ...rest } = item;
          return typeof id === "string" ? { ...rest } : item;
        })
      : undefined;
  }
}

const signDialogRef = ref();
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
  // console.log("🚀 ~ handleSave ~ vaildateRes:", vaildateRes);
  if (!vaildateRes) return;

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
      // console.log("result", result);
      baseForm.value.check_user_signature = result;
      updateDialog(false, "btnLoading");
      done();
      handleSave(2);
    },
  });
}

async function getDetailData() {
  detailLoading.value = true;
  const result = await getLeatheroidDetailApi({ id: listId.value });
  const res = result.data;
  assoc_type.value = res.assoc_type;
  fileData.value = res.file_list;
  logList.value = res.act_log;

  baseForm.value.note = res.note; //备注
  baseForm.value.supplier_id = res.supplier_id; //供应商
  baseForm.value.brand = res.brand; // 产品大类(产品品牌)
  getSkuMap(res.brand);
  baseForm.value.check_time = res.check_time; //检测日期
  baseForm.value.pro_time = res.pro_time; //生产日期
  baseForm.value.sku = res.sku; //产品类型
  baseForm.value.version_id = res.version_id; //版本id
  baseForm.value.class = res.class; //产品类别
  baseForm.value.num = res.num; //数量
  baseForm.value.system_serial_number = res.system_serial_number; //流水号
  baseForm.value.check_uid = res.check_uid; //检验员id
  baseForm.value.workshop = res.workshop; //车间
  baseForm.value.singImg = res.paper_img; //纸皮配置图片-保存剔除
  baseForm.value.paper_id = res.paper_id; //纸皮id
  baseForm.value.check_res = res.check_res; //纸皮id
  baseForm.value.order_no = res.order_no; //单据编号-保存剔除
  baseForm.value.order_status = getStatusText(res.status); //单据状态文本-保存剔除
  status.value = res.status;
  baseForm.value.ct_name = res.ct_name; //单据状态-保存剔除
  baseForm.value.create_time = res.create_time; //单据状态-保存剔除
  check_view.value = res.check_view;
  tableData.value = res.check_info;
  console.log("🚀 ~ getDetailData ~  tableData.value:", tableData.value);

  /* 给子组件赋值 备注信息 */
  noteTableRef.value!.weight_res_note = res.weight_res_note;
  noteTableRef.value!.color_res_note = res.color_res_note;
  noteTableRef.value!.red_bull_res_note = res.red_bull_res_note;
  noteTableRef.value!.warhorse_res_note = res.warhorse_res_note;
  noteTableRef.value!.printing_quality_res_note = res.printing_quality_res_note;
  noteTableRef.value!.opening_crack_res_note = res.opening_crack_res_note;
  noteTableRef.value!.barcode_res_note = res.barcode_res_note;
  noteTableRef.value!.laser_code_res_note = res.laser_code_res_note;
  noteTableRef.value!.laser_qr_code_res_note = res.laser_qr_code_res_note;
  detailLoading.value = false;
  if (pageType.value === 3) {
    baseForm.value.check_user_signature = res.check_user_signature ?? "";
    baseForm.value.reviewer_user_signature = res.reviewer_user_signature ?? "";
  }

  if (baseForm.value.sku) {
    await getSettingConfig();

    tableData.value = tableData.value.map((item) => {
      let measuredValueList = getMeasuredValueList(item);
      let custom_size_res = measuredValueList.map((el) => {
        return checkSizePass(el);
      });

      return {
        ...item,
        custom_size_res,
      };
    });
  }
}

/** 根据尺寸的标准值数据和tableData中的十个尺寸数据,返回带有十个尺寸和对应标准的数组 */
function getMeasuredValueList(tableDataItem: TableDataType) {
  return paperSizeList.value.map((el, i) => {
    let fieldName = `paper_size_v${i + 1}`;
    return {
      ...el,
      measuredValue: tableDataItem[fieldName as keyof SizeColumnType]?.toString() ?? "",
    };
  });
}

watch(
  () => tableCheckObj.value,
  () => {
    let checkedList = Object.values(tableCheckObj.value);

    let isUndetected = checkedList.some((item) => item === -1);
    if (isUndetected) {
      // 如果包含-1,表示有未检测的,直接赋值3 检验中
      baseForm.value.check_res = 3;
      return;
    }

    let someRes = checkedList.some((item) => item === 1);
    if (someRes) {
      baseForm.value.check_res = 2;
      let everyRes = checkedList.every((item) => item === 1);
      if (everyRes) {
        baseForm.value.check_res = 1;
      }
    } else {
      baseForm.value.check_res = 0;
    }
  },
  {
    deep: true,
  },
);

const initTagsView = () => {
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
// /** 监听表单的变化 */
const handleFormChange = (values: FieldValues, column: PlusColumn) => {
  let { prop } = column;
  let { version_id, sku } = values;
  // 根据产品类型、版本号 获取图片配置
  if (version_id && sku && ["version_id", "sku", "brand"].includes(prop)) {
    getImgConfig();
  }
};
</script>
<template>
  <div class="app-container" v-loading="detailLoading">
    <AffixButton
      :page-type="pageType"
      :status="status"
      :assoc-type="assoc_type"
      :order-type="7"
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
        <el-collapse v-model="activeNames" @change="handleChange">
          <!-- 基础信息 -->
          <el-collapse-item name="1">
            <template #title>
              <p class="font-bold text-[14px]">基础信息</p>
            </template>
            <div class="px-8">
              <PlusForm
                :disabled="isDetailDisable"
                ref="PlusFormRef"
                v-model="baseForm"
                labelWidth="100"
                labelPosition="right"
                :rules="baseRules"
                :columns="baseColumns"
                :row-props="{ gutter: 20 }"
                :col-props="{
                  span: 6,
                }"
                :hasFooter="false"
                @change="handleFormChange"
              >
                <!-- 纸皮图片 -->
                <template #plus-field-signImg>
                  <el-image
                    :src="singImgUrl"
                    class="w-[60px] h-[60px] rounded-[4px]"
                    :preview-src-list="[singImgUrl]"
                    v-if="baseForm.singImg"
                  ></el-image>
                  <span class="text-orange-500" v-else-if="typeof baseForm.singImg === 'undefined'">
                    该产品类型未设置图片,如已经配置请切换产品类型后查看是否显示
                  </span>
                  <span class="text-gray-500" v-else>请先选择产品类型</span>
                </template>
                <!-- 检验员签名图片 -->
                <template #plus-field-check_user_signature>
                  <el-image
                    :src="checkSignatureImgUrl"
                    class="w-[60px] h-[60px] rounded-[4px]"
                    :preview-src-list="[checkSignatureImgUrl]"
                    v-if="checkSignatureImgUrl"
                  ></el-image>
                </template>
                <!-- 复核员签名图片 -->
                <template #plus-field-reviewer_user_signature>
                  <el-image
                    :src="reviewSignatureImgUrl"
                    class="w-[60px] h-[60px] rounded-[4px]"
                    :preview-src-list="[reviewSignatureImgUrl]"
                    v-if="reviewSignatureImgUrl"
                  ></el-image>
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
              <ul class="flex items-center justify-between mb-2" v-if="!isDetailDisable">
                <li>
                  <el-button type="primary" @click="tableAdd">新增</el-button>
                  <el-button @click="tableDel">删除</el-button>
                </li>
                <li class="text-blue-500">
                  <span class="inline-block mr-4">总样品数:{{ totalNum }}</span>
                  <span>总异常数:{{ abnormalNum }}</span>
                </li>
              </ul>
              <el-form :model="tableForm" ref="tableFormRef" :rules="tableRules">
                <PureTable
                  ref="prueTableRef"
                  row-key="id"
                  border
                  :columns="tableColumns"
                  :data="tableData"
                  max-height="700"
                  @selection-change="changeSelect"
                  show-summary
                  :summary-method="getSummaries"
                >
                  <!-- 尺寸 -->
                  <template #custom_size="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.custom_size`"
                      :rules="[
                        {
                          required: is_submit,
                          validator: (rule, value, callback) => {
                            checkSizeValue(rule, value, callback, row);
                          },
                          trigger: 'blur',
                        },
                      ]"
                    >
                      <span
                        @click="cellMeasuredValue(row, $index)"
                        class="cursor-pointer"
                        :class="checkOrangeClass(row)"
                      >
                        实测值{{ getSizeInputNum(row) }}/10
                      </span>
                    </el-form-item>
                  </template>
                  <!-- 重量 -->
                  <template #weight_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.weight_res`"
                      :rules="tableRules.weight_res"
                    >
                      <el-input
                        v-model="row.weight_res"
                        placeholder="请输入内容"
                        v-inputnum.num_point="4"
                        :disabled="isDetailDisable"
                        :class="[
                          !validatorCell(weightConfig, row.weight_res) ? 'warning-text' : '',
                        ]"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- 色泽 -->
                  <template #color_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.color_res`"
                      :rules="tableRules.color_res"
                    >
                      <CommonSelect
                        v-model="row.color_res"
                        :list="passList"
                        :disabled="isDetailDisable"
                        :is-warning="row.color_res === 0"
                      ></CommonSelect>
                    </el-form-item>
                  </template>
                  <!-- 红牛标记 -->
                  <template #red_bull_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.red_bull_res`"
                      :rules="tableRules.red_bull_res"
                    >
                      <CommonSelect
                        v-model="row.red_bull_res"
                        :list="passList"
                        :disabled="isDetailDisable"
                        :is-warning="row.red_bull_res === 0"
                      ></CommonSelect>
                    </el-form-item>
                  </template>
                  <!-- 战马标记 -->
                  <template #warhorse_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.warhorse_res`"
                      :rules="tableRules.warhorse_res"
                    >
                      <CommonSelect
                        v-model="row.warhorse_res"
                        :list="passList"
                        :disabled="isDetailDisable"
                        :is-warning="row.warhorse_res === 0"
                      ></CommonSelect>
                    </el-form-item>
                  </template>
                  <!-- 印刷质量 -->
                  <template #printing_quality_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.printing_quality_res`"
                      :rules="tableRules.printing_quality_res"
                    >
                      <CommonSelect
                        v-model="row.printing_quality_res"
                        :list="passList"
                        :disabled="isDetailDisable"
                        :is-warning="row.printing_quality_res === 0"
                      ></CommonSelect>
                    </el-form-item>
                  </template>
                  <!-- 开合裂度 -->
                  <template #opening_crack_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.opening_crack_res`"
                      :rules="tableRules.opening_crack_res"
                    >
                      <CommonSelect
                        v-model="row.opening_crack_res"
                        :list="passList"
                        :disabled="isDetailDisable"
                        :is-warning="row.opening_crack_res === 0"
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
                        :is-warning="row.barcode_res === 0"
                      ></CommonSelect>
                    </el-form-item>
                  </template>
                  <!-- 激光码 -->
                  <template #laser_code_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.laser_code_res`"
                      :rules="tableRules.laser_code_res"
                    >
                      <CommonSelect
                        v-model="row.laser_code_res"
                        :list="passList"
                        :disabled="isDetailDisable"
                        :is-warning="row.laser_code_res === 0"
                      ></CommonSelect>
                    </el-form-item>
                  </template>
                  <!-- 激光码、二维码 -->
                  <template #laser_qr_code_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.laser_qr_code_res`"
                      :rules="tableRules.laser_qr_code_res"
                    >
                      <CommonSelect
                        v-model="row.laser_qr_code_res"
                        :list="passList"
                        :disabled="isDetailDisable"
                        :is-warning="row.laser_qr_code_res === 0"
                      ></CommonSelect>
                    </el-form-item>
                  </template>
                  <!-- 位置 -->
                  <template #position_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.position_res`"
                      :rules="tableRules.position_res"
                    >
                      <CommonSelect
                        v-model="row.position_res"
                        :list="passList"
                        :disabled="isDetailDisable"
                        :is-warning="row.position_res === 0"
                      ></CommonSelect>
                    </el-form-item>
                  </template>
                  <!-- 大小 -->
                  <template #barcode_length="{ row, $index }">
                    <div class="flex">
                      <el-form-item
                        :prop="`tableData.${$index}.barcode_length`"
                        :rules="tableRules.barcode_length"
                      >
                        <el-input
                          v-model="row.barcode_length"
                          placeholder="长度"
                          v-inputnum.num_point="4"
                          :disabled="isDetailDisable"
                          :class="[
                            !validatorCell(barcodeLengthConfig, row.barcode_length)
                              ? 'warning-text'
                              : '',
                          ]"
                        ></el-input>
                      </el-form-item>
                      <span class="inline-block mx-2 pt-1">X</span>
                      <el-form-item
                        :prop="`tableData.${$index}.barcode_width`"
                        :rules="tableRules.barcode_width"
                      >
                        <el-input
                          v-model="row.barcode_width"
                          placeholder="宽度"
                          v-inputnum.num_point="4"
                          :disabled="isDetailDisable"
                          :class="[
                            !validatorCell(barcodewidthConfig, row.barcode_width)
                              ? 'warning-text'
                              : '',
                          ]"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </template>
                  <!-- 扫读 -->
                  <template #scan_reading_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.scan_reading_res`"
                      :rules="tableRules.scan_reading_res"
                    >
                      <CommonSelect
                        v-model="row.scan_reading_res"
                        :list="passList"
                        :disabled="isDetailDisable"
                        :is-warning="row.scan_reading_res === 0"
                      ></CommonSelect>
                    </el-form-item>
                  </template>
                </PureTable>
                <NoteTable
                  ref="noteTableRef"
                  :brand="baseForm.brand"
                  :classType="baseForm.class"
                  :disabled="isDetailDisable"
                ></NoteTable>
                <el-form-item label="检验意见" class="mt-4">
                  <el-input
                    v-model="check_view"
                    placeholder="请输入检验意见"
                    :disabled="isDetailDisable"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-item>
          <!-- 附件信息 -->
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
@import "@/styles/quality/add.scss";
@import "@/styles/warning-input.scss";
:deep(.el-table__footer-wrapper .el-table__footer) {
  height: 40px;
}
</style>
