<script setup lang="ts">
/* 盘点单详情页 */
// import printJS from "print-js";
import { ElLoading } from "element-plus";
import { hiprint } from "vue-plugin-hiprint";
import { useRoute, useRouter } from "vue-router";
// 引入api
import {
  approveCheckApi,
  delCheckApi,
  detailCheckApi,
  recallCheckApi,
  rejectCheckApi,
  submitCheckApi,
  voidCheckApi,
} from "@/api/storage/check";
// 引入类型
import { CheckActlog, CheckGoods } from "@/api/storage/check/types";
import { formartDate } from "@/utils/validate";
// 导入条形码组件
import Barcode from "@/components/Barcode/index.vue";
import CardHint from "@/components/CardHint/index.vue";
// 导入查看文件组件
import LookFile from "@/components/LookFile/index.vue";
import TabsHeader from "@/components/TabsHeader/index.vue";
import { useTagsViewStore } from "@/store/modules/tagsView";
import moban from "./utils/pandian.json";

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
}

const state = reactive({
  listId: 0,
  assoc_type: 0,
  theadList: ["条码", "名称", "规格型号", "批次/日期", "单位", "系统库存", "实盘数量", "备注"],
  tableData: [] as CheckGoods[], //详情,原始信息
  logData: [] as CheckActlog[], //单据日志

  activeName: "tab-1",
  tabList: ["盘点单详情", "单据日志"],
  currentIndex: 0,
  // `````````````
  wh_inv_no: "", //盘点单号
  warehouse_name: "", //盘点仓库
  warehouse_id: 0,
  ct_name: "", //制单人
  create_time: "", //创建时间
  inventory_time: "", //盘点日期
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
  wh_inv_no,
  warehouse_name,
  warehouse_id,
  ct_name,
  create_time,
  all_price,
  file_info,
  note,
  status,
  loading,
  inventory_time,
} = toRefs(state);
const errMsg = ref("暂无数据");

const handlePrint = () => {
  // const loading = ElLoading.service({
  //   lock: true,
  //   text: "正在启动打印服务",
  // });
  let orderNote = note.value || "";
  let printData = {
    table_title: "盘点单",
    barcode: wh_inv_no.value,
    table_no: "盘点单号:",
    table_date: `盘点日期:${inventory_time.value}`,
    table_wh: `盘点仓库:${warehouse_name.value}`,
    table_username: `制单人:${ct_name.value}`,
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
    const result = await detailCheckApi({ id: listId.value });
    let res = result.data;
    wh_inv_no.value = res.wh_inv_no;
    warehouse_name.value = res.warehouse_name;
    warehouse_id.value = res.warehouse_id;

    ct_name.value = res.ct_name;
    create_time.value = res.create_time;
    inventory_time.value = formartDate(res.inventory_time);

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
    path: "/storage/check",
  });
  tagsViewStore.delView(route);
};

// 点击编辑按钮
const handleEdit = () => {
  router.push({
    path: "/storage/check/add",
    query: {
      editFrom: 2,
      id: listId.value,
    },
  });
};

// 单元格点击提审
const cellSubmitAudit = () => {
  console.log("点击提审");
  // ElMessageBox.confirm("是否需要更新库存?", "提示", {
  //   confirmButtonText: "需要",
  //   cancelButtonText: "不需要",
  //   type: "warning",
  // })
  //   .then(() => {
  //     console.log("需要");
  //     sendSubmit(1);
  //   })
  //   .catch(() => {
  //     console.log("不需要");
  //     sendSubmit(2);
  //   });
  /* 暂时不需要弹窗确认是否需要更新库存,默认不需要更新库存 */
  sendSubmit(2);
};

