import { ElImage } from "element-plus";
import dayjs from "dayjs";
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useUserStoreHook } from "@/store/modules/user";

export function useAdd() {
  const useSetting = useSettingsStoreHook();
  const useUser = useUserStoreHook();
  const { getStatusText, passList, getLineList, getClasstimeMap } = useselectData();

  /**  顶部基础表单的数据 */
  const baseForm = ref({
    order_no: "", //单据编号-保存剔除
    // 状态；0：暂存；1：待审核；2：已审核；3：已驳回；4：已撤回；5：已反审；
    order_status: "", //单据状态-保存剔除
    ct_name: "", //制单人-保存剔除
    create_time: "", //创建时间-保存剔除

    check_date: "", //检查日期
    line_id: undefined as FormNumType, //产线id
    class_no: undefined as FormNumType, //班次
    class_type: undefined as FormNumType, //班组
    clean_time: "", //清洗时间
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
      label: "产线",
      prop: "line_id",
      valueType: "select",
      options: getLineList,
    },
    {
      label: "班次",
      prop: "class_no",
      valueType: "select",
      options: [
        {
          label: "早",
          value: 1,
        },
        {
          label: "中",
          value: 2,
        },
        {
          label: "夜",
          value: 3,
        },
      ],
    },
    {
      label: "班组",
      prop: "class_type",
      valueType: "select",
      options: getClasstimeMap,
    },
    {
      label: "清洗时间",
      prop: "clean_time",
      valueType: "time-picker",
      fieldProps: {
        format: "HH:mm",
        valueFormat: "HH:mm",
      },
    },
    {
      label: "检验结果",
      prop: "check_res",
      valueType: "select",
      options: () => {
        return passList.map((el) => {
          return {
            label: el.name,
            value: el.id,
          };
        });
      },
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
    line_id: [
      {
        required: true,
        message: "请选择产线",
      },
    ],
    class_no: [
      {
        required: true,
        message: "请选择班次",
      },
    ],
    class_type: [
      {
        required: true,
        message: "请选择班组",
      },
    ],
    clean_time: [
      {
        required: true,
        message: "请选择班组",
      },
    ],
    check_res: [
      {
        required: true,
        message: "请选择检验结果",
      },
    ],
  };

  const logList = ref<any[]>([]);

  return {
    baseForm,
    baseColumns,
    baseRules,
    logList,
    pageType,
    getStatusText,
    isDetailDisable,
    useSetting,
  };
}
