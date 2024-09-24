<!-- 领料出库单详情页 -->
<script setup lang="ts">
import { ElLoading } from "element-plus";
import { ElTable, type FormInstance } from "element-plus";
import { hiprint } from "vue-plugin-hiprint";
import { useRoute, useRouter } from "vue-router";
import { getStocksUniqueLabelApi } from "@/api/common/index";
// 导入API
import {
  approveGetSupApi,
  approveGetSupWhApi,
  confirmReceiveApi,
  delGetSupApi,
  detailGetSupApi,
  overGetSupApi,
  recallGetSupApi,
  recallGiveApi,
  rejectGetSupApi,
  rejectGetSupWhApi,
  submitGetSupApi,
  voidGetSupApi,
} from "@/api/storage/get-supplier";
// 导入类型
import { GetSupActlog, GetSupGoods } from "@/api/storage/get-supplier/types";
import { formartDate } from "@/utils/validate";
// 导入条形码组件
import Barcode from "@/components/Barcode/index.vue";
import CardHint from "@/components/CardHint/index.vue";
// 导入查看文件组件
import LookFile from "@/components/LookFile/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import TabsHeader from "@/components/TabsHeader/index.vue";
import { useTagsViewStore } from "@/store/modules/tagsView";
// 导入流程组件
import assignFlow, { API as assignFlowApi } from "./components/assignFlow.vue";
// 导入确认发料弹窗
import confirmGive from "./components/confirmGive.vue";
// 导入确认领料弹窗
import confirmReceive from "./components/confirmReveice.vue";
// 导入发料明细弹窗
import giveDetail from "./components/giveDetail.vue";
import print from "./components/print.vue";
// 导入二维码弹窗
import qrcode from "./components/qrcode.vue";
import selectUniqueCodeVue from "./components/selectUniqueCode.vue";
// 引入hook
import { useOrderList } from "./utils/hook";
import moban from "./utils/moban.json";

hiprint.init();

const { checkAssocType } = useOrderList();
const route = useRoute();
const router = useRouter();
const tagsViewStore = useTagsViewStore();

enum EStatus {
  "待提审" = 0,
  "待审核" = 1,
  "已完成" = 3,
  "已撤回" = 4,
  "已驳回" = 5,
  "已作废" = 6,
  "已审批" = 7,
  "待领料" = 8,
  "已发料" = 9,
  "待确认" = 10,
}

const state = reactive({
  listId: 0,
  /** 身份标识 */
  assoc_type: [] as number[],
  /** 新标识, 是否制单人:1为制单人,0不是 */
  is_ct_user: 0,
  /** 是否部分领取 是否有领取过；0：不是；1：是； */
  is_have_received: 0,
  /** 是否强制完结；0：否；1：是；  */
  is_force_receive: 0,
  /** 是否部分发料  0：不是；1：部分发料；*/
  is_part_issue: 0,
  theadList: [
    "货品条码",
    "名称",
    "规格型号",
    "批次/日期",
    "出库仓库",
    "使用地点",
    "单位",
    "领料数量",
    "领料状态",
    "备注",
  ],
  tableData: [] as GetSupGoods[], //详情信息
  logData: [] as GetSupActlog[], //单据日志

  activeName: "tab-1",
  tabList: ["出库单详情", "单据日志"],
  currentIndex: 0,
  // `````````````
  wh_rec_no: "", //出库单号
  out_time: "", //出库日期
  ct_name: "", //制单人
  create_time: "", //创建时间
  file_info: {
    //附件信息
    src: "",
    name: "",
  },
  status: 0, //状态0待提审,1待审核,2待入库,3已完成,4已撤回,5已驳回,6已作废
  note: "", //总备注
  loading: false, //加载状态
  rp_uname: "",
  ar_uname: "",
  ap_uname: "",
  // receiver_confirm_status: 0,
  /** 确认发料弹窗开关 */
  confirmGiveVisible: false,
  /** 确认发料弹窗数据 */
  giveData: [] as any[],
  /** 发料明细弹窗开关 */
  giveDetailVisible: false,
  rowId: 0, //记录点击行的id
  /** 确认领取弹窗开关 */
  receiveVisible: false,
  /** 确认领取弹窗数据 */
  receiveData: [] as any[],
  /** 二维码弹窗开关 */
  qrcodeVisible: false,
  /** 二维码图片路径 */
  receive_qrcode_url: "",
  rec_type_name: "", //领料类型
  warehouse_name: "", //出库仓库名称
});

