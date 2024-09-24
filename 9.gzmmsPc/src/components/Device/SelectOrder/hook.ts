import type { PaginationProps } from "@pureadmin/table";
import { formartDate } from "@/utils/validate";

export function useSelectOrder() {
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });

  function getType(rec_type: number) {
    switch (rec_type) {
      case 1:
        return "物业";

      case 2:
        return "维修";

      case 3:
        return "保养";

      default:
        return "--";
    }
  }

  function getStatus(status: number) {
    const statusMap = new Map([
      [0, "待提审"],
      [1, "待审核"],
      [3, "已完成"],
      [4, "已撤回"],
      [5, "已驳回"],
      [6, "已作废"],
      [7, "已审批"],
      [8, "待领料"],
      [9, "已确认"],
      [10, "待确认"],
    ]);

    return statusMap.get(status) ?? "--";
  }

  const columns: TableColumnList = [
    {
      type: "selection",
      width: 60,
      reserveSelection: true,
      label: "勾选列",
      fixed: "left",
      selectable: (row: any) => {
        return !row.select_status;
      },
    },
    {
      label: "领料出库单号",
      prop: "wh_rec_no",
      align: "center",
      minWidth: 130,
    },
    {
      label: "出库日期",
      prop: "out_time",
      align: "center",
      minWidth: 110,
      cellRenderer: (scope) => {
        return formartDate(scope.row.out_time);
      },
    },
    {
      label: "制单人",
      prop: "receiver_name",
      align: "center",
    },
    {
      label: "领料申请人",
      prop: "rp_names",
      align: "center",
      minWidth: 110,
    },
    {
      label: "指定领取人",
      prop: "ar_names",
      align: "center",
      minWidth: 110,
    },
    {
      label: "领料类型",
      prop: "rec_type",
      align: "center",
      cellRenderer: (scope) => {
        return getType(scope.row.rec_type);
      },
    },
    {
      label: "单据状态",
      prop: "status",
      align: "center",
      cellRenderer: (scope) => {
        return getStatus(scope.row.status);
      },
    },
    {
      label: "条码",
      prop: "barcode",
      align: "center",
      minWidth: 120,
    },
    {
      label: "名称",
      prop: "title",
      align: "center",
      minWidth: 120,
    },
    {
      label: "规格型号",
      prop: "spec",
      align: "center",
      minWidth: 120,
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
      label: "单位",
      prop: "measure_name",
      align: "center",
    },
    {
      label: "批次/日期",
      prop: "ph_no",
      align: "center",
      minWidth: 110,
    },
    {
      label: "入库日期",
      prop: "in_wh_date",
      align: "center",
      minWidth: 110,
      cellRenderer: (scope) => {
        return formartDate(scope.row.in_wh_date);
      },
    },
    {
      label: "单价",
      prop: "price",
      align: "center",
    },
    {
      label: "出库仓库",
      prop: "warehouse_name",
      align: "center",
    },
    // {
    //   label: "使用位置",
    //   prop: "",
    //   align: "center",
    // },
    {
      label: "已领数",
      prop: "received_num",
      align: "center",
    },
    // {
    //   label: "使用数",
    //   prop: "use_num",
    //   align: "center",
    // },
    {
      label: "待用数",
      // prop: "no_use_num",
      prop: "rem_num",
      align: "center",
    },
  ];

  const searchColumns: PlusColumnList = [
    {
      label: "关键字",
      prop: "keyword",
      fieldProps: {
        placeholder: "请输入",
      },
      tooltip: "请输入单号/制单人/条码/名称/型号/品牌",
    },
    {
      label: "出库日期",
      prop: "",
      valueType: "date-picker",
      fieldProps: {
        placeholder: "请选择日期",
        type: "daterange",
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      },
    },
  ];

  return {
    pagination,
    columns,
    searchColumns,
    getType,
    getStatus,
  };
}
