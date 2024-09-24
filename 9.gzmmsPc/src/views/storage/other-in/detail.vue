<script setup lang="ts">
// 其他入库单详情页
import { ElLoading } from "element-plus";
import printJS from "print-js";
import { hiprint } from "vue-plugin-hiprint";
import { useRoute, useRouter } from "vue-router";
import {
  approveOtherInApi,
  approveOtherInWhApi,
  delOtherInApi,
  detailOtherInApi,
  recallOtherInApi,
  rejcetOtherInWhApi,
  rejectOtherInApi,
  submitOtherInApi,
  voidOtherInApi,
} from "@/api/storage/other-in";
import { checkAssocType, perms } from "@/utils/auth";
// 引入审批流程自定义组件
import ApproveFlowGlobal from "@/components/ApproveLog/ApproveFlowGlobal.vue";
// 导入条形码组件
import Barcode from "@/components/Barcode/index.vue";
import CardHint from "@/components/CardHint/index.vue";
// 导入查看文件组件
import LookFile from "@/components/LookFile/index.vue";
import { useTagsViewStore } from "@/store/modules/tagsView";
import moban from "./utils/ruku.json";

hiprint.init();

const route = useRoute();
const router = useRouter();
const tagsViewStore = useTagsViewStore();

enum EStatus {
  "待提审",
  "待审核",
  "待入库",
  "已完成",
  "已撤回",
  "已驳回",
  "已作废",
  "待入库确认",
}

const state = reactive({
  listId: 0,
  assoc_type: [] as number[],
  theadList: [
    "货品条码",
    "名称",
    "规格型号",
    "品牌",
    "入库数量",
    "供应商",
    // "需求部门",
    "单位",
    "单价(元)",
    "分类",
    "批次/日期",
    "备注",
  ],
  tableData: [] as any[], //其他单详情,原始信息
  logData: [] as any[], //单据日志
  tabList: ["入库单详情", "单据日志"],
  currentIndex: 0,
  wh_in_no: "", //其他入库单号
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
  in_wh_name: "", //入库仓库名
  in_wh_id: 0, // 入库仓库id
  in_time: "", //入库日期
  type: 0, //入库类型
  procure_no: "", //采购单号
});
const {
  listId,
  assoc_type,
  tableData,
  logData,
  theadList,
  tabList,
  currentIndex,
  wh_in_no,
  ct_name,
  create_time,
  file_info,
  note,
  status,
  loading,
  in_wh_name,
  in_wh_id,
  in_time,
  type,
  procure_no,
} = toRefs(state);
const errMsg = ref("暂无数据");

const handlePrint = () => {
  let orderNote = note.value || "";

  let printData = {
    table_title: "采购入库单",
    barcode: wh_in_no.value,
    table_no: "其他入库单号:",
    table_date: `制单日期:${create_time.value}`,
    table_username: `制单人:${ct_name.value}`,
    table_wh: `入库仓库:${in_wh_name.value}`,
    order_note: `单据备注:${orderNote}`,
    table: tableData.value,
  };
  let mobanColumnsList = moban.panels[0].printElements[7].options.columns ?? [];
  console.log("🚀 ~ handlePrint ~ mobanColumnsList:", mobanColumnsList);
  mobanColumnsList[0].forEach((item) => {
    if (item.field == "price") {
      let permsRes = perms(["sto:otherin:add", "sto:otherin:edit"]);
      item.checked = permsRes;
    }
  });
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
//     // 如果当前不是在其他单详情
//     currentIndex.value = 0;
//   }
//   const style = `@media print {.no-print {display: none !important;td{font-size:12px !important;}}}`;
//   setTimeout(() => {
//     printJS({
//       printable: "print-area",
//       type: "html",
//       targetStyles: ["*"],
//       style: style,
//       honorColor: false,
//       font_size: "", //解决td{font-size:12px无效问题
//       onPrintDialogClose: function () {
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
    const result = await detailOtherInApi({ id: listId.value });
    let res = result.data;
    in_time.value = res.in_time;
    in_wh_name.value = res.in_wh_name;
    in_wh_id.value = res.in_wh_id;
    wh_in_no.value = res.wh_in_no;
    ct_name.value = res.ct_name;
    create_time.value = res.create_time;
    file_info.value = res.file_info;
    note.value = res.note;
    status.value = res.status;
    tableData.value = res.goods;
    logData.value = res.act_log;
    type.value = res.type;
    procure_no.value = res.procure_no;
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
    path: "/storage/other-in",
  });
  tagsViewStore.delView(route);
};

// 点击编辑按钮
const handleEdit = () => {
  router.push({
    path: "/storage/other-in/add",
    query: {
      editFrom: 2,
      id: listId.value,
    },
  });
};

