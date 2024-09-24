import type { PaginationProps } from "@pureadmin/table";
import dayjs from "dayjs";
import { useBaseData } from "@/hooks/device/baseData";

export function useList() {
  const { treeData, getBase, getReBase, repairTypeList, faultList, placeList } = useBaseData();
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });

  const formData = ref({
    keyword: "", //关键字
    equipment_type_id: undefined as FormNumType, //资产类型
    use_addr_id: undefined as FormNumType, //使用位置id
    is_stop: undefined as FormNumType, //是否停机
    fault_type: undefined as FormNumType, //故障类型
    repair_type: undefined as FormNumType, //维修类型
    occurrence_time: "", //故障发生时间
  });

  const searchColumns: PlusColumnList = [
    {
      label: "关键字",
      prop: "keyword",
      fieldProps: {
        placeholder: "请输入",
      },
      tooltip: "维修单号/设备编码/资产名称",
    },
    {
      label: "资产类型",
      prop: "equipment_type_id",
    },
    {
      label: "使用部门",
      prop: "use_addr_id",
    },
    {
      label: "维修类型",
      prop: "repair_type",
      valueType: "select",
      options: computed(() => {
        return repairTypeList.value.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      }),
    },
    {
      label: "故障类型",
      prop: "fault_type",
      valueType: "select",
      options: computed(() => {
        return faultList.value.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      }),
    },
    {
      label: "是否停机",
      prop: "is_stop",
      valueType: "select",
      options: [
        {
          label: "是",
          value: 1,
        },
        {
          label: "否",
          value: 0,
        },
      ],
    },
    {
      label: "故障发生时间",
      prop: "occurrence_time",
      labelWidth: 110,
      valueType: "date-picker",
      fieldProps: {
        type: "daterange",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      },
    },
  ];

  const columns: TableColumnList = [
    // {
    //   type: "selection",
    //   width: 60,
    //   reserveSelection: true,
    //   label: "勾选列",
    //   fixed: "left",
    // },
    {
      label: "维修单号",
      prop: "repair_no",
      align: "center",
      minWidth: 110,
    },
    {
      label: "发生时间",
      prop: "occurrence_time",
      align: "center",
      width: 110,
    },
    {
      label: "报修人",
      prop: "ct_name",
      align: "center",
    },
    {
      label: "班次",
      prop: "class_type_text",
      align: "center",
      width: 60,
    },
    {
      label: "设备部位",
      prop: "fault_body",
      align: "center",
    },
    {
      label: "故障类型",
      prop: "fault_type_text",
      align: "center",
    },
    {
      label: "资产名称",
      prop: "bar_title",
      align: "center",
      width: 110,
    },
    {
      label: "使用位置",
      prop: "save_addr_text",
      align: "center",
    },
    {
      label: "所属产线",
      prop: "product_line_text",
      align: "center",
    },
    {
      label: "故障原因",
      prop: "fault_reason_text",
      align: "center",
    },
    {
      label: "是否停机",
      prop: "is_stop",
      align: "center",
      cellRenderer: ({ row }) => {
        return row.is_stop == 1 ? "是" : "否";
      },
    },
    {
      label: "累计误时(分)",
      prop: "stop_time",
      align: "center",
    },
    {
      label: "维修类型",
      prop: "repair_type_text",
      align: "center",
    },
    {
      label: "维修负责人",
      prop: "repair_director_text",
      align: "center",
    },
    {
      label: "其他维修员工",
      prop: "other_repair_director_text",
      align: "center",
    },
    {
      label: "维修描述",
      prop: "repair_note",
      align: "center",
      minWidth: 110,
    },
    {
      label: "故障描述",
      prop: "fault_note",
      align: "center",
      minWidth: 110,
    },
  ];

  return {
    pagination,
    columns,
    searchColumns,
    formData,
    treeData,
    getBase,
    getReBase,
    placeList,
  };
}
