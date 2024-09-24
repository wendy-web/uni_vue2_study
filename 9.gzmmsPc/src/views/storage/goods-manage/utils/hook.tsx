export function useOrderList() {
  const columns: TableColumnList = [
    {
      type: "selection",
      width: 40,
      reserveSelection: true,
      label: "勾选列",
      fixed: "left",
    },
    {
      label: "条码",
      prop: "barcode",
      width: 160,
      align: "center",
    },
    {
      label: "名称",
      prop: "title",
      width: 240,
      align: "center",
    },
    {
      label: "规格型号",
      prop: "spec",
      width: 160,
      align: "center",
      cellRenderer: (scope) => <span>{scope.row.spec || "-"}</span>,
    },
    {
      label: "分类",
      prop: "class_name",
      width: 120,
      align: "center",
    },
    {
      label: "计量单位",
      prop: "measure_name",
      width: 160,
      align: "center",
    },
    {
      label: "品牌",
      width: 160,
      prop: "brand",
      align: "center",
      cellRenderer: (scope) => <span>{scope.row.brand || "-"}</span>,
    },
    {
      label: "自定义类别",
      width: 160,
      prop: "goods_class",
      align: "center",
      cellRenderer: (scope) => <span>{scope.row.goods_class || "-"}</span>,
    },
    {
      label: "默认价格",
      width: 100,
      prop: "purchase_price",
      align: "center",
      cellRenderer: (scope) => <span>{scope.row.purchase_price || "-"}</span>,
    },
    {
      label: "是否标识管理",
      prop: "is_unique_identify",
      width: 110,
      align: "center",
      cellRenderer: (scope) => <span>{scope.row.is_unique_identify ? "是" : "否"}</span>,
    },
    {
      label: "是否费用化资产",
      prop: "is_expensed_assets",
      width: 130,
      align: "center",
      cellRenderer: (scope) => <span>{scope.row.is_expensed_assets ? "是" : "否"}</span>,
    },
    {
      label: "状态",
      slot: "status",
      width: 100,
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation",
    },
  ];

  return {
    columns,
  };
}
