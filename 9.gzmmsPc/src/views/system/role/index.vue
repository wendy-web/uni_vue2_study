<template>
  <div class="app-container">
    <div class="app-card">
      <el-button type="success" @click="handleAddRole" class="mb-[.5333rem]">
        <template #icon>
          <i-ep-plus></i-ep-plus>
        </template>
        新建角色
      </el-button>
      <el-table :data="tableData" border stripe height="calc(100vh - 260px)">
        <el-table-column label="ID" prop="id" width="60" align="center" />
        <el-table-column label="角色名称" prop="role_title" width="200" align="center" />
        <el-table-column label="授权信息" align="center">
          <template #default="scope">
            <div>
              <div>
                <span>成员数：</span>
                <span class="text-blue-400">{{ scope.row.sum }}</span>
                <span>位，</span>
                <span>权限数：</span>
                <template v-if="scope.row.id != 0">
                  <span class="text-blue-400">{{ scope.row.ids_num }}</span>
                  <span>项</span>
                </template>
                <span v-else>{{ scope.row.ids_num }}</span>
              </div>
              <div class="text-gray-400">
                <span>{{ scope.row.remark }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="启用" width="100" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              inline-prompt
              active-text="是"
              inactive-text="否"
              :active-value="1"
              :inactive-value="0"
              @change="handleSwitchChange(scope.row)"
              v-if="!checkIsManager(scope.row.id)"
            />
            <span v-else style="color: #94a3b8">不可操作</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time" align="center" />
        <el-table-column label="操作">
          <template #default="scope">
            <template v-if="checkIsManager(scope.row.id)">
              <span>-</span>
            </template>
            <template v-else>
              <el-button type="primary" @click="cellEdit(scope.row)">
                <template #icon>
                  <i-ep-edit></i-ep-edit>
                </template>
                编辑
              </el-button>
              <el-button type="danger" @click="cellDelete(scope.row)">
                <template #icon>
                  <i-ep-delete></i-ep-delete>
                </template>
                删除
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <roleDrawerVue v-model="dialogVisible" @refresh="getData" ref="roleDrawerRef"></roleDrawerVue>
  </div>
</template>
<script lang="ts">
export default {
  name: "setRole",
};
</script>
<script setup lang="ts">
import type { FormInstance } from "element-plus";
// 引入api
import {
  getRoleListApi,
  getRoleDropApi,
  addRoleApi,
  getEditDropApi,
  editRoleApi,
  delRoleApi,
} from "@/api/system/role";
import { IroleList } from "@/api/system/types";
import roleDrawerVue from "./components/roleDrawer.vue";

const state = reactive({
  // 表格数据
  tableData: [] as IroleList[],
  dialogVisible: false, //弹窗开关
});
const { tableData, dialogVisible } = toRefs(state);

const roleDrawerRef = ref<InstanceType<typeof roleDrawerVue>>();

function checkIsManager(id: number) {
  return id <= 0;
}

// 获取表格数据
const getData = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "正在加载",
    background: "rgba(0, 0, 0, 0.1)",
  });

  try {
    const result = await getRoleListApi();
    console.log(result.data);
    tableData.value = result.data;
    loadingInstance.close();
  } catch (error) {
    loadingInstance.close();
  }
};

// 点击新建角色
const handleAddRole = () => {
  dialogVisible.value = true;
  nextTick(() => {
    roleDrawerRef.value?.getRoleDrop();
  });
};

// 单元格点击编辑
const cellEdit = async (row: any) => {
  dialogVisible.value = true;
  nextTick(() => {
    roleDrawerRef.value?.getEditRoleDrop(row);
  });
};

// 点击启用开关切换
const handleSwitchChange = async (row: any) => {
  console.log(row);
  let id = row.id;
  const data = {
    id,
    status: row.status,
  };
  try {
    const result = await editRoleApi(data);
    if (result.code === "-2") {
      row.status = row.status == 1 ? 0 : 1;
      return false;
    }
    ElMessage.success(result.msg);
  } catch (error) {
    row.status = row.status == 1 ? 0 : 1;
  }
};

// 单元格点击删除
const cellDelete = (row: any) => {
  let name = row.role_title;
  ElMessageBox.confirm(`您确定要删除【${name}】这个角色吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      console.log("点击了 确定删除");
      sendDelData(row.id);
    })
    .catch((error) => {
      console.log(error);
    });
};
const sendDelData = async (id: number) => {
  const result = await delRoleApi({ id });
  if (result.code === "-2") {
    return false;
  }
  ElMessage({
    message: result.msg,
    type: "success",
  });
  getData();
};

onActivated(() => {
  getData();
});
onDeactivated(() => {});
</script>

<style scoped lang="scss"></style>
