import type { PaginationProps } from "@pureadmin/table";

export function useSelect() {
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 20,
    currentPage: 1,
    background: true,
    pageSizes: [20, 30, 40],
  });

  const sku_list = ref<OptionType[]>([]);

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
      label: "批次",
      prop: "batch_no",
      align: "center",
    },
    {
      label: "批号",
      prop: "batch_number",
      align: "center",
    },
    {
      label: "检验结果",
      prop: "check_res",
      align: "center",
      cellRenderer: ({ row }) => {
        return row.check_res === 1 ? "合格" : "不合格";
      },
    },
    {
      label: "线别",
      prop: "line",
      align: "center",
    },
    {
      label: "产品类型",
      prop: "sku",
      align: "center",
      cellRenderer: ({ row }) => {
        return sku_list.value.find((el) => el.value === row.sku)?.label || "";
      },
    },
  ];

  const searchColumns: PlusColumnList = [
    {
      label: "批次",
      prop: "batch_no",
    },
    {
      label: "批号",
      prop: "batch_number",
    },
  ];

  return {
    pagination,
    columns,
    searchColumns,
    sku_list,
  };
}
