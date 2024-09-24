<script setup lang="ts">
/* 原材料使用通知单-编辑页面*/
import type { CollapseModelValue, FormInstance, TabPaneName } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import type { CheckDetailListType } from "@/api/quality/common/types";
import {
  getUseNoticeDetailApi,
  useNoticeAddApi,
  useNoticeApproveApi,
  useNoticeDelApi,
  useNoticeEditApi,
  useNoticeRecallApi,
  useNoticeRejectApi,
  useNoticeReportApi,
  useNoticeReverseApi,
  useNoticeSubmitApi,
} from "@/api/quality/material-inspection/use-notice/index";
import type { BatchInfoType } from "@/api/quality/material-inspection/use-notice/types";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCommonHooks } from "@/hooks/quality";
import { useTagsViewStore } from "@/store/modules/tagsView";
import FileTable from "@/views/quality/components/FileTable/index.vue";
import OrderLog from "@/views/quality/components/OrderLog/index.vue";
import RecheckSign from "@/views/quality/components/RecheckSign/index.vue";
import AffixButton from "@/views/quality/components/affixButton.vue";
import BatchDetail from "./components/batchDetail.vue";
import BatchList from "./components/batchList.vue";
import { useAdd } from "./utils/add";
import type { ContinuityResult, GroupedList, GroupedPacks } from "./utils/add";

const { startDownloadUrl } = useCommonHooks();

defineOptions({
  name: "MaterialInspectionUsenoticeAdd",
});

enum ETitle {
  "新建原材料使用通知单" = 1,
  "编辑原材料使用通知单",
  "原材料使用通知单详情",
}

const tagsViewStore = useTagsViewStore();
const router = useRouter();
const route = useRoute();

