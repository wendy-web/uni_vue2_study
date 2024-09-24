<template>
  <transition name="fade-transform" mode="out-in">
    <KeepAlive :include="['SupplierManageList']">
      <component
        :is="comName"
        @aboutList="handleListChange"
        @aboutAdd="handleAddChange"
        @aboutDetail="handleDetailChange"
        :formInfo="info"
        :detailForm="detailForm"
      ></component>
    </KeepAlive>
  </transition>
</template>
<script lang="ts">
export default {
  name: "BuySupplierManage",
};
</script>

<script setup lang="ts">
import List from "./list.vue";
import Add from "./add.vue";
import Detail from "./detail.vue";
import { ISupItem } from "@/api/buy/sup/types";
const state = reactive({
  comType: 1, //  1是list 2是新建/编辑 3是详情
  info: {}, //编辑信息
  detailForm: {}, // 详情预览页 信息
});

const { comType, info, detailForm } = toRefs(state);
const comMap = new Map();
comMap.set(1, List);
comMap.set(2, Add);
comMap.set(3, Detail);

// 监听list页面的事件
const handleListChange = (val: number, formInfo?: ISupItem) => {
  //  val为1是点击新建按钮 2是点击编辑
  comType.value = 2;
  info.value = val == 2 ? formInfo! : {};
};

// 监听add页面的事件
const handleAddChange = (val: number, formInfo?: ISupItem) => {
  //  val为1是点击取消 2是点击保存
  if (val == 1) {
    comType.value = 1;
  } else {
    comType.value = 3;
    detailForm.value = formInfo!;
  }
};

// 监听详情页面返回按钮的事件
const handleDetailChange = () => {
  comType.value = 1;
};

const comName = computed(() => {
  return comMap.get(comType.value);
});
</script>

<style scoped lang="scss"></style>
