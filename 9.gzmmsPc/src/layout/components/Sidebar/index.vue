<script setup lang="ts">
import { useAppStore } from "@/store/modules/app";
import { usePermissionStore } from "@/store/modules/permission";
import { useSettingsStore } from "@/store/modules/settings";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRoute } from "vue-router";
// 获取userStore中的数据
import { useUserStoreHook } from "@/store/modules/user";
import variables from "@/styles/variables.module.scss";
import AppLink from "./Link.vue";
import Logo from "./Logo.vue";
import SidebarItem from "./SidebarItem.vue";

const userStore = useUserStoreHook();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const appStore = useAppStore();

const { sidebarLogo } = storeToRefs(settingsStore);
const route = useRoute();

const isCollapse = computed(() => !appStore.sidebar.opened);

const activeMenu = computed<string>(() => {
  const { meta, path } = route;
  if (meta?.activeMenu) {
    return meta.activeMenu as string;
  }
  return path;
});

const subVersionNumber = computed(() => {
  if (userStore.module_type === 0) {
    return "";
  } else {
    // return !isCollapse.value ? "© v1.0.0 天兴诚科技" : "v1.0.0";
    return !isCollapse.value ? "© v1.0.0 天兴诚科技" : "v1.0.0";
  }
});

// console.log("我是permissionStore.routes", permissionStore.routes);
</script>

<template>
  <div :class="{ 'has-logo': sidebarLogo }">
    <logo v-if="sidebarLogo" :collapse="isCollapse" />
    <el-scrollbar>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.newMenubg"
        :text-color="variables.newMenuText"
        :active-text-color="variables.newMenuActiveText"
        :unique-opened="userStore.module_type == 3"
        :collapse-transition="false"
        mode="vertical"
      >
        <!-- <app-link to="/workbench">
          <el-menu-item index="/workbench">
            <svg-icon icon-class="homepage" />
            <template #title>工作台</template>
          </el-menu-item>
        </app-link> -->
        <app-link to="/dashboard">
          <el-menu-item index="/dashboard">
            <svg-icon icon-class="homepage" />
            <template #title>首页</template>
          </el-menu-item>
        </app-link>
        <!-- <sidebar-item
          v-for="route in permissionStore.routes"
          :item="route"
          :key="route.path"
          :base-path="route.path"
          :is-collapse="isCollapse"
        /> -->
        <sidebar-item
          v-for="route in permissionStore.routes"
          :item="route"
          :key="route.id"
          :base-path="route.page_path ?? ''"
          :is-collapse="isCollapse"
        />
      </el-menu>
    </el-scrollbar>
    <!-- <div class="bottom-version" :class="[!isCollapse ? 'indent-[20px]' : 'indent-[4px]']">
      {{ !isCollapse ? subVersionNumber : subVersionNumber }}
    </div> -->
  </div>
</template>
