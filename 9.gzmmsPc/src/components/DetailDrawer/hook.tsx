import { formartDate } from "@/utils/validate";

export function useBuyInDetail() {
  const columns: TableColumnList = [
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
      label: "入库数量",
      prop: "in_num",
      align: "center",
      width: 100,
    },
    {
      label: "入库仓库",
      prop: "warehouse_name",
      align: "center",
      width: 100,
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
      label: "单位",
      prop: "measure_name",
      align: "center",
    },
    {
      label: "单价(元)",
      prop: "price",
      align: "center",
      width: 100,
    },
    {
      label: "分类",
      prop: "class_name",
      align: "center",
    },
    {
      label: "批次/日期",
      prop: "ph_no",
      align: "center",
      width: 110,
      cellRenderer: (scope) => <span>{scope.row.ph_no || "-"}</span>,
    },
    {
      label: "生产日期",
      prop: "pro_time",
      align: "center",
      width: 110,
      cellRenderer: (scope) => <span>{formartDate(scope.row.delivery_time)}</span>,
    },
    {
      label: "备注",
      prop: "note",
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
    columns,
    logsColumns,
  };
}
