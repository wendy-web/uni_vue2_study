import { formartDate } from "@/utils/validate";

export function useOrderList() {
  const columns: TableColumnList = [
    {
      type: "selection",
      width: 40,
      reserveSelection: true,
      label: "勾选列",
      fixed: "left",
    },

    {
      label: "调拨单号",
      prop: "wh_tra_no",
      width: 160,
      align: "center",
    },
    {
      label: "调出仓库",
      prop: "out_wh_name",
      width: 160,
      align: "center",
    },
    {
      label: "调出时间",
      prop: "out_time",
      width: 110,
      align: "center",
      cellRenderer: (scope) => <span>{formartDate(scope.row.out_time) || "-"}</span>,
    },
    {
      label: "调入仓库",
      prop: "to_wh_name",
      width: 160,
      align: "center",
    },
    {
      label: "调入时间",
      prop: "in_time",
      width: 110,
      align: "center",
      cellRenderer: (scope) => <span>{formartDate(scope.row.in_time) || "-"}</span>,
    },

    {
      label: "商品明细",
      prop: "product_name",
      // width: 160,
      align: "center",
      showOverflowTooltip: true,
    },
    {
      label: "调拨数量",
      prop: "all_num",
      width: 100,
      align: "center",
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
