import { ElTag, dayjs } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { useRouter } from "vue-router";
import { useselectData } from "@/hooks/quality/selectData";

export function useList() {
  const router = useRouter();

  const { getUserList } = useselectData();

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
    clean_user_id: undefined as FormNumType, //清洗用户id
    status: undefined as FormNumType, //状态
    clean_date: "", //清洗时间
  });
  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
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
      label: "清洗人",
      prop: "clean_user_id",
      valueType: "select",
      options: getUserList,
      fieldProps: {
        filterable: true,
      },
    },

    {
      label: "清洗日期",
      prop: "clean_date",
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
      label: "清洗日期",
      prop: "clean_date",
      align: "center",
    },

    {
      label: "清洗UV机台",
      prop: "clean_uv",
      align: "center",
    },
    {
      label: "清洗人",
      prop: "clean_user_name",
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
    clean_date: dayjs().format("YYYY-MM-DD"), //清洗日期
    clean_uv: "", //清洗uv机
    clean_user_id: undefined as FormNumType, //清洗用户ID
    clean_user_name: "", //清洗用户名
    remark: "", //备注
  });

  /** 确认签名 */
  const confirm_sign = ref("");

  // 新增弹窗的表单项;
  const addFormColumns: PlusColumnList = [
    {
      label: "清洗日期",
      prop: "clean_date",
      valueType: "date-picker",
      fieldProps: {
        placeholder: "请选择日期",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      },
    },
    {
      label: "清洗UV机台",
      prop: "clean_uv",
    },
    {
      label: "清洗人",
      prop: "clean_user_name",
      valueType: "text",
    },
    {
      label: "备注",
      prop: "remark",
      fieldProps: {
        type: "textarea",
        rows: 3,
      },
    },
  ];

  // 新增弹窗的验证规则;
  const addFormRules = {
    clean_date: [
      {
        required: true,
        message: "请选择清洗日期",
      },
    ],
    clean_uv: [
      {
        required: true,
        message: "请选择清洗uv机",
      },
    ],
    clean_user_id: [
      {
        required: true,
        message: "请选择清洗用户",
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
