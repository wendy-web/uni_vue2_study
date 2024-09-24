<script setup lang="ts">
/* 定期CIP检测项目列表页 */
import { Plus } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
import { isArray } from "@pureadmin/utils";
import { getCIPBaseDataApi } from "@/api/quality/common";
import {
  fixedCIPAddApi,
  fixedCIPDelApi,
  fixedCIPReportApi,
  getFixedCIPListApi,
} from "@/api/quality/process-inspection/cip";
import { checkAssocType } from "@/utils/auth";
import { useCommonHooks } from "@/hooks/quality";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useList } from "./utils/hook";

const { startDownloadUrl } = useCommonHooks();

defineOptions({
  name: "ProcessInspectionCip",
});

const useSetting = useSettingsStoreHook();
const {
  pagination,
  formData,
  columns,
  searchColumns,
  router,
  cellDetail,
  addFormData,
  addFormColumns,
  addVisible,
  addFormRules,
  addLoading,
  brand_data,
  check_init,
  line_init,
  pro_init,
  work_shop_init,
} = useList();

/** plusform搜索表单的ref */
const plusFormRef = ref();

const dialogFormRef = ref();
const addFormRef = computed(() => {
  return dialogFormRef.value.formInstance as FormInstance;
});

const tableData = ref<any[]>([]);
const tableLoading = ref(false);

/** puretable的ref */
const prueTableRef = ref();

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
  let { check_date, ...rest } = formData.value;
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    check_date_start: isArray(check_date) ? check_date[0] : "",
    check_date_end: isArray(check_date) ? check_date[1] : "",
    ...rest,
  };
  tableLoading.value = true;
  const result = await getFixedCIPListApi(data);
  tableData.value = result.data.list;
  pagination.total = result.data.total;
  tableLoading.value = false;
}

/** 点击新建 */
function handleAdd() {
  addVisible.value = true;
}

/** 点击生成报告 */
async function cellGenerateReport(row: any) {
  startDownloadUrl(fixedCIPReportApi, { id: row.id });
}

/** 点击编辑 */
function cellEdit(row: any) {
  router.push({
    path: "/quality/process-inspection/cip/add",
    query: {
      id: row.id,
      pageType: 2,
    },
  });
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
      const result = await fixedCIPDelApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 新建弹窗点击取消 */
function handleAddCancel() {
  addVisible.value = false;
}

function dialogClose() {
  addLoading.value = false;
  addFormRef.value?.resetFields();
}

const handleAddConfirm = async (handleSubmit: () => Promise<boolean>, type = 1) => {
  const isPass = await handleSubmit();
  if (!isPass) return;
  addLoading.value = true;
  let data = { ...addFormData.value };
  const result = await fixedCIPAddApi(data);
  addLoading.value = false;
  addVisible.value = false;
  let id = result.data.id;
  if (type === 1) {
    getData();
  } else {
    router.push({
      path: "/quality/process-inspection/cip/add",
      query: {
        id: id,
        pageType: 2,
      },
    });
  }
};

async function getBase() {
  const result = await getCIPBaseDataApi();
  brand_data.value = result.data.brand_data; //产品大类
  check_init.value = result.data.check_init; //检测结果
  line_init.value = result.data.line_init; //线别
  pro_init.value = result.data.pro_init; //项目
  work_shop_init.value = result.data.work_shop_init; //车间
}

onActivated(() => {
  getBase();
  // 获取列表数据
  getData();
  prueTableRef.value?.setAdaptive();
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
          <el-button type="primary" @click="handleAdd" :icon="Plus" v-hasPerm="['pi:cip:add']">
            新建
          </el-button>
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
          >
            <template #operation="{ row }">
              <el-button type="primary" link @click="cellDetail(row)" v-hasPerm="['pi:cip:detail']">
                详情
              </el-button>
              <template v-if="row.check_ret !== 1">
                <el-button
                  type="primary"
                  link
                  @click="cellEdit(row)"
                  v-hasPerm="['pi:cip:execute']"
                >
                  执行检测
                </el-button>
              </template>
              <!-- 当前是创建人的时候 -->
              <template v-if="checkAssocType(row.assoc_type, 1)">
                <template v-if="row.check_ret === 0">
                  <el-button type="info" link @click="cellDel(row)" v-hasPerm="['pi:cip:del']">
                    删除
                  </el-button>
                </template>
              </template>
              <template v-if="row.check_ret === 1">
                <el-button
                  type="primary"
                  link
                  @click="cellGenerateReport(row)"
                  v-hasPerm="['pi:cip:report']"
                >
                  生成报告
                </el-button>
              </template>
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
        title: '新建定期CIP',
        draggable: true,
        hasFooter: false,
        onClose: dialogClose,
      }"
      :form="{
        columns: addFormColumns,
        rules: addFormRules,
        labelWidth: '100px',
        labelPosition: 'right',
        hasFooter: true,
        colProps: {
          span: 12,
        },
      }"
    >
      <template #form-footer="{ handleSubmit }">
        <div class="flex justify-center mt-10 w-full">
          <el-button class="mr-4 w-[80px]" @click="handleAddCancel">取消</el-button>
          <el-button
            type="primary"
            :loading="addLoading"
            @click="handleAddConfirm(handleSubmit, 1)"
            class="mr-4 w-[100px]"
          >
            确认
          </el-button>
          <el-button
            type="primary"
            :loading="addLoading"
            @click="handleAddConfirm(handleSubmit, 2)"
            v-hasPerm="['pi:cip:execute']"
          >
            确认并执行
          </el-button>
        </div>
      </template>
    </PlusDialogForm>
  </div>
</template>

<style lang="scss" scoped></style>
