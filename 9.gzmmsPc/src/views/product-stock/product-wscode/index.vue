<script setup lang="ts">
import type { FormInstance, TableColumnCtx } from "element-plus";
import { debounce } from "@pureadmin/utils";
import {
  createApi,
  deleteApi,
  editApi,
  getListApi,
  getTemplateApi,
} from "@/api/product-stock/product-wscode/index";
import { useCommonHooks } from "@/hooks/quality";
import { useSettingsStoreHook } from "@/store/modules/settings";
// 引入excel导入组件
import ExcelUpload from "../components/Upload/ExcelUpload.vue";
import { useList } from "./utils/hook";

const { startDirectDownload } = useCommonHooks();

/* 成品库位管理*/
defineOptions({
  name: "ProductStockProductWscode",
});
const useSetting = useSettingsStoreHook();
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
  getFactoryCodeList,
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
  dialogTitle.value = "新增库位";
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
  dialogTitle.value = "编辑库位";
  listId.value = row.id;
  addFormData.value.factory_code = row.factory_code;
  addFormData.value.ws_code_name = row.ws_code_name;
  addFormData.value.ws_code = row.ws_code;
  addFormData.value.note = row.note;
  addVisible.value = true;
};
// 单元格点击删除
const cellDel = (row: any) => {
  ElMessageBox.confirm(`确认要删除项目名称为：【${row.ws_code_name}】的该条内容吗?`, "警告", {
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
// 下载模板
function handleDownload(row: any) {
  startDirectDownload("/static/库位导入模版.xlsx", "库位导入模版");
}
// 上传文件弹窗显示
const uploadShow = ref(false);
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
  getFactoryCodeList();
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
          <el-button type="primary" @click="handleAdd">新增库位</el-button>
          <el-button type="success" @click="uploadShow = true">
            <template #icon>
              <i-ep-Upload></i-ep-Upload>
            </template>
            导入库位
          </el-button>
          <!-- <el-button @click="handleDownload">下载模板</el-button> -->
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
        labelWidth: '110px',
        colProps: { span: 12 },
        rowProps: { gutter: 10 },
      }"
      @confirm="addConfirm"
    />
    <ExcelUpload v-model:visible="uploadShow" :download-type="1" @upload="getData"></ExcelUpload>
  </div>
</template>
<style lang="scss" scoped></style>
