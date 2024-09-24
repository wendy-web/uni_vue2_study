<script setup lang="ts">
// 调拨单详情页
import { ElLoading } from "element-plus";
import printJS from "print-js";
import { hiprint } from "vue-plugin-hiprint";
import { useRoute, useRouter } from "vue-router";
// 引入api
import {
  approveRllotApi,
  approveRllotWhApi,
  delRllotApi,
  detailRllotApi,
  recallRllotApi,
  rejectRllotApi,
  rejectRllotWhApi,
  submitRllotApi,
  voidRllotApi,
} from "@/api/storage/allot";
// 引入表格类型
import { AllotActlog, AllotGoods } from "@/api/storage/allot/types";
import { formartDate } from "@/utils/validate";
// 导入条形码组件
import Barcode from "@/components/Barcode/index.vue";
import CardHint from "@/components/CardHint/index.vue";
// 导入查看文件组件
import LookFile from "@/components/LookFile/index.vue";
import TabsHeader from "@/components/TabsHeader/index.vue";
import { useTagsViewStore } from "@/store/modules/tagsView";
// 引入审批流程自定义组件
import ApproveFlow from "./components/ApproveFlow.vue";
import moban from "./utils/moban.json";

hiprint.init();

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
  "待确认" = 8,
  "已确认" = 9,
}

const state = reactive({
  listId: 0,
  assoc_type: 0,
  theadList: [
    "货品条码",
    "名称",
    "规格型号",
    "品牌",
    "分类",
    "批次/日期",
    "单位",
    "调拨数量",
    "库位",
    "单价",
    "入库日期",
    "备注",
  ],
  tableData: [] as AllotGoods[], //采购单详情,原始信息
  logData: [] as AllotActlog[], //单据日志

  activeName: "tab-1",
  tabList: ["调拨单详情", "单据日志"],
  currentIndex: 0,
  // `````````````
  wh_tra_no: "", //采购单号
  ct_name: "", //制单人
  create_time: "", //创建时间
  all_price: "", //合计总价
  out_wh_name: "", //调出仓库名称
  to_wh_name: "", //调入仓库
  out_wh_id: 0,
  to_wh_id: 0,
  out_time: "",
  in_time: "",
  file_info: {
    //附件信息
    src: "",
    name: "",
  },
  status: 0, //状态0待提审,1待审核,2待入库,3已完成,4已撤回,5已驳回,6已作废
  note: "", //总备注
  loading: false, //加载状态
});

const {
  listId,
  assoc_type,
  tableData,
  logData,
  theadList,
  tabList,
  currentIndex,
  // ``````````
  wh_tra_no,
  ct_name,
  create_time,
  all_price,
  file_info,
  note,
  status,
  loading,
  out_wh_name,
  to_wh_name,
  out_time,
  in_time,
  out_wh_id,
  to_wh_id,
} = toRefs(state);
const errMsg = ref("暂无数据");

