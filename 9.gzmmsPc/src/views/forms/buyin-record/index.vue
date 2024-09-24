<script setup lang="ts">
import { Refresh, Search } from "@element-plus/icons-vue";
import type { FormInstance, TableColumnCtx, TableInstance } from "element-plus";
import { hiprint } from "vue-plugin-hiprint";
import { BuyinRecordExportApi, getBuyinRecordApi } from "@/api/forms/buyin-record";
import type { BuyinRecordForm, BuyinRecordList } from "@/api/forms/buyin-record/types";
import { formartDate } from "@/utils/validate";
import PureTableBar from "@/components/PureTableBar/index.vue";
import { useAdaptiveConfig, useCellOmit, useTable } from "@/hooks/table";
import { deptListHooks } from "@/hooks";
import popoverSearch from "../components/popoverSearch.vue";
import { useList } from "./columns";
import moban from "./moban.json";

defineOptions({
  name: "FormsBuyinRecord",
});

hiprint.init();

const { departmentList } = deptListHooks();
const { handleCellEnter, handleCellLeave, handleCellClass } = useCellOmit({
  editProp: ["title", "spec"],
  type: 1,
});
const { startdownload } = useTable();

const { adaptiveConfig, maxHeight } = useAdaptiveConfig();
const { columns, searchColumns } = useList();

const formData = ref<BuyinRecordForm>({
  keyword: "",
  procure_no: undefined,
  barcode: undefined,
  goods_name: undefined,
  spec: undefined,
  brand: undefined,
  sup_name: undefined,
  ph_no: undefined,
  class_name: undefined,
  in_wh_id: [],
  dept_id: [],
  time: undefined,
  page: 1,
  size: 10,
});

const tableData = ref<BuyinRecordList[]>([]);
const selectTable = ref<BuyinRecordList[]>([]);
const ids = ref<number[]>([]);
const formRef = ref();
const prueTableRef = ref();
const tableLoading = ref(false);
const total = ref(0);

const resetStatus = ref(false);

const tableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});

interface Product {
  in_num: number;
  price: string;
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
      let propList = ["in_num"];
      if (propList.includes(column.property)) {
        const values = data.map((item) => item[column.property as keyof Product]);
        if (!values.every((value) => Number.isNaN(value))) {
          let total = `${values.reduce((prev, curr) => {
            const currValue = Number(curr);
            const prevValue = Number(prev);
            if (!Number.isNaN(currValue)) {
              // return prev + curr;
              return prevValue + currValue;
            } else {
              return prev;
            }
          }, 0)}`;
          if (column.property == "price") {
            sums[index] = Number(total).toFixed(2);
          } else {
            sums[index] = total;
          }
        }
      } else {
        sums[index] = "";
      }
    }
  });

  return sums;
};

const getData = async () => {
  let { time, ...rest } = formData.value;

  let data = {
    in_start_time: time ? time[0] : undefined,
    in_end_time: time ? time[1] : undefined,
    ...rest,
  };
  try {
    tableLoading.value = true;
    const result = await getBuyinRecordApi(data);
    tableData.value = result.data.list;
    if (formData.value.page == 1) {
      total.value = result.data.total;
    }
  } finally {
    tableLoading.value = false;
  }
};

// 点击查询
const handleSearch = () => {
  formData.value.page = 1;
  getData();
};
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  resetHeaderValue();
  ids.value = [];
  tableRef.value.clearSelection();
  resetStatus.value = true;
  getData();
};

function resetHeaderValue() {
  formData.value.procure_no = undefined;
  formData.value.barcode = undefined;
  formData.value.goods_name = undefined;
  formData.value.spec = undefined;
  formData.value.brand = undefined;
  formData.value.sup_name = undefined;
  formData.value.ph_no = undefined;
}

// 点击导出按钮
const handleCommand = (command: number) => {
  console.log("command", command, typeof command);
  if (command === 2) {
    let { time, page, size, ...rest } = formData.value;
    // 2是全部导出
    let data = {
      in_start_time: time ? time[0] : undefined,
      in_end_time: time ? time[1] : undefined,
      ...rest,
    };
    // startdownload(data);
    startdownload(BuyinRecordExportApi, data);
  } else {
    if (ids.value.length === 0) {
      return ElMessage.warning("请您至少勾选一条数据");
    }
    // 1是选择导出
    startdownload(BuyinRecordExportApi, { ids: ids.value });
  }
};

// 勾选触发事件
function changeSelect(selection: BuyinRecordList[]) {
  selectTable.value = selection;
  ids.value = selection.map((item) => {
    return item.id;
  });
}

