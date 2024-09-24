export function userPrint() {
  const columns: TableColumnList = [
    {
      label: "货品条码",
      prop: "barcode",
      align: "center",
      //   width: 140,
    },
    {
      label: "名称",
      prop: "title",
      align: "center",
      //   width: 200,
    },
    {
      label: "规格型号",
      prop: "spec",
      align: "center",
      //   width: 100,
      showOverflowTooltip: true,
    },
    {
      label: "打印数量",
      prop: "print_num",
      align: "center",
      headerRenderer: (scope) => <span class=" text-orange-500">打印数量(最大10)</span>,
      slot: "printNum",
      width: 110,
    },
    {
      label: "入库数量",
      prop: "in_num",
      align: "center",
      width: 90,
    },
    {
      label: "库位",
      prop: "ws_code",
      align: "center",
      width: 160,
    },
    {
      label: "操作",
      slot: "operation",
    },
  ];
  return {
    columns,
  };
}
