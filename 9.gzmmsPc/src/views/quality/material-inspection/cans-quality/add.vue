<script setup lang="ts">
import type { CollapseModelValue, FormInstance, TabPaneName } from "element-plus";
import { buildUUID, isNullOrUnDef } from "@pureadmin/utils";
import { useRoute, useRouter } from "vue-router";
import {
  cansQualityAddApi,
  cansQualityApproveApi,
  cansQualityDelApi,
  cansQualityEditApi,
  cansQualityRecallApi,
  cansQualityRejectApi,
  cansQualityReportApi,
  cansQualityReverseApi,
  cansQualitySubmitApi,
  getCansQualityDetailApi,
} from "@/api/quality/material-inspection/cans-quality/index";
import { getBlueOrOrange } from "@/utils/index";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCommonHooks } from "@/hooks/quality";
import { useTagsViewStore } from "@/store/modules/tagsView";
import FileTable from "@/views/quality/components/FileTable/index.vue";
import OrderLog from "@/views/quality/components/OrderLog/index.vue";
import RecheckSign from "@/views/quality/components/RecheckSign/index.vue";
import AffixButton from "@/views/quality/components/affixButton.vue";
import CanBody from "./components/canBody.vue";
import InnerCoating from "./components/innerCoating.vue";
import InnerExperiment from "./components/innerExperiment.vue";
import { type TableDataType, useAdd } from "./utils/add";

const { validatorCell, startDownloadUrl } = useCommonHooks();

defineOptions({
  name: "MaterialInspectionCansQualityAdd",
});

