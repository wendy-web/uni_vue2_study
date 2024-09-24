import { formartDate } from "@/utils/validate";

export function useOrderList() {
  const columns: TableColumnList = [
    {
      label: "采购入库单号",
      prop: "wh_in_no",
      width: 160,
      align: "center",
    },
    {
      label: "采购单号",
      prop: "procure_no",
      width: 160,
      align: "center",
    },
    // {
    //   label: "入库类型",
    //   width: 90,
    //   align: "center",
    //   prop: "wh_in_type",
    //   cellRenderer: (scope) => <span>{scope.row.procure_no ? "采购入库" : "直接入库"}</span>,
    // },
    {
      label: "商品明细",
      prop: "product_name",
      // width: 160,
      align: "center",
      showOverflowTooltip: true,
    },
    {
      label: "入库数量",
      prop: "all_num",
      width: 90,
      align: "center",
    },
    {
      label: "入库仓库",
      prop: "in_wh_name",
      width: 160,
      align: "center",
    },
    {
      label: "入库日期",
      prop: "date",
      width: 110,
      align: "center",
      cellRenderer: (scope) => <span>{formartDate(scope.row.in_time) || "-"}</span>,
    },
    {
      label: "单据备注",
      prop: "note",
      width: 200,
      align: "center",
      showOverflowTooltip: true,
      cellRenderer: (scope) => <span>{scope.row.note || "-"}</span>,
    },
    {
      label: "制单人",
      prop: "ct_name",
      align: "center",
    },
    {
      label: "创建时间",
      width: 180,
      prop: "create_time",
      align: "center",
    },
    {
      label: "状态",
      width: 100,
      align: "center",
      slot: "status",
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation",
    },
  ];

  return {
    columns,
  };
}