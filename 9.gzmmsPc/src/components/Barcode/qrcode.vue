<script setup lang="ts">
import QrcodeVue from "qrcode.vue";
import { useSettingsStore } from "@/store/modules/settings";

const settingsStore = useSettingsStore();

interface Props {
  info: {
    barcode: string;
    title: string;
    spec: string;
    content: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  info: () => {
    return {
      barcode: "",
      title: "",
      spec: "",
      content: "",
    };
  },
});

// const value = props.info.barcode; //传入的值，要求是字符串,需要将对象进行转换
// const codeValue = ref("");
const codeValue = ref(settingsStore.scanCodeUrl + props.info.content);
const size = 50; //二维码大小
const dpi = ref(2);
const barcodeImg = ref("");

const qrcodeRef = ref();

defineExpose({
  barcodeImg: barcodeImg,
});
async function creatCanvas() {
  nextTick(() => {
    // const qrcode = document.querySelector("#qrcode") as HTMLCanvasElement;
    const qrcode = qrcodeRef.value.$el;
    const qrcodeWidth = qrcode.width;
    const qrcodeHeight = qrcode.height;
    // console.log("props.title", props.info.barcode);
    // console.log("qrcodeWidth", qrcodeWidth);
    // console.log("qrcodeHeight", qrcodeHeight);

    const qrcode_url = qrcode.toDataURL();
    // console.log("qrcode_url", qrcode_url);

    //   const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    canvas.width = 150;

    canvas.height = 110;
    let dpr = window.devicePixelRatio;
    if (dpr < dpi.value) {
      dpr = dpi.value;
    }
    const { width, height } = canvas;
    canvas.width = Math.round(width * dpr);

    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    // 直接用 scale 放大整个坐标系，相对来说就是放大了每个绘制操作
    context.scale(dpr, dpr);
    const canvasWidth = canvas.width;

    // context.fillStyle = "#fff";
    // context.fillRect(0, 0, canvasWidth, canvas.height);

    const imgWidth = 50;
    const imgHeight = 50;

    const fontSize = "12px";

    const titleFontSize = "12px";

    context.font = `${fontSize} Arial`;
    context.fillText("物料条码", imgWidth + 6, 14);

    context.font = `bold ${titleFontSize} Arial`;
    //名称标题的宽度用于 名字字段 x轴的位置
    const titleWidth = context.measureText("名称：").width;
    //名称标题的DPI宽度用于 计算名称字段的 宽度
    let titleWidthDpi = getDpiPx(titleWidth);
    context.fillText("名称：", 0, imgHeight + 14);

    context.font = `bold ${titleFontSize} Arial`;
    //规格标题的宽度用于 规格字段 x轴的位置
    let specWidth = context.measureText("型号：").width;
    //规格标题的DPI宽度用于 计算规格字段的 宽度
    const specWidthDpi = getDpiPx(titleWidth);
    context.fillText("型号：", 0, imgHeight + 44);

    getTextCanvas({
      context,
      str: codeValue.value,
      width: canvasWidth - imgWidth * dpr - 10,
      startX: imgWidth + 6,
      startY: imgHeight - 10,
      fontsize: fontSize,
    });
    if (props.info.title) {
      getTextCanvas({
        context,
        str: props.info.title,
        width: canvasWidth - titleWidthDpi - 4,
        startX: titleWidth,
        startY: imgHeight + 14,
        fontsize: titleFontSize,
      });
    }

    if (props.info.spec) {
      getTextCanvas({
        context,
        str: props.info.spec,
        width: canvasWidth - specWidthDpi - 4,
        startX: specWidth,
        startY: imgHeight + 44,
        fontsize: titleFontSize,
      });
    }

    var img = new Image();

    img.crossOrigin = "anonymous";
    img.src = qrcode_url;
    img.onload = function () {
      let qrcodeWidthDpi = getDpiPx(qrcodeWidth);

      // console.log("qrcodeWidthDpi", qrcodeWidthDpi);
      // console.log("canvasWidth", canvasWidth);
      // 将图片画到canvas上面上去！
      context.drawImage(img, 0, 0, imgWidth, imgHeight);

      // context.drawImage(img, 0, 0);
      nextTick(() => {
        const dataURL = canvas.toDataURL(); // 获取图片 base64 编码
        // console.log("dataURL", dataURL);
        barcodeImg.value = dataURL;
      });
    };
  });
}