// 单元格点击提审
const cellSubmitAudit = async () => {
  console.log("点击提审");
  const result = await submitOtherInApi({ id: listId.value });
  ElMessage.success(result.msg);
  getData();
};

// 单元格点击撤回
const cellRecall = async () => {
  const result = await recallOtherInApi({ id: listId.value });
  ElMessage.success(result.msg);
  getData();
};

// 单元格点击作废
const handleVoid = () => {
  console.log("点击作废", listId.value);
  ElMessageBox.confirm(`您确定要作废该其他入库单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    console.log("点击了 确定");
    let result = await voidOtherInApi({ id: listId.value });
    ElMessage.success(result.msg);
    getData();
  });
};

// 单元格点击删除
const cellDel = () => {
  ElMessageBox.confirm(`您确定要删除该其他入库单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    console.log("点击了 确定");
    let result = await delOtherInApi({ id: listId.value });
    ElMessage.success(result.msg);
    handleBack();
  });
};

// 单元格点击通过
const cellApprove = async () => {
  console.log("点击通过", listId.value);
  const result = await approveOtherInApi({ id: listId.value });
  ElMessage.success(result.msg);
  getData();
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
  }).then(async ({ value }) => {
    value = value.trim();
    if (value) {
      let data = {
        reason: value,
        id: listId.value,
      };
      const result = await rejectOtherInApi(data);
      ElMessage.success(result.msg);
      getData();
    }
  });
};

const cellwhApprove = () => {
  console.log("点击仓库确认");
  let date = in_time.value;
  const elDate = h(ElDatePicker, {
    style: {
      marginLeft: "10px",
    },
    modelValue: date,
    type: "date",
    placeholder: "请确认入库时间",
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
    title: "请确认入库日期",
    message: h("p", null, [h("span", null, "入库日期"), elDate]),
    showCancelButton: true,
    confirmButtonText: "入库确认",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    draggable: true,
  }).then(async () => {
    let data = { in_time: date, id: listId.value };
    const result = await approveOtherInWhApi(data);
    ElMessage.success(result.msg);
    getData();
  });
};

