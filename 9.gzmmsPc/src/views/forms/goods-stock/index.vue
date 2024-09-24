<script setup lang="ts">
/* 本组件是货品库存总表-列表页面 */
import { Refresh, Search } from "@element-plus/icons-vue";
import type { FormInstance, TableColumnCtx, TableInstance } from "element-plus";
import { useRoute } from "vue-router";
import { ICateItem } from "@/api/common/types";
import { getStockApi, getWarehouseApi } from "@/api/forms";
import { IStockData } from "@/api/forms/types";
import { perms } from "@/utils/auth";
import { formartDate } from "@/utils/validate";
import PureTableBar from "@/components/PureTableBar/index.vue";
import { useAdaptiveConfig, useCellOmit } from "@/hooks/table";
// 引入获取商品分类的hooks
import { goodsCateListHooks } from "@/hooks";
import popoverSearch from "../components/popoverSearch.vue";
import { useList } from "./columns";
import orderWarning from "./components/orderWarning.vue";
import stockWarning from "./components/stockWarning.vue";

defineOptions({
  name: "FormsGoodsStock",
});

const route = useRoute();
const { handleCellEnter, handleCellLeave, handleCellClass } = useCellOmit();
const { adaptiveConfig } = useAdaptiveConfig();
const { defaultColumns, columns, searchColumns } = useList();

type UStringType = undefined | string;

const state = reactive({
  formData: {
    warehouse_id: undefined as FormNumType, //仓库id
    class_name: undefined as FormNumType, //分类类别
    title: undefined as UStringType, //货品名称
    spec: undefined as UStringType,
    brand: undefined as UStringType,
    is_all: 0,
    page: 1,
    size: 10,
    type: undefined as FormNumType,
  },
  stockOptions: [
    {
      label: "大于0",
      value: 0,
    },
    {
      label: "全部",
      value: 1,
    },
    {
      label: "等于0",
      value: 2,
    },
  ],
  typeOptions: [
    {
      label: "全部",
      value: 0,
    },
    {
      label: "库存预警",
      value: 1,
    },
    {
      label: "订货预警",
      value: 2,
    },
  ],
  selectStorage: [] as ICateItem[],
  tableData: [] as IStockData[],
  tableLoading: false,
  total: 0,
  search_status: false,
});
const { formData, tableData, tableLoading, total, selectStorage, stockOptions, typeOptions } =
  toRefs(state);
const formRef = ref();
const ids = ref<number[]>([]);
const tableRef = ref();
const stockWarningShow = ref(false); //库存预警弹窗开关
const orderWarningShow = ref(false); //订货预警弹窗开关

// 勾选触发事件
function changeSelect(selection: IStockData[]) {
  ids.value = selection.map((item) => {
    return item.id;
  });
  console.log("ids.value", ids.value);
}

interface Product {
  stock: number;
}

interface SummaryMethodProps<T = Product> {
  columns: TableColumnCtx<T>[];
  data: T[];
}

const getSummaries = (param: SummaryMethodProps) => {
  const { columns, data } = param;
  const len = columns.length;
  const sums: string[] = [];
  columns.forEach((column, index) => {
    if (index === 0) {
      //如果是第一列，则最后一行展示为“总计”两个字
      sums[index] = "合计";
    } else {
      let propList = ["stock", "total_stock_price"];
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
          if (column.property === "total_stock_price") {
            sums[index] = totalRes.toFixed(3);
          } else {
            sums[index] = totalRes.toFixed(0);
          }
        }
      } else {
        sums[index] = "";
      }
    }
  });

  return sums;
};

function getRowClass(row: any) {
  if (row.row.detail?.length === 0) {
    return "row-expand-cover";
  }

  return "row-expand-cursor";
}

function handleRowClick(row: any) {
  if (row.children?.length === 0) return;
  let tableProxy = tableRef.value.getTableRef();
  tableProxy.toggleRowExpansion(row);
}

const isShowMoney = computed(() => {
  let permsRes = perms(["goods:stock:money"]);
  console.log("permsRes", permsRes);
  return permsRes;
});

const getData = async () => {
  // let data = {
  //   page: formData.value.page,
  //   size: formData.value.size,
  //   warehouse_id: Number(formData.value.warehouse_id) || undefined,
  //   class_name: formData.value.class_name || undefined,
  //   title: formData.value.title || undefined,
  // };
  let data = toRaw(formData.value);

  try {
    tableLoading.value = true;
    const result = await getStockApi(data);
    // console.log("result", result);
    total.value = result.data.total;
    const list = result.data.data;
    // console.log("list", list);
    tableData.value = list;
  } finally {
    tableLoading.value = false;
  }
};