const sendSubmit = async (up_inv: number) => {
  try {
    const result = await submitCheckApi({ id: listId.value, up_inv });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击撤回
const cellRecall = async () => {
  try {
    const result = await recallCheckApi({ id: listId.value });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击作废
const handleVoid = () => {
  console.log("点击作废", listId.value);
  ElMessageBox.confirm(`您确定要作废该盘点单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      try {
        let result = await voidCheckApi({ id: listId.value });
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
  ElMessageBox.confirm(`您确定要删除该盘点单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      let result = await delCheckApi({ id: listId.value });
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
    const result = await approveCheckApi({ id: listId.value });
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
          const result = await rejectCheckApi(data);
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
        <span>盘点单详情</span>
        <div class="print-btn cursor-pointer" @click="handlePrint">
          <svg-icon icon-class="print"></svg-icon>
          <span class="inline-block ml-[4px]">打印单据</span>
        </div>
      </div>
      <div class="print-area" id="print-area">
        <div class="print-header">
          <div class="header-left">
            <div class="header-left-top">
              <div class="left-top-item">
                <span>盘点单号：</span>
                <span>{{ wh_inv_no }}</span>
              </div>
              <div class="left-top-item">
                <span>盘点仓库：</span>
                <span class="font-bold">{{ warehouse_name }}</span>
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
            <div class="header-left-bottom">
              <span>盘点日期：</span>
              <span>{{ inventory_time }}</span>
            </div>
          </div>
          <div class="header-right">
            <span class="code-status">{{ orderStatus }}</span>
            <barcode :value="wh_inv_no" v-if="wh_inv_no"></barcode>
          </div>
        </div>
        <tabs-header :tab-list="tabList" v-model="currentIndex"></tabs-header>
        <!-- 详情 -->
        <div v-show="currentIndex == 0">
          <el-table
            :data="tableData"
            border
            stripe
            header-cell-class-name="table-row-header"
            height="800"
            scrollbar-always-on
          >
            <el-table-column label="#" type="index" />
            <el-table-column label="条码" prop="barcode" align="center"></el-table-column>
            <el-table-column label="名称" prop="title" align="center"></el-table-column>
            <el-table-column label="规格型号" prop="spec" align="center"></el-table-column>
            <el-table-column label="批次/日期" prop="ph_no" align="center"></el-table-column>
            <el-table-column label="单位" prop="measure_name" align="center"></el-table-column>
            <el-table-column label="品牌" prop="brand" align="center"></el-table-column>
            <el-table-column label="分类" prop="class_name" align="center"></el-table-column>
            <el-table-column label="盘点前数量" prop="in_num" align="center"></el-table-column>
            <el-table-column label="盘点后数量" prop="inv_num" align="center"></el-table-column>
            <el-table-column label="盘盈盘亏" prop="diff_num" align="center">
              <template #default="{ row }">
                <span
                  :class="[
                    { 'text-green-500': row.diff_num > 0, 'text-red-500': row.diff_num < 0 },
                  ]"
                >
                  {{ row.diff_num }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="库位" prop="ws_code"></el-table-column>
            <el-table-column label="单价" prop="price"></el-table-column>
            <el-table-column label="入库日期" prop="in_wh_date"></el-table-column>
            <el-table-column label="备注" prop="note"></el-table-column>
          </el-table>
          <div class="table-container">
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
                  <td>{{ item.measure_name }}</td>
                  <td>{{ item.in_num }}</td>
                  <td>{{ item.inv_num }}</td>
                  <td :style="[index == 13 ? 'page-break-after:always' : '']">
                    {{ item.note }}
                  </td>
                </tr>
              </tbody>
            </table> -->
            <div v-if="!tableData.length" class="table-empty">
              <span class="table-empty-text">暂无数据</span>
            </div>
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
          <el-table :data="logData" border stripe style="width: 50%" height="860">
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
        <el-button class="w-[100px]" size="large" @click="handleBack">返回</el-button>
        <!-- 当前为创建人 -->
        <template v-if="assoc_type == 1">
          <!-- 待提审,已撤回,已驳回状态时 -->
          <template v-if="status == 0 || status == 4 || status == 5">
            <el-button
              class="w-[100px]"
              size="large"
              @click="handleEdit"
              v-hasPerm="['sto:check:edit']"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              class="w-[100px]"
              @click="cellSubmitAudit"
              v-hasPerm="['sto:check:submit']"
            >
              提交审核
            </el-button>
            <el-button
              class="w-[100px]"
              size="large"
              @click="handleVoid"
              v-hasPerm="['sto:check:void']"
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
              v-hasPerm="['sto:check:recall']"
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
              v-hasPerm="['sto:check:del']"
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
              size="large"
              @click="cellApprove"
              v-hasPerm="['sto:check:approve']"
            >
              通过
            </el-button>
            <el-button
              class="w-[100px]"
              type="warning"
              size="large"
              @click="cellReject"
              v-hasPerm="['sto:check:reject']"
            >
              驳回
            </el-button>
          </template>
        </template>
      </div>
    </div>
    <CardHint :msg="errMsg" title="盘点单详情" @back="handleBack" v-else></CardHint>
  </div>
</template>

<style scoped lang="scss">
.print-area {
  .print-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: -6px;
    .header-left-top {
      margin-bottom: 10px;
      .left-top-item {
        display: inline-block;
        margin-right: 20px;
      }
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
