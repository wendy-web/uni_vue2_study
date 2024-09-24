<script setup lang="ts">
/*  点巡检报表-消防月报 */
import type { FormInstance } from "element-plus";
import { isArray } from "@pureadmin/utils";
import { getSafeReportBaseSelectApi } from "@/api/device/common";
import {
  exportSaleReportDataApi,
  getFireControlListApi,
} from "@/api/device/report-forms/fire-control";
import { usePreview } from "@/hooks/device/common";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useList } from "./utils/hook";

const { startDownloadUrl } = usePreview();

defineOptions({
  name: "deviceReportFireControl",
});

const useSetting = useSettingsStoreHook();
const {
  columns,
  searchColumns,
  pagination,
  formData,
  treeData,
  departmentList,
  getBase,
  checkable_number,
  finished_number,
  unfinished_number,
  status_list,
} = useList();

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
  let { point_check_time, ...rest } = formData.value;
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    point_check_start_time: isArray(point_check_time) ? point_check_time[0] : "",
    point_check_end_time: isArray(point_check_time) ? point_check_time[1] : "",
    ...rest,
  };
  tableLoading.value = true;
  const result = await getFireControlListApi(data);
  tableLoading.value = false;
  checkable_number.value = result.data.count.total;
  finished_number.value = result.data.count.finished;
  unfinished_number.value = result.data.count.unfinished;
  tableData.value = result.data.list;
  pagination.total = result.data.total;
}

// 点击导出按钮
const handleCommand = async (command: number) => {
  console.log("command", command, typeof command);
  let { point_check_time, ...rest } = formData.value;
  let data = {
    point_check_start_time: isArray(point_check_time) ? point_check_time[0] : "",
    point_check_end_time: isArray(point_check_time) ? point_check_time[1] : "",
    ...rest,
    type: command,
  };
  startDownloadUrl(exportSaleReportDataApi, data);
};

async function getBaseData() {
  const result = await getSafeReportBaseSelectApi({
    plan_start_month: formData.value.plan_start_month,
  });
  status_list.value = result.data.status_list;
}

onActivated(() => {
  getData();
  getBase();
  getBaseData();
  prueTableRef.value?.setAdaptive();
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        :showNumber="5"
        :colProps="{ span: 4 }"
        ref="formRef"
      >
        <template #plus-field-equipment_type_id>
          <TreeSelect :list="treeData" v-model="formData.equipment_type_id"></TreeSelect>
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
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <template #buttons>
          <div class="flex-1 flex items-center">
            <div class="flex items-center">
              <el-dropdown trigger="click" @command="handleCommand">
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
              <ul class="flex ml-4">
                <li
                  class="mr-2 text-[#00BFBF] text-[16px] border px-2 h-[36px] leading-[34px] rounded-[4px]"
                >
                  <span>应检数</span>
                  <span class="font-bold">({{ checkable_number }})</span>
                </li>
                <li
                  class="mr-2 text-[#C280FF] text-[16px] border px-2 h-[36px] leading-[34px] rounded-[4px]"
                >
                  <span>已完成:</span>
                  <span class="font-bold">({{ finished_number }})</span>
                </li>
                <li
                  class="mr-2 text-[#0079FE] text-[16px] border px-2 h-[36px] leading-[34px] rounded-[4px]"
                >
                  <span>未开展:</span>
                  <span class="font-bold">({{ unfinished_number }})</span>
                </li>
              </ul>
            </div>

            <span class="font-bold mx-auto text-[18px]">每月消防设备检查报表</span>
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
          >
            <template #picture="{ row }">
              <template v-if="isArray(row.picture) && row.picture.length > 0">
                <el-image
                  :src="useSetting.baseHttp + row.picture[0]"
                  style="width: 100px; height: 100px; border-radius: 6px"
                  :preview-src-list="row.picture.map((m: string) => useSetting.baseHttp + m)"
                  :z-index="9999"
                  preview-teleported
                />
              </template>
              <span v-else>--</span>
            </template>
            <template #rectify_picture="{ row }">
              <template v-if="isArray(row.rectify_picture) && row.rectify_picture.length > 0">
                <el-image
                  :src="useSetting.baseHttp + row.rectify_picture[0]"
                  style="width: 100px; height: 100px; border-radius: 6px"
                  :preview-src-list="
                    row.rectify_picture.map((m: string) => useSetting.baseHttp + m)
                  "
                  :z-index="9999"
                  preview-teleported
                />
              </template>
              <span v-else>--</span>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
