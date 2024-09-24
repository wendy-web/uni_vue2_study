import type { PaginationProps } from "@pureadmin/table";

export function useAdd() {
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
    hideOnSinglePage: true,
  });

  const columns: TableColumnList = [
    // {
    //   type: "selection",
    //   width: 60,
    //   reserveSelection: true,
    //   label: "勾选列",
    //   fixed: "left",
    // },
    {
      label: "操作",
      slot:"operation",
      fixed: "left"
    },
    {
      label: "设备编码",
      prop: "asset_no",
      align: "center",
      minWidth: 110,
    },
    {
      label: "资产类型",
      prop: "eq_type_text",
      align: "center",
      minWidth: 110,
    },
    {
      label: "资产名称",
      prop: "bar_title",
      align: "center",
      minWidth: 120,
    },
    {
      label: "资产条码",
      prop: "barcode",
      align: "center",
      minWidth: 120,
    },

    {
      label: "规格型号",
      prop: "spec",
      align: "center",
      minWidth: 110,
    },
    {
      label: "可用状态",
      prop: "status",
      align: "center",
    },
    {
      label: "使用位置",
      prop: "save_addr_text",
      align: "center",
      minWidth: 110,
    },
    {
      label: "使用部门",
      prop: "use_dept_text",
      align: "center",
      minWidth: 110,
    },
  ];

  return {
    pagination,
    columns,
  };
}
