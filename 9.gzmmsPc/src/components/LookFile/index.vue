<template>
  <div class="file-container">
    <el-tooltip class="box-item" effect="dark" content="查看" placement="top">
      <span class="text-blue-600 underline cursor-pointer" @click="open">{{ file_info.name }}</span>
    </el-tooltip>
    <el-tooltip class="box-item" effect="dark" content="下载" placement="top">
      <svg-icon
        icon-class="download"
        class="cursor-pointer ml-[10px]"
        @click="flieDownload"
      ></svg-icon>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStoreHook } from "@/store/modules/settings";
const useSetting = useSettingsStoreHook();

interface Props {
  file_info: {
    src: string;
    name: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  file_info: () => {
    return {
      src: "",
      name: "",
    };
  },
});

const imgHttp = useSetting.baseHttp;
function open() {
  // 点击查看文件
  window.open(imgHttp + props.file_info.src, "_blank");
}

function flieDownload() {
  console.log("点击下载");
  downCode(imgHttp + props.file_info.src, props.file_info.name);
}

function downCode(imgsrc: string, name: string) {
  var image = new Image();
  // 解决跨域 Canvas 污染问题
  image.setAttribute("crossOrigin", "anonymous");
  image.onload = function () {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;

    var context = canvas.getContext("2d");
    context!.drawImage(image, 0, 0, image.width, image.height);
    var url = canvas.toDataURL("image/png");
    var a = document.createElement("a");
    // 创建一个单击事件
    var event = new MouseEvent("click");
    a.download = name;
    a.href = url;

    // 触发a的单击事件
    a.dispatchEvent(event);
  };
  image.src = imgsrc;
}
</script>

<style scoped lang="scss"></style>
