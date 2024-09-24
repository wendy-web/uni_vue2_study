export function useTableList() {
  /** GoodsBatch 组件使用 */
  const defaultList: TableColumnList = [
    {
      type: "selection",
      width: 40,
      reserveSelection: true,
      selectable: (row: any) => {
        // console.log('row',row)
        return !row.select_status;
      },
      fixed: "left",
    },
    {
      prop: "barcode",
      label: "条码",
      width: 140,
      cellRenderer: ({ row }) => <span class={[row.flag && "text-orange-500"]}>{row.barcode}</span>,
    },
    {
      prop: "title",
      label: "名称",
    },
    {
      prop: "spec",
      label: "规格型号",
    },
    {
      prop: "measure_name",
      label: "单位",
    },
    {
      prop: "brand",
      label: "品牌",
    },
    {
      prop: "class_name",
      label: "分类",
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operations",
    },
  ];

  /** InStoBatchSelect组件使用 */
  const list: TableColumnList = [
    {
      type: "selection",
      width: 40,
      reserveSelection: true,
      selectable: (row: any) => {
        // console.log('row',row)
        return !row.select_status;
      },
      fixed: "left",
    },
    {
      prop: "barcode",
      label: "条码",
      width: 140,
    },
    {
      prop: "title",
      label: "名称",
    },
    {
      prop: "spec",
      label: "规格型号",
      minWidth: 90
    },
    {
      prop: "stock",
      label: "可用库存",
      minWidth: 90
    },
    // {
    //   prop: "price",
    //   label: "单价",
    // },
    {
      prop: "ws_code",
      label: "库位",
    },
    {
      prop: "in_wh_date",
      label: "入库日期",
      minWidth: 90
    },
    {
      prop: "measure_name",
      label: "单位",
    },
    {
      prop: "warehouse_name",
      label: "仓库",
    },
    {
      prop: "brand",
      label: "品牌",
    },

    {
      prop: "batch_number",
      label: "批次/日期",
      minWidth: 90
    },
    {
      prop: "pro_time",
      label: "生产日期",
      minWidth: 90
    },
    {
      prop: "exp_time",
      label: "到期日期",
      minWidth: 90
    },
    {
      prop: "class_name",
      label: "分类",
    },
    {
      prop: "sup_name",
      label: "供应商",
    },
    {
      label: "操作",
      slot: "operations",
      fixed: "right",
    },
  ];

  return {
    defaultList,
    list,
  };
}
