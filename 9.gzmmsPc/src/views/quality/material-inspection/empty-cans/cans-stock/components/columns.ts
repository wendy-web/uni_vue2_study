import type { PaginationProps } from "@pureadmin/table";
import { formartDate } from "@/utils/validate";

export function useSelect() {
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 20,
    currentPage: 1,
    background: true,
    pageSizes: [20, 30, 40],
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
      label: "序号",
      type: "index",
      width: 60,
      align: "center",
    },
    {
      label: "批号",
      prop: "batch_no",
      align: "center",
    },
    {
      label: "生产包号",
      prop: "pack_no",
      align: "center",
    },
    {
      label: "电流",
      prop: "electric_ret",
      align: "center",
      // cellRenderer: ({ row }) => {
      //   return row.electric_ret === 1 ? "合格" : "不合格";
      // },
    },
    {
      label: "启破力",
      prop: "open_ret",
      align: "center",
      // cellRenderer: ({ row }) => {
      //   return row.open_ret === 1 ? "合格" : "不合格";
      // },
    },
    {
      label: "检验日期",
      prop: "check_date",
      align: "center",
    },
    {
      label: "检验时间",
      prop: "check_time",
      align: "center",
    },
    {
      label: "彩印铁厂家",
      prop: "print_factor",
      align: "center",
    },
    {
      label: "操作",
      slot: "operation",
    },
  ];

  const searchColumns: PlusColumnList = [
    {
      label: "批号",
      prop: "batch_no",
    },
    {
      label: "检验日期",
      prop: "check_time",
      valueType: "date-picker",
      fieldProps: {
        placeholder: "请选择日期",
        type: "date",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        disabled: true,
      },
    },
  ];

  return {
    pagination,
    columns,
    searchColumns,
  };
}
