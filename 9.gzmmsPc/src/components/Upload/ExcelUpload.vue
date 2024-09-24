<template>
  <!-- <el-upload
    class="single-uploader"
    :show-file-list="false"
    accept=".xls, .xlsx"
    :http-request="uploadFile"
  >
    <el-button type="primary" size="default" class="mb-[10px]">
      <template #icon>
        <svg-icon icon-class="import"></svg-icon>
      </template>
      导入货品
    </el-button>
  </el-upload> -->

  <el-dialog title="导入货品" v-model="visibleDialog" width="30%" draggable>
    <el-form label-width="100px">
      <el-form-item label="模板下载：">
        <el-button type="primary" @click="downloadTemp">点击下载</el-button>
      </el-form-item>
      <el-form-item label="文件上传：">
        <el-upload
          action="#"
          class="upload"
          :drag="true"
          :limit="1"
          :multiple="false"
          :show-file-list="true"
          :http-request="uploadFile"
          :accept="accept.join(',')"
          :before-upload="handleBeforeUpload"
          :on-error="excelUploadError"
          :on-success="excelUploadSuccess"
          ref="uploadRef"
        >
          <slot name="empty">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </slot>
          <template #tip>
            <slot name="tip">
              <div class="el-upload__tip">
                请上传 .xls , .xlsx 标准格式文件，文件最大为 {{ size }}M
              </div>
            </slot>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { importGoodsApi } from "@/api/storage/goods-manage/index";
import { procureImportApi } from "@/api/buy/order/index";

import { UploadFilled } from "@element-plus/icons-vue";
import type { UploadRawFile, UploadRequestOptions, UploadInstance } from "element-plus";

import { getBaseUrl } from "@/utils/request";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  accept: {
    type: Array,
    default: () => [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
  },
  /** @explain 货品列表的商品导入为1,采购导入为2 */
  downloadType: {
    type: Number,
    default: 1,
  },
  size: {
    type: Number,
    default: 20,
  },
});

const emits = defineEmits(["update:visible", "upload"]);

const uploadRef = ref<UploadInstance>();

const baseUrl = getBaseUrl();

const downloadMap = new Map();

downloadMap.set(1, baseUrl + "/static/货品管理导入模板.xlsx");
downloadMap.set(2, baseUrl + "/static/采购单货品导入模板.xlsx");
downloadMap.set(3, baseUrl + "/static/其他入库货品导入模板.xlsx");

const visibleDialog = computed({
  get() {
    console.log(props.visible);
    return props.visible;
  },
  set(val) {
    emits("update:visible", false);
    uploadRef.value?.clearFiles();
  },
});

// 点击下载模板
function downloadTemp() {
  const downloadUrl: string = downloadMap.get(props.downloadType);
  console.log("downloadUrl", downloadUrl);
  let subIndex = downloadUrl.lastIndexOf("/");
  let _fileName = downloadUrl.substring(subIndex + 1);
  const x = new window.XMLHttpRequest();
  x.open("GET", downloadUrl, true);
  x.responseType = "blob";
  x.onload = () => {
    const url = window.URL.createObjectURL(x.response);
    const a = document.createElement("a");
    a.href = url;
    a.download = _fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  x.send();
}

/**
 * 自定义上传
 * @param options
 */
async function uploadFile(options: UploadRequestOptions): Promise<any> {
  console.log("options", options);
  //   const { data: fileInfo } = await uploadFileApi(options.file);
  if (props.downloadType === 1) {
    importGoodsFn(options);
  } else if (props.downloadType === 2 || props.downloadType === 3) {
    procureImportFn(options);
  }
}

// 货品导入时用的方法和api
async function importGoodsFn(options: UploadRequestOptions) {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "正在导入",
    background: "rgba(0, 0, 0, 0.1)",
  });
  try {
    const result = await importGoodsApi(options.file);
    visibleDialog.value = false;
    ElMessage.success("导入成功");
    setTimeout(() => {
      emits("upload");
      uploadRef.value?.clearFiles();
    }, 500);
  } finally {
    loadingInstance.close();
  }
}

async function procureImportFn(options: UploadRequestOptions) {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "正在导入",
    background: "rgba(0, 0, 0, 0.1)",
  });
  try {
    const result = await procureImportApi(options.file);
    visibleDialog.value = false;
    emits("upload", result.data);
    setTimeout(() => {
      ElMessage.success("导入成功");
      uploadRef.value?.clearFiles();
    }, 200);
  } finally {
    loadingInstance.close();
  }
}

/**
 * 限制用户上传文件的格式和大小
 */
function handleBeforeUpload(file: UploadRawFile) {
  console.log("file", file);

  const isExcel = props.accept.includes(file.type);
  const fileSize = file.size / 1024 / 1024 < props.size!;
  if (!isExcel)
    ElNotification({
      title: "温馨提示",
      message: "上传文件只能是 xls / xlsx 格式！",
      type: "warning",
    });
  if (!fileSize)
    setTimeout(() => {
      ElNotification({
        title: "温馨提示",
        message: `上传文件大小不能超过${props.size}MB！`,
        type: "warning",
      });
    }, 0);
  return isExcel && fileSize;
}

// 上传错误提示
const excelUploadError = (error: Error, uploadFile: any, uploadFiles: any) => {
  // console.log("error", error);
  // console.log("uploadFile", uploadFile);
  // console.log("uploadFiles", uploadFiles);
  ElNotification({
    title: "温馨提示",
    message: `导入货品失败，请您重新上传！`,
    type: "error",
  });
};

// 上传成功提示
const excelUploadSuccess = () => {
  console.log("导入货品成功");
  // PS: 此提示只是前端页面拿到了导入的文件,与接口无关,容易造成误解,注释掉
  // ElNotification({
  //   title: "温馨提示",
  //   message: `导入货品成功！`,
  //   type: "success",
  // });
};
</script>

<style scoped lang="scss"></style>
