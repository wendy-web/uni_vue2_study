<script setup lang="ts">
/*  停机误时统计明细 */
import type { FormInstance } from "element-plus";
import { isArray } from "@pureadmin/utils";
import { exportShutdownApi, getShutdownlListApi } from "@/api/device/report-forms/shutdown";
import { perms as permsFn } from "@/utils/auth";
import PlaceSelect from "@/components/DeptSelect/PlaceSelect.vue";
import { useTable } from "@/hooks/table";
import lineEchartsVue from "./components/lineEcharts.vue";
import { useList } from "./utils/hook";

defineOptions({
  name: "deviceReportShutdown",
});
const { startdownload } = useTable();
const { columns, searchColumns, pagination, formData, treeData, getBase, getReBase, placeList } =
  useList();

const formRef = ref();
const tableData = ref<any[]>([]);

const tableLoading = ref(false);
const prueTableRef = ref();

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
  let { occurrence_time, ...rest } = formData.value;
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    occurrence_time_start: isArray(occurrence_time) ? occurrence_time[0] : "",
    occurrence_time_end: isArray(occurrence_time) ? occurrence_time[1] : "",
    ...rest,
  };
  tableLoading.value = true;
  const result = await getShutdownlListApi(data);
  tableLoading.value = false;
  tableData.value = result.data.list;
  pagination.total = result.data.total;
}

// 点击导出按钮
const handleCommand = async (command: number) => {
  console.log("command", command, typeof command);
  let { occurrence_time, ...rest } = formData.value;
  let data = {
    occurrence_time_start: isArray(occurrence_time) ? occurrence_time[0] : "",
    occurrence_time_end: isArray(occurrence_time) ? occurrence_time[1] : "",
    ...rest,
    type: command,
  };
  startdownload(exportShutdownApi, data);
};

function setAdaptive() {
  setTimeout(() => {
    prueTableRef.value?.setAdaptive();
  }, 500);
}

function checkChartPerms() {
  let permsRes = permsFn(["reportforms:shutdown:chart"]);
  return permsRes;
}

onActivated(() => {
  getData();
  getBase();
  getReBase();
  prueTableRef.value?.setAdaptive();
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <PlusSearch v-model="formData" :columns="searchColumns" :showNumber="5" ref="formRef">
        <template #plus-field-equipment_type_id>
          <TreeSelect :list="treeData" v-model="formData.equipment_type_id"></TreeSelect>
        </template>
        <template #plus-field-use_addr_id>
          <!-- 选择使用位置 -->
          <PlaceSelect :placeList="placeList" v-model="formData.use_addr_id"></PlaceSelect>
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
    <lineEchartsVue
      @setAdaptive="setAdaptive()"
      v-if="checkChartPerms()"
    ></lineEchartsVue>
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <template #buttons>
          <div class="flex-1 flex items-center">
            <div class="flex items-center">
              <el-dropdown
                trigger="click"
                @command="handleCommand"
                v-hasPerm="['reportforms:shutdown:export']"
              >
                <el-button type="primary">
                  数据导出
                  <el-icon class="el-icon--right"><i-ep-arrow-down></i-ep-arrow-down></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="1">数据列表导出</el-dropdown-item>
                    <el-dropdown-item :command="2">模板导出</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
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
            @page-size-change="getData()"
            @page-current-change="getData()"
            :loading="tableLoading"
          ></pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
