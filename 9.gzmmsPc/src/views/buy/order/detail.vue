<script setup lang="ts">
import { ElLoading } from "element-plus";
import { hiprint } from "vue-plugin-hiprint";
import { useRoute, useRouter } from "vue-router";
// 引入获取采购单详情api
import {
  approveOrderApi,
  delOrderApi,
  orderDetailApi,
  recallOrderApi,
  rejectOrderApi,
  submitOrderApi,
  voidOrderApi,
} from "@/api/buy/order/index";
// 引入表格类型
import { IOrderAddTable } from "@/api/buy/order/types";
import { formartDate } from "@/utils/validate";
// 导入条形码组件
import Barcode from "@/components/Barcode/index.vue";
import CardHint from "@/components/CardHint/index.vue";
// 导入查看文件组件
import LookFile from "@/components/LookFile/index.vue";
import TabsHeader from "@/components/TabsHeader/index.vue";
import { sendEmailHooks } from "@/hooks";
import { useTagsViewStore } from "@/store/modules/tagsView";
import moban from "./utils/caigou.json";

hiprint.init();
const { sendMail } = sendEmailHooks();
const route = useRoute();
const router = useRouter();
const tagsViewStore = useTagsViewStore();
enum EStatus {
  "待提审" = 0,
  "待审核",
  "待入库",
  "已完成",
  "已撤回",
  "已驳回",
  "已作废",
  "已审核",
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
    "单位",
    "采购数量",
    "采购单价",
    "小计",
    "供应商",
    "需求部门",
    "提交日期",
    "交货期",
    "合同号",
    "备注",
  ],
  tableData: [] as IOrderAddTable[], //采购单详情,原始信息
  logData: [], //单据日志
  awaitData: [] as IOrderAddTable[], // 待采购 待入库
  ret_list: [] as any[], //退货信息
  in_list: [] as any[], // 已入库信息
  activeName: "tab-1",
  tabList: ["采购单详情", "待入库", "退货信息", "入库信息", "单据日志"],
  currentIndex: 0,
  // `````````````
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
  purpose: "", //采购事由
});

const {
  listId,
  assoc_type,
  tableData,
  logData,
  awaitData,
  theadList,
  tabList,
  currentIndex,
  // ``````````
  procure_no,
  ct_name,
  create_time,
  all_price,
  file_info,
  note,
  status,
  loading,
  ret_list,
  in_list,
  purpose,
} = toRefs(state);
const errMsg = ref("暂无数据");

const handlePrint = () => {
  let orderNote = note.value || "";

  const table = tableData.value.map((item) => {
    if (item.submit_time) {
      item.submit_time = formartDate(item.submit_time);
    }
    return item;
  });

  let printData = {
    table_title: "采购单",
    barcode: procure_no.value,
    table_no: "采购单号:",
    table_date: `制单日期:${create_time.value}`,
    table_username: `制单人:${ct_name.value}`,
    order_note: `单据备注:${orderNote}`,
    table: table,
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

function getStatus(status: number | string) {
  return EStatus[Number(status)];
}

// 请求数据
const getData = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "正在加载",
    background: "rgba(0, 0, 0, 0.1)",
  });

  try {
    loading.value = false;
    const result = await orderDetailApi({ id: listId.value });
    let res = result.data;
    procure_no.value = res.procure_no;
    ct_name.value = res.ct_name;
    create_time.value = res.create_time;
    all_price.value = res.all_price;
    file_info.value = res.file_info;
    note.value = res.note;
    purpose.value = res.purpose;
    status.value = res.status;
    tableData.value = res.goods;
    awaitData.value = res.goods_wait;
    ret_list.value = res.goods_yth;
    in_list.value = res.goods_yrk;
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
    path: "/buy/order",
  });
  tagsViewStore.delView(route);
};

