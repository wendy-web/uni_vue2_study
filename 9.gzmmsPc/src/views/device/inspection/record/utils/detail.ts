import { useCommon } from "@/hooks/device/baseData";

export function useDetail() {
  const { getInspecCycleName, getRecordName, getRulePlanTime, getExecutiveRuleName, getLimitVal } =
    useCommon();
  // 设备信息展示字段
  const columnsOne: PlusColumnList = [
    {
      label: "检查单号",
      prop: "point_no",
    },
    {
      label: "计划明细单号",
      prop: "plan_details_no",
    },
    {
      label: "资产名称",
      prop: "bar_title",
    },
    {
      label: "设备编码",
      prop: "asset_no",
    },
    {
      label: "资产条码",
      prop: "barcode",
    },
    {
      label: "规格型号",
      prop: "spec",
    },
    {
      label: "资产类型",
      prop: "equipment_type_text",
    },
    {
      label: "使用位置",
      prop: "save_addr_text",
    },
    {
      label: "使用部门",
      prop: "use_dept_names",
    },
  ];

  const columns: TableColumnList = [
    {
      label: "检查内容",
      prop: "item_content",
      align: "center",
    },
    {
      label: "检验方法",
      prop: "method",
      align: "center",
    },
    {
      label: "检查标准说明",
      prop: "std_explain",
      align: "center",
    },
    {
      label: "记录方式",
      prop: "record_method",
      align: "center",
      width: 80,
      cellRenderer: ({ row }) => {
        return getRecordName(row.record_method);
      },
    },
    {
      label: "结果选项",
      align: "center",
      slot: "select",
      minWidth: 200,
    },
    {
      label: "上限",
      prop: "upper_limit_val",
      align: "center",
      minWidth: 60,
      cellRenderer: ({ row }) => {
        return getLimitVal(row.record_method, row.upper_limit_val);
      },
    },
    {
      label: "下限",
      prop: "lower_limit_val",
      align: "center",
      minWidth: 60,
      cellRenderer: ({ row }) => {
        return getLimitVal(row.record_method, row.lower_limit_val);
      },
    },
    {
      label: "备注",
      prop: "note",
      align: "center",
      slot: "note",
      minWidth: 60,
    },
  ];

  const rectifyDetailColumns: PlusColumnList = [
    {
      label: "整改时间",
      prop: "rectify_time",
    },
    {
      label: "整改反馈",
      prop: "rectify_feedback",
    },
    {
      label: "整改后照片",
      prop: "rectify_picture",
    },
  ];

  return {
    columnsOne,
    getInspecCycleName,
    columns,
    rectifyDetailColumns,
    getRulePlanTime,
    getExecutiveRuleName,
  };
}
