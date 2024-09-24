import { useCommon } from "@/hooks/device/baseData";
import { userListHooks } from "@/hooks/index";

export function useEdit() {
  const { userList } = userListHooks();
  const { inspecCycleOptions, getRecordName, getExecutiveRuleName, getRulePlanTime } = useCommon();

  const formData = ref({
    plan_details_no: "", //计划明细单号
    plan_start_time: "", //计划执行时间
    cycle_type: undefined as FormNumType, //循环周期
    executor_uid: [] as number[], //计划执行人id
    is_must_pho: 0,
    is_must_sig: 0,
    executive_rule_type: undefined as FormNumType, //执行规则类型
    plan_end_time: "",
    notice_day: 0,
  });

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
      valueType: "text",
      fieldProps: {
        placeholder: "请输入",
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
      label: "循环周期",
      prop: "cycle_type",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择",
        disabled: true,
      },
      options: inspecCycleOptions,
    },
    {
      label: "计划执行人",
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
      label: "是否必须拍照",
      prop: "is_must_pho",
      valueType: "radio",
      fieldProps: {
        placeholder: "请选择",
      },
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
      label: "是否必须签字",
      prop: "is_must_sig",
      valueType: "radio",
      fieldProps: {
        placeholder: "请选择",
      },
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
      label: "执行时间规则",
      prop: "executive_rule_type",
      valueType: "text",
      renderField: (value) => {
        return <span>{getExecutiveRuleName(formData.value.executive_rule_type)}</span>;
      },
    },
    {
      label: "提醒时间(天)",
      prop: "notice_day",
      slot: "notice_day",
      hideInForm: computed(()=> formData.value.cycle_type == 0)
    },
  ];
  const rules = {
    cycle_type: [
      {
        required: true,
        message: "请选择循环周期",
      },
    ],
    executor_uid: [
      {
        required: true,
        message: "请选择计划执行人",
      },
    ],
  };

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
    // {
    //   label: "检查项名",
    //   prop: "inspect_items_name",
    //   align: "center",
    // },
    {
      label: "检查项内容",
      prop: "item_content",
      align: "center",
    },
    {
      label: "检验方法/工具/依据",
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
      cellRenderer: ({ row }) => {
        return getRecordName(row.record_method);
      },
    },
    {
      label: "结果选项",
      align: "center",
      slot: "select",
      cellRenderer: ({ row }) => (
        <>
          <ul>
            {row.normal_val ? (
              <li>
                <span>正常值：</span>
                <span>{row.normal_value}</span>
              </li>
            ) : null}
            {row.abnormal_val ? (
              <li>
                <span>异常值：</span>
                <span>{row.abnormal_val}</span>
              </li>
            ) : null}
          </ul>
        </>
      ),
    },
    {
      label: "上限",
      prop: "upper_limit_val",
      align: "center",
    },
    {
      label: "下限",
      prop: "lower_limit_val",
      align: "center",
    },
    {
      label: "操作",
      align: "center",
      slot: "operation",
    },
  ];

  return {
    formData,
    formColumns,
    deviceColumns,
    rules,
    standardColumns,
  };
}
