<template>
  <!-- <svg class="barcode"></svg> -->
  <img ref="barcodeImg" class="barcode" />
</template>

<script setup lang="ts">
import JsBarcode from "jsbarcode";


const props = defineProps({
  // 数据
  // 当前的值
  value: String,
});

const codeValue = ref('')
const barcodeImg = ref<HTMLImageElement | null>(null)

defineExpose({
  barcodeImg: barcodeImg
})
watch(
  () => props.value,
  (newVal) => {
    codeValue.value = newVal || ''
    console.log("codeValue.value", codeValue.value)
    nextTick(() => {
      try {
        JsBarcode(".barcode", String(codeValue.value), {
          // format: "CODE128", //选择要使用的条形码类型
          format: "EAN13", //选择要使用的条形码类型
          width: 1, //设置条之间的宽度
          height: 40, //高度
          displayValue: true, //是否在条形码下方显示文字
          flat: true,
          fontSize: 15, //设置文本的大小
          //   text:"456",//覆盖显示的文本
          //   fontOptions:"bold italic",//使文字加粗体或变斜体
          //   font:"fantasy",//设置文本的字体
          //   textAlign:"left",//设置文本的水平对齐方式
          //   textPosition:"top",//设置文本的垂直位置
          //   textMargin:5,//设置条形码和文本之间的间距
          //   background:"#eee",//设置条形码的背景
          //   lineColor:"#2196f3",//设置条和文本的颜色。
          //   margin: 15, //设置条形码周围的空白边距
        });
      } catch (error) {
        JsBarcode(".barcode", String(props.value), {
          format: "CODE128", //选择要使用的条形码类型
          // format: "EAN8", //选择要使用的条形码类型
          // format: "EAN13", //选择要使用的条形码类型
          width: 1, //设置条之间的宽度
          height: 40, //高度
          displayValue: true, //是否在条形码下方显示文字
          fontSize: 15, //设置文本的大小
        });
      }
    });
  },
  { immediate: true }

)

</script>

<style scoped lang="scss"></style>
