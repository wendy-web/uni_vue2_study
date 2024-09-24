<script setup lang="ts">
/* 旧的打印弹窗--- 废弃 */
// 引入类型
import type { Action, MessageBoxState } from "element-plus";
import printJS from "print-js";
import { IProcureItem } from "@/api/common/types";
// 引入获取采购单详情api
import { importBuyInApi } from "@/api/storage/buy-in";
// 引入自定义组件
import OrderSelect from "@/components/SelectDrop/OrderSelect.vue";

export interface Props {
  visible: boolean;
  procureList: IProcureItem[];
}
const props = defineProps<Props>();

let emits = defineEmits(["update:visible"]);
const columns: TableColumnList = [
  {
    label: "操作",
    align: "center",
    slot: "operation",
  },
  {
    label: "货品条码",
    prop: "barcode",
    width: 160,
    align: "center",
  },
  {
    label: "名称",
    prop: "title",
    width: 160,
    align: "center",
  },

  {
    label: "规格型号",
    prop: "spec",
    // width: 160,
    align: "center",
    showOverflowTooltip: true,
  },
  {
    label: "单位",
    prop: "measure_name",
    width: 90,
    align: "center",
  },
  {
    label: "采购数量",
    prop: "num",
    width: 90,
    align: "center",
  },
];

const tableData = ref<any[]>();
const tableLoading = ref(false);
const form = ref({
  procure_no: "",
});
// const procureList = ref<any[]>([]);
const isImport = ref(false);
const orderSelecteRef = ref<InstanceType<typeof OrderSelect>>();

function orderChange(index: number) {
  let item = props.procureList[index];
  form.value.procure_no = item.procure_no;
  handleImport();
}
let confirmFalg = 0; // 确定是否重新导入弹窗的标记

// 点击导入货品
const handleImport = async () => {
  console.log("点击导入,采购单号", form.value.procure_no);
  if (!form.value.procure_no) {
    return;
  }
  console.log("isImport.value", isImport.value);

  if (isImport.value && confirmFalg === 0) {
    setTimeout(() => {
      confirmFalg += 1;
      ElMessageBox.confirm(`您已导入过商品,确定要再次导入吗?`, "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        beforeClose: (action: Action, instance: MessageBoxState, done: () => void) => {
          if (action === "confirm") {
            // @ts-expect-error
            instance.onclick = (function () {
              let type = window.event?.type;
              // console.log("window.event",window.event)
              // console.log("type",type)
              if (type !== "keydown") {
                done();
              }
            })();
          } else {
            done();
          }
        },
      })
        .then(() => {
          console.log("点击了 确定");
          confirmFalg = 0;
          orderSelecteRef.value?.selectBlur();
          sendImport();
        })
        .catch((error) => {
          confirmFalg = 0;
          console.log(error);
        });
    }, 500);

    return;
  } else if (isImport.value && confirmFalg === 1) {
    return;
  }
  sendImport();
};
const sendImport = async () => {
  try {
    const result = await importBuyInApi({ procure_no: form.value.procure_no });
    if (result.code === "0") {
      ElMessage.error(result.msg);
      return;
    }
    ElMessage.success("导入成功");
    let list = result.data.list;
    tableData.value = list;

    // 记录已经导入了
    isImport.value = true;
  } catch (error) {}
};
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

const visibleDrawer = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emits("update:visible", value);
  },
});
watchEffect(() => {});
</script>
<template>
  <div>
    <el-drawer
      v-model="visibleDrawer"
      title="选择打印采购单商品标签"
      size="50%"
      :destroy-on-close="true"
    >
      <el-form :model="form">
        <el-form-item label="采购单号">
          <order-select
            ref="orderSelecteRef"
            :order-num="form.procure_no"
            @change="orderChange"
            :list="procureList"
          ></order-select>
        </el-form-item>
      </el-form>

      <pure-table
        border
        stripe
        header-cell-class-name="table-row-header"
        :data="tableData"
        :columns="columns"
        :loading="tableLoading"
      >
        <template #operation="{ row, $index }">
          <div class="flex flex-col items-center">
            <qrcode
              :info="{
                content: row.barcode,
                barcode: row.barcode,
                title: row.title,
                spec: row.spec,
              }"
              :ref="(el) => handleBarcodeRef(el, $index)"
            ></qrcode>
            <el-button type="primary" size="default" @click="cellPrint($index)" class="mt-[2px]">
              打印标签
            </el-button>
          </div>
        </template>
      </pure-table>
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
<style lang="scss" scoped></style>
