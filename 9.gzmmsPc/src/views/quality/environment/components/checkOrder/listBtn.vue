<script setup lang="ts">
import { del } from "@/api/quality/process-inspection/stop";
import { isCreateUser } from "@/utils/auth";

interface Props {
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
  status: 0,
  ctUid: NaN,
  orderType: 0,
});

const emits = defineEmits(["detail", "edit", "delete", "report"]);

const btnPermsMap = new Map();
/** 1、CIP灌装间卫生检查表 */
btnPermsMap.set(1, {
  detail: ["environment:ciphygiene:detail"], //详情
  add: ["environment:ciphygiene:add"], //新建
  execute: ["environment:ciphygiene:execute"], //执行
  del: ["environment:ciphygiene:del"], //删除
  reverse: ["'environment:ciphygiene:reverse"], //反审
});

/** 2、在线检测设备验证表 */
btnPermsMap.set(1, {
  detail: ["environment:onlineverify:detail"], //详情
  add: ["environment:onlineverify:add"], //新建
  execute: ["environment:onlineverify:execute"], //执行
  del: ["environment:onlineverify:del"], //删除
  reverse: ["'environment:onlineverify:reverse"], //反审
});

/** 3、生产灭蝇灯检查记录 */
btnPermsMap.set(3, {
  detail: ["environment:flylamp:detail"], //详情
  add: ["environment:flylamp:add"], //新建
  execute: ["environment:flylamp:execute"], //执行
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

/** 点击去详情,type:1 点击详情,type3点击反审核 */
function clickDetail(type: number) {
  emits("detail", type);
}

/** 点击编辑 */
function clickEdit() {
  emits("edit");
}

/** 点击删除 */
function clickDel() {
  emits("delete");
}

/** 点击生成报告 */
// function clickGenerateReport() {
//   emits("report");
// }
</script>
<template>
  <div class="btn-wrapper">
    <el-button type="primary" link @click="clickDetail(1)" v-hasPerm="getBtnPerm('detail')">
      详情
    </el-button>
    <template v-if="[0, 1, 2].includes(status)">
      <el-button type="primary" link @click="clickEdit" v-hasPerm="getBtnPerm('execute')">
        执行检查
      </el-button>
    </template>
    <template v-if="status === 0 && isCreateUser(ctUid)">
      <el-button type="info" link @click="clickDel" v-hasPerm="getBtnPerm('del')">删除</el-button>
    </template>
    <template v-if="status === 3">
      <el-button type="primary" link @click="clickDetail(3)" v-hasPerm="getBtnPerm('reverse')">
        反审
      </el-button>
      <!-- <el-button type="primary" link @click="clickGenerateReport">生成报告</el-button> -->
    </template>
  </div>
</template>
<style lang="scss" scoped></style>
