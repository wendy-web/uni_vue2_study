<script lang="ts">
import type { ComponentPublicInstance } from "vue";

interface VmInstance extends ComponentPublicInstance {
  setFullPath(fullPath: string): void;
}
export default {
  beforeRouteEnter(to, from, next) {
    // Do somethings
    next((vm) => {
      const instance = vm as VmInstance;
      instance.setFullPath(from.fullPath);
    });
  },
};
</script>

<script setup lang="ts">
import { reactive, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTagsViewStore } from "@/store/modules/tagsView";

defineOptions({
  name: "Page401",
});
const tagsViewStore = useTagsViewStore();

const state = reactive({
  errGif: new URL(`../../assets/401_images/401.gif`, import.meta.url).href,
  ewizardClap: "https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646",
  dialogVisible: false,
});

const { errGif } = toRefs(state);

const router = useRouter();

const fullPath = ref("");

function back() {
  // router.push("/workbench");
  router.push("/dashboard");
}

const setFullPath = (path: string) => {
  fullPath.value = path;
  if (tagsViewStore.visitedViews.length > 0) {
    tagsViewStore.visitedViews.forEach((item: any, index) => {
      console.log("item", item);
      if (item.fullPath == fullPath.value && !item.meta.affix) {
        const view = tagsViewStore.visitedViews[index];
        tagsViewStore.delView(view).then((res: any) => {});
      }
    });
  }
};
defineExpose({ setFullPath });
</script>

<template>
  <div class="errPage-container">
    <el-row>
      <el-col :span="12">
        <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream." />
      </el-col>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">Oops!</h1>

        <h2>您暂无该操作权限,请联系管理员添加</h2>

        <el-button class="pan-back-btn" @click="back" size="large">回到首页</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.errPage-container {
  width: 100%;
  height: 90vh;
  display: flex;
  justify-content: center;
  padding-top: 200px;
  background-color: #fff;
  margin-left: 20px;
  .pan-back-btn {
    background: #008489;
    color: #fff;
    border: none !important;
    margin-top: 40px;
  }

  .pan-gif {
    margin: 0 auto;
    display: block;
  }

  .pan-img {
    display: block;
    margin: 0 auto;
    width: 100%;
  }

  .text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
  }

  .list-unstyled {
    font-size: 14px;

    li {
      padding-bottom: 5px;
    }

    a {
      color: #008489;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
