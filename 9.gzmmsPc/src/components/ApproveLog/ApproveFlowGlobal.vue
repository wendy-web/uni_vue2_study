<script setup lang="tsx">
/* 本组件为: 通用审批流程组件 */
//引入API
import { getFlowStepApi } from "@/api/common";

interface Props {
  /** 单据id */
  id: number;
  /** 单据类型；1：调拨单(未使用该组件,使用自有组件);2：采购入库单;3：其它入库单;4：退库清单 */
  orderType: number;
  /** 入库仓库id */
  whId: number;
  /** 类型: 默认1 为新建, 2为预览,3为详情,4列表 */
  pageType?: number;
  /** 单据状态 */
  status?: number;
  /** 最大高度 */
  maxHeight?: number;
}

const props = withDefaults(defineProps<Props>(), {
  id: 0,
  ordeType: 0,
  whId: 0,
  pageType: 1,
  status: 0,
});

const state = reactive({
  warehouse_status: 0, // 入库仓库确认状态 0：未处理（灰色）、1：已确认（蓝色）2：进行中（橙色）；
  loadingStatus: false,
  copy_status: 0, //抄送人状态 同上
});

const { warehouse_status, loadingStatus, copy_status } = toRefs(state);

/** 记录审批人数据 */
const approverList = ref<any[]>([]);
/** 记录抄送人数据 */
const copyList = ref<any[]>([]);
/** 记录仓库确认人数据 */
const warehouseList = ref<any[]>([]);
/** 判断发起人状态 */
const checkInitiatorStatus = computed(() => {
  return props.status ? true : false;
});
/** 判断审批人状态 */
const checkApproveStatus = computed(() => {
  let status = checkInitiatorStatus.value;
  let len = approverList.value.length;
  return len === 0 && status ? true : false;
});

async function getData() {
  loadingStatus.value = true;
  let id = props.id || undefined;
  const result = await getFlowStepApi({ id, type: props.orderType });
  console.log(result);
  const res = result.data;
  approverList.value = res.approver;
  copyList.value = res.copy;
  warehouseList.value = res.warehouse;
  warehouse_status.value = res.warehouse_status;
  copy_status.value = res.copy_status;
  loadingStatus.value = false;
}

/** 入库仓库确认人 */
const inWarehouseList = computed(() => {
  console.log("props.toWhId", props.whId);
  return warehouseList.value.filter((item) => {
    return item.warehouse_id.includes(props.whId);
  });
});

/** 动态返回title的类名 */
const dynamicTitleClass = (status: number) => {
  return status ? ["flow-text-primary", "item-title"] : ["item-title"];
};

/** 动态返回 line的类名 */
const dynamicLineClass = computed(() => {
  return (status: number) => {
    if (status) {
      return ["flow-line-primary"];
    } else {
      return [];
    }
  };
});

/** 入库仓库确认渲染组件 */
const renderToWh = () => {
  return (
    <>
      {warehouse_status.value ? (
        <i-ep-CircleCheck class="flow-icon-primary"></i-ep-CircleCheck>
      ) : (
        <li class="item-circle"></li>
      )}
      <li class={dynamicTitleClass(warehouse_status.value)}>入库仓确认</li>
      <li class="item-desc">
        {inWarehouseList.value.map((item, index) => {
          return (
            <div class="desc-content" key={item.id}>
              <span class="desc-content-title">{item.warehouse_name}：</span>
              <span>{item.name + `【${item.dept_name}】`}</span>
            </div>
          );
        })}
      </li>
      {inWarehouseList.value.length === 0 && props.pageType == 1 ? (
        !props.whId ? (
          <li class="item-desc">未选择入库仓库</li>
        ) : (
          <li class="item-desc !text-orange-500">未设置仓库确认人,请联系管理员添加</li>
        )
      ) : (
        ""
      )}
    </>
  );
};

/** 抄送人渲染组件 */
const renderCopy = () => {
  return (
    <>
      {/* 抄送人状态是否不为0,不为0显示√图标,否则灰色圆形 */}
      {copy_status.value ? (
        <i-ep-CircleCheck class="flow-icon-primary"></i-ep-CircleCheck>
      ) : (
        <li class="item-circle"></li>
      )}

      <li
        class={
          copy_status.value && copyList.value.length > 0
            ? ["flow-text-primary", "item-title"]
            : ["item-title"]
        }
      >
        抄送人
      </li>
      <li class="item-desc">
        {copyList.value.length > 0 ? (
          copyList.value.map((item, index) => {
            return (
              <div class="desc-content" key={item.id}>
                {item.warehouse_name ? (
                  <span class="desc-content-title">{item.warehouse_name}：</span>
                ) : null}
                <span>{item.name + `【${item.dept_name}】`}</span>
              </div>
            );
          })
        ) : (
          <li class="item-desc">未设置,自动跳过</li>
        )}
      </li>
    </>
  );
};

/** 是否设置了仓库确认人 */
const isNotsetWarehouse = () => {
  if (inWarehouseList.value.length === 0 && props.whId) {
    return true;
  } else {
    return false;
  }
};

defineExpose({
  isNotsetWarehouse: isNotsetWarehouse,
});

