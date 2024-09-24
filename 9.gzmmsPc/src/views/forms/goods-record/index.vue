<script setup lang="ts">
/* 货品库存明细页面 */
// 引入获取仓库列表的hooks
import type { FormInstance, TableColumnCtx, TableInstance } from "element-plus";
import { useRoute } from "vue-router";
import {
  generateStocksLabelApi,
  getGoodsRecordApi,
  getStocksLabelApi,
  goodsRecordExportApi,
} from "@/api/forms/goods-record";
import type { GoodsRecordList } from "@/api/forms/goods-record/types";
import { perms } from "@/utils/auth";
import { useAdaptiveConfig, useCellOmit, useTable } from "@/hooks/table";
import { storageListHooks } from "@/hooks";
import { useList } from "./columns";
import type { formType } from "./columns";
import LookLabelVue from "./components/lookLabel.vue";
import storageLocation from "./components/storageLocation.vue";

defineOptions({
  name: "FormsGoodsRecord",
});

const route = useRoute();
const { storageList } = storageListHooks();
const { defaultColumns, columns, searchColumns } = useList();
const { handleCellEnter, handleCellLeave, handleCellClass } = useCellOmit({
  editProp: ["title", "spec"],
  type: 1,
});
const { adaptiveConfig, maxHeight } = useAdaptiveConfig();
const { startdownload } = useTable();

const formData = ref<formType>({
  ws_code: "",
  class_name: undefined,
  warehouse_id: undefined,
  time: undefined,
  keyword: "",
  page: 1,
  size: 10,
  is_all: 0,
  is_get_exp_stock: 0,
});

const stockOptions = [
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
];

const total = ref(0);
const prueTableRef = ref();
const ids = ref<number[]>([]);
const formRef = ref();
const tableLoading = ref(false);
const tableData = ref<GoodsRecordList[]>([]);
const ws_code = ref<string>(); // 库位value
const dialogShow = ref(false); // 设置库位弹窗
const labelVisible = ref(false); //查看货品标签弹窗
const row_id = ref(0);

const tableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});

const isShowMoney = computed(() => {
  let permsRes = perms(["goods:record:money"]);
  console.log("permsRes", permsRes);
  return permsRes;
});

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
      let propList = ["stock_qty", "stock_price"];
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
          if (column.property === "stock_price") {
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

async function getData() {
  let { time, is_get_exp_stock, ...rest } = formData.value;

  let data = {
    in_start_time: time ? time[0] : undefined,
    in_end_time: time ? time[1] : undefined,
    is_get_exp_stock:
      typeof formData.value.is_get_exp_stock === "string" ? 0 : formData.value.is_get_exp_stock,
    ...rest,
  };
  try {
    tableLoading.value = true;
    const result = await getGoodsRecordApi(data);
    tableData.value = result.data.list;
    if (formData.value.page == 1) {
      total.value = result.data.total;
    }
  } finally {
    tableLoading.value = false;
  }
}

// 点击查询
const handleSearch = () => {
  formData.value.page = 1;
  getData();
};

// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  console.log("🚀 ~ handleReset ~ formEl:", formEl);

  if (!formEl) return;
  formEl.resetFields();
  formData.value.is_get_exp_stock = 0;
  ids.value = [];
  tableRef.value.clearSelection();
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
    let { time, page, size, ...rest } = formData.value;
    // 2是全部导出
    let data = {
      start_time: time ? time[0] : undefined,
      end_time: time ? time[1] : undefined,
      ...rest,
    };
    startdownload(goodsRecordExportApi, data);
  } else {
    if (ids.value.length === 0) {
      return ElMessage.warning("请您至少勾选一条数据");
    }
    // 1是选择导出
    startdownload(goodsRecordExportApi, { ids: ids.value });
  }
};

// 勾选触发事件
function changeSelect(selection: any[]) {
  ids.value = selection.map((item) => {
    return item.id;
  });
  console.log("selectData.value", ids.value);
}

// 点击设置库位
function setLocation() {
  if (!ids.value.length) {
    ElMessage.warning("请选勾选商品");
    return;
  }
  dialogShow.value = true;
}

// 点击查看标签
async function lookLabel(id: number) {
  row_id.value = id;
  labelVisible.value = true;
}

async function handleLabel(id: number, stock_qty: number) {
  const confirmRes = await ElMessageBox.confirm(
    `当前库存数量 ${stock_qty}</br>生成标签数量  <span class="text-orange-500">${stock_qty}</span>`,
    "确认生成唯一标识",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      dangerouslyUseHTMLString: true,
      closeOnClickModal: false,
    },
  ).catch((err) => {
    console.log("err", "点击取消");
  });
  if (confirmRes) {
    const result = await generateStocksLabelApi({ stock_id: id });
    ElMessage.success(result.msg);
    getData();
  }
}

onActivated(() => {
  if (route.query.type) {
    formData.value.is_get_exp_stock = 1;
  }
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
        :colProps="{ span: 6 }"
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
      <pure-table-bar :columns="isShowMoney ? columns : defaultColumns" @refresh="handleSearch">
        <template #buttons>
          <el-dropdown trigger="click" @command="handleCommand" v-hasPerm="['goods:record:export']">
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
          <el-button
            type="primary"
            class="ml-2"
            @click="setLocation"
            v-hasPerm="['goods:record:setwscode']"
          >
            库位设置
          </el-button>
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
            :cell-class-name="handleCellClass"
            @cell-mouse-enter="handleCellEnter"
            @cell-mouse-leave="handleCellLeave"
            @selection-change="changeSelect"
            show-summary
            :summary-method="getSummaries"
          >
            <template #operation="{ row }">
              <el-button type="primary" size="small" link @click="lookLabel(row.id)">
                查看标签
              </el-button>
              <el-button
                type="primary"
                size="small"
                link
                @click="handleLabel(row.id, row.stock_qty)"
                v-if="!row.is_have_unique"
              >
                生成唯一标签
              </el-button>
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
    <storageLocation
      v-model:title="ws_code"
      v-model:dialog-visible="dialogShow"
      :ids="ids"
      @update="getData"
    ></storageLocation>
    <LookLabelVue v-model:dialog-visible="labelVisible" :stock_id="row_id"></LookLabelVue>
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
