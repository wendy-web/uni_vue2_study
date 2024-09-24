import { formartDate } from "@/utils/validate";

/**
 * @example 领取确认状态弹窗组件和指定领取弹窗组件使用的方法
 * @param  username
 * @param  dept_name
 * @returns username || username + `【${dept_name}】`
 */
export function getLabel(username: string, dept_name: string) {
  if (dept_name) {
    return username + `【${dept_name}】`;
  } else {
    return username;
  }
}

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
      label: "领料出库单号",
      prop: "wh_rec_no",
      width: 160,
      align: "center",
    },
    {
      label: "出库日期",
      prop: "out_time",
      width: 110,
      align: "center",
      cellRenderer: (scope) => <span>{formartDate(scope.row.out_time) || "-"}</span>,
    },
    {
      label: "商品明细",
      prop: "product_name",
      // width: 160,
      align: "center",
      showOverflowTooltip: true,
    },
    {
      label: "制单人",
      prop: "ct_name",
      align: "center",
    },
    {
      label: "领料类型",
      prop: "rec_type_name",
      align: "center",
      cellRenderer: (scope) => <span>{scope.row.rec_type_name || "-"}</span>,
    },
    {
      label: "领料申请人",
      prop: "rp_names",
      align: "center",
    },
    {
      label: "指定领取人",
      prop: "ar_names",
      align: "center",
      slot: "receiver",
    },
    {
      label: "使用地点",
      prop: "use_places",
      align: "center",
    },

    // {
    //   label: "领料人",
    //   prop: "receiver_name",
    //   width: 160,
    //   align: "center",
    //   cellRenderer: (scope) => <span>{scope.row.receiver_name || "-"}</span>,
    // },

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
      label: "审批状态",
      width: 100,
      align: "center",
      slot: "status",
    },
    // {
    //   label: "领取确认状态",
    //   width: 120,
    //   align: "center",
    //   slot: "receiver_confirm_status",
    // },
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
    checkAssocType,
  };
}
