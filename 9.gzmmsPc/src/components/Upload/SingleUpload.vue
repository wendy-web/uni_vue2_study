<template>
  <el-upload
    class="single-uploader"
    v-model="imgUrl"
    :show-file-list="false"
    list-type="picture-card"
    :before-upload="handleBeforeUpload"
    :http-request="uploadFile"
    :on-remove="handleRemove"
  >
    <div v-if="imgUrl" class="single">
      <img :src="imgHttp + imgUrl" class="single-img" />
    </div>
    <i-ep-plus v-else class="w-6 h-6"></i-ep-plus>
    <template #tip v-if="tipStatus">
      <span class="block text-[12px] text-gray-500">如不设置,则为默认头像</span>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { UploadRawFile, UploadRequestOptions } from "element-plus";
import { computed } from "vue";
import { uploadFileApi } from "@/api/common";
import { useSettingsStoreHook } from "@/store/modules/settings";

const useSetting = useSettingsStoreHook();

const emit = defineEmits(["update:modelValue"]);
const imgHttp = useSetting.baseHttp;
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  tipStatus: {
    type: Boolean,
    default: false,
  },
});

const imgUrl = computed<string | undefined>({
  get() {
    return props.modelValue;
  },
  set(val) {
    // imgUrl改变时触发修改父组件绑定的v-model的值
    emit("update:modelValue", val);
  },
});

/**
 * 自定义图片上传
 *
 * @param options
 */
async function uploadFile(options: UploadRequestOptions): Promise<any> {
  // imgUrl.value = "http://ewsystem.y1b.cn/static/uploads/1/20230217/7c860a662b28df2f2d7045f22700b13f.jpg"
  const { data: fileInfo } = await uploadFileApi(options.file);
  imgUrl.value = fileInfo.src;
}

/**
 * 限制用户上传文件的格式和大小
 */
function handleBeforeUpload(file: UploadRawFile) {
  if (file.size > 2 * 1048 * 1048) {
    ElMessage.warning("上传图片不能大于2M");
    return false;
  }
  return true;
}

function handleRemove() {
  console.log();
}
</script>

<style scoped lang="scss">
.single-uploader .single {
  width: 148px;
  height: 148px;
  display: block;
  position: relative;
}
.single-img {
  width: 100%;
  height: 100%;
}
.single-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

/* .single-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
} */

/* .el-icon.single-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  text-align: center;
} */
</style>
