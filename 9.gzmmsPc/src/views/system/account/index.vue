<script setup lang="ts">
import { ElLoading, FormInstance, FormRules } from "element-plus";
// 引入获取仓库列表和角色列表公共api
import { getRoleListApi, storageListApi } from "@/api/common";
import { ICateItem } from "@/api/common/types";
// 引入api
import {
  addUserApi,
  delUserApi,
  editUserApi,
  getUserListApi,
  unbindWxApi,
} from "@/api/system/account";
// 引入数据类型
import { IUserItem, IroleList } from "@/api/system/types";
// 引入选择部门自定义组件
import DeptSelect from "@/components/DeptSelect/index.vue";
// 上传图片自定义组件
import SingleUpload from "@/components/Upload/SingleUpload.vue";
import { useAdaptiveConfig } from "@/hooks/table";
// 引入获取部门列表的hooks
import { deptListHooks } from "@/hooks";
// 获取userStore中的数据
import { useUserStoreHook } from "@/store/modules/user";
import { useAccount } from "./columns";
import ipsetVue from "./ipset.vue";

defineOptions({
  name: "SetAccount",
});

const { adaptiveConfig, maxHeight } = useAdaptiveConfig();
const { columns } = useAccount();
const { departmentList } = deptListHooks();

const userStore = useUserStoreHook();

enum ETitle {
  "新建账号" = 1,
  "编辑账号",
}

const state = reactive({
  searchData: {
    keyword: "",
    dept_id: 0,
  },
  tableData: [] as IUserItem[],
  dialogVisible: false,
  formData: {
    name: "", //名称
    user: "", //手机号码/账号
    pwd: "", //密码
    role_id: [] as number[], //角色id
    dept_id: "", //部门id
    // warehouse_id: "", //仓库id
    warehouse_id: [] as number[], //仓库id
    head_url: "", //头像
    status: 1,
    work_no: "", //工号
    wh_arr: [] as number[], //仓库查看授权数据
  },
  dialogType: 1, //1新建 2编辑
  roleList: [] as IroleList[], //角色列表
  // departmentList: [] as IDeptItem[],
  loadingDialog: false,
  editId: NaN, //编辑的id
  rules: {
    name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
    user: [{ required: true, message: "请输入账号/手机号", trigger: "blur" }],
    role_id: [
      {
        required: true,
        message: "请选择角色",
        trigger: "change",
      },
    ],
    pwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
  } as FormRules,
  storageList: [] as ICateItem[],
  page: 1,
  size: 10,
  total: 0,
});

const {
  searchData,
  tableData,
  dialogVisible,
  formData,
  roleList,
  loadingDialog,
  dialogType,
  editId,
  storageList,
  page,
  size,
  total,
} = toRefs(state);

const searchRef = ref<FormInstance>();
const formRef = ref<FormInstance>();

const activeName = ref("first");
const ipPageShow = ref(false);

// 监听tabs的切换
const handleTabsChange = () => {
  if (activeName.value === "second") {
    ipPageShow.value = true;
  }
};

// 监听ip设置页面 无权限的通知
const handleNoAccess = () => {
  activeName.value = "first";
  ipPageShow.value = false;
};

// 分页触发事件
const handleQuery = () => {
  // console.log("分页触发");
  getData();
};

// 点击查询
const handleSearch = () => {
  getData();
};
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getData();
};

const getData = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "正在加载",
    background: "rgba(0, 0, 0, 0.1)",
  });

  try {
    const result = await getUserListApi(searchData.value);
    console.log(result);
    tableData.value = result.data.list;
    let list = Object.values(result.data.list);
    total.value = list.length;
    tableData.value = list.slice((page.value - 1) * size.value, page.value * size.value);
  } finally {
    loadingInstance.close();
  }
};

const handleUnbind = async (id: number) => {
  ElMessageBox.confirm("解绑微信后，将重新授权绑定微信，才可继续使用小程序。", "确定解绑吗?", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    const result = await unbindWxApi({ id });
    ElMessage.success(result.msg);
    getData();
  });
};

// 点击新建账号
const handleAdd = () => {
  dialogType.value = 1;
  console.log("点击新建");
  dialogVisible.value = true;
  loadingDialog.value = true;
  nextTick(() => {
    formRef.value?.clearValidate("role_id");
  });
  getRoleList();
};
// 获取角色列表和仓库列表数据
const getRoleList = async () => {
  try {
    const resultRole = await getRoleListApi();
    roleList.value = resultRole.data;
    const resultStorage = await storageListApi();
    storageList.value = resultStorage.data.list;
  } finally {
    loadingDialog.value = false;
  }
};

