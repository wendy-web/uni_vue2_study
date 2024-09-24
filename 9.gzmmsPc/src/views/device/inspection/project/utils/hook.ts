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
      label: "检查内容组名",
      prop: "inspect_items_name",
      align: "center",
    },
    {
      label: "资产类型",
      prop: "equipment_type_title",
      align: "center",
    },
    {
      label: "检验目的",
      prop: "inspect_purpose",
      align: "center",
    },
    {
      label: "备注",
      prop: "note",
      align: "center",
    },
    {
      label: "检查内容总数",
      prop: "inspect_item_num",
      align: "center",
    },
    {
      label: "操作",
      slot: "operation",
      fixed: "right",
    },
  ];
  const searchColumns: PlusColumnList = [
    {
      label: "关键字",
      prop: "keyword",
      fieldProps: {
        placeholder: "请输入",
      },
    },
    {
      label: "资产类型",
      prop: "equipment_type_id",
      fieldProps: {
        placeholder: "请输入",
      },
    },
  ];

  return {
    pagination,
    columns,
    searchColumns,
  };
}
