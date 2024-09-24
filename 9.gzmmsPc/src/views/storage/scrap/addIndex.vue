<script lang="ts">
// 报废单 addIndex页面
import { perms } from "@/utils/auth";

export default {
  beforeRouteEnter(to, from, next) {
    let permsRes = perms(["sto:scrap:add","sto:scrap:edit"]);
    if (permsRes) {
      next((vm) => {});
    } else {
      next({ name: from.name as any });
    }
  },
};
</script>
<script setup lang="ts">
// 引入类型
import { IScrapAddInfo } from "@/api/storage/scrap/types";
import { IAddEmit } from "@/api/storage/stotypes";
import Add from "./add.vue";
import Preview from "./preview.vue";
import { useRouter, useRoute } from "vue-router";
import { useTagsViewStore } from "@/store/modules/tagsView";

defineOptions({
  name: "StoScrapAddIndex",
});

const router = useRouter();
const route = useRoute();
const tagsViewStore = useTagsViewStore();

const state = reactive({
  comType: 1, //  1是add新建 2是预览页
  preTableData: {} as IScrapAddInfo, //传递给pre页面的数据
  listId: 0, //采购单id 传给详情页,add编辑页
  editFrom: 0, // 从哪个组件进入add编辑页的标识, 1是从list组件过去,2是detail组件过去, 0是pre组件返回过去的
});

const { comType, preTableData, listId, editFrom } = toRefs(state);

const comMap = new Map();
comMap.set(1, Add);
comMap.set(2, Preview);

// 取跳转页面时传入的参数
editFrom.value = Number(route.query.editFrom) || 0;
listId.value = Number(route.query.id) || 0;

// 监听add页面的事件
const handleAddChange = (query: IAddEmit<IScrapAddInfo>) => {
  let { val, preInfo } = query;
  // val, 1是点击取消按钮回到list页面 2是点击下一步去到preview页面,3是点击取消按钮去到详情页
  const addMap = new Map();
  addMap.set(1, function () {
    router.replace({
      path: "/storage/scrap",
    });
    tagsViewStore.delView(route);
  });
  addMap.set(2, function () {
    comType.value = 2;
    if (preInfo) {
      console.log("下一步的数据", preInfo);
      preTableData.value = preInfo;
    }
  });
  addMap.set(3, function () {
    router.back();
    tagsViewStore.delView(route);
  });
  let fn = addMap.get(val);
  fn();
};

// 监听预览页面的事件
const handlePreChange = (val: number) => {
  // val, 1是点击上一步按钮 回到add页面, 2是点击保存和提交审核回到列表页,4是点击返回列表
  const preMap = new Map();
  preMap.set(1, function () {
    comType.value = 1;
    editFrom.value = 0;
  });
  preMap.set(2, function () {
    router.replace({
      path: "/storage/scrap",
    });
    tagsViewStore.delView(route);
  });
  preMap.set(4, function () {
    router.replace({
      path: "/storage/scrap",
    });
    tagsViewStore.delView(route);
  });
  let fn = preMap.get(val);
  fn();
};

const comName = computed(() => {
  return comMap.get(comType.value);
});

const initTagsView = () => {
  // id存在表示是编辑页
  if (route.query.id) {
    const new_route = Object.assign({}, route, {
      title: "编辑报废单",
    });
    tagsViewStore.updateVisitedView(new_route);
  } else {
    const new_route = Object.assign({}, route, {
      title: "新建报废单",
    });
    tagsViewStore.updateVisitedView(new_route);
  }
};

onActivated(() => {
  initTagsView();
});
</script>
<template>
  <transition name="fade-transform" mode="out-in">
    <KeepAlive :include="['StoScrapAdd']">
      <component
        :is="comName"
        @aboutAdd="handleAddChange"
        @aboutPre="handlePreChange"
        :preTableData="preTableData"
        :listId="listId"
        :editFrom="editFrom"
      ></component>
    </KeepAlive>
  </transition>
</template>

<style scoped lang="scss"></style>
