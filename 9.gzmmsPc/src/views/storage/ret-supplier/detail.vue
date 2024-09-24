<script setup lang="ts">
// 退料入库单详情页
import { ElLoading } from "element-plus";
import { useRoute, useRouter } from "vue-router";
// 导入API
import {
  approveRetSupInApi,
  approveRetSupInWhApi,
  delRetSupInApi,
  detailRetSupInApi,
  recallRetSupInApi,
  rejectRetSupInApi,
  rejectRetSupInWhApi,
  submitRetSupInApi,
  voidRetSupInApi,
} from "@/api/storage/ret-supplier";
import { IRetSupInActlog, IRetSupInGoods } from "@/api/storage/ret-supplier/types";
// 导入条形码组件
import Barcode from "@/components/Barcode/index.vue";
import CardHint from "@/components/CardHint/index.vue";
// 导入查看文件组件
import LookFile from "@/components/LookFile/index.vue";
import TabsHeader from "@/components/TabsHeader/index.vue";
import { usePrint } from "@/hooks/print";
import { useTagsViewStore } from "@/store/modules/tagsView";
import { useOrderList } from "./utils/hook";

const route = useRoute();
const router = useRouter();
const tagsViewStore = useTagsViewStore();
const { printDetail } = usePrint();
const { checkAssocType } = useOrderList();

enum EStatus {
  "待提审",
  "待审核",
  "待入库",
  "已完成",
  "已撤回",
  "已驳回",
  "已作废",
}

const state = reactive({
  listId: 0,
  assoc_type: [] as number[],
  theadList: [
    "货品条码",
    "名称",
    "规格型号",
    "批次/日期",
    "入库仓库",
    "单位",
    "入库数量",
    "库位",
    "单价",
    "入库日期",
    "退料状态",
    "备注",
  ],
  tableData: [] as IRetSupInGoods[], //
  logData: [] as IRetSupInActlog[], //单据日志

  activeName: "tab-1",
  tabList: ["退料入库单详情", "单据日志"],
  currentIndex: 0,
  // `````````````
  wh_recin_no: "", //退料入库单号
  wh_rec_no: "", // 领料出库单号
  ct_name: "", //制单人
  create_time: "", //创建时间
  all_price: "", //合计总价
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
  wh_recin_no,
  wh_rec_no,
  ct_name,
  create_time,
  all_price,
  file_info,
  note,
  status,
  loading,
} = toRefs(state);
const errMsg = ref("暂无数据");

const handlePrint = () => {
  let printData = {
    orderNo: `退料入库单号：${wh_recin_no.value}`,
    date: `领料出库单号：${wh_rec_no.value}`,
    ctName: `创建人：${ct_name.value}`,
    ctTime: `创建时间：${create_time.value}`,
    detailName: "退料入库单详情",
    barcode: wh_recin_no.value,
    table: tableData.value,
  };
  printDetail(printData, "retSup");
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
    const result = await detailRetSupInApi({ id: listId.value });
    let res = result.data;
    wh_recin_no.value = res.wh_recin_no;
    wh_rec_no.value = res.wh_rec_no;
    assoc_type.value = res.assoc_type;
    ct_name.value = res.ct_name;
    create_time.value = res.create_time;
    file_info.value = res.file_info || file_info.value;

    note.value = res.note;
    status.value = res.status;
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
    path: "/storage/ret-supplier",
  });
  tagsViewStore.delView(route);
};

