import { ElOption, ElSelect, ElTag, dayjs } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { useRouter } from "vue-router";
import { formartDate } from "@/utils/validate";
import { useselectData } from "@/hooks/quality/selectData";

export function useList() {
  const router = useRouter();

  const { getUserList, workshopOptions } = useselectData();

  /** 表格分页配置 */
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });

  /** 表单数据 */
  const formData = ref({
    workshop_id: undefined as FormNumType, //车间ID
    calibration_user_id: undefined as FormNumType, //校准人ID
    status: undefined as FormNumType, //确认状态
    calibration_date: "", //校准日期
  });
  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    {
      label: "车间",
      prop: "workshop_id",
      valueType: "select",
      options: workshopOptions,
      labelWidth: 60,
    },
    {
      label: "确认状态",
      prop: "status",
      valueType: "select",
      options: [
        {
          label: "未确认",
          value: 0,
        },
        {
          label: "已确认",
          value: 1,
        },
      ],
    },
    {
      label: "校准人",
      prop: "calibration_user_id",
      valueType: "select",
      options: getUserList,
      fieldProps: {
        filterable: true,
      },
      labelWidth: 70,
    },

    {
      label: "校准日期",
      prop: "calibration_date",
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

  /** 表格列配置 */
  const columns: TableColumnList = [
    {
      label: "勾选列",
      type: "selection",
      reserveSelection: true,
    },
    {
      label: "单据编号",
      prop: "order_no",
      align: "center",
    },
    {
      label: "车间",
      prop: "workshop_name",
      align: "center",
    },

    {
      label: "校准日期",
      prop: "calibration_date",
      align: "center",
    },
    {
      label: "校准时间",
      prop: "calibration_time",
      align: "center",
    },
    {
      label: "校准块标准值(mm)",
      prop: "calibration_val",
      align: "center",
    },
    {
      label: "测量值(mm)",
      align: "center",
      cellRenderer: ({ row }) => {
        return (
          <>
            <div>
              <span class="inline-block w-[10px] mr-1">X</span>
              <span>{row.test_x_val}</span>
            </div>
            <div>
              <span class="inline-block w-[10px] mr-1">Y</span>
              <span>{row.test_y_val}</span>
            </div>
          </>
        );
      },
    },
    {
      label: "误差值(mm)",
      align: "center",
      cellRenderer: ({ row }) => {
        return (
          <>
            <div>
              <span class="inline-block w-[10px] mr-1">X</span>
              <span>{row.error_x_val}</span>
            </div>
            <div>
              <span class="inline-block w-[10px] mr-1">Y</span>
              <span>{row.error_y_val}</span>
            </div>
          </>
        );
      },
    },
    {
      label: "校准人",
      prop: "calibration_user_name",
      align: "center",
    },
    {
      label: "确认人签名",
      prop: "confirm_sign",
      align: "center",
      slot: "confirm_sign",
      minWidth: 120,
    },
    {
      label: "确认状态",
      prop: "status",
      align: "center",
      cellRenderer: ({ row }) => (
        <>
          <ElTag type={row.status === 1 ? "success" : "info"}>
            {row.status === 1 ? "已确认" : "未确认"}
          </ElTag>
        </>
      ),
    },
    {
      label: "确认时间",
      prop: "confirm_time",
      align: "center",
      cellRenderer: ({ row }) => {
        return row.confirm_time ? row.confirm_time : "--";
      },
    },
    {
      label: "备注",
      prop: "remark",
      align: "center",
    },
    {
      label: "制单人",
      prop: "ct_name",
      align: "center",
    },
    {
      label: "创建时间",
      prop: "create_time",
      align: "center",
      width: 110,
    },
    {
      label: "操作",
      slot: "operation",
      fixed: "right",
      align: "center",
    },
  ];

  // 新增弹窗的数据
  const addFormData = ref({
    workshop_id: undefined as FormNumType, //车间id
    workshop_name: "", //车间名称
    calibration_date: "", //校准日期
    calibration_time: "", //校准时间
    calibration_val: "", //校准块标准值
    calibration_user_id: undefined as FormNumType, //校准人ID
    calibration_user_name: "", //校准人名称
    test_x_val: "", //测定值x
    test_y_val: "", //测定值y
    error_x_val: "", //误差值x
    error_y_val: "", // 误差值y

    remark: "", //备注
  });

  /** 确认签名 */
  const confirm_sign = ref("");
  const selectNameRef = ref();
  // 新增弹窗的表单项;
  const addFormColumns: PlusColumnList = [
    {
      label: "车间",
      prop: "workshop_id",
      valueType: "select",
      renderField: () => {
        return (
          <ElSelect
            v-model={addFormData.value.workshop_id}
            ref={selectNameRef}
            style="width:100%"
            filterable={true}
            onChange={() => {
              nextTick(() => {
                addFormData.value.workshop_name = selectNameRef.value?.selected.currentLabel;
              });
            }}
          >
            {workshopOptions.map((option) => (
              <ElOption key={option.value} label={option.label} value={option.value} />
            ))}
          </ElSelect>
        );
      },
    },
    {
      label: "校准日期",
      prop: "calibration_date",
      valueType: "date-picker",
      fieldProps: {
        placeholder: "请选择日期",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      },
    },
    {
      label: "校准时间",
      prop: "calibration_time",
      valueType: "time-picker",
      fieldProps: {
        placeholder: "请选择时间",
        format: "HH:mm",
        valueFormat: "HH:mm",
      },
    },
    {
      label: "校准块标准值",
      prop: "calibration_val",
      fieldProps: {
        clearable: false,
      },
    },
    {
      label: "校准人",
      prop: "calibration_user_name",
      valueType: "text",
    },
    {
      label: "备注",
      prop: "remark",
      fieldProps: {
        clearable: false,
      },
    },
    {
      label: "测量值(mm)",
      prop: "test_x_val",
      colProps: {
        span: 24,
      },
    },
    {
      label: "误差值(mm)",
      prop: "error_x_val",
      colProps: {
        span: 24,
      },
    },
  ];

  // 新增弹窗的验证规则;
  const addFormRules = {
    workshop_id: [
      {
        required: true,
        message: "请选择车间",
      },
    ],
    calibration_date: [
      {
        required: true,
        message: "请选择校准日期",
      },
    ],
    calibration_time: [
      {
        required: true,
        message: "请选择校准时间",
      },
    ],
    calibration_val: [
      {
        required: true,
        message: "请选择校准块标准值",
      },
    ],
    test_x_val: [
      {
        required: true,
        message: "请输入测量值X",
      },
    ],
    test_y_val: [
      {
        required: true,
        message: "请输入测量值Y",
      },
    ],
    error_x_val: [
      {
        required: true,
        message: "请输入误差值X",
      },
    ],
    error_y_val: [
      {
        required: true,
        message: "请输入误差值Y",
      },
    ],
  };
  // 新增弹窗开关;
  const addVisible = ref(false);
  const addLoading = ref(false);

  return {
    pagination,
    formData,
    columns,
    searchColumns,
    router,
    addFormData,
    addFormColumns,
    addFormRules,
    addVisible,
    addLoading,
    confirm_sign,
  };
}
