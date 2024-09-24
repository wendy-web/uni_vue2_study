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
      label: "维修单号",
      prop: "",
      align: "center",
    },
    {
      label: "维修名称",
      prop: "",
      align: "center",
    },
    {
      label: "设备编码",
      prop: "",
      align: "center",
    },
    {
      label: "资产条码",
      prop: "",
      align: "center",
    },
    {
      label: "资产名称",
      prop: "",
      align: "center",
    },
    {
      label: "存放位置",
      prop: "",
      align: "center",
    },
    {
      label: "问题类型",
      prop: "",
      align: "center",
    },
    {
      label: "是否停机",
      prop: "",
      align: "center",
    },
    {
      label: "误时",
      prop: "",
      align: "center",
    },
    {
      label: "维修描述",
      prop: "",
      align: "center",
    },
    {
      label: "备注",
      prop: "",
      align: "center",
    },
    {
      label: "维修人",
      prop: "",
      align: "center",
    },
    {
      label: "维修日期",
      prop: "",
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
    },
    {
      label: "资产类型",
      prop: "",
      fieldProps: {
        placeholder: "请输入",
      },
    },
    {
      label: "存放位置",
      prop: "",
      fieldProps: {
        placeholder: "请输入",
      },
    },
    {
      label: "维修日期",
      prop: "time",
      labelWidth: 90,
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