const handlePrint = () => {
  let orderNote = note.value || "";

  let printData = {
    table_title: "调拨单",
    barcode: wh_tra_no.value,
    table_no: "调拨单号:",
    table_username: `制单人:${ct_name.value}`,
    out_wh_name: `调出仓库:${out_wh_name.value}`,
    out_time: `调出日期:${out_time.value}`,
    to_wh_name: `调入仓库:${to_wh_name.value}`,
    in_time: `调入日期:${in_time.value}`,
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

// const handlePrint = () => {
//   const loading = ElLoading.service({
//     lock: true,
//     text: "正在启动打印服务",
//   });
//   if (currentIndex.value != 0) {
//     // 如果当前不是在采购单详情
//     currentIndex.value = 0;
//   }
//   /*
//       设置了 .no-print 类名的元素,在打印时不显示
//       设置表格td元素的字体大小为12px
//     */
//   const style = `@media print {.no-print {display: none !important;td{font-size:12px !important;}}}`;

//   // 解决打印对话框关闭后执行的回调函数触发问题
//   // let focuser = setInterval(() => window.dispatchEvent(new Event("focus")), 500);

//   setTimeout(() => {
//     printJS({
//       printable: "print-area",
//       type: "html",
//       targetStyles: ["*"],
//       style: style,
//       honorColor: false,
//       font_size: "", //解决td{font-size:12px无效问题
//       onPrintDialogClose: function () {
//         // 在浏览器打印对话框关闭后执行的回调函数。
//         // clearInterval(focuser);
//         console.log("我关闭了");
//       },
//     });
//     loading.close();
//   }, 100);
// };

// 请求数据
const getData = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "正在加载",
    background: "rgba(0, 0, 0, 0.1)",
  });

  try {
    loading.value = false;
    const result = await detailRllotApi({ id: listId.value });
    let res = result.data;
    wh_tra_no.value = res.wh_tra_no;
    ct_name.value = res.ct_name;
    create_time.value = res.create_time;

    file_info.value = res.file_info || file_info.value;
    note.value = res.note;
    status.value = res.status;

    out_wh_name.value = res.out_wh_name;
    to_wh_name.value = res.to_wh_name;
    out_wh_id.value = res.out_wh_id;
    to_wh_id.value = res.to_wh_id;
    // out_time.value = res.out_time;
    // in_time.value = res.in_time;
    out_time.value = formartDate(res.out_time);
    in_time.value = formartDate(res.in_time);
    tableData.value = res.goods;
    logData.value = res.act_log;
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
    path: "/storage/allot",
  });
  tagsViewStore.delView(route);
};

