<script setup lang="ts">
/* 标准样罐领用记录列表页面 */
import { Plus } from "@element-plus/icons-vue";
import { type FormInstance, dayjs } from "element-plus";
import { isArray } from "@pureadmin/utils";
import type { AxiosResponse } from "axios";
import {
  getSampletankReceiveListApi,
  sampletankReceiveAddApi,
  sampletankReceiveConfirmApi,
  sampletankReceiveDelApi,
  sampletankReceiveDestroyApi,
  sampletankReceiveEditApi,
  sampletankReceiveReportApi,
} from "@/api/quality/instrument/sampletank-receive";
import { checkAssocType } from "@/utils/auth";
import signDialogVue from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCommonHooks } from "@/hooks/quality";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useUserStoreHook } from "@/store/modules/user";
import ExportDownVue from "@/views/quality/components/ExportDown/index.vue";
import { useList } from "./utils/hook";

const { startDownloadUrl } = useCommonHooks();

defineOptions({
  name: "InstrumentSampletankReceive",
});
const useSetting = useSettingsStoreHook();
const useUser = useUserStoreHook();
const {
  pagination,
  formData,
  columns,
  searchColumns,
  addFormData,
  addFormColumns,
  addFormRules,
  addVisible,
  addLoading,
  confirm_sign,
  getUnitList,
  destroyFormData,
  destroyFormColumns,
  destroyVisible,
  destroyLoading,
  destroyFormRules,
  getUserOptions,
} = useList();

/** plusform搜索表单的ref */
const plusFormRef = ref();

const dialogFormRef = ref();
/** 新建表单的ref */
const addFormRef = computed(() => {
  return dialogFormRef.value.formInstance as FormInstance;
});

const dialogDestroyFormRef = ref();
const destroyFormRef = computed(() => {
  return dialogDestroyFormRef.value.formInstance as FormInstance;
});

const tableData = ref<any[]>([]);
const tableLoading = ref(false);

/** puretable的ref */
const prueTableRef = ref();

const plusDialogTitle = ref("新增样罐领用记录");
const listId = ref(0);

const ids = ref<number[]>([]);

// 勾选触发事件
function changeSelect(selection: any[]) {
  ids.value = selection.map((item) => {
    return item.id;
  });
}

// 点击导出按钮
const handleCommand = (command: number) => {
  console.log("command", command, typeof command);
  if (command === 2) {
    // 2是全部导出
    let { isuse_date, ...rest } = formData.value;
    let data = {
      isuse_date_start: isArray(isuse_date) ? isuse_date[0] : "",
      isuse_date_end: isArray(isuse_date) ? isuse_date[1] : "",
      ...rest,
    };
    startDownloadUrl(sampletankReceiveReportApi, data);
  } else {
    if (ids.value.length === 0) {
      return ElMessage.warning("请您至少勾选一条数据");
    }
    // 1是选择导出
    startDownloadUrl(sampletankReceiveReportApi, { id: ids.value });
  }
};

// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getData();
};

// 点击搜索
const handleSearch = () => {
  getData();
};

async function getData() {
  let { isuse_date, ...rest } = formData.value;
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    isuse_date_start: isArray(isuse_date) ? isuse_date[0] : "",
    isuse_date_end: isArray(isuse_date) ? isuse_date[1] : "",
    ...rest,
  };
  tableLoading.value = true;
  const result = await getSampletankReceiveListApi(data);
  tableData.value = result.data.list;
  pagination.total = result.data.total;
  tableLoading.value = false;
}

/** 点击新建 */
function handleAdd() {
  confirm_sign.value = "";
  listId.value = 0;
  plusDialogTitle.value = "新增样罐领用记录";
  addVisible.value = true;
  nextTick(() => {
    addFormRef.value?.resetFields();
    addFormData.value.name = "";
    addFormData.value.unit = "";
    addFormData.value.isuse_num = "";
    addFormData.value.isuse_date = "";
    addFormData.value.purpose = "";
    addFormData.value.return_num = "";
    addFormData.value.return_date = "";

    addFormData.value.remark = "";
  });
}
/** 单元格点击编辑 */
function cellEdit(row: any) {
  confirm_sign.value = "";
  listId.value = row.id;
  plusDialogTitle.value = "修改清洗记录";
  addFormData.value.name = row.name;
  addFormData.value.unit = row.unit;
  addFormData.value.remark = row.remark;
  addFormData.value.isuse_num = row.isuse_num;
  addFormData.value.isuse_date = row.isuse_date;
  addFormData.value.purpose = row.purpose;
  addFormData.value.return_num = row.return_num;
  addFormData.value.return_date = row.return_date;
  addVisible.value = true;
}

