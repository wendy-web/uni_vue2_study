import type { PlusColumn } from "plus-pro-components";
import { formartDate } from "@/utils/validate";
import { useSearchFrom } from "@/hooks/searchForm";

export function useList() {
  const { classList, storageList } = useSearchFrom();

  const columns: TableColumnList = [
    {
      type: "selection",
      width: 60,
      reserveSelection: true,
      label: "勾选列",
      fixed: "left",
    },
    {
      label: "采购入库单号",
      prop: "wh_in_no",
      minWidth: 140,
      align: "center",
    },
    {
      label: "采购单号",
      prop: "procure_no",
      minWidth: 140,
      align: "center",
      headerSlot: "procure_no",
      sortable: true,
    },
    {
      label: "货品条码",
      prop: "barcode",
      minWidth: 140,
      align: "center",
      headerSlot: "barcode",
      sortable: true,
    },
    {
      label: "名称",
      prop: "title",
      minWidth: 160,
      align: "center",
      headerSlot: "title",
      sortable: true,
    },
    {
      label: "规格型号",
      prop: "spec",
      minWidth: 160,
      align: "center",
      cellRenderer: (scope) => <span>{scope.row.spec || "-"}</span>,
      headerSlot: "spec",
    },
    {
      label: "品牌",
      prop: "brand",
      // minWidth: 160,
      align: "center",
      cellRenderer: (scope) => <span>{scope.row.brand || "-"}</span>,
      headerSlot: "brand",
    },
    {
      label: "分类",
      prop: "class_name",
      // minWidth: 160,
      align: "center",
    },
    {
      label: "供应商",
      prop: "sup_name",
      minWidth: 100,
      align: "center",
      headerSlot: "sup_name",
    },
    {
      label: "单位",
      prop: "measure_name",
      // minWidth: 160,
      align: "center",
    },
    {
      label: "单价",
      prop: "price",
      minWidth: 80,
      align: "center",
      sortable: true,
    },
    {
      label: "入库数量",
      prop: "in_num",
      minWidth: 110,
      align: "center",
      sortable: true,
    },
    {
      label: "入库仓库",
      prop: "in_wh_name",
      minWidth: 120,
      align: "center",
      sortable: true,
    },
    {
      label: "入库日期",
      prop: "in_time",
      minWidth: 110,
      align: "center",
      cellRenderer: (scope) => <span>{formartDate(scope.row.in_time) || "-"}</span>,
      sortable: true,
    },
    {
      label: "批次/日期",
      prop: "ph_no",
      minWidth: 130,
      align: "center",
      cellRenderer: (scope) => <span>{scope.row.ph_no || "-"}</span>,
      headerSlot: "ph_no",
      sortable: true,
    },
    {
      label: "需求部门",
      prop: "dept_name",
      align: "center",
      minWidth: 120,
      cellRenderer: (scope) => <span>{scope.row.dept_name || "-"}</span>,
      sortable: true,
    },
    // {
    //   label: "单据备注",
    //   prop: "note",
    //   width: 200,
    //   align: "center",
    //   showOverflowTooltip: true,
    //   cellRenderer: (scope) => <span>{scope.row.note || "-"}</span>,
    // },
  ];

  const searchColumns: PlusColumn[] = [
    {
      label: "关键字",
      prop: "keyword",
      tooltip: "关键字:入库单号/采购单号/商品名称/条码/型号/品牌",
    },
    {
      label: "入库仓库",
      prop: "warehouse_id",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择仓库",
      },
      options: () => {
        return storageList;
      },
    },
    {
      label: "需求部门",
      prop: "dept_id",
    },
    {
      label: "所属分类",
      prop: "class_name",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择所属分类",
      },
      options: () => {
        return classList;
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
  ];
  return {
    columns,
    searchColumns,
  };
}
