<script setup lang="ts">
import type { FormInstance, TableInstance } from "element-plus";
import { hiprint } from "vue-plugin-hiprint";
// 引入api
import { getExportRecordApi, getInoutRecordApi } from "@/api/forms/inout-record";
import type { ISearchQuery, InoutObjType } from "@/api/forms/inout-record/types";
import PureTableBar from "@/components/PureTableBar/index.vue";
import { useAdaptiveConfig, useCellOmit, useTable } from "@/hooks/table";
// 引入获取仓库列表的hooks
import { storageListHooks } from "@/hooks";
import popoverSearch from "../components/popoverSearch.vue";
import { useList } from "./columns";
import moban from "./moban.json";

defineOptions({
  name: "FormsInoutRecord",
});

const { handleCellEnter, handleCellLeave, handleCellClass } = useCellOmit();
const { startdownload } = useTable();
const { adaptiveConfig, maxHeight } = useAdaptiveConfig();
const {
  columns,
  // typeList,
  formData,
  total,
  tableLoading,
  tableData,
  formRef,
  ids,
  prueTableRef,
  selectTable,
  getTransactionType,
  searchColumns,
} = useList();
const { storageList } = storageListHooks();

const tableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});

const getData = async () => {
  let data = resolveFormData();
  try {
    tableLoading.value = true;
    const result = await getInoutRecordApi(data as ISearchQuery);
    tableData.value = result.data.data;
    total.value = result.data.total;
  } finally {
    tableLoading.value = false;
  }
};

function resolveFormData(type = false) {
  let { time, page, size, ...rest } = formData.value;
  let start_time = time ? time[0] : "";
  let end_time = time ? time[1] + " 23:59:59" : "";
  if (!type) {
    return {
      start_time,
      end_time,
      page,
      size,
      ...rest,
    };
  } else {
    return {
      start_time,
      end_time,
      ...rest,
    };
  }
}

// 点击查询
const handleSearch = () => {
  formData.value.page = 1;
  getData();
};
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  ids.value = [];
  tableRef.value.clearSelection();
  formData.value.barcode = undefined;
  formData.value.spec = undefined;
  getData();
};

// 表格头部点击搜索
const clickHeaderSearch = (val: string, key: "barcode" | "spec") => {
  formData.value[key] = val;
  getData();
};

// 表格头部点击重置
const clickHeaderClear = (key: "barcode" | "spec") => {
  // formData.value[key] = undefined;
  formData.value[key] = undefined;
  getData();
};

// 分页触发事件
const handleQuery = () => {
  getData();
};

// 点击导出按钮
const handleCommand = (command: number) => {
  console.log("command", command, typeof command);
  if (command === 2) {
    // 2是全部导出
    let data = resolveFormData(true);
    startdownload(getExportRecordApi, data);
  } else {
    if (ids.value.length === 0) {
      return ElMessage.warning("请您至少勾选一条数据");
    }
    // 1是选择导出
    startdownload(getExportRecordApi, { ids: ids.value });
  }
};

// 勾选触发事件
function changeSelect(selection: InoutObjType[]) {
  selectTable.value = selection;
  ids.value = selection.map((item) => {
    return item.id;
  });
  console.log("selectData.value", ids.value);
}

// 点击打印
const handlePrint = (command: number) => {
  let table = command === 1 ? tableData.value : selectTable.value;
  let newTable = table.map((item) => {
    return {
      document_num: item.document_num,
      transaction_date: item.transaction_date,
      document_type: getTransactionType(item.document_type, item.type),
      warehouse_name: item.warehouse.name,
      barcode: item.goods.barcode,
      title: item.goods.title,
      spec: item.goods.spec,
      measure_name: item.goods.measure_name,
      batch_number: item.batch_number,
      transaction_quantity:
        item.transaction_type === 1 ? item.transaction_quantity : `-${item.transaction_quantity}`,
      balance_quantity: item.balance_quantity,
    };
  });

  if (table.length === 0) {
    let content = command === 1 ? "暂无可打印的数据" : "请您至少勾选一条数据";
    return ElMessage.warning(content);
  }
  let printData = {
    title: "出入库明细报表",
    table: newTable,
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

onActivated(() => {
  getData();
});
</script>
<template>
  <div class="app-container">
    <!-- 出入库明细页面 -->
    <div class="search-card !pr-4 !pb-4">
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        :showNumber="10"
        :colProps="{ span: 4 }"
        ref="formRef"
      >
        <template #footer>
          <!-- <template #footer> -->
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
          <el-dropdown trigger="click" @command="handleCommand" v-hasPerm="['inout:record:export']">
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
            ref="prueTableRef"
            stripe
            border
            header-cell-class-name="table-row-header"
            :data="tableData"
            :columns="dynamicColumns"
            :loading="tableLoading"
            :size="size"
            :max-height="maxHeight"
            row-key="id"
            :adaptive="true"
            :adaptiveConfig="adaptiveConfig"
            @cell-mouse-enter="handleCellEnter"
            @cell-mouse-leave="handleCellLeave"
            @selection-change="changeSelect"
          >
            <template #barcode>
              <popoverSearch
                title="货品条码"
                :value="formData.barcode"
                @confirm="clickHeaderSearch($event, 'barcode')"
                @clear="clickHeaderClear('barcode')"
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
<style>
/* @page {
  size: auto !important;
} */
</style>
<style lang="scss" scoped>
:deep(.el-table td.cell-overflow > .cell) {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
