import { ElSelect } from "element-plus";
import { formartDate } from "@/utils/validate";

export type ElSelectType = InstanceType<typeof ElSelect>;

export function useOrderList() {
  const columns: TableColumnList = [
    {
      label: "其他出库单号",
      prop: "wh_ret_no",
      width: 160,
      align: "center",
    },
    {
      label: "采购单号",
      prop: "procure_no",
      width: 160,
      align: "center",
    },
    {
      label: "退货日期",
      prop: "return_time",
      width: 110,
      align: "center",
      cellRenderer: (scope) => <span>{formartDate(scope.row.return_time) || "-"}</span>,
    },
    {
      label: "出库日期",
      prop: "out_time",
      width: 110,
      align: "center",
      cellRenderer: (scope) => <span>{formartDate(scope.row.out_time) || "-"}</span>,
    },
    {
      label: "商品明细",
      prop: "product_name",
      // width: 160,
      align: "center",
      showOverflowTooltip: true,
    },

    {
      label: "单据备注",
      prop: "note",
      width: 200,
      align: "center",
      showOverflowTooltip: true,
      cellRenderer: (scope) => <span>{scope.row.note || "-"}</span>,
    },
    {
      label: "制单人",
      prop: "ct_name",
      align: "center",
    },
    {
      label: "创建时间",
      width: 180,
      prop: "create_time",
      align: "center",
    },
    {
      label: "状态",
      width: 100,
      align: "center",
      slot: "status",
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

export function useColumns() {
  const importColumns: TableColumnList = [
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
      label: "可出库数",
      prop: "ret_num",
    },
    {
      label: "批次/日期",
      prop: "ph_no",
    },
    {
      label: "库位",
      prop: "ws_code",
    },
    {
      label: "入库日期",
      prop: "in_wh_date",
    },
    {
      label: "备注",
      prop: "note",
    },
  ];

  const directColumns: TableColumnList = [
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
      label: "出库仓库",
      prop: "warehouse_name",
    },
    {
      label: "出库数量",
      prop: "ret_num",
    },
    {
      label: "批次/日期",
      prop: "ph_no",
    },

    {
      label: "备注",
      prop: "note",
    },
  ];
  return {
    importColumns,
    directColumns,
  };
}
