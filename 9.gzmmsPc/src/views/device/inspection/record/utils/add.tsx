import dayjs from "dayjs";
import type { PlusFormGroupRow } from "plus-pro-components";
import { checkIsBeforeDate } from "@/utils/validate";
import { useCommon } from "@/hooks/device/baseData";
import { userListHooks } from "@/hooks/index";

export type TableListType = {
  id: number;
  item_content: string;
  // item_id: number;
  method: string;
  std_explain: string;
  note?: string;
  record_method: number;
  result_content: ResultContentType[];
  upper_limit_val: string;
  lower_limit_val: string;
  val: any;
};

export type ResultContentType = {
  is_check: number;
  is_normal: number;
  type: number;
  val: any;
};

export function useAdd() {
  const { userList } = userListHooks();
  const { getInspecCycleName, getRecordName, getRulePlanTime, getExecutiveRuleName, getLimitVal } =
    useCommon();

  const formData = ref({
    plan_details_no: "", //计划明细单号
    bar_title: "", //资产名称
    asset_no: "", //设备编码
    barcode: "", //资产条码
    spec: "", //规格型号
    equipment_type_title: "", //资产类型名称
    // equipment_type_id: undefined as FormNumType, //资产类型id
    use_places: "", // 使用位置
    use_dept_names: "", //使用部门名称
    use_dept_id: "", //使用部门id
    plan_start_time: "", //计划执行时间
    plan_end_time: "", //计划执行时间
    executive_rule_type: undefined as FormNumType, //执行时间规则
    task_time_start: dayjs().format("YYYY-MM-DD HH:mm"), //任务开始时间
    task_time_end: "", //任务结束时间
    executor_uid: [] as number[], //计划执行人id
    note: "", //备注
    equipment_id: undefined as FormNumType, //设备id
  });

  const addRules = {
    task_time_start: [
      {
        required: true,
        message: "请选择任务开始时间",
      },
    ],
    task_time_end: [
      {
        validator: validateEndTime,
      },
    ],
  };

  function validateEndTime(rule: any, value: any, callback: any) {
    if (value && checkIsBeforeDate(value, formData.value.task_time_start)) {
      callback(new Error("结束日期时分不可在开始日期时分之前"));
    } else {
      callback();
    }
  }

  const group: PlusFormGroupRow[] = [
    {
      title: "设备信息",
      columns: [
        {
          label: "计划明细单号",
          labelWidth: 110,
          prop: "plan_details_no",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
        },
        {
          label: "资产名称",
          labelWidth: 110,
          prop: "bar_title",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
        },
        {
          label: "设备编码",
          labelWidth: 110,
          prop: "asset_no",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
        },
        {
          label: "资产条码",
          labelWidth: 110,
          prop: "barcode",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
        },
        {
          label: "规格型号",
          labelWidth: 110,
          prop: "spec",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
        },
        {
          label: "资产类型",
          labelWidth: 110,
          prop: "equipment_type_title",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
        },
        {
          label: "使用位置",
          labelWidth: 110,
          prop: "use_places",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
        },
        {
          label: "使用部门",
          labelWidth: 110,
          prop: "use_dept_names",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
        },
      ],
    },
    {
      title: "检查信息",
      columns: [
        {
          label: "计划执行时间",
          prop: "plan_start_time",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
          renderField: (value) => {
            let data = {
              rule_type: formData.value.executive_rule_type,
              start_time: formData.value.plan_start_time,
              end_time: formData.value.plan_end_time,
            };
            return <span>{getRulePlanTime(data)}</span>;
          },
        },
        {
          label: "执行时间规则",
          prop: "executive_rule_type",
          renderField: (value) => {
            return <span>{getExecutiveRuleName(formData.value.executive_rule_type)}</span>;
          },
        },
        {
          label: "任务开始时间",
          prop: "task_time_start",
          valueType: "date-picker",
          fieldProps: {
            type: "datetime",
            placeholder: "请选择时间",
            format: "YYYY-MM-DD HH:mm",
            valueFormat: "YYYY-MM-DD HH:mm",
            clearable: false,
            disabledDate: (date: string) => {
              return checkIsBeforeDate(date, formData.value.plan_start_time);
            },
          },
        },
        {
          label: "任务结束时间",
          prop: "task_time_end",
          valueType: "date-picker",
          fieldProps: {
            type: "datetime",
            placeholder: "请选择时间",
            format: "YYYY-MM-DD HH:mm",
            valueFormat: "YYYY-MM-DD HH:mm",
            disabledDate: (date: string) => {
              return checkIsBeforeDate(date, formData.value.task_time_start, "YYYY-MM-DD");
            },
          },
        },
        {
          label: "执行人",
          prop: "executor_uid",
          valueType: "select",
          fieldProps: {
            placeholder: "请选择",
            multiple: true,
          },
          options: computed(() => {
            return userList.value.map((item) => {
              return {
                label: item.name,
                value: item.id,
              };
            });
          }),
        },

        {
          label: "备注",
          prop: "note",
          fieldProps: {
            placeholder: "请输入",
          },
        },
      ],
    },
  ];

  const tableColumns: TableColumnList = [
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

  function warningCheckNumberValue(row: any) {
    let { val, upper_limit_val, lower_limit_val } = row;
    if (Number(val) > Number(upper_limit_val) || Number(val) < Number(lower_limit_val)) {
      return true;
    }
    return false;
  }

  function checkNumberValue(
    rule: any,
    value: any,
    callback: any,
    upper_limit_val: string,
    lower_limit_val: string,
  ) {
    // console.log("Number(value)", Number(value));
    // console.log("Number(upper_limit_val) ", Number(upper_limit_val));
    // console.log(" Number(lower_limit_val) ", Number(lower_limit_val));
    if (!value) {
      callback(new Error("请输入数值"));
    }
    // else if (Number(value) > Number(upper_limit_val) || Number(value) < Number(lower_limit_val)) {
    //   callback(new Error(`数值应在${lower_limit_val}到${upper_limit_val}之间`));
    // }
    else {
      callback();
    }
  }

  return {
    formData,
    group,
    addRules,
    tableColumns,
    getInspecCycleName,
    userList,
    warningCheckNumberValue,
    checkNumberValue,
  };
}
