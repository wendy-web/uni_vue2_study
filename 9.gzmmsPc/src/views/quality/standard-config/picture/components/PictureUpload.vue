<script setup lang="ts">
import {
  UploadFile,
  UploadInstance,
  UploadProps,
  UploadRawFile,
  UploadRequestOptions,
  UploadUserFile,
} from "element-plus";
import { genFileId } from "element-plus";
import { uploadFileApi } from "@/api/common";

interface Props {
  /** 编辑时-传递的文件链接 */
  editSrc?: string;
  /** 编辑时-传递的文件名称 */
  editName?: string;
  allowedList?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  editSrc: "",
  editName: "",
  allowedList: () => ["image/jpeg", "image/png", "image/gif"],
});

const uploadRef = ref<UploadInstance>();
const fileList = ref<UploadUserFile[]>();
// 文件名
const fileName = ref("");
// 文件链接
const fileSrc = ref("");
const emit = defineEmits(["fileChange"]);

async function uploadFile(options: UploadRequestOptions): Promise<any> {
  const { data: fileInfo } = await uploadFileApi(options.file);
  fileSrc.value = fileInfo.src;
  emit("fileChange", { name: fileName.value, src: fileSrc.value });
}

/** 当超出限制时，执行的钩子函数 */
const handleExceed: UploadProps["onExceed"] = (files) => {
  uploadRef.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  uploadRef.value!.handleStart(file);
  uploadRef.value!.submit();
  emit("fileChange", { name: fileName.value, src: fileSrc.value });
};

function handleRemove(removeFile: UploadFile) {
  console.log("点击删除文件");
  fileName.value = "";
  fileSrc.value = "";
  emit("fileChange", { name: fileName.value, src: fileSrc.value });
}
function handleBeforeUpload(file: UploadRawFile) {
  if (props.allowedList.indexOf(file.type) == -1) {
    ElMessage.warning("仅支持png.jpg.jpeg.gif格式图片");
    return false;
  }
  if (file.size > 2 * 50 * 1048 * 1048) {
    ElMessage.warning("上传文件不能大于100M");
    return false;
  }
  return true;
}
watch(
  () => props.editSrc,
  (newVal) => {
    if (newVal) {
      fileSrc.value = newVal;
      fileName.value = props.editName;
      fileList.value = [
        {
          name: props.editName,
          url: newVal,
          status: "success",
        },
      ];
      console.log("🚀 ~ fileList.value:", fileList.value);
    }
  },
  {
    immediate: true,
  },
);
</script>
<template>
  <el-upload
    ref="uploadRef"
    v-model:file-list="fileList"
    class="w-full h-full"
    drag
    list-type="picture"
    :http-request="uploadFile"
    :on-remove="handleRemove"
    :before-upload="handleBeforeUpload"
    :on-exceed="handleExceed"
    :limit="1"
  >
    <i-ep-upload-filled class="text-[30px]"></i-ep-upload-filled>
    <div class="el-upload__text">
      拖动图片到此上传
      <em>点击上传</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">仅支持png/jep/jpeg/gif格式的图片</div>
    </template>
  </el-upload>
</template>
<style lang="scss" scoped>
:deep(.el-upload--picture-card) {
  width: 100%;
  height: 100%;
}
:deep(.el-upload-dragger) {
  width: 100%;
  height: 100%;
}
</style>