const {
  listId,
  assoc_type,
  is_ct_user,
  tableData,
  logData,
  theadList,
  tabList,
  currentIndex,
  // ``````````
  wh_rec_no,
  ct_name,
  create_time,
  file_info,
  note,
  status,
  loading,
  rp_uname,
  ar_uname,
  ap_uname,
  confirmGiveVisible,
  giveData,
  giveDetailVisible,
  rowId,
  receiveVisible,
  receiveData,
  is_have_received,
  is_force_receive,
  is_part_issue,
  qrcodeVisible,
  receive_qrcode_url,
  out_time,
  rec_type_name,
  warehouse_name,
} = toRefs(state);
const errMsg = ref("暂无数据");

const printVisible = ref(false);
const printInfo = ref<any>();

const checkTableRef = ref<InstanceType<typeof ElTable>>();

/** 点击显示二维码 */
const handleShowMa = () => {
  if (!receive_qrcode_url) {
    return ElMessage.info("暂未开放，敬请期待");
  }
  qrcodeVisible.value = true;
};

/** 流程子组件的ref  */
// const assignFlowRef = ref<InstanceType<typeof assignFlow>>();
const assignFlowRef = ref<assignFlowApi>();

const goodsWarehouseId = computed(() => {
  // let idList = tableData.value.map((item) => item.warehouse_id);
  // idList = [...new Set(idList)];
  // return idList;
  let list = tableData.value.map((item) => {
    return {
      id: item.warehouse_id,
      warehouse_name: item.warehouse_name,
    };
  });

  let result = list.filter((item, index, self) => {
    return self.findIndex((t) => t.id === item.id) === index;
  });

  return result;
});

/* 是否小手样式 */
function getRowClass(row: any) {
  if (row.row.issuance_status === 0) {
    return "cursor-default";
  }
  // return "row-expand-cursor";
  return "cursor-pointer";
}
// 点击整行单元格
function handleRowClick(row: any, column: any) {
  console.log("column", column);
  if (!column) return;
  if (row.issuance_status === 0) return;
  let noPropertyList = ["this_num"];
  let property = column.property;
  if (noPropertyList.includes(property) || !property) return;
  rowId.value = row.id;
  giveDetailVisible.value = true;
}

function selectableFn(row: any) {
  return Boolean(row.is_can_issuance);
}

const handlePrint = () => {
  let orderNote = note.value || "";

  let printData = {
    table_title: "领料出库单",
    barcode: wh_rec_no.value,
    out_time: `出库日期:${out_time.value}`,
    rec_type_name: `领料类型:${rec_type_name.value}`,
    table_no: "领料出库单号:",
    table_username: `制单人:${ct_name.value}`,
    rp_uname: `领料申请人:${rp_uname.value}`,
    ar_names: `指定领取人:${ar_uname.value}`,
    order_note: `单据备注:${orderNote}`,
    table: tableData.value,
  };

  let hiprintTemplate = new hiprint.PrintTemplate({ template: moban });
  // 打印
  hiprintTemplate.print(
    printData,
    {},
    {
      callback: () => {
        console.log("浏览器打印窗口已打开");
      },
    },
  );
};

/** 如果this_num为null,则将其设置为1 */
const changeNum = (val: FocusEvent, row: GetSupGoods) => {
  console.log("row", row);
  if (row.this_num === null) {
    row.this_num = 1;
  }
};