// 点击打印
const handlePrint = (command: number) => {
  let table = command === 1 ? resolveTable(tableData.value) : resolveTable(selectTable.value);
  if (table.length === 0) {
    let content = command === 1 ? "暂无可打印的数据" : "请您至少勾选一条数据";
    return ElMessage.warning(content);
  }
  let printData = {
    title: "采购入库单明细报表",
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
function resolveTable(tableData: BuyinRecordList[]) {
  return tableData.map((item) => {
    item.in_time = formartDate(item.in_time);
    return item;
  });
}

//分页触发事件
const handleQuery = () => {
  getData();
};

// 表格头部点击搜索
const clickHeaderSearch = (val: string, key: keyof BuyinRecordForm) => {
  console.log("val", val);
  console.log("key", key);
  (formData.value[key] as BuyinRecordForm[keyof BuyinRecordForm]) = val;
  getData();
};

// 表格头部点击重置
const clickHeaderClear = (key: keyof BuyinRecordForm) => {
  // formData.value[key] = undefined;
  (formData.value[key] as BuyinRecordForm[keyof BuyinRecordForm]) = undefined;
  getData();
};

onActivated(() => {
  getData();
  prueTableRef.value?.setAdaptive();
});
</script>
<template>
  <div class="app-container">
    <div class="search-card !pr-4 !pb-4">
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        :showNumber="10"
        :colProps="{ span: 4 }"
        ref="formRef"
      >
        <template #plus-field-dept_id>
          <dept-select
            :department-list="departmentList"
            v-model="formData.dept_id"
            :multiple="true"
          ></dept-select>
        </template>
        <template #footer>
          <div style="display: flex">
            <el-button type="primary" @click="handleSearch" v-deBounce>
              <template #icon>
                <i-ep-search></i-ep-search>
              </template>
              搜索
            </el-button>
            <el-button @click="handleReset(formRef?.plusFormInstance.formInstance)">
              <template #icon>
                <i-ep-Refresh></i-ep-Refresh>
              </template>
              重置
            </el-button>
          </div>
        </template>
      </PlusSearch>
    </div>
    <div class="app-card">
      <pure-table-bar :columns="columns" @refresh="handleSearch">
        <template #buttons>
          <div class="flex">
            <el-dropdown
              trigger="click"
              @command="handleCommand"
              v-hasPerm="['buyin:record:export']"
            >
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
          </div>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="prueTableRef"
            row-key="id"
            border
            stripe
            header-cell-class-name="table-row-header"
            :data="tableData"
            :columns="dynamicColumns"
            :loading="tableLoading"
            :size="size"
            adaptive
            :adaptiveConfig="adaptiveConfig"
            :cell-class-name="handleCellClass"
            @cell-mouse-enter="handleCellEnter"
            @cell-mouse-leave="handleCellLeave"
            @selection-change="changeSelect"
            show-summary
            :summary-method="getSummaries"
          >
            <template #procure_no>
              <popoverSearch
                title="采购单号"
                :value="formData.procure_no"
                @confirm="clickHeaderSearch($event, 'procure_no')"
                @clear="clickHeaderClear('procure_no')"
              ></popoverSearch>
            </template>
            <template #barcode>
              <popoverSearch
                title="货品条码"
                :value="formData.barcode"
                @confirm="clickHeaderSearch($event, 'barcode')"
                @clear="clickHeaderClear('barcode')"
              ></popoverSearch>
            </template>
            <template #title>
              <popoverSearch
                title="名称"
                :value="formData.goods_name"
                @confirm="clickHeaderSearch($event, 'goods_name')"
                @clear="clickHeaderClear('goods_name')"
              ></popoverSearch>
            </template>
            <template #spec>
              <popoverSearch
                title="规格型号"
                :value="formData.spec"
                @confirm="clickHeaderSearch($event, 'spec')"
                @clear="clickHeaderClear('spec')"
              ></popoverSearch>
            </template>
            <template #brand>
              <popoverSearch
                title="品牌"
                :value="formData.brand"
                @confirm="clickHeaderSearch($event, 'brand')"
                @clear="clickHeaderClear('brand')"
              ></popoverSearch>
            </template>
            <template #sup_name>
              <popoverSearch
                title="供应商"
                :value="formData.sup_name"
                @confirm="clickHeaderSearch($event, 'sup_name')"
                @clear="clickHeaderClear('sup_name')"
              ></popoverSearch>
            </template>
            <template #ph_no>
              <popoverSearch
                title="批次日期"
                :value="formData.ph_no"
                @confirm="clickHeaderSearch($event, 'ph_no')"
                @clear="clickHeaderClear('ph_no')"
              ></popoverSearch>
            </template>
          </pure-table>
        </template>
      </pure-table-bar>
      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="formData.page"
        v-model:limit="formData.size"
        @pagination="handleQuery"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-table td.cell-overflow > .cell) {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
