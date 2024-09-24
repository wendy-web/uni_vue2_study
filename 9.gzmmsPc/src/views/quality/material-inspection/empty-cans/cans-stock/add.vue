<script setup lang="ts">
import type { CollapseModelValue, FormInstance, TabPaneName } from "element-plus";
import { isNullOrUnDef } from "@pureadmin/utils";
import { isRef } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { InnerCoatingListType } from "@/api/quality/common/types";
import {
  cansStockAddApi,
  cansStockApproveApi,
  cansStockDelApi,
  cansStockDelSelectApi,
  cansStockEditApi,
  cansStockRecallApi,
  cansStockRejectApi,
  cansStockReportApi,
  cansStockReverseApi,
  cansStockSubmitApi,
  getCansStockDetailApi,
} from "@/api/quality/material-inspection/cans-stock/index";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCommonHooks } from "@/hooks/quality";
import { useTagsViewStore } from "@/store/modules/tagsView";
import FileTable from "@/views/quality/components/FileTable/index.vue";
import OrderLog from "@/views/quality/components/OrderLog/index.vue";
import RecheckSign from "@/views/quality/components/RecheckSign/index.vue";
import AffixButton from "@/views/quality/components/affixButton.vue";
import BatchDetail from "./components/batchDetail.vue";
import WaitList from "./components/waitList.vue";
import { useAdd } from "./utils/add";
import type { ContinuityResult, GroupedList, GroupedPacks } from "./utils/add";

const { startDownloadUrl } = useCommonHooks();

defineOptions({
  name: "MaterialInspectionCansStockAdd",
});

enum ETitle {
  "新建空罐进货检验报告" = 1,
  "编辑空罐进货检验报告",
  "空罐进货检验报告详情",
}

const tagsViewStore = useTagsViewStore();
const router = useRouter();
const route = useRoute();

