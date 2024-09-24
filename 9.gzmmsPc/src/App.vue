<script setup lang="ts">
// import zhCn from "element-plus/lib/locale/lang/zh-cn";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import plusZhCn from "plus-pro-components/es/locale/lang/zh-cn";
import { ReDialog } from "@/components/ReDialog";
import { useUpdate } from "@/hooks/ipcRender";
import { useAppStore } from "@/store/modules/app";

const locale = {
  ...zhCn,
  ...plusZhCn,
};

const appStore = useAppStore();
onMounted(() => {
  let userAgent = navigator.userAgent.toLowerCase();
  let isElectron = userAgent.indexOf(" electron/") > -1;
  // console.log("isElectron,isElectron", isElectron);
  if (isElectron) {
    useUpdate();
  }
});
</script>

<template>
  <el-config-provider :locale="locale" :size="appStore.size">
    <router-view />
    <ReDialog />
  </el-config-provider>
</template>
<style>
/* 滚动条样式 */
::-webkit-scrollbar {
  /*整体样式*/
  width: 10px;
  height: 9px;
}
::-webkit-scrollbar-thumb {
  /*滚动条小方块*/
  border-radius: 10px;
  /* background-color: #2e75d3; */
  background-color: var(--el-color-info-light-5);
}
</style>
