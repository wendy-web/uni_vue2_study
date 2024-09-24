<script setup lang="ts">
// 采购入库单详情页
import { ElLoading } from "element-plus";
import printJS from "print-js";
import { hiprint } from "vue-plugin-hiprint";
import { useRoute, useRouter } from "vue-router";
// 引入获取采购单详情api
import {
  approveBuyInApi,
  approveBuyInWhApi,
  delBuyInApi,
  detailBuyInApi,
  recallBuyInApi,
  rejectBuyInApi,
  rejectBuyInWhApi,
  submitBuyInApi,
  voidBuyInApi,
} from "@/api/storage/buy-in/index";
// 导入类型
import { IBuyInDetailGoods, IBuyInDetailLog } from "@/api/storage/buy-in/types";
import { checkAssocType, perms } from "@/utils/auth";
// 引入审批流程自定义组件
import ApproveFlowGlobal from "@/components/ApproveLog/ApproveFlowGlobal.vue";
// 导入条形码组件
import Barcode from "@/components/Barcode/index.vue";
import CardHint from "@/components/CardHint/index.vue";
// 导入查看文件组件
import LookFile from "@/components/LookFile/index.vue";
import TabsHeader from "@/components/TabsHeader/index.vue";
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
  tableData: [] as IBuyInDetailGoods[], //采购单详情,原始信息
  logData: [] as IBuyInDetailLog[], //单据日志
  activeName: "tab-1",
  tabList: ["入库单详情", "单据日志"],
  currentIndex: 0,
  wh_in_no: "", //采购入库单号
  procure_no: "", //采购单号
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
  in_wh_name: "", //入库仓库名
  in_wh_id: 0, // 入库仓库id
  in_time: "", //入库日期
});

const {
  listId,
  assoc_type,
  tableData,
  logData,
  tabList,
  currentIndex,
  wh_in_no,
  procure_no,
  ct_name,
  create_time,
  all_price,
  file_info,
  note,
  status,
  loading,
  in_wh_name,
  in_wh_id,
  in_time,
} = toRefs(state);
const errMsg = ref("暂无数据");

const handlePrint = () => {
  let orderNote = note.value || "";

  let printData = {
    table_title: "采购入库单",
    barcode: wh_in_no.value,
    table_no: "采购入库单号:",
    table_date: `制单日期:${create_time.value}`,
    table_username: `制单人:${ct_name.value}`,
    table_wh: `入库仓库:${in_wh_name.value}`,
    order_note: `单据备注:${orderNote}`,
    table: tableData.value,
  };

  let mobanColumnsList = moban.panels[0].printElements[7].options.columns ?? [];
  console.log("🚀 ~ handlePrint ~ mobanColumnsList:", mobanColumnsList);
  mobanColumnsList[0].forEach((item) => {
    if (item.field == "price" || item.field == "sup_name") {
      let permsRes = perms(["sto:buyin:add", "sto:buyin:edit"]);
      item.checked = permsRes;
    }
  });

  // // console.log("moban", moban.panels[0].printElements[7].options.columns);
  // return;

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
    const result = await detailBuyInApi({ id: listId.value });
    let res = result.data;
    assoc_type.value = res.assoc_type;
    in_time.value = res.in_time;
    in_wh_name.value = res.in_wh_name;
    in_wh_id.value = res.in_wh_id;
    wh_in_no.value = res.wh_in_no;
    procure_no.value = res.procure_no || "";
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
    path: "/storage/buy-in",
  });
  tagsViewStore.delView(route);
};

// 点击编辑按钮
const handleEdit = () => {
  router.push({
    path: "/storage/buy-in/add",
    query: {
      editFrom: 2,
      id: listId.value,
      procure_no: procure_no.value || undefined,
    },
  });
};

