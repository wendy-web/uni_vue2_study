<script setup lang="ts">
/* 选择系统页面 */
import { useRouter } from "vue-router";
// 获取permissionStore中的数据
import { usePermissionStoreHook } from "@/store/modules/permission";
import { useTagsViewStore } from "@/store/modules/tagsView";
// 获取userStore中的数据
import { useUserStoreHook } from "@/store/modules/user";

const tagsViewStore = useTagsViewStore();
const router = useRouter();
const userStore = useUserStoreHook();
const permissionStore = usePermissionStoreHook();

const pageList = ref([
  {
    systemName: "物料管理系统",
    systemImg: new URL("@/assets/img/switch/wuliao.png", import.meta.url).href,
    systemType: 0,
  },
  {
    systemName: "设备管理系统",
    systemImg: new URL("@/assets/img/switch/shebei.png", import.meta.url).href,
    systemType: 1,
    // systemType: -1,
  },
  {
    systemName: "安全管理系统",
    systemImg: new URL("@/assets/img/switch/anquan.png", import.meta.url).href,
    systemType: 2,
    // systemType: -1,
  },
  {
    systemName: "质量管理系统",
    systemImg: new URL("@/assets/img/switch/zhiliang.png", import.meta.url).href,
    systemType: 3,
    // systemType: -1,
  },
  {
    systemName: "生产管理系统",
    systemImg: new URL("@/assets/img/switch/shengchan.png", import.meta.url).href,
    systemType: -1,
  },
  {
    systemName: "能源管理系统",
    systemImg: new URL("@/assets/img/switch/nengyuan.png", import.meta.url).href,
    systemType: 5,
    // systemType: -1,
  },
]);

async function targetPage(type: number, name: string) {
  if (type === -1) return;
  userStore.setModuleType(type);
  await permissionStore.getMenuList();
  router.push("/dashboard");
  ElMessage.success(`欢迎使用${name}`);
}

onMounted(() => {
  tagsViewStore.delAllViews();
});
</script>
<template>
  <div class="page-container">
    <div class="page-header">
      <img src="@/assets/img/switch/header_title.png" alt="" class="page-header-img" />
    </div>
    <div class="page-main">
      <template v-for="(item, index) in pageList" :key="index">
        <div
          :class="['page-item', item.systemType === -1 ? '!cursor-not-allowed' : '']"
          @click="targetPage(item.systemType, item.systemName)"
        >
          <span class="page-item-title">{{ item.systemName }}</span>
          <img :src="item.systemImg" alt="" />
          <el-button
            type="primary"
            round
            class="page-item-btn primary"
            v-if="item.systemType !== -1"
          >
            点击进入
          </el-button>
          <el-button type="info" round class="page-item-btn" disabled v-else>敬请期待</el-button>
        </div>
      </template>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@media only screen and (max-width: 1920px) {
  .page-main {
    grid-column-gap: 40px !important;
  }
  .page-header {
    &-img {
      width: 500px;
      margin-top: 20px !important;
    }
  }
}

.page-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .page-header {
    width: 100%;
    height: 110px;
    background: url("@/assets/img/switch/header_bg.png") no-repeat;
    background-size: 100% 100%;
    flex-shrink: 0;
    margin-bottom: 40px;
    &-img {
      margin: 0 auto;
      margin-top: 10px;
    }
  }
  .page-main {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-column-gap: 80px;
    // padding: 0 100px 160px;
    padding: 0 100px;
    // padding-bottom: 40px;
    .page-item {
      cursor: pointer;
      background: linear-gradient(to right, #edecfe, #ddeffd);
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 40px 0;
      margin-bottom: 40px;
      &-title {
        display: block;
        width: 80%;
        text-align: center;
        color: #038cf8;
        font-size: 38px;
        font-weight: bold;
        letter-spacing: 6px;
      }
      &-btn {
        width: 50%;
        height: 60px;
        border-radius: 40px;
        font-size: 24px;
        &.primary {
          background-color: #038cf8;
        }
      }
    }
  }
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // .sub-item {
  //   flex-shrink: 0;
  //   display: flex;
  //   flex-direction: column;
  //   align-items: center;
  //   margin-left: 100px;
  //   &-title {
  //     font-size: 20px;
  //     font-weight: bold;
  //   }
  // }
}
</style>