enum ETitle {
  "新建空罐质量检验报告" = 1,
  "编辑空罐质量检验报告",
  "空罐质量检验报告详情",
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
  tableRules,
  is_submit,
  getStatusText,
  getSettingConfig,
  tank_height_config,
  flange_width_config,
  isDetailDisable,
  passList,
  checkInputNumValidator,
  otherForm,
  otherFormColumns,
  bottom_arch_config,
  rac_inner_config,
  tank_axial_confg,
  crs_strength_config,
  inner_coating_config,
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

/** 内涂膜实测值输入弹窗的ref */
const innerCoatingRef = ref<InstanceType<typeof InnerCoating>>();
/** 罐体高度实测值输入弹窗的ref */
const canBodyRef = ref<InstanceType<typeof CanBody>>();
const innerExperimentRef = ref<InstanceType<typeof InnerExperiment>>();

/** 用于记录编辑时,从列表传过来的id */
const listId = ref(0);
/** 用于记录单据状态 */
const status = ref();
/** 勾选的id数组 */
const ids = ref<unknown[]>([]);
/** 获取详情数据时的加载状态 */
const detailLoading = ref(false);

/** 折叠面板的数组 */
const activeNames = ref(["1", "2", "3"]);
const PlusFormRef = ref();
/** 基础表单的ref */
const baseFormRef = computed(() => {
  return PlusFormRef.value.formInstance as FormInstance;
});

/** 表格表单的ref */
const tableFormRef = ref<FormInstance>();

/** 检测内涂膜实测值 */
function checkInnerItem(row: TableDataType) {
  let check_inner_item_len = row.check_inner_item?.length;
  let check_inner_value_list = row.check_inner_item?.map(
    (item: { actual_value: string }) => item.actual_value,
  );

  let checkResult =
    check_inner_item_len === 0
      ? undefined
      : check_inner_value_list?.every((item: string) =>
          validatorCell(inner_coating_config.value, item),
        );

  return checkResult;
}

/** 检测罐体高度实测值 */
function checkTankHeight(row: TableDataType) {
  let tank_height_list = [row.tank_height1, row.tank_height2, row.tank_height3];

  // 判断是否有不是undefined或者null的元素 或者直接非空判断?????
  let isHaveValue = tank_height_list.some((item) => !isNullOrUnDef(item));

  let checkResult = !isHaveValue
    ? undefined
    : tank_height_list.every((item) => validatorCell(tank_height_config.value, item));

  return checkResult;
}

/** 检测翻遍宽度实测值 */
function checkFlangeWidth(row: TableDataType) {
  let flange_width_list = [row.flange_width1, row.flange_width2, row.flange_width3];

  // 判断是否有不是undefined或者null的元素, 或者直接非空判断?????
  let isHaveValue = flange_width_list.some((item) => !isNullOrUnDef(item));

  let checkResult = !isHaveValue
    ? undefined
    : flange_width_list.every((item) => validatorCell(flange_width_config.value, item));

  return checkResult;
}

/** 检测内涂膜实验结果 */
function checkInnerExperiment(row: TableDataType) {
  let innerExperimentList = [
    row.boiling_experiment_res,
    row.acid_boiling_experiment_res,
    row.adhesion_experiment_res,
    row.dyeing_experiment_res,
    row.resistance_outer_coating_res,
  ];

  // 判断是否有不是undefined或者null的元素,这个不能非空判断,不合格时为数字0
  let isHaveValue = innerExperimentList.some((item) => !isNullOrUnDef(item));

  let checkResult = !isHaveValue ? undefined : innerExperimentList.every((item) => item == 1);

  return checkResult;
}

/** 检测判断表格每一行的检验结果 */
function checkRowResult(row: TableDataType) {
  // console.log("🚀 ~ checkResult ~ row:", row);
  // 内涂膜的结果
  let check_inner_item_res = checkInnerItem(row);
  // console.log("🚀 ~ checkResult ~ check_inner_item_res:", check_inner_item_res);
  // 罐体高度的结果
  let tank_height_res = checkTankHeight(row);
  // console.log("🚀 ~ checkResult ~ tank_height_res:", tank_height_res)
  // 翻边宽度的结果
  let flange_width_res = checkFlangeWidth(row);
  // console.log("🚀 ~ checkResult ~ flange_width_res:", flange_width_res)
  // 内涂膜实验结果的结果
  let inner_experiment_res = checkInnerExperiment(row);
  // console.log("🚀 ~ checkResult ~ inner_experiment_res:", inner_experiment_res);

  // 底拱高度的结果
  let bottom_arch_height_Res =
    row.bottom_arch_height && validatorCell(bottom_arch_config.value, row.bottom_arch_height);

  // 缩颈内径的结果
  let rac_inner_config_res =
    row.rac_inner_diameter && validatorCell(rac_inner_config.value, row.rac_inner_diameter);

  // 罐体轴向称压力的结果
  let tank_axial_pressure_res =
    row.tank_axial_pressure && validatorCell(tank_axial_confg.value, row.tank_axial_pressure);

  // 罐底耐压强度的结果
  let crs_strength_bottom_res =
    row.crs_strength_bottom && validatorCell(crs_strength_config.value, row.crs_strength_bottom);

  let list = [
    bottom_arch_height_Res,
    rac_inner_config_res,
    tank_axial_pressure_res,
    crs_strength_bottom_res,
    check_inner_item_res,
    tank_height_res,
    flange_width_res,
    inner_experiment_res,
  ];

  // 判断是否有是undefined的元素, 如果有代表有未检测项目
  let isHaveUndefined = list.some((item) => item === undefined);
  if (isHaveUndefined) {
    row.check_ret = -1;
    return -1;
  } else {
    let rowRes = list.every((item) => item === true);
    row.check_ret = rowRes ? 1 : 0;
    return rowRes ? 1 : 0;
  }
}

watchEffect(() => {
  // 默认为3 检验中
  if (tableData.value.length === 0) {
    baseForm.value.check_res = 3;
    return;
  }
  let rowCheckRet = tableData.value.map((item) => item.check_ret);
  let isUndetected = rowCheckRet.some((item) => item === -1);
  if (isUndetected) {
    // 如果包含-1,表示有未检测的,直接赋值3 检验中
    baseForm.value.check_res = 3;
    return;
  }

  let someRes = tableData.value.some((item) => item.check_ret === 1);
  if (someRes) {
    // 如果存在,表示肯定有至少一项是合格的,设置为 部分合格,
    baseForm.value.check_res = 2;
    let everyRes = tableData.value.every((item) => item.check_ret === 1);
    if (everyRes) {
      // 如果 全部是合格,设置为合格
      baseForm.value.check_res = 1;
    }
  } else {
    // 如果不存在,表示没有合格的,设置为 不合格
    baseForm.value.check_res = 0;
  }
});

/** 表格勾选触发事件 */
function changeSelect(selection: any[]) {
  ids.value = selection.map((item) => {
    return item.id || item.addId;
  });
}

/** 点击返回 */
function handleCancel() {
  router.replace({
    path: "/quality/material-inspection/cans-quality",
  });
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
    ink_code_res: otherForm.value.ink_code_res,
  };
  let loadingText = type === 1 ? "正在保存中" : "正在提交中";
  let resultMsg = "";
  const sendLoading = ElLoading.service({
    lock: true,
    text: loadingText,
    background: "rgba(0, 0, 0, 0.7)",
  });
  console.log("🚀 ~ handleSave ~ data:", data);
  // return
  try {
    const result = listId.value
      ? await cansQualityEditApi({ ...data, id: listId.value })
      : await cansQualityAddApi(data);
    resultMsg = result.msg;
    if (type === 2) {
      /* 如果是提交,保存后用返回的id,调用提交接口 */
      let data = {
        id: result.data.id,
        check_user_signature: baseForm.value.check_user_signature,
      };
      const submitResult = await cansQualitySubmitApi(data);
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
      console.log("result", result);
      baseForm.value.check_user_signature = result;
      updateDialog(false, "btnLoading");
      done();
      handleSave(2);
    },
  });
}

