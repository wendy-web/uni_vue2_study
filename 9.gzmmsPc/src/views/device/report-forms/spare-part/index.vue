<script setup lang="ts">
/* 报表-备件周期报表-列表页面 */
import type { FormInstance } from "element-plus";
import { isArray } from "@pureadmin/utils";
import {
  getExportpartsCycleApi,
  getStatsReportListApi,
} from "@/api/device/report-forms/spare-part";
import type { StatsReportItemType } from "@/api/device/report-forms/spare-part/types";
import PlaceSelect from "@/components/DeptSelect/PlaceSelect.vue";
import TreeSelect from "@/components/DeptSelect/TreeSelect.vue";
import DeptSelect from "@/components/DeptSelect/index.vue";
import { useTable } from "@/hooks/table";
import { useList } from "./utils/hook";

const { startdownload } = useTable();

defineOptions({
  name: "deviceReportSparePart",
});

const {
  columns,
  searchColumns,
  pagination,
  formData,
  treeData,
  departmentList,
  placeList,
  getBase,
  childColumns,
  filterList,
} = useList();

const formRef = ref();
const tableData = ref<StatsReportItemType[]>([]);
const selectTable = ref<StatsReportItemType[]>([]);
const tableLoading = ref(false);
const prueTableRef = ref();
const ids = ref<number[]>([]);

const handleSearch = () => {
  getData();
};
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getData();
};

async function getData() {
  let { chage_date_time, down_date_time, create_time, change_type, ...rest } = formData.value;
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    create_time_start: isArray(create_time) ? create_time[0] : "",
    create_time_end: isArray(create_time) ? create_time[1] : "",
    down_date_time_start: isArray(down_date_time) ? down_date_time[0] : "",
    down_date_time_end: isArray(down_date_time) ? down_date_time[1] : "",
    chage_date_time_start: isArray(chage_date_time) ? chage_date_time[0] : "",
    chage_date_time_end: isArray(chage_date_time) ? chage_date_time[1] : "",
    ...rest,
  };
  tableLoading.value = true;
  const result = await getStatsReportListApi(data);
  tableLoading.value = false;
  tableData.value = result.data.list;
  pagination.total = result.data.total;
}

// 点击导出按钮
const handleCommand = (command: number) => {
  console.log("command", command, typeof command);
  if (command === 2) {
    let { chage_date_time, down_date_time, create_time, change_type, ...rest } = formData.value;
    // 2是全部导出
    let data = {
      page: pagination.currentPage,
      size: pagination.pageSize,
      create_time_start: isArray(create_time) ? create_time[0] : "",
      create_time_end: isArray(create_time) ? create_time[1] : "",
      down_date_time_start: isArray(down_date_time) ? down_date_time[0] : "",
      down_date_time_end: isArray(down_date_time) ? down_date_time[1] : "",
      chage_date_time_start: isArray(chage_date_time) ? chage_date_time[0] : "",
      chage_date_time_end: isArray(chage_date_time) ? chage_date_time[1] : "",
      ...rest,
    };
    startdownload(getExportpartsCycleApi, data);
  } else {
    if (ids.value.length === 0) {
      return ElMessage.warning("请您至少勾选一条数据");
    }
    // 1是选择导出
    startdownload(getExportpartsCycleApi, { ids: ids.value });
  }
};

// 勾选触发事件
function changeSelect(selection: StatsReportItemType[]) {
  selectTable.value = selection;
  ids.value = selection.map((item) => {
    return item.id;
  });
  console.log("selectData.value", ids.value);
}

onActivated(() => {
  getData();
  getBase();
  prueTableRef.value?.setAdaptive();
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        :showNumber="4"
        :colProps="{ span: 6 }"
        ref="formRef"
      >
        <template #plus-field-equipment_type_id>
          <TreeSelect :list="treeData" v-model="formData.equipment_type_id"></TreeSelect>
        </template>
        <template #plus-field-use_addr_id>
          <!-- 选择使用位置 -->
          <PlaceSelect :placeList="placeList" v-model="formData.use_addr_id"></PlaceSelect>
        </template>
        <template #plus-field-use_dept_id>
          <!-- 选择使用部门 -->
          <DeptSelect :department-list="departmentList" v-model="formData.use_dept_id"></DeptSelect>
        </template>
        <template #footer="{ handleUnfold, isShowUnfold }">
          <FormBtn
            @search="handleSearch"
            @reset="handleReset(formRef?.plusFormInstance.formInstance)"
          >
            <template #fold>
              <el-button @click="handleUnfold">
                <template #icon>
                  <i-ep-ArrowUp v-if="isShowUnfold"></i-ep-ArrowUp>
                  <i-ep-ArrowDown v-else></i-ep-ArrowDown>
                </template>
                {{ isShowUnfold ? "收起" : "展开" }}
              </el-button>
            </template>
          </FormBtn>
        </template>
      </PlusSearch>
    </div>
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch" :filter-list="filterList">
        <!-- <template #buttons>
          <el-dropdown
            trigger="click"
            @command="handleCommand"
            v-hasPerm="['reportforms:sparepart:export']"
          >
            <el-button type="primary">
              数据导出
              <el-icon class="el-icon--right"><i-ep-arrow-down></i-ep-arrow-down></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                
                <el-dropdown-item :command="2">导出列表数据</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template> -->
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
            @page-size-change="getData()"
            @page-current-change="getData()"
            :loading="tableLoading"
            @selection-change="changeSelect"
          >
            <template #expand="{ row, $index }">
              <pure-table
                :data="row.equipment_chage_parts"
                border
                header-cell-class-name="table-row-header-ectype"
                row-class-name="table-row-header-ectype"
                :columns="childColumns"
              ></pure-table>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
