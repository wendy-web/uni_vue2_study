<script setup lang="ts">
/* 报表-能耗统计报表-列表页面 */
import type { FormInstance } from "element-plus";
import { useList } from "./utils/hook";

defineOptions({
  name: "deviceReportFormsEnergy",
});

const { columns, searchColumns, pagination } = useList();
const formData = reactive({});
const formRef = ref();
const tableData = ref([]);

const handleSearch = () => {};
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

function handleSizeChange(val: number) {
  console.log(`${val} items per page`);
}

function handleCurrentChange(val: number) {
  console.log(`current page: ${val}`);
}
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        :showNumber="6"
        :colProps="{ span: 4.8 }"
        ref="formRef"
      >
        <template #footer>
          <FormBtn
            @search="handleSearch"
            @reset="handleReset(formRef?.plusFormInstance.formInstance)"
          ></FormBtn>
        </template>
      </PlusSearch>
    </div>
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            :data="tableData"
            :columns="dynamicColumns"
            :size="size"
            adaptive
            :adaptiveConfig="{ offsetBottom: 120 }"
            header-cell-class-name="table-gray-header"
            :pagination="pagination"
            :paginationSmall="size === 'small' ? true : false"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
          ></pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
