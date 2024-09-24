import { WarningFilled } from "@element-plus/icons-vue";
import { ElIcon } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import dayjs from "dayjs";
import type { IdNameType } from "@/api/device/common/types";
import { addDialog } from "@/components/ReDialog";
import { useCommon } from "@/hooks/device/baseData";

export function useCycle() {
  const { executiveRuleOptions, getRecordName, getInspecCycleName } = useCommon();

  const formData = ref({
    cycleType: undefined as FormNumType,
    plan_start_time: dayjs().format("YYYY-MM-DD HH:mm"),
    plan_start_time_list: [dayjs().format("YYYY-MM-DD HH:mm")], //当选择固定周期时,计划执行时间范围
    executor_uid: [] as IdNameType[], //计划执行人id
    executor_name: "", //计划执行人名称
    executive_rule_type: undefined as FormNumType, //执行时间规则
  });

  const cycleRules = {
    executive_rule_type: [
      {
        required: true,
        message: "请选择执行时间规则",
      },
    ],
    cycleType: [
      {
        required: true,
        message: "请选择循环周期",
      },
    ],
    plan_start_time: [
      {
        required: true,
        message: "请选择计划执行时间",
      },
    ],
    plan_start_time_list: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          console.log("🚀 ~ useCycle ~ value:", value);
          if (!value.length) {
            callback(new Error("请选择计划执行时间段"));
          } else if (!value[0]) {
            callback(new Error("请选择计划执行开始时间"));
          } else if (!value[1]) {
            callback(new Error("请选择计划执行结束时间"));
          } else {
            callback();
          }
        },
      },
    ],
    executor_uid: [
      {
        required: true,
        message: "请选择计划执行人",
      },
    ],
  };

  function handleHint() {
    let content = (
      <ul class="px-4">
        <li class="mb-4 list-disc">
          <div class="mb-1">
            <span class="font-bold">按固定周期：</span>
            <span>计划时间固定循环，不允许提前执行</span>
          </div>
          <div>
            例：若循环周期为每月，执行时间为2024-5-0400:00至2024-5-2023:59，则在每月2024-5-0400:00开始任务，2024-5-2023:59结束任务，超出执行时间未检查则记为未检，且根据循环周期自动循环到下次执行时间。
          </div>
        </li>
        <li class="list-disc">
          <div class="mb-1">
            <span class="font-bold">按上次执行时间：</span>
            <span>上次结束时间循环，允许提前执行</span>
          </div>
          <div>
            例：若循环周期为每月，执行时间为2024-5-0400:00至2024-5-0423:59，则在2024-5-0400：00开始任务，超出执行时间未检查则记为任务逾期，直到任务完成后，按完成时间循环到下次执行时间。
          </div>
        </li>
      </ul>
    );

    addDialog({
      width: "600px",
      btnClass: "w-[80px]",
      draggable: true,
      btnLoading: false,
      showClose: false,
      showCancel: false,
      confirmText: "我知道了",
      title: "计划执行时间计算规则",
      contentRenderer: () => content,
    });
  }

  const cycleFormColumns: PlusColumnList = [
    {
      label: "执行时间规则",
      prop: "executive_rule_type",
      valueType: "radio",
      options: executiveRuleOptions,
      colProps: {
        span: 18,
      },
      fieldProps: {
        onchange: (val: number) => {
          formData.value.cycleType = undefined;
          formData.value.plan_start_time_list = [dayjs().format("YYYY-MM-DD HH:mm")];
        },
      },
      renderExtra: () => {
        return (
          <>
            <ElIcon size={20} color="#409efc" class={"cursor-pointer"} onClick={handleHint}>
              <WarningFilled />
            </ElIcon>
          </>
        );
      },
    },

    {
      label: "循环周期",
      prop: "cycleType",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择",
      },

      hideInForm: computed(() =>
        typeof formData.value.executive_rule_type === "number" ? false : true,
      ),
    },
    {
      label: "计划执行人",
      prop: "executor_uid",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择计划执行人",
      },
      hideInForm: computed(() =>
        typeof formData.value.executive_rule_type === "number" ? false : true,
      ),
    },
    {
      label: "计划执行时间",
      prop: "plan_start_time",
      valueType: "date-picker",
      fieldProps: {
        placeholder: "请选择",
        type: "datetime",
        format: "YYYY-MM-DD HH:mm",
        valueFormat: "YYYY-MM-DD HH:mm",
        clearable: false,
      },
      hideInForm: computed(() => (formData.value.executive_rule_type === 0 ? false : true)),
      colProps: {
        span: 24,
      },
    },
    {
      label: "计划执行时间段",
      prop: "plan_start_time_list",
      labelWidth: 130,
      hideInForm: computed(() => (formData.value.executive_rule_type === 1 ? false : true)),
      colProps: {
        span: 24,
      },
    },
  ];

  const cycleColumns: TableColumnList = [
    {
      label: "检查项名",
      prop: "inspect_items_name",
      align: "center",
    },
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
    cycleFormColumns,
    cycleColumns,
    getRecordName,
    getInspecCycleName,
    cycleRules,
  };
}

export function useInspec() {
  const { getRecordName } = useCommon();

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });

  const inspecColumns: TableColumnList = [
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
      label: "检查项目名",
      prop: "inspect_items_name",
      align: "center",
    },
    {
      label: "资产类型",
      prop: "equipment_type_title",
      align: "center",
    },
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
      prop: "equipment_type_id",
      fieldProps: {
        placeholder: "请选择",
      },
    },
    {
      label: "点检结果类型",
      prop: "record_method",
      labelWidth: 110,
      valueType: "select",
      fieldProps: {
        placeholder: "请选择",
      },
      options: [
        {
          label: "单选",
          value: 0,
        },
        {
          label: "多选",
          value: 1,
        },
        {
          label: "数值",
          value: 2,
        },
        {
          label: "长文本",
          value: 3,
        },
      ],
    },
  ];

  return {
    pagination,
    inspecColumns,
    searchColumns,
  };
}
