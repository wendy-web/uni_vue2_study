<script setup lang="ts">
import type { FormInstance, TableColumnCtx } from "element-plus";
import { debounce } from "@pureadmin/utils";
import {
  createApi,
  deleteApi,
  editApi,
  getListApi,
} from "@/api/product-stock/product-warehouse/index";
import { usePreviewHooks } from "@/hooks/list";
import { useCommonHooks } from "@/hooks/quality";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useList } from "./utils/hook";

/* 成品仓库管理页面 */
defineOptions({
  name: "ProductStockProductWarehouse",
});
const { startDownloadUrl } = useCommonHooks();
const useSetting = useSettingsStoreHook();
const { previewFile } = usePreviewHooks();

const {
  columns,
  searchColumns,
  pagination,
  formData,
  tableData,
  addFormData,
  addFormColumns,
  addFormRules,
  addVisible,
  listId,
} = useList(handleSearch);
/** plusform搜索表单的ref */
const plusFormRef = ref();
const tableLoading = ref(false);
/** table的ref */
const prueTableRef = ref();
function handleSearch() {
  getData();
}
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getData();
};
const dialogFormRef = ref();
/** add表单的ref */
const addFormRef = computed(() => {
  return dialogFormRef.value.formInstance as FormInstance;
});
const dialogTitle = ref("新增");

/** 点击新建 */
function handleAdd() {
  listId.value = 0;
  addFormRef.value?.resetFields();
  dialogTitle.value = "新增仓库";
  addVisible.value = true;
  nextTick(() => {
    nextTick(() => {
      addFormRef.value.clearValidate();
    });
  });
}
/** 新建/编辑弹窗点击确定 */
const addConfirm = debounce(addConfirmHandle, 1000, true);

async function addConfirmHandle() {
  let { ...rest } = addFormData.value;
  const result = listId.value
    ? await editApi({ id: listId.value, ...rest })
    : await createApi({ ...rest });
  addVisible.value = false;
  ElMessage.success(result.msg);
  getData();
}
// 单元格点击编辑
const cellEdit = (row: any) => {
  addFormRef.value?.resetFields();
  dialogTitle.value = "编辑仓库";
  listId.value = row.id;
  addFormData.value.factory_code = row.factory_code;
  addFormData.value.factory_name = row.factory_name;
  addFormData.value.site = row.site;
  addFormData.value.note = row.note;
  addVisible.value = true;
};
// 单元格点击删除
const cellDel = (row: any) => {
  ElMessageBox.confirm(`确认要删除项目名称为：【${row.factory_name}】的该条内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let result = await deleteApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
};
// 单元格点击预览
function cellPreview(row: any) {
  // previewFile({ name: 'png', url: row.graphical_img_url });
  window.open(useSetting.baseHttp + row.graphical_img_url, "_blank");
}
async function getData() {
  tableLoading.value = true;
  let { ...rest } = formData.value;

  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    ...rest,
  };
  try {
    const result = await getListApi(data);
    tableLoading.value = false;
    // 数据处理
    tableData.value = result.data.list;
    pagination.total = result.data.total;
    // console.log("列表数据：", tableData.value);
  } catch (error) {
    tableLoading.value = false;
    console.log("列表error：", error);
  }
}

onActivated(() => {
  getData();
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        :showNumber="10"
        ref="plusFormRef"
        @reset="handleReset(plusFormRef?.plusFormInstance.formInstance)"
        @search="handleSearch"
      ></PlusSearch>
    </div>
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <template #buttons>
          <el-button type="primary" @click="handleAdd">新增仓库</el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="prueTableRef"
            row-key="id"
            :data="tableData"
            :columns="dynamicColumns"
            :size="size"
            adaptive
            :adaptiveConfig="{ offsetBottom: 120 }"
            header-cell-class-name="table-gray-header"
            :pagination="pagination"
            :paginationSmall="size === 'small' ? true : false"
            border
            @page-size-change="getData()"
            @page-current-change="getData()"
            :loading="tableLoading"
          >
            <template #operation="{ row }">
              <el-button type="primary" link @click="cellEdit(row)">编辑</el-button>
              <el-button type="primary" link @click="cellDel(row)">删除</el-button>
            </template>
            <template #graphical_img_url="{ row }">
              <!-- <el-image
                :src="useSetting.baseHttp + row.graphical_img_url"
                style="width: 100px; height: 60px; border-radius: 6px"
                :preview-src-list="[useSetting.baseHttp + row.graphical_img_url]"
                :z-index="9999"
                preview-teleported
                v-if="row.graphical_img_url"
              /> -->
              <el-button v-if="row.graphical_img_url" type="primary" link @click="cellPreview(row)">
                查看
              </el-button>

              <span v-else>—</span>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
    <PlusDialogForm
      ref="dialogFormRef"
      v-model:visible="addVisible"
      v-model="addFormData"
      :dialog="{
        title: dialogTitle,
        draggable: true,
      }"
      :form="{
        columns: addFormColumns,
        rules: addFormRules,
        labelWidth: '120',
        labelPosition:'right',
        colProps: { span: 12 },
        rowProps: { gutter: 10 },
      }"
      @confirm="addConfirm"
    />
  </div>
</template>
<style lang="scss" scoped></style>
