<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import {
  getRetStockApproveApi,
  getRetStockDelApi,
  getRetStockRejectApi,
  getRetStockSubmitApi,
  getRetStockVoidApi,
  getRetStockWhApproveApi,
  getRetStockWhRejectApi,
  getRetStocksDetailApi,
  getRetStocksRecallApi,
} from "@/api/storage/ret-stocks/index";
import { formartDate } from "@/utils/validate";
import ApproveFlowGlobal from "@/components/ApproveLog/ApproveFlowGlobal.vue";
import { useTagsViewStore } from "@/store/modules/tagsView";
import { useDetail } from "./utils/detail";
import { useList } from "./utils/hook";

const { checkAssocType } = useList();
const { columns, logColumns } = useDetail();
const tagsViewStore = useTagsViewStore();
const route = useRoute();
const router = useRouter();

const errMsg = ref("暂无数据");
const state = reactive({
  listId: 0,
  assoc_type: [] as number[],
  tableData: [] as any[], //采购单详情,原始信息
  logData: [] as any[], //单据日志
  activeName: "tab-1",
  tabList: ["退库单详情", "单据日志"],
  currentIndex: 0,
  wh_inv_ret_no: "", //退库单号
  ct_name: "", //制单人
  create_time: "", //创建时间
  ret_time: "", //入库日期
  ret_name: "", //退货人
  ret_wh_name: "", //退入仓库
  ret_wh_id: undefined as FormNumType, //退入仓库id
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
  activeName,
  tabList,
  currentIndex,
  wh_inv_ret_no,
  ct_name,
  create_time,
  ret_time,
  file_info,
  status,
  note,
  loading,
  ret_name,
  ret_wh_name,
  ret_wh_id,
} = toRefs(state);

async function getData() {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "正在加载",
    background: "rgba(0, 0, 0, 0.1)",
  });

  try {
    loading.value = false;
    const result = await getRetStocksDetailApi({ id: listId.value });
    let res = result.data;
    tableData.value = res.goods;
    logData.value = res.act_log;
    assoc_type.value = res.assoc_type;
    wh_inv_ret_no.value = res.wh_inv_ret_no;
    ct_name.value = res.ct_name;
    create_time.value = res.create_time;
    ret_time.value = res.ret_time ? formartDate(res.ret_time) : "";
    ret_name.value = res.ret_name;
    ret_wh_name.value = res.ret_wh_name;
    ret_wh_id.value = res.ret_wh_id;
    status.value = res.status;
    note.value = res.note;
    file_info.value = res.file_info || file_info.value;
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
    path: "/storage/ret-stocks",
  });
  tagsViewStore.delView(route);
};

// 点击编辑按钮
const handleEdit = () => {
  router.push({
    path: "/storage/ret-stocks/add",
    query: {
      editFrom: 2,
      id: listId.value,
    },
  });
};

// 点击提审
const cellSubmitAudit = async () => {
  console.log("点击提审");
  const result = await getRetStockSubmitApi({ id: listId.value });
  ElMessage.success(result.msg);
  getData();
};

// 点击作废
const handleVoid = () => {
  console.log("点击作废", listId.value);
  ElMessageBox.confirm(`您确定要作废该退库单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      let result = await getRetStockVoidApi({ id: listId.value });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
};

// 点击撤回
const cellRecall = async () => {
  const result = await getRetStocksRecallApi({ id: listId.value });
  ElMessage.success(result.msg);
  getData();
};

// 点击删除
const cellDel = () => {
  ElMessageBox.confirm(`您确定要删除该报废单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      let result = await getRetStockDelApi({ id: listId.value });
      ElMessage.success(result.msg);
      handleBack();
    })
    .catch((error) => {
      console.log(error);
    });
};

