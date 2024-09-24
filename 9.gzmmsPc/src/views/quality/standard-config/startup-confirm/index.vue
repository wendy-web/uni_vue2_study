<script setup lang="ts">
/** 开机确认人配置列表页 */
import { Plus } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
import { debounce } from "@pureadmin/utils";
import {
  createApi,
  deleteApi,
  editApi,
  getListApi,
} from "@/api/quality/standard-config/startupconfirm/index";
import { useList } from "./utils/hook";

defineOptions({
  name: "StandardConfigStartupConfirm",
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

/** 记录编辑的id */
const listId = ref(0);
const dialogTitle = ref("新增");
const {
  formData,
  searchColumns,
  columns,
  pagination,
  addFormData,
  addFormColumns,
  addFormRules,
  addVisible,
} = useList(handleSearch);
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getData();
};

// 点击搜索
function handleSearch() {
  getData();
}
/** 点击新建 */
function handleAdd() {
  listId.value = 0;
  dialogTitle.value = "新增";
  addVisible.value = true;
  nextTick(() => {
    addFormRef.value?.resetFields();
    addFormData.value.line_id = undefined;
    addFormData.value.pz_manager_uid = undefined;
    addFormData.value.product_manag_uid = undefined;
    addFormData.value.laboratory_manager_uid = undefined;
  });
}
/** 新建/编辑弹窗点击确定 */
const addConfirm = debounce(addConfirmHandle, 1000, true);

async function addConfirmHandle() {
  // console.log("listId.value", listId.value);
  console.log("传参:", { ...addFormData.value });
  addVisible.value = false;
  // ElMessage.success('敬请期待~');

  const result = listId.value
    ? await editApi({ id: listId.value, ...addFormData.value })
    : await createApi({ ...addFormData.value });
  addVisible.value = false;
  ElMessage.success(result.msg);
  getData();
}

// 单元格点击编辑
const cellEdit = (row: any) => {
  // console.log("点击编辑：", row);
  addFormRef.value?.resetFields();
  dialogTitle.value = "编辑";
  listId.value = row.id;
  addFormData.value.line_id = row.line_id;
  addFormData.value.pz_manager_uid = row.pz_manager_uid;
  addFormData.value.product_manag_uid = row.product_manag_uid;
  addFormData.value.laboratory_manager_uid = row.laboratory_manager_uid;
  addVisible.value = true;
};
// 单元格点击删除
const cellDel = (row: any) => {
  ElMessageBox.confirm(`确认要删除生产线别为：【${row.line_name}】的该条内容吗?`, "警告", {
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
async function getData() {
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    ...formData.value,
  };
  tableLoading.value = true;
  try {
    const result = await getListApi(data);
    tableData.value = result.data.data;
    pagination.total = result.data.total;
    tableLoading.value = false;
  } catch (error) {
    console.log("getData error:", error);
    tableLoading.value = false;
  }
}

onActivated(() => {
  // 获取列表数据
  getData();
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
          <el-button type="primary" @click="handleAdd" :icon="Plus" v-hasPerm="['sc:startupconfirm:add']">新建</el-button>
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
              <el-button type="primary" link @click="cellEdit(row)" v-hasPerm="['sc:startupconfirm:edit']">编辑</el-button>
              <el-button type="primary" link @click="cellDel(row)" v-hasPerm="['sc:startupconfirm:del']">删除</el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
    <PlusDialogForm
      ref="dialogFormRef"
      class="w-[450px] m-auto"
      v-model:visible="addVisible"
      v-model="addFormData"
      :dialog="{
        title: dialogTitle,
        draggable: true,
        width: '480px',
      }"
      :form="{
        columns: addFormColumns,
        rules: addFormRules,
        rowProps: { gutter: 10 },
        labelPosition: 'right',
      }"
      @confirm="addConfirm"
    />
  </div>
</template>
<style lang="scss" scoped></style>
