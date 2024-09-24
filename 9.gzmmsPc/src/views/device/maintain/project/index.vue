<script setup lang="tsx">
/* 维保管理-保养项目-列表页面 */
import type { FormInstance, TableColumnCtx } from "element-plus";
import { PlusForm } from "plus-pro-components";
import {
  getMaintainProjectAddApi,
  getMaintainProjectApi,
  getMaintainProjectDelApi,
  getMaintainProjectEditApi,
} from "@/api/device/maintain/project/index";
import type { MaintainProjectItem } from "@/api/device/maintain/project/types";
import TreeSelect from "@/components/DeptSelect/TreeSelect.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { flitterData } from "@/utils";
import AddVue from "./components/add.vue";
import { useList } from "./utils/hook";

defineOptions({
  name: "deviceMaintainProject",
});

const { columns, searchColumns, pagination, editColumns, addRules, getTypeList, typeList } =
  useList();
const formData = ref({
  keyword: "",
});
const formRef = ref();
const tableData = ref<MaintainProjectItem[]>([]);
const tableLoading = ref(false);
const prueTableRef = ref();

// 新建组件的ref
const addRef = ref<InstanceType<typeof AddVue>>();
const delId = ref<number[]>([]); //删除id数组

// 编辑弹窗的数据
const editFormData = ref({
  id: 0,
  name: "",
  equipment_id: 0,
  equipment_title: "",
  maintenance_requirements: "",
  maintenance_area: "",
  note: "",
});
const editPlusFormRef = ref();
const editFormRef = computed(() => {
  return editPlusFormRef.value.formInstance as FormInstance;
});

const handleSearch = () => {
  getData();
};
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getData();
};

const dialogOptions = {
  width: "60%",
  btnClass: "w-[80px]",
  draggable: true,
  closeOnClickModal: false,
  closeOnPressEscape: false,
  btnLoading: false,
  showClose: false,
};

// 点击新增
const handleAdd = () => {
  addDialog({
    ...dialogOptions,
    title: "新增保养项目",
    contentRenderer: () =>
      h(AddVue, {
        ref: addRef,
        list: typeList.value,
      }),
    beforeCancel: (done, { options, index }) => {
      console.log("点击了取消按钮");
      done();
    },
    beforeSure: async (done, { options, index }) => {
      // console.log("点击了addRef.formData", addRef.value?.formData);
      const validateRes = await addRef.value?.validateForm();
      if (validateRes) {
        updateDialog(true, "btnLoading");
        let data = {
          ...addRef.value?.formData,
        };
        try {
          const result = await getMaintainProjectAddApi(data);
          ElMessage.success(result.msg);
          done();
          getData();
        } finally {
          updateDialog(false, "btnLoading");
        }
      }
      // done();
    },
  });
};

// 点击编辑
const handleEdit = (row: MaintainProjectItem) => {
  let {
    id,
    name,
    equipment_id,
    equipment_title,
    maintenance_requirements,
    maintenance_area,
    note,
  } = row;
  editFormData.value = {
    id,
    name,
    equipment_id,
    equipment_title,
    maintenance_requirements,
    maintenance_area,
    note,
  };
  addDialog({
    ...dialogOptions,
    title: "编辑保养项目",
    contentRenderer: () => (
      <>
        <PlusForm
          ref={editPlusFormRef}
          v-model={editFormData.value}
          columns={editColumns}
          labelWidth={120}
          labelPosition="right"
          hasFooter={false}
          rowProps={{ gutter: 20 }}
          colProps={{ span: 12 }}
          rules={addRules}
          v-slots={{
            "plus-field-equipment_id": () => (
              <>
                <TreeSelect
                  list={typeList.value}
                  v-model={editFormData.value.equipment_id}
                  onNodeChange={handleNodeChange}
                ></TreeSelect>
              </>
            ),
          }}
        ></PlusForm>
      </>
    ),

    beforeCancel: (done, { options, index }) => {
      console.log("点击了取消按钮");
      done();
    },
    beforeSure: async (done, { options, index }) => {
      // console.log("点击了addRef.formData", addRef.value?.formData);
      const validateRes = await editFormRef.value.validate(async (valid, fields) => {
        if (valid) {
          console.log("submit!");
          return true;
        } else {
          return false;
        }
      });
      if (validateRes) {
        updateDialog(true, "btnLoading");
        let data = {
          ...editFormData.value,
        };
        try {
          const result = await getMaintainProjectEditApi(data);
          ElMessage.success(result.msg);
          done();
          getData();
        } finally {
          updateDialog(false, "btnLoading");
        }
      }
      // done();
    },
  });
};

