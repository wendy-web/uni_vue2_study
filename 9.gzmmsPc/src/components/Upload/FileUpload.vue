<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import type {
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
  allowedList: () => ["application/pdf", "image/jpeg", "image/png"],
});

const fileList = ref<UploadUserFile[]>();

const upload = ref<UploadInstance>();
/** 文件上传状态 */
const btnLoding = ref(false);
const btnContentText = computed(() => {
  return btnLoding.value ? "上传中..." : "点击上传";
});

// 文件名
const fileName = ref("");
// 文件链接
const fileSrc = ref("");
const emit = defineEmits(["fileChange"]);
const maxUploadSize = "100M";
/**
 * 限制用户上传文件的格式和大小
 */
function handleBeforeUpload(file: UploadRawFile) {
  console.log("file", file);
  // if (props.allowedList.indexOf(file.type) == -1) {
  //   ElMessage.warning("仅支持png.jpg.jpeg.gif");
  //   return false;
  // }
  if (file.size > 2 * 50 * 1048 * 1048) {
    ElMessage.warning(`上传文件不能大于${maxUploadSize}`);
    return false;
  }
  return true;
}

/**
 * 自定义图片上传
 *
 * @param options
 */
async function uploadFile(options: UploadRequestOptions): Promise<any> {
  try {
    btnLoding.value = true;
    const { data: fileInfo } = await uploadFileApi(options.file);
    fileName.value = fileInfo.name;
    fileSrc.value = fileInfo.src;
    emit("fileChange", { name: fileName.value, src: fileSrc.value });
  } finally {
    btnLoding.value = false;
  }
}
function flieDelete() {
  console.log("点击删除文件");
  fileName.value = "";
  fileSrc.value = "";
  emit("fileChange", { name: fileName.value, src: fileSrc.value });
}

/** 当超出限制时，执行的钩子函数 */
const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
  upload.value!.submit();
  emit("fileChange", { name: fileName.value, src: fileSrc.value });
};

function handleSuccess(response: any) {
  console.log("🚀 ~ handleSuccess ~ response:", response);
}

function clearFiles() {
  upload.value!.clearFiles();
}
defineExpose({
  clearFiles,
  btnLoding,
});

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
      console.log("🚀 ~    fileList.value:", fileList.value);
    }
  },
  {
    immediate: true,
  },
);
</script>
<template>
  <!-- 上传组件 -->
  <div class="file-upload flex w-full">
    <el-input v-model="fileName" disabled v-show="false"></el-input>
    <el-upload
      ref="upload"
      class="single-uploader"
      v-model:file-list="fileList"
      list-type="text"
      :before-upload="handleBeforeUpload"
      :http-request="uploadFile"
      style="width: 100%"
      :limit="1"
      :on-exceed="handleExceed"
      :on-remove="flieDelete"
      :on-success="handleSuccess"
    >
      <el-button type="primary" size="default" plain :icon="Plus" :loading="btnLoding">
        {{ btnContentText }}
      </el-button>
    </el-upload>
  </div>
  <p class="el-upload__tip">
    文件大小不超过{{ maxUploadSize }},且格式为jpg, png, gif, jpeg, pdf, zip, rar, docx, doc,
    xlsx,ppt,pptx,pptm xls
  </p>
</template>
<style lang="scss" scoped></style>
