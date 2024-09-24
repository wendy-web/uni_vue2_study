import type { PaginationProps } from "@pureadmin/table";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import { useselectData } from "@/hooks/quality/selectData";
import { useUserStore } from "@/store/modules/user";

export function useList() {
  const userStore = useUserStore();
  const router = useRouter();

  const { userOptions, getUserOptions } = useselectData();

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
    // keyword: "", // 关键字
    order_no: "", // 单据编号
    batch_no: "", //批号
    destroy_status: undefined as FormNumType, // 销毁状态；0：未销毁；1：已销毁；2：可销毁
    reviewer_date: "", //留样日期
  });

  /** 表格列配置 */
  const columns: TableColumnList = [
    {
      type: "selection",
      width: 60,
      label: "勾选列",
      fixed: "left",
      reserveSelection: true,
      selectable: (row: any) => {
        return row.destroy_status === 0;
      },
    },
    {
      label: "单据编号",
      prop: "order_no",
      align: "center",
    },
    {
      label: "留样日期",
      prop: "reviewer_date",
      align: "center",
      width: 110,
    },
    {
      label: "生产日期",
      prop: "pro_date",
      align: "center",
      width: 110,
    },
    {
      label: "批号",
      prop: "batch_no",
      align: "center",
    },
    {
      label: "留样人",
      prop: "check_user",
      align: "center",
    },
    {
      label: "复核人",
      prop: "reviewer_user",
      align: "center",
    },
    {
      label: "销毁日期",
      prop: "destroy_date",
      align: "center",
      width: 110,
    },
    {
      label: "销毁人",
      prop: "destory_user",
      align: "center",
    },
    {
      label: "销毁人签名",
      prop: "destroy_user_signature",
      align: "center",
      slot: "destroy_user_signature",
    },
    {
      label: "销毁状态",
      prop: "destroy_status",
      align: "center",
      cellRenderer: ({ row }) => {
        return row.destroy_status == 0 ? "未销毁" : "已销毁";
      },
    },
    {
      label: "销毁备注",
      prop: "destory_note",
      align: "center",
    },
    {
      label: "操作",
      slot: "operation",
      fixed: "right",
    },
  ];

  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    // {
    //   label: "关键字",
    //   prop: "keyword",
    // },
    {
      label: "单据编号",
      prop: "order_no",
    },
    {
      label: "批号",
      prop: "batch_no",
    },

    {
      label: "销毁状态",
      prop: "destroy_status",
      valueType: "select",
      options: [
        {
          label: "未销毁",
          value: 0,
        },
        {
          label: "已销毁",
          value: 1,
        },
        {
          label: "可销毁",
          value: 2,
        },
      ],
    },
    {
      label: "留样日期",
      prop: "reviewer_date",
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

  // 新增弹窗的数据
  const addFormData = ref({
    destroy_date: dayjs().format("YYYY-MM-DD"),
    destory_uid: userStore.uid as FormNumType,
    destory_note: "",
    destroy_user_signature: "", //销毁人签名图片
  });
  function checkDate(date: string, diffDate: string, type = 1) {
    let isBefore = dayjs(date).isBefore(dayjs(diffDate).format("YYYY-MM-DD"));
    let isAfter = dayjs(date).isAfter(dayjs(diffDate));
    return type === 1 ? isBefore : isAfter;
  }
  // 新增弹窗的表单项;
  const addFormColumns: PlusColumnList = [
    {
      label: "销毁日期",
      prop: "destroy_date",
      valueType: "date-picker",
      labelWidth: 90,
      fieldProps: {
        placeholder: "请选择日期",
        type: "date",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        disabledDate: (date: string) => {
          return checkDate(date, dayjs().format("YYYY-MM-DD"), 2); // 2今天之后的日期不可选
        },
      },
    },
    {
      label: "销毁人",
      prop: "destory_uid",
      valueType: "select",
      fieldProps: {
        filterable: true,
        clearable: false,
      },
      options: computed(() => {
        return userOptions.value.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      }),
    },
    {
      label: "销毁备注",
      prop: "destory_note",
      fieldProps: {
        type: "textarea",
      },
    },
  ];

  // 新增弹窗的验证规则;
  const addFormRules = {
    destroy_date: [
      {
        required: true,
        message: "请选择销毁日期",
      },
    ],
    destory_uid: [
      {
        required: true,
        message: "请选择销毁人",
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
    addVisible,
    addFormRules,
    addLoading,
    getUserOptions,
  };
}
