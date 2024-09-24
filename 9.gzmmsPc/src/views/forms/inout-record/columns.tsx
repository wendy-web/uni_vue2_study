import type { FormInstance } from "element-plus";
import type { PlusColumn } from "plus-pro-components";
import type { InoutObjType } from "@/api/forms/inout-record/types";
import { useSearchFrom } from "@/hooks/searchForm";

enum ETransaction {
  // 单据交易类型 1采购入库 2其他出库 3领料出库 4退料入库 5调拨 6盘点 7报废 8其他 9其他入库 10拆装 11退库清单
  "采购入库" = 1,
  "其他出库",
  "领料出库",
  "退料入库",
  "调拨",
  "盘点",
  "报废",
  "其他",
  "其他入库",
  "拆装",
  "退库清单",
}

export function useList() {
  const { storageList } = useSearchFrom();

  const columns: TableColumnList = [
    {
      type: "selection",
      width: 40,
      reserveSelection: true,
      fixed: "left",
      label: "勾选列",
    },
    {
      label: "业务单号",
      prop: "document_num",
      align: "center",
      minWidth: 90,
    },
    {
      label: "业务日期",
      prop: "transaction_date",
      align: "center",
      width: 170,
      sortable: true,
    },
    {
      label: "业务类型",
      prop: "document_type",
      align: "center",
      cellRenderer: (scope) => (
        <span>{getTransactionType(scope.row.document_type, scope.row.type)}</span>
      ),
      sortable: true,
      minWidth: 110,
    },
    {
      label: "仓库",
      prop: "warehouse.name",
      align: "center",
      cellRenderer: (scope) => <span>{scope.row.warehouse.name || "-"}</span>,
      sortable: true,
    },
    {
      label: "货品条码",
      prop: "goods.barcode",
      align: "center",
      headerSlot: "barcode",
      sortable: true,
      minWidth: 130,
    },

    {
      label: "名称",
      prop: "goods.title",
      align: "center",
      sortable: true,
    },
    {
      label: "规格型号",
      prop: "goods.spec",
      align: "center",
      headerSlot: "spec",
      minWidth: 110,
    },
    {
      label: "单位",
      prop: "goods.measure_name",
      align: "center",
      width: 100,
    },
    {
      label: "批次/日期",
      prop: "batch_number",
      align: "center",
      sortable: true,
      minWidth: 120,
    },
    {
      label: "出入库数量",
      prop: "transaction_quantity",
      align: "center",
      width: 120,
      cellRenderer: ({ row }) => (
        <span class={[row.transaction_type === 1 ? "text-green-500" : "text-red-500"]}>
          {row.transaction_type === 1 ? row.transaction_quantity : "-" + row.transaction_quantity}
        </span>
      ),
      sortable: true,
    },
    {
      label: "结余数量",
      prop: "balance_quantity",
      align: "center",
      width: 120,
      sortable: true,
    },
  ];

  function getTransactionType(val: number, type: number) {
    if (type === 1) {
      const specialOrderMap = new Map([
        [2, "冲销出库"],
        [9, "冲销入库"],
      ]);
      return specialOrderMap.get(val);
    }
    return ETransaction[val];
  }

  // const typeList = ref([
  //   {
  //     id: 1,
  //     name: "采购入库",
  //   },
  //   {
  //     id: 2,
  //     name: "退货出库",
  //   },
  //   {
  //     id: 3,
  //     name: "领料出库",
  //   },
  //   {
  //     id: 4,
  //     name: "退料入库",
  //   },
  //   {
  //     id: 5,
  //     name: "调拨",
  //   },
  //   {
  //     id: 6,
  //     name: "盘点",
  //   },
  //   {
  //     id: 7,
  //     name: "报废",
  //   },
  //   {
  //     id: 8,
  //     name: "其他",
  //   },
  // ]);
  const typeList = ref([
    {
      value: 1,
      label: "采购入库",
    },
    {
      value: 2,
      label: "其他出库",
    },
    {
      value: 3,
      label: "领料出库",
    },
    {
      value: 4,
      label: "退料入库",
    },
    {
      value: 5,
      label: "调拨",
    },
    {
      value: 6,
      label: "盘点",
    },
    {
      value: 7,
      label: "报废",
    },
    {
      value: 8,
      label: "其他",
    },
  ]);
  const formData = ref({
    keyword: "",
    page: 1,
    size: 10,
    time: "",
    warehouse_id: "",
    document_type: "",
    barcode: undefined as undefined | string,
    spec: undefined as undefined | string,
  });
  const total = ref(0);
  const tableLoading = ref(false);
  const tableData = ref<InoutObjType[]>([]);
  const selectTable = ref<InoutObjType[]>([]);
  const formRef = ref();
  const ids = ref<number[]>([]);

  const prueTableRef = ref();

  const searchColumns: PlusColumn[] = [
    {
      label: "关键字",
      tooltip: "关键字: 单号、商品名称、条码、型号、品牌",
      prop: "keyword",
    },
    {
      label: "业务类型",
      prop: "document_type",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择业务类型",
      },
      options: () => {
        return typeList.value;
      },
    },
    {
      label: "出库仓库",
      prop: "warehouse_id",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择出库仓库",
      },
      options: () => {
        return storageList;
      },
    },
    {
      label: "业务日期",
      prop: "time",
      valueType: "date-picker",
      fieldProps: {
        type: "daterange",
        rangeSeparator: "至",
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      },
    },
  ];

  return {
    columns,
    typeList,
    formData,
    total,
    tableLoading,
    tableData,
    selectTable,
    formRef,
    ids,
    prueTableRef,
    getTransactionType,
    searchColumns,
  };
}
