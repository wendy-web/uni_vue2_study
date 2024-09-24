import { formartDate } from "@/utils/validate";

export function useOrderList() {
  const columns: TableColumnList = [
    {
      label: "盘点单号",
      prop: "wh_inv_no",
      width: 160,
      align: "center",
    },
    {
      label: "盘点仓库",
      prop: "warehouse_name",
      width: 160,
      align: "center",
    },
    {
      label: "盘点日期",
      prop: "inventory_time",
      width: 110,
      align: "center",
      cellRenderer: (scope) => <span>{formartDate(scope.row.inventory_time) || "-"}</span>,
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
    // {
    //   label: "是否更新库存",
    //   prop: "money",
    //   width: 120,
    //   align: "center",
    //   cellRenderer: (scope) => {
    //     let spanText = "-";
    //     if (scope.row.up_inv == 1) {
    //       spanText = "是";
    //     } else if (scope.row.up_inv == 2) {
    //       spanText = "否";
    //     }
    //     return <span>{spanText}</span>;
    //   },
    // },
    {
      label: "盈/亏总数量",
      align: "center",
      cellRenderer: (scope) => (
        <>
          <span class={[scope.row.surplus_num > 0 ? "text-green-500" : ""]}>
            {scope.row.surplus_num}
          </span>
          <span>/</span>
          <span class={[scope.row.shortage_num < 0 ? "text-red-500" : ""]}>
            {scope.row.shortage_num}
          </span>
        </>
      ),
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