// 点击编辑按钮
const handleEdit = () => {
  router.push({
    path: "/storage/ret-supplier/add",
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
    const result = await submitRetSupInApi({ id: listId.value });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击撤回
const cellRecall = async () => {
  try {
    const result = await recallRetSupInApi({ id: listId.value });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击作废
const handleVoid = () => {
  console.log("点击作废", listId.value);
  ElMessageBox.confirm(`您确定要作废该退料入库单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      try {
        let result = await voidRetSupInApi({ id: listId.value });
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
  ElMessageBox.confirm(`您确定要删除该退料入库单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      let result = await delRetSupInApi({ id: listId.value });
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
    const result = await approveRetSupInApi({ id: listId.value });
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
          const result = await rejectRetSupInApi(data);
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
const cellwhApprove = async () => {
  console.log("点击通过", listId.value);
  try {
    const result = await approveRetSupInWhApi({ id: listId.value });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
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
      value = value.trim();
      if (value) {
        let data = {
          reason: value,
          id: listId.value,
        };
        try {
          const result = await rejectRetSupInWhApi(data);
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
        <span>退料入库单详情</span>
        <div class="print-btn cursor-pointer" @click="handlePrint">
          <svg-icon icon-class="print"></svg-icon>
          <span class="inline-block ml-[4px]">打印单据</span>
        </div>
      </div>
      <div class="print-area" id="print-area">
        <div class="print-header">
          <div class="header-left">
            <div class="mb-[10px]">
              <div class="header-left-bottom text-primary">
                <span>退料入库单号：</span>
                <span>{{ wh_recin_no }}</span>
              </div>
              <div class="header-left-bottom text-primary">
                <span>领料出库单号：</span>
                <span>{{ wh_rec_no }}</span>
              </div>
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
          <div class="header-right">
            <span class="code-status">{{ orderStatus }}</span>
            <!-- <img src="@/assets/img/barcode.png" alt="" class="code-img" /> -->
            <barcode :value="wh_recin_no" v-if="wh_recin_no"></barcode>
          </div>
        </div>
        <tabs-header :tab-list="tabList" v-model="currentIndex"></tabs-header>
        <!-- 退料入库单详情 -->
        <div v-show="currentIndex == 0">
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
                  <td>{{ item.ph_no }}</td>
                  <td>{{ item.warehouse_name }}</td>
                  <td>{{ item.measure_name }}</td>
                  <td>{{ item.rec_num }}</td>
                  <td>{{ item.ws_code }}</td>
                  <td>{{ item.price }}</td>
                  <td>{{ item.in_wh_date }}</td>
                  <td>
                    <span v-if="item.warehouse_confirm == 0">-</span>
                    <span v-if="item.warehouse_confirm == 1">已确认</span>
                    <span v-if="item.warehouse_confirm == 2">已驳回</span>
                  </td>
                  <td :style="[index == 13 ? 'page-break-after:always' : '']">
                    {{ item.note }}
                  </td>
                </tr>
              </tbody>
            </table> -->
          <!-- <div v-if="!tableData.length" class="table-empty">
            <span class="table-empty-text">暂无数据</span>
          </div> -->
          <el-table :data="tableData" border stripe height="840" scrollbar-always-on>
            <el-table-column label="#" type="index" />
            <el-table-column label="货品条码" prop="barcode" />
            <el-table-column label="名称" prop="title" />
            <el-table-column label="规格型号" prop="spec" />
            <el-table-column label="批次/日期" prop="ph_no" />
            <el-table-column label="入库仓库" prop="warehouse_name" />
            <el-table-column label="单位" prop="measure_name" />
            <el-table-column label="入库数量" prop="rec_num" />
            <el-table-column label="库位" prop="ws_code" />
            <el-table-column label="单价" prop="price" />
            <el-table-column label="入库日期" prop="in_wh_date" />
            <el-table-column label="退料状态" prop="warehouse_confirm">
              <template #default="scope">
                <span v-if="scope.row.warehouse_confirm == 0">-</span>
                <span v-if="scope.row.warehouse_confirm == 1">已确认</span>
                <span v-if="scope.row.warehouse_confirm == 2">已驳回</span>
              </template>
            </el-table-column>
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
        <el-table
          :data="logData"
          border
          stripe
          style="width: 50%"
          :cell-style="{ 'text-align': 'center' }"
          :header-cell-style="{ 'text-align': 'center' }"
          height="900"
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
      <div class="footer-btn mt-[20px] pb-[10px]">
        <el-button class="w-[100px]" @click="handleBack" size="large">返回</el-button>

        <!-- 当前为创建人 -->
        <template v-if="checkAssocType(assoc_type, 1)">
          <!-- 待提审,已撤回,已驳回状态时 -->
          <template v-if="status == 0 || status == 4 || status == 5">
            <el-button
              class="w-[100px]"
              size="large"
              @click="handleEdit"
              v-hasPerm="['sto:retsupin:edit']"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              class="w-[100px]"
              size="large"
              @click="cellSubmitAudit"
              v-hasPerm="['sto:retsupin:submit']"
            >
              提交审核
            </el-button>
            <el-button
              class="w-[100px]"
              size="large"
              @click="handleVoid"
              v-hasPerm="['sto:retsupin:void']"
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
              v-hasPerm="['sto:retsupin:recall']"
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
              v-hasPerm="['sto:retsupin:del']"
            >
              删除
            </el-button>
          </template>
        </template>
        <!-- 当前为审核人的时候 -->
        <template v-if="checkAssocType(assoc_type, 2)">
          <template v-if="status == 1">
            <el-button
              class="w-[100px]"
              type="success"
              size="large"
              @click="cellApprove"
              v-hasPerm="['sto:retsupin:approve']"
            >
              通过
            </el-button>
            <el-button
              class="w-[100px]"
              type="warning"
              size="large"
              @click="cellReject"
              v-hasPerm="['sto:retsupin:reject']"
            >
              驳回
            </el-button>
          </template>
        </template>
        <template v-if="checkAssocType(assoc_type, 5)">
          <!-- 待领料状态时 -->
          <template v-if="status == 8">
            <el-button
              class="w-[100px]"
              type="success"
              size="large"
              @click="cellwhApprove"
              v-hasPerm="['sto:retsupin:whapprove']"
            >
              仓库确认
            </el-button>
            <el-button
              class="w-[100px]"
              type="warning"
              size="large"
              @click="cellwhReject"
              v-hasPerm="['sto:retsupin:whreject']"
            >
              仓库驳回
            </el-button>
          </template>
        </template>
      </div>
    </div>
    <CardHint :msg="errMsg" title="退料入库单详情" @back="handleBack" v-else></CardHint>
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
