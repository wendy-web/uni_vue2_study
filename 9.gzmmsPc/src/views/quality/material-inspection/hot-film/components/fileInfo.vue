<script setup lang="tsx">
import { buildUUID } from "@pureadmin/utils";
import { useCommonHooks } from "@/hooks/quality";
import { useSettingsStoreHook } from "@/store/modules/settings";
import qualitySelectFile from "@/views/quality/components/SelectFile/index.vue";

const { startDirectDownload } = useCommonHooks();

const useSetting = useSettingsStoreHook();

interface FileItemType {
  id?: number;
  oid?: number;
  file_name: string;
  file_url: string;
  note: string;
  download_num?: number;
  ct_uid?: number;
  up_uid?: number;
  create_time?: string;
  update_time?: string;
}
const props = defineProps(["fileColumns", "formData", "editDisabled"]);
/** 附件表格数据 */
const fileData = ref<FileItemType[]>([]);
const selectFileRef = ref<InstanceType<typeof qualitySelectFile>>();
const visible = ref(false);
const selectFileTitle = ref("新增上传文件");
// 多选的行
const multipleSelection = ref([]);
// 表格多选
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
};
// 点击上传文件
function handleUpload() {
  selectFileTitle.value = "新增上传文件";
  visible.value = true;
  selectFileRef.value?.clear();
}
// 监听上传文件点击确定后的事件
async function handleUploadConfirm(fileValues: {
  file_url: string;
  file_name: string;
  note: string;
}) {
  // 拿到值以后，需要将值传给父组件: 自定义一个唯一 unique_id 方便多选删除
  let unique_id = buildUUID();
  let fileItem = {
    unique_id,
    ...fileValues,
  };
  fileData.value.push(fileItem);
}
// 删除选中的表格
const handleDelete = () => {
  let ids = multipleSelection.value.map((item: any) => item.unique_id || item.id);
  console.log("ids:", ids);
  fileData.value = fileData.value.filter((item: any) => !ids.includes(item.unique_id || item.id));
};

watch(
  () => fileData.value,
  (newValue) => {
    if (newValue) {
      props.formData.files = newValue;
    }
  },
  {
    deep: true,
  },
);
// 监听 props.formData 的变化
watch(
  () => props.formData,
  (newFormData) => {
    if (newFormData && newFormData.files) {
      fileData.value = newFormData.files;
    }
  },
  { immediate: true, deep: true }, // 立即执行一次，以确保初始值被设置
);
</script>
<template>
  <div class="font-bold text-[14px]">附件信息</div>
  <div class="mt-2">
    <div class="mb-2" v-if="!editDisabled">
      <el-button type="primary" @click="handleUpload">上传附件</el-button>
      <el-button @click="handleDelete">删除</el-button>
    </div>

    <PureTable
      row-key="id"
      border
      :columns="fileColumns"
      :data="fileData"
      @selection-change="handleSelectionChange"
    >
      <template #operation="{ row }">
        <el-button
          v-if="row.file_url"
          type="primary"
          link
          @click="startDirectDownload(row.file_url, row.file_name)"
        >
          下载
        </el-button>
      </template>
    </PureTable>
    <qualitySelectFile
      ref="selectFileRef"
      @confirm="handleUploadConfirm"
      v-model="visible"
      :title="selectFileTitle"
    ></qualitySelectFile>
  </div>
</template>
<style lang="scss" scoped></style>
