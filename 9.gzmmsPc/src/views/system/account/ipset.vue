<script setup lang="ts">
import type { FormInstance } from "element-plus";
import { addIpApi, delIpApi, editIpApi, getIpListApi, setIpStatusApi } from "@/api/system/account";
import { IpItemType } from "@/api/system/types";
import { useAdaptiveConfig } from "@/hooks/table";
import { useAccount } from "./columns";

const { adaptiveConfig, maxHeight } = useAdaptiveConfig();
const { ipColumns: columns } = useAccount();

const emits = defineEmits(["noAccess"]);

const tableData = ref<IpItemType[]>([]);
const dialogVisible = ref(false);
const dialogTitle = ref("新增IP");
const confirmLoading = ref(false);
const formRef = ref<FormInstance>();
const searchFormRef = ref<FormInstance>();

const searchForm = ref({
  keyword: "",
  page: 1,
  size: 10,
});

const formData = ref({
  ip: "",
  pc_status: false,
  wx_status: false,
  desc: "",
});
const rowId = ref(0);

const total = ref(1);

const getData = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "正在加载",
    background: "rgba(0, 0, 0, 0.1)",
  });
  let data = toRaw(searchForm.value);
  try {
    const result = await getIpListApi(data);
    if (result.code === "-2") {
      emits("noAccess");
      return;
    }
    tableData.value = result.data.list;
    total.value = result.data.total;
  } finally {
    loadingInstance.close();
  }
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

// 分页触发事件
const handleQuery = () => {
  getData();
};

/** 点击新增 */
const handleAdd = () => {
  rowId.value = 0;
  dialogTitle.value = "新增IP";
  dialogVisible.value = true;
};

const handleConfirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      confirmLoading.value = true;
      // console.log("submit!");
      // setTimeout(() => {
      //   confirmLoading.value = false;
      //   dialogVisible.value = false;
      // }, 1000);
      if (!rowId.value) {
        sendAdd();
      } else {
        sendEdit();
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

async function sendAdd() {
  let data = {
    ip: formData.value.ip,
    pc_status: formData.value.pc_status ? 0 : 1,
    wx_status: formData.value.wx_status ? 0 : 1,
    desc: formData.value.desc,
  };
  try {
    const result = await addIpApi(data);
    if (result.code === "-2") {
      return;
    }
    ElMessage.success(result.msg);
    getData();
  } finally {
    resetDialog();
  }
}

async function sendEdit() {
  let data = {
    id: rowId.value,
    ip: formData.value.ip,
    pc_status: formData.value.pc_status ? 0 : 1,
    wx_status: formData.value.wx_status ? 0 : 1,
    desc: formData.value.desc,
  };
  try {
    const result = await editIpApi(data);
    if (result.code === "-2") {
      return;
    }
    ElMessage.success(result.msg);
    getData();
  } finally {
    resetDialog();
  }
}

function resetDialog() {
  confirmLoading.value = false;
  dialogVisible.value = false;
}

function cellEdit(row: IpItemType) {
  dialogTitle.value = "编辑IP";
  dialogVisible.value = true;
  rowId.value = row.id;
  nextTick(() => {
    formData.value.ip = row.ip;
    formData.value.desc = row.desc;
    formData.value.pc_status = row.pc_status == 0 ? true : false;
    formData.value.wx_status = row.wx_status == 0 ? true : false;
  });
}
function cellDel(row: IpItemType) {
  let id = row.id;
  let ip = row.ip;
  ElMessageBox.confirm(`确认要删除IP地址为${ip}的该条内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    console.log("点击了 确定删除");
    const result = await delIpApi({ id });
    if (result.code === "-2") return;
    ElMessage.success(result.msg);
    getData();
  });
}

const pcSwitchChange = (row: IpItemType) => {
  console.log("🚀 ~ pcSwitchChange ~ row.pc_status:", row.pc_status);
  const content =
    row.pc_status === 0
      ? `确认要开启禁止IP地址为${row.ip}的PC端访问吗?`
      : `确认要允许IP地址为${row.ip}的PC端访问吗?`;
  ElMessageBox.confirm(content, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const data = {
        id: row.id,
        type: 0,
        status: row.pc_status,
      };

      let result = await setIpStatusApi(data);
      if (result.code === "-2") {
        row.pc_status = row.pc_status === 0 ? 1 : 1;
        return;
      }
      ElMessage.success(result.msg);
    })
    .catch(() => {
      row.pc_status = row.pc_status === 0 ? 1 : 0;
    });
};

const wxSwitchChange = (row: IpItemType) => {
  console.log("🚀 ~ wxSwitchChange ~ row.wx_status:", row.wx_status);

  const content =
    row.wx_status === 0
      ? `确认要开启禁止IP地址为${row.ip}的小程序端访问吗?`
      : `确认要允许IP地址为${row.ip}的小程序端访问吗?`;
  ElMessageBox.confirm(content, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const data = {
        id: row.id,
        type: 1,
        status: row.wx_status,
      };

      let result = await setIpStatusApi(data);
      if (result.code === "-2") {
        row.wx_status = row.wx_status === 0 ? 1 : 0;
        return;
      }
      ElMessage.success(result.msg);
    })
    .catch(() => {
      row.wx_status = row.wx_status === 0 ? 1 : 0;
    });
};

onMounted(() => {
  getData();
});
watch(dialogVisible, (val) => {
  if (!val) {
    formRef.value?.resetFields();
    formData.value.pc_status = false;
    formData.value.wx_status = false;
  }
});
</script>
<template>
  <div class="container px-4 pb-4">
    <div>
      <el-form :model="searchForm" ref="searchFormRef" inline>
        <el-form-item label="关键字" prop="keyword">
          <el-input v-model="searchForm.keyword" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" v-deBounce>
            <template #icon>
              <i-ep-Search></i-ep-Search>
            </template>
            查询
          </el-button>
          <el-button @click="handleReset(searchFormRef)">
            <template #icon>
              <i-ep-Refresh></i-ep-Refresh>
            </template>

            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-button type="success" size="default" class="mb-[10px]" @click="handleAdd">
      <template #icon>
        <i-ep-Plus></i-ep-Plus>
      </template>
      新增
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
      <template #pc-header="scope">
        <div class="flex items-center justify-center">
          <span>PC端</span>
          <el-tooltip effect="dark" content="是否允许IP访问PC端" placement="top-start">
            <i-ep-QuestionFilled></i-ep-QuestionFilled>
          </el-tooltip>
        </div>
      </template>
      <template #wx-header="scope">
        <div class="flex items-center justify-center">
          <span>小程序端</span>
          <el-tooltip effect="dark" content="是否允许IP访问小程序端" placement="top-start">
            <i-ep-QuestionFilled></i-ep-QuestionFilled>
          </el-tooltip>
        </div>
      </template>
      <template #pc-status="scope">
        <el-switch
          v-model="scope.row.pc_status"
          inline-prompt
          active-text="禁止"
          inactive-text="允许"
          :active-value="0"
          :inactive-value="1"
          @change="pcSwitchChange(scope.row)"
        ></el-switch>
      </template>
      <template #mp-weixin="scope">
        <el-switch
          v-model="scope.row.wx_status"
          inline-prompt
          active-text="禁止"
          inactive-text="允许"
          :active-value="0"
          :inactive-value="1"
          @change="wxSwitchChange(scope.row)"
        ></el-switch>
      </template>
      <template #operation="scope">
        <el-button type="primary" @click="cellEdit(scope.row)" class="mb-[4px]">
          <template #icon>
            <i-ep-edit></i-ep-edit>
          </template>
          编辑
        </el-button>
        <el-button type="danger" @click="cellDel(scope.row)" class="mb-[4px]">
          <template #icon>
            <i-ep-delete></i-ep-delete>
          </template>
          删除
        </el-button>
      </template>
    </pure-table>
    <pagination
      v-if="total > 0"
      v-model:total="total"
      v-model:page="searchForm.page"
      v-model:limit="searchForm.size"
      @pagination="handleQuery"
    />
    <el-dialog :title="dialogTitle" top="30vh" width="600px" v-model="dialogVisible" draggable>
      <p class="mb-[10px] text-gray-400">
        ip地址规范，如ip为192.168.1.2，则只需要输入前三段，即192.168.1
      </p>
      <el-form ref="formRef" :model="formData" class="mb-[20px]">
        <el-form-item
          label="IP地址"
          prop="ip"
          :rules="{ required: true, message: '请输入IP地址', trigger: 'blur' }"
        >
          <el-input placeholder="请输入IP地址" v-model="formData.ip"></el-input>
        </el-form-item>
        <el-form-item label="限制端">
          <template #label="scope">
            <div class="flex items-center justify-center">
              <span>限制端</span>
              <el-tooltip
                effect="dark"
                content="默认不需要勾选允许该IP访问，勾选后则开启禁止该IP访问端口"
                placement="top-start"
              >
                <i-ep-QuestionFilled></i-ep-QuestionFilled>
              </el-tooltip>
            </div>
          </template>

          <div class="-mt-[4px]">
            <el-checkbox v-model="formData.pc_status" label="PC端" size="large" />
            <el-checkbox v-model="formData.wx_status" label="小程序端" size="large" />
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input placeholder="请输入备注" v-model="formData.desc" maxlength="20"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button class="w-[80px]" size="large" @click="dialogVisible = false">取 消</el-button>
          <el-button
            class="w-[80px]"
            size="large"
            type="primary"
            @click="handleConfirm(formRef)"
            :loading="confirmLoading"
          >
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding-top: 10px;
}
</style>
