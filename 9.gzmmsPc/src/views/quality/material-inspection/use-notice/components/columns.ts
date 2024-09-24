import type { PaginationProps } from "@pureadmin/table";
import { formartDate } from "@/utils/validate";

export function useSelect() {
  /** 表格分页配置 */
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
      label: "批号",
      prop: "batch_no",
      align: "center",
    },
    {
      label: "托盘号",
      prop: "pack_no",
      align: "center",
    },
    {
      label: "检验日期",
      prop: "check_date",
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
      labelWidth: 60,
    },
  ];

  return {
    columns,
    searchColumns,
    pagination,
  };
}

export function useDetailSelect() {
  const columns: TableColumnList = [
    {
      label: "操作",
      slot: "operation",
    },
    // {
    //   label: "#",
    //   type: "index",
    // },
    {
      label: "批号",
      prop: "batch_no",
      align: "center",
    },
    {
      label: "托盘号",
      prop: "pack_no",
      align: "center",
    },
    {
      label: "检验日期",
      prop: "check_date",
      align: "center",
    },
  ];

  const searchColumns: PlusColumnList = [
    {
      label: "批号",
      prop: "batch_no",
    },
  ];

  return {
    columns,
    searchColumns,
  };
}
