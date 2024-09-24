<script setup lang="ts">
import { useRoute } from "vue-router";
import { useTagsViewStore } from "@/store/modules/tagsView";
import FooterVue from "./Footer/index.vue";

const _route = useRoute();
const tagsViewStore = useTagsViewStore();
</script>

<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in" appear>
        <keep-alive :include="tagsViewStore.cachedViews">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </transition>
    </router-view>
    <FooterVue />
  </section>
</template>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  // min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #f6f7fb;
}

// .fixed-header + .app-main {
//   // padding-top: 50px;
// }

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
    // min-height: 100vh;
  }

  // .fixed-header + .app-main {
  //   // padding-top: 84px;
  // }
}
</style>
