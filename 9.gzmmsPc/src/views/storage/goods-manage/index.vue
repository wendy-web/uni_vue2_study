<template>
  <transition name="fade-transform" mode="out-in">
    <KeepAlive :include="['StoGoodsManageList', 'StoGoodsManageAdd']">
      <component
        :is="comName"
        @aboutList="handleListChange"
        @aboutEdit="handleEditChange"
        @aboutAdd="hanldleAddChange"
        @aboutDetail="handleDetailChange"
        :goodsId="goodsId"
        :detailForm="detailForm"
        :goodsCateList="goodsCateList"
        :unitList="unitList"
      ></component>
    </KeepAlive>
  </transition>
</template>
<script lang="ts">
export default {
  name: "StoGoodsManage",
};
</script>
<script setup lang="ts">
// 引入组件
import List from "./list.vue";
import Add from "./add.vue";
import Edit from "./edit.vue";
import Detail from "./detail.vue";
import { IGoodsItem } from "@/api/storage/goods-manage/types";
// 引入获取商品分类列表以及计量单位列表的hooks
import { goodsCateListHooks, unitListHooks } from "@/hooks";
const { goodsCateList } = goodsCateListHooks();
const { unitList } = unitListHooks();

const state = reactive({
  comType: 1, //  1是list 2是新建/编辑 3是详情
  // info: {}, //编辑信息
  detailForm: {}, // 详情预览页 信息
  goodsId: 0, //传递的商品id
});

const { comType, detailForm, goodsId } = toRefs(state);

const comMap = new Map();
comMap.set(1, List);
comMap.set(2, Edit);
comMap.set(3, Detail);
comMap.set(4, Add);

// 监听list页面的事件
// const handleListChange = (val: number, formInfo?: IGoodsItem) => {
const handleListChange = (val: number, id: number) => {
  //  val为1是点击新建按钮 2是点击编辑
  if (val == 1) {
    comType.value = 4;
  } else {
    comType.value = 2;
    // info.value = val == 2 ? formInfo! : {};
    goodsId.value = id;
  }
};

// 监听edit页面的事件
const handleEditChange = (val: number, formInfo?: IGoodsItem) => {
  //  val为1是点击取消 2是点击保存
  if (val == 1) {
    comType.value = 1;
  } else {
    comType.value = 3;
    detailForm.value = formInfo!;
  }
};

// 监听add页面的事件
const hanldleAddChange = (val: number) => {
  //  val为1是点击取消 2是点击保存
  comType.value = 1;
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