/** 新建弹窗点击取消 */
function handleAddCancel() {
  addVisible.value = false;
}

async function handleAddConfirm(handleSubmit: () => Promise<boolean>, type = 0) {
  const isPass = await handleSubmit();
  if (!isPass) return;
  // 如果点击签字确认
  if (type === 1) {
    handleSign();
    return;
  } else {
    sendData(0);
  }
}

// 签字提交
const signDialogRef = ref();
async function handleSign(type: number = 0) {
  addDialog({
    width: "60%",
    btnClass: "w-[80px]",
    draggable: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    btnLoading: false,
    showClose: false,
    title: "签名",
    contentRenderer: () =>
      h(signDialogVue, {
        ref: signDialogRef,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      updateDialog(true, "btnLoading");
      const result = await signDialogRef.value.handleGenerate();
      if (type === 1) {
        // 如果type1表示 是执行销毁的 签字确认
        destroyFormData.value.destroy_sign = result;
        destroyConfirm();
      } else {
        // 默认是签字提交的签字确认
        confirm_sign.value = result;
        sendData(1);
      }

      updateDialog(false, "btnLoading");
      done();
    },
  });
}
/** 调起新建/编辑/确认接口 */
async function sendData(status: number = 0) {
  addLoading.value = true;
  let data = {
    ...addFormData.value,
    status,
    confirm_sign: confirm_sign.value ? confirm_sign.value : undefined,
  };
  console.log("🚀 ~ sendData ~ data:", data);
  let result: AxiosResponse;
  if (status === 1) {
    // 如果是签字确认,判断是否有id,有则直接调确认接口,无则调新建接口
    result = listId.value
      ? await sampletankReceiveConfirmApi({ ...data, id: listId.value })
      : await sampletankReceiveAddApi(data);
  } else {
    // 如果点击的保存,则判断是否有id,有则则调编辑接口,无则调新建接口
    result = listId.value
      ? await sampletankReceiveEditApi({ ...data, id: listId.value })
      : await sampletankReceiveAddApi(data);
  }
  confirm_sign.value = "";
  addLoading.value = false;
  addVisible.value = false;
  ElMessage.success(result.msg);
  getData();
}

/** 点击删除 */
function cellDel(row: any) {
  ElMessageBox.confirm(`确认要删除单据编号为：【${row.order_no}】的该条内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定删除");
      const result = await sampletankReceiveDelApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击执行销毁 */
function cellDestroy(row: any) {
  listId.value = row.id;
  destroyFormData.value.destroy_user_id = useUser.uid; //新建默认当前用户id
  destroyFormData.value.destroy_user_name = useUser.nickname; //新建默认当前用户名称
  let countNum = Number(row.isuse_num) - Number(row.return_num);
  if (countNum < 0) {
    countNum = 0;
  }
  destroyFormData.value.destroy_num = countNum;
  destroyFormData.value.destroy_max_num = countNum;
  destroyVisible.value = true;
  nextTick(() => {
    destroyFormRef.value?.resetFields();
  });
}

/** 执行销毁-点击取消 */
function handleDestroyCancel() {
  destroyVisible.value = false;
}

/** 执行销毁-签字完成后触发 */
async function destroyConfirm() {
  destroyLoading.value = true;
  let { destroy_max_num, ...rest } = destroyFormData.value;
  let data = {
    id: listId.value,
    ...rest,
    status: 2,
  };

  const result = await sampletankReceiveDestroyApi(data);
  ElMessage.success(result.msg);
  destroyLoading.value = false;
  destroyVisible.value = false;
  destroyFormData.value.destroy_sign = "";
  getData();
}

onActivated(() => {
  getData();
  getUnitList();
  getUserOptions();
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        :showNumber="6"
        ref="plusFormRef"
        @reset="handleReset(plusFormRef?.plusFormInstance.formInstance)"
        @search="handleSearch"
      ></PlusSearch>
    </div>
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <template #buttons="scope">
          <el-button
            type="primary"
            @click="handleAdd"
            :icon="Plus"
            v-hasPerm="['inst:sampletankreceive:add']"
          >
            新建
          </el-button>
          <ExportDownVue
            @handleCommand="handleCommand"
            v-hasPerm="['inst:sampletankreceive:report']"
          ></ExportDownVue>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="prueTableRef"
            row-key="id"
            stripe
            header-cell-class-name="table-gray-header"
            :data="tableData"
            :columns="dynamicColumns"
            :loading="tableLoading"
            :size="size"
            adaptive
            :adaptiveConfig="{ offsetBottom: 120 }"
            :pagination="pagination"
            @selection-change="changeSelect"
            @page-size-change="getData()"
            @page-current-change="getData()"
          >
            <template #confirm_sign="{ row }">
              <el-image
                :src="useSetting.baseHttp + row.confirm_sign"
                style="width: 100px; height: 60px; border-radius: 6px"
                :preview-src-list="[useSetting.baseHttp + row.confirm_sign]"
                :z-index="9999"
                preview-teleported
                v-if="row.confirm_sign"
              />
              <span v-else>--</span>
            </template>
            <template #destroy_sign="{ row }">
              <el-image
                :src="useSetting.baseHttp + row.destroy_sign"
                style="width: 100px; height: 60px; border-radius: 6px"
                :preview-src-list="[useSetting.baseHttp + row.destroy_sign]"
                :z-index="9999"
                preview-teleported
                v-if="row.destroy_sign"
              />
              <span v-else>--</span>
            </template>
            <template #operation="{ row }">
              <template v-if="row.status === 0">
                <el-button
                  type="primary"
                  link
                  @click="cellEdit(row)"
                  v-hasPerm="['inst:sampletankreceive:edit']"
                >
                  编辑
                </el-button>
                <!-- 当前是创建人的时候 -->
                <template v-if="checkAssocType(row.assoc_type, 1)">
                  <el-button
                    type="info"
                    link
                    @click="cellDel(row)"
                    v-hasPerm="['inst:sampletankreceive:del']"
                  >
                    删除
                  </el-button>
                </template>
              </template>
              <template v-else-if="row.status === 1">
                <el-button
                  type="primary"
                  link
                  @click="cellDestroy(row)"
                  v-hasPerm="['inst:sampletankreceive:destroy']"
                >
                  执行销毁
                </el-button>
              </template>
              <span v-else>--</span>
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
        title: plusDialogTitle,
        draggable: true,
        hasFooter: false,
      }"
      :form="{
        columns: addFormColumns,
        rules: addFormRules,
        labelWidth: '110px',
        labelPosition: 'right',
        hasFooter: true,
        colProps: {
          span: 12,
        },
      }"
    >
      <template #form-footer="{ handleSubmit }">
        <el-button @click="handleAddCancel" class="w-[80px]">取消</el-button>
        <el-button type="primary" @click="handleAddConfirm(handleSubmit, 0)" class="w-[80px]">
          保存
        </el-button>
        <el-button
          type="primary"
          @click="handleAddConfirm(handleSubmit, 1)"
          v-hasPerm="['inst:sampletankreceive:confirm']"
        >
          签字确认
        </el-button>
      </template>
    </PlusDialogForm>
    <PlusDialogForm
      ref="dialogDestroyFormRef"
      v-model:visible="destroyVisible"
      v-model="destroyFormData"
      :dialog="{
        title: '执行销毁',
        draggable: true,
        hasFooter: false,
      }"
      :form="{
        columns: destroyFormColumns,
        rules: destroyFormRules,
        labelWidth: '110px',
        labelPosition: 'right',
        hasFooter: true,
        colProps: {
          span: 12,
        },
      }"
    >
      <template #form-footer="{ handleSubmit }">
        <el-button @click="handleDestroyCancel" class="w-[80px]">取消</el-button>
        <el-button type="primary" @click="handleSign(1)">签字确认</el-button>
      </template>
    </PlusDialogForm>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/common.scss";
</style>
