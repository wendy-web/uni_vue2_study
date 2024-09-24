<script setup lang="ts">
import dayjs from "dayjs";
import { useUserStoreHook } from "@/store/modules/user";

// import { useSettingsStore } from "@/store/modules/settings";

// const settingsStore = useSettingsStore();
const userStore = useUserStoreHook();

const current_year = dayjs().year();
const versionMap = new Map();
/** 0物料,1设备,2安全,3质量 */
versionMap.set(0, "2.3.0"); //物料
versionMap.set(1, "1.1.0"); //设备
versionMap.set(2, "1.0.0"); //安全
versionMap.set(3, "1.0.0"); //质量
versionMap.set(4, "1.0.0"); //
versionMap.set(5, "1.0.0"); //

const versionText = computed(() => {
  return versionMap.get(userStore.module_type) || "1.x.0";
});
</script>
<template>
  <footer class="layout-footer">
    <span>2023-{{ current_year }}</span>
    <span>&nbsp;©&nbsp;</span>
    <span>v{{ versionText }}</span>
    <span class="footer-name">天兴诚科技</span>
  </footer>
</template>
<style lang="scss" scoped>
.layout-footer {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--el-text-color-secondary);
  pointer-events: none;
  .footer-name {
    display: inline-block;
    margin-left: 20px;
  }
}
</style>
