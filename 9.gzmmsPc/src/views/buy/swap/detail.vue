<script setup lang="ts">
// 引入api
import printJS from "print-js";
import { useRoute, useRouter } from "vue-router";
import {
  approveSwapApi,
  delSwapApi,
  getSwapDetailApi,
  recallSwapApi,
  rejectSwapApi,
  submitSwapApi,
  voidSwapApi,
} from "@/api/buy/swap/index";
import { formartDate } from "@/utils/validate";
import CardHintVue from "@/components/CardHint/index.vue";
import { usePrint } from "@/hooks/print";
import { useTagsViewStore } from "@/store/modules/tagsView";
import { useDetail } from "./utils/hook";

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

const { printDetail } = usePrint();

const { state } = useDetail();
const {
  listId,
  assoc_type,
  logData,
  replacement_no,
  ct_name,
  create_time,
  file_info,
  note,
  status,
  loading,
  refundGoods,
  buyGoods,
  currentIndex,
  tabList,
  refundThead,
  buyThead,
} = toRefs(state);

const route = useRoute();
const router = useRouter();
const tagsViewStore = useTagsViewStore();
const errMsg = ref("暂无数据");

async function getData() {
  console.log("我触发了");
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "正在加载",
    background: "rgba(0, 0, 0, 0.1)",
  });
  try {
    loading.value = false;
    const result = await getSwapDetailApi({ id: listId.value });
    let res = result.data;
    replacement_no.value = res.replacement_no;
    ct_name.value = res.create_name;
    create_time.value = res.create_time;
    file_info.value = res.file_info;
    note.value = res.note;
    status.value = res.status;
    refundGoods.value = res.return_goods;
    buyGoods.value = res.replacement_goods;
    logData.value = res.log;
    loading.value = true;
    loadingInstance.close();
  } catch (error) {
    console.log("error");
    loadingInstance.close();
    if (error instanceof Error) {
      errMsg.value = error.message;
    }
  }
}

// 点击返回按钮
const handleBack = () => {
  router.replace({
    path: "/buy/swap",
  });
  tagsViewStore.delView(route);
};

