<script setup lang="tsx">
import type { TableColumnCtx } from "element-plus";
import pureTable from "@pureadmin/table";
import { productInDetailApi } from "@/api/product-stock/product-in";
import type { ProductInGoodsType } from "@/api/product-stock/product-in/types";
// 导入查看文件组件
import LookFileVue from "@/components/LookFile/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCellOmit } from "@/hooks/table";
import { useList } from "../utils/hook";
// import { useAdd } from "./add";
import type { TableColumns } from "@pureadmin/table";

const props = defineProps(["listId", "in_type"]);
const model = defineModel("visible", { required: true, default: false });

const { handleCellEnter, handleCellLeave, handleCellClass } = useCellOmit({
  editProp: ["title", "box_serial_number", "ws_code_name_str", "ws_code"],
  type: 1,
});
const { getStatusName, getStockTypeName, getStatusTagType } = useList();
// const { inColumns } = useAdd();
const inColumns: TableColumnList = [
  {
    label: "序号",
    type: "index",
    width: 60,
    align: "center",
  },
  {
    label: "操作",
    align: "center",
    slot: "operation",
    width: 120,
  },
  {
    label: "物料编码",
    prop: "barcode",
    align: "center",
  },

  {
    label: "物料名称",
    prop: "title",
    align: "center",
    minWidth: 110,
  },
  {
    label: "入库数量",
    prop: "in_num",
    align: "center",
    width: 90,
  },
  {
    label: "单位",
    prop: "measure_name",
    align: "center",
    width: 60,
  },
  {
    label: "箱序列号",
    prop: "box_serial_number",
    align: "center",
    minWidth: 110,
  },
  {
    label: "生产批次",
    prop: "pro_ph_no",
    align: "center",
    minWidth: 140,
  },
  {
    label: "成品批次",
    prop: "batch_no_str",
    align: "center",
    minWidth: 120
  },
  {
    label: "库位名称",
    prop: "ws_code_name_str",
    align: "center",
    width: 90,
  },
  {
    label: "库位编码",
    prop: "ws_code",
    align: "center",
    width: 90,
  },
  {
    label: "库存地点",
    prop: "site",
    align: "center",
    width: 90,
  },
  {
    label: "库存类型",
    prop: "note",
    align: "center",
    cellRenderer: ({ row }) => {
      return "质量检查";
    },
  },
];

const detailData = ref();
const detailLoading = ref(false);
const formColumns = ref<PlusColumnList>([]);
const allformColumns: PlusColumnList = [
  {
    label: "生产订单",
    prop: "pro_no",
  },
  {
    label: "生产日期",
    prop: "pro_date",
  },
  {
    label: "库存工厂编码",
    prop: "factory_code",
  },
  {
    label: "交货单号",
    prop: "delivery_no",
  },
  {
    label: "入库状态",
    prop: "status",
    renderDescriptionsItem: () => {
      return (
        <>
          <el-tag type={getStatusTagType(status.value)}>{getStatusName(status.value)}</el-tag>
        </>
      );
    },
  },
  {
    label: "入库单号",
    prop: "pro_in_no",
  },
  {
    label: "入库备注",
    prop: "note",
  },
  {
    label: "附件信息",
    prop: "file_info",
  },
  {
    label: "物料信息",
    prop: "wl_code",
    hideInDescriptions: computed(() => props.in_type == 1),
  },
];
const tableData = ref<ProductInGoodsType[]>([]);
const file_info = ref({
  name: "",
  src: "",
});
const status = ref(-99);

async function getData() {
  detailLoading.value = true;
  const result = await productInDetailApi({ id: props.listId });
  detailData.value = result.data;
  tableData.value = result.data.goods;
  status.value = result.data.status;
  file_info.value = result.data.file_info ? result.data.file_info : { name: "", src: "" };
  detailLoading.value = false;
  if (props.in_type == 1) {
    let findRes = inColumns.find((item: TableColumns) => item.prop == "pro_ph_no");
    if (findRes) {
      findRes.hide = true;
    }
  } else {
    inColumns.find((item: TableColumns) => item.prop == "pro_ph_no")!.hide = false;
  }
}

function cellLook(row: any) {
  console.log("row", row);
  
  addDialog({
    width: "76%",
    btnClass: "w-[80px]",
    draggable: true,
    title: "批次垛号信息",
    contentRenderer: () =>
      h(pureTable, {
        headerCellClassName: "table-row-header",
        data: row.goods_detail,
        columns: batchColumns,
        adaptive: true,
        adaptiveConfig: { offsetBottom: 300 },
        showSummary: true,
        summaryMethod: getSummaries,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      done();
    },
  });
}

watch(
  () => model.value,
  (newVal) => {
    if (newVal) {
      getData();
    }
  },
);

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
      let propList = ["in_num"];
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

const batchColumns: TableColumnList = [
  {
    label: "序号",
    type: "index",
    width: 60,
    align: "center",
  },
  {
    label: "垛号",
    prop: "stack_no",
    align: "center",
    width: 60,
  },
  {
    label: "入库数量",
    prop: "in_num",
    align: "center",
  },
  {
    label: "单位",
    prop: "measure_name",
    align: "center",
    width: 60,
  },
  {
    label: "箱序列号",
    prop: "box_serial_number",
    align: "center",
    minWidth: 110,
    cellRenderer: ({ row }) => {
      return row.box_serial_number_start + "-" + row.box_serial_number_end;
    },
  },
  {
    label: "生产批次",
    prop: "pro_ph_no",
    align: "center",
    minWidth: 140,
  },
  {
    label: "成品批次",
    prop: "batch_no",
    align: "center",
    minWidth: 120,
  },
  {
    label: "库位名称",
    prop: "ws_code_name",
    align: "center",
  },
  {
    label: "库位编码",
    prop: "ws_code",
    align: "center",
  },
  {
    label: "库存地点",
    prop: "site",
    align: "center",
  },
  // {
  //   label: "库存类型",
  //   prop: "stock_type",
  //   align: "center",
  //   cellRenderer: ({ row }) => {
  //     return getStockTypeName(row.stock_type);
  //   },
  // },
];
</script>
<template>
  <el-drawer v-model="model" title="入库详情信息" size="80%">
    <div class="mb-8">
      <div class="paragraph-content">
        <p class="paragraph-title">基础信息</p>
      </div>
      <PlusDescriptions :column="3" :columns="allformColumns" :data="detailData">
        <template #plus-desc-file_info>
          <LookFileVue :file_info="file_info" v-if="file_info.src"></LookFileVue>
        </template>
      </PlusDescriptions>
    </div>
    <div>
      <div class="paragraph-content mb-4">
        <p class="paragraph-title">入库信息</p>
      </div>
      <pure-table ref="prueTableRef" row-key="id" :data="tableData" :columns="inColumns" border adaptive
        :adaptiveConfig="{ offsetBottom: 120 }" header-cell-class-name="table-gray-header"
        :cell-class-name="handleCellClass" @cell-mouse-enter="handleCellEnter" @cell-mouse-leave="handleCellLeave"
        show-summary :summary-method="getSummaries">
        <template #operation="{ row }">
          <el-button type="primary" link @click="cellLook(row)">查看批次垛号</el-button>
        </template>
      </pure-table>
    </div>
  </el-drawer>
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