// 点击编辑按钮
const handleEdit = () => {
  router.push({
    path: "/buy/order/add",
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
    const result = await submitOrderApi({ id: listId.value });
    ElMessage.success(result.msg);
    if (result.data.status === 2) {
      sendMail(listId.value);
    }
    getData();
  } catch (error) {}
};

// 单元格点击撤回
const cellRecall = async () => {
  try {
    const result = await recallOrderApi({ id: listId.value });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击作废
const handleVoid = () => {
  console.log("点击作废", listId.value);
  ElMessageBox.confirm(`您确定要作废该采购单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      try {
        let result = await voidOrderApi({ id: listId.value });
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
  ElMessageBox.confirm(`您确定要删除该采购单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      let result = await delOrderApi({ id: listId.value });
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
    const result = await approveOrderApi({ id: listId.value });
    ElMessage.success(result.msg);
    if (result.data.status === 2) {
      sendMail(listId.value);
    }
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
      console.log(value);
      value = value.trim();
      if (value) {
        let data = {
          reason: value,
          id: listId.value,
        };
        try {
          const result = await rejectOrderApi(data);
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
        <span>采购单详情</span>
        <div class="print-btn cursor-pointer" @click="handlePrint">
          <svg-icon icon-class="print"></svg-icon>
          <span class="inline-block ml-[4px]">打印单据</span>
        </div>
      </div>
      <div class="print-area" id="print-area">
        <div class="print-header">
          <div class="header-left">
            <div class="header-left-top text-primary">
              <span>采购单号：</span>
              <span>{{ procure_no }}</span>
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
            <barcode :value="procure_no" v-if="procure_no"></barcode>
          </div>
        </div>
        <tabs-header :tab-list="tabList" v-model="currentIndex"></tabs-header>
        <!-- 采购单详情 -->
        <div v-show="currentIndex == 0">
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
                  <td>{{ item.brand }}</td>
                  <td>{{ item.class_name }}</td>
                  <td>{{ item.measure_name }}</td>
                  <td>{{ item.num }}</td>
                  <td>{{ item.price }}</td>
                  <td>{{ item.sub_total }}</td>
                  <td>{{ item.sup_name }}</td>
                  <td>{{ item.dept?.name }}</td>
                  <td>{{ formartDate(item.submit_time) }}</td>
                  <td>{{ formartDate(item.delivery_time) }}</td>
                  <td>{{ item.contract_no }}</td>
                  <td :style="[index == 13 ? 'page-break-after:always' : '']">
                    {{ item.note }}
                  </td>
                </tr>
              </tbody>
            </table> -->
            <!-- <div v-if="!tableData.length" class="table-empty">
              <span class="table-empty-text">暂无数据</span>
            </div> -->
            <el-table :data="tableData" border stripe height="720">
              <el-table-column label="#" type="index"></el-table-column>
              <el-table-column prop="barcode" label="货品条码" align="center"></el-table-column>
              <el-table-column prop="title" label="名称" align="center"></el-table-column>
              <el-table-column prop="spec" label="规格型号" align="center"></el-table-column>
              <el-table-column prop="brand" label="品牌" align="center"></el-table-column>
              <el-table-column prop="class_name" label="分类" align="center"></el-table-column>
              <el-table-column prop="measure_name" label="单位" align="center"></el-table-column>
              <el-table-column prop="num" label="采购数量" align="center"></el-table-column>
              <el-table-column prop="price" label="采购单价" align="center"></el-table-column>
              <el-table-column prop="sub_total" label="小计" align="center"></el-table-column>
              <el-table-column prop="sup_name" label="供应商" align="center"></el-table-column>
              <el-table-column
                prop="demand_depts"
                label="需求部门"
                align="center"
              ></el-table-column>
              <el-table-column prop="submit_time" label="提交日期" align="center">
                <template #default="{ row, $index }">
                  {{ formartDate(row.submit_time) }}
                </template>
              </el-table-column>
              <el-table-column prop="delivery_time" label="交货期" align="center">
                <template #default="{ row, $index }">
                  {{ formartDate(row.delivery_time) }}
                </template>
              </el-table-column>
              <el-table-column prop="contract_no" label="合同号" align="center"></el-table-column>
              <el-table-column prop="note" label="备注" align="center"></el-table-column>
            </el-table>
            <div class="mt-[20px]">
              <div class="mb-[20px]">合计: {{ all_price }}元</div>
              <div>
                <span>采购事由：{{ purpose || "无" }}</span>
              </div>
              <span>备注：{{ note || "无" }}</span>
              <div class="no-print flex items-center">
                <span>附件：</span>
                <look-file v-if="file_info.src" :file_info="file_info"></look-file>
                <span v-else>无</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 待采购 -->
        <div v-show="currentIndex == 1" class="no-print">
          <el-table :data="awaitData" border stripe height="840">
            <el-table-column prop="barcode" label="货品条码" align="center"></el-table-column>
            <el-table-column prop="title" label="名称" align="center"></el-table-column>
            <el-table-column prop="spec" label="规格型号" align="center"></el-table-column>
            <el-table-column prop="brand" label="品牌" align="center"></el-table-column>
            <el-table-column prop="class_name" label="分类" align="center"></el-table-column>
            <el-table-column prop="measure_name" label="单位" align="center"></el-table-column>
            <el-table-column prop="num" label="采购数量" align="center"></el-table-column>
            <el-table-column prop="rem_num" label="待入库数量" align="center"></el-table-column>
            <el-table-column prop="price" label="采购单价" align="center"></el-table-column>
            <el-table-column prop="sub_total" label="小计" align="center"></el-table-column>
            <el-table-column prop="sup_name" label="供应商" align="center"></el-table-column>
            <el-table-column prop="demand_depts" label="需求部门" align="center"></el-table-column>
            <el-table-column prop="submit_time" label="提交日期" align="center">
              <template #default="{ row, $index }">
                {{ formartDate(row.submit_time) }}
              </template>
            </el-table-column>
            <el-table-column prop="delivery_time" label="交货期" align="center">
              <template #default="{ row, $index }">
                {{ formartDate(row.delivery_time) }}
              </template>
            </el-table-column>
            <el-table-column prop="contract_no" label="合同号" align="center"></el-table-column>
            <el-table-column prop="note" label="备注" align="center"></el-table-column>
          </el-table>
        </div>
        <!-- 退货信息 -->
        <div v-show="currentIndex == 2" class="no-print">
          <template v-for="(item, index) in ret_list" :key="item.id">
            <div class="w-[50%]">
              <div class="mb-[10px]">
                <div class="flex justify-between text-[14px] mb-[4px]">
                  <span>采购退货单号</span>
                  <span class="font-bold">{{ getStatus(item.status) }}</span>
                </div>
                <div class="text-[14px]">
                  <span class="inline-block mr-[20px]">{{ item.procure_ret_no }}</span>
                  <span>{{ item.create_time }}</span>
                </div>
              </div>
              <el-table
                :data="item.goods"
                border
                stripe
                :cell-style="{ 'text-align': 'center' }"
                :header-cell-style="{ 'text-align': 'center' }"
                height="840"
              >
                <el-table-column label="条码" prop="barcode" />
                <el-table-column label="名称" prop="title" />
                <el-table-column label="规格型号" prop="spec" />
                <el-table-column label="单位" prop="measure_name" />
                <el-table-column label="退货数量" prop="ret_num" />
                <el-table-column label="供应商" prop="sup_name" />
                <el-table-column label="备注" prop="note" />
              </el-table>
            </div>
          </template>
          <div v-if="ret_list.length === 0" class="w-[50%] text-center min-h-[840px] text-[18px]">
            暂无退货信息
          </div>
        </div>
        <!-- 入库信息 -->
        <div v-show="currentIndex == 3" class="no-print h-[860px] overflow-auto">
          <template v-for="(item, index) in in_list" :key="item.id">
            <div class="w-[50%] mb-4">
              <div class="mb-[10px]">
                <div class="flex justify-between text-[14px] mb-[4px]">
                  <span>采购入库单号</span>
                  <span class="font-bold">{{ getStatus(item.status) }}</span>
                </div>
                <div class="text-[14px]">
                  <span class="inline-block mr-[20px]">{{ item.wh_in_no }}</span>
                  <span>{{ item.create_time }}</span>
                </div>
              </div>
              <el-table
                :data="item.goods"
                border
                stripe
                :cell-style="{ 'text-align': 'center' }"
                :header-cell-style="{ 'text-align': 'center' }"
              >
                <el-table-column label="名称" prop="title" />
                <el-table-column label="规格型号" prop="spec" />
                <el-table-column label="入库数量" prop="in_num" />
              </el-table>
            </div>
          </template>
          <div v-if="in_list.length === 0" class="w-[50%] text-center min-h-[840px] text-[18px]">
            暂无入库信息
          </div>
        </div>
        <!-- 单据日志 -->
        <div v-show="currentIndex == 4" class="no-print">
          <el-table
            :data="logData"
            border
            stripe
            style="width: 50%"
            :cell-style="{ 'text-align': 'center' }"
            :header-cell-style="{ 'text-align': 'center' }"
            height="840"
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
              v-hasPerm="['buy:order:edit']"
              size="large"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              class="w-[100px]"
              @click="cellSubmitAudit"
              v-hasPerm="['buy:order:submit']"
              size="large"
            >
              提交审核
            </el-button>
            <el-button
              class="w-[100px]"
              @click="handleVoid"
              v-hasPerm="['buy:order:void']"
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
              v-hasPerm="['buy:order:recall']"
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
            v-hasPerm="['buy:order:void']"
            size="large"
            >作废</el-button
          >
        </template> -->
          <!-- 已作废状态时 -->
          <template v-else-if="status == 6">
            <el-button
              class="w-[100px]"
              @click="cellDel"
              v-hasPerm="['buy:order:del']"
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
              v-hasPerm="['buy:order:approve']"
              size="large"
            >
              通过
            </el-button>
            <el-button
              class="w-[100px]"
              type="warning"
              @click="cellReject"
              v-hasPerm="['buy:order:reject']"
              size="large"
            >
              驳回
            </el-button>
          </template>
        </template>
      </div>
    </div>
    <CardHint :msg="errMsg" title="采购单详情" @back="handleBack" v-else></CardHint>
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
.row-class {
  transform: scale(0.5);
}
</style>
