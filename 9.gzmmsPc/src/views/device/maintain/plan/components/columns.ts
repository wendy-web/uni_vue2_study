import type { PaginationProps } from "@pureadmin/table";
import type { IdNameType } from "@/api/device/common/types";
import { useCommon } from "@/hooks/device/baseData";

export function useStandard() {
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });

  const columns: TableColumnList = [
    {
      type: "selection",
      width: 60,
      reserveSelection: true,
      label: "勾选列",
      fixed: "left",
      selectable: (row: any) => {
        return !row.select_status;
      },
    },
    {
      label: "项目标准名称",
      prop: "name",
      align: "center",
    },
    {
      label: "保养要求/标准",
      prop: "maintenance_requirements",
      align: "center",
    },
    {
      label: "保养部位",
      prop: "maintenance_area",
      align: "center",
    },
    {
      label: "资产类型",
      prop: "equipment_title",
      align: "center",
    },
    {
      label: "备注",
      prop: "note",
      align: "center",
    },
    {
      label: "操作",
      slot: "operation",
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
      tooltip: "请输入保养项目标准名称/要求标准/部位",
    },
    {
      label: "资产类型",
      prop: "equipment_type",
      fieldProps: {
        placeholder: "请选择",
      },
    },
  ];

  return {
    pagination,
    columns,
    searchColumns,
  };
}

export function useCycle() {
  const { getCycleName, cycleOptions } = useCommon();
  const formData = ref({
    cycleType: undefined as FormNumType,
    plan_start_time: "",
    director_uid: [] as IdNameType[], // 保养负责人id
    other_uid: [] as IdNameType[], //其他负责人id
  });

  // const options = [
  //   {
  //     label: "1个月",
  //     value: 1,
  //   },
  //   {
  //     label: "3个月",
  //     value: 3,
  //   },
  //   {
  //     label: "12个月",
  //     value: 12,
  //   },
  //   {
  //     label: "24个月",
  //     value: 24,
  //   },
  // ];

  const cycleFormColumns: PlusColumnList = [
    {
      label: "循环周期",
      prop: "cycleType",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择",
      },
    },
    {
      label: "计划执行时间",
      prop: "plan_start_time",
      valueType: "date-picker",
      fieldProps: {
        placeholder: "请选择日期",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      },
    },
    {
      label: "保养负责人",
      prop: "director_uid",
    },
    {
      label: "其他负责人",
      prop: "other_uid",
    },
  ];

  const cycleColumns: TableColumnList = [
    {
      label: "保养要求/标准",
      prop: "maintenance_requirements",
      align: "center",
    },
    {
      label: "保养部位",
      prop: "maintenance_area",
      align: "center",
    },
    {
      label: "项目标准名称",
      prop: "name",
      align: "center",
    },
    {
      label: "操作",
      align: "center",
      slot: "operation",
    },
  ];
  return {
    cycleColumns,
    cycleFormColumns,
    formData,
    cycleOptions,
  };
}