const {
  baseForm,
  baseColumns,
  tableColumns,
  tableForm,
  tableData,
  logList,
  fileData,
  checkForm,
  checkColumns,
  baseRules,
  pageType,
  getStatusText,
  is_submit,
  checkRules,
  useSetting,
  isDetailDisable,
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
const activeNames = ref(["1", "2", "3"]);
const PlusFormRef = ref();
const PluscheckFormRef = ref();
/** 基础表单的ref */
const baseFormRef = computed(() => {
  return PlusFormRef.value.formInstance as FormInstance;
});
/** 检验信息表单的ref */
const checkFormRef = computed(() => {
  return PluscheckFormRef.value.formInstance as FormInstance;
});

/** 待新增清单弹窗的开关 */
const waitListVisible = ref(false);

const handleChange = (val: CollapseModelValue) => {
  // console.log(val);
};

/** 用于记录编辑时,从列表传过来的id */
const listId = ref(0);
/** 用于记录单据状态 */
const status = ref();
/** 勾选的batch_no数组 */
const batchNoList = ref<string[]>([]);
/** 获取详情数据时的加载状态 */
const detailLoading = ref(false);
/** 记录已从弹窗勾选的id数组 */
const waitIds = computed(() => {
  let arr = Object.keys(groupsData.value)
    .map((key) => {
      return groupsData.value[key];
    })
    .flat();
  // console.log("🚀 ~ waitIds ~ arr:", arr);

  let ids = arr.map((item) => item.unique_id);
  // let ids = Object.keys(groupsData.value)
  //   .map((key) => {
  //     return groupsData.value[key];
  //   })
  //   .flat()
  //   .map((item) => item.unique_id);
  return ids;
});

/** 根据批号分组的一个 对象分组数组 */
const groupsData = ref<GroupedPacks>({});

function updateGroupsWithNewData(newData: InnerCoatingListType[], data: GroupedPacks) {
  // 遍历新数据
  newData.forEach((item) => {
    let { batch_no, id, pack_no, ...rest } = item;
    pack_no = Number(pack_no);
    // 如果分组中已有该batch_no，则在对应数组中追加数据并排序
    if (data.hasOwnProperty(batch_no)) {
      data[batch_no].push({ inner_detail_id: id, batch_no, pack_no, ...rest });
      // 确保数组按pack_no排序
      data[batch_no].sort((a, b) => a.pack_no - b.pack_no);
    } else {
      // 否则，创建新的分组
      data[batch_no] = [{ inner_detail_id: id, batch_no, pack_no, ...rest }];
    }
  });
  console.log("🚀 ~ updateGroupsWithNewData ~ data:", data);
}

/** 监听待新增清单点击确认选择事件 */
function waitListChange(list: any) {
  // 根据批号分组且根据包号排序
  updateGroupsWithNewData(list, groupsData.value);
  tableData.value = formatTable(groupsData.value);
  console.log("🚀 ~ waitListChange ~   tableData.value:", tableData.value);
}

/** 获取分组连续性数值和不连续性数值 */
function formatGroupsPackNo(groups: GroupedPacks) {
  // 遍历每个分组
  const result: ContinuityResult = {};

  Object.entries(groups).forEach(([groupName, groupPacks]) => {
    let continuityRange = "";
    let start = groupPacks[0]?.pack_no;
    let end = start;

    for (let i = 1; i < groupPacks.length; i++) {
      if (groupPacks[i].pack_no === groupPacks[i - 1].pack_no + 1) {
        end = groupPacks[i].pack_no;
      } else {
        if (start === end) {
          continuityRange += `${start}, `;
        } else {
          continuityRange += `${start}-${end}, `;
        }
        start = groupPacks[i].pack_no;
        end = start;
      }
    }

    if (start === end) {
      continuityRange += `${start}`;
    } else {
      continuityRange += `${start}-${end}`;
    }

    result[groupName] = continuityRange.trim();
  });

  return result;
}

/** 根据groupsData数据格式化tableData表格数据 */
function formatTable(data: GroupedPacks) {
  // 获取分组连续性数值和不连续性数值
  let packNoList = formatGroupsPackNo(data);
  const arr = Object.keys(data).map((key) => {
    if (data[key].length > 0) {
      let item = data[key][0];
      // console.log("🚀 ~ arr ~ item:", item);
      // 对于每个key，只取其对应的数组中的第一个元素作为代表
      let itemObj = {
        batch_no: item.batch_no,
        joint_pack_no: packNoList[key],
        print_factor: item.print_factor,
        version: item.version,
        line: item.line,
        note: item.customNote || "",
        line_id: item.line_id,
        version_id: item.version_id,
        print_factor_id: item.print_factor_id,
      };
      return item.detail_id ? { id: item.detail_id, ...itemObj } : itemObj;
    } else {
      return {
        batch_no: "",
      };
    }
  });
  return arr;
}

/** 表格勾选触发事件 */
function changeSelect(selection: any[]) {
  batchNoList.value = selection.map((item) => {
    return item.batch_no;
  });
}

/** 表格点击删除 */
async function tableDel() {
  let groupItem: GroupedList[] = [];

  batchNoList.value.forEach((item) => {
    groupItem.push(...groupsData.value[item]);
    delete groupsData.value[item];
  });

  tableData.value = tableData.value.filter((item) => {
    return !batchNoList.value.includes(item.batch_no);
  });

  let groupItemFilter = groupItem.filter((item) => item.id);
  let del_arr = groupItemFilter.map((item) => {
    return {
      inner_detail_id: item.inner_detail_id,
      pallet_number: item.pack_no,
    };
  });

  if (del_arr.length > 0) {
    const result = await cansStockDelSelectApi({ del_arr });
  }
}

/** 表格鼠标移入事件 */
function cellMouseEnter(row: any, column: any, cell: HTMLTableCellElement, event: Event) {
  if (column.property === "joint_pack_no") {
    cell.classList.add("cursor-pointer");
  }
}

/** 表格鼠标移出事件 */
function cellMouseLeave(row: any, column: any, cell: HTMLTableCellElement, event: Event) {
  if (column.property === "joint_pack_no") {
    cell.classList.remove("cursor-pointer");
  }
}

const batchDetailRef = ref();
/** 表格点击单元格事件 */
function cellClick(row: any, column: any, cell: HTMLTableCellElement, event: Event) {
  if (column.property === "joint_pack_no") {
    let batch_no = row.batch_no;
    let groupsList = groupsData.value[batch_no] || [];
    addDialog({
      width: "60%",
      btnClass: "w-[80px]",
      draggable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      btnLoading: false,
      showClose: false,
      title: "托盘信息详情",
      contentRenderer: () =>
        h(BatchDetail, { ref: batchDetailRef, list: groupsList, disabled: isDetailDisable.value }),
      beforeCancel: (done, { options, index }) => {
        done();
      },
      beforeSure: async (done, { options, index }) => {
        // updateDialog(true, "btnLoading");
        console.log("batchDetailRef.value.tableData", batchDetailRef.value.tableData);
        if (!batchDetailRef.value.tableData.length) {
          // 如果该批号没有数据，则删除该批号
          delete groupsData.value[batch_no];
        } else {
          groupsData.value[batch_no] = batchDetailRef.value.tableData;
        }
        console.log("🚀 ~ beforeSure: ~ groupsData.value:", groupsData.value);
        tableData.value = formatTable(groupsData.value);
        // updateDialog(false, "btnLoading");
        done();
      },
    });
  }
}

/** 点击返回 */
function handleCancel() {
  router.replace({
    path: "/quality/material-inspection/empty-cans/cans-stock",
  });
}
/** 点击保存 */
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
    ...checkForm.value,
    file_list: file_list.length > 0 ? file_list : undefined,
    check_user_signature: check_user_signature ? check_user_signature : undefined,
    check_info: tableData.value.length > 0 ? formatCheckInfo() : undefined,
  };
  console.log("🚀 ~ handleSave ~ data:", data);
  // return;
  let loadingText = type === 1 ? "正在保存中" : "正在提交中";
  let resultMsg = "";
  const sendLoading = ElLoading.service({
    lock: true,
    text: loadingText,
    background: "rgba(0, 0, 0, 0.7)",
  });
  try {
    const result = listId.value
      ? await cansStockEditApi({ ...data, id: listId.value })
      : await cansStockAddApi(data);
    resultMsg = result.msg;
    if (type === 2) {
      /* 如果是提交,保存后用返回的id,调用提交接口 */
      let data = {
        id: result.data.id,
        check_user_signature: baseForm.value.check_user_signature,
      };
      const submitResult = await cansStockSubmitApi(data);
      resultMsg = submitResult.msg;
    }
    sendLoading.close();
    closeCurrentPage(resultMsg);
  } catch (error) {
    sendLoading.close();
  }
}

