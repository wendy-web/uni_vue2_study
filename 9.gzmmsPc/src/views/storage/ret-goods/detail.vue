<script setup lang="ts">
/* 其他出库(退货出库单)详情页 */
import { ElLoading } from "element-plus";
import { useRoute, useRouter } from "vue-router";
// 引入api
import {
  approveRetGoodsApi,
  delRetGoodsApi,
  detailRetGoodsApi,
  recallRetGoodsApi,
  rejectRetGoodsApi,
  submitRetGoodsApi,
  voidRetGoodsApi,
} from "@/api/storage/ret-goods";
// 引入商品表格类型和单据日志类型
import { RetGoodsActlog, RetGoodsGoods } from "@/api/storage/ret-goods/types";
import { formartDate } from "@/utils/validate";
// 导入条形码组件
import Barcode from "@/components/Barcode/index.vue";
import CardHint from "@/components/CardHint/index.vue";
// 导入查看文件组件
import LookFile from "@/components/LookFile/index.vue";
import TabsHeader from "@/components/TabsHeader/index.vue";
import { usePrint } from "@/hooks/print";
import { useTagsViewStore } from "@/store/modules/tagsView";
import { useColumns } from "./utils/hook";

const { printDetail } = usePrint();

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
  tableData: [] as RetGoodsGoods[],
  logData: [] as RetGoodsActlog[], //单据日志

  activeName: "tab-1",
  tabList: ["出库单详情", "单据日志"],
  currentIndex: 0,
  // `````````````
  wh_ret_no: "", //退货出库单号
  procure_no: "", //采购单号
  out_time: "", //出库日期
  return_time: "", //退货日期
  out_wh_name: "", //出库仓库
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
  // theadList,
  tabList,
  currentIndex,
  // ``````````
  wh_ret_no,
  procure_no,
  ct_name,
  create_time,
  file_info,
  note,
  status,
  loading,
  out_time,
  return_time,
  out_wh_name,
} = toRefs(state);
const errMsg = ref("暂无数据");
const orderType = ref<number>();
const { importColumns, directColumns } = useColumns();
const tableColumns = computed(() => {
  return orderType.value === 1 ? importColumns : directColumns;
});

const handlePrint = () => {
  let printData = {
    orderNo: `其他出库单号：${wh_ret_no.value}`,
    // date: `出库日期：${out_time.value}`,
    ctName: `创建人：${ct_name.value}`,
    ctTime: `创建时间：${create_time.value}`,
    detailName: "其他出库单详情",
    barcode: wh_ret_no.value,
    table: tableData.value,
  };
  printDetail(printData, "retGoods");
};

// 请求数据
const getData = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "正在加载",
    background: "rgba(0, 0, 0, 0.1)",
  });

  try {
    loading.value = false;
    const result = await detailRetGoodsApi({ id: listId.value });
    let res = result.data;
    wh_ret_no.value = res.wh_ret_no;
    procure_no.value = res.procure_no;
    ct_name.value = res.ct_name;
    create_time.value = res.create_time;
    file_info.value = res.file_info;
    note.value = res.note;
    status.value = res.status;
    tableData.value = res.goods;
    logData.value = res.act_log;
    out_time.value = formartDate(res.out_time);
    return_time.value = formartDate(res.return_time);
    out_wh_name.value = res.out_wh_name;
    orderType.value = res.type;
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
    path: "/storage/ret-goods",
  });
  tagsViewStore.delView(route);
};