function handleNodeChange(val: string) {
  editFormData.value.equipment_title = val;
}

// 点击删除
const handleDel = (row: MaintainProjectItem) => {
  delId.value = [row.id];
  ElMessageBox.confirm(
    `确认要删除：【${row.name}-${row.maintenance_area}-${row.maintenance_requirements}】的该条内容吗?`,
    "警告",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  )
    .then(async () => {
      console.log("点击了 确定删除");
      const result = await getMaintainProjectDelApi({ ids: delId.value });
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
    keyword: formData.value.keyword,
  };
  tableLoading.value = true;
  const result = await getMaintainProjectApi(data);
  tableData.value = result.data.list;
  pagination.total = result.data.total;
  tableLoading.value = false;
}

// 列合并
interface SpanMethodProps {
  row: MaintainProjectItem;
  column: TableColumnCtx<MaintainProjectItem>;
  rowIndex: number;
  columnIndex: number;
}
const objectSpanMethod = ({ rowIndex, columnIndex }: SpanMethodProps) => {
  if ([0, 1].includes(columnIndex)) {
    const _row = flitterData(tableData.value, "name").one[rowIndex];
    const _col = _row > 0 ? 1 : 0;
    return {
      rowspan: _row,
      colspan: _col,
    };
  } else {
    return {
      rowspan: 1,
      colspan: 1,
    };
  }
};
const currentName = ref();

function cellMouseEnter(row: any, column: any, cell: HTMLTableCellElement, event: Event) {
  currentName.value = row.name;
}
function cellMouseLeave(row: any, column: any, cell: HTMLTableCellElement, event: Event) {
  currentName.value = "";
}

function tableRowClassName({ row, rowIndex }: { row: any; rowIndex: number }) {
  return row.name === currentName.value ? "current-hover-row" : "";
}

onActivated(() => {
  getData();
  getTypeList();
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
        :rowProps="{ gutter: 20 }"
        :colProps="{ span: 6 }"
        ref="formRef"
      >
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
          <el-button type="primary" @click="handleAdd" v-hasPerm="['maintain:project:add']">
            <template #icon>
              <i-ep-plus></i-ep-plus>
            </template>
            新增
          </el-button>
          <!-- <el-button type="primary" @click="">删除</el-button> -->
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
            @page-size-change="getData()"
            @page-current-change="getData()"
            :span-method="objectSpanMethod"
            :loading="tableLoading"
            @cell-mouse-enter="cellMouseEnter"
            @cell-mouse-leave="cellMouseLeave"
            :row-class-name="tableRowClassName"
          >
            <template #operation="scope">
              <el-button type="primary" link @click="handleEdit(scope.row)" v-hasPerm="['maintain:project:edit']">编辑</el-button>
              <el-button type="info" link @click="handleDel(scope.row)" v-hasPerm="['maintain:project:del']">删除</el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-form-item__content) {
  flex: 1 !important;
  .flex {
    margin-left: 20px;
  }
}
// :deep(
//     .el-table__body tr.hover-row.current-row > td.el-table__cell,
//     .el-table__body tr.hover-row.el-table__row--striped.current-row > td.el-table__cell,
//     .el-table__body tr.hover-row.el-table__row--striped > td.el-table__cell,
//     .el-table__body tr.hover-row > td.el-table__cell
//   ) {

// }
</style>
<style>
.current-hover-row {
  background-color: var(--el-table-row-hover-bg-color) !important;
}
</style>
