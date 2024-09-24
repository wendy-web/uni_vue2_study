import { formartDate } from "@/utils/validate";

export function useDetail() {
  // 设备信息展示字段
  const columnsOne: PlusColumnList = [
    {
      label: "资产名称",
      prop: "bar_title",
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
      prop: "eq_type_text",
    },
    {
      label: "使用位置",
      prop: "save_addr_text",
    },
    {
      label: "使用部门",
      prop: "use_dept_text",
    },
    {
      label: "使用负责人",
      prop: "use_duty_user_text",
    },
  ];
  //      故障信息展示字段
  const columnsTwo: PlusColumnList = [
    {
      label: "发生时间",
      prop: "occurrence_time",
    },
    {
      label: "报修人",
      prop: "repair_user_id_text",
    },
    {
      label: "设备部位",
      prop: "fault_body",
    },
    {
      label: "所属产线",
      prop: "product_line_text",
      valueType: "select",
    },
    {
      label: "故障描述",
      prop: "fault_note",
      descriptionsItemProps: {
        span: 2,
      },
    },
    {
      label: "故障图片",
      prop: "fault_picture",
      descriptionsItemProps: {
        span: 3,
      },
    },
  ];

  //   维修处理情况 展示字段
  const columnsThree: PlusColumnList = [
    {
      label: "维修类型",
      prop: "repair_type_text",
    },
    {
      label: "故障原因",
      prop: "fault_reason_text",
    },
    {
      label: "故障类型",
      prop: "fault_type_text",
    },
    {
      label: "维修负责人",
      prop: "repair_director_text",
    },
    {
      label: "其他维修员工",
      prop: "other_repair_director_text",
    },
    {
      label: "维修开始时间",
      prop: "repair_start_time",
    },
    {
      label: "维修结束时间",
      prop: "repair_end_time",
    },
    {
      label: "是否停机",
      prop: "is_stop",
      valueType: "select",
      options: [
        {
          label: "是",
          value: 1,
          color: "blue",
        },
        {
          label: "否",
          value: 0,
          color: "blue",
        },
      ],
    },

    {
      label: "累计误时(分)",
      prop: "stop_time",
    },
    {
      label: "外委单位",
      prop: "outsourcing_text",
    },
    {
      label: "维修费用(元)",
      prop: "repair_price",
      descriptionsItemProps: {
        span: 2,
      },
    },
    {
      label: "维修描述",
      prop: "repair_note",
      descriptionsItemProps: {
        span: 3,
      },
    },
    {
      label: "维修图片",
      prop: "repair_picture",
      descriptionsItemProps: {
        span: 3,
      },
    },
  ];

  // 是否更换备件
  const columnsFour: PlusColumnList = [
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

  // 换上备件领用单列表字段
  const orderColumns: PlusColumnList = [
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
      prop: "name",
      align: "center",
    },
    {
      label: "操作类型",
      prop: "content",
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
    columnsFour,
    orderColumns,
    downColumns,
    logColumns,
  };
}
