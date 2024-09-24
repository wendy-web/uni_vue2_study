import { ElOption, ElSelect, ElTag, dayjs } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { useRouter } from "vue-router";
import { getInstMapApi } from "@/api/quality/common";
import { formartDate } from "@/utils/validate";
import { useselectData } from "@/hooks/quality/selectData";

export function useList() {
  const router = useRouter();

  const instList = ref<any[]>([]);
  async function getInstMap() {
    const reuslt = await getInstMapApi({ is_open: 1 });
    instList.value = reuslt.data;
  }

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
    replace_user_id: undefined as FormNumType, //更换人
    status: undefined as FormNumType, //状态
    replace_date: "", //更换时间
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
      label: "更换人",
      prop: "replace_user_id",
      valueType: "select",
      options: getUserList,
      fieldProps: {
        filterable: true,
      },
    },

    {
      label: "更换时间",
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
      label: "仪器名称",
      prop: "inst_name",
      align: "center",
    },

    {
      label: "更换时间",
      prop: "replace_date",
      align: "center",
    },
    {
      label: "更换配件",
      prop: "replace_val",
      align: "center",
    },
    {
      label: "更换原因",
      prop: "replace_reason",
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
    inst_id: undefined as FormNumType, //仪器id
    inst_name: "", // 仪器名称
    replace_date: dayjs().format("YYYY-MM-DD"), //更换日期
    replace_user_id: undefined as FormNumType, //更换人ID
    replace_user_name: "", //更换人名
    replace_val: "", //更换配件
    replace_reason: "", //更换原因
    remark: "", //备注
  });

  /** 确认签名 */
  const confirm_sign = ref("");

  // 新增弹窗的表单项;
  const selectNameRef = ref();
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
            onChange={() => {
              nextTick(() => {
                addFormData.value.inst_name = selectNameRef.value?.selected.currentLabel;
              });
            }}
          >
            {instList.value.map((option) => (
              <ElOption key={option.id} label={option.name} value={option.id} />
            ))}
          </ElSelect>
        );
      },
    },

    {
      label: "更换时间",
      prop: "replace_date",
      valueType: "date-picker",
      fieldProps: {
        type: "datetime",
        placeholder: "请选择时间",
        format: "YYYY-MM-DD HH:mm",
        valueFormat: "YYYY-MM-DD HH:mm",
      },
    },
    {
      label: "更换配件",
      prop: "replace_val",
    },
    {
      label: "更换人",
      prop: "replace_user_name",
      valueType: "text",
    },
    {
      label: "更换原因",
      prop: "replace_reason",
      fieldProps: {
        type: "textarea",
        rows: 3,
      },
      colProps: {
        span: 24,
      },
    },
    {
      label: "备注",
      prop: "remark",
      fieldProps: {
        type: "textarea",
        rows: 3,
      },
      colProps: {
        span: 24,
      },
    },
  ];

  // 新增弹窗的验证规则;
  const addFormRules = {
    inst_id: [
      {
        required: true,
        message: "请选择仪器",
      },
    ],
    replace_date: [
      {
        required: true,
        message: "请选择更换时间",
      },
    ],
    replace_val: [
      {
        required: true,
        message: "请输入更换配件",
      },
    ],
    replace_reason: [
      {
        required: true,
        message: "请输入更换原因",
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
    getInstMap,
  };
}
