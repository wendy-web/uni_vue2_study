<script setup lang="ts">
/* 版本号配置-列表页面 */
import { Plus } from "@element-plus/icons-vue";
import type { FormInstance, TableInstance } from "element-plus";
import { debounce } from "@pureadmin/utils";
import {
  createVersionApi,
  delVersionApi,
  editVersionApi,
  getVersionListApi,
} from "@/api/quality/standard-config/version/index";
import { VersionListType } from "@/api/quality/standard-config/version/types";
import { useList } from "./utils/hook";

defineOptions({
  name: "StandardConfigVersion",
});

const {
  pagination,
  formData,
  columns,
  searchColumns,
  addFormData,
  addFormColumns,
  addFormRules,
  addVisible,
} = useList(handleSearch);

/** plusform搜索表单的ref */
const plusFormRef = ref();
/** puretable的ref */
const prueTableRef = ref();
const tableData = ref<VersionListType[]>([]);
const tableLoading = ref(false);

const dialogFormRef = ref();
/** add表单的ref */
const addFormRef = computed(() => {
  return dialogFormRef.value.formInstance as FormInstance;
});

/** 记录编辑的id */
const listId = ref(0);
const dialogTitle = ref("新增版本信息");

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

async function getData() {
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    ...formData.value,
  };
  tableLoading.value = true;
  const result = await getVersionListApi(data);
  tableData.value = result.data.data;
  pagination.total = result.data.total;
  tableLoading.value = false;
}

/** 点击新建 */
function handleAdd() {
  listId.value = 0;
  addFormRef.value?.resetFields();
  addFormData.value.is_open = 0;
  addFormData.value.version_no = "";
  addFormData.value.name = "";
  dialogTitle.value = "新增版本信息";
  addVisible.value = true;
  nextTick(() => {
    nextTick(() => {
      addFormRef.value.clearValidate(["version_no", "name"]);
    });
  });
}
/** 新建/编辑弹窗点击确定 */
const addConfirm = debounce(addConfirmHandle, 1000, true);

async function addConfirmHandle() {
  console.log("addFormData", addFormData.value);
  console.log("listId.value", listId.value);
  const result = listId.value
    ? await editVersionApi({ id: listId.value, ...addFormData.value })
    : await createVersionApi({ ...addFormData.value });
  addVisible.value = false;
  ElMessage.success(result.msg);
  getData();
}

/** 点击编辑 */
function handleEdit(row: VersionListType) {
  addFormRef.value?.resetFields();
  dialogTitle.value = "编辑版本信息";
  listId.value = row.id;
  console.log("🚀 ~ handleEdit ~ listId.value :", listId.value);
  addFormData.value.name = row.name;
  addFormData.value.version_no = row.version_no;
  addFormData.value.is_open = row.is_open;

  addVisible.value = true;
  console.log("🚀 ~ handleEdit ~ addFormData.value:", addFormData.value);
  // nextTick(() => {
  //   addFormData.value.name = row.name;
  //   addFormData.value.version_no = row.version_no;
  //   addFormData.value.is_open = row.is_open;
  // });
}

/** 点击删除 */
function handleDel(row: VersionListType) {
  ElMessageBox.confirm(`确认要删除版本名为：【${row.name}】的该条内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const result = await delVersionApi({ id: row.id });
      addVisible.value = false;
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
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
        :showNumber="6"
        labelWidth="60"
        :colProps="{ span: 4 }"
        ref="plusFormRef"
        @reset="handleReset(plusFormRef?.plusFormInstance.formInstance)"
        @search="handleSearch"
      ></PlusSearch>
    </div>
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <template #buttons="scope">
          <el-button type="primary" @click="handleAdd" :icon="Plus" v-hasPerm="['sc:version:add']">新建</el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="prueTableRef"
            row-key="id"
            header-cell-class-name="table-gray-header"
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
              <el-button type="primary" link @click="handleEdit(row)" v-hasPerm="['sc:version:edit']">编辑</el-button>
              <el-button type="primary" link @click="handleDel(row)" v-hasPerm="['sc:version:del']">删除</el-button>
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
      :form="{ columns: addFormColumns, rules: addFormRules, labelWidth: '100px' }"
      @confirm="addConfirm"
    />
  </div>
</template>
<style lang="scss" scoped></style>
