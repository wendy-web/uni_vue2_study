import { formartDate } from "@/utils/validate";

export function useOtherInList() {
  const columns: TableColumnList = [
    {
      label: "其他入库单号",
      prop: "wh_in_no",
      width: 160,
      align: "center",
    },
    {
      label: "入库类型",
      prop: "type",
      width: 90,
      align: "center",
      cellRenderer: ({ row }) => {
        return row.type === 1 ? "冲销入库" : "其他入库";
      },
    },
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
  const options = ref([
    {
      value: 0,
      label: "待提审",
    },
    {
      value: 1,
      label: "待审核",
    },
    {
      value: 3,
      label: "已完成",
    },
    {
      value: 4,
      label: "已撤回",
    },
    {
      value: 5,
      label: "已驳回",
    },
    {
      value: 6,
      label: "已作废",
    },
    {
      value: 7,
      label: "待仓库确认",
    },
  ]);

  const tableLoading = ref(false);

  return {
    /** 状态列表 */
    options,
    /** 表格loading */
    tableLoading,
    /** 表格列 */
    columns,
  };
}
