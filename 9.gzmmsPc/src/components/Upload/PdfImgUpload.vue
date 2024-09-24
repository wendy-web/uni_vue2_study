<template>
  <div class="flie" v-if="fileName">
    <el-tooltip class="box-item" effect="dark" content="查看" placement="top">
      <span class="text-blue-600 underline cursor-pointer" @click="open">{{ fileName }}</span>
    </el-tooltip>

    <el-tooltip class="box-item" effect="dark" content="删除" placement="top">
      <svg-icon
        icon-class="delete"
        class="cursor-pointer ml-[10px] mr-[10px]"
        @click="flieDelete"
      ></svg-icon>
    </el-tooltip>
    <el-tooltip class="box-item" effect="dark" content="下载" placement="top">
      <svg-icon icon-class="download" class="cursor-pointer" @click="flieDownload"></svg-icon>
    </el-tooltip>
  </div>
  <!-- 上传组件 -->
  <el-upload
    v-else
    class="single-uploader"
    v-model="fileSrc"
    :show-file-list="false"
    list-type="text"
    :before-upload="handleBeforeUpload"
    :http-request="uploadFile"
  >
    <el-button type="primary" size="default" :icon="Plus" plain>点击上传</el-button>
  </el-upload>
</template>

<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import { UploadRawFile, UploadRequestOptions } from "element-plus";
import { uploadFileApi } from "@/api/common";
import { useSettingsStoreHook } from "@/store/modules/settings";

const useSetting = useSettingsStoreHook();

const imgHttp = useSetting.baseHttp;

// const emit = defineEmits(["update:modelValue"]);
const emit = defineEmits(["fileChange"]);

// const props = defineProps({
//   modelValue: {
//     type: String,
//     default: "",
//   },
// });

// const imgUrl = computed<string | undefined>({
//   get() {
//     return props.modelValue;
//   },
//   set(val) {
//     // imgUrl改变时触发修改父组件绑定的v-model的值
//     emit("update:modelValue", val);
//   },
// });

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

// 文件名
const fileName = ref("");
// 文件链接
const fileSrc = ref("");

/**
 * 自定义图片上传
 *
 * @param options
 */
async function uploadFile(options: UploadRequestOptions): Promise<any> {
  // imgUrl.value = "http://ewsystem.y1b.cn/static/uploads/1/20230217/7c860a662b28df2f2d7045f22700b13f.jpg"
  const { data: fileInfo } = await uploadFileApi(options.file);
  // imgUrl.value = fileInfo.src;
  // console.log("options", options);
  fileName.value = fileInfo.name;
  fileSrc.value = fileInfo.src;
  emit("fileChange", { name: fileName.value, src: fileSrc.value });
}

/**
 * 限制用户上传文件的格式和大小
 */
function handleBeforeUpload(file: UploadRawFile) {
  console.log("file", file);
  const fileTypeList = ["application/pdf", "image/jpeg", " image/png"];
  // if (fileTypeList.indexOf(file.type) == -1) {
  //   ElMessage.warning("只可上传pdf和图片格式");
  //   return false;
  // }

  // if (file.size > 2 * 1048 * 1048) {
  //   ElMessage.warning("上传文件不能大于2M");
  //   return false;
  // }
  if (file.size > 2 * 50 * 1048 * 1048) {
    ElMessage.warning("上传文件不能大于100M");
    return false;
  }
  return true;
}

function open() {
  // 点击查看文件
  window.open(imgHttp + fileSrc.value, "_blank");
}

function flieDelete() {
  console.log("点击删除文件");
  fileName.value = "";
  fileSrc.value = "";
  emit("fileChange", { name: fileName.value, src: fileSrc.value });
}
function flieDownload() {
  console.log("点击下载文件");
  downCode(imgHttp + fileSrc.value, fileName.value);
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

watch(
  () => props.file_info,
  (newValue, oldValue) => {
    // console.log("newValue", newValue);
    fileSrc.value = newValue.src;
    fileName.value = newValue.name;
  },
  { immediate: true },
);
</script>

<style scoped>
.single-uploader .single {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.single-uploader .el-upload {
  /* border: 1px dashed var(--el-border-color); */
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.single-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.single-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
</style>
