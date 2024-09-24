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
      type: "selection",
      width: 60,
      reserveSelection: true,
      label: "勾选列",
      fixed: "left",
    },
    {
      label: "资产编码",
      prop: "",
      align: "center",
    },
    {
      label: "资产名称",
      prop: "",
      align: "center",
    },
    {
      label: "设备位置",
      prop: "",
      align: "center",
    },
    {
      label: "表计类型",
      prop: "",
      align: "center",
    },
    {
      label: "累积用量",
      prop: "",
      align: "center",
    },
    {
      label: "用途",
      prop: "",
      align: "center",
    },
    {
      label: "是否生产",
      prop: "",
      align: "center",
    },
    {
      label: "产量罐",
      prop: "",
      align: "center",
    },
    {
      label: "抄表停机日期",
      prop: "",
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
      label: "表针类别",
      prop: "type",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择",
      },
    },
    {
      label: "抄表日期",
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
