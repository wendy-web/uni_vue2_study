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
      label: "采购数量",
      prop: "num",
      align: "center",
      width: 100,
    },
    {
      label: "待入库数量",
      prop: "rem_num",
      align: "center",
      width: 100,
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