const cellwhReject = () => {
  console.log("点击仓库驳回");
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
  }).then(async ({ value }) => {
    value = value.trim();
    if (value) {
      let data = {
        reason: value,
        id: listId.value,
      };
      const result = await rejcetOtherInWhApi(data);
      ElMessage.success(result.msg);
      getData();
    }
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
        <span>其他入库单详情</span>
        <div class="print-btn cursor-pointer" @click="handlePrint">
          <svg-icon icon-class="print"></svg-icon>
          <span class="inline-block ml-[4px]">打印单据</span>
        </div>
      </div>
      <div class="print-area" id="print-area">
        <div class="print-header">
          <div class="header-left">
            <div class="mb-2">
              <div class="header-left-bottom">
                <span>其他入库单号：</span>
                <span>{{ wh_in_no }}</span>
              </div>
              <div class="header-left-bottom">
                <span>入库类型：</span>
                <span>{{ type === 1 ? "冲销入库" : "其他入库" }}</span>
              </div>
              <div class="header-left-bottom" v-if="type === 1">
                <span>采购单号：</span>
                <span>{{ procure_no }}</span>
              </div>
            </div>
            <div class="header-left-bottom">
              <span>制单人：</span>
              <span>{{ ct_name }}</span>
            </div>
            <div class="header-left-bottom">
              <span>入库仓库：</span>
              <span>{{ in_wh_name }}</span>
            </div>
            <div class="header-left-bottom">
              <span>入库日期：</span>
              <span>{{ in_time }}</span>
            </div>
            <div class="header-left-bottom">
              <span>创建时间：</span>
              <span>{{ create_time }}</span>
            </div>
          </div>
          <div class="header-right">
            <span class="code-status">{{ orderStatus }}</span>
            <barcode :value="wh_in_no" v-if="wh_in_no"></barcode>
          </div>
        </div>
        <tabs-header :tab-list="tabList" v-model="currentIndex"></tabs-header>
        <!-- 其他入库单详情 -->
        <div v-show="currentIndex == 0">
          <!-- <div class="table-container"> -->
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
                  <td>{{ item.in_num }}</td>
                  <td>{{ item.sup_name }}</td>
                  <td>{{ item.measure_name }}</td>
                  <td>{{ item.price }}</td>
                  <td>{{ item.class_name }}</td>
                  <td>{{ item.ph_no }}</td>
                  <td :style="[index == 13 ? 'page-break-after:always' : '']">
                    {{ item.note }}
                  </td>
                </tr>
              </tbody>
            </table> -->
          <!-- <div v-if="!tableData.length" class="table-empty">
              <span class="table-empty-text">暂无数据</span>
            </div> -->
          <el-table :data="tableData" border stripe height="600" scrollbar-always-on>
            <el-table-column label="#" type="index" />
            <el-table-column label="条码" prop="barcode" />
            <el-table-column label="名称" prop="title" />
            <el-table-column label="规格型号" prop="spec" />
            <el-table-column label="品牌" prop="brand" />
            <el-table-column label="入库数量" prop="in_num" />
            <el-table-column label="供应商" prop="sup_name" />
            <el-table-column label="单位" prop="measure_name" />
            <el-table-column
              label="单价(元)"
              prop="price"
              v-hasPerm="['sto:otherin:edit', 'sto:otherin:add']"
            />
            <el-table-column label="分类" prop="class_name" />
            <el-table-column label="库位" prop="ws_code" />
            <el-table-column label="生产日期" prop="pro_time" />
            <el-table-column label="保质期(天)" prop="exp_day" />
            <el-table-column label="到期日期" prop="exp_time" />
            <el-table-column label="备注" prop="note" />
          </el-table>

          <div class="mt-[20px]">
            <span>备注：{{ note || "无" }}</span>
            <div class="no-print flex items-center">
              <span>附件：</span>
              <look-file v-if="file_info.src" :file_info="file_info"></look-file>
              <span v-else>无</span>
            </div>
          </div>
        </div>
        <!-- </div> -->
        <!-- 单据日志 -->
        <div v-show="currentIndex == 1" class="no-print">
          <el-table
            :data="logData"
            border
            stripe
            style="width: 50%"
            :cell-style="{ 'text-align': 'center' }"
            :header-cell-style="{ 'text-align': 'center' }"
            height="660"
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
        <div class="footer-btn mt-[20px]">
          <el-button class="w-[100px]" type="primary" plain @click="handleBack" size="large">
            返回
          </el-button>

          <!-- 当前为创建人 -->
          <template v-if="checkAssocType(assoc_type, 1)">
            <!-- 待提审,已撤回,已驳回状态时 -->
            <template v-if="status == 0 || status == 4 || status == 5">
              <el-button
                class="w-[100px]"
                @click="handleEdit"
                size="large"
                v-hasPerm="['sto:otherin:edit']"
              >
                编辑
              </el-button>
              <el-button
                type="primary"
                class="w-[100px]"
                @click="cellSubmitAudit"
                size="large"
                v-hasPerm="['sto:otherin:submit']"
              >
                提交审核
              </el-button>
              <el-button
                class="w-[100px]"
                @click="handleVoid"
                size="large"
                v-hasPerm="['sto:otherin:void']"
              >
                作废
              </el-button>
            </template>
            <!-- 待审核状态时 -->
            <template v-else-if="status == 1">
              <el-button
                class="w-[100px]"
                @click="cellRecall"
                size="large"
                v-hasPerm="['sto:otherin:recall']"
              >
                撤回
              </el-button>
            </template>

            <!-- 已作废状态时 -->
            <template v-else-if="status == 6">
              <el-button
                class="w-[100px]"
                @click="cellDel"
                size="large"
                v-hasPerm="['sto:buyin:del']"
              >
                删除
              </el-button>
            </template>
          </template>
          <!-- 当前为审核人的时候 -->
          <template v-if="checkAssocType(assoc_type, 2)">
            <!-- 待审核状态时 -->
            <template v-if="status == 1">
              <el-button
                class="w-[100px]"
                type="success"
                @click="cellApprove"
                size="large"
                v-hasPerm="['sto:otherin:approve']"
              >
                通过
              </el-button>
              <el-button
                class="w-[100px]"
                type="warning"
                @click="cellReject"
                size="large"
                v-hasPerm="['sto:otherin:reject']"
              >
                驳回
              </el-button>
            </template>
          </template>
          <!-- 当前为仓库确认人的时候 -->
          <template v-if="checkAssocType(assoc_type, 5)">
            <!-- 如果状态为待入库确认 -->
            <template v-if="status == 7">
              <el-button
                class="w-[100px]"
                type="success"
                size="large"
                @click="cellwhApprove"
                v-hasPerm="['sto:otherin:whapprove']"
              >
                入库确认
              </el-button>
              <el-button
                class="w-[100px]"
                type="warning"
                size="large"
                @click="cellwhReject"
                v-hasPerm="['sto:otherin:whreject']"
              >
                入库驳回
              </el-button>
            </template>
          </template>
        </div>
        <div class="mt-[20px] no-print">
          <el-divider />
          <!-- 流程组件 -->
          <ApproveFlowGlobal
            :id="listId"
            :wh-id="in_wh_id"
            :order-type="3"
            :pageType="3"
            :status="status"
          ></ApproveFlowGlobal>
        </div>
      </div>
    </div>
    <CardHint :msg="errMsg" title="其他入库单详情" @back="handleBack" v-else></CardHint>
  </div>
</template>
<style lang="scss" scoped>
.print-area {
  .print-header {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

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
