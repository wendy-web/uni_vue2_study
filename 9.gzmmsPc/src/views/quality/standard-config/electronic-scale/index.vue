<script setup lang="ts">
/* 电子秤列表页面 */
import { Plus } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
import { debounce } from "@pureadmin/utils";
import {
  electronicScaleAddApi,
  electronicScaleDelApi,
  electronicScaleEditApi,
  getElectronicScaleListApi,
} from "@/api/quality/standard-config/electronic-scale/index";
import PlaceSelect from "@/components/DeptSelect/PlaceSelect.vue";
import { useList } from "./utils/hook";

defineOptions({
  name: "StandardConfigElectronicScale",
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
  getInstMap,
  placeList,
} = useList(handleSearch);

/** plusform搜索表单的ref */
const plusFormRef = ref();
/** puretable的ref */
const prueTableRef = ref();
const tableData = ref<any[]>([]);
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
  const result = await getElectronicScaleListApi(data);
  tableData.value = result.data.data;
  pagination.total = result.data.total;
  tableLoading.value = false;
}

/** 点击新建 */
function handleAdd() {
  listId.value = 0;
  addFormRef.value?.resetFields();
  addFormData.value.name = "";
  addFormData.value.sort = "";
  addFormData.value.inst_id = "";
  addFormData.value.name = "";
  addFormData.value.productserial_no = "";
  addFormData.value.inst_type_no = "";
  addFormData.value.max_val = "";
  addFormData.value.max_unit = "";
  addFormData.value.e_val = "";
  addFormData.value.e_unit = "";
  addFormData.value.d_val = "";
  addFormData.value.d_unit = "";
  addFormData.value.weight_val = "";
  addFormData.value.weight_unit = "";
  addFormData.value.use_place_id = [];
  dialogTitle.value = "新增";
  addVisible.value = true;
  nextTick(() => {
    nextTick(() => {
      addFormRef.value.clearValidate(["sort"]);
    });
  });
}

function placeSelectChange(ids: string) {
  addFormData.value.use_place_id = ids.split(",").map((item) => Number(item));
}

/** 新建/编辑弹窗点击确定 */
const addConfirm = debounce(addConfirmHandle, 1000, true);

async function addConfirmHandle() {
  // console.log("addFormData", addFormData.value);
  // console.log("listId.value", listId.value);

  let { use_place_id, ...rest } = addFormData.value;
  let data = {
    use_place_id: use_place_id.join(","),
    ...rest,
  };

  const result = listId.value
    ? await electronicScaleEditApi({ id: listId.value, ...data })
    : await electronicScaleAddApi({ ...data });
  addVisible.value = false;
  ElMessage.success(result.msg);
  getData();
}

/** 点击编辑 */
function handleEdit(row: any) {
  addFormRef.value?.resetFields();
  dialogTitle.value = "编辑";
  listId.value = row.id;
  console.log("🚀 ~ handleEdit ~ listId.value :", listId.value);
  addFormData.value.name = row.name;
  addFormData.value.sort = row.sort;
  addFormData.value.inst_id = row.inst_id;
  addFormData.value.name = row.name;
  addFormData.value.productserial_no = row.productserial_no;
  addFormData.value.inst_type_no = row.inst_type_no;
  addFormData.value.max_val = row.max_val;
  addFormData.value.max_unit = row.max_unit;
  addFormData.value.e_val = row.e_val;
  addFormData.value.e_unit = row.e_unit;
  addFormData.value.d_val = row.d_val;
  addFormData.value.d_unit = row.d_unit;
  addFormData.value.weight_val = row.weight_val;
  addFormData.value.weight_unit = row.weight_unit;
  addFormData.value.use_place_id = row.use_place_id.split(",").map((item: any) => Number(item));
  console.log("🚀 ~ handleEdit ~ addFormData.value.use_place_id:", addFormData.value.use_place_id);

  addVisible.value = true;
  console.log("🚀 ~ handleEdit ~ addFormData.value:", addFormData.value);
  // nextTick(() => {
  //   addFormData.value.name = row.name;
  //   addFormData.value.version_no = row.version_no;
  //   addFormData.value.is_open = row.is_open;
  // });
}

/** 点击删除 */
function handleDel(row: any) {
  ElMessageBox.confirm(`确认要删除名称为：【${row.name}】的该条内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const result = await electronicScaleDelApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
}

onActivated(() => {
  getInstMap();
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
          <el-button type="primary" @click="handleAdd" :icon="Plus" v-hasPerm="['sc:electronicscale:add']">新建</el-button>
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
              <el-button type="primary" link @click="handleEdit(row)" v-hasPerm="['sc:electronicscale:edit']">编辑</el-button>
              <el-button type="primary" link @click="handleDel(row)" v-hasPerm="['sc:electronicscale:del']">删除</el-button>
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
        labelWidth: '100px',
        labelPosition: 'right',
        colProps: { span: 12 },
        columns: addFormColumns,
        rules: addFormRules,
      }"
      @confirm="addConfirm"
    >
      <template #plus-field-use_place_id>
        <PlaceSelect
          v-model="addFormData.use_place_id"
          :placeList="placeList"
          @change="placeSelectChange"
        ></PlaceSelect>
      </template>
    </PlusDialogForm>
  </div>
</template>
<style lang="scss" scoped></style>