// 点击编辑按钮
const handleEdit = () => {
  router.push({
    path: "/storage/allot/add",
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
    const result = await submitRllotApi({ id: listId.value });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击撤回
const cellRecall = async () => {
  try {
    const result = await recallRllotApi({ id: listId.value });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击作废
const handleVoid = () => {
  console.log("点击作废", listId.value);
  ElMessageBox.confirm(`您确定要作废该调拨单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      try {
        let result = await voidRllotApi({ id: listId.value });
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
  ElMessageBox.confirm(`您确定要删除该调拨单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      let result = await delRllotApi({ id: listId.value });
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
    const result = await approveRllotApi({ id: listId.value });
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
      console.log(value);
      if (value) {
        let data = {
          reason: value,
          id: listId.value,
        };
        try {
          const result = await rejectRllotApi(data);
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
const cellwhApprove = async (type: number) => {
  let id = listId.value;
  let date = type === 1 ? out_time.value : in_time.value;
  const title = type === 1 ? "您确定要调出吗" : "您确定要调入吗";
  const labelText = type === 1 ? "调出时间:" : "调入时间:";
  const buttonText = type === 1 ? "确定调出" : "确定调入";
  const elDate = h(ElDatePicker, {
    style: {
      marginLeft: "10px",
    },
    modelValue: date,
    type: "date",
    placeholder: "请选择调出时间",
    format: "YYYY-MM-DD",
    valueFormat: "YYYY-MM-DD",
    clearable: false,
    "onUpdate:modelValue": (value: string) => {
      console.log("value", value);
      elDate.component!.props.modelValue = value;
      date = value;
    },
  });
  ElMessageBox({
    title: title,
    message: h("p", null, [h("span", null, labelText), elDate]),
    showCancelButton: true,
    confirmButtonText: buttonText,
    cancelButtonText: "取消",
    closeOnClickModal: false,
    draggable: true,
  }).then(async () => {
    let data = type === 1 ? { out_time: date, id } : { in_time: date, id };
    const result = await approveRllotWhApi(data);
    ElMessage.success(result.msg);
    getData();
  });
};

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
      console.log(value);
      value = value.trim();
      if (value) {
        let data = {
          reason: value,
          id: listId.value,
        };
        try {
          const result = await rejectRllotWhApi(data);
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
  return EStatus[status.value];
});

watch(
  () => route,
  (newValue, oldValue) => {
    if (newValue.path !== oldValue?.path) {
      listId.value = newValue.query.id ? Number(newValue.query.id) : 0;
      assoc_type.value = Number(route.query.assoc_type);
      getData();
    }
  },
  { immediate: true },
);
</script>
<template>
  <div class="app-container">
    <div class="app-card" v-if="loading">
      <div class="header-title flex justify-between">
        <span>调拨单详情</span>
        <div class="print-btn cursor-pointer" @click="handlePrint">
          <svg-icon icon-class="print"></svg-icon>
          <span class="inline-block ml-[4px]">打印单据</span>
        </div>
      </div>
      <div class="print-area" id="print-area">
        <div class="print-header">
          <div class="header-left">
            <div class="mb-[10px]">
              <div class="header-left-bottom">
                <span>调拨单号：</span>
                <span>{{ wh_tra_no }}</span>
              </div>
              <div class="header-left-bottom">
                <span>制单人：</span>
                <span>{{ ct_name }}</span>
              </div>
              <div class="header-left-bottom">
                <span>创建时间：</span>
                <span>{{ create_time }}</span>
              </div>
            </div>
            <div>
              <div class="header-left-bottom mr-[20px]">
                <span>调出仓库：</span>
                <span class="font-bold">{{ out_wh_name }}</span>
              </div>
              <span class="header-left-bottom">调出日期：{{ out_time }}</span>
              <div class="header-left-bottom header-left-bottommr-[20px]">
                <span>调入仓库：</span>
                <span class="font-bold">{{ to_wh_name }}</span>
              </div>
              <span class="header-left-bottom">调入日期：{{ in_time }}</span>
            </div>
          </div>
          <div class="header-right">
            <span class="code-status">{{ orderStatus }}</span>
            <barcode :value="wh_tra_no" v-if="wh_tra_no"></barcode>
          </div>
        </div>
        <tabs-header :tab-list="tabList" v-model="currentIndex"></tabs-header>
        <!-- 调拨单详情 -->
        <div v-show="currentIndex == 0">
          <!-- <div class="table-container"> -->
          <div>
            <!-- <table cellspacing="0" cellpadding="0" border="0">
              <thead>
                <tr>
                  <td v-for="(item, index) in theadList">{{ item }}</td>
                </tr>
              </thead>
              <tbody v-if="tableData.length">
                <tr v-for="(item, index) in tableData" style="page-break-inside: avoid">
                  <td>{{ item.barcode }}</td>
                  <td>{{ item.title }}</td>
                  <td>{{ item.spec }}</td>
                  <td>{{ item.brand }}</td>
                  <td>{{ item.class_name }}</td>
                  <td>{{ item.ph_no }}</td>
                  <td>{{ item.measure_name }}</td>
                  <td>{{ item.rec_num }}</td>
                  <td>{{ item.ws_code }}</td>
                  <td>{{ item.price }}</td>
                  <td>{{ item.in_wh_date }}</td>
                  <td :style="[index == 13 ? 'page-break-after:always' : '']">
                    {{ item.note }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="!tableData.length" class="table-empty">
              <span class="table-empty-text">暂无数据</span>
            </div> -->
            <el-table :data="tableData" border stripe height="580" scrollbar-always-on>
              <el-table-column label="#" type="index" />
              <el-table-column label="货品条码" prop="barcode" />
              <el-table-column label="名称" prop="title" />
              <el-table-column label="规格型号" prop="spec" />
              <el-table-column label="品牌" prop="brand" />
              <el-table-column label="分类" prop="class_name" />
              <el-table-column label="批次/日期" prop="ph_no" />
              <el-table-column label="单位" prop="measure_name" />
              <el-table-column label="调拨数量" prop="rec_num" />
              <el-table-column label="库位" prop="ws_code" />
              <el-table-column label="单价" prop="price" />
              <el-table-column label="入库日期" prop="in_wh_date" />
              <el-table-column label="备注" prop="note" />
            </el-table>
            <div class="mt-[20px]">
              <div>
                <span>备注：{{ note || "无" }}</span>
              </div>
              <div class="no-print flex items-center">
                <span>附件：</span>
                <look-file v-if="file_info.src" :file_info="file_info"></look-file>
                <span v-else>无</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 单据日志 -->
        <div v-show="currentIndex == 1" class="no-print">
          <el-table :data="logData" border stripe style="width: 50%" height="660">
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
      <div class="footer-btn mt-[20px]">
        <el-divider />
        <el-button class="w-[100px]" @click="handleBack" size="large">返回</el-button>
        <!-- 当前为创建人 -->
        <template v-if="assoc_type == 1">
          <!-- 待提审,已撤回,已驳回状态时 -->
          <template v-if="status == 0 || status == 4 || status == 5">
            <el-button
              class="w-[100px]"
              size="large"
              @click="handleEdit"
              v-hasPerm="['sto:allot:edit']"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              class="w-[100px]"
              size="large"
              @click="cellSubmitAudit"
              v-hasPerm="['sto:allot:submit']"
            >
              提交审核
            </el-button>
            <el-button
              class="w-[100px]"
              size="large"
              @click="handleVoid"
              v-hasPerm="['sto:allot:void']"
            >
              作废
            </el-button>
          </template>
          <!-- 待审核状态时 -->
          <template v-else-if="status == 1">
            <el-button
              class="w-[100px]"
              size="large"
              @click="cellRecall"
              v-hasPerm="['sto:allot:recall']"
            >
              撤回
            </el-button>
          </template>
          <!-- 已撤回,已驳回状态时 -->
          <!-- <template v-else-if="status == 4 || status == 5">
          <el-button class="w-[100px]" size="large" @click="handleVoid"
            >作废</el-button
          >
        </template> -->
          <!-- 已作废状态时 -->
          <template v-else-if="status == 6">
            <el-button
              class="w-[100px]"
              size="large"
              @click="cellDel"
              v-hasPerm="['sto:allot:del']"
            >
              删除
            </el-button>
          </template>
        </template>
        <!-- 当前为审核人的时候 -->
        <template v-if="assoc_type == 2">
          <template v-if="status == 1">
            <el-button
              class="w-[100px]"
              type="success"
              size="large"
              @click="cellApprove"
              v-hasPerm="['sto:allot:approve']"
            >
              通过
            </el-button>
            <el-button
              class="w-[100px]"
              type="warning"
              size="large"
              @click="cellReject"
              v-hasPerm="['sto:allot:reject']"
            >
              驳回
            </el-button>
          </template>
        </template>
        <!-- 当前为调出仓库待确认的时候 -->
        <template v-if="assoc_type == 5">
          <!-- 待确认状态时 -->
          <template v-if="status == 8">
            <el-button
              class="w-[100px]"
              type="success"
              size="large"
              @click="cellwhApprove(1)"
              v-hasPerm="['sto:allot:whapprove']"
            >
              调出确认
            </el-button>
            <el-button
              class="w-[100px]"
              type="warning"
              size="large"
              @click="cellwhReject"
              v-hasPerm="['sto:allot:whreject']"
            >
              仓库驳回
            </el-button>
          </template>
        </template>
        <template v-if="assoc_type == 8">
          <!-- 待确认状态时 -->
          <template v-if="status == 9">
            <el-button
              class="w-[100px]"
              type="success"
              size="large"
              @click="cellwhApprove(2)"
              v-hasPerm="['sto:allot:whapprove']"
            >
              调入确认
            </el-button>
            <el-button
              class="w-[100px]"
              type="warning"
              size="large"
              @click="cellwhReject"
              v-hasPerm="['sto:allot:whreject']"
            >
              仓库驳回
            </el-button>
          </template>
        </template>
      </div>
      <div class="mt-[20px] no-print">
        <el-divider />
        <!-- 流程组件 -->
        <ApproveFlow
          :id="listId"
          :outWhId="out_wh_id"
          :toWhId="to_wh_id"
          :type="3"
          :status="status"
        ></ApproveFlow>
        <el-divider />
      </div>
    </div>
    <CardHint :msg="errMsg" title="调拨单详情" @back="handleBack" v-else></CardHint>
  </div>
</template>

<style scoped lang="scss">
.print-area {
  .print-header {
    // margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: -6px;
    .header-left {
      margin-bottom: 10px;
    }
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