onMounted(() => {
  getData();
});
</script>

<template>
  <div
    class="approve-flow"
    :style="{ maxHeight: maxHeight ? `${maxHeight}px` : 'auto', overflowY: 'auto' }"
  >
    <p class="flow-header">流程</p>
    <div class="flow-content" v-loading="loadingStatus">
      <!-- 发起人的样式 -->
      <div class="flow-item">
        <ul class="item-content">
          <i-ep-CircleCheck
            class="flow-icon-primary"
            v-if="checkInitiatorStatus"
          ></i-ep-CircleCheck>
          <li class="item-circle" v-else></li>
          <li class="item-title">发起2213人</li>
          <li class="item-desc">制单人</li>
        </ul>
        <span class="line" :class="checkInitiatorStatus ? 'flow-line-primary' : ''"></span>
      </div>
      <!-- 审批人的样式 遍历 -->
      <template v-if="approverList.length > 0">
        <div class="flow-item" v-for="(item, index) in approverList" :key="item.id">
          <ul class="item-content">
            <i-ep-CircleCheck
              class="flow-icon-primary"
              v-if="item.approver_status"
            ></i-ep-CircleCheck>
            <li class="item-circle" v-else></li>
            <li class="item-title" :class="dynamicTitleClass(item.approver_status)">审批人</li>
            <li class="item-desc">{{ item.name + `【${item.dept_name}】` }}</li>
          </ul>
          <span class="line" :class="dynamicLineClass(item.approver_status)"></span>
        </div>
      </template>
      <!-- 未设置审批人时的显示 -->
      <div class="flow-item" v-else>
        <ul class="item-content">
          <i-ep-CircleCheck class="flow-icon-primary" v-if="checkApproveStatus"></i-ep-CircleCheck>
          <li class="item-circle" v-else></li>
          <li class="item-title">审批人</li>
          <li class="item-desc">未设置,自动跳过</li>
        </ul>
        <span class="line" :class="checkApproveStatus ? 'flow-line-primary' : ''"></span>
      </div>
      <!-- 入库仓确认人 -->
      <div class="flow-item">
        <ul class="item-content">
          <component :is="renderToWh()"></component>
        </ul>
        <span class="line" :class="dynamicLineClass(warehouse_status)"></span>
      </div>
      <!-- 抄送人的样式 -->
      <div class="flow-item">
        <ul class="item-content">
          <component :is="renderCopy()"></component>
        </ul>
        <span class="line" :class="dynamicLineClass(copy_status)"></span>
      </div>
      <div class="flow-item">
        <ul class="item-content">
          <i-ep-CircleCheck class="flow-icon-success" v-if="status == 3"></i-ep-CircleCheck>
          <li class="item-circle" v-else></li>
          <li class="item-title" :class="status == 3 ? 'flow-text-success' : ''">结束</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$maxWidth: 280px;

/* icon蓝色 */
.flow-icon-primary {
  // background-color: var(--el-color-primary);
  color: var(--el-color-primary);
  font-size: 24px;
}
/* icon绿色 */
.flow-icon-success {
  // background-color: var(--el-color-primary);
  color: var(--el-color-success);
  font-size: 24px;
}

/* 线条蓝色 */
.flow-line-primary {
  background-color: var(--el-color-primary) !important;
}

/* 文字蓝色 */
.flow-text-primary {
  color: var(--el-color-primary) !important;
}
/* 文字绿色 */
.flow-text-success {
  color: var(--el-color-success) !important;
}
/* 文字橙色 */
.flow-text-orange {
  color: var(--el-color-warning) !important;
}
.approve-flow {
  padding-left: 20px;
  position: relative;
  /* 流程标题样式 */
  .flow-header {
    font-weight: bold;
    margin-bottom: 20px;
    position: absolute;
    left: 20px;

    /* 流程标题左侧横线 */
    &::before {
      position: absolute;
      display: block;
      content: "";
      width: 2px;
      height: 24px;
      background-color: var(--el-color-primary);
      left: -10px;
      top: 0;
    }
  }
  /* 流程内容样式 */
  .flow-content {
    display: flex;
    .flow-item {
      position: relative;
      flex-shrink: 0;
      flex: 1;
      max-width: $maxWidth;
      .item-content {
        max-width: $maxWidth;
        display: flex;
        flex-direction: column;
        align-items: center;
        .item-circle {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background-color: var(--el-color-info-light-7);
        }
        .item-title {
          margin-top: 4px;
          font-weight: bold;
          color: #606266;
        }
        .item-desc {
          margin-top: 4px;
          color: #909399;
          font-size: 12px;
          text-align: center;
          .desc-content {
            text-align: center;
            margin-bottom: 4px;
            .desc-content-title {
              color: #606266;
              font-weight: bold;
            }
          }
        }
      }
      .line {
        position: absolute;
        // left: -40px;
        right: -40px;
        top: 13px;
        display: inline-block;
        // width: 100px;
        min-width: 80px;
        max-width: $maxWidth;
        height: 2px;
        background-color: var(--el-color-info-light-5);
      }
    }
  }
}
</style>
