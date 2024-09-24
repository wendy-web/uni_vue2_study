<script setup lang="ts">
import type { TabPaneName } from "element-plus";
import printJS from "print-js";
// 引入获取采购单详情api
import { orderDetailApi } from "@/api/buy/order/index";
import { useDrawer } from "./columns";
import { EStatus, Props } from "./type";

const props = defineProps<Props>();

let emits = defineEmits(["update:visible"]);
const { detailColumns, waitColumns, outColumns, inColumns, logsColumns } = useDrawer();

const activeName = ref("detail");
const tableLoading = ref(false);
const detailTable = ref<any[]>([]);
const waitTable = ref<any[]>([]); //待入库
const outTable = ref<any[]>([]); //退货信息
const inTable = ref<any[]>([]); //入库信息
const logsTable = ref<any[]>([]); //日志信息

const orderStatus = computed(() => {
  return EStatus[props.info.status];
});

//点击切换tabs
function handleTabsChange(name: TabPaneName) {
  // console.log("name", name);
  activeName.value = name as string;
}

//  请求数据
async function getDetail(id: number) {
  activeName.value = "detail";
  detailTable.value = [];
  waitTable.value = [];
  outTable.value = [];
  inTable.value = [];
  logsTable.value = [];
  try {
    tableLoading.value = true;
    const result = await orderDetailApi({ id });

    let res = result.data;
    detailTable.value = res.goods;
    waitTable.value = res.goods_wait;
    outTable.value = res.goods_yth;
    inTable.value = res.goods_yrk;
    logsTable.value = res.act_log;
  } finally {
    tableLoading.value = false;
  }
}

function getStatus(status: number | string) {
  return EStatus[Number(status)];
}

const visibleDrawer = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emits("update:visible", value);
  },
});

const elMap = new Map();

function handleBarcodeRef(el: any, index: number) {
  // console.log("el", el);
  if (el) {
    elMap.set(index, el);
  }
}
function cellPrint(index: number) {
  console.log("单元格点击打印");

  const img = elMap.get(index)?.barcodeImg;
  // console.log(" elMap.get(index)?.barcodeImg", elMap.get(index)?.barcodeImg);
  // console.log("img", img);
  const loading = ElLoading.service({
    lock: true,
    text: "正在启动打印服务",
  });

  // 解决打印对话框关闭后执行的回调函数触发问题
  // let focuser = setInterval(() => window.dispatchEvent(new Event("focus")), 500);
  setTimeout(() => {
    //size:  landscape(横向) portrait(竖向)
    printJS({
      printable: [img],
      type: "image",
      // style: `@page { margin: 0; padding:0;size:landscape} body: {margin: 0;padding:0;}`,
      style: `@media print {@page { margin: 0; padding:0;size:landscape} body: {margin: 0;padding:0;}}`,
      header: null,
      // imageStyle: `display: block;padding:0;margin-top:20px;margin-left:-16px;page-break-after: always;width:130%;`,
      imageStyle: `display: block;padding:0;margin-top:0px;margin-left:4px;width:96%;`,
      onPrintDialogClose: function () {
        // 在浏览器打印对话框关闭后执行的回调函数。
        // clearInterval(focuser);
        console.log("我关闭了");
      },
    });

    loading.close();
  }, 100);
}

watch(
  () => props.info.id,
  (newVal) => {
    console.log("newVal", newVal);
    if (newVal) {
      getDetail(newVal);
    }
  },
  {
    immediate: true,
  },
);
</script>
<template>
  <div>
    <el-drawer v-model="visibleDrawer" title="采购单详情" size="50%" :destroy-on-close="true">
      <div class="mb-[20px] flex items-center justify-between">
        <!-- <p class="font-bold mb-[10px]">采购单详情</p> -->
        <div>
          <div class="header-left-top text-primary">
            <span>采购单号：</span>
            <span>{{ info.procure_no }}</span>
          </div>
          <div class="flex">
            <div class="text-primary">
              <span>制单人：</span>
              <span>{{ info.ct_name }}</span>
            </div>
            <div class="text-primary ml-[10px]">
              <span>创建时间：</span>
              <span>{{ info.create_time }}</span>
            </div>
          </div>
        </div>
        <div class="header-right">
          <span class="code-status">{{ orderStatus }}</span>
        </div>
      </div>

      <el-tabs v-model="activeName" type="card" @tab-change="handleTabsChange">
        <el-tab-pane label="采购单详情" name="detail">
          <pure-table
            :data="detailTable"
            :columns="detailColumns"
            :loading="tableLoading"
            stripe
            border
          >
            <template #operation="{ row, $index }">
              <!-- <barcode :value="row.barcode" :ref="(el) => handleBarcodeRef(el, $index)"></barcode> -->
              <div class="flex flex-col items-center">
                <qrcode
                  :info="{
                    barcode: row.barcode,
                    title: row.title,
                    spec: row.spec,
                    content: row.barcode,
                  }"
                  :ref="(el) => handleBarcodeRef(el, $index)"
                ></qrcode>
                <el-button
                  type="primary"
                  size="default"
                  @click="cellPrint($index)"
                  class="mt-[2px]"
                >
                  打印标签
                </el-button>
              </div>
            </template>
          </pure-table>
        </el-tab-pane>
        <el-tab-pane label="待入库" name="wait">
          <pure-table
            :data="waitTable"
            :columns="waitColumns"
            :loading="tableLoading"
            stripe
            border
          ></pure-table>
        </el-tab-pane>
        <el-tab-pane label="退货信息" name="return">
          <template v-for="(item, index) in outTable" :key="item.id">
            <div class="w-[70%]">
              <div class="mb-[10px]">
                <div class="flex justify-between text-[14px] mb-[4px]">
                  <span>采购退货单号</span>
                  <span class="font-bold">{{ getStatus(item.status) }}</span>
                </div>
                <div class="text-[14px]">
                  <span class="inline-block mr-[20px]">{{ item.procure_ret_no }}</span>
                  <span>{{ item.create_time }}</span>
                </div>
              </div>
              <pure-table :data="item.goods" :columns="outColumns" stripe border></pure-table>
            </div>
          </template>
          <div v-if="outTable.length === 0" class="w-[50%] text-center">暂无退货信息</div>
        </el-tab-pane>
        <el-tab-pane label="入库信息" name="in">
          <template v-for="(item, index) in inTable" :key="item.id">
            <div class="w-[70%]">
              <div class="mb-[10px]">
                <div class="flex justify-between text-[14px] mb-[4px]">
                  <span>采购入库单号</span>
                  <span class="font-bold">{{ getStatus(item.status) }}</span>
                </div>
                <div class="text-[14px]">
                  <span class="inline-block mr-[20px]">{{ item.wh_in_no }}</span>
                  <span>{{ item.create_time }}</span>
                </div>
              </div>

              <pure-table :data="item.goods" :columns="inColumns" stripe border></pure-table>
            </div>
          </template>
          <div v-if="inTable.length === 0" class="w-[50%] text-center">暂无入库信息</div>
        </el-tab-pane>
        <el-tab-pane label="单据日志" name="logs">
          <pure-table
            style="width: 70%"
            :data="logsTable"
            :columns="logsColumns"
            stripe
            border
          ></pure-table>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <div class="flex">
          <el-button @click="visibleDrawer = false" class="w-[100px]" type="primary" size="large">
            关闭
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-drawer__header) {
  margin-bottom: 0;
}
</style>
