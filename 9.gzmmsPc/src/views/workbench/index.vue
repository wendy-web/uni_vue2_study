<template>
  <div class="app-container">
    <!-- <el-card
      shadow="always"
      :body-style="{ padding: '20px' }"
      class="mb-[10px]"
    >
      <div class="header-content flex items-center justify-between">
        <div class="flex items-center">
          <el-image
            class="w-12 mr-4"
            :src="userStore.avatar"
            fit="fill"
            :lazy="true"
          ></el-image>
          <span>{{ userStore.nickname }}</span>
        </div>
        <span>{{ meridian }}</span>
        <div>
          <span>{{ formatted }}</span>
        </div>
      </div>
    </el-card> -->
    <el-row :gutter="20">
      <el-col :span="16" :offset="0">
        <div class="work-card pt-[24px] h-[969px] mb-[20px]">
          <span class="block font-bold text-[20px] pl-[24px] mb-[10px]">待办事项</span>
          <div class="list flex items-center flex-wrap">
            <div v-for="(item, index) in wait_list" :key="index" class="item mb-[20px]">
              <el-badge :value="item.num" :max="99">
                <img
                  :src="getAssetsFile(item.img_url)"
                  alt=""
                  class="w-[80px] h-[80px] block mb-[12px]"
                />
              </el-badge>
              <span class="text-gray-500">{{ item.name }}</span>
            </div>
          </div>
        </div>
        <!-- <div class="work-card pt-[24px] h-[397px]">
          <span class="block font-bold text-[20px] pl-[24px] mb-[10px]"
            >快捷操作</span
          >
          <div class="fast-list flex items-center flex-wrap">
            <div v-for="(item, index) in fast_list" :key="index" class="item">
              <img
                :src="getAssetsFile(item.img_url)"
                alt=""
                class="w-[80px] h-[80px] block mb-[12px]"
              />

              <span class="text-gray-500">{{ item.name }}</span>
            </div>
          </div>
        </div> -->
      </el-col>
      <el-col :span="8" :offset="0">
        <div class="work-card pt-[20px] mb-[20px] h-[332px] flex flex-col justify-between">
          <div class="flex">
            <span class="font-bold text-[20px] pl-[20px]">库存预警</span>
            <img src="@/assets/img/qietu/yujing.png" alt="" class="w-[30px] ml-[10px]" />
          </div>
          <div class="warning-list flex items-center justify-between py-[50px]">
            <div class="warning-item flex-1 text-center cursor-pointer" @click="openDrawer">
              <span class="block text-[64px]">3</span>
              <span class="text-gray-500">低于订货点</span>
            </div>
            <div class="warning-item flex-1 text-center cursor-pointer" @click="openDrawer">
              <span class="block text-[64px]">1</span>
              <span class="text-gray-500">低于安全库存</span>
            </div>
            <div class="warning-item flex-1 text-center cursor-pointer" @click="openDrawer">
              <span class="block text-[64px]">3</span>
              <span class="text-gray-500">0库存</span>
            </div>
          </div>
        </div>
        <div class="work-card h-[617px] py-[24px] px-[40px]">
          <span class="block font-bold app-title pb-[10px] text-[20px]">新消息</span>
          <div class="news-list mt-[10px]">
            <div
              class="news-item flex items-center justify-between cursor-pointer hover:bg-gray-200"
            >
              <span>采购单（CG123456）被驳回</span>
              <el-icon><ArrowRightBold /></el-icon>
            </div>
            <div
              class="news-item flex items-center justify-between cursor-pointer hover:bg-gray-200"
            >
              <span>采购单（CG123456）被驳回</span>
              <el-icon><ArrowRightBold /></el-icon>
            </div>
            <div
              class="news-item flex items-center justify-between cursor-pointer hover:bg-gray-200"
            >
              <span>采购单（CG123456）被驳回</span>
              <el-icon><ArrowRightBold /></el-icon>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-drawer v-model="drawerSwitch" size="50%">
      <template #header>
        <h4>库存预警</h4>
      </template>
      <template #default>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick" stretch>
          <el-tab-pane label="低于订货点" name="first">
            <el-table :data="tableData" border stripe style="width: 100%">
              <el-table-column prop="title" label="名称" />
              <el-table-column prop="spec" label="规格型号" />
              <el-table-column prop="barcode" label="条码" />
              <el-table-column prop="brand" label="品牌" />
              <el-table-column prop="class_name" label="分类" />
              <el-table-column prop="measure_name" label="计量单位" />
              <el-table-column prop="num" label="可用库存" />
              <el-table-column prop="num" label="订货点" />
              <el-table-column prop="num" label="安全库存" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="低于安全库存" name="second"></el-tab-pane>
          <el-tab-pane label="0库存" name="third"></el-tab-pane>
        </el-tabs>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ArrowRightBold } from "@element-plus/icons-vue";
