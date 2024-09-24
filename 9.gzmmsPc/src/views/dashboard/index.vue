<template>
  <div class="app-container">
    <el-card shadow="always" :body-style="{ padding: '20px' }" class="dashboard-content">
      <div class="header-content flex items-center justify-between">
        <div class="flex items-center">
          <el-image class="w-12 mr-4" :src="userStore.avatar" fit="fill" :lazy="true"></el-image>
          <span>{{ userStore.nickname }}</span>
        </div>
        <!-- <span>{{ meridian }}欢迎使用{{ settingsStore.adminTitle }}</span> -->
        <span>{{ EasyTyperObj.output }}</span>
        <div>
          <span>{{ formatted }}</span>
        </div>
      </div>
    </el-card>
    <div class="notice">
      <backlog @refresh="clickRefresh"></backlog>
      <div class="grow max-w-[440px] h-full">
        <warningInfo v-hasPerm="['goods:stock:list']" ref="warningInfoRef" v-if="userStore.module_type === 0"></warningInfo>
        <news ref="newsRef" :isWarningInfo="isWarningInfo"></news>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: "Dashboard",
};
</script>
<script setup lang="ts">
// 状态管理依赖
import { useUserStore } from "@/store/modules/user";
import { useSettingsStore } from "@/store/modules/settings";
// 引入时间相关
import { useNow, useDateFormat } from "@vueuse/core";
// 引入 打字机 相关
import EasyTyper from "easy-typer-js";
// 引入待办和消息组件
import backlog from "./components/backlog.vue";
import news from "./components/news.vue";
import warningInfo from "./components/warningInfo.vue";

// 获取格式化时间
const formatted = useDateFormat(new Date(), "YYYY-MM-DD  dddd");
// const formatedMeridian = useDateFormat(useNow(), "A");
const formatedMeridian = useDateFormat(useNow(), "H");

const userStore = useUserStore();
const settingsStore = useSettingsStore();

const newsRef = ref<InstanceType<typeof news>>();
const warningInfoRef = ref();

const isWarningInfo = computed(() => {
  return warningInfoRef.value && warningInfoRef.value?.$el.clientHeight ? true : false;
});

const meridian = computed(() => {
  let hours = Number(formatedMeridian.value);
  if (hours >= 6 && hours <= 10) return `早上好☕！`;
  if (hours >= 11 && hours <= 14) return `中午好🌞！`;
  if (hours >= 15 && hours <= 18) return `下午好☕！`;
  if (hours >= 19 && hours <= 24) return `晚上好🌛！`;
  if (hours >= 0 && hours < 6) return `凌晨好🌛，注意休息！`;

  // return formatedMeridian.value == "PM" ? "下午好☕！" : "上午好☕！";
});
/* 打字机相关配置 */
const EasyTyperObj = reactive({
  output: "",
  isEnd: false,
  speed: 80,
  singleBack: false,
  sleep: 0,
  type: "normal",
  backSpeed: 40,
  sentencePause: false,
});

const clickRefresh = () => {
  newsRef.value!.handleRefresh();
};

onActivated(() => {
  const typed = new EasyTyper(
    EasyTyperObj,
    `${meridian.value}欢迎使用${settingsStore.adminTitle}`,
    () => {},
    () => {},
  );
});
</script>
<style lang="scss" scoped>
.dashboard-content {
  height: 88px;
}

/* 通知内容样式 */
.notice {
  display: flex;
  align-items: flex-start;
  margin-top: 4px;
  /* 减去 顶部内容98px 页面高度+nvabar高度共85px   */
  height: calc(100vh - 98px - 85px - 40px);
}
</style>
