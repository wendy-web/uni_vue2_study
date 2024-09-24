import type { PaginationProps } from "@pureadmin/table";

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
      label: "排序编号",
      prop: "sort",
      width: 60,
      align: "center",
    },
    {
      label: "使用地点",
      prop: "use_place",
      align: "center",
    },
    {
      label: "名称",
      prop: "name",
      align: "center",
    },
    {
      label: "型号",
      prop: "inst_type_no",
      align: "center",
    },
    {
      label: "出厂编号",
      prop: "productserial_no",
      align: "center",
    },
    {
      label: "规格",
      prop: "",
      align: "center",
      children: [
        {
          label: "Max",
          prop: "max_val",
          align: "center",
          cellRenderer: ({ row }) => {
            return (
              <>
                <span>{row.max_val}</span>
                <span>{row.max_unit}</span>
              </>
            );
          },
        },
        {
          label: "e",
          prop: "e_val",
          align: "center",
          cellRenderer: ({ row }) => {
            return (
              <>
                <span>{row.e_val}</span>
                <span>{row.e_unit}</span>
              </>
            );
          },
        },
        {
          label: "d",
          prop: "d_val",
          align: "center",
          cellRenderer: ({ row }) => {
            return (
              <>
                <span>{row.d_val}</span>
                <span>{row.d_unit}</span>
              </>
            );
          },
        },
      ],
    },
    {
      label: "砝码重量",
      prop: "weight_val",
      align: "center",
      cellRenderer: ({ row }) => {
        return (
          <>
            <span>{row.weight_val}</span>
            <span>{row.weight_unit}</span>
          </>
        );
      },
    },
  ];

  const searchColumns: PlusColumnList = [
    {
      label: "型号",
      prop: "inst_type_no",
    },
    {
      label: "出厂编号",
      prop: "productserial_no",
    },
  ];

  return {
    pagination,
    columns,
    searchColumns,
  };
}
