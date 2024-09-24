<script setup lang="ts">
/* 点巡检管理-点巡检项目-列表页面 */
import type { FormInstance } from "element-plus";
import { useRouter } from "vue-router";
import {
  getInspectionProjectDelApi,
  getInspectionProjectListApi,
} from "@/api/device/inspection/project/index";
import type { InspectionProjectItem } from "@/api/device/inspection/project/types";
import TreeSelect from "@/components/DeptSelect/TreeSelect.vue";
import { useBaseData } from "@/hooks/device/baseData";
import ProjectDetail from "./components/projectDetail.vue";
import { useList } from "./utils/hook";

defineOptions({
  name: "deviceInspectionProject",
});

const router = useRouter();

const { getTypeList, treeData } = useBaseData();

const { columns, searchColumns, pagination } = useList();
const formData = ref({
  keyword: "",
  equipment_type_id: undefined as FormNumType,
});
const formRef = ref();
const tableData = ref<InspectionProjectItem[]>([]);
const prueTableRef = ref();

const detailVisible = ref(false);
const listId = ref(0);

const handleSearch = () => {
  getData();
};
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getData();
};

async function getData() {
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    ...formData.value
  };
  const result = await getInspectionProjectListApi(data);
  tableData.value = result.data.list;
  pagination.total = result.data.total;
}

/** 点击新建 */
function handleAdd() {
  router.push({
    path: "/device/inspection/project/add",
  });
}

function cellDetail(row: InspectionProjectItem) {
  listId.value = row.id;
  detailVisible.value = true;
}

function cellEdit(row: InspectionProjectItem) {
  router.push({
    path: "/device/inspection/project/add",
    query: {
      id: row.id,
    },
  });
}

function cellDel(row: InspectionProjectItem) {
  ElMessageBox.confirm(
    `确认要删除检查项目名为：【${row.inspect_items_name}】的该条内容吗?`,
    "警告",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  )
    .then(async () => {
      const result = await getInspectionProjectDelApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
}

onActivated(() => {
  getTypeList();
  getData();
  prueTableRef.value?.setAdaptive();
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        :showNumber="6"
        :colProps="{ span: 4 }"
        ref="formRef"
      >
        <template #plus-field-equipment_type_id>
          <TreeSelect :list="treeData" v-model="formData.equipment_type_id"></TreeSelect>
        </template>
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
          <el-button type="primary" @click="handleAdd" v-hasPerm="['inspection:project:add']">
            <template #icon>
              <i-ep-plus></i-ep-plus>
            </template>
            新建
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
          >
            <template #operation="{ row }">
              <el-button type="primary" link @click="cellDetail(row)" v-hasPerm="['inspection:project:detail']">详情</el-button>
              <el-button type="primary" link @click="cellEdit(row)" v-hasPerm="['inspection:project:edit']">编辑</el-button>
              <el-button type="info" link @click="cellDel(row)" v-hasPerm="['inspection:project:del']">删除</el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
    <ProjectDetail :listId="listId" v-model="detailVisible"></ProjectDetail>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-form-item__content) {
  flex: 1 !important;
  .flex {
    margin-left: 20px;
  }
}
:deep(.el-drawer__body) {
  padding-top: 0;
}
</style>
