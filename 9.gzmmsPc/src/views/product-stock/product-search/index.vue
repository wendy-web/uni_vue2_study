<script setup lang="ts">
import type { FormInstance, TableColumnCtx } from "element-plus";
import { getProductSearchApi } from "@/api/product-stock/product-search";
import { useList } from "./utils/hook";

/* 成品库存查询页面 */
defineOptions({
  name: "ProductStockProductSearch",
});

const { columns, searchColumns, pagination, formData, factoryCodeList, getFactoryCodeList } =
  useList(handleSearch);

/** plusform搜索表单的ref */
const plusFormRef = ref();

const tableData = ref<any[]>([]);
const tableLoading = ref(false);

function handleSearch() {
  getData();
}
interface SummaryMethodProps<T = Product> {
  columns: TableColumnCtx<T>[];
  data: T[];
}

interface Product {
  stock_qty: number;
}
const getSummaries = (param: SummaryMethodProps) => {
  const { columns, data } = param;
  console.log("columns", columns);
  
  const sums: string[] = [];
  columns.forEach((column, index) => {
    if (index === 0) {
      //如果是第一列，则最后一行展示为“总计”两个字
      sums[index] = "合计";
    } else {
      let propList = ["stock_qty"];
      if (propList.includes(column.property)) {
        const values = data.map((item) => item[column.property as keyof Product]);
        if (!values.every((value) => Number.isNaN(value))) {
          let totalRes = values.reduce((prev, curr) => {
            const prevValue = Number(prev);
            const value = Number(curr);
            if (!Number.isNaN(value)) {
              return prevValue + value;
            } else {
              return prevValue;
            }
          }, 0);
          sums[index] = totalRes.toFixed(0);
        }
      } else {
        sums[index] = "";
      }
    }
  });
  return sums;
};
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getData();
};

async function getData() {
  tableLoading.value = true;
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    ...formData.value,
  };
  const result = await getProductSearchApi(data);
  tableLoading.value = false;
  tableData.value = result.data.list;
  pagination.total = result.data.total;
}

onActivated(() => {
  getFactoryCodeList();
  getData();
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        :showNumber="10"
        ref="plusFormRef"
        @reset="handleReset(plusFormRef?.plusFormInstance.formInstance)"
        @search="handleSearch"
      ></PlusSearch>
    </div>
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="prueTableRef"
            row-key="id"
            :data="tableData"
            :columns="dynamicColumns"
            :size="size"
            adaptive
            :adaptiveConfig="{ offsetBottom: 120 }"
            header-cell-class-name="table-row-header"
            :pagination="pagination"
            :paginationSmall="size === 'small' ? true : false"
            @page-size-change="getData()"
            @page-current-change="getData()"
            show-summary
            :summary-method="getSummaries"
            :loading="tableLoading"
          >
            <template #stock_type="{ row }">
              <span :style="`color: ${row.stock_type == 0 ? '#F59A23' : '#409eff'}`">
                {{ row.stock_type_name }}
              </span>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
