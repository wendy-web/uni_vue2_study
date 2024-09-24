<script setup lang="ts">
/* CIP灌装间卫生检查表-列表页面 */
import { Plus } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
import { isArray } from "@pureadmin/utils";
import {
  cipHygieneAddApi,
  cipHygieneDelApi,
  cipHygieneExportApi,
  getCipHygieneListApi,
} from "@/api/quality/environment/cip-hygiene";
import { useCommonHooks } from "@/hooks/quality";
import listBtnVue from "@/views/quality/environment/components/checkOrder/listBtn.vue";
import { useList } from "./utils/hook";

defineOptions({
  name: "EnvironmentCipHygiene",
});
const { startDownloadUrl } = useCommonHooks();
const {
  pagination,
  formData,
  columns,
  searchColumns,
  cellDetail,
  router,
  addFormData,
  addFormColumns,
  addVisible,
  addFormRules,
  addLoading,
} = useList(handleSearch);

const tableData = ref<any[]>([]);
const tableLoading = ref(false);
const ids = ref<number[]>([]);

/** plusform搜索表单的ref */
const plusFormRef = ref();

const dialogFormRef = ref();
const addFormRef = computed(() => {
  return dialogFormRef.value.formInstance as FormInstance;
});

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
  let { check_date, create_time, ...rest } = formData.value;
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    check_date_start: isArray(check_date) ? check_date[0] : "",
    check_date_end: isArray(check_date) ? check_date[1] : "",
    create_time_start: isArray(create_time) ? create_time[0] : "",
    create_time_end: isArray(create_time) ? create_time[1] : "",
    ...rest,
  };
  tableLoading.value = true;
  const result = await getCipHygieneListApi(data);
  tableData.value = result.data.data;
  pagination.total = result.data.total;
  tableLoading.value = false;
}

// 勾选触发事件
function changeSelect(selection: any[]) {
  ids.value = selection.map((item) => {
    return item.id;
  });
}

function handleExport() {
  if (ids.value.length === 0) {
    return ElMessage.warning("请您至少勾选一条数据");
  }
  startDownloadUrl(cipHygieneExportApi, { ids: ids.value });
}

/** 点击新建 */
function handleAdd() {
  addVisible.value = true;
}

/** 新建弹窗点击取消 */
function handleAddCancel() {
  addVisible.value = false;
}

function dialogClose() {
  addLoading.value = false;
  addFormRef.value?.resetFields();
}

const handleAddConfirm = async (handleSubmit: () => Promise<boolean>, type = 1) => {
  const isPass = await handleSubmit();
  if (!isPass) return;
  addLoading.value = true;
  let data = { ...addFormData.value };
  const result = await cipHygieneAddApi(data);
  addLoading.value = false;
  addVisible.value = false;
  let id = result.data.id;
  if (type === 1) {
    getData();
  } else {
    router.push({
      path: "/quality/environment/cip-hygiene/add",
      query: {
        id,
        pageType: 2,
      },
    });
  }
};

/** 点击编辑 */
function cellEdit(row: any) {
  router.push({
    path: "/quality/environment/cip-hygiene/add",
    query: {
      id: row.id,
      pageType: 2,
    },
  });
}

/** 点击删除 */
function cellDel(row: any) {
  ElMessageBox.confirm(`确认要删除单据编号为：【${row.order_no}】的该条内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定删除");
      const result = await cipHygieneDelApi({ id: row.id });
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
        label-position="right"
        ref="plusFormRef"
        @reset="handleReset(plusFormRef?.plusFormInstance.formInstance)"
        @search="handleSearch"
      ></PlusSearch>
    </div>
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <template #buttons="scope">
          <el-button type="primary" @click="handleAdd" :icon="Plus">新建</el-button>
          <el-button type="primary" @click="handleExport">导出选中数据</el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="prueTableRef"
            row-key="id"
            stripe
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
            @selection-change="changeSelect"
          >
            <template #operation="{ row }">
              <listBtnVue
                :status="row.status"
                :order-type="1"
                :ctUid="row.ct_uid"
                v-on="{
                  detail: () => cellDetail(row),
                  edit: () => cellEdit(row),
                  delete: () => cellDel(row),
                }"
              ></listBtnVue>
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
        title: '新建卫生表',
        draggable: true,
        hasFooter: false,
        onClose: dialogClose,
        top: '20vh',
      }"
      :form="{
        columns: addFormColumns,
        rules: addFormRules,
        labelWidth: '100px',
        labelPosition: 'right',
        hasFooter: true,
        colProps: {
          span: 12,
        },
      }"
    >
      <template #form-footer="{ handleSubmit }">
        <div class="flex justify-center mt-10 w-full">
          <el-button class="mr-4 w-[80px]" @click="handleAddCancel" size="large">取消</el-button>
          <el-button
            type="primary"
            :loading="addLoading"
            @click="handleAddConfirm(handleSubmit, 1)"
            class="mr-4 w-[100px]"
            size="large"
          >
            确认
          </el-button>
          <el-button
            type="primary"
            :loading="addLoading"
            @click="handleAddConfirm(handleSubmit, 2)"
            v-hasPerm="['environment:ciphygiene:execute']"
            size="large"
          >
            确认并执行
          </el-button>
        </div>
      </template>
    </PlusDialogForm>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/common.scss";
</style>
