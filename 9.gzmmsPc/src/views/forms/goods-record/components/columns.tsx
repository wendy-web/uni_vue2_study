import { formartDate } from "@/utils/validate";

export function useLabel() {
  const columns: TableColumnList = [
    {
      label: "标签码",
      slot: "qrcode",
      width: 80,
    },
    {
      label: "类型",
      prop: "barcode",
      align: "center",
      width: 100,
      cellRenderer: (scope) => (
        <>
          {scope.row.label_type == 1 ? (
            <span>商品二维码</span>
          ) : scope.row.label_type == 2 ? (
            <span>明细二维码</span>
          ) : (
            <span>唯一标签</span>
          )}
        </>
      ),
    },
    {
      label: "标识编码ID",
      prop: "code",
      align: "center",
      //   width: 140,
    },
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
      label: "可用库存",
      prop: "stock_qty",
      align: "center",
      width: 100,
    },
    {
      label: "数量",
      prop: "num",
      align: "center",
      width: 100,
    },
    {
      label: "入库日期",
      prop: "in_wh_date",
      align: "center",
      minWidth: 110,
      cellRenderer: ({ row }) => {
        return formartDate(row.in_wh_date);
      },
    },
    {
      label: "批次/日期",
      prop: "batch_number",
      align: "center",
      minWidth: 110,
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
