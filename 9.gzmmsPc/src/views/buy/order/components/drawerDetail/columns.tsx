import { formartDate } from "@/utils/validate";

export function useDrawer() {
  const waitColumns: TableColumnList = [
    {
      label: "货品条码",
      prop: "barcode",
      align: "center",
      width: 100,
    },
    {
      label: "名称",
      prop: "title",
      align: "center",
    },
    {
      label: "规格型号",
      prop: "spec",
      align: "center",
      width: 100,
      showOverflowTooltip: true,
    },
    {
      label: "品牌",
      prop: "brand",
      align: "center",
    },
    {
      label: "分类",
      prop: "class_name",
      align: "center",
    },
    {
      label: "单位",
      prop: "measure_name",
      align: "center",
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
      label: "采购单价",
      prop: "price",
      align: "center",
      width: 100,
    },
    {
      label: "小计",
      prop: "sub_total",
      align: "center",
    },
    {
      label: "供应商",
      prop: "sup_name",
      align: "center",
      width: 100,
    },
    {
      label: "需求部门",
      prop: "dept.name",
      align: "center",
      width: 100,
    },
    {
      label: "提交日期",
      prop: "submit_time",
      align: "center",
      width: 110,
      cellRenderer: (scope) => <span>{formartDate(scope.row.submit_time)}</span>,
    },
    {
      label: "交货期",
      prop: "delivery_time",
      align: "center",
      width: 110,
      cellRenderer: (scope) => <span>{formartDate(scope.row.delivery_time)}</span>,
    },
    {
      label: "合同号",
      prop: "contract_no",
      align: "center",
    },
    {
      label: "备注",
      prop: "note",
      align: "center",
    },
  ];

  const detailColumns: TableColumnList = [
    {
      label: "操作",
      align: "center",
      slot: "operation",
      width: 124,
    },
    {
      label: "货品条码",
      prop: "barcode",
      align: "center",
      width: 100,
    },
    {
      label: "名称",
      prop: "title",
      align: "center",
    },
    {
      label: "规格型号",
      prop: "spec",
      align: "center",
      width: 100,
      showOverflowTooltip: true,
    },
    {
      label: "品牌",
      prop: "brand",
      align: "center",
    },
    {
      label: "分类",
      prop: "class_name",
      align: "center",
    },
    {
      label: "单位",
      prop: "measure_name",
      align: "center",
    },
    {
      label: "采购数量",
      prop: "num",
      align: "center",
      width: 100,
    },
    {
      label: "采购单价",
      prop: "price",
      align: "center",
      width: 100,
    },
    {
      label: "小计",
      prop: "sub_total",
      align: "center",
    },
    {
      label: "供应商",
      prop: "sup_name",
      align: "center",
      width: 100,
    },
    {
      label: "需求部门",
      prop: "dept.name",
      align: "center",
      width: 100,
    },
    {
      label: "提交日期",
      prop: "submit_time",
      align: "center",
      width: 110,
      cellRenderer: (scope) => <span>{formartDate(scope.row.submit_time)}</span>,
    },
    {
      label: "交货期",
      prop: "delivery_time",
      align: "center",
      width: 110,
      cellRenderer: (scope) => <span>{formartDate(scope.row.delivery_time)}</span>,
    },
    {
      label: "合同号",
      prop: "contract_no",
      align: "center",
    },
    {
      label: "备注",
      prop: "note",
      align: "center",
    },
  ];

  const outColumns: TableColumnList = [
    {
      label: "条码",
      prop: "barcode",
      align: "center",
    },
    {
      label: "名称",
      prop: "title",
      align: "center",
    },
    {
      label: "规格型号",
      prop: "spec",
      align: "center",
    },
    {
      label: "单位",
      prop: "measure_name",
      align: "center",
    },
    {
      label: "退货数量",
      prop: "ret_num",
      align: "center",
    },
    {
      label: "供应商",
      prop: "sup_name",
      align: "center",
    },
    {
      label: "备注",
      prop: "note",
      align: "center",
    },
  ];

  const inColumns: TableColumnList = [
    {
      label: "名称",
      prop: "title",
      align: "center",
    },
    {
      label: "规格型号",
      prop: "spec",
      align: "center",
    },
    {
      label: "入库数量",
      prop: "in_num",
      align: "center",
    },
  ];

  const logsColumns: TableColumnList = [
    {
      label: "操作人",
      prop: "ct_name",
      align: "center",
    },
    {
      label: "操作类型",
      prop: "spec",
      align: "center",
      cellRenderer: (scope) => (
        <>
          <span>{scope.row.act}</span>
          {scope.row.act_msg ? <span>{scope.row.act_msg}</span> : null}
        </>
      ),
    },
    {
      label: "时间",
      prop: "create_time",
      align: "center",
      width: 170,
    },
  ];

  return {
    waitColumns,
    detailColumns,
    outColumns,
    inColumns,
    logsColumns,
  };
}
