import type { PaginationProps } from "@pureadmin/table";

export function useSelectDevice() {
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
      label: "设备编码",
      prop: "asset_no",
      align: "center",
    },
    {
      label: "资产条码",
      prop: "barcode",
      align: "center",
    },
    {
      label: "使用位置",
      prop: "save_addr_text",
      align: "center",
    },
    {
      label: "资产名称",
      prop: "bar_title",
      align: "center",
    },
    {
      label: "资产类型",
      prop: "eq_type_text",
      align: "center",
    },
    {
      label: "品牌",
      prop: "brand",
      align: "center",
    },
    {
      label: "型号",
      prop: "spec",
      align: "center",
    },
    {
      label: "操作",
      slot: "operation",
    }
  ];
  const searchColumns: PlusColumnList = [
    {
      label: "关键字",
      prop: "keyword",
      fieldProps: {
        placeholder: "请输入",
      },
      tooltip: "请输入关键字/条码/名称/型号",
    },
    {
      label: "资产类型",
      prop: "equipment_type",
      fieldProps: {
        placeholder: "请输入",
      },
    },
    {
      label: "使用位置",
      prop: "save_addr",
      fieldProps: {
        placeholder: "请输入",
      },
    },
    {
      label: "使用部门",
      prop: "use_dept_id",
      fieldProps: {
        placeholder: "请输入",
      },
    },
    {
      label: "使用负责人",
      labelWidth: 100,
      prop: "use_duty_user",
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
