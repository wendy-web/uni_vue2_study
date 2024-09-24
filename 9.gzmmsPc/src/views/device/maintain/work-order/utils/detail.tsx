import { ElTag } from "element-plus";
import { formartDate } from "@/utils/validate";

export function useDetail() {
  // 设备信息展示字段
  const columnsOne: PlusColumnList = [
    {
      label: "保养单号",
      prop: "maintenance_order_no",
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
      prop: "equipment_type_title",
    },
    {
      label: "使用位置",
      prop: "save_addr_names",
    },
    {
      label: "使用部门",
      prop: "use_dept_names",
    },
  ];

  // 保养处理情况显示字段
  const columnsTwo: PlusColumnList = [
    {
      label: "计划执行时间",
      prop: "plan_start_time",
    },
    {
      label: "任务开始时间",
      prop: "maintenance_start_time",
    },
    {
      label: "任务结束时间",
      prop: "complete_time",
    },
    {
      label: "保养负责人",
      prop: "director_names",
    },
    {
      label: "其他保养人",
      prop: "other_names",
    },
    {
      label: "外委单位",
      prop: "outsourced_units_name",
    },
    {
      label: "保养费用",
      prop: "maintenance_cost",
    },
    {
      label: "保养描述",
      prop: "maintenance_desc",
      descriptionsItemProps: {
        span: 2,
      },
    },
    {
      label: "保养图片",
      prop: "img_info",
    },
  ];

  //   是否更换备件
  const columnsThree: PlusColumnList = [
    {
      label: "是否更换备件",
      prop: "is_replace",
      valueType: "select",
      options: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
    },
  ];

  const standardColumns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      align: "center",
      width: 60,
    },
    {
      label: "项目标准名称",
      prop: "name",
      align: "center",
    },
    {
      label: "保养部位",
      prop: "maintenance_area",
      align: "center",
    },
    {
      label: "保养要求/标准",
      prop: "maintenance_requirements",
      align: "center",
    },
    {
      label: "已保养/未保养",
      prop: "is_maintain",
      align: "center",
      // cellRenderer: ({ row }) => {
      //   return row.is_maintain ? "已保养" : "未保养";
      // },
      cellRenderer: ({ row }) => (
        <>
          <ElTag type={row.is_maintain ? "" : "warning"}>
            {row.is_maintain ? "已保养" : "未保养"}
          </ElTag>
        </>
      ),
    },
    {
      label: "备注",
      prop: "note",
      align: "center",
    },
  ];

  // 换上备件领用单列表字段
  const orderColumns: TableColumnList = [
    {
      label: "领料出库单号",
      prop: "re_no",
      align: "center",
      minWidth: 130,
    },
    {
      label: "换上日期",
      prop: "chage_date",
      align: "center",
      minWidth: 110,
    },
    {
      label: "出库日期",
      prop: "out_date",
      align: "center",
      minWidth: 110,
    },
    {
      label: "条码",
      prop: "barcode",
      align: "center",
      minWidth: 120,
    },
    {
      label: "名称",
      prop: "title",
      align: "center",
      minWidth: 120,
    },
    {
      label: "规格型号",
      prop: "spec",
      align: "center",
      minWidth: 120,
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
      label: "出库仓库",
      prop: "out_ware",
      align: "center",
    },
    {
      label: "已领数",
      prop: "received_num",
      align: "center",
    },
    {
      label: "待用数",
      prop: "rem_num",
      align: "center",
    },
    {
      label: "使用数",
      prop: "use_num",
      align: "center",
      slot: "use_num",
      fixed: "right",
      minWidth: 140,
    },
  ];
  // 换下备件列表显示字段
  const downColumns: TableColumnList = [
    {
      label: "换上关联单号",
      prop: "order_no",
      align: "center",
      minWidth: 130,
    },
    {
      label: "单据类型",
      prop: "type_text",
      align: "center",
    },
    {
      label: "换上时间",
      prop: "chage_date",
      align: "center",
      minWidth: 110,
      cellRenderer: (scope) => {
        return formartDate(scope.row.chage_date);
      },
    },
    {
      label: "换下时间",
      prop: "down_date",
      align: "center",
      minWidth: 110,
      cellRenderer: (scope) => {
        return formartDate(scope.row.down_date);
      },
    },
    {
      label: "领料出库单号",
      prop: "re_no",
      align: "center",
      minWidth: 130,
    },
    {
      label: "出库仓库",
      prop: "out_ware",
      align: "center",
    },
    {
      label: "条码",
      prop: "barcode",
      align: "center",
      minWidth: 120,
    },
    {
      label: "名称",
      prop: "title",
      align: "center",
      minWidth: 120,
    },
    {
      label: "规格型号",
      prop: "spec",
      align: "center",
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
      label: "入库日期",
      prop: "in_wh_date",
      align: "center",
      minWidth: 110,
    },
    {
      label: "供应商",
      prop: "sup_name",
      align: "center",
    },
    {
      label: "使用位置",
      prop: "use_addr",
      align: "center",
    },
    {
      label: "使用数量",
      prop: "use_num",
      align: "center",
    },
    // {
    //   label: "在线数量",
    //   prop: "online_num",
    //   align: "center",
    // },
    {
      label: "换下数量",
      prop: "down_num",
      align: "center",
      slot: "down_num",
      fixed: "right",
      minWidth: 140,
    },
  ];

  const logColumns: TableColumnList = [
    {
      label: "操作人",
      prop: "ct_name",
      align: "center",
    },
    {
      label: "操作类型",
      prop: "act",
      align: "center",
    },
    {
      label: "时间",
      prop: "create_time",
      align: "center",
    },
  ];
  

  return {
    columnsOne,
    columnsTwo,
    columnsThree,
    standardColumns,
    orderColumns,
    downColumns,
    logColumns
  };
}
