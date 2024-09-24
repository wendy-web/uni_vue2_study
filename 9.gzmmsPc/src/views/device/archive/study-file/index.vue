<script setup lang="ts">
import type { FormInstance } from "element-plus";
import {
  delFileApi,
  downloadFileApi,
  getFileListApi,
  saveFileApi,
  updateFileApi,
} from "@/api/device/archive/study-file/index";
import type { FileItemType } from "@/api/device/archive/study-file/types";
import PreviewFile from "@/components/Device/PreviewFile/index.vue";
import SelectFile from "@/components/Device/SelectFile/index.vue";
import { usePreviewHooks } from "@/hooks/list";
import { useTable } from "@/hooks/table";
import { useList } from "./utils/hook";

defineOptions({
  name: "deviceStudyFile",
});

const { previewFile, checkFileType } = usePreviewHooks();
const { startdownload } = useTable();
const { columns, searchColumns, pagination, fileTypeList, getTypeList } = useList();
const formData = ref({
  file_name: "",
  type: undefined as FormNumType,
});
const formRef = ref();
const tableData = ref<FileItemType[]>([]);
const tableLoading = ref(false);
const prueTableRef = ref();
const selectFileRef = ref<InstanceType<typeof SelectFile>>();
const visible = ref(false);
const selectFileTitle = ref("新增上传文件");
const edit_id = ref(0);

const handleSearch = () => {
  getData();
};
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getData();
};

// 点击上传文件
function handleUpload() {
  edit_id.value = 0;
  selectFileTitle.value = "新增上传文件";
  visible.value = true;
  selectFileRef.value?.clear();
}

// 监听上传文件点击确定后的事件
async function handleUploadConfirm(fileValues: {
  type: number;
  file_url: string;
  file_name: string;
  create_time: string;
  note: string;
}) {
  const result = edit_id.value
    ? await updateFileApi({ id: edit_id.value, ...fileValues })
    : await saveFileApi(fileValues);
  ElMessage.success(result.msg);
  getData();
}

// 单元格点击编辑
function cellEdit(row: FileItemType) {
  edit_id.value = row.id;
  selectFileTitle.value = "编辑上传文件";
  visible.value = true;
  selectFileRef.value?.setFileValues({
    type: row.type,
    file_url: row.file_url,
    file_name: row.file_name,
    create_time: row.create_time,
    note: row.note,
  });
}

const showIframePopup = ref(false);
const file_url = ref("");

// 单元格点击预览
function cellPreview(row: FileItemType) {
  previewFile({ name: row.file_name, url: row.file_url });
}

// 单元格点击删除
function cellDel(row: FileItemType) {
  ElMessageBox.confirm(`确认要删除文件名为：【${row.file_name}】的该条内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const result = await delFileApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
}
// 单元格点击下载
function cellDownload(row: FileItemType) {
  startdownload(downloadFileApi, { id: row.id });
}

async function getData() {
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    ...formData.value,
  };
  tableLoading.value = true;
  const result = await getFileListApi(data);
  tableData.value = result.data.data;
  pagination.total = result.data.total;
  tableLoading.value = false;
}

onActivated(() => {
  getData();
  getTypeList();
  prueTableRef.value?.setAdaptive();
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        :showNumber="10"
        :colProps="{ span: 4 }"
        ref="formRef"
      >
        <template #footer>
          <FormBtn
            @search="handleSearch"
            @reset="handleReset(formRef?.plusFormInstance.formInstance)"
          ></FormBtn>
        </template>
      </PlusSearch>
    </div>
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <template #buttons>
          <el-button type="primary" @click="handleUpload" v-hasPerm="['archive:studyfile:add']">
            上传文件
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="prueTableRef"
            :data="tableData"
            :columns="dynamicColumns"
            :size="size"
            adaptive
            :adaptiveConfig="{ offsetBottom: 120 }"
            header-cell-class-name="table-gray-header"
            :pagination="pagination"
            :paginationSmall="size === 'small' ? true : false"
            @page-size-change="getData()"
            @page-current-change="getData()"
            :loading="tableLoading"
          >
            <template #operation="{ row }">
              <el-button type="primary" link @click="cellPreview(row)" v-if="checkFileType(row.file_name)">预览</el-button>
              <el-button
                type="primary"
                link
                @click="cellEdit(row)"
                v-hasPerm="['archive:studyfile:edit']"
              >
                编辑
              </el-button>
              <el-button
                type="primary"
                link
                @click="cellDownload(row)"
                v-hasPerm="['archive:studyfile:download']"
              >
                下载
              </el-button>
              <el-button
                type="info"
                link
                @click="cellDel(row)"
                v-hasPerm="['archive:studyfile:del']"
              >
                删除
              </el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
    <PreviewFile v-model="showIframePopup" :src="file_url"></PreviewFile>
    <SelectFile
      ref="selectFileRef"
      @confirm="handleUploadConfirm"
      v-model="visible"
      :list="fileTypeList"
      :title="selectFileTitle"
    ></SelectFile>
  </div>
</template>
<style lang="scss" scoped></style>
