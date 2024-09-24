<script setup lang="ts">
/* 电子天平使用记录列表页面 */
import { Plus } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
import { isArray } from "@pureadmin/utils";
import type { AxiosResponse } from "axios";
import dayjs from "dayjs";
import {
  balanceUseAddApi,
  balanceUseConfirmApi,
  balanceUseDelApi,
  balanceUseEditApi,
  balanceUseReportApi,
  getBalanceUseListApi,
} from "@/api/quality/instrument/balance-use";
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
  name: "InstrumentBalanceUse",
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
  getInstMap,
  confirm_sign,
} = useList();

/** plusform搜索表单的ref */
const plusFormRef = ref();

const dialogFormRef = ref();
/** 新建表单的ref */
const addFormRef = computed(() => {
  return dialogFormRef.value.formInstance as FormInstance;
});

const tableData = ref<any[]>([]);
const tableLoading = ref(false);

/** puretable的ref */
const prueTableRef = ref();

const plusDialogTitle = ref("新增清洗记录");
const listId = ref(0);
const ids = ref<number[]>([]);
const selectYearList = ref<string[]>([]);

// 勾选触发事件
function changeSelect(selection: any[]) {
  ids.value = selection.map((item) => {
    return item.id;
  });
  selectYearList.value = selection.map((item) => {
    return item.use_year;
  });
}

// 点击导出按钮
const handleCommand = (command: number) => {
  console.log("command", command, typeof command);
  if (command === 2) {
    // 2是全部导出
    let { user_date, use_year, ...rest } = formData.value;
    if (!use_year) {
      return ElMessage.warning("请先选择使用年份后再导出");
    }
    let data = {
      use_year,
      user_date_start: isArray(user_date) ? user_date[0] : "",
      user_date_end: isArray(user_date) ? user_date[1] : "",
      ...rest,
    };
    startDownloadUrl(balanceUseReportApi, data);
  } else {
    // 1是选择导出
    if (ids.value.length === 0) {
      return ElMessage.warning("请您至少勾选一条数据");
    }
    let allSameYear = allElementsSame(selectYearList.value);

    if (allSameYear) {
      startDownloadUrl(balanceUseReportApi, { id: ids.value, use_year: selectYearList.value[0] });
    } else {
      return ElMessage.warning("勾选数据中存在不同的使用年份,请勾选同一使用年份的数据");
    }
  }
};

function allElementsSame(array: string[]) {
  // 如果数组为空，返回 true
  if (array.length === 0) {
    return true;
  }

  // 创建一个 Set 来存储数组中的唯一元素
  const uniqueElements = new Set(array);

  // 如果 Set 的大小为 1，说明所有元素相同
  return uniqueElements.size === 1;
}

// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  // formData.value.use_year = dayjs().format("YYYY");
  getData();
};

// 点击搜索
const handleSearch = () => {
  getData();
};

