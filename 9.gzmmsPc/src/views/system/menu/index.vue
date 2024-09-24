<script setup lang="ts">
// 引入api
// 引入表单类型
import type { FormInstance, FormRules } from "element-plus";
import {
  addMenuApi,
  delMenuApi,
  editMenuApi,
  menuDownListApi,
  menuListApi,
} from "@/api/system/menu";
// 引入数据类型
import { IMenuList } from "@/api/system/types";
// 引入选择图标自定义组件
import IconSelect from "@/components/IconSelect/index.vue";
import { useList } from "./columns";

defineOptions({
  name: "setMenu",
});
const { columns, tabMap, tabIndex } = useList();
enum ITitle {
  "新增菜单" = 1,
  "编辑菜单",
  "新增子菜单",
}

const state = reactive({
  tableData: [] as IMenuList[], //表格数据
  dialogVisible: false, //弹窗状态
  formData: {
    auth_title: "", //菜单名称
    pid: 0, // 父级菜单id
    hide: 0, //为1则不显示 为0则显示
    rank: 0, //排序
    icon: "homepage", //图标
    module: "", //
    controller: "", //
    action: "", //
    page_path: "", //路径
    module_types: [] as number[],
    // id: "", //菜单id
  },
  rowKeysList: [] as any[],
  pullDownList: [] as any[],
  dialogBtnloading: false, //弹窗按钮的加载状态
  dialogType: 1, //1表示添加, 2表示 编辑,3表示添加子菜单
  editId: 0,
  editRank: 0,
  loadingDialog: true,
  rules: {
    auth_title: [
      {
        required: true,
        message: "请输入菜单名称",
        trigger: "blur",
      },
    ],
    pid: [
      {
        required: true,
        message: "请选择上级菜单",
        trigger: "blur",
      },
    ],
    hide: [
      {
        required: true,
      },
    ],
    rank: [
      {
        required: true,
      },
    ],
    icon: [
      {
        required: true,
        message: "请选择图标",
        trigger: "blur",
      },
    ],
    module_types: [
      {
        required: true,
        message: "请选择系统模块",
        trigger: ["change"],
      },
    ],
  },
});

const {
  tableData,
  dialogVisible,
  formData,
  rowKeysList,
  pullDownList,
  dialogBtnloading,
  dialogType,
  editId,
  editRank,
  loadingDialog,
  rules,
} = toRefs(state);

const refInput = ref();
const formRef = ref<FormInstance>();

// 点击tab
async function tabClick({ index, props }: any) {
  let { label, name } = props;
  console.log("🚀 ~ tabClick ~ name:", name);
  tabIndex.value = name;
  getData();
}

// 获取菜单数据
async function getData() {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "正在加载",
    background: "rgba(0, 0, 0, 0.1)",
  });
  try {
    const result = await menuListApi({ module_type_id: tabIndex.value });
    loadingInstance.close();
    console.log(result);
    tableData.value = result.data;
  } catch (error) {
    loadingInstance.close();
  }
}

// 点击新增菜单按钮
const handleDialog = async () => {
  dialogVisible.value = true;
  dialogType.value = 1;
  nextTick(() => {
    formRef.value?.resetFields();
    formData.value.auth_title = "";
    formData.value.pid = 0;
    formData.value.hide = 0;
    formData.value.rank = 0;
    formData.value.icon = "homepage";
    formData.value.module = "";
    formData.value.controller = "";
    formData.value.action = "";
    formData.value.page_path = "";
    // formData.value.module_types = [];
    formData.value.module_types = [tabIndex.value];
  });

  await getAddRoleList();
};

