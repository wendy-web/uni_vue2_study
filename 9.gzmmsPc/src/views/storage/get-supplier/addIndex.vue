<script lang="ts">
import { perms } from "@/utils/auth";

export default {
  beforeRouteEnter(to, from, next) {
    let permsRes = perms(["sto:getsup:add", "sto:getsup:edit"]);
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
import { useRoute, useRouter } from "vue-router";
import { getWarehouseRecTypeApi } from "@/api/common/index";
import { ISupRecType } from "@/api/common/types";
import { IGetSupInfo } from "@/api/storage/get-supplier/types";
import { IAddEmit } from "@/api/storage/stotypes";
// 引入获取人员列表的hooks
import { getPlaceListHooks, userListHooks } from "@/hooks/index";
import { useTagsViewStore } from "@/store/modules/tagsView";
import Add from "./add.vue";
import Preview from "./preview.vue";
import { storageListHooks } from "@/hooks";

defineOptions({
  name: "StoGetSupAddIndex",
});

const { storageList } = storageListHooks();
const router = useRouter();
const route = useRoute();
const tagsViewStore = useTagsViewStore();

const { userList } = userListHooks();
const { placeList } = getPlaceListHooks();

const state = reactive({
  comType: 1, //  1是add新建 2是预览页
  preTableData: {} as IGetSupInfo, //传递给pre页面的数据
  listId: 0, //采购单id 传给详情页,add编辑页
  editFrom: 0, // 从哪个组件进入add编辑页的标识, 1是从list组件过去,2是detail组件过去, 0是pre组件返回过去的
  recTypeList: [] as ISupRecType[], //领料类型数据源
});

const { comType, preTableData, listId, editFrom, recTypeList } = toRefs(state);

const comMap = new Map();
comMap.set(1, Add);
comMap.set(2, Preview);

// 取跳转页面时传入的参数
editFrom.value = Number(route.query.editFrom) || 0;
listId.value = Number(route.query.id) || 0;

// 监听add页面的事件
const handleAddChange = (query: IAddEmit<IGetSupInfo>) => {
  let { val, preInfo } = query;
  // val, 1是点击取消按钮回到list页面 2是点击下一步去到preview页面,3是点击取消按钮去到详情页
  const addMap = new Map();
  addMap.set(1, function () {
    router.replace({
      path: "/storage/get-supplier",
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
      path: "/storage/get-supplier",
    });
    tagsViewStore.delView(route);
  });
  preMap.set(4, function () {
    router.replace({
      path: "/storage/get-supplier",
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
      title: "编辑领料出库单",
    });
    tagsViewStore.updateVisitedView(new_route);
  } else {
    const new_route = Object.assign({}, route, {
      title: "新建领料出库单",
    });
    tagsViewStore.updateVisitedView(new_route);
  }
};
const getSupRecType = async () => {
  const result = await getWarehouseRecTypeApi();
  recTypeList.value = result.data;
};

onActivated(() => {
  getSupRecType();
  initTagsView();
});
</script>

<template>
  <transition name="fade-transform" mode="out-in">
    <KeepAlive :include="['StoGetSupAdd']">
      <component
        :is="comName"
        @aboutAdd="handleAddChange"
        @aboutPre="handlePreChange"
        :preTableData="preTableData"
        :storageList="storageList"
        :listId="listId"
        :editFrom="editFrom"
        :userList="userList"
        :placeList="placeList"
        :recTypeList="recTypeList"
      ></component>
    </KeepAlive>
  </transition>
</template>

<style scoped lang="scss"></style>
