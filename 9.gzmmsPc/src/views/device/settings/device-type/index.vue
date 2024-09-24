<script setup lang="tsx">
/* 基础设置-资产类型-列表页面 */
import type { FormInstance } from "element-plus";
import { PlusForm } from "plus-pro-components";
import {
  createEquipmentListApi,
  deleteEquipmentListApi,
  getEquipmentListApi,
  updateEquipmentListApi,
} from "@/api/device/settings/device-type/index";
import type { IEquipmentItem } from "@/api/device/settings/device-type/types";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useList } from "./utils/hook";

defineOptions({
  name: "deviceSettingsDeviceType",
});

enum DialogTitleEnum {
  "新增资产类型" = 1,
  "编辑资产类型" = 2,
  "新增子资产类型" = 3,
  "编辑子资产类型" = 4,
}

const { columns, searchColumns, addColumns, addSubColumns } = useList();
// 列表搜索表单的PlusForm的绑定数据
const formData = ref({
  name: "", //关键字
});
const formRef = ref(); // 列表搜索表单的PlusForm的ref
const tableData = ref<IEquipmentItem[]>([]); // 列表的表格数据
const tableLoading = ref(false);
const rowKeysList = ref<string[]>([]); // 折叠和展开存放的表格数据id

// 新建顶级资产类型表单PlusForm的绑定数据
const addFormData = ref({
  name: "",
  rank: 0,
  status: 1,
  note: "",
  pid: 0,
});
const addPlusFormRef = ref(); //新增顶级资产类型PlusForm的ref

//新增顶级资产类型el-form的ref
const addFormRef = computed(() => {
  return addPlusFormRef.value.formInstance as FormInstance;
});

const subFormData = ref({
  pid_name: "",
  name: "",
  rank: 0,
  status: 1,
  note: "",
  pid: 0,
});
const subPlusFormRef = ref();
//新增顶级资产类型el-form的ref
const subFormRef = computed(() => {
  return subPlusFormRef.value.formInstance as FormInstance;
});

const dialogType = ref(1); //弹窗类型
const rowId = ref(0); // 记录点击编辑时的id

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

const handleSearch = () => {
  getData();
};
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getData();
};

// 请求数据
async function getData() {
  let data = {
    ...formData.value,
  };
  tableLoading.value = true;
  const result = await getEquipmentListApi(data);
  tableData.value = result.data.list;
  tableLoading.value = false;
}

/** 点击全部展开\折叠 */
const changeAllExpand = (type: number) => {
  if (type == 2) {
    rowKeysList.value = [];
  } else {
    console.log(rowKeysList.value);
    if (rowKeysList.value.length == 0) {
      tableData.value.forEach((item, index) => {
        rowKeysList.value.push(String(item.id));
        if (item._children) {
          item._children.forEach((element) => {
            rowKeysList.value.push(String(element.id));
            if (element._children) {
              element._children.forEach((el) => {
                rowKeysList.value.push(String(el.id));
              });
            }
          });
        }
      });
    }
  }
};

/** 单元格点击编辑 */
function handleEdit(row: IEquipmentItem) {
  console.log("row", row);
  // 如果_level < 1 则表示是顶级资产类型
  // dialogType.value = row._level < 1 ? 2 : 4;
  rowId.value = row.id;
  if (row._level < 1) {
    dialogType.value = 2;
    addFormData.value.name = row.name;
    addFormData.value.status = row.status;
    addFormData.value.rank = row.rank;
    addFormData.value.note = row.note;
    openTopDialog();
  } else {
    dialogType.value = 4;
    subFormData.value.name = row.name;
    subFormData.value.status = row.status;
    subFormData.value.rank = row.rank;
    subFormData.value.note = row.note;
    subFormData.value.pid = row.pid;
    openSubDialog();
  }
}

const dialogOptions = {
  btnClass: "w-[80px]",
  draggable: true,
  closeOnClickModal: false,
  btnLoading: false,
};

/** 点击新增资产类型 */
function handleAdd() {
  dialogType.value = 1;
  openTopDialog();
}

