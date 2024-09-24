<script setup lang="ts">
import type { FormInstance, TableColumnCtx } from "element-plus";
import { isArray } from "@pureadmin/utils";
import { hiprint } from "vue-plugin-hiprint";
import { allotRecordExportApi, getAllotRecordApi } from "@/api/forms/allot-record";
import type { AllotRecordItemType } from "@/api/forms/allot-record/types";
import { formartDate } from "@/utils/validate";
import FormBtn from "@/components/FormBtn/index.vue";
import { useTable } from "@/hooks/table";
// 引入获取部门列表的hooks
import { deptListHooks } from "@/hooks";
import { useList } from "./hook";
import moban from "./moban.json";

defineOptions({
  name: "FormsAllotRecord",
});

hiprint.init();
const { departmentList } = deptListHooks();
const { startdownload } = useTable();
const { formData, searchColumns, columns, pagination } = useList();

const plusFormRef = ref();
const formRef = computed(() => {
  return plusFormRef.value.formInstance as FormInstance;
});
const tableData = ref<AllotRecordItemType[]>([]);
const selectTable = ref<AllotRecordItemType[]>([]);
const tableLoading = ref(false);
const ids = ref<number[]>([]);

interface Product {
  stock_qty: number;
  price: number;
  stock_price: number;
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
      let propList = ["rec_num"];
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
  let { out_time, ...rest } = formData.value;
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    out_time_start: isArray(out_time) ? out_time[0] : "",
    out_time_end: isArray(out_time) ? out_time[1] : "",
    ...rest,
  };
  tableLoading.value = true;
  const result = await getAllotRecordApi(data);
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

// 点击导出按钮
const handleCommand = (command: number) => {
  if (command === 2) {
    // 2是全部导出
    // let data = resolveFormData(true);
    let { out_time } = formData.value;
    let data = {
      page: pagination.currentPage,
      size: pagination.pageSize,
      out_time_start: isArray(out_time) ? out_time[0] : "",
      out_time_end: isArray(out_time) ? out_time[1] : "",
    };
    startdownload(allotRecordExportApi, data);
  } else {
    if (ids.value.length === 0) {
      return ElMessage.warning("请您至少勾选一条数据");
    }
    // 1是选择导出
    startdownload(allotRecordExportApi, { ids: ids.value });
  }
};

// 点击打印
const handlePrint = (command: number) => {
  let table = command === 1 ? resolveTable(tableData.value) : resolveTable(selectTable.value);

  if (table.length === 0) {
    let content = command === 1 ? "暂无可打印的数据" : "请您至少勾选一条数据";
    return ElMessage.warning(content);
  }
  let printData = {
    title: "调拨明细报表",
    table: table,
  };

  let hiprintTemplate = new hiprint.PrintTemplate({ template: moban });

  // 打印
  hiprintTemplate.print(
    printData,
    {},
    {
      callback: () => {
        console.log("浏览器打印窗口已打开");
      },
    },
  );
};
function resolveTable(tableData: AllotRecordItemType[]) {
  return tableData.map((item) => {
    item.in_time = formartDate(item.in_time);
    item.out_time = formartDate(item.out_time);
    return item;
  });
}

onActivated(() => {
  getData();
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <PlusSearch v-model="formData" :columns="searchColumns" :show-number="10" ref="plusFormRef">
        <template #plus-field-dept_id>
          <dept-select :department-list="departmentList" v-model="formData.dept_id"></dept-select>
        </template>
        <template #footer>
          <FormBtn
            @search="handleSearch"
            @reset="handleReset(plusFormRef?.plusFormInstance.formInstance)"
          ></FormBtn>
        </template>
      </PlusSearch>
    </div>
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <template #buttons>
          <el-dropdown trigger="click" @command="handleCommand" v-hasPerm="['allot:record:export']">
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
          <el-dropdown trigger="click" @command="handlePrint" class="ml-2">
            <el-button type="primary">
              <template #icon>
                <svg-icon icon-class="print" color="#ffffff" />
              </template>
              打印
              <el-icon class="el-icon--right"><i-ep-arrow-down></i-ep-arrow-down></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="1">打印本页数据</el-dropdown-item>
                <el-dropdown-item :command="2">打印选中数据</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
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
