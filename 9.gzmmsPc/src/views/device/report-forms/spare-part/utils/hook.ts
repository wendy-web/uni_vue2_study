import type { PaginationProps } from "@pureadmin/table";
import { useBaseData } from "@/hooks/device/baseData";

export function useList() {
  const { treeData, departmentList, placeList, getBase } = useBaseData();
  const formData = ref({
    keyword: "",
    equipment_type_id: undefined as FormNumType,
    use_addr_id: undefined as FormNumType,
    use_dept_id: undefined as FormNumType,
    change_type: [] as number[],
    chage_date_time: undefined as FormNumType,
    down_date_time: undefined as FormNumType,
    create_time: undefined as FormNumType,
    // is_unique: 0,
  });
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });
  const columns: TableColumnList = [
    // {
    //   type: "selection",
    //   width: 60,
    //   reserveSelection: true,
    //   label: "勾选列",
    //   fixed: "left",
    // },
    {
      type: "expand",
      slot: "expand",
      width: 40,
      label: "#",
      fixed: "left",
    },
    {
      label: "换上关联单号",
      prop: "order_no",
      align: "center",
      minWidth: 110,
    },
    {
      label: "换上单据类型",
      prop: "chage_type",
      align: "center",
      minWidth: 110,
    },
    {
      label: "换上时间",
      prop: "chage_date",
      align: "center",
      minWidth: 110,
    },
    // {
    //   label: "换下时间",
    //   prop: "down_date",
    //   align: "center",
    //   minWidth: 110,
    // },
    // {
    //   label: "使用时长",
    //   prop: "use_duration",
    //   align: "center",
    // },
    {
      label: "领料出库单号",
      prop: "re_no",
      align: "center",
      minWidth: 110,
    },
    {
      label: "出库仓库",
      prop: "out_ware",
      align: "center",
    },
    // {
    //   label: "备件标记",
    //   prop: "eq_mark",
    //   align: "center",
    // },
    {
      label: "条码",
      prop: "barcode",
      align: "center",
      minWidth: 110,
    },
    {
      label: "名称",
      prop: "title",
      align: "center",
      minWidth: 110,
    },
    {
      label: "规格型号",
      prop: "spec",
      align: "center",
      minWidth: 110,
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
      label: "申请数",
      prop: "apply_num",
      align: "center",
    },
    {
      label: "已发数",
      prop: "received_num",
      align: "center",
    },
    {
      label: "入库日期",
      prop: "in_wh_date",
      align: "center",
    },
    {
      label: "供应商",
      prop: "sup_name",
      align: "center",
    },
    {
      label: "使用位置",
      prop: "use_places",
      align: "center",
    },
    {
      label: "使用数量",
      prop: "use_num",
      align: "center",
    },
    {
      label: "单价",
      prop: "price",
      align: "center",
    },
    {
      label: "金额",
      prop: "amount",
      align: "center",
    },
    {
      label: "资产编码",
      prop: "asset_no",
      align: "center",
    },
    {
      label: "使用设备",
      prop: "bar_title",
      align: "center",
      minWidth: 110,
    },
    {
      label: "设备位置",
      prop: "save_places",
      align: "center",
    },
    {
      label: "换下关联单号",
      prop: "down_no",
      align: "center",
      minWidth: 110,
    },
    {
      label: "换下单据类型",
      prop: "down_type",
      align: "center",
      minWidth: 110,
    },
    {
      label: "下线数量",
      prop: "down_num",
      align: "center",
    },
  ];

  const searchColumns: PlusColumnList = [
    {
      label: "关键字",
      prop: "keyword",
      fieldProps: {
        placeholder: "请输入",
      },
      tooltip: "维修单号/备件条码/备件名称/品牌/型号",
    },
    {
      label: "资产类型",
      prop: "equipment_type_id",
    },
    {
      label: "使用位置",
      prop: "use_addr_id",
    },
    {
      label: "使用部门",
      prop: "use_dept_id",
    },

    {
      label: "换上时间",
      prop: "chage_date_time",
      labelWidth: 100,
      valueType: "date-picker",
      fieldProps: {
        placeholder: "请选择日期",
        type: "daterange",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      },
    },
    {
      label: "换下时间",
      prop: "down_date_time",
      labelWidth: 100,
      valueType: "date-picker",
      fieldProps: {
        placeholder: "请选择日期",
        type: "daterange",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      },
    },
    {
      label: "换上单据类型",
      prop: "change_type",
      valueType: "select",
      labelWidth: 110,
      fieldProps: {
        multiple: true,
      },
      options: [
        {
          label: "维修单",
          value: 0,
        },
        {
          label: "保养单",
          value: 1,
        },
      ],
    },
    // {
    //   label: "备件标记",
    //   valueType: "plus-radio",
    //   prop: "is_unique",
    //   options: [
    //     {
    //       label: "唯一标识",
    //       value: 1,
    //     },
    //   ],
    // },
  ];

  const childColumns: TableColumnList = [
    {
      label: "换上时间",
      prop: "chage_date",
      align: "center",
      minWidth: 110,
    },
    {
      label: "换下时间",
      prop: "down_date",
      align: "center",
      minWidth: 110,
    },
    {
      label: "使用时长",
      prop: "use_duration",
      align: "center",
    },
    {
      label: "换下关联单号",
      prop: "down_no",
      align: "center",
    },
    {
      label: "换下单据类型",
      prop: "down_type",
      align: "center",
    },
    {
      label: "下线数量",
      prop: "down_num",
      align: "center",
    },
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
      label: "品牌",
      prop: "brand",
      align: "center",
    },
    {
      label: "供应商",
      prop: "sup_name",
      align: "center",
    },
    {
      label: "资产编码",
      prop: "asset_no",
      align: "center",
    },
    {
      label: "使用设备",
      prop: "bar_title",
      align: "center",
    },
    {
      label: "使用位置",
      prop: "save_places",
      align: "center",
    },
  ];

  const filterList = ["re_no", "out_ware", "class_name", "apply_num", "received_num", "in_wh_date"];

  return {
    pagination,
    columns,
    searchColumns,
    treeData,
    departmentList,
    placeList,
    getBase,
    formData,
    childColumns,
    filterList,
  };
}