// 点击仓库发料
const handleGive = () => {
  let arr = checkTableRef.value!.getSelectionRows();
  if (arr.length === 0) {
    ElMessage.warning("请选择要发料的货品");
    return;
  }
  giveData.value = arr;
  confirmGiveVisible.value = true;
};
//监听子组件触发-确认发料
const handleConfirmGive = async () => {
  getData();
  assignFlowRef.value?.getFlowGetSup();
};

// 点击发料撤回
const handleRecallGive = async () => {
  const result = await recallGiveApi({ id: listId.value });
  ElMessage.success(result.msg);
  getData();
};

// 监听子组件触发-确认领取
const handleConfirmReceive = () => {
  getData();
  assignFlowRef.value?.getFlowGetSup();
};

// 点击确认领料
const clickConfirmReceive = async () => {
  // const result = await confirmReceiveApi({ id: listId.value });
  // ElMessage.success(result.msg);
  // getData();
  receiveData.value = tableData.value.filter((item) => item.this_wait_received_num > 0);
  console.log("🚀 ~ clickConfirmReceive ~ receiveData.value:", receiveData.value);
  receiveVisible.value = true;
};

// 点击领料完结
const handleOver = () => {
  ElMessageBox.confirm(`本单存在未领取完物料，请确认是否完结?`, "警告", {
    confirmButtonText: "确定完结",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      const result = await overGetSupApi({ id: listId.value });
      ElMessage.success(result.msg);
      assignFlowRef.value?.getFlowGetSup();
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
};

// 请求数据
const getData = async () => {
  let loadingInstance = ElLoading.service({
    lock: true,
    text: "正在加载",
    background: "rgba(0, 0, 0, 0.1)",
  });

  try {
    // loading.value = false;
    const result = await detailGetSupApi({ id: listId.value });
    let res = result.data;
    warehouse_name.value = res.warehouse_name;
    wh_rec_no.value = res.wh_rec_no;
    ct_name.value = res.ct_name;
    create_time.value = res.create_time;
    file_info.value = res.file_info;
    note.value = res.note;
    status.value = res.status;
    tableData.value = res.goods;
    logData.value = res.act_log;
    rp_uname.value = res.rp_names;
    ar_uname.value = res.ar_names;
    ap_uname.value = res.ap_names;
    // receiver_confirm_status.value = res.receiver_confirm_status;
    assoc_type.value = res.assoc_type;
    is_ct_user.value = res.is_ct_user;
    is_part_issue.value = res.is_part_issue;
    is_have_received.value = res.is_have_received;
    is_force_receive.value = res.is_force_receive;
    receive_qrcode_url.value = res.receive_qrcode_url;
    rec_type_name.value = res.rec_type_name;
    out_time.value = formartDate(res.out_time);
    // receive_qrcode_url.value = "/static/uploads/qrcode_receiver_214.png";
    loading.value = true;
    loadingInstance.close();
  } catch (error) {
    loadingInstance.close();
    if (error instanceof Error) {
      errMsg.value = error.message;
    }
  }
};

// 点击返回按钮
const handleBack = () => {
  router.replace({
    path: "/storage/get-supplier",
  });
  tagsViewStore.delView(route);
};

// 点击编辑按钮
const handleEdit = () => {
  router.push({
    path: "/storage/get-supplier/add",
    query: {
      editFrom: 2,
      id: listId.value,
    },
  });
};

// 单元格点击提审
const cellSubmitAudit = async () => {
  console.log("点击提审");
  try {
    const result = await submitGetSupApi({ id: listId.value });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击撤回
const cellRecall = async () => {
  try {
    const result = await recallGetSupApi({ id: listId.value });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击作废
const handleVoid = () => {
  console.log("点击作废", listId.value);
  ElMessageBox.confirm(`您确定要作废该领料出库单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      try {
        let result = await voidGetSupApi({ id: listId.value });
        ElMessage.success(result.msg);
        getData();
      } catch (error) {}
    })
    .catch((error) => {
      console.log(error);
    });
};

// 单元格点击删除
const cellDel = () => {
  ElMessageBox.confirm(`您确定要删除该领料出库单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      let result = await delGetSupApi({ id: listId.value });
      ElMessage.success(result.msg);
      handleBack();
    })
    .catch((error) => {
      console.log(error);
    });
};

// 单元格点击通过
const cellApprove = async () => {
  console.log("点击通过", listId.value);
  try {
    const result = await approveGetSupApi({ id: listId.value });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击驳回
const cellReject = () => {
  console.log("点击驳回,输入驳回原因", listId.value);
  ElMessageBox.prompt("请输入驳回原因", "驳回原因：", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    // inputPattern: /[\s\S]/,
    customClass: "",
    inputType: "textarea",
    inputValidator: (val) => {
      if (val.trim().length < 1) {
        return false;
      } else {
        return true;
      }
    },
    inputErrorMessage: "请输入驳回原因",
  })
    .then(async ({ value }) => {
      value = value.trim();
      if (value) {
        let data = {
          reason: value,
          id: listId.value,
        };
        try {
          const result = await rejectGetSupApi(data);
          ElMessage.success(result.msg);
          getData();
        } catch (error) {
          console.log(error);
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
// 单元格仓库确认人点击通过
// const cellwhApprove = async () => {
//   console.log("点击通过", listId.value);
//   try {
//     const result = await approveGetSupWhApi({ id: listId.value });
//     ElMessage.success(result.msg);
//     getData();
//   } catch (error) {}
// };

// 单元格仓库确认人点击驳回
const cellwhReject = () => {
  console.log("点击驳回,输入驳回原因", listId.value);
  ElMessageBox.prompt("请输入驳回原因", "驳回原因：", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    // inputPattern: /[\s\S]/,
    customClass: "",
    inputType: "textarea",
    inputValidator: (val) => {
      if (val.trim().length < 1) {
        return false;
      } else {
        return true;
      }
    },
    inputErrorMessage: "请输入驳回原因",
  })
    .then(async ({ value }) => {
      value = value.trim();
      if (value) {
        let data = {
          reason: value,
          id: listId.value,
        };
        try {
          const result = await rejectGetSupWhApi(data);
          ElMessage.success(result.msg);
          getData();
        } catch (error) {
          console.log(error);
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const orderStatus = computed(() => {
  // if (status.value == 1 && assoc_type.value == 3) return "已审核";
  let check = checkAssocType(assoc_type.value, 3);
  if (status.value == 1 && check) return "已审核";
  return EStatus[status.value];
});

watch(
  () => route,
  (newValue, oldValue) => {
    if (newValue.path !== oldValue?.path) {
      listId.value = newValue.query.id ? Number(newValue.query.id) : 0;
      getData();
    }
  },
  { immediate: true },
);

const selectUniqueCodeRef = ref();
async function lookDetail(row: any) {
  console.log("🚀 ~ lookDetail ~ row:", row);
  let { unique_label_detail } = row;
  console.log("🚀 ~ lookDetail ~ unique_label_detail:", unique_label_detail)

  let list = unique_label_detail.map((item:any)=>{
    return  {
      ...item,
      code: item.unique_code
    }
  });

  // selectUniqueVue
  addDialog({
    width: "60%",
    draggable: true,
    closeOnClickModal: false,
    btnClass: "w-[80px]",
    closeOnPressEscape: false,
    btnLoading: false,
    showClose: false,
    title: "标签明细",
    contentRenderer: () =>
      h(selectUniqueCodeVue, {
        ref: selectUniqueCodeRef,
        data: list,
        hideSelect: true,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      done();
    },
  });
}
</script>
<template>
  <div class="app-container">
    <div class="app-card" v-if="loading">
      <div class="header-title flex justify-between">
        <span>领料出库单详情</span>
        <div class="print-btn cursor-pointer" @click="handlePrint">
          <svg-icon icon-class="print"></svg-icon>
          <span class="inline-block ml-[4px]">打印单据</span>
        </div>
      </div>
      <div class="print-area">
        <div class="print-header">
          <div class="header-left">
            <div class="mb-[10px]">
              <div class="header-left-bottom text-primary">
                <span>领料出库单号：</span>
                <span>{{ wh_rec_no }}</span>
              </div>
              <div class="header-left-bottom text-primary">
                <span>制单人：</span>
                <span>{{ ct_name }}</span>
              </div>
              <div class="header-left-bottom text-primary">
                <span>创建时间：</span>
                <span>{{ create_time }}</span>
              </div>
            </div>
            <div>
              <div class="header-left-bottom text-primary">
                <span>领料申请人：</span>
                <span>{{ rp_uname }}</span>
              </div>
              <div class="header-left-bottom text-primary">
                <span>领料类型：</span>
                <span>{{ rec_type_name || "无" }}</span>
              </div>
              <div class="header-left-bottom text-primary">
                <span>出库仓库：</span>
                <span>{{ warehouse_name || "" }}</span>
              </div>
            </div>
          </div>
          <div class="header-right">
            <span class="code-status">{{ orderStatus }}</span>
            <barcode :value="wh_rec_no" v-if="wh_rec_no"></barcode>
          </div>
        </div>
        <tabs-header :tab-list="tabList" v-model="currentIndex"></tabs-header>
        <!-- 出库单详情 -->
        <div v-show="currentIndex == 0">
          <!-- <div class="mb-6">
            <el-tag size="large" type="info" effect="plain" class="!text-[14px] font-bold mb-1">
              申请信息
            </el-tag>
            <el-table
              :data="tableData"
              border
              stripe
              :cell-style="{ 'text-align': 'center' }"
              :header-cell-style="{ 'text-align': 'center' }"
              header-cell-class-name="table-row-header"
              :loading="loading"
              :row-class-name="getRowClass"
              height="500"
              scrollbar-always-on
            >
              <el-table-column label="#" type="index" />
              <el-table-column label="条码" prop="barcode"></el-table-column>
              <el-table-column label="名称" prop="title"></el-table-column>
              <el-table-column label="规格型号" prop="spec"></el-table-column>
              <el-table-column label="品牌" prop="brand"></el-table-column>
              <el-table-column label="分类" prop="class_name"></el-table-column>
              <el-table-column label="单位" prop="measure_name"></el-table-column>
              <el-table-column label="批次/日期" prop="ph_no"></el-table-column>
              <el-table-column label="库位" prop="ws_code"></el-table-column>
              <el-table-column label="出库仓库" prop="warehouse_name"></el-table-column>
              <el-table-column label="使用地点" prop="use_places"></el-table-column>
              <el-table-column label="申请数量" prop="rec_num"></el-table-column>

              <template v-if="checkAssocType(assoc_type, [5, 6])">
                <el-table-column label="已发数量" prop="issue_num"></el-table-column>
              </template>
              <el-table-column
                label="已领数量"
                prop="received_num"
                v-if="!checkAssocType(assoc_type, [5, 6])"
              ></el-table-column>
              <template v-if="checkAssocType(assoc_type, 8)">
                <el-table-column label="本次领料" prop="this_wait_received_num"></el-table-column>
              </template>
              <el-table-column label="发料状态" prop="issuance_status ">
                <template #default="{ row, $index }">
                  <span v-if="row.issuance_status == 1">部分发料</span>
                  <span v-else-if="row.issuance_status == 2">全部发料</span>
                  <span v-else>待发料</span>
                </template>
              </el-table-column>
              <el-table-column label="备注" prop="note"></el-table-column>
            </el-table>
          </div> -->

          <!-- <div v-if="checkAssocType(assoc_type, [5, 6]) && status != 3"> -->
          <!-- <el-tag size="large" type="info" effect="plain" class="!text-[14px] font-bold mb-1">
              发料拣货操作
            </el-tag> -->
          <el-table
            :data="tableData"
            border
            stripe
            :cell-style="{ 'text-align': 'center' }"
            :header-cell-style="{ 'text-align': 'center' }"
            header-cell-class-name="table-row-header"
            :loading="loading"
            ref="checkTableRef"
            :row-class-name="getRowClass"
            @row-click="handleRowClick"
            height="500"
            scrollbar-always-on
          >
            <!-- <el-table-column
              type="selection"
              width="55"
              v-if="assoc_type == 5"
              :selectable="selectableFn"
            ></el-table-column> -->
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column
              type="selection"
              width="55"
              v-if="checkAssocType(assoc_type, 5) && status != 3"
              :selectable="selectableFn"
            ></el-table-column>
            <el-table-column label="条码" prop="barcode" min-width="100"></el-table-column>
            <el-table-column label="名称" prop="title" min-width="100"></el-table-column>
            <el-table-column label="规格型号" prop="spec" min-width="120"></el-table-column>
            <el-table-column label="品牌" prop="brand"></el-table-column>
            <el-table-column label="分类" prop="class_name"></el-table-column>
            <el-table-column label="单位" prop="measure_name"></el-table-column>
            <el-table-column label="批次/日期" prop="ph_no" min-width="90"></el-table-column>
            <el-table-column
              label="出库仓库"
              prop="warehouse_name"
              min-width="90"
            ></el-table-column>
            <el-table-column label="使用地点" prop="use_places" min-width="90"></el-table-column>
            <el-table-column label="申请数量" prop="rec_num" min-width="90">
              <template #default="{ row }">
                <span class="block">{{ row.rec_num }}</span>
                <el-button
                  type="primary"
                  link
                  @click.stop="lookDetail(row)"
                  v-if="row.is_have_unique"
                >
                  申请明细
                </el-button>
              </template>
            </el-table-column>

            <!-- <template v-if="assoc_type == 5"> -->
            <template v-if="checkAssocType(assoc_type, [5, 6])">
              <el-table-column label="已发数量" prop="issue_num" min-width="90"></el-table-column>
              <el-table-column label="本次发料" prop="this_num" min-width="140" v-if="status != 3">
                <template #default="{ row, $index }">
                  <el-input-number
                    style="width: 100%"
                    v-model="row.this_num"
                    :min="row.rec_num - row.issue_num == 0 ? 0 : 1"
                    :max="row.rec_num - row.issue_num"
                    @blur="changeNum($event, row)"
                    :disabled="!row.is_can_issuance || row.is_have_unique"
                    v-if="checkAssocType(assoc_type, 5) && status != 3"
                  />
                  <span v-else>{{ row.this_num }}</span>
                </template>
              </el-table-column>
            </template>
            <!-- <el-table-column
              label="已领数量"
              prop="received_num"
              v-if="assoc_type != 5"
            ></el-table-column> -->
            <el-table-column
              label="已领数量"
              min-width="90"
              prop="received_num"
              v-if="!checkAssocType(assoc_type, [5, 6])"
            ></el-table-column>
            <template v-if="checkAssocType(assoc_type, 8)">
              <el-table-column
                min-width="90"
                label="本次领料"
                prop="this_wait_received_num"
              ></el-table-column>
            </template>
            <el-table-column label="入库日期" min-width="90" prop="in_wh_date" />
            <el-table-column label="库位" prop="ws_code" min-width="90" />
            <el-table-column label="生产日期" prop="pro_time" min-width="90" />
            <el-table-column label="到期日期" prop="exp_time" min-width="90" />
            <el-table-column label="发料状态" prop="issuance_status" min-width="90">
              <template #default="{ row, $index }">
                <span v-if="row.issuance_status == 1">部分发料</span>
                <span v-else-if="row.issuance_status == 2">全部发料</span>
                <span v-else>待发料</span>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="note"></el-table-column>
          </el-table>
          <!-- </div> -->

          <div class="mt-[20px]">
            <div>
              <span>备注：</span>
              <span class="text-primary">{{ note || "无" }}</span>
            </div>
            <div class="no-print flex items-center text-primary">
              <span>附件：</span>
              <look-file v-if="file_info.src" :file_info="file_info"></look-file>
              <span v-else>无</span>
            </div>
          </div>
        </div>
        <!-- 单据日志 -->
        <div v-show="currentIndex == 1" class="no-print">
          <el-table
            :data="logData"
            border
            stripe
            style="width: 50%"
            :cell-style="{ 'text-align': 'center' }"
            :header-cell-style="{ 'text-align': 'center' }"
            height="560"
          >
            <el-table-column label="操作人" prop="ct_name" />
            <el-table-column label="操作类型">
              <template #default="{ row, $index }">
                <span>{{ row.act }}</span>
                <span v-if="row.act_msg">：{{ row.act_msg }}</span>
              </template>
            </el-table-column>
            <el-table-column label="时间" prop="create_time" />
          </el-table>
        </div>
      </div>
      <div class="footer-btn pb-[10px]">
        <el-divider />
        <div class="flex justify-between">
          <el-button class="w-[100px]" type="primary" size="large" plain @click="handleBack">
            返回
          </el-button>
          <div>
            <!-- <el-button class="w-[100px]" type="primary" size="large" @click="tapTest">测试按钮</el-button> -->
            <!-- 当前为创建人 -->
            <template v-if="is_ct_user == 1">
              <!-- 待提审,已撤回,已驳回状态时 -->
              <template v-if="status == 0 || status == 4 || status == 5">
                <el-button
                  class="w-[100px]"
                  size="large"
                  @click="handleEdit"
                  v-hasPerm="['sto:getsup:edit']"
                >
                  编辑
                </el-button>
                <el-button
                  type="primary"
                  class="w-[100px]"
                  @click="cellSubmitAudit"
                  v-hasPerm="['sto:getsup:submit']"
                >
                  提交审核
                </el-button>
                <el-button
                  class="w-[100px]"
                  size="large"
                  @click="handleVoid"
                  v-hasPerm="['sto:getsup:void']"
                >
                  作废
                </el-button>
              </template>
              <!-- 待审核和待领料状态时 -->
              <template v-else-if="status == 1 || status == 8">
                <template v-if="!is_part_issue">
                  <el-button
                    class="w-[100px]"
                    size="large"
                    @click="cellRecall"
                    v-hasPerm="['sto:getsup:recall']"
                  >
                    撤回
                  </el-button>
                </template>
              </template>
              <!-- 已作废状态时 -->
              <template v-else-if="status == 6">
                <el-button
                  class="w-[100px]"
                  size="large"
                  @click="cellDel"
                  v-hasPerm="['sto:getsup:del']"
                >
                  删除
                </el-button>
              </template>
            </template>
            <!-- 当前为审核人的时候 -->
            <!-- <template v-if="assoc_type == 2"> -->
            <template v-if="checkAssocType(assoc_type, 2)">
              <template v-if="status == 1">
                <el-button
                  class="w-[100px]"
                  type="success"
                  size="large"
                  @click="cellApprove"
                  v-hasPerm="['sto:getsup:approve']"
                >
                  通过
                </el-button>
                <el-button
                  class="w-[100px]"
                  type="warning"
                  size="large"
                  @click="cellReject"
                  v-hasPerm="['sto:getsup:reject']"
                >
                  驳回
                </el-button>
              </template>
            </template>
            <!-- 当前为仓库确认人的时候 -->
            <!-- <template v-if="assoc_type == 5"> -->
            <template v-if="checkAssocType(assoc_type, 5)">
              <!-- 待领料状态时 -->
              <template v-if="status == 8">
                <el-button
                  class="w-[100px]"
                  type="success"
                  size="large"
                  @click="handleGive"
                  v-hasPerm="['sto:getsup:whapprove']"
                >
                  仓库发料
                </el-button>
                <el-button
                  class="w-[100px]"
                  type="warning"
                  size="large"
                  @click="cellwhReject"
                  v-hasPerm="['sto:getsup:whreject']"
                >
                  仓库驳回
                </el-button>
              </template>
            </template>
            <!-- 当前身份是已发料且单据状态为10时 -->

            <template v-if="checkAssocType(assoc_type, 6) && status == 10">
              <el-button class="w-[100px]" plain size="large" @click="handleShowMa">
                <template #icon>
                  <svg-icon icon-class="erweima"></svg-icon>
                </template>
                领取码
              </el-button>
              <el-button
                class="w-[100px]"
                type="warning"
                size="large"
                v-hasPerm="['sto:getsup:giverecall']"
                @click="handleRecallGive"
              >
                发料撤回
              </el-button>
            </template>
            <!-- 当前是领料人且单据状态为10时 -->
            <template v-if="checkAssocType(assoc_type, 8) && status == 10">
              <el-button
                class="w-[100px]"
                type="primary"
                size="large"
                v-hasPerm="['sto:getsup:receive']"
                @click="clickConfirmReceive"
              >
                确认领取
              </el-button>
            </template>
            <!-- 当前是制单人且存在部分领料,且状态不为3时 -->
            <template v-if="is_ct_user == 1 && is_have_received == 1 && status != 3">
              <el-button
                class="w-[100px]"
                type="warning"
                size="large"
                v-hasPerm="['sto:getsup:over']"
                @click="handleOver"
              >
                领料完结
              </el-button>
            </template>
          </div>
        </div>
      </div>
      <div class="mt-[20px]">
        <el-divider />
        <!-- 流程组件 -->
        <assignFlow
          :id="listId"
          :type="3"
          :warehouseIds="goodsWarehouseId"
          :status="status"
          ref="assignFlowRef"
          :is_force_receive="is_force_receive"
        ></assignFlow>
      </div>
    </div>
    <CardHint :msg="errMsg" title="领料出库单详情" @back="handleBack" v-else></CardHint>
    <print v-model:visible="printVisible" :printInfo="printInfo"></print>
    <confirmGive
      v-model:visible="confirmGiveVisible"
      :listId="listId"
      :data="giveData"
      @confirmGive="handleConfirmGive"
      :qrcodeUrl="receive_qrcode_url"
    ></confirmGive>
    <giveDetail :id="rowId" v-model:visible="giveDetailVisible"></giveDetail>
    <confirmReceive
      v-if="receiveVisible"
      v-model:visible="receiveVisible"
      :listId="listId"
      :data="receiveData"
      @confirmReceive="handleConfirmReceive"
    ></confirmReceive>
    <qrcode v-model:visible="qrcodeVisible" :qrcode-url="receive_qrcode_url"></qrcode>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-table__body .el-checkbox__inner) {
  width: 20px;
  height: 20px;
}

/* 如果需要调整选中后勾选框里的对勾大小 */
:deep(.el-table__body .el-checkbox__input.is-checked .el-checkbox__inner::after) {
  left: 7px;
  top: 4px;
}
.print-area {
  .print-header {
    // margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: -6px;
    .header-left-top {
      margin-bottom: 10px;
    }
    .header-left-bottom {
      display: inline-block;
      margin-right: 20px;
    }
    .header-right {
      display: flex;
      align-items: center;
      .code-status {
        font-weight: bold;
        display: inline-block;
        margin-right: 20px;
      }
      .code-img {
        height: 80px;
      }
    }
  }
}
</style>
