import { ElImage } from "element-plus";
import dayjs from "dayjs";
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useUserStoreHook } from "@/store/modules/user";

export function useAdd() {
  const useSetting = useSettingsStoreHook();
  const useUser = useUserStoreHook();
  const { getStatusText, passList, getLineList,tasteOptions } = useselectData();

  /**  顶部基础表单的数据 */
  const baseForm = ref({
    order_no: "", //单据编号-保存剔除
    // 状态；0：暂存；1：待审核；2：已审核；3：已驳回；4：已撤回；5：已反审；
    order_status: "", //单据状态-保存剔除
    ct_name: "", //制单人-保存剔除
    create_time: "", //创建时间-保存剔除

    check_date: "", //检测日期
    line_id: undefined as FormNumType, //线别id
    check_res: undefined as FormNumType, //验证结果

    check_user_signature: "", //检验员的签名图片
    reviewer_user_signature: "", //复核员签名图片
    note: "", //备注
  });

  /** 1是新建,2是编辑 3是详情 */
  const pageType = ref(1);
  const isDetailDisable = computed(() => {
    return pageType.value === 3;
  });

  const tableForm = reactive({
    tableData: [
      {
        id: undefined as FormNumType,
        sample_tank1_res: undefined as FormNumType,
        sample_tank2_res: undefined as FormNumType,
        sample_tank3_res: undefined as FormNumType,
        sample_tank4_res: undefined as FormNumType,
        sample_tank5_res: undefined as FormNumType,
        sample_tank6_res: undefined as FormNumType,
        sample_tank7_res: undefined as FormNumType,
      },
    ],
  });

  const { tableData } = toRefs(tableForm);
  /** 表格数据大于0 */
  const isDisabled = computed(() => {
    return tableData.value.length > 0;
  });

  /** 顶部基础表单的数据的配置 */
  const baseColumns: PlusColumnList = [
    {
      label: "单据编号",
      prop: "order_no",
      valueType: "text",
      hideInForm: computed(() => pageType.value === 1),
    },
    {
      label: "单据状态",
      prop: "order_status",
      valueType: "text",
      hideInForm: computed(() => pageType.value === 1),
    },
    {
      label: "制单人",
      prop: "ct_name",
      valueType: "text",
      hideInForm: computed(() => pageType.value === 1),
    },
    {
      label: "创建时间",
      prop: "create_time",
      valueType: "text",
      hideInForm: computed(() => pageType.value === 1),
    },

    {
      label: "检验日期",
      prop: "check_date",
      valueType: "date-picker",
      fieldProps: {
        type: "date",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        disabledDate: (date: string) => {
          return dayjs().isBefore(date);
        },
      },
    },

    {
      label: "验证结果",
      prop: "check_res",
      valueType: "select",
      options: [
        {
          label: "合格",
          value: 1,
        },
        {
          label: "异常",
          value: 0,
        },
      ],
    },
    {
      label: "线别",
      prop: "line_id",
      valueType: "select",
      options: getLineList,
    },

    {
      label: "检验员签名图片",
      prop: "check_user_signature",
      labelWidth: 120,
      hideInForm: computed(() => pageType.value !== 3),
      renderField: (value) => (
        <>
          {value ? (
            <ElImage
              style="width: 60px; height: 60px"
              src={useSetting.baseHttp + value}
              preview-src-list={[useSetting.baseHttp + value]}
            />
          ) : (
            <span class="text-gray-400">暂无~</span>
          )}
        </>
      ),
    },
    {
      label: "复核员签名图片",
      prop: "reviewer_user_signature",
      labelWidth: 120,
      hideInForm: computed(() => pageType.value !== 3),
      renderField: (value) => {
        let list = value ? (value as string).split(",").map((el) => useSetting.baseHttp + el) : [];
        return (
          <>
            {list.length > 0 ? (
              list.map((item, index) => {
                return (
                  <ElImage
                    style="width: 60px; height: 60px;margin-right:8px;"
                    src={item}
                    preview-src-list={list}
                    initial-index={index}
                  />
                );
              })
            ) : (
              <span class="text-gray-400">暂无~</span>
            )}
          </>
        );
      },
    },
    {
      label: "备注",
      prop: "note",
      colProps: {
        span: 18,
      },
    },
  ];

  /** 基础信息表单验证规则 */
  const baseRules = {
    check_date: [
      {
        required: true,
        message: "请选择检验日期",
      },
    ],
    check_res: [
      {
        required: true,
        message: "请选择验证结果",
      },
    ],
    line_id: [
      {
        required: true,
        message: "请选择线别",
      },
    ],
  };

  const tableColumns: TableColumnList = [
    {
      label: "样罐",
      cellRenderer: ({ row }) => {
        return (
          <>
            <span class="text-red-500">*</span>
            <span>是否剔除</span>
          </>
        );
      },
      width: 100,
    },
    {
      label: "样罐1",
      prop: "sample_tank1_res",
      slot: "sample_tank1_res",
    },
    {
      label: "样罐2",
      prop: "sample_tank2_res",
      slot: "sample_tank2_res",
    },
    {
      label: "样罐3",
      prop: "sample_tank3_res",
      slot: "sample_tank3_res",
    },
    {
      label: "样罐4",
      prop: "sample_tank4_res",
      slot: "sample_tank4_res",
    },
    {
      label: "样罐5",
      prop: "sample_tank5_res",
      slot: "sample_tank5_res",
    },
    {
      label: "样罐6",
      prop: "sample_tank6_res",
      slot: "sample_tank6_res",
    },
    {
      label: "样罐7",
      prop: "sample_tank7_res",
      slot: "sample_tank7_res",
    },
  ];

  /** 如果是提交则设为true,表示必填 */
  const is_submit = ref(false);

  const tableRules = reactive({
    sample_tank1_res: [
      {
        required: is_submit,
        message: "请选择样罐1结果",
      },
    ],
    sample_tank2_res: [
      {
        required: is_submit,
        message: "请选择样罐2结果",
      },
    ],
    sample_tank3_res: [
      {
        required: is_submit,
        message: "请选择样罐3结果",
      },
    ],
    sample_tank4_res: [
      {
        required: is_submit,
        message: "请选择样罐4结果",
      },
    ],
    sample_tank5_res: [
      {
        required: is_submit,
        message: "请选择样罐5结果",
      },
    ],
    sample_tank6_res: [
      {
        required: is_submit,
        message: "请选择样罐6结果",
      },
    ],
    sample_tank7_res: [
      {
        required: is_submit,
        message: "请选择样罐7结果",
      },
    ],
  });

  const logList = ref<any[]>([]);

  return {
    baseForm,
    baseColumns,
    baseRules,
    logList,
    tableForm,
    tableData,
    tableColumns,
    pageType,
    is_submit,
    getStatusText,
    isDetailDisable,
    useSetting,
    tableRules,
    passList,
    tasteOptions,
  };
}
