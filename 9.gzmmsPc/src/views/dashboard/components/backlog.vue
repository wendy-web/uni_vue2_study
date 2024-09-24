<script setup lang="ts">
import { getBacklogApi } from "@/api/workbench/index";
import type { IBacklogList } from "@/api/workbench/types";
import { useNoticeStore } from "@/store/modules/notice";
import { useUserStoreHook } from "@/store/modules/user";

const noticeStore = useNoticeStore();
const userStore = useUserStoreHook();

enum EDocumentType {
  "采购单" = 1,
  "采购退货单",
  "采购换货单",
  "采购入库单",
  "领料出库单",
  "其他出库单",
  "退料入库单",
  "拆装单",
  "调拨单",
  "盘点单",
  "报废单",
  "其他入库单",
}
enum EDocumentKey {
  "procure_no" = 1, // 采购单
  "procure_ret_no", // 采购退货单
  "replacement_no", // 采购换货单
  "wh_in_no", // 采购入库单
  "wh_rec_no", // 领料出库单
  "wh_ret_no", // 其他出库单
  "wh_recin_no", //退料入库单
  "split_assemble_no", //拆装单
  "wh_tra_no", //调拨单
  "wh_inv_no", //盘点单
  "wh_scr_no", //报废单
}
const emits = defineEmits(["refresh"]);

/** 分页查询参数 */
const pageQuery = reactive({
  page: 1,
  size: 10,
});
/** 总条数 */
const total = ref(1);

/** 待审批数量 */
const wait_approve_total = ref(0);
/** 待处理数量 */
const wait_handle_total = ref(0);
/** 我发起数量 */
const my_initiate_total = ref(0);

/** 待办列表 */
const backlogList = ref([] as IBacklogList[]);
/** 待办列表加载状态 */
const backlogLoading = ref(false);
/** 刷新状态 */
const refreshLoading = ref(false);

const listRef = ref<HTMLDivElement>();

/** 待办列表是否没有更多 */
const backlogNoMore = computed(() => backlogList.value.length >= total.value);
/** 待办列表是否禁用加载 */
const backlogDisabled = computed(() => backlogLoading.value || backlogNoMore.value);

/** 是否显示没有更多了 */
const showNoMore = computed(() => backlogList.value.length >= 6 && backlogNoMore.value);

/** 记录滚动条位置 */
let scrollTop = 0;

/** 根据单据type获取单据类型 */
const documentType = computed(() => {
  return (type: number) => EDocumentType[type];
});

/** 根据单据type获取单号的key */
const documentNo = computed(() => {
  return (type: number) => {
    if (type == 12) {
      return "wh_in_no";
    }
    return EDocumentKey[type];
  };
});

/** 根据单据状态返回 单据左侧标题 */
const documentTitle = computed(() => {
  return (status: number) => {
    switch (status) {
      case 0:
        return "待审批提醒";
      case 1:
        return "待仓库确认提醒";
      case 2:
        return "待确认领料提醒";
      case 3:
        return "我发起";
      case 4:
        return "待保养提醒";
      case 5:
        return "待巡检提醒";
      default:
        return "";
    }
  };
});

/** 根据单据状态返回 单据右侧状态名称 */
const statusTitle = computed(() => {
  return (status: number) => {
    if (status == 0) {
      return "待审批";
    } else if (status == 3) {
      return "我发起";
    } else {
      return "待处理";
    }
  };
});

/** 根据订单状态返回 单据右侧状态的背景色类名 */
const statusClass = computed(() => {
  return (status: number) => {
    if (status == 0) {
      return "warning";
    } else if (status == 3) {
      return "success";
    } else {
      return "primary";
    }
  };
});

const getData = async () => {
  const result = await getBacklogApi(toRaw(pageQuery));
  const res = result.data;
  wait_approve_total.value = res.wait_approve_total;
  wait_handle_total.value = res.wait_handle_total;
  my_initiate_total.value = res.my_initiate_total;
  total.value = res.total;
  if (res.list.length === 0) {
    total.value = 0;
  }
  backlogList.value = backlogList.value.concat(res.list);
  // console.log("backlogList.value", backlogList.value);
  refreshLoading.value = false;
};

