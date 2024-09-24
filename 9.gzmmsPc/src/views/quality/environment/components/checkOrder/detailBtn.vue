<script setup lang="ts">
import { isCreateUser } from "@/utils/auth";

interface Props {
  /** 页面类型-新建/编辑/详情 */
  pageType: number;
  /** 单据状态 */
  status: number;
  /** 单据创建人id */
  ctUid: number;
  /**
   * @explain 用来判断是哪个单据的,
   * @单据类型 1、CIP灌装间卫生检查表 2、在线检测设备验证表 3、生产灭蝇灯检查记录
   * */
  orderType?: number;
}

const props = withDefaults(defineProps<Props>(), {
  pageType: 0,
  status: 0,
  ctUid: NaN,
  orderType: 0,
});

const emits = defineEmits(["cancel", "submit", "reverse", "delete", "report"]);

const btnPermsMap = new Map();
/** 1、CIP灌装间卫生检查表 */
btnPermsMap.set(1, {
  del: ["environment:ciphygiene:del"], //删除
  reverse: ["'environment:ciphygiene:reverse"], //反审
});

/** 2、在线检测设备验证表 */
btnPermsMap.set(1, {
  del: ["environment:onlineverify:del"], //删除
  reverse: ["'environment:onlineverify:reverse"], //反审
});

/** 3、生产灭蝇灯检查记录 */
btnPermsMap.set(3, {
  del: ["environment:flylamp:del"], //删除
  reverse: ["'environment:flylamp:reverse"], //反审
});

/** 根据传入的key-获取按钮权限标识 */
function getBtnPerm(key: string) {
  let btnPermsValue = btnPermsMap.get(props.orderType);
  // console.log("🚀 ~ getBtnPerm ~ btnPermsValue:", btnPermsValue);
  let permList = btnPermsValue?.[key] || [];
  // console.log("🚀 ~ getBtnPerm ~ permList:", permList);
  return permList;
}

/** 点击返回按钮 */
function handleCancel() {
  emits("cancel");
}

/** 点击签字提交按钮 */
function handleSubmit() {
  emits("submit");
}

/** 点击反审按钮 */
function handleReverse() {
  emits("reverse");
}

/** 点击删除按钮 */
function handleDel() {
  emits("delete");
}
/** 点击生成报告按钮 */
// function handleReport() {
//   emits("report");
// }
</script>
<template>
  <el-affix :offset="90" class="!w-full">
    <el-card shadow="always" :body-style="{ padding: '10px' }" class="w-full">
      <el-button @click="handleCancel">返回</el-button>
      <!-- 如果是编辑页面则可以 签字提交和删除该单据 -->
      <template v-if="pageType === 2">
        <el-button type="primary" @click="handleSubmit">签字提交</el-button>
        <template v-if="status == 0 && isCreateUser(ctUid)">
          <!-- 当前是创建人且单据状态为0待检的时候 -->
          <el-button type="primary" @click="handleDel" v-hasPerm="getBtnPerm('del')">
            删除
          </el-button>
        </template>
      </template>
      <template v-if="pageType === 3 && status == 3">
        <!-- 如果是详情页,且状态为3已完成 -->
        <el-button type="primary" @click="handleReverse" v-hasPerm="getBtnPerm('reverse')">
          反审核
        </el-button>
        <!-- <el-button type="primary" @click="handleReport">生成报告</el-button> -->
      </template>
    </el-card>
  </el-affix>
</template>
<style lang="scss" scoped></style>