// 点击编辑按钮
const handleEdit = () => {
  router.push({
    path: "/storage/ret-goods/add",
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
    const result = await submitRetGoodsApi({ id: listId.value });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击撤回
const cellRecall = async () => {
  try {
    const result = await recallRetGoodsApi({ id: listId.value });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击作废
const handleVoid = () => {
  console.log("点击作废", listId.value);
  ElMessageBox.confirm(`您确定要作废该其他出库单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      try {
        let result = await voidRetGoodsApi({ id: listId.value });
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
  ElMessageBox.confirm(`您确定要删除该其他出库单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      let result = await delRetGoodsApi({ id: listId.value });
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
    const result = await approveRetGoodsApi({ id: listId.value });
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
          const result = await rejectRetGoodsApi(data);
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

const theadList = computed(() => {
  return [
    "货品条码",
    "名称",
    "规格型号",
    "批次/日期",
    "出库仓库",
    "单位",
    "出库数量",
    // "供应商",
    "备注",
  ];
});

onMounted(() => {
  console.log("assoc_type", assoc_type.value);
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
        <span>其他出库单详情</span>
        <div class="print-btn cursor-pointer" @click="handlePrint">
          <svg-icon icon-class="print"></svg-icon>
          <span class="inline-block ml-[4px]">打印单据</span>
        </div>
      </div>
      <div class="print-area" id="print-area">
        <div class="print-header">
          <div class="header-left">
            <div class="mb-2">
              <div class="header-left-bottom text-primary">
                <span>其他出库单号：</span>
                <span>{{ wh_ret_no }}</span>
              </div>
              <div class="header-left-bottom text-primary">
                <span>出库类型：</span>
                <span>{{ orderType === 1 ? "冲销出库" : "其他出库" }}</span>
              </div>
              <div class="header-left-bottom text-primary" v-if="procure_no">
                <span>采购单号：</span>
                <span>{{ procure_no }}</span>
              </div>

              <div class="header-left-bottom text-primary" v-if="out_wh_name">
                <span>出库仓库：</span>
                <span>{{ out_wh_name }}</span>
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
            <div class="header-left-bottom text-primary" v-if="return_time">
              <span>退货日期：</span>
              <span>{{ return_time }}</span>
            </div>
            <div class="header-left-bottom text-primary" v-if="out_time">
              <span>出库日期：</span>
              <span>{{ out_time }}</span>
            </div>
          </div>
          <div class="header-right">
            <span class="code-status">{{ orderStatus }}</span>
            <barcode :value="wh_ret_no" v-if="wh_ret_no"></barcode>
          </div>
        </div>
        <tabs-header :tab-list="tabList" v-model="currentIndex"></tabs-header>
        <!-- 出库单详情 -->
        <div v-show="currentIndex == 0">
          <PureTable
            :data="tableData"
            :columns="tableColumns"
            border
            stripe
            height="800"
            scrollbar-always-on
          ></PureTable>
          <div class="mt-[20px]">
            <div>
              <span class="text-primary">备注：{{ note || "无" }}</span>
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
            height="860"
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
              size="large"
              v-hasPerm="['sto:retgoods:edit']"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              class="w-[100px]"
              @click="cellSubmitAudit"
              size="large"
              v-hasPerm="['sto:retgoods:submit']"
            >
              提交审核
            </el-button>
            <el-button
              class="w-[100px]"
              @click="handleVoid"
              size="large"
              v-hasPerm="['sto:retgoods:void']"
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
              v-hasPerm="['sto:retgoods:recall']"
            >
              撤回
            </el-button>
          </template>
          <!-- 已撤回,已驳回状态时 -->
          <!-- <template v-else-if="status == 4 || status == 5">
          <el-button class="w-[100px]" @click="handleVoid" size="large"
            >作废</el-button
          >
        </template> -->
          <!-- 已作废状态时 -->
          <template v-else-if="status == 6">
            <el-button
              class="w-[100px]"
              @click="cellDel"
              size="large"
              v-hasPerm="['sto:retgoods:del']"
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
              size="large"
              v-hasPerm="['sto:retgoods:approve']"
            >
              通过
            </el-button>
            <el-button
              class="w-[100px]"
              type="warning"
              @click="cellReject"
              size="large"
              v-hasPerm="['sto:retgoods:reject']"
            >
              驳回
            </el-button>
          </template>
        </template>
      </div>
    </div>
    <CardHint :msg="errMsg" title="其他出库详情" @back="handleBack" v-else></CardHint>
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