// 单元格点击提审
const cellSubmitAudit = async () => {
  console.log("点击提审");
  try {
    const result = await submitBuyInApi({ id: listId.value });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击撤回
const cellRecall = async () => {
  try {
    const result = await recallBuyInApi({ id: listId.value });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击作废
const handleVoid = () => {
  console.log("点击作废", listId.value);
  ElMessageBox.confirm(`您确定要作废该采购入库单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      try {
        let result = await voidBuyInApi({ id: listId.value });
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
  ElMessageBox.confirm(`您确定要删除该采购入库单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      let result = await delBuyInApi({ id: listId.value });
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
    const result = await approveBuyInApi({ id: listId.value });
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
          const result = await rejectBuyInApi(data);
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
    const result = await approveBuyInWhApi(data);
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
  })
    .then(async ({ value }) => {
      value = value.trim();
      if (value) {
        let data = {
          reason: value,
          id: listId.value,
        };
        try {
          const result = await rejectBuyInWhApi(data);
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
        <span>采购入库单详情</span>
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
                <span>采购入库单号：</span>
                <span>{{ wh_in_no }}</span>
              </div>
              <div class="header-left-bottom" v-if="procure_no">
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
            <!-- <img src="@/assets/img/barcode.png" alt="" class="code-img" /> -->
            <barcode :value="wh_in_no" v-if="wh_in_no"></barcode>
          </div>
        </div>
        <tabs-header :tab-list="tabList" v-model="currentIndex"></tabs-header>
        <!-- 采购单入库单详情 -->
        <div v-show="currentIndex == 0">
          <el-table :data="tableData" border stripe height="600" scrollbar-always-on>
            <el-table-column type="index" label="#" />
            <el-table-column prop="barcode" label="条码" />
            <el-table-column prop="title" label="名称" />
            <el-table-column prop="spec" label="规格型号" />
            <el-table-column prop="brand" label="品牌" />
            <el-table-column prop="in_num" label="入库数量" />
            <el-table-column
              prop="sup_name"
              label="供应商"
              v-hasPerm="['sto:buyin:edit', 'sto:buyin:add']"
            />
            <el-table-column prop="dept" label="需求部门">
              <template #default="{ row }">
                <span>{{ row.dept?.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="measure_name" label="单位" />
            <el-table-column
              prop="price"
              label="单价(元)"
              v-hasPerm="['sto:buyin:edit', 'sto:buyin:add']"
            />
            <el-table-column prop="ws_code" label="库位" />
            <el-table-column prop="class_name" label="分类" />
            <el-table-column prop="ph_no" label="批次/日期" />
            <el-table-column prop="pro_time" label="生产日期" />
            <el-table-column prop="exp_day" label="保质期" />
            <el-table-column prop="exp_time" label="到期日期" />
            <el-table-column prop="note" label="备注" />
          </el-table>

          <div class="mt-[20px]">
            <span>备注：{{ note || "无" }}</span>
            <div class="no-print flex items-center">
              <span>附件：</span>
              <look-file v-if="file_info.src" :file_info="file_info"></look-file>
              <span v-else>无</span>
            </div>
          </div>

          <!-- </div> -->
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
            height="660"
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
              v-hasPerm="['sto:buyin:edit']"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              class="w-[100px]"
              @click="cellSubmitAudit"
              size="large"
              v-hasPerm="['sto:buyin:submit']"
            >
              提交审核
            </el-button>
            <el-button
              class="w-[100px]"
              @click="handleVoid"
              size="large"
              v-hasPerm="['sto:buyin:void']"
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
              v-hasPerm="['sto:buyin:recall']"
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
              v-hasPerm="['sto:buyin:approve']"
            >
              通过
            </el-button>
            <el-button
              class="w-[100px]"
              type="warning"
              @click="cellReject"
              size="large"
              v-hasPerm="['sto:buyin:reject']"
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
              v-hasPerm="['sto:buyin:whapprove']"
            >
              入库确认
            </el-button>
            <el-button
              class="w-[100px]"
              type="warning"
              size="large"
              @click="cellwhReject"
              v-hasPerm="['sto:buyin:whreject']"
            >
              入库驳回
            </el-button>
          </template>
        </template>
      </div>
      <div class="mt-[20px] pb-[10px] no-print">
        <el-divider />
        <!-- 流程组件 -->
        <ApproveFlowGlobal
          :id="listId"
          :wh-id="in_wh_id"
          :orderType="2"
          :pageType="3"
          :status="status"
        ></ApproveFlowGlobal>
      </div>
    </div>
    <CardHint :msg="errMsg" title="采购入库单详情" @back="handleBack" v-else></CardHint>
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
