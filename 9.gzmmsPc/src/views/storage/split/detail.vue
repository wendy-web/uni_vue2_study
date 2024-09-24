<script setup lang="ts">
// 拆装单详情页
// 导入API
import printJS from "print-js";
import { useRoute, useRouter } from "vue-router";
import {
  approveSplitApi,
  approveSplitWhApi,
  delSplitApi,
  detailSplitApi,
  recallSplitApi,
  rejectSplitApi,
  rejectSplitWhApi,
  submitSplitApi,
  voidSplitApi,
} from "@/api/storage/split/index";
import type { IBeforeGood, IDetailLog } from "@/api/storage/split/types";
import { formartDate } from "@/utils/validate";
import CardHint from "@/components/CardHint/index.vue";
import { usePrint } from "@/hooks/print";
import { useTagsViewStore } from "@/store/modules/tagsView";

const route = useRoute();
const router = useRouter();
const tagsViewStore = useTagsViewStore();
const { printDetail } = usePrint();

enum EStatus {
  "待提审" = 0,
  "待审核" = 1,
  "已完成" = 3,
  "已撤回" = 4,
  "已驳回" = 5,
  "已作废" = 6,
  "已审批" = 7,
  "待领料" = 8,
  "已确认" = 9,
}

const listId = ref(0);
const assoc_type = ref(0);
const tableData = ref<IBeforeGood[]>([]);
const logData = ref<IDetailLog[]>([]);
const currentIndex = ref(0);
const split_assemble_no = ref("");
const split_assemble_time = ref("");
const warehouse_name = ref("");
const ct_name = ref("");
const create_time = ref("");
const status = ref(0);
const note = ref("");
const loading = ref(false);
const file_info = ref({
  //附件信息
  src: "",
  name: "",
});
const tabList = ref(["拆装单详情", "单据日志"]);
const theadList = ref([
  "",
  "货品条码",
  "名称",
  "规格型号",
  "品牌",
  "批次/日期",
  "单位",
  "拆装数量",
  "关系",
  "单价",
  "库位",
  "入库日期",
  "备注",
]);
const errMsg = ref("暂无数据");

const orderStatus = computed(() => {
  return EStatus[status.value];
});

// 请求数据
async function getData() {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "正在加载",
    background: "rgba(0, 0, 0, 0.1)",
  });
  try {
    loading.value = false;
    const result = await detailSplitApi({ id: listId.value });
    let res = result.data;
    split_assemble_no.value = res.split_assemble_no;
    split_assemble_time.value = formartDate(res.split_assemble_time);
    warehouse_name.value = res.warehouse?.name;
    ct_name.value = res.create_name;
    create_time.value = res.create_time;
    file_info.value = res.file_info;
    note.value = res.note;
    status.value = res.status;
    tableData.value = res.before_goods;
    logData.value = res.log;
    loading.value = true;
    loadingInstance.close();
  } catch (error) {
    loadingInstance.close();
    if (error instanceof Error) {
      errMsg.value = error.message;
    }
  }
}

