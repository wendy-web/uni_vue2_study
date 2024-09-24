<script setup lang="tsx">
/* 本组件为: 质量管理系统(品质系统)--通用审批流程组件 */
import { getProListApi } from "@/api/quality/common";

interface Props {
  /** 单据id */
  id: number;
  /** 单据类型 1、空罐卷封检验报告 2、内涂模检验报告 3、顶盖/底盖检验报告 4、热缩膜检验报告 5、纸皮进货验报告 
   * 6、原料标签标识报告 7、空罐进货检验报告8、战马空罐检验报告 9、原材料使用通知单  10、液体糖检验报告
   * 11、成品糖酸检测报告 12、理化及微生物检验报告 13、pH和成分分析检验单 14、成品卷封检验报告 15、成品标签标识报告
   * 16、成品二维码确认单 17、红牛成品检验结果 18、战马成品检验结果 19、成品发货通知单 21、定量测定原始记录
   * 22、产品定量检测报告 23、成品检测报告 24、香精入厂检测单 33、外箱二维码检验报告 34、CIP微生物检验报告
   * 35、水处理微生物检验报告 36、天平校准记录 37、标准样罐入库记录 
   * 38、空罐照相设备验证表 39、灌装封口机清洗记录 40、灌装间空气沉降检测 41、称配料空气沉降检测 42、化验室空气沉降检测 
   * 43、洁净间悬浮粒子检测 44、手部涂抹实验检验 45、生产部指膜实验 46、配料洁净间浮游菌检测 47、化验室空气浮游菌检测
   * 
   **/
  orderType: number;
  /** 类型: 默认1 为新建, 2为预览,3为详情,4列表,目前来说没啥用 */
  type?: number;
  /** 单据状态 */
  orderStatus?: number;
}

const props = withDefaults(defineProps<Props>(), {
  id: 0,
  order_type: 0,
  type: 1,
  orderStatus: 0,
});

const state = reactive({
  loadingStatus: false,
  copy_status: 0, //抄送人状态 同上
});

const { loadingStatus, copy_status } = toRefs(state);

/** 记录审批人数据 */
const approverList = ref<any[]>([]);
/** 记录抄送人数据 */
const copyList = ref<any[]>([]);
/** 记录仓库确认人数据 */
const warehouseList = ref<any[]>([]);
/** 判断发起人状态 */
const checkInitiatorStatus = computed(() => {
  return props.orderStatus ? true : false;
});
/** 判断审批人状态 */
const checkApproveStatus = computed(() => {
  let status = checkInitiatorStatus.value;
  let len = approverList.value.length;
  return len === 0 && status ? true : false;
});

async function getData() {
  loadingStatus.value = true;
  const result = await getProListApi({ id: props.id, type: props.orderType });
  // console.log(result);
  const res = result.data;
  approverList.value = res.approver || [];
  copyList.value = res.copy || [];
  // warehouseList.value = res.warehouse;
  copy_status.value = res.copy_status;
  loadingStatus.value = false;
}

/** 检查审核状态,同组下的所有审批人,只要其中一个审核了,即表示已审核 */
function checkAnyoneApproveStatus(list: any[]) {
  let res = list.some((item) => item.approver_status === 1);
  return res;
}

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
                {/* {item.warehouse_name ? (
                  <span class="desc-content-title">{item.warehouse_name}：</span>
                ) : null} */}
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

// onMounted(() => {
//   getData();
// });
watch(
  () => props.id,
  () => {
    getData();
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div class="approve-flow">
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
          <li class="item-title">发起人</li>
          <li class="item-desc">制单人</li>
        </ul>
        <span class="line" :class="checkInitiatorStatus ? 'flow-line-primary' : ''"></span>
      </div>
      <!-- 审批人的样式 遍历 -->
      <template v-if="approverList.length > 0">
        <div class="flow-item" v-for="(item, index) in approverList" :key="index">
          <ul class="item-content">
            <i-ep-CircleCheck
              class="flow-icon-primary"
              v-if="checkAnyoneApproveStatus(item)"
            ></i-ep-CircleCheck>
            <li class="item-circle" v-else></li>
            <li class="item-title" :class="dynamicTitleClass(item.approver_status)">审批人</li>
            <!-- <li class="item-desc">{{ item.name + `【${item.dept_name}】` }}</li> -->
            <li class="item-desc">
              <div class="desc-content" :key="subItem.id" v-for="(subItem, subIndex) in item">
                <span>{{ subItem.name + `【${subItem.dept_name}】` }}</span>
              </div>
            </li>
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
      <!-- 抄送人的样式 -->
      <div class="flow-item">
        <ul class="item-content">
          <component :is="renderCopy()"></component>
        </ul>
        <span class="line" :class="dynamicLineClass(copy_status)"></span>
      </div>
      <div class="flow-item">
        <ul class="item-content">
          <i-ep-CircleCheck class="flow-icon-success" v-if="orderStatus == 2"></i-ep-CircleCheck>
          <li class="item-circle" v-else></li>
          <li class="item-title" :class="orderStatus == 2 ? 'flow-text-success' : ''">结束</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$maxWidth: 380px;

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
  // height: 150px;
  // overflow: auto;
  position: relative;
  /* 流程标题样式 */
  .flow-header {
    font-weight: bold;
    margin-bottom: 20px;
    position: absolute;
    left: 20rpx;
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
