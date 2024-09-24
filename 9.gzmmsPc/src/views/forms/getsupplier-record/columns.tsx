import type { PlusColumn } from "plus-pro-components";
import { formartDate } from "@/utils/validate";
import { useSearchFrom } from "@/hooks/searchForm";

export function useList() {
  const { classList, storageList, userList } = useSearchFrom();

  const defaultColumns: TableColumnList = [
    {
      type: "selection",
      width: 60,
      reserveSelection: true,
      fixed: "left",
      label: "勾选列",
    },
    {
      label: "领料出库单号",
      prop: "wh_rec_no",
      align: "center",
      width: 120,
    },
    {
      label: "制单人",
      prop: "ct_name",
      align: "center",
      sortable: true,
      minWidth: 100,
    },
    {
      label: "领料申请人",
      prop: "rp_name",
      align: "center",
      sortable: true,
      width: 120,
    },
    {
      label: "指定领取人",
      prop: "ar_names",
      align: "center",
      sortable: true,
      width: 120,
      cellRenderer: (scope) => <span>{scope.row.ar_names || "-"}</span>,
    },
    {
      label: "领料类型",
      prop: "rec_type_name",
      align: "center",
      sortable: true,
      width: 110,
    },
    {
      label: "出库日期",
      prop: "out_time",
      align: "center",
      cellRenderer: (scope) => <span>{formartDate(scope.row.out_time) || "-"}</span>,
      sortable: true,
      width: 110,
    },
    {
      label: "条码",
      prop: "barcode",
      align: "center",
      headerSlot: "barcode",
      sortable: true,
      width: 130,
    },
    {
      label: "名称",
      prop: "title",
      align: "center",
      sortable: true,
    },
    {
      label: "规格型号",
      prop: "spec",
      align: "center",
      cellRenderer: (scope) => <span>{scope.row.spec || "-"}</span>,
      headerSlot: "spec",
      sortable: true,
      width: 130,
    },
    {
      label: "品牌",
      prop: "brand",
      align: "center",
      cellRenderer: (scope) => <span>{scope.row.brand || "-"}</span>,
      headerSlot: "brand",
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
      width: 100,
    },
    {
      label: "批次/日期",
      prop: "ph_no",
      align: "center",
      cellRenderer: (scope) => <span>{scope.row.ph_no || "-"}</span>,
      headerSlot: "ph_no",
      sortable: true,
      width: 140,
    },
    {
      label: "出库仓库",
      prop: "warehouse_name",
      align: "center",
      sortable: true,
      width: 130,
    },
    {
      label: "使用地点",
      prop: "use_places",
      align: "center",
      minWidth: 90,
    },
    {
      label: "申请数量",
      prop: "rec_num",
      align: "center",
      sortable: true,
      width: 110,
    },
    {
      label: "已领数量",
      prop: "received_num",
      align: "center",
      sortable: true,
      width: 110,
    },
  ];

  const columns: TableColumnList = [
    ...defaultColumns,
    {
      label: "单价",
      prop: "price",
      align: "center",
      width: 100,
    },
  ];

  const searchColumns: PlusColumn[] = [
    {
      label: "关键字",
      tooltip: "关键字: 商品名称、条码、型号、品牌搜索",
      prop: "keyword",
    },
    {
      label: "所属分类",
      prop: "class_name",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择所属分类",
      },
      options: () => {
        return classList;
      },
    },
    {
      label: "部门",
      prop: "dept_id",
      labelWidth: 60,
    },
    {
      label: "出库仓库",
      prop: "warehouse_id",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择出库仓库",
      },
      options: () => {
        return storageList;
      },
    },
    {
      label: "领料申请人",
      prop: "rp_uid",
      valueType: "select",
      labelWidth: 90,
      fieldProps: {
        placeholder: "请选择领料申请人",
        clearable: true,
        filterable: true,
      },
      options: () => {
        return userList;
      },
    },
    {
      label: "领料类型",
      prop: "rec_type",
      valueType: "select",
      labelWidth: 90,
      fieldProps: {
        placeholder: "请选择领料类型",
        clearable: true,
        filterable: true,
      },
      options: () => {
        return [
          {
            label: "物业",
            value: 1,
          },
          {
            label: "维修",
            value: 2,
          },
          {
            label: "保养",
            value: 3,
          },
        ];
      },
    },
    {
      label: "出库日期",
      prop: "time",
      valueType: "date-picker",
      fieldProps: {
        type: "daterange",
        rangeSeparator: "至",
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      },
    },
  ];

  return {
    defaultColumns,
    columns,
    searchColumns,
  };
}
