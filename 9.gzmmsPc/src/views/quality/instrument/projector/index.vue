<script setup lang="ts">
/* 卷封投影仪校准记录表列表页面 */
import { Plus } from "@element-plus/icons-vue";
import { type FormInstance, dayjs } from "element-plus";
import { isArray } from "@pureadmin/utils";
import type { AxiosResponse } from "axios";
import {
  getProjectorListApi,
  projectorAddApi,
  projectorConfirmApi,
  projectorDelApi,
  projectorEditApi,
  projectorReportApi,
} from "@/api/quality/instrument/projector";
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
  name: "InstrumentProjector",
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

const plusDialogTitle = ref("新增较准记录");
const listId = ref(0);
const ids = ref<number[]>([]);
const selectWorkshopList = ref<string[]>([]);

// 勾选触发事件
function changeSelect(selection: any[]) {
  ids.value = selection.map((item) => {
    return item.id;
  });
  selectWorkshopList.value = selection.map((item) => {
    return item.workshop_id;
  });
}
// 点击导出按钮
const handleCommand = (command: number) => {
  console.log("command", command, typeof command);
  if (command === 2) {
    // 2是全部导出
    let { calibration_date, workshop_id, ...rest } = formData.value;
    if (!workshop_id) {
      return ElMessage.warning("请先选择车间后再导出");
    }
    let data = {
      workshop_id,
      calibration_date_start: isArray(calibration_date) ? calibration_date[0] : "",
      calibration_date_end: isArray(calibration_date) ? calibration_date[1] : "",
      ...rest,
    };
    startDownloadUrl(projectorReportApi, data);
  } else {
    // 1是选择导出
    if (ids.value.length === 0) {
      return ElMessage.warning("请您至少勾选一条数据");
    }

    let allSameYear = allElementsSame(selectWorkshopList.value);
    if (allSameYear) {
      startDownloadUrl(projectorReportApi, {
        id: ids.value,
        workshop_id: selectWorkshopList.value[0],
      });
    } else {
      return ElMessage.warning("勾选数据中存在不同的车间,请勾选同一车间的数据");
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
  getData();
};

// 点击搜索
const handleSearch = () => {
  getData();
};

async function getData() {
  let { calibration_date, ...rest } = formData.value;
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    calibration_date_start: isArray(calibration_date) ? calibration_date[0] : "",
    calibration_date_end: isArray(calibration_date) ? calibration_date[1] : "",
    ...rest,
  };
  tableLoading.value = true;
  const result = await getProjectorListApi(data);
  tableData.value = result.data.list;
  pagination.total = result.data.total;
  tableLoading.value = false;
}
/** 点击新建 */
function handleAdd() {
  confirm_sign.value = "";
  listId.value = 0;
  plusDialogTitle.value = "新增较准记录";
  addVisible.value = true;
  nextTick(() => {
    addFormRef.value?.resetFields();
    addFormData.value.calibration_user_id = useUser.uid; //新建默认当前用户id
    addFormData.value.calibration_user_name = useUser.nickname; //新建默认当前用户名称

    addFormData.value.calibration_date = "";
    addFormData.value.calibration_time = "";
    addFormData.value.calibration_val = "";
    addFormData.value.test_x_val = "";
    addFormData.value.test_y_val = "";
    addFormData.value.error_x_val = "";
    addFormData.value.error_y_val = "";

    addFormData.value.remark = "";
  });
}
/** 单元格点击编辑 */
function cellEdit(row: any) {
  confirm_sign.value = "";
  listId.value = row.id;
  plusDialogTitle.value = "修改较准记录";
  addFormData.value.workshop_id = row.workshop_id;
  addFormData.value.workshop_name = row.workshop_name;

  addFormData.value.calibration_date = row.calibration_date;
  addFormData.value.calibration_time = row.calibration_time;
  addFormData.value.calibration_val = row.calibration_val;
  addFormData.value.calibration_user_id = row.calibration_user_id;
  addFormData.value.calibration_user_name = row.calibration_user_name;
  addFormData.value.test_x_val = row.test_x_val;
  addFormData.value.test_y_val = row.test_y_val;
  addFormData.value.error_x_val = row.error_x_val;
  addFormData.value.error_y_val = row.error_y_val;
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
      ? await projectorConfirmApi({ ...data, id: listId.value })
      : await projectorAddApi(data);
  } else {
    // 如果点击的保存,则判断是否有id,有则则调编辑接口,无则调新建接口
    result = listId.value
      ? await projectorEditApi({ ...data, id: listId.value })
      : await projectorAddApi(data);
  }
  confirm_sign.value = "";
  addLoading.value = false;
  addVisible.value = false;
  ElMessage.success(result.msg);
  getData();
}

/** 点击生成报告 */
async function cellGenerateReport(row: any) {
  // const result = await sourceRecordReportApi({ id: row.id });
  // let _fileName = result.data.name;
  // let _fileUrl = result.data.src;
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
      const result = await projectorDelApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
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
            v-hasPerm="['inst:projector:add']"
          >
            新建
          </el-button>
          <ExportDownVue
            @handleCommand="handleCommand"
            v-hasPerm="['inst:projector:report']"
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
                  v-hasPerm="['inst:projector:edit']"
                >
                  编辑
                </el-button>
                <!-- 当前是创建人的时候 -->
                <template v-if="checkAssocType(row.assoc_type, 1)">
                  <el-button
                    type="info"
                    link
                    @click="cellDel(row)"
                    v-hasPerm="['inst:projector:del']"
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
        labelWidth: '110px',
        labelPosition: 'right',
        hasFooter: true,
        colProps: {
          span: 12,
        },
        rowProps: {
          gutter: 20,
        },
      }"
    >
      <template #plus-field-test_x_val>
        <div class="flex">
          <div class="flex flex-1">
            <span>X</span>
            <el-input
              v-model="addFormData.test_x_val"
              placeholder="测量值X"
              class="ml-2"
            ></el-input>
          </div>
          <el-form-item prop="test_y_val" :rules="addFormRules.test_y_val">
            <div class="flex flex-1 ml-2">
              <span>Y</span>
              <el-input
                v-model="addFormData.test_y_val"
                placeholder="测量值y"
                class="ml-2"
              ></el-input>
            </div>
          </el-form-item>
        </div>
      </template>
      <template #plus-field-error_x_val>
        <div class="flex">
          <div class="flex flex-1">
            <span>X</span>
            <el-input
              v-model="addFormData.error_x_val"
              placeholder="误差值X"
              class="ml-2"
            ></el-input>
          </div>
          <el-form-item prop="error_y_val" :rules="addFormRules.error_y_val">
            <div class="flex flex-1 ml-2">
              <span>Y</span>
              <el-input
                v-model="addFormData.error_y_val"
                placeholder="误差值y"
                class="ml-2"
              ></el-input>
            </div>
          </el-form-item>
        </div>
      </template>
      <template #form-footer="{ handleSubmit }">
        <div class="mt-4">
          <el-button @click="handleAddCancel" class="w-[80px]">取消</el-button>
          <el-button type="primary" @click="handleAddConfirm(handleSubmit, 0)" class="w-[80px]">
            保存
          </el-button>
          <el-button
            type="primary"
            @click="handleAddConfirm(handleSubmit, 1)"
            v-hasPerm="['inst:projector:confirm']"
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
