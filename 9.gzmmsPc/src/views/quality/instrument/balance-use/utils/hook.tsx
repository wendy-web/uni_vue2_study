import { ElOption, ElSelect, ElTag, dayjs } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { useRouter } from "vue-router";
import { getInstMapApi } from "@/api/quality/common";

export function useList() {
  const router = useRouter();

  const instList = ref<any[]>([]);
  async function getInstMap() {
    const reuslt = await getInstMapApi({ is_open: 1 });
    instList.value = reuslt.data;
  }

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
    name: "", //仪器名称
    // use_year: dayjs().format("YYYY"), //使用年份
    use_year: "", //使用年份
    check_pro: "", //检测项目
    status: undefined as FormNumType, //状态
    user_date: "", //使用时间
  });
  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    {
      label: "仪器名称",
      prop: "name",
    },
    {
      label: "使用年份",
      prop: "use_year",
      valueType: "date-picker",
      fieldProps: {
        type: "year",
        clearable: false,
        format:"YYYY",
        valueFormat:"YYYY"
        // onBlur: () => {
        //   if (!formData.value.use_year) {
        //     formData.value.use_year = dayjs().format("YYYY");
        //   }
        // },
      },
    },
    {
      label: "检测项目",
      prop: "check_pro",
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
      label: "使用日期",
      prop: "user_date",
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
      label: "仪器名称",
      prop: "name",
      align: "center",
    },

    {
      label: "仪器编号",
      prop: "code",
      align: "center",
    },
    {
      label: "使用年份",
      prop: "use_year",
      align: "center",
    },
    {
      label: "使用日期",
      prop: "user_date",
      align: "center",
    },
    {
      label: "使用时间",
      prop: "use_start_time",
      align: "center",
      cellRenderer: ({ row }) => {
        return row.use_start_time + "~" + row.use_end_time;
      },
    },
    {
      label: "环境条件",
      align: "center",
      children: [
        {
          label: "室温(℃)",
          prop: "temperature",
          align: "center",
        },
        {
          label: "相对湿度(%)",
          prop: "humidity",
          align: "center",
          width: 110,
        },
      ],
    },
    {
      label: "仪器状况",
      align: "center",
      children: [
        {
          label: "使用前",
          prop: "use_before",
          align: "center",
          cellRenderer: ({ row }) => {
            return row.use_before === 1 ? "OK" : "NG";
          },
        },
        {
          label: "使用后",
          prop: "use_after",
          align: "center",
          cellRenderer: ({ row }) => {
            return row.use_before === 1 ? "OK" : "NG";
          },
        },
      ],
    },
    {
      label: "检测项目",
      prop: "check_pro",
      align: "center",
    },
    {
      label: "使用人",
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
      label: "备注",
      prop: "remark",
      align: "center",
    },
    {
      label: "仪器型号",
      prop: "inst_type_no",
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
      label: "更新人",
      prop: "up_name",
      align: "center",
    },
    {
      label: "更新时间",
      prop: "update_time",
      align: "center",
    },
    {
      label: "操作",
      slot: "operation",
      fixed: "right",
      align: "center",
    },
  ];

  const selectNameRef = ref();
  function selectNameChange(val: number) {
    console.log("🚀 ~ selectNameChange ~ val:", val);

    const item = instList.value.find((item: any) => item.id === val);
    console.log("item", item);
    addFormData.value.inst_type_no = item.inst_type_no; //仪器型号
    addFormData.value.name = item.name; //仪器名称
    addFormData.value.code = item.code; // 仪器编码
  }

  /** 新增弹窗的数据 */
  const addFormData = ref({
    inst_id: undefined as FormNumType, //仪器id
    name: "", //仪器名称
    code: "", // 仪器编码
    inst_type_no: "", //仪器型号
    user_date: "", //使用日期
    use_year: "", //使用年份
    use_start: [] as string[], //页面组件使用的 使用时间子弹
    use_start_time: "", //传给接口的使用时间
    use_end_time: "", //传给接口的使用时间
    temperature: "", //室温
    humidity: "", //相对湿度
    use_before: undefined as FormNumType, //仪器状态使用前
    use_after: undefined as FormNumType, //仪器状态使用后
    check_pro: "", //检测项目
    remark: "", //备注
  });
  /** 确认签名 */
  const confirm_sign = ref("");

  const useStatusOptions = [
    {
      label: "OK",
      value: 1,
    },
    {
      label: "NG",
      value: 0,
    },
  ];

  // 新增弹窗的表单项;
  const addFormColumns: PlusColumnList = [
    {
      label: "仪器名称",
      prop: "inst_id",
      valueType: "select",
      renderField: () => {
        return (
          <ElSelect
            v-model={addFormData.value.inst_id}
            ref={selectNameRef}
            style="width:100%"
            filterable={true}
            onChange={selectNameChange}
          >
            {instList.value.map((option) => (
              <ElOption key={option.id} label={option.name} value={option.id} />
            ))}
          </ElSelect>
        );
      },
    },
    {
      label: "仪器编码",
      prop: "code",
      fieldProps: {
        disabled: true,
        placeholder: "请选择仪器名称",
      },
    },

    {
      label: "仪器型号",
      prop: "inst_type_no",
      fieldProps: {
        disabled: true,
        placeholder: "请选择仪器名称",
      },
    },
    {
      label: "使用日期",
      prop: "user_date",
      valueType: "date-picker",
      fieldProps: {
        placeholder: "请选择日期",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        onChange: (val: string) => {
          addFormData.value.use_year = val.split("-")[0];
        },
      },
    },
    {
      label: "年份",
      prop: "use_year",
      fieldProps: {
        disabled: true,
        placeholder: "请选择使用日期",
      },
    },
    {
      label: "使用时间",
      prop: "use_start",
      valueType: "time-picker",
      fieldProps: {
        isRange: true,
        format: "HH:mm",
        valueFormat: "HH:mm",
        onChange: (val: string[]) => {
          addFormData.value.use_start_time = val[0];
          addFormData.value.use_end_time = val[1];
        },
      },
    },
    {
      label: "室温",
      prop: "temperature",
    },
    {
      label: "相对湿度",
      prop: "humidity",
    },
    {
      label: "仪器状态使用前",
      prop: "use_before",
      valueType: "radio",
      options: useStatusOptions,
    },
    {
      label: "仪器状态使用后",
      prop: "use_after",
      valueType: "radio",
      options: useStatusOptions,
    },
    {
      label: "检测项目",
      prop: "check_pro",
    },
    {
      label: "备注",
      prop: "remark",
    },
  ];

  // 新增弹窗的验证规则;
  const addFormRules = {
    inst_id: [
      {
        required: true,
        message: "请选择仪器名称",
      },
    ],
    code: [
      {
        required: true,
        message: "请选择仪器名称",
      },
    ],
    inst_type_no: [
      {
        required: true,
        message: "请选择仪器名称",
      },
    ],
    user_date: [
      {
        required: true,
        message: "请选择使用日期",
      },
    ],
    use_year: [
      {
        required: true,
        message: "请选择年份",
      },
    ],
    use_start: [
      {
        required: true,
        message: "请选择使用时间",
      },
    ],
    temperature: [
      {
        required: true,
        message: "请输入室温",
      },
    ],
    humidity: [
      {
        required: true,
        message: "请输入相对湿度",
      },
    ],
    use_before: [
      {
        required: true,
        message: "请选择仪器状态使用前",
      },
    ],
    use_after: [
      {
        required: true,
        message: "请选择仪器状态使用后",
      },
    ],
    check_pro: [
      {
        required: true,
        message: "请输入检测项目",
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
    getInstMap,
    confirm_sign,
  };
}