// 点击新增子菜单
const handleAddSub = async (index: number, row: any) => {
  console.log(row);
  dialogVisible.value = true;
  dialogType.value = 3;
  formData.value.icon = row.icon;
  formData.value.pid = row.id;
  formData.value.hide = row._level == 0 ? 0 : 1;
  // formData.value.module_types = row.module_types.split(",").map((item: string) => Number(item));
  formData.value.module_types = [tabIndex.value];
  await getAddRoleList();
};
//弹窗点击确定
const handleConfirm = () => {
  console.log(formData.value);

  formRef.value!.validate((valid) => {
    if (valid) {
      console.log("submit!");
      // 控制按钮的加载状态
      dialogBtnloading.value = true;
      if (dialogType.value === 1 || dialogType.value === 3) {
        sendData();
      } else {
        sendEditData();
      }
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

// 单元格点击编辑按钮
const handleEdit = async (index: number, row: any) => {
  dialogVisible.value = true;
  console.log(row);
  dialogType.value = 2;
  let { auth_title, pid, hide, rank, icon, module, controller, action, page_path, module_types } =
    row;
  formData.value.pid = pid;
  formData.value.auth_title = auth_title;
  formData.value.hide = hide;
  formData.value.rank = rank;
  formData.value.icon = icon;
  formData.value.module = module;
  formData.value.controller = controller;
  formData.value.action = action;
  formData.value.page_path = page_path;
  formData.value.module_types = module_types.split(",").map((item: string) => Number(item));
  console.log(" formData.value.module_types", formData.value.module_types);
  editId.value = row.id;
  await getAddRoleList();
};
// 表格点击编辑按钮,发送需要编辑的菜单数据
const sendEditData = async () => {
  let data = {
    id: editId.value,
    ...formData.value,
  };
  try {
    const result = await editMenuApi(data);
    if (result.code === "-2") {
      return false;
    }
    console.log(result);
    if (result.code == 1) {
      dialogVisible.value = false;
      ElMessage({
        message: result.msg,
        type: "success",
      });
      getData();
    }
  } catch (error) {
  } finally {
    dialogBtnloading.value = false;
  }
};

// 点击删除菜单
const handleDelete = (index: number, row: any) => {
  let id = row.id;
  if (row._children.length > 0) {
    ElMessage({
      message: "请您先删除该菜单的子菜单",
      type: "warning",
    });
    return;
  }

  ElMessageBox.confirm("您确定要删除该菜单吗", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      sendDelData(id);
    })
    .catch((error) => {
      console.log(error);
    });
};

// 点击全部展开\折叠
const changeAllExpand = (type: number | string) => {
  if (type == 2) {
    rowKeysList.value = [];
  } else {
    console.log(rowKeysList.value);
    if (rowKeysList.value.length == 0) {
      tableData.value.forEach((item, index) => {
        console.log(item.id);

        rowKeysList.value.push(String(item.id));
        if (item._children) {
          item._children.forEach((element) => {
            rowKeysList.value.push(String(element.id));
          });
        }
      });
    }
  }
};

const getAddRoleList = () => {
  loadingDialog.value = true;
  return new Promise((resolve, reject) => {
    menuDownListApi()
      .then((result) => {
        if (result.code === "-2") {
          dialogVisible.value = false;
          return false;
        }
        console.log("下拉数据", result.data);
        pullDownList.value = result.data;
        loadingDialog.value = false;
        resolve(result.data);
      })
      .catch((error) => {
        reject(error);
        loadingDialog.value = false;
      });
  });
};

// 弹窗点击确定 发送数据
const sendData = async () => {
  let data = formData.value;
  try {
    const result = await addMenuApi(data);
    if (result.code === "-2") {
      return false;
    }
    console.log(result);
    if (result.code == 1) {
      dialogVisible.value = false;
      ElMessage({
        message: result.msg,
        type: "success",
      });
      getData();
    }
  } catch (error) {
  } finally {
    dialogBtnloading.value = false;
  }
};

// 表格点击删除按钮,发送需要删除的菜单id
const sendDelData = async (id: any) => {
  const result = await delMenuApi({ id });
  if (result.code === "-2") {
    return false;
  }
  ElMessage({
    message: result.msg,
    type: "success",
  });
  getData();
};

const handleRankBlur = async (event: Event, row: any) => {
  const value = Number(editRank.value);
  row.rankStatus = false;
  if (row.rank == value) return;
  row.rank = editRank.value || 0;
  const data = {
    id: row.id,
    rank: value,
  };
  try {
    const result = await editMenuApi(data);
    if (result.code === "-2") {
      return false;
    }
    ElMessage.success(result.msg);
  } catch (error) {}
};

// 单元格点击排序单元格
const changeRowRankInput = (row: any) => {
  // console.log(row);
  // row.rankStatus = true;
  // nextTick(() => {
  //   refInput.value.focus();
  // });
  // editRank.value = row.rank;
};

// 点击切换是否显示按钮
async function handleSwitchChange(row: { [key: string]: any }) {
  console.log(row);
  let id = row.id;
  const data = {
    id,
    hide: row.hide,
  };
  try {
    const result = await editMenuApi(data);
    if (result.code === "-2") {
      row.hide = row.hide == 1 ? 0 : 1;
      return false;
    }
    ElMessage.success(result.msg);
  } catch (error) {
    row.hide = row.hide == 1 ? 0 : 1;
  }
}
// 弹窗关闭触发
const closeDialogBefore = () => {
  formRef.value?.resetFields();
  formRef.value?.clearValidate();
};

const dialogTitle = computed(() => {
  return ITitle[dialogType.value];
});
onActivated(() => {
  console.log("keepAlive 初始化");
  getData();
});
onDeactivated(() => {
  console.log("keepAlive 销毁");
});

onMounted(() => {});
</script>

<template>
  <div class="app-container">
    <el-tabs @tab-click="tabClick" v-model="tabIndex">
      <template v-for="(item, index) of tabMap" :key="item.id">
        <el-tab-pane :label="item.name" :name="item.type">
          <template #label>
            <span>
              {{ item.name }}
            </span>
          </template>
        </el-tab-pane>
      </template>
    </el-tabs>
    <div class="search-card">
      <div class="mb-[14px]">
        <el-button type="success" @click="handleDialog">
          <template #icon>
            <i-ep-Plus></i-ep-Plus>
          </template>
          新增菜单
        </el-button>
        <el-button type="primary" @click="changeAllExpand(1)">全部展开</el-button>
        <el-button type="primary" @click="changeAllExpand(2)">全部折叠</el-button>
      </div>
    </div>
    <div class="app-card">
      <pure-table
        :columns="columns"
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
        :default-expand-all="false"
        :tree-props="{ children: '_children', hasChildren: 'hasChildren' }"
        :expand-row-keys="rowKeysList"
        max-height="1000"
      >
        <template #switch="scope">
          <el-switch
            v-model="scope.row.hide"
            inline-prompt
            active-text="是"
            inactive-text="否"
            :active-value="0"
            :inactive-value="1"
            @change="handleSwitchChange(scope.row)"
            v-if="!scope.row.module"
          />
        </template>
        <template #rank="scope">
          <div
            style="width: 100%; height: 100%"
            v-if="!scope.row.rankStatus"
            @click="changeRowRankInput(scope.row)"
          >
            <span>{{ scope.row.rank }}</span>
          </div>
          <div v-else style="width: 100%; height: 100%">
            <el-input
              ref="refInput"
              type="number"
              v-model="editRank"
              :min="0"
              @blur="handleRankBlur($event, scope.row)"
            ></el-input>
          </div>
        </template>
        <template #operation="scope">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="scope.row.auth_title + '新增子菜单'"
            placement="top-start"
            v-if="!scope.row.module"
          >
            <el-button type="primary" circle @click="handleAddSub(scope.$index, scope.row)">
              <template #icon>
                <i-ep-Plus></i-ep-Plus>
              </template>
            </el-button>
          </el-tooltip>

          <el-tooltip class="box-item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" plain circle @click="handleEdit(scope.$index, scope.row)">
              <template #icon>
                <i-ep-Edit></i-ep-Edit>
              </template>
            </el-button>
          </el-tooltip>

          <el-tooltip class="box-item" effect="dark" content="删除" placement="top-start">
            <el-button type="danger" plain circle @click="handleDelete(scope.$index, scope.row)">
              <template #icon>
                <i-ep-Delete></i-ep-Delete>
              </template>
            </el-button>
          </el-tooltip>
        </template>
      </pure-table>
    </div>
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeDialogBefore"
      draggable
    >
      <el-form
        :model="formData"
        ref="formRef"
        :rules="rules"
        label-width="100"
        v-loading="loadingDialog"
      >
        <el-form-item label="上级菜单" prop="pid">
          <el-tree-select
            v-model="formData.pid"
            placeholder="选择上级菜单"
            :data="pullDownList"
            value-key="id"
            node-key="id"
            filterable
            check-strictly
            :render-after-expand="false"
            :props="{ label: 'auth_title', children: '_children' }"
            style="width: 60%"
          />
        </el-form-item>
        <el-form-item label="菜单名称" prop="auth_title">
          <el-input v-model="formData.auth_title" placeholder="请输入菜单名称" style="width: 60%" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <icon-select v-model="formData.icon" style="width: 60%" />
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-row :gutter="10" style="width: 60%">
            <el-col :span="5">
              <el-form-item prop="module">
                <el-input v-model="formData.module" placeholder="module" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item prop="controller">
                <el-input v-model="formData.controller" placeholder="controller" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="action">
                <el-input v-model="formData.action" placeholder="action" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="页面路径" prop="page_path">
          <el-input v-model="formData.page_path" placeholder="请输入页面路径" style="width: 60%" />
        </el-form-item>
        <el-form-item
          label="选择系统模块"
          prop="module_types"
          label-width="120px"
          :validate-on-rule-change="false"
        >
          <el-checkbox-group v-model="formData.module_types">
            <el-checkbox :label="0">物料管理系统</el-checkbox>
            <el-checkbox :label="1">设备管理系统</el-checkbox>
            <el-checkbox :label="2">安全管理系统</el-checkbox>
            <el-checkbox :label="3">质量管理系统</el-checkbox>
            <el-checkbox :label="4">生产管理系统</el-checkbox>
            <el-checkbox :label="5">能源管理系统</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="是否显示" prop="hide">
          <el-radio-group v-model="formData.hide">
            <el-radio :label="0">显示</el-radio>
            <el-radio :label="1">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="rank">
          <el-input-number v-model="formData.rank" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item>
          <span style="color: #94a3b8">提示：越大越靠前,不写路径是按钮</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer flex items-center justify-center">
          <el-button
            type="primary"
            @click="handleConfirm"
            :loading="dialogBtnloading"
            class="w-[110px]"
            size="large"
          >
            确定
          </el-button>
          <el-button @click="dialogVisible = false" class="w-[110px] ml-6" size="large">
            取消
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