// 点击编辑按钮
const handleEdit = () => {
  router.push({
    path: "/buy/swap/add",
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
    const result = await submitSwapApi({ id: listId.value });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击撤回
const cellRecall = async () => {
  try {
    const result = await recallSwapApi({ id: listId.value });
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
        let result = await voidSwapApi({ id: listId.value });
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
      let result = await delSwapApi({ id: listId.value });
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
    const result = await approveSwapApi({ id: listId.value });
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
          const result = await rejectSwapApi(data);
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
  let table = refundGoods.value.map((item) => {
    let { goods, ...rest } = item;
    return {
      barcode: item.goods.barcode,
      title: item.goods.title,
      spec: item.goods.spec,
      brand: item.goods.brand,
      class_name: item.goods.class_name,
      measure_name: item.goods.measure_name,
      sup_name: item.supplier.name,
      ...rest,
    };
  });

  let other_table = buyGoods.value.map((item) => {
    let { goods, ...rest } = item;
    return {
      barcode: item.goods.barcode,
      title: item.goods.title,
      spec: item.goods.spec,
      brand: item.goods.brand,
      class_name: item.goods.class_name,
      measure_name: item.goods.measure_name,
      sup_name: item.supplier.name,
      ...rest,
    };
  });
  let printData = {
    orderNo: `采购换货单号：${replacement_no.value}`,
    ctName: `创建人：${ct_name.value}`,
    ctTime: `创建时间：${create_time.value}`,
    detailName: "采购换货单详情",
    barcode: replacement_no.value,
    table_title: "退回商品",
    table,
    other_table,
    table_title_two: "换货商品",
  };
  printDetail(printData, "swap");
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
        <span>采购换货单详情</span>
        <div class="print-btn cursor-pointer" @click="handlePrint">
          <svg-icon icon-class="print"></svg-icon>
          <span class="inline-block ml-[4px]">打印单据</span>
        </div>
      </div>
      <div class="print-area" id="print-area">
        <div class="print-header">
          <div class="header-left">
            <div class="header-left-top">
              <span>采购换货单号：</span>
              <span>{{ replacement_no }}</span>
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
            <barcode :value="replacement_no" v-if="replacement_no"></barcode>
          </div>
        </div>
        <tabs-header :tab-list="tabList" v-model="currentIndex"></tabs-header>
        <!-- 采购换货单详情 -->
        <div v-show="currentIndex == 0">
          <div class="table-container">
            <el-tag size="large" type="info" effect="plain" class="!text-[14px] font-bold">
              退回商品
            </el-tag>
            <el-divider />
            <!-- <table cellspacing="0" cellpadding="0" border="0">
              <thead>
                <tr>
                  <td v-for="(item, index) in refundThead">{{ item }}</td>
                </tr>
              </thead>
              <tbody v-if="buyGoods.length">
                <tr v-for="(item, index) in refundGoods" style="page-break-inside: avoid">
                  <td>{{ item.goods?.barcode }}</td>
                  <td>{{ item.goods?.title }}</td>
                  <td>{{ item.goods?.spec }}</td>
                  <td>{{ item.goods?.brand }}</td>
                  <td>{{ item.goods?.class_name }}</td>
                  <td>{{ item.goods?.measure_name }}</td>
                  <td>{{ item.return_num }}</td>
                  <td>{{ item.supplier?.name }}</td>
                  <td>{{ item.depts?.name }}</td>
                  <td :style="[index == 13 ? 'page-break-after:always' : '']">
                    {{ item.note }}
                  </td>
                </tr>
              </tbody>
            </table> -->
            <el-table :data="refundGoods" border stripe height="360" scrollbar-always-on>
              <el-table-column label="#" type="index" />
              <el-table-column label="货品条码" prop="goods.barcode" />
              <el-table-column label="名称" prop="goods.title" />
              <el-table-column label="规格型号" prop="goods.spec" />
              <el-table-column label="品牌" prop="goods.brand" />
              <el-table-column label="分类" prop="goods.class_name" />
              <el-table-column label="单位" prop="goods.measure_name" />
              <el-table-column label="退货数量" prop="return_num" />
              <el-table-column label="供应商" prop="supplier.name" />
              <el-table-column label="需求部门" prop="depts.name" />
              <el-table-column label="备注" prop="note" />
            </el-table>

            <!-- <div class="mb-[20px]"> -->
            <el-tag
              size="large"
              type="info"
              effect="plain"
              class="!text-[14px] font-bold mt-[10px]"
            >
              换货商品
            </el-tag>
            <el-divider />
            <!-- <table cellspacing="0" cellpadding="0" border="0">
              <thead>
                <tr>
                  <td v-for="(item, index) in buyThead">{{ item }}</td>
                </tr>
              </thead>
              <tbody v-if="refundGoods.length">
                <tr v-for="(item, index) in buyGoods" style="page-break-inside: avoid">
                  <td>{{ item.goods?.barcode }}</td>
                  <td>{{ item.goods?.title }}</td>
                  <td>{{ item.goods?.spec }}</td>
                  <td>{{ item.goods?.brand }}</td>
                  <td>{{ item.goods?.class_name }}</td>
                  <td>{{ item.goods?.measure_name }}</td>
                  <td>{{ item.num }}</td>
                  <td>{{ item.price }}</td>
                  <td>{{ item.num }}</td>
                  <td>{{ item.supplier?.name }}</td>
                  <td>{{ item.depts?.name }}</td>
                  <td>{{ formartDate(item.submit_time) }}</td>
                  <td>{{ formartDate(item.delivery_time) }}</td>
                  <td>{{ item.contract_no }}</td>
                  <td :style="[index == 13 ? 'page-break-after:always' : '']">
                    {{ item.note }}
                  </td>
                </tr>
              </tbody>
            </table> -->
            <!-- </div> -->
            <el-table :data="buyGoods" border stripe height="360" scrollbar-always-on>
              <el-table-column label="#" type="index" />
              <el-table-column label="货品条码" prop="goods.barcode" />
              <el-table-column label="名称" prop="goods.title" />
              <el-table-column label="规格型号" prop="goods.spec" />
              <el-table-column label="品牌" prop="goods.brand" />
              <el-table-column label="分类" prop="goods.class_name" />
              <el-table-column label="单位" prop="goods.measure_name" />
              <el-table-column label="采购数量" prop="num" />
              <el-table-column label="采购单价" prop="price" />
              <!-- <el-table-column label="小计" prop="sub_total" >

              </el-table-column> -->
              <el-table-column label="供应商" prop="supplier.name" />
              <el-table-column label="需求部门" prop="depts.name" />
              <el-table-column label="提交日期" prop="submit_time">
                <template #default="scope">
                  <span>{{ formartDate(scope.row.submit_time) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="交货期" prop="delivery_time">
                <template #default="scope">
                  <span>{{ formartDate(scope.row.delivery_time) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="合同号" prop="contract_no" />
              <el-table-column label="备注" prop="note" />
            </el-table>

            <!-- <div v-if="!tableData.length" class="table-empty">
              <span class="table-empty-text">暂无数据</span>
            </div> -->
            <div class="mt-[20px]">
              <span>备注：{{ note || "无" }}</span>
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
            height="880px"
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
              size="large"
              v-hasPerm="['buy:swap:edit']"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              class="w-[100px]"
              @click="cellSubmitAudit"
              size="large"
              v-hasPerm="['buy:swap:submit']"
            >
              提交审核
            </el-button>
            <el-button
              class="w-[100px]"
              @click="handleVoid"
              size="large"
              v-hasPerm="['buy:swap:void']"
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
              v-hasPerm="['buy:swap:recall']"
            >
              撤回
            </el-button>
          </template>
          <!-- 已作废状态时 -->
          <template v-else-if="status == 6">
            <el-button class="w-[100px]" @click="cellDel" size="large" v-hasPerm="['buy:swap:del']">
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
              v-hasPerm="['buy:swap:approve']"
            >
              通过
            </el-button>
            <el-button
              class="w-[100px]"
              type="warning"
              @click="cellReject"
              size="large"
              v-hasPerm="['buy:swap:reject']"
            >
              驳回
            </el-button>
          </template>
        </template>
      </div>
    </div>
    <CardHint :msg="errMsg" title="采购换货单详情" @back="handleBack" v-else></CardHint>
  </div>
</template>
<style lang="scss" scoped>
@import "./utils/index.scss";
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
