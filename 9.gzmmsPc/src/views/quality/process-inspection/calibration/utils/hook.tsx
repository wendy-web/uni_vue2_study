import { ElImage, FormInstance } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import dayjs from "dayjs";
import type { PlusFormGroupRow } from "plus-pro-components";
import { withKeys } from "vue";

/** 引入公共方法 */
import { getUserListApi } from "@/api/common/index";
import { useSettingsStoreHook } from "@/store/modules/settings";

export function useList(search: () => void) {
  const useSetting = useSettingsStoreHook();
  const BaseData = ref<any>(); // 获取公共下拉框数据配置
  const supplierOptions = ref<any>();
  // 获取公共下拉框数据配置
  async function initBaseData() {
    const result = await getUserListApi();
    BaseData.value = result.data;
    supplierOptions.value = result.data.list.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
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
    check_date_arr: "",
    calibrate_uid: "", // 校准人UID
    confirm_status: "", // 确认状态
  });
  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    {
      label: "确认状态",
      prop: "confirm_status",
      valueType: "select",
      options: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "已确认",
          value: 1,
        },
        {
          label: "未确认",
          value: 0,
        },
      ],
      fieldProps: {
        onChange: () => {
          search();
        },
      },
    },
    {
      label: "校准人",
      prop: "calibrate_uid",
      valueType: "select",
      options: computed(() => supplierOptions.value),
      fieldProps: {
        filterable: true,
        onChange: () => {
          search();
        },
      },
    },

    {
      label: "校准日期",
      prop: "check_date_arr",
      valueType: "date-picker",
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择日期",
        type: "daterange",
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        onChange: () => {
          search();
        },
      },
    },
  ];
  const passMap: Record<number, string> = {
    0: "不合格",
    1: "合格",
    2: "部分合格",
  };
  /** 表格列配置 */
  const columns: TableColumnList = [
    {
      label: "单据编号",
      prop: "order_no",
      align: "center",
      minWidth: 140,
    //   cellRenderer: ({ row }) => (
    //     <span class="cursor-pointer underline text-sky-800">{row.order_no}</span>
    //   ),
    },
    {
      label: "校准日期",
      prop: "calibrate_date",
      align: "center",
    },
    {
      label: "CAL1",
      prop: "cal1",
      align: "center",
    },
    {
      label: "CAL2",
      prop: "cal2",
      align: "center",
    },
    {
      label: "斜率",
      prop: "slope_val",
      align: "center",
      minWidth: 90,
    },

    {
      label: "校准人",
      prop: "calibrate_user",
      align: "center",
      minWidth: 90,
    },
    {
      label: "确认人签名",
      prop: "check_user_signature",
      slot: "check_user_signature",
      align: "center",
      cellRenderer: ({ row }) => (
        <>
          {row.check_user_signature ? (
            <ElImage
              style="width: 60px; height: 60px;margin: 0 auto;display: block;"
              src={useSetting.baseHttp + row.check_user_signature}
            />
          ) : (
            <span class="text-gray-400">暂无~</span>
          )}
        </>
      ),
    },
    {
      label: "确认状态",
      prop: "confirm_status",
      align: "center",
      minWidth: 90,
      cellRenderer: ({ row }) => {
        return typeof row.confirm_status === "number"
          ? row.confirm_status === 1
            ? "已确认"
            : "未确认"
          : "--";
      },
    },
    {
      label: "确认时间",
      prop: "confirm_time",
      align: "center",
      minWidth: 90,
    },
    {
      label: "备注",
      prop: "note",
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
    },

    {
      label: "操作",
      slot: "operation",
      fixed: "right",
    },
  ];
  function checkDate(date: string, diffDate: string, type = 1) {
    let isBefore = dayjs(date).isBefore(dayjs(diffDate).format("YYYY-MM-DD"));
    let isAfter = dayjs(date).isAfter(dayjs(diffDate));
    return type === 1 ? isBefore : isAfter;
  }
  // 新增弹窗的数据
  const addFormData = ref({
    calibrate_date: "", // 校准日期
    calibrate_uid: "", // 校准人UID
    cal1: "", // cal1
    cal2: "", // cal2
    slope_val: "", // 斜率实测值
    note: "", // 备注
  });
  // 新增弹窗的表单项
  const addFormColumns: PlusColumnList = [
    {
      label: "校准日期",
      valueType: "date-picker",
      prop: "calibrate_date",
      fieldProps: {
        placeholder: "请选择检测日期",
        type: "date",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        disabledDate: (date: string) => {
          return checkDate(date, dayjs().format("YYYY-MM-DD"), 2); // 2今天之后的日期不可选
        },
      },
      labelWidth: 100,
    },
    {
      label: "校准人",
      prop: "calibrate_uid",
      valueType: "select",
      fieldProps: {
        filterable: true,  
      },
      options: computed(() => supplierOptions.value),
    },
    {
      label: "CAL1",
      prop: "cal1",
      fieldProps: {
        placeholder: "请输入",
      },
    },
    {
      label: "CAL2",
      prop: "cal2",
      fieldProps: {
        placeholder: "请输入",
      },
    },
    {
      label: "斜率",
      prop: "slope_val",
      fieldProps: {
        placeholder: "请输入",
      },
    },
    {
      label: "备注",
      prop: "note",
      fieldProps: {
        placeholder: "",
      },
    },
  ];
  // 新增弹窗的验证规则
  const addFormRules = {
    calibrate_date: [
      {
        required: true,
        message: "请选择校准日期",
      },
    ],
    calibrate_uid: [
      {
        required: true,
        message: "请选择校准人",
      },
    ],
    cal1: [
      {
        required: true,
        message: "请录入cal1",
      },
    ],
    cal2: [
      {
        required: true,
        message: "请录入cal2",
      },
    ],
    slope_val: [
      {
        required: true,
        message: "请录入斜率实测值",
      },
    ],
  };

  // 新增弹窗开关
  const addVisible = ref(false);
  /** 表格表单数据 */

  /** 表格数据 */
  return {
    pagination,
    formData,
    searchColumns,
    columns,
    addFormData,
    addFormColumns,
    addFormRules,
    addVisible,
    initBaseData,
    useSetting
  };
}
