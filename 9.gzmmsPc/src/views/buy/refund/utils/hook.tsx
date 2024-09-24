import { formartDate } from "@/utils/validate";

export function useOrderList() {
  const columns: TableColumnList = [
    {
      label: "退货单号",
      prop: "procure_ret_no",
      width: 160,
      align: "center",
    },
    {
      label: "采购单号",
      prop: "procure_no",
      width: 160,
      align: "center",
    },
    {
      label: "商品明细",
      prop: "product_name",
      // width: 160,
      align: "center",
      showOverflowTooltip: true,
    },
    {
      label: "退货日期",
      prop: "return_time",
      width: 180,
      align: "center",
      showOverflowTooltip: true,
      cellRenderer: (scope)=><span>{formartDate(scope.row.return_time)|| "-"}</span>,
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