const {
  pageType,
  is_submit,
  baseForm,
  baseColumns,
  baseRules,
  fileData,
  logList,
  tableForm,
  tableColumns,
  tableData,
  getStatusText,
  isDetailDisable,
  useSetting,
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
const batchListVisible = ref(false);

/** 用于记录编辑时,从列表传过来的id */
const listId = ref(0);
/** 用于记录单据状态 */
const status = ref();
/** 勾选的id数组 */
const batchNoList = ref<string[]>([]);
/** 获取详情数据时的加载状态 */
const detailLoading = ref(false);

/** 折叠面板的数组 */
const activeNames = ref(["1", "2"]);
const PlusFormRef = ref();
/** 基础表单的ref */
const baseFormRef = computed(() => {
  return PlusFormRef.value.formInstance as FormInstance;
});

/** 记录已从弹窗勾选的id数组 */
const batchIds = computed(() => {
  let arr = Object.values(groupsData.value).flat();
  let ids = arr.map((item) => item.check_detail_id);
  return ids;
});

/** 表格表单的ref */
const tableFormRef = ref<FormInstance>();

const handleChange = (val: CollapseModelValue) => {
  // console.log(val);
};

/** 根据批号分组的一个 对象分组数组 */
const groupsData = ref<GroupedPacks>({});

function updateGroupsWithNewData(newData: CheckDetailListType[], data: GroupedPacks) {
  // 遍历新数据
  newData.forEach((item) => {
    let { batch_no, unique_id, ...rest } = item;
    // 如果分组中已有该batch_no，则在对应数组中追加数据并排序
    if (data.hasOwnProperty(batch_no)) {
      // 将数据中的id设为check_detail_id字段添加到数据中
      data[batch_no].push({ check_detail_id: unique_id, batch_no, ...rest });
      // 确保数组按pack_no排序
      data[batch_no].sort((a, b) => a.pack_no - b.pack_no);
    } else {
      // 否则，创建新的分组
      data[batch_no] = [{ check_detail_id: unique_id, batch_no, ...rest }];
    }
  });
}

function batchListChange(list: CheckDetailListType[]) {
  // 根据批号分组且根据包号排序
  updateGroupsWithNewData(list, groupsData.value);
  console.log("groupsData.value", groupsData.value);
  tableData.value = formatTable(groupsData.value);
}

/** 获取分组连续性数值和不连续性数值 */
function formatGroupsPackNo(groups: GroupedPacks) {
  // 遍历每个分组
  const result: ContinuityResult = {};
  Object.entries(groups).forEach(([groupName, groupPacks]) => {
    if (groupPacks.length > 0) {
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
    }
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
      // 对于每个key，只取其对应的数组中的第一个元素作为代表
      let itemObj = {
        batch_no: item.batch_no,
        joint_pack_no: packNoList[key],
      };
      // 如果detail_id存在，则返回包含detail_id的itemObj,且detail_id设为id，否则返回itemObj
      return item.detail_id ? { id: item.detail_id, ...itemObj } : itemObj;
    } else {
      return {
        batch_no: "",
        joint_pack_no: "",
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
    if (isDetailDisable.value) return;
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
      contentRenderer: () => h(BatchDetail, { ref: batchDetailRef, list: groupsList }),
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
    path: "/quality/material-inspection/use-notice",
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
    reviewer_user_signature,
    check_user_signature,
    ...rest
  } = baseForm.value;
  let file_list = fileTableRef.value!.getChangeFileData();

  let data = {
    ...rest,
    check_user_signature: check_user_signature ? check_user_signature : undefined,
    file_list: file_list.length > 0 ? file_list : undefined,
    batch_info: tableData.value.length > 0 ? formatSendBatchList() : undefined,
  };
  console.log("🚀 ~ handleSave ~ data:", data);
  // return
  let loadingText = type === 1 ? "正在保存中" : "正在提交中";
  let resultMsg = "";
  const sendLoading = ElLoading.service({
    lock: true,
    text: loadingText,
    background: "rgba(0, 0, 0, 0.7)",
  });
  try {
    const result = listId.value
      ? await useNoticeEditApi({ ...data, id: listId.value })
      : await useNoticeAddApi(data);
    resultMsg = result.msg;
    if (type === 2) {
      /* 如果是提交,保存后用返回的id,调用提交接口 */
      let data = {
        id: result.data.id,
        check_user_signature: baseForm.value.check_user_signature,
      };
      const submitResult = await useNoticeSubmitApi(data);
      resultMsg = submitResult.msg;
    }
    sendLoading.close();
    closeCurrentPage(resultMsg);
  } catch (error) {
    sendLoading.close();
  }
}
/** 转换batch_info字段数据格式为接口需要的格式 */
function formatSendBatchList() {
  // 需要的数据格式 示例
  // batch_info = [
  //   {
  //     id: 0,  明细id,编辑需要,新建无需
  //     batch_number: "", 批号
  //     pallet_detail:[
  //       id:0, 记录id,编辑需要,新建无需
  //       check_detail_id:0, 托盘信息id
  //       batch_no:"", 批号
  //       pallet_number:"" 托盘号
  //       check_date:"" 检验日期
  //     ]
  //   }
  // ]
  let arr = tableData.value.map((item) => {
    let { batch_no, id } = item;
    let pallet_list = groupsData.value[item.batch_no].map((el) => {
      let { id } = el;
      let elObj = {
        batch_no: el.batch_no,
        check_detail_id: el.check_detail_id, //托盘信息id
        pallet_number: el.pack_no,
        check_date: el.check_date,
      };
      return id ? { id, ...elObj } : elObj;
    });
    let itemObj = {
      batch_no: batch_no,
      pallet_detail: pallet_list,
    };
    return id ? { id, ...itemObj } : itemObj;
  });
  return arr;
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
  ElMessageBox.confirm(`确认要删除该单据吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定删除");
      const result = await useNoticeDelApi({ id: listId.value });
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
    fileValues.status == 3 ? await useNoticeRejectApi(data) : await useNoticeApproveApi(data);
  closeCurrentPage(result.msg);
};

/** 点击撤回 */
async function hanleRecall() {
  const result = await useNoticeRecallApi({ id: listId.value });
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
      const result = await useNoticeReverseApi({ id: listId.value });
      ElMessage.success(result.msg);
      getDetailData();
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击生成报告 */
function handleReport() {
  startDownloadUrl(useNoticeReportApi, { id: listId.value });
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
      path: "/quality/material-inspection/use-notice",
    });
    tagsViewStore.delView(currentTag);
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
  batchListVisible.value = true;
}

/** 批号明细点击删除 */
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
  const result = await getUseNoticeDetailApi({ id: listId.value });
  const res = result.data;
  assoc_type.value = res.assoc_type;
  fileData.value = res.file_list;
  logList.value = res.act_log;

  baseForm.value.order_no = res.order_no; //单据编号-保存剔除
  baseForm.value.order_status = getStatusText(res.status, res.assoc_type); //单据状态文本-保存剔除
  status.value = res.status;
  baseForm.value.ct_name = res.ct_name; //创建人-保存剔除
  baseForm.value.create_time = res.create_time; //创建时间-保存剔除
  baseForm.value.check_time = res.check_time; //检测日期
  baseForm.value.check_uid = res.check_uid; //检验员id
  baseForm.value.check_res = res.check_res; //检验结果

  baseForm.value.brand = res.brand; //产品大类
  baseForm.value.materials_class = res.materials_class; //原材料类别
  baseForm.value.notice_time = res.notice_time; // 时间
  baseForm.value.note = res.note;

  groupsData.value = changeDetailData(res.batch_info);
  tableData.value = formatTable(groupsData.value);
  if (pageType.value === 3) {
    baseForm.value.check_user_signature = res.check_user_signature ?? "";
    baseForm.value.reviewer_user_signature = res.reviewer_user_signature ?? "";
  }

  detailLoading.value = false;
}

function changeDetailData(check_info: BatchInfoType[]) {
  let groupedObj: GroupedPacks = {};
  check_info.forEach((item) => {
    let arr = item.pallet_detail.map((subItem: any) => {
      return {
        check_date: subItem.check_date,
        batch_no: subItem.batch_no, //批号
        pack_no: subItem.pallet_number, //包号/托盘号
        check_detail_id: subItem.check_detail_id, //托盘信息id
        detail_id: subItem.detail_id, //该detail_id对应为父级的id
        id: subItem.id, //记录id
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
      :order-type="9"
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
                :disabled="pageType === 3"
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
              />
            </div>
          </el-collapse-item>
          <el-collapse-item name="2" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">批号明细</p>
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
                  height="800"
                  @cell-mouse-enter="cellMouseEnter"
                  @cell-mouse-leave="cellMouseLeave"
                  @cell-click="cellClick"
                  @selection-change="changeSelect"
                >
                  <template #joint_pack_no="{ row }">
                    <span class="text-blue-500">{{ row.joint_pack_no }}</span>
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
    <BatchList
      :ids="batchIds"
      :check_time="baseForm.check_time"
      :materials_class="baseForm.materials_class"
      :brand="baseForm.brand"
      v-model="batchListVisible"
      @change="batchListChange"
    ></BatchList>
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