function formatCheckInfo() {
  let arr = tableData.value.map((item) => {
    let { batch_no, line_id, version_id, note, id } = item;
    let pallet_list = groupsData.value[item.batch_no].map((el) => {
      let { id } = el;
      let elObj = {
        batch_no: el.batch_no,
        inner_detail_id: el.inner_detail_id, //内涂膜检验明细id
        pallet_number: el.pack_no,
        mfr_id: el.print_factor_id,
        line_id: el.line_id,
        version_id: el.version_id,
      };
      return id ? { id, ...elObj } : elObj;
    });
    let itemObj = {
      batch_no,
      line_id,
      version_id,
      note,
      pallet_detail: pallet_list,
    };
    return id ? { id, ...itemObj } : itemObj;
  });
  return arr;
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
      path: "/quality/material-inspection/empty-cans/cans-stock",
    });
    tagsViewStore.delView(currentTag);
  });
}

const signDialogRef = ref();
/** 点击提交 */
async function handleSubmit() {
  /* 提交需要验证输入完整 */
  is_submit.value = true;
  if (!tableData.value.length) {
    ElMessage.warning("请先填写检验意见数据");
    return;
  }

  const vaildateRes = await checkFormRef
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

  console.log("🚀 ~ handleSave ~ vaildateRes:", vaildateRes);
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
  ElMessageBox.confirm(`确认要删除单据编号为：【${order_no}】的该条内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定删除");
      const result = await cansStockDelApi({ id: listId.value });
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
    fileValues.status == 3 ? await cansStockRejectApi(data) : await cansStockApproveApi(data);
  closeCurrentPage(result.msg);
};

/** 点击撤回 */
async function hanleRecall() {
  const result = await cansStockRecallApi({ id: listId.value });
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
      const result = await cansStockReverseApi({ id: listId.value });
      ElMessage.success(result.msg);
      getDetailData();
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击生成报告 */
function handleReport() {
  startDownloadUrl(cansStockReportApi, { id: listId.value });
}

/**  表格点击新增 */
async function tableAdd() {
  const vaildateRes = await baseFormRef
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
  waitListVisible.value = true;
}

async function getDetailData() {
  detailLoading.value = true;
  const result = await getCansStockDetailApi({ id: listId.value });
  const res = result.data;
  assoc_type.value = res.assoc_type;
  fileData.value = res.file_list;
  logList.value = res.act_log;

  baseForm.value.note = res.note; //备注
  baseForm.value.supplier_id = res.supplier_id; //供应商
  baseForm.value.sku = res.sku; //产品类型
  baseForm.value.check_time = res.check_time; //检测日期
  baseForm.value.check_uid = res.check_uid; //检验员id
  baseForm.value.check_res = res.check_res; //检验结果
  baseForm.value.order_no = res.order_no; //单据编号-保存剔除
  baseForm.value.order_status = getStatusText(res.status); //单据状态文本-保存剔除
  status.value = res.status;
  baseForm.value.ct_name = res.ct_name; //创建人-保存剔除
  baseForm.value.create_time = res.create_time; //创建时间-保存剔除
  baseForm.value.create_time = res.create_time; //创建时间-保存剔除

  groupsData.value = changeDetailData(res.check_info);
  tableData.value = formatTable(groupsData.value);
  checkForm.value.exterior_res = res.exterior_res; //外观
  checkForm.value.label_recog_res = res.label_recog_res; //标签标识
  checkForm.value.inner_coating_film_res = res.inner_coating_film_res; //内涂膜
  checkForm.value.weld_integrity_res = res.weld_integrity_res; //焊缝完整性
  checkForm.value.roll_sealing_res = res.roll_sealing_res; //卷封
  checkForm.value.silent_code_test_res = res.roll_sealing_res; //默码试机
  checkForm.value.bottom_cover_blue_res = res.roll_sealing_res; //底盖蓝点
  checkForm.value.bursting_power_res = res.roll_sealing_res; //启破力

  if (pageType.value === 3) {
    baseForm.value.check_user_signature = res.check_user_signature ?? "";
    baseForm.value.reviewer_user_signature = res.reviewer_user_signature ?? "";
  }

  detailLoading.value = false;
}

function changeDetailData(check_info: any[]) {
  let groupedObj: GroupedPacks = {};
  check_info.forEach((item) => {
    let arr = item.pallet_detail.map((subItem: any) => {
      return {
        id: subItem.id, //托盘信息记录id
        inner_detail_id: subItem.inner_detail_id, //内涂膜检验明细id
        customNote: item.note, //记录一下父级的备注
        detail_id: subItem.detail_id,
        batch_no: subItem.batch_no, //批号
        line: subItem.line, //线别名称
        print_factor: subItem.sup_name, //彩印厂家名称
        version: subItem.version_no, //版本
        line_id: subItem.line_id, //线别id
        version_id: subItem.version_id, //版本id
        print_factor_id: subItem.mfr_id, //彩印厂家id
        pack_no: subItem.pallet_number, //包号/托盘号
      };
    });

    groupedObj[item.batch_no] = arr;
  });
  console.log("groupedObj", groupedObj);
  return groupedObj;
}

watchEffect(() => {
  let checkColumnsList = checkColumns
    .map((item) => {
      let isHide = isRef(item.hideInForm) && item.hideInForm.value;
      if (!isHide) {
        return item.prop;
      }
    })
    .filter((item) => item !== undefined);
  // console.log("🚀 ~ watchEffect ~ checkColumnsList:", checkColumnsList);

  let checkList = checkColumnsList.map((item: any) => {
    return checkForm.value[item as keyof typeof checkForm.value];
  });

  // let checkList = Object.values(checkForm.value);
  // console.log("🚀 ~ watchEffect ~ checkList:", checkList);
  let isUndetected = checkList.some((item) => isNullOrUnDef(item));
  if (isUndetected) {
    // 如果有为undefined或者null的,就表示还没检测完
    baseForm.value.check_res = 3;
    return;
  }

  let someRes = checkList.some((item) => item === 1);
  if (someRes) {
    // 如果存在,表示肯定有至少一项是合格的,设置为 部分合格,
    baseForm.value.check_res = 2;
    let everyRes = checkList.every((item) => item === 1);
    if (everyRes) {
      // 如果 全部是合格,设置为合格
      baseForm.value.check_res = 1;
    }
  } else {
    // 如果不存在,表示没有合格的,设置为 不合格
    baseForm.value.check_res = 0;
  }
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
  initTagsView();
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
      :order-type="4"
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
              />
            </div>
          </el-collapse-item>
          <el-collapse-item name="2" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">检验信息</p>
            </template>
            <div class="px-8">
              <PlusForm
                :disabled="isDetailDisable"
                :rules="checkRules"
                ref="PluscheckFormRef"
                v-model="checkForm"
                labelWidth="90"
                :columns="checkColumns"
                :row-props="{ gutter: 20 }"
                :col-props="{
                  span: 6,
                }"
                :hasFooter="false"
              />
            </div>
          </el-collapse-item>
          <el-collapse-item name="3" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">检验意见</p>
            </template>
            <div class="px-8">
              <ul class="flex items-center justify-between mb-2" v-if="!isDetailDisable">
                <li>
                  <el-button type="primary" @click="tableAdd">新增</el-button>
                  <el-button @click="tableDel">删除</el-button>
                </li>
              </ul>
              <el-form :model="tableForm" ref="tableFormRef">
                <PureTable
                  ref="prueTableRef"
                  row-key="batch_no"
                  border
                  :columns="tableColumns"
                  :data="tableData"
                  max-height="700"
                  @cell-mouse-enter="cellMouseEnter"
                  @cell-mouse-leave="cellMouseLeave"
                  @cell-click="cellClick"
                  @selection-change="changeSelect"
                >
                  <template #joint_pack_no="{ row }">
                    <span class="text-blue-500">{{ row.joint_pack_no }}</span>
                  </template>
                  <template #note="{ row }">
                    <el-input v-model="row.note" :disabled="isDetailDisable"></el-input>
                  </template>
                </PureTable>
              </el-form>
            </div>
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

    <WaitList
      v-model="waitListVisible"
      :ids="waitIds"
      :check_time="baseForm.check_time"
      :sku="baseForm.sku"
      :supplier_id="baseForm.supplier_id"
      @change="waitListChange"
    ></WaitList>
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
</style>