async function getData() {
  let { user_date, ...rest } = formData.value;
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    user_date_start: isArray(user_date) ? user_date[0] : "",
    user_date_end: isArray(user_date) ? user_date[1] : "",
    ...rest,
  };
  tableLoading.value = true;
  const result = await getBalanceUseListApi(data);
  tableData.value = result.data.list;
  pagination.total = result.data.total;
  tableLoading.value = false;
}
/** 点击新建 */
function handleAdd() {
  confirm_sign.value = "";
  listId.value = 0;
  plusDialogTitle.value = "新增天平使用记录";
  addVisible.value = true;
  nextTick(() => {
    addFormRef.value?.resetFields();
    addFormData.value.inst_id = undefined;
    addFormData.value.name = "";
    addFormData.value.code = "";
    addFormData.value.inst_type_no = "";
    addFormData.value.user_date = "";
    addFormData.value.use_year = "";
    addFormData.value.use_start_time = "";
    addFormData.value.use_end_time = "";
    addFormData.value.use_start = [];
    addFormData.value.temperature = "";
    addFormData.value.humidity = "";
    addFormData.value.use_before = undefined;
    addFormData.value.use_after = undefined;
    addFormData.value.check_pro = "";
    addFormData.value.remark = "";
  });
}
/** 单元格点击编辑 */
function cellEdit(row: any) {
  confirm_sign.value = "";
  listId.value = row.id;
  plusDialogTitle.value = "修改天平使用记录";
  addFormData.value.inst_id = row.inst_id;
  addFormData.value.name = row.name;
  addFormData.value.code = row.code;
  addFormData.value.inst_type_no = row.inst_type_no;
  addFormData.value.user_date = row.user_date;
  addFormData.value.use_year = row.use_year;

  addFormData.value.use_start_time = row.use_start_time;
  addFormData.value.use_end_time = row.use_end_time;
  addFormData.value.use_start = [row.use_start_time, row.use_end_time];

  addFormData.value.temperature = row.temperature;
  addFormData.value.humidity = row.humidity;
  addFormData.value.use_before = row.use_before;
  addFormData.value.use_after = row.use_after;
  addFormData.value.use_before = row.use_before;
  addFormData.value.check_pro = row.check_pro;
  addFormData.value.remark = row.remark;

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
async function handleSign() {
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
      confirm_sign.value = result;
      sendData(1);
      updateDialog(false, "btnLoading");
      done();
    },
  });
}
/** 调起新建/编辑/确认接口接口 */
async function sendData(status: number = 0) {
  addLoading.value = true;
  let { use_start, ...rest } = addFormData.value;
  let data = { ...rest, status, confirm_sign: confirm_sign.value ? confirm_sign.value : undefined };
  console.log("🚀 ~ sendData ~ data:", data);
  let result: AxiosResponse;
  if (status === 1) {
    // 如果是签字确认,判断是否有id,有则直接调确认接口,无则调新建接口
    result = listId.value
      ? await balanceUseConfirmApi({ ...data, id: listId.value })
      : await balanceUseAddApi(data);
  } else {
    // 如果点击的保存,则判断是否有id,有则则调编辑接口,无则调新建接口
    result = listId.value
      ? await balanceUseEditApi({ ...data, id: listId.value })
      : await balanceUseAddApi(data);
  }
  confirm_sign.value = "";
  addLoading.value = false;
  addVisible.value = false;
  ElMessage.success(result.msg);
  getData();
}

/** 点击导出报告 */
async function handleGenerateReport(row: any) {
  startDownloadUrl(balanceUseReportApi, { id: row.id });
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
      const result = await balanceUseDelApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
}
onActivated(() => {
  getInstMap();
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
            v-hasPerm="['inst:balanceuse:add']"
          >
            新建
          </el-button>
          <ExportDownVue
            @handleCommand="handleCommand"
            v-hasPerm="['inst:balanceuse:report']"
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
            @page-size-change="getData()"
            @page-current-change="getData()"
            @selection-change="changeSelect"
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
            <template #operation="{ row }">
              <template v-if="row.status === 0">
                <el-button
                  type="primary"
                  link
                  @click="cellEdit(row)"
                  v-hasPerm="['inst:balanceuse:edit']"
                >
                  编辑
                </el-button>
                <!-- 当前是创建人的时候 -->
                <template v-if="checkAssocType(row.assoc_type, 1)">
                  <el-button
                    type="info"
                    link
                    @click="cellDel(row)"
                    v-hasPerm="['inst:balanceuse:del']"
                  >
                    删除
                  </el-button>
                </template>
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
        colProps: {
          span: 12,
        },
        labelWidth: '130px',
        labelPosition: 'right',
        hasFooter: true,
      }"
    >
      <template #form-footer="{ handleSubmit }">
        <div class="mt-8">
          <el-button @click="handleAddCancel" class="w-[80px]">取消</el-button>
          <el-button type="primary" @click="handleAddConfirm(handleSubmit, 0)" class="w-[80px]">
            保存
          </el-button>
          <el-button
            type="primary"
            @click="handleAddConfirm(handleSubmit, 1)"
            v-hasPerm="['inst:balanceuse:confirm']"
          >
            签字确认
          </el-button>
        </div>
      </template>
    </PlusDialogForm>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/common.scss";
</style>