// 弹窗点击取消按钮
const handleCancel = () => {
  console.log("点击取消");
  dialogVisible.value = false;
};
// 弹窗点击确定按钮
const handleConfirm = () => {
  console.log("点击确定");
  formRef.value!.validate((valid: boolean) => {
    if (valid) {
      console.log("通过了校验");
      if (dialogType.value == 1) {
        sendData();
      } else {
        sendEditData();
      }
    } else {
      console.log("出错了");
      return false;
    }
  });
};
// 新增弹窗点击确定按钮发送数据
const sendData = async () => {
  const data = formData.value;
  const result = await addUserApi(data);
  dialogVisible.value = false;
  if (result.code === "-2") return;
  ElMessage({
    type: "success",
    message: result.msg,
  });
  getData();
};
// 编辑弹窗点击确定按钮发送数据
const sendEditData = async () => {
  const data = {
    id: editId.value,
    ...formData.value,
  };
  const result = await editUserApi(data);
  dialogVisible.value = false;
  if (result.code === "-2") return;
  ElMessage({
    type: "success",
    message: result.msg,
  });
  getData();
};

//  单元格点击编辑
const cellEdit = (row: any) => {
  console.log("🚀 ~ cellEdit ~ row:", row);
  dialogType.value = 2;
  dialogVisible.value = true;
  loadingDialog.value = true;
  editId.value = row.id;
  getRoleList();
  nextTick(() => {
    let { role_id, name, dept_id, work_no, warehouse_id, head_url, status, wh_arr } = row;
    formData.value.role_id = role_id ? role_id.split(",").map(Number) : undefined;
    formData.value.name = name;
    formData.value.dept_id = dept_id;
    formData.value.work_no = work_no;
    formData.value.warehouse_id = warehouse_id;
    formData.value.head_url = head_url;
    formData.value.status = status;
    formData.value.wh_arr = wh_arr;
    console.log("formData.value", formData.value);
  });
};

/** IP白名单账户切换 */
const whiteSwitchChange = async (row: any) => {
  console.log("row.is_white_user", row.is_white_user);
  // const text = row.is_white_user === 1 ? "设置" : "取消";
  const content =
    row.is_white_user === 1
      ? `确认要将账号【${row.name}】添加到IP白名单吗?`
      : `确认要将账号【${row.name}】从IP白名单移除吗?`;
  ElMessageBox.confirm(content, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const data = {
        id: row.id,
        is_white_user: row.is_white_user,
      };

      let result = await editUserApi(data);
      if (result.code === "-2") {
        row.is_white_user = row.is_white_user === 1 ? 0 : 1;
        return;
      }
      ElMessage.success(result.msg);
    })
    .catch(() => {
      row.is_white_user = row.is_white_user === 1 ? 0 : 1;
    });
};

// 单元格开关
const handleSwitchChange = async (row: any) => {
  console.log("row.status", row.status);
  const text = row.status === 1 ? "启用" : "停用";
  ElMessageBox.confirm("确认要" + text + " " + row.name + " 用户吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const data = {
        id: row.id,
        status: row.status,
      };

      let result = await editUserApi(data);
      if (result.code === "-2") {
        row.status = row.status === 1 ? 0 : 1;
        return;
      }
      ElMessage.success(result.msg);
    })
    .catch(() => {
      row.status = row.status === 1 ? 0 : 1;
    });
};

