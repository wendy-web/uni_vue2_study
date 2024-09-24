<script setup lang="ts">
import { buildUUID } from "@pureadmin/utils";
// 引入空罐顶盖重量检测接口
import { delFileApi, saveFileApi } from "@/api/quality/process-inspection/weigh/index";
import { useCommonHooks } from "@/hooks/quality";
import { useSettingsStoreHook } from "@/store/modules/settings";
import SelectFile from "@/views/quality/components/SelectFile/index.vue";

const { startDirectDownload } = useCommonHooks();

interface FileItemType {
  /** row-key唯一标识 */
  id: number | string;
  file_name: string;
  file_url: string;
  note: string;
}

interface Props {
  fileList: FileItemType[];
  /** 是否禁用 */
  disabled?: boolean;
  listId?: number | string;
}

const props = defineProps<Props>();
const emit = defineEmits(["update"]);
const useSetting = useSettingsStoreHook();

const fileData = ref<FileItemType[]>(props.fileList);
const multipleSelection = ref<FileItemType[]>([]);
const selectFileRef = ref<InstanceType<typeof SelectFile>>();
const visible = ref(false);
const selectFileTitle = ref("新增上传文件");

// 表格多选
const handleSelectionChange = (val: FileItemType[]) => {
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
  // 拿到值以后，需要将值传给父组件: 自定义一个唯一 id 方便多选删除
  let fileItem = {
    id: buildUUID(),
    ...fileValues,
  };
  fileData.value.push(fileItem);
  let params = {
    oid: props.listId,
    ...fileValues,
  };
  let res: any = await saveFileApi(params);
  let { code } = res;
  // 上传成功，更新数据
  if (+code === 1) {
    emit("update");
  }
}

// 删除选中的表格
const handleDelete = async () => {
  let ids = multipleSelection.value.map((item) => item.id);
  console.log("ids:", ids);
  let params = {
    id: ids,
  };
  let res: any = await delFileApi(params);
  let { code } = res;
  // 删除成功，更新数据
  if (+code === 1) {
    // fileData.value = fileData.value.filter((item) => !ids.includes(item.id));
    emit("update");
  }
};

function getChangeFileData() {
  let arr = fileData.value.map((item) => {
    let { id, ...rest } = item;
    let itemObj = {
      ...rest,
    };
    return typeof id === "string" ? itemObj : item;
  });
  return arr;
}

defineExpose({
  getChangeFileData,
});

watch(
  () => props.fileList,
  (val) => {
    fileData.value = val;
  },
);

const fileColumns = ref<TableColumnList>([
  {
    label: "勾选列",
    type: "selection",
    hide: () => props.disabled,
  },
  {
    label: "附件名称",
    prop: "file_name",
  },
  {
    label: "备注",
    prop: "note",
  },
  {
    label: "操作",
    slot: "operation",
  },
]);
</script>
<template>
  <div class="px-8">
    <div class="mb-2" v-if="!disabled">
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
    <SelectFile
      ref="selectFileRef"
      @confirm="handleUploadConfirm"
      v-model="visible"
      :title="selectFileTitle"
    ></SelectFile>
  </div>
</template>
<style lang="scss" scoped></style>
