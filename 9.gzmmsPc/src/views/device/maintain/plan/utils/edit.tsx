import dayjs from "dayjs";
import { useCommon } from "@/hooks/device/baseData";

export function useEdit() {
  const { cycleOptions } = useCommon();

  const formData = ref({
    plan_details_no: "", //计划明细单号
    plan_start_time: "", //计划执行时间
    cycle_type: undefined as FormNumType, //循环周期
    director_uid: [] as number[], // 保养负责人id
    other_uid: [] as number[], //其他负责人id
    notice_day: 0,
  });

  /** 记录上次执行时间 */
  const last_start_time = ref("");

  const plan_start_time_copy = ref("");

  function getNoticeMax(cycleType?: number) {
    if (cycleType) {
      if (cycleType <= 6) {
        return cycleType * 30 - 1;
      } else {
        return 180;
      }
    } else {
      return 1 * 30 - 1;
    }
  }

  const formColumns: PlusColumnList = [
    {
      label: "计划明细单号",
      prop: "plan_details_no",
      valueType: "text",
      fieldProps: {
        placeholder: "请输入",
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
        clearable: false,
        disabledDate: (date: string) => {
          return dayjs(last_start_time.value).isAfter(date);
        },
      },
    },
    {
      label: "循环周期",
      prop: "cycle_type",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择",
      },
      options: cycleOptions,
      // options: [
      //   {
      //     label: "1个月",
      //     value: 0,
      //   },
      //   {
      //     label: "3个月",
      //     value: 1,
      //   },
      //   {
      //     label: "12个月",
      //     value: 2,
      //   },
      //   {
      //     label: "24个月",
      //     value: 3,
      //   },
      // ],
    },
    {
      label: "保养负责人",
      prop: "director_uid",
    },
    {
      label: "其他负责人",
      prop: "other_uid",
    },
    {
      label: "提醒时间(天)",
      prop: "notice_day",
      slot: "notice_day",
    },
  ];

  const deviceColumns: PlusColumnList = [
    {
      label: "设备编码",
      prop: "asset_no",
    },
    {
      label: "资产类型",
      prop: "equipment_type_title",
    },
    {
      label: "资产条码",
      prop: "barcode",
    },
    {
      label: "资产名称",
      prop: "bar_title",
    },
    {
      label: "规格型号",
      prop: "spec",
    },
    {
      label: "使用位置",
      prop: "use_places",
    },
    {
      label: "使用部门",
      prop: "use_dept_names",
    },
  ];

  const standardColumns: TableColumnList = [
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
      label: "操作",
      slot: "operation",
    },
  ];

  return {
    formData,
    formColumns,
    deviceColumns,
    standardColumns,
    plan_start_time_copy,
    last_start_time,
    getNoticeMax,
  };
}
