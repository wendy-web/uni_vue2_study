<script setup lang="ts">
import { IApprover } from "@/api/system/types";
// 获取userStore中的数据
import { useUserStoreHook } from "@/store/modules/user";

interface Props {
  flowType: number;
  approverList: any[];
  copyList: IApprover[];
  warehouse?: IApprover[];
  nowVal?: number;
}

const props = withDefaults(defineProps<Props>(), {
  flowType: 2,
  approverList: () => [],
  copyList: () => [] as IApprover[],
  warehouse: () => [] as IApprover[],
  nowVal: 100,
});
const userStore = useUserStoreHook();

const emit = defineEmits([
  "aboutAdd",
  "aboutDel",
  "aboutCopyFor",
  "aboutWarehouse",
  "aboutMultiSet",
]);

// 点击+号添加触发事件
function clickAdd(index: number, id: number = 0) {
  // emit("aboutAdd", index, id);
  if (userStore.module_type === 3) {
    emit("aboutMultiSet", index);
  } else {
    emit("aboutAdd", index, id);
  }
}
// 点击x删除触发事件
function clickDel(id: number) {
  emit("aboutDel", id);
}
// 点击抄送人触发事件
function clickCopyFor() {
  emit("aboutCopyFor");
}

// 点击仓库确认人触发事件
function clickWarehouse() {
  emit("aboutWarehouse");
}
/** 质量管理系统点击设置审核人 */
function clickMultipleSet(index: number) {
  emit("aboutMultiSet", index);
}

onMounted(() => {
  // console.log(props);
});
</script>

<template>
  <!-- <div class="app-container" > -->
  <div class="flow-container" :style="`transform: scale(${nowVal / 100});`">
    <div class="node-wrap-box text-center leading-[72px]">开始</div>
    <!-- 无加号按钮的竖线框 -->
    <div class="add-node-btn-box"></div>
    <div class="node-wrap-box text-center leading-[72px]">提交</div>
    <!-- 带加号按钮的竖线框 -->
    <div class="add-node-btn-box">
      <div class="add-node-btn">
        <el-tooltip effect="dark" content="点击添加审核人" placement="right">
          <button class="btn" type="button" @click="clickAdd(NaN)">
            <el-icon color="#ffffff" size="16"><i-ep-plus /></el-icon>
          </button>
        </el-tooltip>
      </div>
    </div>
    <!-- 审核人 -->
    <template v-for="(item, index) in approverList" :key="index">
      <div v-if="userStore.module_type === 3" class="node-wrap-box">
        <div class="node-wrap-audit">
          <svg-icon icon-class="usera" class="mr-[6px]"></svg-icon>
          <span>审核人</span>
          <!-- <el-tooltip effect="dark" content="点击删除该项所有审核人" placement="right">
            <i-ep-Close class="close" @click="clickDelAll(item.id)"></i-ep-Close>
          </el-tooltip> -->
        </div>
        <div class="node-wrap-content" @click="clickMultipleSet(index)">
          <div v-for="(subItem, subIndex) in item" :key="subItem.id">
            <span>{{ subItem.name }}</span>
            <span v-if="subItem.dept_name">【{{ subItem.dept_name }}】</span>
            <span v-if="subIndex < item.length - 1">，</span>
          </div>
          <i-ep-ArrowRight />
        </div>
      </div>
      <div class="node-wrap-box" v-else>
        <div class="node-wrap-audit">
          <svg-icon icon-class="usera" class="mr-[6px]"></svg-icon>
          <span>审核人</span>
          <el-tooltip effect="dark" content="点击删除审核人" placement="right">
            <i-ep-Close class="close" @click="clickDel(item.id)"></i-ep-Close>
          </el-tooltip>
        </div>
        <div class="node-wrap-content" @click="clickAdd(index, item.id)">
          <span>
            <span>{{ item.name }}</span>
            <span v-if="item.dept_name">【{{ item.dept_name }}】</span>
          </span>

          <i-ep-ArrowRight />
        </div>
      </div>

      <div class="add-node-btn-box">
        <div class="add-node-btn">
          <el-tooltip effect="dark" content="点击添加审核人" placement="right">
            <button class="btn" type="button" @click="clickAdd(index + 1)">
              <el-icon color="#ffffff" size="16"><i-ep-plus /></el-icon>
            </button>
          </el-tooltip>
        </div>
      </div>
    </template>
    <!-- 仓库人员 -->
    <template v-if="flowType == 2">
      <div class="node-wrap-box">
        <div class="node-wrap-copy storage">
          <span>
            <svg-icon icon-class="cangku2" class="mr-[6px]"></svg-icon>
            <span>仓库确认人</span>
          </span>
          <span>已设置：{{ warehouse.length }}人</span>
        </div>
        <div class="node-wrap-content" @click="clickWarehouse">
          <div v-if="warehouse.length > 0">
            <div v-for="(item, index) in warehouse">
              <span>{{ item.name }}</span>
              <span v-if="item.warehouse_name">【{{ item.warehouse_name }}】</span>
              <span v-if="index < warehouse.length - 1">，</span>
            </div>
          </div>
          <span v-else>设置仓库确认人</span>
          <el-icon><i-ep-ArrowRight /></el-icon>
        </div>
      </div>
      <div class="add-node-btn-box"></div>
    </template>

    <!-- 抄送人 -->
    <div class="node-wrap-box">
      <div class="node-wrap-copy copy">
        <span>
          <svg-icon icon-class="guide" class="mr-[6px]"></svg-icon>
          <span>抄送人</span>
        </span>
        <span>已设置：{{ copyList.length }}人</span>
      </div>
      <div class="node-wrap-content" @click="clickCopyFor">
        <div v-if="copyList.length > 0">
          <span v-for="(item, index) in copyList">
            <span>{{ item.name }}</span>
            <span v-if="item.dept_name">【{{ item.dept_name }}】</span>
            <span v-if="index < copyList.length - 1">,</span>
          </span>
        </div>
        <span v-else>点击设置抄送人</span>
        <el-icon><i-ep-ArrowRight /></el-icon>
      </div>
    </div>
    <div class="add-node-btn-box"></div>
    <div class="node-wrap-box text-center leading-[72px]">结束</div>
  </div>
  <!-- </div> -->
