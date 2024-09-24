import { formartDate } from "@/utils/validate";

export function useSplitList() {
  const columns: TableColumnList = [
    {
      label: "拆装单号",
      width: 160,
      align: "center",
      prop: "split_assemble_no",
    },
    {
      label: "拆装前商品明细",
      showOverflowTooltip: true,
      align: "center",
      prop: "after_goods_detail",
    },
    {
      label: "拆装后商品明细",
      showOverflowTooltip: true,
      align: "center",
      prop: "before_goods_detail",
    },
    {
      label: "拆前数量",
      width: 100,
      align: "center",
      prop: "before_num",
    },
    {
      label: "拆后数量",
      width: 100,
      align: "center",
      prop: "after_num",
    },
    {
      label: "拆装仓库",
      align: "center",
      prop: "warehouse.name",
    },
    {
      label: "拆装日期",
      align: "center",
      prop: "split_assemble_time",
      cellRenderer: (scope) => <span>{formartDate(scope.row.split_assemble_time) || "-"}</span>,
    },
    {
      label: "制单人",
      prop: "create_name",
      align: "center",
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
