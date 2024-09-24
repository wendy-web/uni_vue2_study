<script setup lang="ts">
import printJS from "print-js";
import { IGoodsItem } from "@/api/storage/goods-manage//types";
// 导入条形码组件
// import Barcode from "@/components/Barcode/index.vue";
// 导入二维码组件
import qrcode from "@/components/Barcode/qrcode.vue";
import { usePrint } from "@/hooks/print";

export interface Props {
  // formInfo: IAddGoods;
  detailForm: IGoodsItem;
}

const props = defineProps<Props>();

const { onePrint } = usePrint();

const state = reactive({
  formData: {
    // barcode: "",
    // title: "", //商品名称
    // spec: "", //规格
    // brand: "", //品牌
    // company: "", //公司
    // price: "", //价格
    // img_url: "", // 图片
    // class_name: "", //类别
    // measure_name: "", //单位
    // ss_num: "", //安全库存
    // order_point: "", //订货点
  } as IGoodsItem,
});
const { formData } = toRefs(state);

const barcodeInfo = computed(() => {
  return {
    barcode: formData.value.barcode as string,
    title: formData.value.title as string,
    spec: formData.value.spec as string,
    content: formData.value.barcode as string,
  };
});

// const barcodeRef = ref<InstanceType<typeof Barcode>>()
const qrcodeRef = ref<typeof qrcode>();

const emit = defineEmits(["aboutDetail"]);
// 点击返回 显示列表页
const handeleCancel = () => {
  emit("aboutDetail");
};
// const handlePrint = () => {
//   let img = qrcodeRef.value?.barcodeImg;
//   console.log(img);

//   const loading = ElLoading.service({
//     lock: true,
//     text: "正在启动打印服务",
//   });

//   // 解决打印对话框关闭后执行的回调函数触发问题
//   // let focuser = setInterval(() => window.dispatchEvent(new Event("focus")), 500);

//   setTimeout(() => {
//     //size:  landscape(横向) portrait(竖向)
//     printJS({
//       printable: [img],
//       type: "image",
//       // style: `@page { margin: 0; padding:0;size:landscape} body: {margin: 0;padding:0;}`,
//       style: `@media print {@page { margin: 0; padding:0;size:landscape} body: {margin: 0;padding:0;}}`,
//       header: null,
//       // imageStyle: `display: block;padding:0;margin-top:20px;margin-left:-16px;page-break-after: always;width:130%;`,
//       imageStyle: `display: block;padding:0;margin-top:0px;margin-left:4px;width:96%;`,
//       onPrintDialogClose: function () {
//         // 在浏览器打印对话框关闭后执行的回调函数。
//         // clearInterval(focuser);
//         console.log("我关闭了");
//       },
//     });

//     loading.close();
//   }, 100);
// };

// const handlePrint = () => {

//   let img = barcodeRef.value?.barcodeImg?.currentSrc
//   console.log(img)

//   const loading = ElLoading.service({
//     lock: true,
//     text: "正在启动打印服务",
//   });

//   /*
//       设置了 .no-print 类名的元素,在打印时不显示
//       设置表格td元素的字体大小为12px
//     */
//   // const style = `@media print {body: {margin: 0}}`;

//   // 解决打印对话框关闭后执行的回调函数触发问题
//   let focuser = setInterval(() => window.dispatchEvent(new Event("focus")), 500);

//   setTimeout(() => {
//     printJS({
//       printable: [img],
//       type: "image",
//       style: `@page { margin: 0; padding:0;size:landscape} body: {margin: 0;padding:0;}`,
//       header: null,
//       imageStyle: `display: block;padding:0;margin-top:10px;margin-left:4px;width:90%;`,
//       onPrintDialogClose: function () {
//         // 在浏览器打印对话框关闭后执行的回调函数。
//         clearInterval(focuser);
//         console.log("我关闭了");
//       },
//     });

//     loading.close();
//   }, 100);
// };

watch(
  () => props.detailForm,
  (newVal: IGoodsItem, oldVal) => {
    console.log("new", newVal);
    console.log("old", oldVal);
    formData.value = newVal;
  },
  { immediate: true },
);
</script>

<template>
  <div class="app-container">
    <div class="header-title">货品详情</div>
    <div class="app-card">
      <el-form :model="formData" ref="form" :inline="false" label-width="70" label-position="left">
        <div class="top">
          <el-form-item label="货品条码" prop="barcode">
            <!-- <barcode :value="formData.barcode" ref="barcodeRef"></barcode> -->
            <span>{{ formData.barcode }}</span>
          </el-form-item>
          <div class="flex">
            <qrcode :info="barcodeInfo" ref="qrcodeRef"></qrcode>
            <el-button type="primary" link @click="onePrint(barcodeInfo)" class="ml-[10px]">
              <template #icon>
                <svg-icon icon-class="print"></svg-icon>
              </template>
              打印标签
            </el-button>
          </div>
        </div>
        <div class="info">
          <div class="basic mb-[40px]">
            <div class="font-bold mb-[20px] text-[14px]">基本信息</div>
            <el-row :gutter="40">
              <el-col :span="6" :offset="0">
                <el-form-item label="名称" prop="title">
                  <span>{{ formData.title }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="0">
                <el-form-item label="规格型号" prop="spec">
                  <span>{{ formData.spec }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="6" :offset="0">
                <el-form-item label="分类" prop="class_name">
                  <span>{{ formData.class_name }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="0">
                <el-form-item label="品牌" prop="brand">
                  <span>{{ formData.brand }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="6" :offset="0">
                <el-form-item label="计量单位" prop="measure_name">
                  <span>{{ formData.measure_name }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="0">
                <el-form-item label="货品分类" prop="goods_class">
                  <span>{{ formData.goods_class }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="6" :offset="0">
                <el-form-item label="默认价格" prop="purchase_price">
                  <span>{{ formData.purchase_price }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!-- <div class="inventory">
            <div class="font-bold mb-[20px] text-[14px]">库存信息</div>
            <el-row :gutter="40">
              <el-col :span="6" :offset="0">
                <el-form-item label="安全库存" prop="ss_num">
                  <span>{{ formData.ss_num }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="0">
                <el-form-item label="订货点" prop="order_point">
                  <span>{{ formData.order_point }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div> -->
        </div>
      </el-form>
    </div>
    <div class="footer mt-[40px]">
      <el-button type="primary" plain size="large" class="w-[140px]" @click="handeleCancel">
        返回
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-card {
  padding: 20px 0 60px 20px;
}
.top {
  border-bottom: 1px solid #dadada;
  padding-bottom: 20px;
  margin-bottom: 20px;
}
</style>
