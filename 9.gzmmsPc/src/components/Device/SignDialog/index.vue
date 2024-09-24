<script setup lang="ts">
import vueSignature from "vue3-online-signature";
import { getBase64ImgApi } from "@/api/device/common";

const emit = defineEmits(["change"]);

const vueSignatureRef = ref();
const imgSrc = ref("");
const handleReset = () => {
  vueSignatureRef.value?.reset();
};
const handleGenerate = async () => {
  try {
    const sigResult = await vueSignatureRef.value.confirm();
    let base64File = sigResult.base64;
    const result = await getBase64ImgApi({ file: base64File });

    return result.data.src;
  } catch (error) {
    ElMessage({
      message: "签名不能为空",
      type: "warning",
    });
  }

  // vueSignatureRef.value
  //   .confirm()
  //   .then((res: { base64: string }) => {
  //     console.log("base64", res.base64);
  //     emit("change");
  //   })
  //   .catch(() => {
  //     ElMessage({
  //       message: "签名不能为空",
  //       type: "warning",
  //     });
  //   });
};

defineExpose({
  handleGenerate,
});

const params = reactive({
  width: 1400,
  border: 2,
  height: 600,
  lineWidth: 5,
  lineColor: "",
  canvasBack: "",
  isCrop: false,
  edg: 0,
  fullScreen: false,
  domId: "",
  imgBack: "",
  isRepeat: "",
  imgType: "png",
  noRotation: false,
  backIsCenter: false,
  recoverPoints: [],
});
</script>
<template>
  <div class="sign-container">
    <vueSignature ref="vueSignatureRef" class="border-2 mx-auto" v-bind="params" />
    <button @click="handleReset" class="mt-4">清空画板</button>
  </div>
</template>
<style lang="scss" scoped></style>
