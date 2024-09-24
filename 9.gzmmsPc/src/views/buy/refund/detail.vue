<!-- 采购退货单详情页 -->
<script setup lang="ts">
import { ElLoading } from "element-plus";
import printJS from "print-js";
import { useRoute, useRouter } from "vue-router";
// 引入获取采购单详情api
import {
  approveRefundApi,
  delRefundApi,
  detailRefundApi,
  recallRefundApi,
  rejectRefundApi,
  submitRefunApi,
  voidRefundApi,
} from "@/api/buy/refund";
// 引入表格类型
import { IRefundGoods } from "@/api/buy/refund/types";
// 导入条形码组件
import Barcode from "@/components/Barcode/index.vue";
import CardHint from "@/components/CardHint/index.vue";
// 导入查看文件组件
import LookFile from "@/components/LookFile/index.vue";
import TabsHeader from "@/components/TabsHeader/index.vue";
import { usePrint } from "@/hooks/print";
import { useTagsViewStore } from "@/store/modules/tagsView";

const route = useRoute();
const router = useRouter();
const tagsViewStore = useTagsViewStore();
const { printDetail } = usePrint();

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
  assoc_type: 0,
  theadList: ["货品条码", "名称", "规格型号", "单位", "退货数量", "供应商", "备注"],
  tableData: [] as IRefundGoods[], //采购单详情,原始信息
  logData: [], //单据日志

  activeName: "tab-1",
  tabList: ["采购退货单详情", "单据日志"],
  currentIndex: 0,
  // `````````````
  procure_no: "", //采购单号
  procure_ret_no: "", //采购退货单号
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
  procure_ret_no,
  procure_no,
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
    orderNo: `采购退货单号：${procure_ret_no.value}`,
    otherNo: `采购单号：${procure_no.value}`,
    ctName: `创建人：${ct_name.value}`,
    ctTime: `创建时间：${create_time.value}`,
    detailName: "采购退货单详情",
    barcode: procure_ret_no.value,
    table: tableData.value,
  };
  printDetail(printData, "refund");
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
    const result = await detailRefundApi({ id: listId.value });
    let res = result.data;
    procure_no.value = res.procure_no;
    procure_ret_no.value = res.procure_ret_no;
    ct_name.value = res.ct_name;
    create_time.value = res.create_time;
    all_price.value = res.all_price;
    file_info.value = res.file_info;
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
    path: "/buy/refund",
  });
  tagsViewStore.delView(route);
};

// 点击编辑按钮
const handleEdit = () => {
  router.push({
    path: "/buy/refund/add",
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
    const result = await submitRefunApi({ id: listId.value });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击撤回
const cellRecall = async () => {
  try {
    const result = await recallRefundApi({ id: listId.value });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击作废
const handleVoid = () => {
  console.log("点击作废", listId.value);
  ElMessageBox.confirm(`您确定要作废该采购退货单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      try {
        let result = await voidRefundApi({ id: listId.value });
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
  ElMessageBox.confirm(`您确定要删除该采购退货单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      let result = await delRefundApi({ id: listId.value });
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
    const result = await approveRefundApi({ id: listId.value });
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
          const result = await rejectRefundApi(data);
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

onMounted(() => {
  console.log("detail的assoc_type", assoc_type.value);
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
        <span>采购退货单详情</span>
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
                <span>采购退货单号：</span>
                <span>{{ procure_ret_no }}</span>
              </div>
              <div class="header-left-bottom">
                <span>采购单号：</span>
                <span>{{ procure_no }}</span>
              </div>
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
          <div class="header-right">
            <span class="code-status">{{ orderStatus }}</span>
            <barcode :value="procure_ret_no" v-if="procure_ret_no"></barcode>
          </div>
        </div>
        <tabs-header :tab-list="tabList" v-model="currentIndex"></tabs-header>
        <!-- 采购退货单详情 -->
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
                  <td>{{ item.measure_name }}</td>
                  <td>{{ item.ret_num }}</td>
                  <td>{{ item.sup_name }}</td>
                  <td :style="[index == 13 ? 'page-break-after:always' : '']">
                    {{ item.note }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="!tableData.length" class="table-empty">
              <span class="table-empty-text">暂无数据</span>
            </div> -->
          <el-table :data="tableData" border stripe height="800" scrollbar-always-on>
            <el-table-column label="#" type="index" />
            <el-table-column label="货品条码" prop="barcode" />
            <el-table-column label="名称" prop="title" />
            <el-table-column label="规格型号" prop="spec" />
            <el-table-column label="单位" prop="measure_name" />
            <el-table-column label="数量" prop="ret_num" />
            <el-table-column label="供应商" prop="sup_name" />
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
        <!-- 单据日志 -->
        <div v-show="currentIndex == 1" class="no-print">
          <el-table
            :data="logData"
            border
            stripe
            style="width: 50%"
            :cell-style="{ 'text-align': 'center' }"
            :header-cell-style="{ 'text-align': 'center' }"
            height="860"
            scrollbar-always-on
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
      <div class="footer-btn mt-[20px] pb-[10px]">
        <el-divider />
        <el-button class="w-[100px]" type="primary" plain @click="handleBack" size="large">
          返回
        </el-button>
        <!-- 当前为创建人 -->
        <template v-if="assoc_type == 1">
          <!-- 待提审,已撤回,已驳回状态时 -->
          <template v-if="status == 0 || status == 4 || status == 5">
            <el-button
              class="w-[100px]"
              @click="handleEdit"
              v-hasPerm="['buy:refund:edit']"
              size="large"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              class="w-[100px]"
              @click="cellSubmitAudit"
              v-hasPerm="['buy:refund:submit']"
              size="large"
            >
              提交审核
            </el-button>
            <el-button
              class="w-[100px]"
              @click="handleVoid"
              v-hasPerm="['buy:refund:void']"
              size="large"
            >
              作废
            </el-button>
          </template>
          <!-- 待审核状态时 -->
          <template v-else-if="status == 1">
            <el-button
              class="w-[100px]"
              @click="cellRecall"
              v-hasPerm="['buy:refund:recall']"
              size="large"
            >
              撤回
            </el-button>
          </template>
          <!-- 已撤回,已驳回状态时 -->
          <!-- <template v-else-if="status == 4 || status == 5">
          <el-button
            class="w-[100px]"
            @click="handleVoid"
            v-hasPerm="['buy:refund:void']"
            size="large"
            >作废</el-button
          >
        </template> -->
          <!-- 已作废状态时 -->
          <template v-else-if="status == 6">
            <el-button
              class="w-[100px]"
              @click="cellDel"
              v-hasPerm="['buy:refund:del']"
              size="large"
            >
              删除
            </el-button>
          </template>
        </template>
        <!-- 当前为审核人的时候 -->
        <template v-if="assoc_type == 2">
          <!-- 待审核状态时 -->
          <template v-if="status == 1">
            <el-button
              class="w-[100px]"
              type="success"
              @click="cellApprove"
              v-hasPerm="['buy:refund:approve']"
              size="large"
            >
              通过
            </el-button>
            <el-button
              class="w-[100px]"
              type="warning"
              @click="cellReject"
              v-hasPerm="['buy:refund:reject']"
              size="large"
            >
              驳回
            </el-button>
          </template>
        </template>
      </div>
    </div>
    <CardHint :msg="errMsg" title="采购退货单详情" @back="handleBack" v-else></CardHint>
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
