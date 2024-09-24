<script setup lang="ts">
import type { FormInstance, TableColumnCtx } from "element-plus";
import { isArray } from "@pureadmin/utils";
import { dayReportApi, getDayListApi } from "@/api/energy/direct-statement/daily/index";
import placeSelectVue from "@/components/DeptSelect/PlaceSelect.vue";
import { useCommonHooks } from "@/hooks/quality";
import { useList } from "./utils/hook";

/* 月报表 */
defineOptions({
  name: "EnergyDirectStatementDaily",
});
const { startDownloadUrl } = useCommonHooks();

const {
  columns,
  searchColumns,
  pagination,
  formData,
  getBaseData,
  placeList,
  initTableData,
  tabIndex,
  tabMap,
  getRelData,
  tableData,
  tableSpanMethod,
  getSummaries,
  formattedDate,
} = useList(handleSearch);
/** plusform搜索表单的ref */
const plusFormRef = ref();
const tableLoading = ref(false);
/** table的ref */
const prueTableRef = ref();
function handleSearch() {
  clearSelection();
  // 搜索数据重置选中的列
  multipleSelection.value = [];
  getData();
}
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  // formEl.resetFields();
  formData.value.rel_id = [];
  formData.value.bar_title = "";
  formData.value.asset_no = "";
  formData.value.save_addr = "";
  formData.value.type = 0;
  formData.value.this_meter_time_arr = [formattedDate, formattedDate];
  tabIndex.value = 0;
  clearSelection();
  multipleSelection.value = [];
  getData();
};
const handleExport = async (command: number) => {
  let { this_meter_time_arr, rel_id, ...rest } = formData.value;
  let data: any = {
    rel_id,
    page: pagination.currentPage,
    size: pagination.pageSize,
    this_meter_time_start: isArray(this_meter_time_arr) ? this_meter_time_arr[0] : "",
    this_meter_time_end: isArray(this_meter_time_arr) ? this_meter_time_arr[1] : "",
    ...rest,
  };
  // 全部导出
  if (command === 2) {
    data.rel_id = rel_id;
  } else {
    // 选择导出
    if (multipleSelection.value.length === 0) {
      ElMessage.warning("请选择要导出的数据");
      return;
    }
    data.rel_id = multipleSelection.value;
  }

  try {
    startDownloadUrl(dayReportApi, data);

    // console.log("导出数据·····:", result);
  } catch (error) {
    tableLoading.value = false;
    console.log("日报表导出error：", error);
  }
};
async function getData() {
  tableLoading.value = true;
  let { this_meter_time_arr, ...rest } = formData.value;

  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    this_meter_time_start: isArray(this_meter_time_arr) ? this_meter_time_arr[0] : "",
    this_meter_time_end: isArray(this_meter_time_arr) ? this_meter_time_arr[1] : "",
    ...rest,
  };
  try {
    const result = await getDayListApi(data);
    tableLoading.value = false;
    // 数据处理
    tableData.value = initTableData(result.data.data);
    pagination.total = result.data.total;
    // console.log("列表数据：", tableData.value);
  } catch (error) {
    tableLoading.value = false;
    console.log("日报表列表error：", error);
  }
}

// 点击tab
async function tabClick({ index, props }: any) {
  let { label, name } = props;
  tabIndex.value = name;
  formData.value.type = name;
  await getRelData(name);
  clearSelection();
  //更新配置数据
  getData();
}
// 多选的行
const multipleSelection = ref<unknown[]>([]);
// 表格多选
const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val.map((item) => {
    return item.rel_id || item.unique_id;
  });
  console.log("选中的rel_id:", multipleSelection.value);
};
// 清空选中
function clearSelection() {
  const { clearSelection } = prueTableRef.value.getTableRef();
  clearSelection();
}
onActivated(() => {
  getBaseData();
  getData();
});
</script>
<template>
  <div class="app-container">
    <!-- 顶部选项卡 -->
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
    <div class="app-card">
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        :showNumber="10"
        ref="plusFormRef"
        @reset="handleReset(plusFormRef?.plusFormInstance.formInstance)"
        @search="handleSearch"
      >
        <template #plus-field-save_addr>
          <!-- 选择使用位置 -->
          <placeSelectVue :placeList="placeList" v-model="formData.save_addr"></placeSelectVue>
        </template>
      </PlusSearch>
    </div>
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <template #buttons>
          <!-- <el-button type="primary" @click="handleExport">导出</el-button> -->
          <el-dropdown trigger="click" @command="handleExport" v-hasPerm="['statement:daily:export']">
            <el-button type="primary">
              导出数据
              <el-icon class="el-icon--right"><i-ep-arrow-down></i-ep-arrow-down></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="1">导出选中数据</el-dropdown-item>
                <el-dropdown-item :command="2">导出列表数据</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="prueTableRef"
            row-key="id"
            :data="tableData"
            :columns="dynamicColumns"
            :size="size"
            adaptive
            :adaptiveConfig="{ offsetBottom: 120 }"
            header-cell-class-name="table-gray-header"
            :pagination="pagination"
            :paginationSmall="size === 'small' ? true : false"
            :span-method="tableSpanMethod"
            border
            @page-size-change="getData()"
            @page-current-change="getData()"
            @selection-change="handleSelectionChange"
            :loading="tableLoading"
            :summary-method="getSummaries"
            show-summary
          ></pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
