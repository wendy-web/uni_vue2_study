<script setup lang="ts">
import type { TabsPaneContext } from "element-plus";
import { downloadEqFileApi, getEquipmentInfoApi } from "@/api/device/archive/equipment/index";
import { useBaseData } from "@/hooks/device/baseData";
import { useTable } from "@/hooks/table";
import { useAdd } from "../utils/add";
import { useList } from "../utils/hook";
import { usePreviewHooks } from "@/hooks/list";


const props = defineProps(["listId", "detailData"]);
const { previewFile, checkFileType } = usePreviewHooks();
const { startdownload } = useTable();
const { getStatusTitle } = useList();
const { getLineName } = useBaseData();
const { detailGroup, logColumns, fileColumns, deviceColumns, sparePartColumns } = useAdd("detail");

const model = defineModel({ required: true, default: false });
const activeName = ref("first");
const detailLoading = ref(false);
const detailFormData = ref(props.detailData as any);
/** 附件信息列表 */
const files_list = ref([]);
/** 设备关联备件列表 */
const parts_list = ref([]);
/** 日志信息 */
const logs_list = ref([]);
/** 子设备信息 */
const childList = ref([]);

const handleClick = (tab: TabsPaneContext, event: Event) => {
  // console.log(tab, event);
};

async function getDetail() {
  detailLoading.value = true;
  const result = await getEquipmentInfoApi({ id: props.listId });
  detailLoading.value = false;
  files_list.value = result.data.files_list;
  parts_list.value = result.data.parts_list;
  logs_list.value = result.data.logs_list;
  childList.value = result.data.child;
}

function downloadFile(row: any) {
  startdownload(downloadEqFileApi, { id: row.id });
}

// 单元格点击预览
function cellPreview(row: any) {
  previewFile({ name: row.file_name, url: row.file_url });
}


watch(
  () => model.value,
  (newVal) => {
    if (newVal && props.listId) {
      activeName.value = "first";
      getDetail();
    }
  },
  {
    immediate: true,
  },
);
watch(
  () => props.detailData,
  (newData) => {
    detailFormData.value = newData;
  },
);
</script>
<template>
  <el-drawer v-model="model" title="设备档案详情" size="60%">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="设备信息" name="first">
        <PlusForm
          v-model="detailFormData"
          :group="detailGroup"
          :colProps="{ span: 8 }"
          :rowProps="{ gutter: 20 }"
          :hasFooter="false"
          v-loading="detailLoading"
        >
          <template #plus-field-status>
            <el-input type="text" readonly :value="getStatusTitle(detailFormData.status)" />
          </template>
          <template #plus-field-product_line>
            <el-input type="text" readonly :value="detailFormData.product_line_text || '--'" />
          </template>
        </PlusForm>
      </el-tab-pane>
      <el-tab-pane label="附件信息" name="second">
        <pure-table
          header-cell-class-name="table-gray-header"
          :data="files_list"
          :columns="fileColumns"
        >
          <template #operation="{row}">
            <el-button type="primary" link @click="cellPreview(row)" v-if="checkFileType(row.file_name)">预览</el-button>
            <el-button type="primary" link @click="downloadFile(row)">下载</el-button>
          </template>
        </pure-table>
      </el-tab-pane>
      <el-tab-pane label="关联子设备" name="third">
        <pure-table
          header-cell-class-name="table-gray-header"
          :data="childList"
          :columns="deviceColumns"
        ></pure-table>
      </el-tab-pane>
      <el-tab-pane label="关联备件" name="fourth">
        <pure-table
          header-cell-class-name="table-gray-header"
          :data="parts_list"
          :columns="sparePartColumns"
        ></pure-table>
      </el-tab-pane>
      <el-tab-pane label="日志记录" name="fifth">
        <pure-table
          header-cell-class-name="table-gray-header"
          :data="logs_list"
          :columns="logColumns"
        ></pure-table>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <div class="flex items-start pb-4">
        <el-button type="primary" plain size="large" class="w-[100px]" @click="model = false">
          关闭
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>
<style lang="scss" scoped></style>
