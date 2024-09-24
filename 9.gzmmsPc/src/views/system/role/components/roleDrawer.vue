<script setup lang="ts">
// 引入api
import type { FormInstance } from "element-plus";
import { addRoleApi, editRoleApi, getEditDropApi, getRoleDropApi } from "@/api/system/role";
import { IroleList } from "@/api/system/types";

// interface Props {
//   drawerType: number;
// }

// const props = withDefaults(defineProps<Props>(), {
//   drawerType: 1,
// });

const emits = defineEmits(["refresh"]);

const model = defineModel({ required: true, default: false });
// 弹窗表单数据
const formData = ref({
  role_title: "",
  data_per: 0,
  status: 1,
  remark: "",
});

const formRef = ref<FormInstance | null>(null);
const treeRef = ref<InstanceType<typeof ElTree>>();

const drawerType = ref(1); // 1为新建,2为编辑
const editId = ref(0); //所的编辑角色id
const treeData = ref<IroleList[]>([]);
const loadingDrawer = ref(false);
const btnLoading = ref(false);

const drawerTitle = computed(() => {
  switch (drawerType.value) {
    case 1:
      return "新建角色";
    case 2:
      return "编辑角色";
    default:
      break;
  }
});

// 新增获取下拉树形数据
const getRoleDrop = async () => {
  drawerType.value = 1;
  editId.value = 0;
  loadingDrawer.value = true;
  const result = await getRoleDropApi();
  if (result.code === "-2") {
    model.value = false;
    return;
  }
  loadingDrawer.value = false;
  treeData.value = result.data;
  console.log("🚀 ~ getRoleDrop ~ treeData.value:", treeData.value);
};

// 获取编辑角色下拉列表数据
const getEditRoleDrop = async (row: IroleList) => {
  drawerType.value = 2;
  editId.value = row.id;
  loadingDrawer.value = true;
  const result = await getEditDropApi({ id: editId.value });
  if (result.code === "-2") {
    model.value = false;
    return false;
  }
  console.log(result.data);
  loadingDrawer.value = false;
  treeData.value = result.data.ids;

  nextTick(() => {
    formData.value.role_title = row.role_title;
    formData.value.remark = row.remark;
    formData.value.status = row.status;
    formData.value.data_per = row.data_per;
    let ids = row.ids;
    let checkedMenuIds = ids && ids.split(",").map(Number);
    if (checkedMenuIds && checkedMenuIds.length > 0) {
      checkedMenuIds.forEach((treeId: any) => treeRef.value!.setChecked(treeId, true, false));
    }
  });
};

function clickSubmit() {
  formRef.value!.validate((valid) => {
    if (valid) {
      console.log("submit!");
      // 弹窗点击确定按钮
      const checkedMenuIds: number[] = treeRef
        .value!.getCheckedNodes(false, true)
        .map((node: any) => node.id);
      console.log(checkedMenuIds);
      // drawerType为1 是新建
      if (drawerType.value == 1) {
        sendData(checkedMenuIds);
      } else {
        sendEditData(checkedMenuIds);
      }
    } else {
      console.log("error submit!");
      return false;
    }
  });
}

// 新增弹窗点击确定按钮发送数据
const sendData = async (checkedMenuIds: number[]) => {
  btnLoading.value = true;
  let data = {
    ...formData.value,
    ids: checkedMenuIds,
  };
  try {
    const result = await addRoleApi(data);
    if (result.code === "-2") {
      return;
    }
    model.value = false;
    ElMessage({
      type: "success",
      message: result.msg,
    });
    emits("refresh");
  } finally {
    btnLoading.value = false;
  }
};

// 编辑弹窗点击确定发送数据
const sendEditData = async (checkedMenuIds: number[]) => {
  btnLoading.value = true;
  let data = {
    role_title: formData.value.role_title,
    remark: formData.value.remark,
    data_per: formData.value.data_per,
    status: formData.value.status,
    ids: checkedMenuIds,
    id: editId.value,
  };
  try {
    const result = await editRoleApi(data);
    model.value = false;
    ElMessage({
      type: "success",
      message: result.msg,
    });
    emits("refresh");
  } finally {
    btnLoading.value = false;
  }
};

function clickColse() {
  model.value = false;
}

//弹窗关闭的回调
function closeDialog() {
  treeData.value = [];
  formRef.value?.resetFields();
  treeRef.value?.setCheckedKeys([], false);
  editId.value = 0;
}

defineExpose({
  getRoleDrop,
  getEditRoleDrop,
});
</script>
<template>
  <div class="role-drawer">
    <el-drawer :title="drawerTitle" v-model="model" direction="rtl" size="70%" @close="closeDialog">
      <el-form :model="formData" label-width="80" ref="formRef" v-loading="loadingDrawer">
        <div class="flex flex-col form-content">
          <el-form-item
            label="角色名称"
            prop="role_title"
            :rules="[
              {
                required: true,
                message: '请输入角色名称',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-model.trim="formData.role_title"
              placeholder="请输入角色名"
              style="width: 60%"
            />
          </el-form-item>
          <el-form-item label="选择权限" class="flex-1 overflow-hidden">
            <el-scrollbar class="w-[60%]">
              <el-tree
                ref="treeRef"
                node-key="id"
                show-checkbox
                :data="treeData"
                default-expand-all
                :props="{ children: '_children' }"
                highlight-current
              >
                <template #default="{ data }">
                  {{ data.auth_title }}
                </template>
              </el-tree>
            </el-scrollbar>
          </el-form-item>
          <el-form-item label="数据权限" prop="data_per" class="flex items-center">
            <el-radio-group v-model="formData.data_per">
              <el-radio :label="0" size="large">个人</el-radio>
              <el-radio :label="1" size="large">全部</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态" class="flex items-center" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio :label="1" size="large">启用</el-radio>
              <el-radio :label="0" size="large">停用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="角色备注" prop="remark">
            <el-input v-model="formData.remark" placeholder="请输入备注信息" style="width: 60%" />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <div class="flex items-start">
          <el-button
            size="large"
            type="primary"
            class="w-[100px] mr-4"
            @click="clickSubmit"
            :loading="btnLoading"
          >
            确认选择
          </el-button>
          <el-button type="primary" plain size="large" class="w-[100px]" @click="clickColse">
            取消
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<style lang="scss" scoped>
.form-content {
  height: calc(100vh - 200px);
}
</style>