// 状态管理依赖
import { useUserStore } from "@/store/modules/user";

import { useNow, useDateFormat } from "@vueuse/core";

import type { TabsPaneContext } from "element-plus";

const state = reactive({
  drawerSwitch: false, //抽屉弹窗开关
  tableData: [
    {
      title: "不锈钢",
      spec: "G1/8-6",
      barcode: "69123456",
      brand: "苹果牌",
      class_name: "备件",
      measure_name: "个",
      num: 10,
    },
  ],
  wait_list: [
    {
      num: 88,
      name: "采购待审批",
      img_url: "cgdsp.png",
      path: "",
    },
    {
      num: 11,
      name: "采购待入库",
      img_url: "cgdrk.png",
      path: "",
    },
    {
      num: 22,
      name: "采购入库待审批",
      img_url: "cgrkdsp.png",
      path: "",
    },
    {
      num: 1,
      name: "退货待审批",
      img_url: "thdsp.png",
      path: "",
    },
    {
      num: 2,
      name: "退货出库待审批",
      img_url: "thckdsp.png",
      path: "",
    },
    {
      num: 2,
      name: "领料待审批",
      img_url: "lldsp.png",
      path: "",
    },
    {
      num: 2,
      name: "领料出库待确认",
      img_url: "llckdqr.png",
      path: "",
    },
    {
      num: 2,
      name: "退料待审批",
      img_url: "tldsp.png",
      path: "",
    },
    {
      num: 2,
      name: "退料出库待确认",
      img_url: "tlckdqr.png",
      path: "",
    },
    {
      num: 2,
      name: "调拨待审批",
      img_url: "dbdsp.png",
      path: "",
    },
    {
      num: 2,
      name: "调拨待确认",
      img_url: "dbdqr.png",
      path: "",
    },
    {
      num: 2,
      name: "盘点待审批",
      img_url: "pddsp.png",
      path: "",
    },
    {
      num: 2,
      name: "报废待审批",
      img_url: "bfdsp.png",
      path: "",
    },
  ],
  fast_list: [
    {
      name: "新建采购单",
      img_url: "xjcgd.png",
      path: "",
    },
    {
      name: "新建采购退货单",
      img_url: "xjcgthd.png",
      path: "",
    },
    {
      name: "新建采购入库单",
      img_url: "xjcgrkd.png",
      path: "",
    },
    {
      name: "新建退货出库单",
      img_url: "xjthckd.png",
      path: "",
    },
    {
      name: "新建领料出库单",
      img_url: "xjllckd.png",
      path: "",
    },
    {
      name: "新建退料入库单",
      img_url: "xjtlrkd.png",
      path: "",
    },
    {
      name: "新建调拨单",
      img_url: "xjdbd.png",
      path: "",
    },
    {
      name: "新建盘点单",
      img_url: "xjpdd.png",
      path: "",
    },
    {
      name: "新建报废单",
      img_url: "xjbfd.png",
      path: "",
    },
  ],
});

const { wait_list, fast_list, drawerSwitch, tableData } = toRefs(state);

const formatted = useDateFormat(new Date(), "YYYY-MM-DD  dddd");
const formatedMeridian = useDateFormat(useNow(), "A");
const userStore = useUserStore();

const meridian = computed(() => {
  return formatedMeridian.value == "PM" ? "下午好☕！" : "上午好☕！";
});

const activeName = ref("first");

// 打开抽屉弹窗
const openDrawer = () => {
  drawerSwitch.value = true;
};

const handleClick = (tab: TabsPaneContext, event: Event) => {
  // console.log(tab, event)
};

const getAssetsFile = (url: string) => {
  // let img_url = `../../assets/img${url}`;
  return new URL(`../../assets/img/qietu/${url}`, import.meta.url).href;
};
</script>

<style lang="scss" scoped>
.work-card {
  border-radius: 5px;
  box-shadow: var(--el-box-shadow-light);
  border: 1px solid #ddd;
  background-color: var(--el-bg-color);
}

.app-title {
  border-bottom: 1px solid #dedede;
}

.news-item {
  border-bottom: 1px solid #dedede;
  padding: 10px 0;
}

.list {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  justify-items: center;
  .item {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
}
.fast-list {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  justify-items: center;
  .item {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
}
</style>