/** 打开新增/编辑顶级资产类型的弹窗 */
function openTopDialog() {
  if (dialogType.value === 1) {
    resetAddFormData();
  }
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
            // 如果是新增顶级资产类型
            let data = {
              ...addFormData.value,
            };
            try {
              const result = await createEquipmentListApi(data);
              ElMessage.success(result.msg);
              done();
              getData();
            } finally {
              updateDialog(false, "btnLoading");
            }
          } else if (dialogType.value === 2) {
            // 如果是编辑顶级资产类型
            let data = {
              id: rowId.value,
              ...addFormData.value,
            };
            try {
              const result = await updateEquipmentListApi(data);
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
    closeCallBack: ({ options, args }) => {
      if (args?.command === "cancel") {
        // 您点击了取消按钮
      } else if (args?.command === "sure") {
        // 点击了确定
      } else {
        // 点击了您点击了右上角关闭按钮或空白页或按下了esc键
      }
    },
  });
}

function resetAddFormData() {
  addFormData.value = {
    name: "",
    rank: 0,
    status: 1,
    note: "",
    pid: 0,
  };
}

/** 点击新增子资产类型 */
function handleSubAdd(row: IEquipmentItem) {
  dialogType.value = 3;
  console.log("dialog", dialogTitle.value);
  subFormData.value.pid_name = row.name;
  subFormData.value.pid = row.id;
  openSubDialog();
}

/** 打开新增/编辑子资产类型的弹窗 */
function openSubDialog() {
  addDialog({
    ...dialogOptions,
    title: dialogTitle.value,
    contentRenderer: () => (
      <>
        <PlusForm
          ref={subPlusFormRef}
          v-model={subFormData.value}
          columns={dialogType.value === 3 ? addSubColumns : addColumns}
          labelWidth={110}
          hasFooter={false}
          colProps={{ span: 16 }}
          rules={rules}
        ></PlusForm>
      </>
    ),
    beforeSure: (done, { options, index }) => {
      console.log("addFormData", addFormData.value);
      subFormRef.value.validate(async (valid, fields) => {
        if (valid) {
          updateDialog(true, "btnLoading");
          if (dialogType.value === 3) {
            // 如果是新增子资产类型
            let data = {
              ...subFormData.value,
            };
            try {
              const result = await createEquipmentListApi(data);
              ElMessage.success(result.msg);
              done();
              getData();
            } finally {
              updateDialog(false, "btnLoading");
            }
          } else if (dialogType.value === 4) {
            // 如果是编辑子资产类型
            let data = {
              id: rowId.value,
              ...subFormData.value,
            };
            try {
              const result = await updateEquipmentListApi(data);
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
    closeCallBack: ({ options, args }) => {
      if (args?.command === "cancel") {
        // 您点击了取消按钮
      } else if (args?.command === "sure") {
        // 点击了确定
      } else {
        // 点击了您点击了右上角关闭按钮或空白页或按下了esc键
      }
    },
  });
}

function handleDel(row: IEquipmentItem) {
  let id = row.id;
  ElMessageBox.confirm(`确认要删除资产类型名称为：【${row.name}】的该条内容吗?`, "警告", {
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
  const result = await deleteEquipmentListApi({ ids: [id] });
  ElMessage.success(result.msg);
  getData();
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
        :colProps="{ span: 4.8 }"
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
          <el-button type="primary" @click="handleAdd" v-hasPerm="['settings:devicetype:add']">
            <template #icon>
              <i-ep-plus></i-ep-plus>
            </template>
            新建资产类型
          </el-button>
          <el-button type="primary" @click="changeAllExpand(1)">全部展开</el-button>
          <el-button type="primary" @click="changeAllExpand(2)">全部折叠</el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            :data="tableData"
            :columns="dynamicColumns"
            :size="size"
            adaptive
            :adaptiveConfig="{ offsetBottom: 120 }"
            header-cell-class-name="table-gray-header"
            row-key="id"
            :default-expand-all="false"
            :tree-props="{ children: '_children', hasChildren: 'hasChildren' }"
            :expand-row-keys="rowKeysList"
            :loading="tableLoading"
          >
            <template #operation="{ row }">
              <template v-if="row._level < 3">
                <el-button type="primary" link @click="handleSubAdd(row)" v-hasPerm="['settings:devicetype:add']">
                  新增子类型
                </el-button>
              </template>
              <el-button type="primary" link @click="handleEdit(row)" v-hasPerm="['settings:devicetype:edit']">编辑</el-button>
              <el-button link @click="handleDel(row)" v-hasPerm="['settings:devicetype:del']">删除</el-button>
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
</style>