/** 点击删除 */
function handleDel() {
  let { order_no } = baseForm.value;
  ElMessageBox.confirm(`确认要删除该单据吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定删除");
      const result = await cansQualityDelApi({ id: listId.value });
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
    fileValues.status == 3 ? await cansQualityRejectApi(data) : await cansQualityApproveApi(data);
  closeCurrentPage(result.msg);
};

/** 点击撤回 */
async function hanleRecall() {
  const result = await cansQualityRecallApi({ id: listId.value });
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
      const result = await cansQualityReverseApi({ id: listId.value });
      ElMessage.success(result.msg);
      getDetailData();
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击生成报告 */
function handleReport() {
  startDownloadUrl(cansQualityReportApi, { id: listId.value });
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
      path: "/quality/material-inspection/cans-quality",
    });
    tagsViewStore.delView(currentTag);
  });
}

/** 检验信息点击新增 */
async function tableAdd() {
  // const vaildateRes = await baseFormRef.value
  //   .validate((valid, fields) => {
  //     for (const keys in fields) {
  //       if (fields[keys]) {
  //         // 弹出每个字段的错误提示
  //         ElMessage.warning(fields[keys][0].message);
  //         baseFormRef.value.scrollToField(keys);
  //         break;
  //       }
  //     }
  //   })
  //   .catch((err) => {
  //     console.log("err", err);
  //   });
  // if (!vaildateRes) return;
  tableData.value.push({
    id: buildUUID(),
    check_inner_item: [],
  });
}

/** 检验信息点击删除 */
function tableDel() {
  tableData.value = tableData.value.filter((item) => {
    return !ids.value.includes(item.id);
  });
}

/** 单元格点击内涂膜实测值 */
function cellCheckInnerItem(row: any, index: number) {
  tableFormRef.value?.clearValidate(`tableData.${index}.check_inner_item`);
  const descriptionsData = {
    batch_no: baseForm.value.batch_no,
    group_no: index + 1,
    max_num: 8,
  };
  let unit = inner_coating_config.value?.unit || "";
  addDialog({
    width: "60%",
    btnClass: "w-[80px]",
    draggable: true,
    closeOnClickModal: false,
    btnLoading: false,
    title: "内涂膜实测值录入",
    contentRenderer: () =>
      h(InnerCoating, {
        ref: innerCoatingRef,
        descriptionsData,
        // config: inner_coating_config.value,
        standardText: inner_coating_config.value?.initval || "",
        list: row.check_inner_item,
        unit: unit,
        disabled: isDetailDisable.value,
      }),
    beforeCancel: (done, { options, index }) => {
      done();
    },
    beforeSure: async (done, { options, index }) => {
      const vailRes = await innerCoatingRef.value?.vailFormData();
      if (!vailRes) return;
      let list = innerCoatingRef.value?.tableData.map((item) => {
        return {
          pro_package_number: item.pro_package_number,
          actual_value: item.actual_value,
        };
      });
      console.log("🚀 ~ list ~ list:", list);
      row.check_inner_item = list;
      done();
    },
  });
}
/** 根据row.check_inner_item内涂膜信息数组的长度获取样品数和内涂膜总数量*/
function getTotalNum(row: any) {
  row.sample_num = row.check_inner_item.length;
  return row.check_inner_item.length;
}

/** 内涂膜根据值,判断录入了几条数据 */
function getinnerCoatingInputNum(row: any) {
  let arr = row.check_inner_item.filter((item: any) => item.actual_value);
  return arr.length;
}

/** 获取实测值录入的数量 */
function getActualInputNum(row: any, field: string) {
  let num = 0;
  for (const key in row) {
    if (key.includes(field) && row[key]) {
      num++;
    }
  }
  return num;
}

/** 单元格点击罐体高度/或者翻边宽度 */
function cellTankHeight(row: any, index: number, type = 1) {
  let field = type === 1 ? "tank_height" : "flange_width";
  tableFormRef.value?.clearValidate(`tableData.${index}.${field}`);
  // type === 1 表示为罐体高度, 否则为翻边宽度
  let unit =
    type === 1 ? tank_height_config.value?.unit || "" : flange_width_config.value?.unit || "";
  const descriptionsData = {
    batch_no: baseForm.value.batch_no,
    group_no: index + 1,
    unit: unit,
  };
  const list =
    type === 1
      ? [row.tank_height1, row.tank_height2, row.tank_height3]
      : [row.flange_width1, row.flange_width2, row.flange_width3];

  const standardText =
    type === 1 ? tank_height_config.value?.initval || "" : flange_width_config.value?.initval || "";

  addDialog({
    width: "60%",
    btnClass: "w-[80px]",
    draggable: true,
    closeOnClickModal: false,
    btnLoading: false,
    title: type === 1 ? "罐体高度实测值录入" : "翻边宽度实测值录入",
    contentRenderer: () =>
      h(CanBody, {
        ref: canBodyRef,
        descriptionsData,
        standardText: standardText,
        list: list,
        disabled: isDetailDisable.value,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      if (type === 1) {
        canBodyRef.value?.tableData.forEach((item, index) => {
          let field = "tank_height" + (index + 1);
          row[field] = item.actual_value;
        });
      } else {
        canBodyRef.value?.tableData.forEach((item, index) => {
          let field = "flange_width" + (index + 1);
          row[field] = item.actual_value;
        });
      }

      console.log("tableData", tableData.value);
      done();
    },
  });
}

/** 单元格点击内涂膜实验结果 */
function cellCustomExperiment(row: any, index: number) {
  tableFormRef.value?.clearValidate(`tableData.${index}.custom_experiment`);
  const descriptionsData = {
    batch_no: baseForm.value.batch_no,
    group_no: index + 1,
  };
  const experimentForm = {
    boiling_experiment_res: row.boiling_experiment_res,
    acid_boiling_experiment_res: row.acid_boiling_experiment_res,
    adhesion_experiment_res: row.adhesion_experiment_res,
    dyeing_experiment_res: row.dyeing_experiment_res,
    resistance_outer_coating_res: row.resistance_outer_coating_res,
  };
  addDialog({
    width: "60%",
    btnClass: "w-[80px]",
    draggable: true,
    closeOnClickModal: false,
    btnLoading: false,
    title: "内涂膜实验结果录入",
    contentRenderer: () =>
      h(InnerExperiment, {
        ref: innerExperimentRef,
        descriptionsData,
        experimentForm: experimentForm,
        disabled: isDetailDisable.value,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      let formData = innerExperimentRef.value?.formData || {};
      row.boiling_experiment_res = formData.boiling_experiment_res;
      row.acid_boiling_experiment_res = formData.acid_boiling_experiment_res;
      row.adhesion_experiment_res = formData.adhesion_experiment_res;
      row.dyeing_experiment_res = formData.dyeing_experiment_res;
      row.resistance_outer_coating_res = formData.resistance_outer_coating_res;

      console.log("tableData", tableData.value);
      done();
    },
  });
}

/** 获取内涂膜实验结果录入的数量 */
function getExperimentInputNum(row: any) {
  let arr = [
    row.boiling_experiment_res,
    row.acid_boiling_experiment_res,
    row.adhesion_experiment_res,
    row.dyeing_experiment_res,
    row.resistance_outer_coating_res,
  ].filter((item) => typeof item === "number");

  return arr.length;
}

async function getDetailData() {
  detailLoading.value = true;
  const result = await getCansQualityDetailApi({ id: listId.value });
  const res = result.data;
  assoc_type.value = res.assoc_type;
  fileData.value = res.file_list;
  logList.value = res.act_log;

  baseForm.value.empty_can_size_id = res.empty_can_size_id; //空罐尺寸id
  baseForm.value.batch_no = res.batch_no; //生产批号
  baseForm.value.check_time = res.check_time; //检测日期
  baseForm.value.version_id = res.version_id; //版本id
  baseForm.value.check_reagent_id = res.check_reagent_id; //检测试剂
  baseForm.value.sku = res.sku; //产品类型
  baseForm.value.check_res = res.check_res; //检验结果
  baseForm.value.check_uid = res.check_uid; //检验员id
  baseForm.value.note = res.note; //备注

  baseForm.value.order_no = res.order_no; //单据编号-保存剔除
  baseForm.value.order_status = getStatusText(res.status, res.assoc_type); //单据状态文本-保存剔除
  status.value = res.status;
  baseForm.value.ct_name = res.ct_name; //制单人-保存剔除
  baseForm.value.create_time = res.create_time; //创建时间-保存剔除

  otherForm.value.ink_code_res = res.ink_code_res;
  tableData.value = res.check_info;
  if (pageType.value === 3) {
    baseForm.value.check_user_signature = res.check_user_signature ?? "";
    baseForm.value.reviewer_user_signature = res.reviewer_user_signature ?? "";
  }

  detailLoading.value = false;
}

// function changeDetailData(check_info: any) {
//   let arr = check_info.map((item: any) => {
//     let { id, bottom_arch_height, rac_inner_diameter } = item;
//     return {};
//   });
// }

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
  getSettingConfig();
  if (listId.value) {
    getDetailData();
  }
});

const activeName = ref("first");

const handleClick = (name: TabPaneName) => {
  console.log("name", name);
  activeName.value = name as string;
};
</script>
<template>
  <div class="app-container" v-loading="detailLoading">
    <AffixButton
      :page-type="pageType"
      :status="status"
      :assoc-type="assoc_type"
      :order-type="8"
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
                :rules="baseRules"
                ref="PlusFormRef"
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
              <ul class="flex items-center justify-between mb-2" v-if="!isDetailDisable">
                <li>
                  <el-button type="primary" @click="tableAdd">新增</el-button>
                  <el-button @click="tableDel">删除</el-button>
                </li>
              </ul>
              <el-form :model="tableForm" ref="tableFormRef" :rules="tableRules">
                <PureTable
                  ref="prueTableRef"
                  row-key="id"
                  border
                  :columns="tableColumns"
                  :data="tableData"
                  max-height="800"
                  @selection-change="changeSelect"
                >
                  <!-- 内涂膜 -->
                  <template #check_inner_item="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.check_inner_item`"
                      :rules="{
                        validator: (rule, value, callback) => {
                          checkInputNumValidator(
                            rule,
                            value,
                            callback,
                            getinnerCoatingInputNum(row),
                            1,
                            '内涂膜',
                          );
                        },
                      }"
                    >
                      <span
                        @click="cellCheckInnerItem(row, $index)"
                        class="cursor-pointer"
                        :class="getBlueOrOrange(checkInnerItem(row))"
                      >
                        实测值{{ getinnerCoatingInputNum(row) }}/{{ getTotalNum(row) }}
                      </span>
                    </el-form-item>
                  </template>
                  <!-- 罐体高度 -->
                  <template #tank_height="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.tank_height`"
                      :rules="{
                        validator: (rule, value, callback) => {
                          checkInputNumValidator(
                            rule,
                            value,
                            callback,
                            getActualInputNum(row, 'tank_height'),
                            2,
                            '罐体高度',
                          );
                        },
                      }"
                    >
                      <span
                        @click="cellTankHeight(row, $index)"
                        class="cursor-pointer"
                        :class="getBlueOrOrange(checkTankHeight(row))"
                      >
                        实测值{{ getActualInputNum(row, "tank_height") }}/3
                      </span>
                    </el-form-item>
                  </template>
                  <!-- 翻边宽度 -->
                  <template #flange_width="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.flange_width`"
                      :rules="{
                        validator: (rule, value, callback) => {
                          checkInputNumValidator(
                            rule,
                            value,
                            callback,
                            getActualInputNum(row, 'flange_width'),
                            3,
                            '翻边宽度',
                          );
                        },
                      }"
                    >
                      <span
                        @click="cellTankHeight(row, $index, 2)"
                        class="cursor-pointer"
                        :class="getBlueOrOrange(checkFlangeWidth(row))"
                      >
                        实测值{{ getActualInputNum(row, "flange_width") }}/3
                      </span>
                    </el-form-item>
                  </template>
                  <!-- 底拱高度 -->
                  <template #bottom_arch_height="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.bottom_arch_height`"
                      :rules="tableRules.bottom_arch_height"
                    >
                      <el-input
                        v-model="row.bottom_arch_height"
                        placeholder=""
                        :disabled="isDetailDisable"
                        :class="[
                          !validatorCell(bottom_arch_config, row.bottom_arch_height)
                            ? 'warning-text'
                            : '',
                        ]"
                        v-inputnum.num_point="4"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- 缩颈内径 -->
                  <template #rac_inner_diameter="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.rac_inner_diameter`"
                      :rules="tableRules.rac_inner_diameter"
                    >
                      <el-input
                        v-model="row.rac_inner_diameter"
                        placeholder=""
                        :disabled="isDetailDisable"
                        :class="[
                          !validatorCell(rac_inner_config, row.rac_inner_diameter)
                            ? 'warning-text'
                            : '',
                        ]"
                        v-inputnum.num_point="4"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- 罐体轴向称压力 -->
                  <template #tank_axial_pressure="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.tank_axial_pressure`"
                      :rules="tableRules.tank_axial_pressure"
                    >
                      <el-input
                        v-model="row.tank_axial_pressure"
                        placeholder=""
                        :disabled="isDetailDisable"
                        :class="[
                          !validatorCell(tank_axial_confg, row.tank_axial_pressure)
                            ? 'warning-text'
                            : '',
                        ]"
                        v-inputnum.num_point="4"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- 罐底耐压强度 -->
                  <template #crs_strength_bottom="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.crs_strength_bottom`"
                      :rules="tableRules.crs_strength_bottom"
                    >
                      <el-input
                        v-model="row.crs_strength_bottom"
                        placeholder=""
                        :disabled="isDetailDisable"
                        :class="[
                          !validatorCell(crs_strength_config, row.crs_strength_bottom)
                            ? 'warning-text'
                            : '',
                        ]"
                        v-inputnum.num_point="4"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- 内涂膜实验结果 -->
                  <template #custom_experiment="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.custom_experiment`"
                      :rules="{
                        validator: (rule, value, callback) => {
                          checkInputNumValidator(
                            rule,
                            value,
                            callback,
                            getExperimentInputNum(row),
                            4,
                            '内涂膜实验结果',
                          );
                        },
                      }"
                    >
                      <span
                        @click="cellCustomExperiment(row, $index)"
                        class="cursor-pointer"
                        :class="getBlueOrOrange(checkInnerExperiment(row))"
                      >
                        实测值{{ getExperimentInputNum(row) }}/5
                      </span>
                    </el-form-item>
                  </template>
                  <!-- 样品时间 -->
                  <template #sample_time="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.sample_time`"
                      :rules="tableRules.sample_time"
                    >
                      <el-date-picker
                        :disabled="isDetailDisable"
                        style="width: 100%"
                        v-model="row.sample_time"
                        type="date"
                        placeholder="请选择"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                      />
                    </el-form-item>
                  </template>
                  <!-- 检验结果 -->
                  <template #check_ret="{ row, $index }">
                    <span v-if="checkRowResult(row) == 1">合格</span>
                    <span v-else-if="checkRowResult(row) == 0" class="text-orange-500">不合格</span>
                    <span v-else>--</span>
                  </template>
                </PureTable>
              </el-form>
            </div>
          </el-collapse-item>
          <el-collapse-item name="3" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">其他检验</p>
            </template>
            <div class="px-8">
              <PlusForm
                :disabled="isDetailDisable"
                v-model="otherForm"
                labelWidth="90"
                :columns="otherFormColumns"
                :row-props="{ gutter: 20 }"
                :col-props="{
                  span: 6,
                }"
                :hasFooter="false"
              ></PlusForm>
            </div>
          </el-collapse-item>

          <!-- 附件信息 -->
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
:deep(.el-table__body .el-table__cell .el-form-item .el-form-item__content) {
  padding-bottom: 20px;
}
:deep(.el-table__body .el-table__cell .el-form-item .el-form-item__content .el-form-item__error) {
  top: 64%;
}
</style>
