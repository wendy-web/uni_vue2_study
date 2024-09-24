<script setup lang="tsx">
/* 基础设置-故障原因-列表页面 */
import type { FormInstance } from "element-plus";
import { PlusForm } from "plus-pro-components";
import {
  createRepairReasonApi,
  deleteRepairReasonApi,
  getRepairReasonListApi,
  updateRepairReasonApi,
} from "@/api/device/settings/cause";
import type { CauseItem } from "@/api/device/settings/cause/types";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useList } from "./utils/hook";

defineOptions({
  name: "deviceSettingsCause",
});

enum DialogTitleEnum {
  "新增故障原因" = 1,
  "编辑故障原因" = 2,
}

const { columns, addColumns } = useList();

const tableData = ref<CauseItem[]>([]);
const tableLoading = ref(false);
const addFormData = ref({
  name: "",
  note: "",
});
// 记录点击编辑时的id
const rowId = ref(0);
// 新增故障原因PlusForm的ref
const addPlusFormRef = ref();
// 新增故障原因el-form的ref
const addFormRef = computed(() => {
  return addPlusFormRef.value.formInstance as FormInstance;
});
// 弹窗类型
const dialogType = ref(1);
// 弹窗标题
const dialogTitle = computed(() => {
  return DialogTitleEnum[dialogType.value];
});

const rules = {
  name: [
    {
      required: true,
      message: "请输入名称",
    },
  ],
};

/** 请求数据 */
async function getData() {
  tableLoading.value = true
  const result = await getRepairReasonListApi();
  tableData.value = result.data.list;
  tableLoading.value = false;
}

const dialogOptions = {
  btnClass: "w-[80px]",
  draggable: true,
  closeOnClickModal: false,
  btnLoading: false,
};

/** 单元格点击新增 */
function handleAdd() {
  resetAddFromData();
  dialogType.value = 1;
  openDialog();
}

function resetAddFromData() {
  addFormData.value = {
    name: "",
    note: "",
  };
}

/** 单元格点击编辑 */
function handleEdit(row: CauseItem) {
  dialogType.value = 2;
  rowId.value = row.id;
  addFormData.value.name = row.name;
  addFormData.value.note = row.note;

  openDialog();
}

/** 单元格点击删除 */
function handleDel(row: CauseItem) {
  let id = row.id;
  ElMessageBox.confirm(`确认要删除故障原因为:【${row.name}】的该条内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      console.log("点击了 确定删除");
      sendDel(id);
    })
    .catch((error) => {
      console.log(error);
    });
}

async function sendDel(id: number) {
  const result = await deleteRepairReasonApi({ id });
  ElMessage.success(result.msg);
  getData();
}

function openDialog() {
  addDialog({
    ...dialogOptions,
    title: dialogTitle.value,
    contentRenderer: () => (
      <>
        <PlusForm
          ref={addPlusFormRef}
          v-model={addFormData.value}
          columns={addColumns}
          labelWidth={110}
          hasFooter={false}
          colProps={{ span: 16 }}
          rules={rules}
        ></PlusForm>
      </>
    ),
    beforeSure: (done, { options, index }) => {
      console.log("addFormData", addFormData.value);
      addFormRef.value.validate(async (valid, fields) => {
        if (valid) {
          updateDialog(true, "btnLoading");
          if (dialogType.value === 1) {
            // 如果是新增故障原因
            let data = {
              ...addFormData.value,
            };
            try {
              const result = await createRepairReasonApi(data);
              ElMessage.success(result.msg);
              done();
              getData();
            } finally {
              updateDialog(false, "btnLoading");
            }
          } else if (dialogType.value === 2) {
            // 如果是编辑故障原因
            let data = {
              id: rowId.value,
              ...addFormData.value,
            };
            try {
              const result = await updateRepairReasonApi(data);
              ElMessage.success(result.msg);
              done();
              getData();
            } finally {
              updateDialog(false, "btnLoading");
            }
          }
        } else {
        }
      });
    },
  });
}

onActivated(() => {
  getData();
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <div class="mb-4">
        <el-button type="primary" @click="handleAdd" v-hasPerm="['settings:cause:add']">
          <template #icon>
            <i-ep-plus></i-ep-plus>
          </template>
          新增故障原因
        </el-button>
      </div>
      <pure-table
        :data="tableData"
        :columns="columns"
        adaptive
        :adaptiveConfig="{ offsetBottom: 120 }"
        header-cell-class-name="table-gray-header"
        style="width: 70%"
        border
        :loading="tableLoading"
      >
        <template #operation="{ row }">
          <el-button type="primary" link @click="handleEdit(row)" v-hasPerm="['settings:cause:edit']">编辑</el-button>
          <el-button type="primary" link @click="handleDel(row)" v-hasPerm="['settings:cause:del']">删除</el-button>
        </template>
      </pure-table>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
