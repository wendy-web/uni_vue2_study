<script lang="ts" setup>
import { ref } from "vue";
import { useSettingsStore } from "@/store/modules/settings";

const settingsStore = useSettingsStore();

defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
});

// logo图片
const logo = ref<string>(new URL(`../../../assets/logo001.png`, import.meta.url).href);
// logo+标题的图片
// const logoAndTitle = ref<string>(
//   new URL(`../../../assets/img/qietu/logo_bg@2x.png`, import.meta.url).href
// );
</script>

<template>
  <!-- bg-gray-800 -->
  <div class="bg-[#1C53D9]">
    <transition>
      <!-- class="h-[50px] flex items-center justify-center" -->
      <router-link
        v-if="collapse"
        key="collapse"
        class="h-[68px] flex items-center justify-center"
        to="/"
      >
        <!-- class="w-5 h-5" -->
        <img v-if="settingsStore.sidebarLogo" :src="logo" class="h-[37px]" />
        <h1 v-else>{{ settingsStore.adminTitle }}</h1>
      </router-link>
      <!-- class="h-[50px] flex items-center justify-center" -->
      <router-link v-else key="expand" class="h-[68px] flex items-center justify-center" to="/">
        <img v-if="settingsStore.sidebarLogo" :src="logo" class="h-[37px]" />
        <span class="ml-3 text-white font-bold text-[18px]">{{ settingsStore.adminTitle }}</span>
      </router-link>
    </transition>
  </div>
</template>
