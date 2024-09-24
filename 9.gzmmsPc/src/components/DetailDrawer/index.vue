<script setup lang="ts">
import { Props, EStatus } from "./type";
import { useBuyInDetail } from "./hook";
import type { TabPaneName } from "element-plus";
// 引入获取采购单详情api
import { detailBuyInApi } from "@/api/storage/buy-in/index";
import printJS from "print-js";

const props = defineProps<Props>();

let emits = defineEmits(["update:visible"]);

const { columns, logsColumns } = useBuyInDetail();
const activeName = ref("detail");
const tableLoading = ref(false);
const detailTable = ref<any[]>([]);
const logsTable = ref<any[]>([]); //日志信息

const visibleDrawer = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emits("update:visible", value);
  },
});

const orderStatus = computed(() => {
  return EStatus[props.info.status];
});

const elMap = new Map();

function handleBarcodeRef(el: any, index: number) {
  console.log("el", el);
  if (el) {
    elMap.set(index, el);
    console.log("elMap", elMap);
  }
}
function cellPrint(index: number) {
  console.log("单元格点击打印");
  const img = elMap.get(index)?.barcodeImg;
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

// 请求数据
async function getData(id: number) {
  activeName.value = "detail";
  detailTable.value = [];
  logsTable.value = [];
  try {
    tableLoading.value = true;
    const result = await detailBuyInApi({ id });
    let res = result.data;

    // status.value = res.status;
    detailTable.value = res.goods;
    logsTable.value = res.act_log;
  } finally {
    tableLoading.value = false;
  }
}

watch(
  () => props.info.id,
  (newVal) => {
    console.log("newVal", newVal);
    if (newVal) {
      getData(newVal);
    }
  },
  {
    immediate: true,
  },
);

//点击切换tabs
function handleTabsChange(name: TabPaneName) {
  // console.log("name", name);
  activeName.value = name as string;
}
</script>
<template>
  <div>
    <el-drawer v-model="visibleDrawer" title="采购入库单详情" size="50%" :destroy-on-close="true">
      <div class="mb-[20px] flex items-center justify-between">
        <!-- <p class="font-bold mb-[10px]">采购单详情</p> -->
        <div>
          <div class="header-left-top text-primary">
            <span>采购入库单号：</span>
            <span>{{ info.wh_in_no }}</span>
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
        <el-tab-pane label="入库单详情" name="detail">
          <div class="mb-[10px] text-primary" v-if="info.procure_no">
            <span>采购单号：</span>
            <span>{{ info.procure_no }}</span>
          </div>
          <pure-table :data="detailTable" :columns="columns" :loading="tableLoading" stripe border>
            <template #operation="{ row, $index }">
              <div class="flex flex-col items-center">
                <qrcode
                  :info="{ content: row.barcdoe,barcode: row.barcode, title: row.title, spec: row.spec }"
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
