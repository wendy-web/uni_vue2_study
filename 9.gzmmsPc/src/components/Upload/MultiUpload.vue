<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import {
  UploadFile,
  UploadProps,
  UploadRawFile,
  UploadRequestOptions,
  UploadUserFile,
} from "element-plus";
import { ref, watch } from "vue";
import { uploadFileApi } from "@/api/common";
import { useSettingsStoreHook } from "@/store/modules/settings";

type UploadUserFileType = UploadUserFile & {
  src: string;
};

// 定义一个接口来描述上传文件的状态
interface FileUploadStatus {
  file: UploadRawFile;
  promise: Promise<void>;
}

const useSetting = useSettingsStoreHook();
const emit = defineEmits(["change"]);

interface Props {
  list: string[];
  limit?: number;
  disabled?: boolean;
  allowedList?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  list: () => [],
  limit: 10,
  disabled: false,
  allowedList: () => ["image/jpeg", "image/png","image/gif"],
});

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const fileList = ref<UploadUserFileType[]>([]);

const promises = ref<FileUploadStatus[]>([]);
const uploadedCount = ref(0); // 用于记录已上传的文件数量。
const totalFiles = ref(0); // 用于记录用户选择的文件总数
const addFileList = ref<UploadRawFile[]>([]);

async function handleUpload(options: UploadRequestOptions): Promise<any> {
  const file = options.file;
  let uid = options.file.uid;

  // 更新总文件数量
  if (totalFiles.value === 0) {
    totalFiles.value = addFileList.value.length + 1; // 增加即将上传的文件
  }
  addFileList.value.push(file);
  const promise = new Promise<void>((resolve, reject) => {
    //用于上传文件的函数 uploadFile
    uploadFileApi(file)
      .then((res) => {
        // 上传成功需手动替换文件路径为远程URL，否则图片地址为预览地址 blob:http://
        const fileIndex = fileList.value.findIndex((file) => file.uid == uid);
        let fileInfo = res.data;
        fileList.value.splice(fileIndex, 1, {
          name: fileInfo.name,
          url: useSetting.baseHttp + fileInfo.src,
          src: fileInfo.src,
          uid: uid,
        } as UploadUserFileType);
        resolve();
        uploadedCount.value++;
        checkAllUploaded();
      })
      .catch((error) => {
        reject(error);
      });
  });

  // // 将 Promise 添加到 promises 数组中
  promises.value.push({ file, promise });
}
const checkAllUploaded = () => {
  if (uploadedCount.value >= totalFiles.value) {
    // 所有文件上传完成
    uploadFiles();
  }
};

const uploadFiles = async () => {
  try {
    // 等待所有文件上传完成
    await Promise.all(promises.value.map(({ promise }) => promise));
    // 清空 promises 数组
    promises.value = [];
    uploadedCount.value = 0;
    totalFiles.value = 0;
    addFileList.value = []; // 清空 addFileList
    // ElMessage.success("所有文件上传完成");
    // 在这里执行想在所有文件上传后做的事情
    emit(
      "change",
      fileList.value.map((file) => file.src),
    );
  } catch (error) {
    ElMessage.error("文件上传过程中出现错误");
    console.error("文件上传过程中出现错误", error);
  }
};

watch(
  () => props.list,
  (newVal: string[]) => {
    fileList.value = newVal.map((src) => {
      return { url: useSetting.baseHttp + src, src } as UploadUserFileType;
    });
  },
  { immediate: true },
);

/**
 * 自定义图片上传
 *
 * @param params
 */

//  async function handleUpload(options: UploadRequestOptions): Promise<any> {
//   // 上传API调用
//   // const { data: fileInfo } = await uploadFileApi(options.file);
//   const result = await uploadFileApi(options.file);
//   const fileInfo = result.data;
//   console.log("🚀 ~ handleUpload ~ fileInfo:", fileInfo)

//   let fineRes = fileList.value.find((file) => file.uid == (options.file as any).uid);

//   console.log("fileList.value", fileList.value);
//   // // 上传成功需手动替换文件路径为远程URL，否则图片地址为预览地址 blob:http://
//   // const fileIndex = fileList.value.findIndex((file) => file.uid == (options.file as any).uid);
//   // fileList.value.splice(fileIndex, 1, {
//   //   name: fileInfo.name,
//   //   url: useSetting.baseHttp + fileInfo.src,
//   //   src: fileInfo.src,
//   // } as UploadUserFileType);
//   // emit(
//   //   "change",
//   //   fileList.value.map((file) => file.src),
//   // );
// }

// async function handleUpload(options: UploadRequestOptions): Promise<any> {
//   // 上传API调用
//   const { data: fileInfo } = await uploadFileApi(options.file);
//   console.log("fileList.value", fileList.value);
//   // 上传成功需手动替换文件路径为远程URL，否则图片地址为预览地址 blob:http://
//   const fileIndex = fileList.value.findIndex((file) => file.uid == (options.file as any).uid);
//   fileList.value.splice(fileIndex, 1, {
//     name: fileInfo.name,
//     url: useSetting.baseHttp + fileInfo.src,
//     src: fileInfo.src,
//   } as UploadUserFileType);
//   emit(
//     "change",
//     fileList.value.map((file) => file.src),
//   );
// }

/**
 * 删除图片
 */
function handleRemove(removeFile: UploadFile) {
  const filePath = removeFile.url;

  if (filePath) {
    emit(
      "change",
      fileList.value.map((file) => file.src),
    );
  }
}

/**
 * 限制用户上传文件的格式和大小
 */
function handleBeforeUpload(file: UploadRawFile) {
  if (props.allowedList.indexOf(file.type) == -1) {
    ElMessage.warning("仅支持png.jpg.jpeg.gif等格式图片");
    return false;
  }
  if (file.size > 2 * 50 * 1048 * 1048) {
    ElMessage.warning("上传文件不能大于100M");
    return false;
  }
  return true;
}

/**
 * 图片预览
 */
const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
</script>
<template>
  <el-upload
    v-model:file-list="fileList"
    list-type="picture-card"
    :before-upload="handleBeforeUpload"
    :http-request="handleUpload"
    :on-remove="handleRemove"
    :on-preview="handlePreview"
    :limit="props.limit"
    multiple
    :disabled="disabled"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.el-upload-list__item.is-ready) {
  display: none;
}
</style>