interface ITextCanvasType {
  /** canvas上下文 */
  context: CanvasRenderingContext2D;
  /** 需要转换的 */
  str: string;
  /** 文本的宽度 */
  width: number;
  /** X轴起始点 */
  startX: number;
  /** Y轴起始点 */
  startY: number;
  /** 字体大小 */
  fontsize: string;
  /** 下一行文字的Y轴偏移量 */
  textY?: number;
  /** 左右总间距 */
  reduceNum?: number;
}

function getTextCanvas(options: ITextCanvasType) {
  let { context, str, width, startX, startY, fontsize, textY = 12, reduceNum = 10 } = options;

  context.font = `${fontsize} Arial`;
  let strWidth = context.measureText(str).width;
  strWidth = getDpiPx(strWidth);
  // console.log("strWidth", strWidth);
  // console.log("width", width);
  if (strWidth <= width) {
    // 如果文本的宽度小于等于 canvas的宽度, 则只用一行文字搞定
    context.font = `${fontsize} Arial`;
    context.fillText(str, startX, startY);
  } else {
    // const oneText = getStrByWith(str, canvasWidth, "10px", false);
    const oneText = getStrByWith(context, str, width, fontsize, false, reduceNum);
    // console.log("oneText", oneText);
    let oneTextWidth = context.measureText(oneText).width;
    context.font = `${fontsize} Arial`;
    oneTextWidth = getDpiPx(oneTextWidth);
    context.fillText(oneText, startX, startY);

    const startIndex = oneText.length;
    const newstr = str.substring(startIndex);
    // console.log("newstr", newstr);
    const twoText = getStrByWith(context, newstr, width, fontsize, true, reduceNum);
    let twoTextWidth = context.measureText(twoText).width;

    // console.log("twoText", twoText);
    context.font = `${fontsize} Arial`;
    twoTextWidth = getDpiPx(twoTextWidth);
    context.fillText(twoText, startX, startY + textY);
  }
}

function getDpiPx(num: number) {
  return Math.round(num * dpi.value);
}

/**
 * 根据指定宽度截取字符串
 * @param desc 原始字符串
 * @param width 该显示的宽度
 * @param fontsize 字体大小  12px
 * @returns {string} 截取后的字符串
 */

function getStrByWith(
  context: CanvasRenderingContext2D,
  str: string,
  width: number,
  fontsize: string,
  omit = false,
  reduceNum = 0,
) {
  context.font = `${fontsize} Arial`;
  width = width - getDpiPx(reduceNum);
  var boo = false;
  var temp = ""; // 存放截断字符串
  for (var j = 0; j < str.length; j++) {
    // desc是目标字符串，
    temp += str[j];
    let strWidth = context.measureText(temp).width;
    strWidth = getDpiPx(strWidth);
    // console.log("TemporaryTitle.innerText", TemporaryTitle.innerText);
    // console.log("getStrByWith", strWidth);
    if (strWidth > width) {
      boo = true;
      break;
    }
  }
  document.querySelector(".getTextWidth")?.remove();

  if (omit) {
    if (boo) temp += "..";
  }

  return temp;
}

// onMounted(() => {
//   creatCanvas();
// });

watch(
  () => props.info.content,
  (newVal) => {
    codeValue.value = settingsStore.scanCodeUrl + newVal || "";
    // console.log("codeValue.value", codeValue.value);
    nextTick(() => {
      creatCanvas();
    });
  },
  { immediate: true },
);
</script>
<template>
  <div>
    <qrcode-vue :value="codeValue" :size="size" level="H" ref="qrcodeRef"></qrcode-vue>
    <!-- <canvas id="canvas" width="150" height="110"></canvas> -->
  </div>
</template>
<style lang="scss" scoped>
// #canvas {
//   background-color: red;
// }
</style>