</template>

<style scoped lang="scss">
// 流程样式开始
.flow-container {
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  transform-origin: 50% 0px 0px;
  padding-top: 40px;
  padding-right: 100px;
  // 每个节点盒子的样式开始
  .node-wrap-box {
    position: relative;
    min-width: 220px;
    max-width: 880px;
    min-height: 72px;
    flex-shrink: 0;
    // background: #fff;
    background: var(--el-fill-color-blank);
    border-radius: 4px;
    box-shadow: 0 2px 2px 0 #ccc;
    border: 1px solid #e5e5e5;
    &:hover {
      .node-wrap-audit {
        .close {
          display: block;
        }
      }
    }
    /* 抄送人头部的样式开始 */
    .node-wrap-copy {
      height: 20px;
      font-size: 12px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      color: #ffffff;
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
      &.storage {
        background-color: #4b5563;
        border: 1px solid #4b5563;
      }
      &.copy {
        background-color: #ff943e;
        border: 1px solid #ff943e;
      }
    }
    /* 抄送人头部的样式结束 */
    .node-wrap-content {
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
    }
    /* 审核人头部的样式开始 */
    .node-wrap-audit {
      height: 20px;
      background: #3296fa;
      font-size: 12px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      border: 1px solid #3296fa;
      color: #ffffff;
      padding-left: 10px;
      position: relative;
      .close {
        display: none;
        position: absolute;
        right: 0px;
        top: 0;
        font-size: 16px;
        &:hover {
          cursor: pointer;
        }
      }
    }
    /* 审核人头部的样式结束 */
  }
  /* +号按钮盒子的样式开始 */
  .add-node-btn-box {
    width: 240px;
    height: 70px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-bottom: 10px;
    box-sizing: border-box;
    // 竖线
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      // z-index: -1;
      margin: auto;
      width: 2px;
      // background-color: #cacaca;
      background-color: var(--el-color-info-light-5);
    }
    // 向下箭头
    &::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: -5px;
      transform: translateX(-50%);
      width: 0;
      height: 4px;
      border-style: solid;
      border-width: 8px 6px 4px;
      border-color: var(--el-color-info-light-5) transparent transparent transparent;
      // background: var(--el-color-info-light-5);
    }
    // +号按钮的样式
    .add-node-btn {
      user-select: none;
      width: 240px;
      display: flex;
      justify-content: center;
      flex-shrink: 0;
      .btn {
        outline: none;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        width: 30px;
        height: 30px;
        background: #3296fa;
        border-radius: 50%;
        position: relative;
        border: none;
        line-height: 32px;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        .iconfont {
          color: #fff;
          font-size: 16px;
        }
        &:hover {
          transform: scale(1.3);
          box-shadow: 0 13px 27px 0 rgba(0, 0, 0, 0.1);
        }
        &:active {
          transform: none;
          background: #1e83e9;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
  /* +号按钮盒子的样式结束 */
}
</style>