//  单元格点击 删除
const cellDel = (row: any) => {
  let mobile = row.user;
  ElMessageBox.confirm(`您确定要删除【${mobile}】这个账号吗?`, "警告", {
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
  const result = await delUserApi({ id });
  if (result.code === "-2") return;
  ElMessage({
    message: result.msg,
    type: "success",
  });
  getData();
};
// 弹窗关闭的回调
function closeDialog() {
  formRef.value?.resetFields();
  formRef.value?.clearValidate();
}

const handleUserInput = (value: string) => {
  // 只能输入数字，大小写字母，@！._的使用
  formData.value.user = value.replace(/[^\w_@.!]/g, "");
};
const handlePasInput = (value: string) => {
  // 只能输入数字，大小写字母，@！._的使用
  formData.value.pwd = value.replace(/[^\w_@.!]/g, "");
};

const rulesContent = computed(() => {
  if (dialogType.value == 1) {
    return {
      name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      user: [{ required: true, message: "请输入账号/手机号", trigger: "blur" }],
      role_id: [
        {
          required: true,
          message: "请选择角色",
          trigger: "change",
        },
      ],
      pwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
      dept_id: [{ required: true, message: "请选择部门", trigger: "change" }],
    };
  } else {
    return {
      name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      user: [{ required: true, message: "请输入账号/手机号", trigger: "blur" }],
      role_id: [
        {
          required: true,
          message: "请选择角色",
          trigger: "change",
        },
      ],
      dept_id: [{ required: true, message: "请选择部门", trigger: "change" }],
    };
  }

  // if (dialogType.value == 1) {
  //   return {
  //     name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  //     user: [{ required: true, message: "请输入账号/手机号", trigger: "blur" }],
  //     role_id: [
  //       {
  //         required: true,
  //         message: "请选择角色",
  //         trigger: "change",
  //       },
  //     ],
  //     pwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
  //     dept_id: [{required: true, message: "请选择部门", trigger: "change" }]
  //   };
  // } else {
  //   formRef.value?.clearValidate();
  //   return {};
  // }
});

const dialogTitle = computed(() => {
  return ETitle[dialogType.value];
});
const passwordTitle = computed(() => {
  return dialogType.value == 1 ? "请输入密码" : "登录密码,不写则默认";
});
watch(
  () => searchData.value.dept_id,
  (newValue) => {
    console.log("newValue", newValue);
  },
);

onActivated(() => {
  getData();
});
onDeactivated(() => {});
</script>

<template>
  <div class="app-container">
    <div class="tabs-card">
      <el-tabs v-model="activeName" type="card" @tab-change="handleTabsChange">
        <el-tab-pane label="账号管理" name="first">
          <div class="app-card">
            <el-form :model="searchData" ref="searchRef" :inline="true">
              <el-form-item label="关键字" prop="keyword">
                <el-input v-model="searchData.keyword" placeholder="请输入账号/姓名" @keyup.enter="getData"></el-input>
              </el-form-item>

              <el-form-item label="部门" prop="dept_id">
                <dept-select
                  v-model="searchData.dept_id"
                  :department-list="departmentList"
                ></dept-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSearch" v-deBounce>
                  <template #icon>
                    <i-ep-Search></i-ep-Search>
                  </template>
                  查询
                </el-button>
                <el-button @click="handleReset(searchRef)">
                  <template #icon>
                    <i-ep-Refresh></i-ep-Refresh>
                  </template>

                  重置
                </el-button>
              </el-form-item>
            </el-form>
            <el-button type="success" size="default" class="mb-[10px]" @click="handleAdd">
              <template #icon>
                <i-ep-Plus></i-ep-Plus>
              </template>

              新建账号
            </el-button>

            <pure-table
              border
              stripe
              header-cell-class-name="table-row-header"
              :data="tableData"
              :columns="columns"
              adaptive
              :adaptiveConfig="adaptiveConfig"
              :max-height="maxHeight"
            >
              <template #white_user="{ row }">
                <el-switch
                  v-model="row.is_white_user"
                  inline-prompt
                  active-text="是"
                  inactive-text="否"
                  :active-value="1"
                  :inactive-value="0"
                  @change="whiteSwitchChange(row)"
                />
              </template>

              <template #uid="scope">
                <div v-if="scope.row.unionid" class="flex items-center justify-center">
                  <span>{{ scope.row.unionid }}</span>
                  <el-button
                    link
                    type="primary"
                    @click="handleUnbind(scope.row.id)"
                    class="ml-[4px] underline"
                  >
                    解绑
                  </el-button>
                </div>
                <span v-else>-</span>
              </template>
              <template #status="scope">
                <el-switch
                  v-model="scope.row.status"
                  inline-prompt
                  active-text="是"
                  inactive-text="否"
                  :active-value="1"
                  :inactive-value="0"
                  @change="handleSwitchChange(scope.row)"
                />
              </template>
              <template #operation="scope">
                <el-button
                  type="primary"
                  @click="cellEdit(scope.row)"
                  class="mb-[4px]"
                  :disabled="!scope.row.is_can_edit"
                >
                  <template #icon>
                    <i-ep-edit></i-ep-edit>
                  </template>
                  编辑
                </el-button>
                <!-- <el-button type="danger" @click="cellDel(scope.row)" class="mb-[4px]">
                  <template #icon>
                    <i-ep-delete></i-ep-delete>
                  </template>
                  删除
                </el-button> -->
              </template>
            </pure-table>
            <pagination
              v-if="total > 0"
              v-model:total="total"
              v-model:page="page"
              v-model:limit="size"
              @pagination="handleQuery"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="IP管理" name="second">
          <ipsetVue v-if="ipPageShow" @no-access="handleNoAccess"></ipsetVue>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :title="dialogTitle"
      width="50%"
      @close="closeDialog"
      draggable
      :destory-on-close="true"
    >
      <el-form
        :model="formData"
        ref="formRef"
        :rules="rulesContent"
        :inline="false"
        label-width="120"
        v-loading="loadingDialog"
        :validate-on-rule-change="false"
      >
        <el-row :gutter="0">
          <el-col :span="12" :offset="0">
            <el-form-item label="角色" prop="role_id">
              <el-select v-model="formData.role_id" multiple placeholder="请选择" class="w-full">
                <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.role_title"
                  :value="item.id"
                  :class="{ 'no-select': item.status == 0 }"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="0">
          <el-col :span="12" :offset="0">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formData.name" placeholder="请输入姓名" maxlength="11"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0" v-if="dialogType == 1">
          <el-col :span="12" :offset="0">
            <el-form-item label="手机号/账号" prop="user">
              <el-input
                v-model="formData.user"
                placeholder="请输入账号/手机号码"
                maxlength="11"
                @input="handleUserInput"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12" :offset="0">
            <el-form-item label="密码" prop="pwd">
              <el-input
                v-model="formData.pwd"
                :placeholder="passwordTitle"
                maxlength="16"
                @input="handlePasInput"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12" :offset="0">
            <el-form-item label="部门" prop="dept_id">
              <dept-select
                v-model="formData.dept_id"
                :department-list="departmentList"
              ></dept-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="0">
          <el-col :span="12" :offset="0">
            <el-form-item label="工号" prop="work_no">
              <el-input v-model="formData.work_no" placeholder="请输入工号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0" v-if="userStore.module_type === 0">
          <el-col :span="12" :offset="0">
            <el-form-item label="仓管员权限" prop="warehouse_id">
              <template #label>
                <span>仓管员权限</span>
                <el-tooltip
                  effect="dark"
                  content="选择账号可管理的仓库，设置为该仓库管理员，该权限可操作审批流仓管确认"
                  placement="top"
                >
                  <i-ep-QuestionFilled></i-ep-QuestionFilled>
                </el-tooltip>
              </template>
              <el-select
                v-model="formData.warehouse_id"
                placeholder="请选择仓库"
                multiple
                class="w-full"
              >
                <el-option
                  v-for="item in storageList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0" v-if="userStore.module_type === 0">
          <el-col :span="12" :offset="0">
            <el-form-item label="查看仓库权限" prop="wh_arr">
              <template #label>
                <span>查看仓库权限</span>
                <el-tooltip
                  effect="dark"
                  content="该权限配置后可查询到指定仓库货品信息，可操作仓库出库（领取仓库权限）"
                  placement="top"
                >
                  <i-ep-QuestionFilled></i-ep-QuestionFilled>
                </el-tooltip>
              </template>
              <el-select
                v-model="formData.wh_arr"
                placeholder="请选择查看仓库权限"
                class="w-full"
                multiple
              >
                <el-option
                  v-for="item in storageList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12" :offset="0">
            <el-form-item label="头像" prop="head_url">
              <single-upload v-model="formData.head_url" :tipStatus="true"></single-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12" :offset="0">
            <el-form-item label="状态" class="flex items-center" prop="status">
              <el-radio-group v-model="formData.status">
                <el-radio :label="1" size="large">启用</el-radio>
                <el-radio :label="0" size="large">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel" class="w-[80px]">取消</el-button>
          <el-button type="primary" @click="handleConfirm" class="w-[80px]">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.app-card {
  border: none;
  box-shadow: none;
}
.tabs-card {
  background-color: #fff;
  // padding: 0 10px;
  // padding-left: 20px;
}
.no-select {
  cursor: not-allowed !important;
  pointer-events: none;
  color: var(--el-text-color-disabled) !important;
}
</style>
