<script setup lang="ts">
import type { FormInstance, TableColumnCtx } from "element-plus";
import { getRetstockReportApi } from "@/api/forms/retstock-report";
import type { ListType } from "@/api/forms/retstock-report/types";
import { useList } from "./hook";

defineOptions({
  name: "FormsRetstockReport",
});

const { formData, searchColumns, columns, pagination } = useList();

const plusFormRef = ref();
const formRef = computed(() => {
  return plusFormRef.value.formInstance as FormInstance;
});
const tableData = ref<ListType[]>([]);
const selectTable = ref<ListType[]>([]);
const tableLoading = ref(false);
const ids = ref<number[]>([]);

interface Product {
  stock_qty: number;
}

interface SummaryMethodProps<T = Product> {
  columns: TableColumnCtx<T>[];
  data: T[];
}

const getSummaries = (param: SummaryMethodProps) => {
  const { columns, data } = param;
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
          sums[index] = totalRes.toFixed(3);
        }
      } else {
        sums[index] = "";
      }
    }
  });

  return sums;
};

// 点击搜索
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
  let data = {
    ...formData.value,
  };
  tableLoading.value = true;
  const result = await getRetstockReportApi(data);
  tableData.value = result.data.list;
  pagination.total = result.data.total;
  tableLoading.value = false;
}

// 勾选触发事件
function changeSelect(selection: any[]) {
  console.log("selection", selection);
  selectTable.value = selection;
  ids.value = selection.map((item) => {
    return item.id;
  });
  console.log("ids.value", ids.value);
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
        :show-number="10"
        ref="plusFormRef"
        @reset="handleReset(plusFormRef?.plusFormInstance.formInstance)"
        @search="handleSearch"
      >
        <!-- <template #footer>
          <FormBtn
            @search="handleSearch"
            @reset="handleReset(plusFormRef?.plusFormInstance.formInstance)"
          ></FormBtn>
        </template> -->
      </PlusSearch>
    </div>
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <!-- <template #buttons>
          <el-dropdown trigger="click" @command="handleCommand">
            <el-button type="primary">
              数据导出
              <el-icon class="el-icon--right"><i-ep-arrow-down></i-ep-arrow-down></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="1">导出选中数据</el-dropdown-item>
                <el-dropdown-item :command="2">导出列表数据</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template> -->
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            row-key="id"
            stripe
            header-cell-class-name="table-row-header"
            :data="tableData"
            :columns="dynamicColumns"
            :loading="tableLoading"
            :size="size"
            adaptive
            :adaptiveConfig="{ offsetBottom: 120 }"
            :pagination="pagination"
            :paginationSmall="size === 'small' ? true : false"
            @page-size-change="getData()"
            @page-current-change="getData()"
            @selection-change="changeSelect"
            show-summary
            :summary-method="getSummaries"
          ></pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
