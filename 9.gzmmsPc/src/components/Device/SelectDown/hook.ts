import type { PaginationProps } from "@pureadmin/table";
import { formartDate } from "@/utils/validate";

export function useSelectDown() {
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });

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
      label: "换上关联单号",
      prop: "order_no",
      align: "center",
      minWidth: 130,
    },
    {
      label: "单据类型",
      prop: "order_type_text",
      align: "center",
    },
    {
      label: "换上时间",
      prop: "chage_date",
      align: "center",
      minWidth: 110,
      cellRenderer: (scope) => {
        return formartDate(scope.row.chage_date);
      },
    },
    {
      label: "领料出库单号",
      prop: "re_no",
      align: "center",
      minWidth: 130,
    },
    {
      label: "出库仓库",
      prop: "out_ware",
      align: "center",
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
      label: "入库日期",
      prop: "in_wh_date",
      align: "center",
      minWidth: 110,
    },
    {
      label: "供应商",
      prop: "sup_name",
      align: "center",
    },
    {
      label: "使用位置",
      prop: "use_addr",
      align: "center",
    },
    {
      label: "使用数量",
      prop: "use_num",
      align: "center",
    },
    {
      label: "在线数量",
      prop: "online_num",
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
      tooltip: "请输入名称/型号/品牌",
    },
    {
      label: "换上日期",
      prop: "out_time",
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
  };
}
