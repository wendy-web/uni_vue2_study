import type { PaginationProps } from "@pureadmin/table";

export function useList() {
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });
  const columns: TableColumnList = [
    {
      label: "故障原因",
      prop: "name",
      align: "center",
    },
    {
      label: "备注",
      prop: "note",
      align: "center",
    },
    {
      label: "操作",
      slot: "operation",
      fixed: "right",
      align: "center",
    },
  ];

  const addColumns: PlusColumnList = [
    {
      label: "故障名称",
      prop: "name",
      fieldProps: {
        placeholder: "请输入故障名称",
      },
    },
    {
      label: "备注",
      prop: "note",
      fieldProps: {
        placeholder: "请输入备注",
      },
    },
  ];

  return {
    pagination,
    columns,
    addColumns,
  };
}