// 点击通过
const cellApprove = async () => {
  const result = await getRetStockApproveApi({ id: listId.value });
  ElMessage.success(result.msg);
  getData();
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
        const result = await getRetStockRejectApi(data);
        ElMessage.success(result.msg);
        getData();
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// 点击仓库确认
async function cellwhApprove() {
  const result = await getRetStockWhApproveApi({ id: listId.value });
  ElMessage.success(result.msg);
  getData();
}

// 点击仓库驳回
async function cellwhReject() {
  const result = await getRetStockWhRejectApi({ id: listId.value });
  ElMessage.success(result.msg);
  getData();
}

enum EStatus {
  "待提审",
  "待审核",
  "待入库",
  "已完成",
  "已撤回",
  "已驳回",
  "已作废",
}
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
        <span>退库物料清单详情</span>
        <!-- <div class="print-btn cursor-pointer" @click="handlePrint">
          <svg-icon icon-class="print"></svg-icon>
          <span class="inline-block ml-[4px]">打印单据</span>
        </div> -->
      </div>
      <div class="mb-4 flex justify-between">
        <div>
          <ul class="flex mb-2">
            <li class="mr-4">
              <span>退库单号：</span>
              <span>{{ wh_inv_ret_no }}</span>
            </li>
            <li class="mr-4">
              <span>制单人：</span>
              <span>{{ ct_name }}</span>
            </li>
            <li>
              <span>创建时间：</span>
              <span>{{ create_time }}</span>
            </li>
          </ul>
          <ul class="flex">
            <li class="mr-4">
              <span>入库日期：</span>
              <span>{{ ret_time }}</span>
            </li>
            <li class="mr-4">
              <span>退货人：</span>
              <span>{{ ret_name }}</span>
            </li>
            <li>
              <span>退入仓库：</span>
              <span>{{ ret_wh_name }}</span>
            </li>
          </ul>
        </div>
        <div>
          <span class="code-status">{{ orderStatus }}</span>
        </div>
      </div>
      <tabs-header :tab-list="tabList" v-model="currentIndex"></tabs-header>
      <div v-show="currentIndex == 0">
        <PureTable border stripe :data="tableData" :columns="columns" height="620"></PureTable>
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
      <div v-show="currentIndex == 1">
        <PureTable
          :data="logData"
          :columns="logColumns"
          border
          stripe
          style="width: 50%"
          height="680"
        ></PureTable>
      </div>
      <div class="footer-btn mt-[20px] pb-[10px]">
        <el-divider />
        <el-button class="w-[100px]" size="large" @click="handleBack">返回</el-button>
        <!-- 当前为创建人 -->
        <template v-if="checkAssocType(assoc_type, 1)">
          <!-- 待提审状态时 -->
          <template v-if="status == 0 || status == 4 || status == 5">
            <el-button
              class="w-[100px]"
              size="large"
              @click="handleEdit"
              v-hasPerm="['sto:retstocks:edit']"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              class="w-[100px]"
              size="large"
              @click="cellSubmitAudit"
              v-hasPerm="['sto:retstocks:submit']"
            >
              提交审核
            </el-button>
            <el-button
              class="w-[100px]"
              size="large"
              @click="handleVoid"
              v-hasPerm="['sto:retstocks:void']"
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
              v-hasPerm="['sto:retstocks:recall']"
            >
              撤回
            </el-button>
          </template>
          <template v-else-if="status == 6">
            <el-button
              class="w-[100px]"
              size="large"
              @click="cellDel"
              v-hasPerm="['sto:retstocks:del']"
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
              v-hasPerm="['sto:retstocks:approve']"
            >
              通过
            </el-button>
            <el-button
              class="w-[100px]"
              type="warning"
              @click="cellReject"
              size="large"
              v-hasPerm="['sto:retstocks:reject']"
            >
              驳回
            </el-button>
          </template>
        </template>
        <!-- 当前为仓库确认人的时候 -->
        <template v-if="checkAssocType(assoc_type, 5)">
          <!-- 待审核状态时 -->
          <template v-if="status == 7">
            <el-button
              type="success"
              @click="cellwhApprove"
              v-hasPerm="['sto:retstocks:whapprove']"
            >
              仓库确认
            </el-button>
            <el-button type="warning" @click="cellwhReject" v-hasPerm="['sto:retstocks:whreject']">
              仓库驳回
            </el-button>
          </template>
        </template>
      </div>
      <div class="mt-[20px] no-print">
        <el-divider />
        <!-- 流程组件 -->
        <ApproveFlowGlobal
          :id="listId"
          :wh-id="ret_wh_id"
          :orderType="4"
          :pageType="3"
          :status="status"
          :max-height="200"
        ></ApproveFlowGlobal>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