const load = async () => {
  backlogLoading.value = true;
  pageQuery.page += 1;
  await getData();
  backlogLoading.value = false;
};

/** 点击单据详情 */
const { handleToTarget } = noticeStore;

onMounted(() => {
  getData();
});

const handleScroll = (event: Event) => {
  // console.log("event.target.scrollTop", (event.target as HTMLDivElement).scrollTop);
  scrollTop = (event.target as HTMLDivElement).scrollTop;
};

const handleRefresh = () => {
  refreshLoading.value = true;
  scrollTop = 0;
  pageQuery.page = 1;
  backlogList.value = [];
  emits("refresh");
  getData();
};

onActivated(() => {
  if (listRef.value) {
    listRef.value.scrollTop = scrollTop;
  }
});
</script>

<template>
  <el-card class="backlog">
    <div class="backlog-header">
      <div class="backlog-header-title">
        <i class="line"></i>
        <span class="line-text">我的审批</span>
        <el-button type="primary" @click="handleRefresh" class="refreshBtn" v-deBounce>
          <template #icon>
            <i-ep-Refresh></i-ep-Refresh>
          </template>
          刷新通知
        </el-button>
      </div>
      <div class="backlog-header-list">
        <div class="backlog-header-item warning">
          <span>待审批</span>
          <span class="backlog-num">{{ wait_approve_total }}</span>
        </div>
        <div class="backlog-header-item primary">
          <span>待处理</span>
          <span class="backlog-num">{{ wait_handle_total }}</span>
        </div>
        <div class="backlog-header-item success">
          <span>我发起</span>
          <span class="backlog-num">{{ my_initiate_total }}</span>
        </div>
      </div>
    </div>
    <div
      class="backlog-list"
      v-infinite-scroll="load"
      :infinite-scroll-disabled="backlogDisabled"
      v-if="backlogList.length > 0"
      @scroll="handleScroll"
      ref="listRef"
    >
      <div class="backlog-item" v-for="(item, index) in backlogList" :key="index">
        <p class="backlog-item-title">{{ documentTitle(item.operate_type) }}</p>
        <div class="backlog-item-status" :class="statusClass(item.operate_type)">
          {{ statusTitle(item.operate_type) }}
        </div>
        <ul class="backlog-item-content">
          <li class="sub-item">
            <span class="gray-text">单据类型：</span>
            <!-- <span class="font-bold">{{ documentType(item.document_type) }}</span> -->
            <span class="font-bold">{{ item.document_type_name }}</span>
          </li>
          <li class="sub-item">
            <span class="gray-text">单号：</span>
            <!-- <span>{{ item[documentNo(item.document_type) as keyof IBacklogList] }}</span> -->
            <span>{{ item.order_no }}</span>
          </li>
          <li class="sub-item">
            <span class="gray-text">制单人：</span>
            <span>{{ item.create_name || item.ct_name }}</span>
          </li>
          <li class="sub-item">
            <span class="gray-text">创建时间：</span>
            <span>{{ item.create_time }}</span>
          </li>
        </ul>
        <!-- 领料出库单专属内容 -->
        <ul class="backlog-item-content" v-if="item.document_type == 5">
          <li class="sub-item">
            <span class="gray-text">仓库：</span>
            <span>{{ item.warehouse }}</span>
          </li>
          <li class="sub-item">
            <span class="gray-text">领料申请人：</span>
            <span>{{ item.rp_names }}</span>
          </li>
          <li class="sub-item">
            <span class="gray-text">指定领取人：</span>
            <span>{{ item.ar_names }}</span>
          </li>
          <!-- 占位 -->
          <li class="sub-item"></li>
        </ul>
        <ul class="backlog-item-footer">
          <li class="sub-item" v-if="userStore.module_type === 0">
            <!-- 如果是物料系统 显示商品信息 -->
            <span class="gray-text">商品信息：</span>
            <span>{{ item.goods_details }}</span>
          </li>
          <template v-else>
            <!-- 如果是设备系统 显示以下信息 -->
            <li class="sub-item">
              <span class="gray-text">资产名称：</span>
              <span>{{ item.goods_details }}</span>
            </li>
            <li class="sub-item">
              <span class="gray-text">使用部门：</span>
              <span>{{ item.use_dept_names || "--" }}</span>
            </li>

            <template v-if="item.document_type == 14">
              <!-- 如果是维修单显示以下信息 -->
              <li class="sub-item">
                <span class="gray-text">维修负责人：</span>
                <span>{{ item.repair_names || "--" }}</span>
              </li>
              <li class="sub-item">
                <span class="gray-text">其他维修人：</span>
                <span>{{ item.other_repair_names || "--" }}</span>
              </li>
            </template>
            <template v-else-if="item.document_type == 15">
              <!-- 如果是保养工单显示以下信息 -->
              <li class="sub-item">
                <span class="gray-text">保养负责人：</span>
                <span>{{ item.director_names || "--" }}</span>
              </li>
              <li class="sub-item">
                <span class="gray-text">其他保养人：</span>
                <span>{{ item.other_names || "--" }}</span>
              </li>
            </template>
            <template v-else-if="item.document_type == 16">
              <!-- 如果是点巡检记录,显示以下信息 -->
              <li class="sub-item">
                <span class="gray-text">执行人：</span>
                <span>{{ item.executor_names || "--" }}</span>
              </li>
            </template>
          </template>

          <el-button type="primary" text @click="handleToTarget(item)">查看单据详情</el-button>
        </ul>
      </div>
      <p v-if="backlogLoading" class="backlog-list-hint">加载中...</p>
      <!-- <p v-if="backlogNoMore" class="backlog-list-hint">- 没有更多了 -</p> -->
      <p v-if="showNoMore" class="backlog-list-hint">- 没有更多了 -</p>
    </div>

    <div v-else v-loading="refreshLoading">
      <el-empty :image-size="200" description="暂无待办" v-if="!refreshLoading" />
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.gray-text {
  color: #909399;
}
.warning {
  background-color: var(--el-color-warning);
}
.primary {
  background-color: var(--el-color-primary);
}
.success {
  background-color: var(--el-color-success);
}
/* 蓝色线的样式 */
.line {
  display: inline-block;
  width: 4px;
  height: 18px;
  background-color: var(--el-color-primary);
  vertical-align: middle;
  margin-right: 4px;
}
/* 蓝色线右侧文本样式 */
.line-text {
  font-weight: bold;
}
/* 左侧待办样式 */
.backlog {
  flex: 1;
  // margin-right: 6px;
  min-width: 400px;
  height: 100%;
  /* 左侧待办头部内容 */
  .backlog-header {
    padding-bottom: 10px;
    border-bottom: 0.6px solid #e5e5e5;
    position: relative;
    .refreshBtn {
      position: absolute;
      right: 0;
      top: 0;
    }
    &-title {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    &-list {
      display: flex;
      align-items: center;
    }
    &-item {
      width: 100px;
      height: 70px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-right: 20px;
      border-radius: 4px;
      color: #fff;

      .backlog-num {
        font-weight: bold;
        font-size: 26px;
      }
    }
  }
  /* 左侧待办列表 */
  .backlog-list {
    margin-top: 10px;
    height: calc(100vh - 98px - 85px - 200px);
    // height: 960px;
    overflow-y: auto;
    // &::-webkit-scrollbar-thumb {
    //   background: transparent;
    // }
    &::-webkit-scrollbar {
      /*整体样式*/
      width: 6px;
      height: 9px;
    }
    .backlog-list-hint {
      text-align: center;
      font-size: 14px;
      color: var(--el-color-info);
    }
    .backlog-item {
      padding: 10px 20px;
      //   border-bottom: 1px solid #a8abb2;
      border: 1px solid #bccbff80;
      border-radius: 4px;
      position: relative;
      margin-bottom: 14px;
      &-status {
        position: absolute;
        top: 0;
        right: 0;
        width: 80px;
        height: 34px;
        // background-color: slateblue;
        color: #fff;
        text-align: center;
        line-height: 34px;
        font-size: 14px;
        box-shadow: -2px 2px 0 0 #bccbff80;
      }
      &-title {
        font-weight: bold;
        margin-bottom: 10px;
      }
      &-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-bottom: 10px;
      }
      .sub-item {
        font-size: 15px;
        flex: 1;
      }
      &-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
}
</style>
