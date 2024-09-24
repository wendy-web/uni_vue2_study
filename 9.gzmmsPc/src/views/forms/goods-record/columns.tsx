import type { PlusColumn } from "plus-pro-components";
import { useSearchFrom } from "@/hooks/searchForm";

export type formType = {
  ws_code?: string;
  class_name?: number;
  warehouse_id?: number;
  time?: string;
  keyword?: string;
  page: number;
  size: number;
  is_all: number;
  is_get_exp_stock?: number;
};

export function useList() {
  const { storageList, classNameList } = useSearchFrom();
  const defaultColumns: TableColumnList = [
    {
      type: "selection",
      width: 60,
      reserveSelection: true,
      fixed: "left",
      label: "勾选列",
    },
    {
      label: "入库日期",
      prop: "in_wh_date",
      align: "center",
      minWidth: 90,
    },
    {
      label: "入库单号",
      prop: "in_wh_no",
      align: "center",
    },
    {
      label: "采购单号",
      prop: "procure_no",
      align: "center",
      minWidth: 90,
    },
    {
      label: "条码",
      prop: "barcode",
      align: "center",
    },
    {
      label: "名称",
      prop: "title",
      align: "center",
    },

    {
      label: "规格型号",
      prop: "spec",
      align: "center",
      minWidth: 90,
    },
    {
      label: "单位",
      prop: "measure_name",
      align: "center",
    },
    {
      label: "供应商",
      prop: "sup_name",
      align: "center",
    },
    {
      label: "品牌",
      prop: "brand",
      align: "center",
    },
    {
      label: "分类",
      prop: "class_name",
      align: "center",
    },
    {
      label: "批次/日期",
      prop: "batch_number",
      align: "center",
      minWidth: 90,
    },
    {
      label: "仓库",
      prop: "warehouse_name",
      align: "center",
    },
    {
      label: "可用库存",
      prop: "stock_qty",
      align: "center",
      minWidth: 90,
    },
    {
      label: "库位",
      prop: "ws_code",
      align: "center",
    },
    // {
    //   label: "单价",
    //   prop: "price",
    //   align: "center",
    // },
    // {
    //   label: "在库金额",
    //   prop: "stock_price",
    //   align: "center",
    // },
    {
      label: "生产日期",
      prop: "pro_time",
      align: "center",
      minWidth: 90,
    },
    {
      label: "到期日期",
      prop: "exp_time",
      align: "center",
      minWidth: 90,
    },
    {
      label: "是否标识管理",
      prop: "is_gen_uniq",
      align: "center",
      cellRenderer: (scope) => <span>{scope.row.is_gen_uniq == 1 ? "是" : "否"}</span>,
      minWidth: 100,
    },
    {
      label: "是否已有唯一码",
      prop: "is_gen_uniq",
      align: "center",
      cellRenderer: (scope) => <span>{scope.row.is_exits_unique ? "是" : "否"}</span>,
      minWidth: 100,
    },

    {
      label: "操作",
      slot: "operation",
      fixed: "right",
      width: 100,
    },
  ];

  const columns: TableColumnList = [
    {
      type: "selection",
      width: 60,
      reserveSelection: true,
      fixed: "left",
      label: "勾选列",
    },
    {
      label: "入库日期",
      prop: "in_wh_date",
      align: "center",
      minWidth: 90,
    },
    {
      label: "入库单号",
      prop: "in_wh_no",
      align: "center",
      minWidth: 90,
    },
    {
      label: "采购单号",
      prop: "procure_no",
      align: "center",
      minWidth: 90,
    },
    {
      label: "条码",
      prop: "barcode",
      align: "center",
    },
    {
      label: "名称",
      prop: "title",
      align: "center",
    },

    {
      label: "规格型号",
      prop: "spec",
      align: "center",
      minWidth: 90,
    },
    {
      label: "单位",
      prop: "measure_name",
      align: "center",
    },
    {
      label: "供应商",
      prop: "sup_name",
      align: "center",
    },
    {
      label: "品牌",
      prop: "brand",
      align: "center",
    },
    {
      label: "分类",
      prop: "class_name",
      align: "center",
    },
    {
      label: "批次/日期",
      prop: "batch_number",
      align: "center",
      minWidth: 100,
    },
    {
      label: "仓库",
      prop: "warehouse_name",
      align: "center",
    },
    {
      label: "可用库存",
      prop: "stock_qty",
      align: "center",
      minWidth: 90,
    },
    {
      label: "库位",
      prop: "ws_code",
      align: "center",
    },
    {
      label: "单价",
      prop: "price",
      align: "center",
    },
    {
      label: "在库金额",
      prop: "stock_price",
      align: "center",
      minWidth: 90,
    },
    {
      label: "生产日期",
      prop: "pro_time",
      align: "center",
      minWidth: 90,
    },
    {
      label: "到期日期",
      prop: "exp_time",
      align: "center",
      minWidth: 90,
      cellRenderer: ({ row }) => (
        <>
          <span class={row.is_exp_warning ? "text-red-500" : ""}>{row.exp_time}</span>
        </>
      ),
    },
    {
      label: "是否标识管理",
      prop: "is_gen_uniq",
      align: "center",
      cellRenderer: (scope) => <span>{scope.row.is_gen_uniq == 1 ? "是" : "否"}</span>,
      minWidth: 100,
    },
    {
      label: "是否已有唯一码",
      prop: "is_gen_uniq",
      align: "center",
      cellRenderer: (scope) => <span>{scope.row.is_exits_unique ? "是" : "否"}</span>,
      minWidth: 110,
    },
    {
      label: "操作",
      slot: "operation",
      fixed: "right",
      width: 100,
    },
  ];

  const searchColumns: PlusColumn[] = [
    {
      label: "关键字",
      tooltip: "关键字: 商品名称、条码、型号、品牌",
      prop: "keyword",
    },
    {
      label: "库位",
      prop: "ws_code",
    },
    {
      label: "仓库",
      prop: "warehouse_id",
      labelWidth: 50,
      valueType: "select",
      fieldProps: {
        placeholder: "请选择仓库",
      },
      options: () => {
        return storageList;
      },
    },
    {
      label: "库存数",
      prop: "is_all",
      labelWidth: 60,
      valueType: "select",
      fieldProps: {
        placeholder: "请选择库存数",
      },
      options: [
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
    },
    {
      label: "所属分类",
      prop: "class_name",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择所属分类",
      },
      options: () => {
        return classNameList;
      },
    },
    {
      label: "入库日期",
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
    {
      prop: "is_get_exp_stock",
      valueType: "plus-radio",
      labelWidth: 2,
      options: [
        {
          label: "到期库存",
          value: 1,
        },
      ],
      renderLabel: () => {
        return "";
      },
    },
  ];

  return {
    defaultColumns,
    columns,
    searchColumns,
  };
}