const getWarehouse = async () => {
  const result = await getWarehouseApi();

  selectStorage.value = result.data;
};

// 分页触发事件
const handleQuery = () => {
  console.log("分页触发");
  getData();
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
  formData.value.type = undefined;
  getData();
};

// 表格头部点击搜索
const clickHeaderSearch = (val: string, key: "brand" | "spec") => {
  formData.value[key] = val;
  getData();
};

// 表格头部点击重置
const clickHeaderClear = (key: "brand" | "spec") => {
  // formData.value[key] = undefined;
  formData.value[key] = undefined;
  getData();
};

const setStockWarning = () => {
  if (ids.value.length === 0) {
    ElMessage.warning("请先勾选货品");
    return;
  }
  stockWarningShow.value = true;
};

const setOrderWarning = () => {
  if (ids.value.length === 0) {
    ElMessage.warning("请先勾选货品");
    return;
  }
  orderWarningShow.value = true;
};

onActivated(() => {
  if (route.query.type) {
    formData.value.type = Number(route.query.type);
  }
  getData();
  getWarehouse();
  // setAdaptive
  // console.log("tableRef",tableRef.value.setAdaptive())
  tableRef.value?.setAdaptive();
});
</script>
<template>
  <div class="app-container">
    <!-- 货品库存页面 -->
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
      <pure-table-bar :columns="isShowMoney ? columns : defaultColumns" @refresh="handleSearch">
        <template #buttons="scope">
          <el-button type="primary" @click="setStockWarning">库存预警</el-button>
          <el-button type="primary" @click="setOrderWarning">订货预警</el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="tableRef"
            border
            header-cell-class-name="table-row-header"
            :data="tableData"
            :columns="dynamicColumns"
            :loading="tableLoading"
            :size="size"
            row-key="id"
            :row-class-name="getRowClass"
            @row-click="handleRowClick"
             :cell-class-name="handleCellClass"
            @cell-mouse-enter="handleCellEnter"
            @cell-mouse-leave="handleCellLeave"
            :adaptive="true"
            :adaptiveConfig="adaptiveConfig"
            show-summary
            :summary-method="getSummaries"
            @selection-change="changeSelect"
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
            <template #expand="{ row, $index }">
              <el-table
                :data="row.details"
                border
                header-cell-class-name="table-row-header-ectype"
                row-class-name="table-row-header-ectype"
              >
                <el-table-column label="条码" prop="barcode" align="center" />
                <el-table-column label="名称" prop="title" align="center" />
                <el-table-column label="品牌" prop="brand" align="center" />
                <el-table-column label="批次/日期" prop="batch_number" align="center">
                  <template #default="{ row, $index }">
                    <span>{{ row.batch_number || "-" }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="可用库存" prop="quantity" align="center" />
                <el-table-column label="单价" prop="price" align="center" />
                <el-table-column
                  label="库存金额"
                  prop="stock_price"
                  align="center"
                  v-hasPerm="['goods:stock:money']"
                />
                <el-table-column label="供应商" prop="sup_name" align="center" />
                <el-table-column label="库位" prop="ws_code" align="center" />
                <el-table-column label="入库日期" prop="in_wh_date" align="center" />
                <el-table-column label="生产日期" prop="pro_time" align="center" />
                <el-table-column label="保质期(天)" prop="exp_day" align="center" />
                <el-table-column label="保质期预警(天)" prop="exp_warning_day" align="center" />
                <el-table-column label="到期日期" prop="exp_time" align="center">
                  <template #default="{ row }">
                    <span :class="[row.is_exp_warning ? 'text-red-500' : '']">
                      {{ formartDate(row.exp_time) }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="采购单号" prop="procure_no" align="center" />
                <el-table-column label="入库单号" prop="in_wh_no" align="center" />
              </el-table>
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
    <stockWarning
      v-model:dialog-visible="stockWarningShow"
      :ids="ids"
      @update="getData"
    ></stockWarning>
    <orderWarning
      v-model:dialog-visible="orderWarningShow"
      :ids="ids"
      @update="getData"
    ></orderWarning>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-table .row-expand-cover .cell .el-table__expand-icon) {
  display: none;
}
:deep(.row-expand-cursor) {
  cursor: pointer;
}

:deep(.el-table td.cell-overflow > .cell) {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
