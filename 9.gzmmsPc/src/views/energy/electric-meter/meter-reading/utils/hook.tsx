import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
import { useSelectData } from "@/views/energy/hooks/index";

export function useList(handleSearch: () => void) {
  const {
    purposeOptions,
    getPlaceList,
    placeList,
    getUserList,
    getPurposeName,
    getClassNoName,
    getRelData,
    relList,
  } = useSelectData();

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });

  const formData = ref({
    keyword: "", //关键字
    rel_id: undefined as FormNumType, // 采集表id,
    bar_title: "", //资产名称
    save_addr: undefined as FormNumType, //使用位置id
    ct_uid: undefined as FormNumType, //抄表人id
    purpose: undefined as FormNumType, //用途
    this_meter_time: "", //抄表日期
    create_time: "", //创建日期
  });

  const searchColumns: PlusColumnList = [
    {
      label: "关键字",
      prop: "keyword",
      onKeyup: withKeys(() => {
        handleSearch();
      }, ["enter"]),
    },
    {
      label: "资产名称",
      prop: "bar_title",
      onKeyup: withKeys(() => {
        handleSearch();
      }, ["enter"]),
    },
    {
      label: "使用位置",
      prop: "save_addr",
    },
    {
      label: "抄表人",
      prop: "ct_uid",
      valueType: "select",
      options: getUserList,
    },
    {
      label: "用途",
      prop: "purpose",
      valueType: "select",
      options: purposeOptions,
    },
    {
      label: "抄表日期",
      prop: "this_meter_time",
      labelWidth: 90,
      valueType: "date-picker",
      fieldProps: {
        placeholder: "请选择日期",
        type: "daterange",
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      },
    },
    {
      label: "创建日期",
      prop: "create_time",
      labelWidth: 90,
      valueType: "date-picker",
      fieldProps: {
        placeholder: "请选择日期",
        type: "daterange",
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      },
    },
  ];

  const columns: TableColumnList = [
    {
      label: "抄表流水号",
      prop: "serial_number_no",
      align: "center",
    },
    {
      label: "采集表名",
      prop: "rel_name",
      align: "center",
    },
    {
      label: "倍率",
      prop: "multiplier",
      align: "center",
    },
    {
      label: "上次抄表(起码读数)",
      prop: "start_num",
      align: "center",
    },
    {
      label: "上次抄表时间",
      prop: "last_meter_time",
      align: "center",
      width: 110,
    },
    {
      label: "本次抄表(止码读数)",
      prop: "end_num",
      align: "center",
    },
    {
      label: "本次抄表时间",
      prop: "this_meter_time",
      align: "center",
      width: 110,
    },
    {
      label: "绑定设备编码",
      prop: "asset_no",
      align: "center",
    },
    {
      label: "使用位置",
      prop: "use_addr_text",
      align: "center",
    },
    {
      label: "班别",
      prop: "class_no",
      align: "center",
      cellRenderer: ({ row }) => {
        return getClassNoName(row.class_no);
      },
    },
    {
      label: "班次",
      prop: "class_type_text",
      align: "center",
    },
    {
      label: "用量",
      prop: "dosage_num",
      align: "center",
    },
    {
      label: "用途",
      prop: "purpose",
      align: "center",
      cellRenderer: ({ row }) => {
        return getPurposeName(row.purpose);
      },
    },
    {
      label: "是否生产",
      prop: "is_produce",
      align: "center",
      cellRenderer: ({ row }) => {
        return row.is_produce === 1 ? "是" : "否";
      },
    },
    {
      label: "抄表日期",
      prop: "meter_readings_time",
      align: "center",
      width: 110,
    },
    {
      label: "抄表人",
      prop: "meter_readings_name",
      align: "center",
    },
    {
      label: "备注",
      prop: "note",
      align: "center",
    },
    {
      label: "是否有效",
      prop: "is_valid",
      align: "center",
      cellRenderer: ({ row }) => {
        return row.is_valid === 1 ? "是" : "否";
      },
    },
    {
      label: "操作",
      align: "center",
      slot: "operation",
      fixed: "right",
    },
  ];

  return {
    pagination,
    columns,
    searchColumns,
    formData,
    getPlaceList,
    placeList,
    getRelData,
    relList,
  };
}
