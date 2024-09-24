<script setup lang="ts">
import type { FormInstance } from "element-plus";
import {
  getMonthlyListApi,
  monthlyChartApi,
  monthlyExportApi,
} from "@/api/energy/direct-statement/monthly/index";
import placeSelectVue from "@/components/DeptSelect/PlaceSelect.vue";
import { useTable } from "@/hooks/table";
import { useList } from "./utils/hook";

/* 月报表 */
defineOptions({
  name: "EnergyDirectStatementMonthly",
});
const { startdownload } = useTable();
const {
  columns,
  searchColumns,
  pagination,
  formData,
  getBaseData,
  placeList,
  tabIndex,
  tabMap,
  getRelData,
  tableData,
} = useList(handleSearch);
/** plusform搜索表单的ref */
const plusFormRef = ref();
const tableLoading = ref(false);
const ids = ref<number[]>([]);

function handleSearch() {
  getData();
}
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  // tabIndex.value = 0;
  getData();
};

// 勾选触发事件
function changeSelect(selection: any[]) {
  ids.value = selection.map((item) => {
    return item.id;
  });
  console.log("selectData.value", ids.value);
}

// 点击导出按钮
const handleCommand = (command: number) => {
  console.log("command", command, typeof command);
  if (command === 2) {
    // 2是全部导出
    let { month, ...rest } = formData.value;
    if (!month) {
      return ElMessage.warning("请先选择月份后再导出");
    }
    let data = {
      month,
      ...rest,
    };
    startdownload(monthlyExportApi, data);
  } else {
    // 1是选择导出
    if (ids.value.length === 0) {
      return ElMessage.warning("请您至少勾选一条数据");
    }
    startdownload(monthlyExportApi, { ids: ids.value });
  }
};

async function getData() {
  tableLoading.value = true;

  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    ...formData.value,
  };
  try {
    const result = await getMonthlyListApi(data);
    tableLoading.value = false;
    tableData.value = result.data.list;
    pagination.total = result.data.total;
    console.log("列表数据：", tableData.value);
  } catch (error) {
    tableLoading.value = false;
  }
}

// 点击tab
async function tabClick({ index, props }: any) {
  let { label, name } = props;
  tabIndex.value = name;
  formData.value.type = name;
  await getRelData(name);
  //更新配置数据
  getData();
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
          <el-dropdown
            trigger="click"
            @command="handleCommand"
            v-hasPerm="['statement:monthly:export']"
          >
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
            border
            @page-size-change="getData()"
            @page-current-change="getData()"
            @selection-change="changeSelect"
            :loading="tableLoading"
          ></pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/common.scss";

:deep(.el-tabs__header) {
  margin-bottom: 4px;
}
</style>
