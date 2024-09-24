<script setup lang="ts">
import { Refresh, Search } from "@element-plus/icons-vue";
import type { FormInstance, TableColumnCtx, TableInstance } from "element-plus";
import { hiprint } from "vue-plugin-hiprint";
import { statsReportApi, statsReportExportApi } from "@/api/forms/getsupplier-record";
import type { getsupplierRecordItem } from "@/api/forms/getsupplier-record/types";
import { perms } from "@/utils/auth";
import { formartDate } from "@/utils/validate";
import { useAdaptiveConfig, useTable } from "@/hooks/table";
import { deptListHooks } from "@/hooks";
import popoverSearch from "../components/popoverSearch.vue";
import { useList } from "./columns";
import moban from "./moban.json";

defineOptions({
  name: "FormsGetSupplierRecord",
});

hiprint.init();

const { departmentList } = deptListHooks();

const { adaptiveConfig, maxHeight } = useAdaptiveConfig();
const { startdownload } = useTable();
const { columns, defaultColumns, searchColumns } = useList();

type FormDataType = {
  rec_type?:number;
  keyword?: string;
  spec?: string;
  brand?: string;
  class_name?: string;
  dept_id?: number;
  warehouse_id?: number;
  page: number;
  size: number;
  barcode?: string;
  ph_no?: string;
  time: string;
  rp_uid?: number;
};

const formRef = ref();
/* 领料单明细表页面 */
const formData = ref<FormDataType>({
  rec_type: undefined,
  keyword: undefined, //
  spec: undefined, //规格
  brand: undefined, //品牌
  class_name: undefined, //所属分类
  dept_id: undefined,
  warehouse_id: undefined,
  barcode: undefined,
  ph_no: undefined,
  rp_uid: undefined,
  time: "",
  page: 1,
  size: 10,
});
const tableData = ref<getsupplierRecordItem[]>([]);
const selectTable = ref<getsupplierRecordItem[]>([]);
const tableLoading = ref(false);
const total = ref(0);
const ids = ref<number[]>([]);
const prueTableRef = ref();
const tableBarRef = ref();

const tableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});

const isShowMoney = computed(() => {
  let permsRes = perms(["getsupplier:record:price"]);
  console.log("permsRes", permsRes);
  return permsRes;
});

interface Product {
  rec_num: number;
  received_num: number;
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
      let propList = ["rec_num", "received_num"];
      if (propList.includes(column.property)) {
        const values = data.map((item) => item[column.property as keyof Product]);
        if (!values.every((value) => Number.isNaN(value))) {
          sums[index] = `${values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!Number.isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)}`;
        }
      } else {
        sums[index] = "";
      }
    }
  });

  return sums;
};

const getData = async () => {
  let data = resolveFormData();
  try {
    tableLoading.value = true;
    const result = await statsReportApi(data);

    total.value = result.data.total;
    const list = result.data.list;

    tableData.value = list;
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
  formData.value.barcode = undefined;
  formData.value.ph_no = undefined;
  formData.value.brand = undefined;
  formData.value.spec = undefined;
  ids.value = [];
  tableRef.value.clearSelection();
  getData();
};

type KeyType = "barcode" | "ph_no" | "brand" | "spec";

// 表格头部点击搜索
const clickHeaderSearch = (val: string, key: KeyType) => {
  formData.value[key] = val;
  getData();
};

// 表格头部点击重置
const clickHeaderClear = (key: KeyType) => {
  // formData.value[key] = undefined;
  formData.value[key] = undefined;
  getData();
};

// 分页触发事件
const handleQuery = () => {
  console.log("分页触发");
  getData();
};

// 点击导出按钮
const handleCommand = (command: number) => {
  console.log("command", command, typeof command);
  if (command === 2) {
    // 2是全部导出
    let data = resolveFormData(true);
    startdownload(statsReportExportApi, data);
  } else {
    if (ids.value.length === 0) {
      return ElMessage.warning("请您至少勾选一条数据");
    }
    // 1是选择导出
    startdownload(statsReportExportApi, { ids: ids.value });
  }
};

function resolveFormData(type = false) {
  // let { time, page, size, ...rest } = formData.value;
  let { time, page, size, ...rest } = formData.value;
  let start_out_time = time ? time[0] : undefined;
  let end_out_time = time ? time[1] : undefined;

  if (type) {
    return {
      start_out_time,
      end_out_time,
      ...rest,
    };
  } else {
    return {
      start_out_time,
      end_out_time,
      page,
      size,
      ...rest,
    };
  }
}

// 勾选触发事件
function changeSelect(selection: getsupplierRecordItem[]) {
  console.log("selection", selection);
  selectTable.value = selection;
  ids.value = selection.map((item) => {
    return item.id;
  });
  console.log("ids.value", ids.value);
}

// 点击打印
const handlePrint = (command: number) => {
  let table = command === 1 ? resolveTable(tableData.value) : resolveTable(selectTable.value);
  if (table.length === 0) {
    let content = command === 1 ? "暂无可打印的数据" : "请您至少勾选一条数据";
    return ElMessage.warning(content);
  }
  let printData = {
    title: "领料单明细报表",
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

function resolveTable(tableData: getsupplierRecordItem[]) {
  return tableData.map((item) => {
    item.out_time = formartDate(item.out_time);
    return item;
  });
}

onActivated(() => {
  getData();
  prueTableRef.value?.setAdaptive()
  //   getWarehouse();
});
</script>
<template>
  <div class="app-container">
    <div class="search-card !pr-[20px] !pb-4">
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        :showNumber="10"
        :colProps="{ span: 6 }"
        ref="formRef"
      >
        <template #plus-field-dept_id>
          <dept-select :department-list="departmentList" v-model="formData.dept_id"></dept-select>
        </template>
        <template #footer>
          <!-- <template #footer> -->
          <div style="display: flex">
            <el-button type="primary" :icon="Search" @click="handleSearch" v-deBounce>
              搜索
            </el-button>
            <el-button :icon="Refresh" @click="handleReset(formRef?.plusFormInstance.formInstance)">
              重置
            </el-button>
          </div>
        </template>
      </PlusSearch>
    </div>
    <div class="app-card">
      <pure-table-bar
        :columns="isShowMoney ? columns : defaultColumns"
        @refresh="handleSearch"
        ref="tableBarRef"
      >
        <template #buttons>
          <el-dropdown
            trigger="click"
            @command="handleCommand"
            v-hasPerm="['getsupplier:record:export']"
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
              <!-- <template #icon>
                <svg-icon icon-class="print" color="#409EFF"></svg-icon>
              </template> -->
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
            border
            header-cell-class-name="table-row-header"
            :data="tableData"
            :columns="dynamicColumns"
            :loading="tableLoading"
            :size="size"
            row-key="id"
            :adaptive="true"
            :adaptiveConfig="adaptiveConfig"
            @selection-change="changeSelect"
            show-summary
            :summary-method="getSummaries"
          >
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

            <template #barcode>
              <popoverSearch
                title="货品条码"
                :value="formData.barcode"
                @confirm="clickHeaderSearch($event, 'barcode')"
                @clear="clickHeaderClear('barcode')"
              ></popoverSearch>
            </template>
            <template #ph_no>
              <popoverSearch
                title="批次/日期"
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
<style lang="scss" scoped></style>