// 点击返回按钮
const handleBack = () => {
  router.replace({
    path: "/storage/split",
  });
  tagsViewStore.delView(route);
};
// 点击编辑按钮
const handleEdit = () => {
  router.push({
    path: "/storage/split/add",
    query: {
      editFrom: 2,
      id: listId.value,
    },
  });
};
// 点击提审
const cellSubmitAudit = async () => {
  console.log("点击提审");
  try {
    const result = await submitSplitApi({ id: listId.value });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};
// 点击作废
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
        let result = await voidSplitApi({ id: listId.value });
        ElMessage.success(result.msg);
        getData();
      } catch (error) {}
    })
    .catch((error) => {
      console.log(error);
    });
};
// 点击删除
const cellDel = () => {
  ElMessageBox.confirm(`您确定要删除该领料出库单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      let result = await delSplitApi({ id: listId.value });
      ElMessage.success(result.msg);
      handleBack();
    })
    .catch((error) => {
      console.log(error);
    });
};
// 点击撤回
const cellRecall = async () => {
  try {
    const result = await recallSplitApi({ id: listId.value });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 点击通过
const cellApprove = async () => {
  console.log("点击通过", listId.value);
  try {
    const result = await approveSplitApi({ id: listId.value });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 点击驳回
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
          const result = await rejectSplitApi(data);
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
// 仓库确认人点击通过
const cellwhApprove = async () => {
  console.log("点击通过", listId.value);
  try {
    const result = await approveSplitWhApi({ id: listId.value });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};
// 仓库确认人点击驳回
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
          const result = await rejectSplitWhApi(data);
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

const handlePrint = () => {
  let arr = [] as any[];
  tableData.value.forEach((item, index) => {
    arr.push({
      label: "大包装规格",
      barcode: item.goods?.barcode || "-",
      title: item.goods?.title || "-",
      spec: item.goods?.spec || "-",
      branch: item.goods?.brand || "-",
      batch_number: item.batch_number || "-",
      measure_name: item.goods?.measure_name || "-",
      split_assemble_num: item.split_assemble_num || "-",
      split_quantity: 1,
      price: item.price || "-",
      ws_code: item.ws_code || "-",
      in_wh_date: item.in_wh_date || "-",
      note: item.note,
    });
    arr.push({
      label: "拆零规格",
      barcode: item.after?.goods?.barcode || "-",
      title: item.after?.goods?.title || "-",
      spec: item.after?.goods?.spec || "-",
      branch: item.after?.goods?.brand || "-",
      batch_number: item.after?.batch_number || "-",
      measure_name: item.after?.goods.measure_name || "-",
      split_assemble_num: item.after?.split_assemble_num || "-",
      split_quantity: "1: " + item.goods?.split_quantity,
      price: item.after?.price || "-",
      ws_code: item.after?.ws_code || "-",
      in_wh_date: item.after?.in_wh_date || "-",
    });
  });
  // let table = tableData.value.map((item, index) => {
  //   if (index % 2 !== 0) {
  //     return {
  //       label: "大包装规格",
  //       barcode: item.goods?.barcode || "-",
  //       title: item.goods?.title || "-",
  //       spec: item.goods?.spec || "-",
  //       branch: item.goods?.brand || "-",
  //       batch_number: item.batch_number || "-",
  //       measure_name: item.goods?.measure_name || "-",
  //       split_assemble_num: item.split_assemble_num || "-",
  //       split_quantity: 1,
  //       price: item.price || "-",
  //       ws_code: item.ws_code || "-",
  //       in_wh_date: item.in_wh_date || "-",
  //       note: item.note,
  //     };
  //   } else {
  //     return {
  //       label: "大包装规格",
  //       barcode: item.after?.goods?.barcode || "-",
  //       title: item.after?.goods?.title || "-",
  //       spec: item.after?.goods?.spec || "-",
  //       branch: item.after?.goods?.brand || "-",
  //       batch_number: item.after?.batch_number || "-",
  //       measure_name: item.after?.goods.measure_name || "-",
  //       split_assemble_num: item.split_assemble_num || "-",
  //       split_quantity: "1: " + item.goods?.split_quantity,
  //       price: item.after?.price || "-",
  //       ws_code: item.after?.ws_code || "-",
  //       in_wh_date: item.after?.in_wh_date || "-",
  //     };
  //   }
  // });
  let printData = {
    orderNo: `拆装单号：${split_assemble_no.value}`,
    warehouse: `拆装仓库：${warehouse_name.value}`,
    date: `拆装日期：${split_assemble_time.value}`,
    ctName: `创建人：${ct_name.value}`,
    ctTime: `创建时间：${create_time.value}`,
    detailName: "拆装单详情",
    barcode: split_assemble_no.value,
    // table: tableData.value,
    table: arr,
  };
  printDetail(printData, "split");
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
//     设置了 .no-print 类名的元素,在打印时不显示
//     设置表格td元素的字体大小为12px
//   */
//   const style = `@media print {.no-print {display: none !important;td{font-size:12px !important;}}};`;

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
        <span>拆装单详情</span>
        <div class="print-btn cursor-pointer" @click="handlePrint">
          <svg-icon icon-class="print"></svg-icon>
          <span class="inline-block ml-[4px]">打印单据</span>
        </div>
      </div>
      <div class="print-area" id="print-area">
        <div class="print-header">
          <div class="header-left">
            <div class="header-left-top text-primary flex">
              <div class="mr-[20px] text-primary">
                <span>拆装单号：</span>
                <span>{{ split_assemble_no }}</span>
              </div>
              <div class="mr-[20px] text-primary">
                <span>拆装仓库：</span>
                <span>{{ warehouse_name }}</span>
              </div>
              <div class="mr-[20px] text-primary">
                <span>拆装日期：</span>
                <span>{{ split_assemble_time }}</span>
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
            <barcode :value="split_assemble_no" v-if="split_assemble_no"></barcode>
          </div>
        </div>
        <tabs-header :tab-list="tabList" v-model="currentIndex"></tabs-header>
        <!-- 出库单详情 -->
        <div v-show="currentIndex == 0">
          <div class="split-table-container">
            <el-table :data="tableData" border stripe height="760" scrollbar-always-on>
              <el-table-column label="#">
                <template #default="scope">
                  <span>大包装规格</span>
                  <br />
                  <i class="line no-print"></i>
                  <span>拆零规格</span>
                </template>
              </el-table-column>
              <el-table-column label="货品条码" prop="barcode">
                <template #default="{ row }">
                  <span>{{ row.goods?.barcode }}</span>
                  <br />
                  <i class="line no-print"></i>
                  <span>{{ row.after?.goods?.barcode }}</span>
                </template>
              </el-table-column>
              <el-table-column label="名称" prop="title">
                <template #default="{ row }">
                  <span>{{ row.goods?.title }}</span>
                  <br />
                  <i class="line no-print"></i>
                  <span>{{ row.after?.goods?.title }}</span>
                </template>
              </el-table-column>
              <el-table-column label="规格型号" prop="spec">
                <template #default="{ row }">
                  <span>{{ row.goods?.spec }}</span>
                  <br />
                  <i class="line no-print"></i>
                  <span>{{ row.after?.goods?.spec }}</span>
                </template>
              </el-table-column>
              <el-table-column label="品牌" prop="brand">
                <template #default="{ row }">
                  <span>{{ row.goods?.brand || "-" }}</span>
                  <br />
                  <i class="line no-print"></i>
                  <span>{{ row.after?.goods?.brand || "-" }}</span>
                </template>
              </el-table-column>
              <el-table-column label="批次/日期" prop="ph_no">
                <template #default="{ row }">
                  <span>{{ row.batch_number || "-" }}</span>
                  <br />
                  <i class="line no-print"></i>
                  <span>{{ row.after?.batch_number || "-" }}</span>
                </template>
              </el-table-column>
              <el-table-column label="单位" prop="measure_name">
                <template #default="{ row }">
                  <span>{{ row.goods?.measure_name || "-" }}</span>
                  <br />
                  <i class="line no-print"></i>
                  <span>{{ row.after?.goods.measure_name || "-" }}</span>
                </template>
              </el-table-column>
              <el-table-column label="拆装数量" prop="scr_num">
                <template #default="{ row }">
                  <span>{{ row.split_assemble_num || "-" }}</span>
                  <br />
                  <i class="line no-print"></i>
                  <span>{{ row.after?.split_assemble_num || "-" }}</span>
                </template>
              </el-table-column>
              <el-table-column label="关系" prop="warehouse_name">
                <template #default="{ row }">
                  <span>1</span>
                  <br />
                  <i class="line no-print"></i>
                  <span>{{ "1: " + row.goods?.split_quantity }}</span>
                </template>
              </el-table-column>
              <el-table-column label="单价" prop="price">
                <template #default="{ row }">
                  <span>{{ row.price || "-" }}</span>
                  <br />
                  <i class="line no-print"></i>
                  <span>{{ row.after?.price || "-" }}</span>
                </template>
              </el-table-column>
              <el-table-column label="库位" prop="ws_code">
                <template #default="{ row }">
                  <span>{{ row.ws_code || "-" }}</span>
                  <br />
                  <i class="line no-print"></i>
                  <span>{{ row.after?.ws_code || "-" }}</span>
                </template>
              </el-table-column>
              <el-table-column label="入库日期" prop="in_wh_date">
                <template #default="{ row }">
                  <span>{{ row.in_wh_date || "-" }}</span>
                  <br />
                  <i class="line no-print"></i>
                  <span>{{ row.after?.in_wh_date || "-" }}</span>
                </template>
              </el-table-column>
              <el-table-column label="备注" prop="note"></el-table-column>
            </el-table>

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
      <div class="footer-btn mt-[20px] pb-[20px]">
        <el-divider />
        <el-button class="w-[100px]" type="primary" size="large" plain @click="handleBack">
          返回
        </el-button>

        <!-- 当前为创建人 -->
        <template v-if="assoc_type == 1">
          <!-- 待提审,已撤回,已驳回状态时 -->
          <template v-if="status == 0 || status == 4 || status == 5">
            <el-button
              class="w-[100px]"
              size="large"
              @click="handleEdit"
              v-hasPerm="['buy:split:edit']"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              size="large"
              class="w-[100px]"
              @click="cellSubmitAudit"
              v-hasPerm="['buy:split:submit']"
            >
              提交审核
            </el-button>
            <el-button
              class="w-[100px]"
              size="large"
              @click="handleVoid"
              v-hasPerm="['buy:split:void']"
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
              v-hasPerm="['buy:split:recall']"
            >
              撤回
            </el-button>
          </template>
          <!-- 已作废状态时 -->
          <template v-else-if="status == 6">
            <el-button
              class="w-[100px]"
              size="large"
              @click="cellDel"
              v-hasPerm="['buy:split:del']"
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
              v-hasPerm="['buy:split:approve']"
            >
              通过
            </el-button>
            <el-button
              class="w-[100px]"
              type="warning"
              size="large"
              @click="cellReject"
              v-hasPerm="['buy:split:reject']"
            >
              驳回
            </el-button>
          </template>
        </template>
        <template v-if="assoc_type == 5">
          <!-- 待领料状态时 -->
          <template v-if="status == 8">
            <el-button
              class="w-[100px]"
              type="success"
              size="large"
              @click="cellwhApprove"
              v-hasPerm="['buy:split:whapprove']"
            >
              仓库确认
            </el-button>
            <el-button
              class="w-[100px]"
              type="warning"
              size="large"
              @click="cellwhReject"
              v-hasPerm="['buy:split:whreject']"
            >
              仓库驳回
            </el-button>
          </template>
        </template>
      </div>
    </div>
    <CardHint :msg="errMsg" title="拆装单详情" @back="handleBack" v-else></CardHint>
  </div>
</template>
<style lang="scss" scoped>
.line {
  position: absolute;
  left: 0;
  right: 0;
  height: 20px;
  border-top: 1px solid #e5e5e5;
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
    }
  }
}
/* 
  手撸表格样式  
  手撸表格是为了配合打印
  elementPlus的表格在打印有样式问题
*/
.split-table-container {
  table {
    width: 100%;
    max-width: 100%;
    table-layout: fixed;
    font-family: Arial, sans-serif;
    font-size: 14px;
    border-collapse: collapse;
    color: #454545;
    table-layout: auto;
    width: 100%;
    text-align: center;
    border: 0.5px solid #dadcde;

    thead {
      border-top-width: 0.5px;
      border-top-style: solid;
      border-top-color: #dadcde;
      line-height: 40px;
      font-weight: bold;
      color: #909399;
    }
    tbody {
      color: #606266;
    }
    tr {
      border-top-width: 0.5px;
      border-top-style: solid;
      border-top-color: #dadcde;
      line-height: 23px;
    }
    td {
      padding: 5px 10px;
      padding-bottom: 0;
      font-size: 14px;
      font-family: Verdana;
      // width: 100px;
      word-break: break-all; // 元素换行
      border-right: 0.5px solid #dadcde;
      overflow: hidden;
      position: relative;
    }

    // 斑马纹效果stripe
    // tbody tr:nth-child(even) {
    //   background: #fafafa;
    // }
    // tbody tr:nth-child(odd) {
    //   background: #fff;
    // }
  }
  // 手撸表格内容为空时的样式
  .table-empty {
    min-height: 60px;
    text-align: center;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #ebeef5;
    border-left: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
    .table-empty-text {
      line-height: 60px;
      width: 50%;
      color: #909399;
    }
  }
}
</style>
