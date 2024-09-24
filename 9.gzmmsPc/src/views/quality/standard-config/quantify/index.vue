<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
import { debounce } from "@pureadmin/utils";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import {
  createQuantifyApi,
  delQuantifyApi,
  editQuantifyApi,
  getListApi,
} from "@/api/quality/standard-config/quantify/index";
import { useList } from "./utils/hook";

/* 定量项目列表页面 */

defineOptions({
  name: "StandardConfigQuantify",
});
/** plusform搜索表单的ref */
const plusFormRef = ref();
const tableLoading = ref(false);
const tableData = ref([]);
const dialogFormRef = ref();
/** add表单的ref */
const addFormRef = computed(() => {
  return dialogFormRef.value.formInstance as FormInstance;
});


const dialogTitle = ref("新增");
const {
  getBrandData,
  formData,
  searchColumns,
  columns,
  pagination,
  addFormData,
  addFormColumns,
  addFormRules,
  addVisible,
  listId,
  querySearchYiqi,
  querySearchYiju
} = useList(handleSearch);
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getData();
};

// 点击搜索
function handleSearch(){
  getData();
};
/** 点击新建 */
function handleAdd() {
  listId.value = 0;
  addFormRef.value?.resetFields();
  addFormData.value.is_open = 0;
  addFormData.value.brand = [];
  addFormData.value.name = "";
  dialogTitle.value = "新增定量项目";
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
  // console.log("addFormData", addFormData.value);
  // console.log("listId.value", listId.value);
  let { brand, ...rest } = addFormData.value;
  let brandStr = brand.join(",");
  // console.log("传参:", { brand: brandStr, ...rest });
  const result = listId.value
    ? await editQuantifyApi({ id: listId.value, brand: brandStr, ...rest })
    : await createQuantifyApi({ brand: brandStr, ...rest });
  addVisible.value = false;
  ElMessage.success(result.msg);
  getData();
}
// 弹窗表单change
const handleDialogFormChange = (values: FieldValues, column: PlusColumn) => {
  // console.log("handleDialogFormChange:", values);
  // console.log("handleDialogFormChange column:", column);
};
// 单元格点击编辑
const cellEdit = (row: any) => {
  addFormRef.value?.resetFields();
  dialogTitle.value = "编辑定量项目";
  listId.value = row.id;
  addFormData.value.name = row.name;
  addFormData.value.brand = row.brand.split(",");
  addFormData.value.insp_name = row.insp_name;
  addFormData.value.insp_id = row.insp_id;
  addFormData.value.inst_name = row.inst_name;
  addFormData.value.inst_id = row.inst_id;
  addFormData.value.is_open = row.is_open;
  addVisible.value = true;
};
// 单元格点击删除
const cellDel = (row: any) => {
  ElMessageBox.confirm(`确认要删除项目名称为：【${row.name}】的该条内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let result = await delQuantifyApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
};
async function getData() {
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    ...formData.value,
  };
  tableLoading.value = true;
  const result = await getListApi(data);
  tableData.value = result.data.data;
  pagination.total = result.data.total;
  tableLoading.value = false;
}

onActivated(() => {
  // 获取品牌数据
  getBrandData();
  // 获取列表数据
  getData();
  querySearchYiju();
  querySearchYiqi();
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        :showNumber="6"
        labelWidth="80"
        :colProps="{ span: 6 }"
        ref="plusFormRef"
        @reset="handleReset(plusFormRef?.plusFormInstance.formInstance)"
        @search="handleSearch"
      ></PlusSearch>
    </div>
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <template #buttons="scope">
          <el-button type="primary" @click="handleAdd" :icon="Plus" v-hasPerm="['sc:quantify:add']">新建</el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="prueTableRef"
            row-key="id"
            stripe
            header-cell-class-name="table-row-header"
            :data="tableData"
            :columns="dynamicColumns"
            :loading="tableLoading"
            :size="size"
            adaptive
            :adaptiveConfig="{ offsetBottom: 120 }"
            :pagination="pagination"
            @page-size-change="getData()"
            @page-current-change="getData()"
          >
            <template #operation="{ row }">
              <el-button type="primary" link @click="cellEdit(row)" v-hasPerm="['sc:quantify:edit']">编辑</el-button>
              <el-button type="primary" link @click="cellDel(row)" v-hasPerm="['sc:quantify:del']">删除</el-button>
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
        labelWidth: '100px',
        colProps: { span: 12 },
        rowProps: { gutter: 10 },
      }"
      @confirm="addConfirm"
      @change="handleDialogFormChange"
    />
  </div>
</template>
<style lang="scss" scoped></style>
