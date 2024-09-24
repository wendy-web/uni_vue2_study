<script setup lang="ts">
/* 纸皮/标签图片配置页面 */
import type { TabPaneName } from "element-plus";
import { getImgConfigVersionListApi, getVersionMapApi } from "@/api/quality/common/index";
import { getImgConfigListApi } from "@/api/quality/standard-config/picture";
import ChildTab from "./components/childTab.vue";

defineOptions({
  name: "StandardConfigPicture",
});

/** 父级tabname绑定值 */
const parentActiveName = ref(0);
const childMap = ref({
  sku: "ND1-1",
  version_id: 0,
});
// 不同的sku 版本list
const versionList = ref<any>([]);
/** 记录接口返回的纸皮图片数据 */
const singleImg = ref("");
const multipleImg = ref({
  topImg: "",
  bottomImg: "",
  canImg: "",
});

const leatheroidLoading = ref(false);

/** 父级tabname切换事件 */
function parentTabChange(name: TabPaneName) {
  singleImg.value = "";
  parentActiveName.value = name as number;
  childMap.value.sku = "ND1-1";
  // console.log("parentTabChange：", name);
  // 获取版本配置
  initVersionConfig();
}

async function getData() {
  let data = {
    type: parentActiveName.value,
    class_type: childMap.value.sku,
    version_id: childMap.value.version_id,
  };
  leatheroidLoading.value = true;
  const result = await getImgConfigListApi(data);
  singleImg.value = result.data.can_body_img;
  multipleImg.value.canImg = result.data.can_body_img;
  multipleImg.value.bottomImg = result.data.bottom_cover_img;
  multipleImg.value.topImg = result.data.top_cover_img;
  leatheroidLoading.value = false;
}
// 获取版本列表
async function getVersionList() {
  const result = await getVersionMapApi();
  versionList.value = result.data.map((item: any) => {
    return {
      id: item.id,
      name: item.version_no + "/" + item.name,
    };
  });
}
// 版本号配置
const versionConfig = ref<any>();
// 初始化已配置的版本号
async function initVersionConfig() {
  let data = {
    type: parentActiveName.value,
    class_type: childMap.value.sku,
  };
  const result = await getImgConfigVersionListApi(data);
  versionConfig.value = result.data.map((item: any) => {
    let findItem = versionList.value.find((ver: any) => ver.id == item.version_id);
    let { name } = findItem || {};
    return {
      id: item.version_id,
      name: name ? name : item.version_no,
    };
  });
  // console.log("🚀 ~ initVersionConfig ~ :", versionConfig.value);

  // 如果有配置，默认获取第一个数据
  if (versionConfig.value.length > 0) {
    childMap.value.version_id = versionConfig.value[0].id;
    getData();
    return;
  }
  // 如果没有配置,清空数据
  if (parentActiveName.value == 0) {
    singleImg.value = "";
  } else {
    multipleImg.value.topImg = "";
    multipleImg.value.bottomImg = "";
    multipleImg.value.canImg = "";
  }
}
watch(
  childMap,
  (newValue) => {
    // console.log("watch childMap：", newValue);
  },
  {
    immediate: true,
    deep: true,
  },
);

onActivated(() => {
  // 初始化版本列表
  getVersionList();
  // 初始化版本配置
  initVersionConfig();
});
</script>
<template>
  <div class="app-container">
    <el-card shadow="always" :body-style="{ padding: '20px', height: 'calc(100vh - 160px)' }">
      <el-tabs tabPosition="left" v-model="parentActiveName" @tab-change="parentTabChange">
        <el-tab-pane label="纸皮" :name="0" v-loading="leatheroidLoading">
          <ChildTab
            :tabsType="0"
            :singleImg="singleImg"
            :childMap="childMap"
            :versionList="versionList"
            :versionConfig="versionConfig"
            @refresh="getData"
            @initConfig="initVersionConfig"
          ></ChildTab>
        </el-tab-pane>
        <el-tab-pane label="标签标识" :name="1">
          <ChildTab
            :tabsType="1"
            :childMap="childMap"
            :versionList="versionList"
            :versionConfig="versionConfig"
            @refresh="getData"
            @initConfig="initVersionConfig"
            v-bind="multipleImg"
          ></ChildTab>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-tabs--left) {
  height: 100%;
}
:deep(.el-tabs--left .el-tabs__content) {
  height: 100%;
}
:deep(.el-tab-pane) {
  height: 90%;
}
</style>
