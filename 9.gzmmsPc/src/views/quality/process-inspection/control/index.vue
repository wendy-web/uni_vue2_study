<script setup lang="tsx">
/* 工序控制检验报告列表页 */
import { Plus } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
import { isArray } from "@pureadmin/utils";
import { useStorage } from "@vueuse/core";
import {
  controlDelApi,
  controlRecallApi,
  controlReportApi,
  getControlListApi,
} from "@/api/quality/process-inspection/control";
import { addDialog, closeAllDialog } from "@/components/ReDialog";
import { useCommonHooks } from "@/hooks/quality";
import { useSettingsStoreHook } from "@/store/modules/settings";
import ListOperationBtn from "@/views/quality/components/ListOperationBtn/index.vue";
import selectControlVue from "./components/selectControl.vue";
import { useList } from "./utils/hook";

const { startDownloadUrl } = useCommonHooks();

defineOptions({
  name: "ProcessInspectionControl",
});

const useSetting = useSettingsStoreHook();
const { pagination, formData, columns, searchColumns, router, cellDetail } = useList();

/** plusform搜索表单的ref */
const plusFormRef = ref();

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
  const result = await getControlListApi(data);
  tableData.value = result.data.list;
  pagination.total = result.data.total;
  tableLoading.value = false;
}

function handleAdd() {
  addDialog({
    width: "400px",
    btnClass: "w-[80px]",
    draggable: true,
    btnLoading: false,
    showClose: false,
    title: "请选择需要的工序检验单",
    hideFooter: true,
    contentRenderer: () =>
      h(selectControlVue, {
        onTarget: handleAddTarget,
      }),
  });
}

const controlListData = useStorage(
  "controlListData",
  {
    brand: "", //产品品牌 ND1 红牛 ND2 战马
    checkNum: 2, //检测次数
    waterRelated: 1, //水处理相关三个检测 是否检测
  },
  sessionStorage,
);

function handleAddTarget(val: any) {
  closeAllDialog();
  controlListData.value.brand = val.brand;
  controlListData.value.checkNum = val.checkNum;
  controlListData.value.waterRelated = val.waterRelated;
  router.push({
    path: "/quality/process-inspection/control/add",
  });
}

/** 点击生成报告 */
async function cellGenerateReport(row: any) {
  startDownloadUrl(controlReportApi, { id: row.id });
}

/** 点击编辑 */
function cellEdit(row: any) {
  router.push({
    path: "/quality/process-inspection/control/add",
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
      const result = await controlDelApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击撤回 */
async function cellRecall(row: any) {
  const result = await controlRecallApi({ id: row.id });
  ElMessage.success(result.msg);
  getData();
}

onActivated(() => {
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
          <el-button
            type="primary"
            @click="handleAdd"
            :icon="Plus"
            v-hasPerm="['pi:control:addedit']"
          >
            新建
          </el-button>
          <!-- <el-button type="primary" @click="handleGenerateReport">生成报告</el-button> -->
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
              <ListOperationBtn
                :status="row.status"
                :assocType="row.assoc_type"
                :order-type="26"
                v-on="{
                  detail: () => cellDetail(row),
                  edit: () => cellEdit(row),
                  delete: () => cellDel(row),
                  recall: () => cellRecall(row),
                  report: () => cellGenerateReport(row),
                }"
              ></ListOperationBtn>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
