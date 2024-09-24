import { useAdd } from "./add";

export function useDetail() {
  const { getAvailableName } = useAdd();

  /** 详情页使用的 */
  const columns: TableColumnList = [
    {
      label: "#",
      type: "index",
    },
    {
      label: "条码",
      prop: "barcode",
    },
    {
      label: "名称",
      prop: "title",
    },
    {
      label: "规格型号",
      prop: "spec",
    },
    {
      label: "品牌",
      prop: "brand",
    },
    {
      label: "分类",
      prop: "class_name",
    },
    {
      label: "单位",
      prop: "measure_name",
    },
    {
      label: "退库数量",
      prop: "ret_num",
    },
    {
      label: "换下日期",
      prop: "replace_time",
    },
    {
      label: "使用地点",
      prop: "use_places",
    },
    {
      label: "可用状态",
      prop: "available_status",
      cellRenderer: ({ row }) => {
        return getAvailableName(row.available_status);
      },
    },
    {
      label: "备注",
      prop: "note",
    },
  ];

  const logColumns: TableColumnList = [
    {
      label: "操作人",
      prop: "ct_name",
    },
    {
      label: "操作类型",
      prop: "act",
      cellRenderer: ({ row }) => {
        return row.act_msg ? `${row.act}：${row.act_msg}` : row.act;
      },
    },
    {
      label: "时间",
      prop: "create_time",
    },
  ];

  return {
    columns,
    logColumns,
  };
}
