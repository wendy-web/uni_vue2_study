import { formartDate } from "@/utils/validate";

export function useOrderList() {
  const columns: TableColumnList = [
    {
      label: "退料入库单号",
      prop: "wh_recin_no",
      width: 160,
      align: "center",
    },
    {
      label: "领料出库单号",
      prop: "wh_rec_no",
      width: 160,
      align: "center",
    },
    {
      label: "退料入库日期",
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

  /**
   *
   * @param assocType 接口返回的assoc_type数组
   * @param query 需要判断的值
   * @returns
   */
  const checkAssocType = (assocType: number[], query: number | number[]) => {
    if (Array.isArray(query)) {
      return query.some((item) => assocType.includes(item));
    }
    if (assocType.includes(query)) {
      return true;
    } else {
      return false;
    }
  };

  return {
    columns,
    checkAssocType
  };
}
