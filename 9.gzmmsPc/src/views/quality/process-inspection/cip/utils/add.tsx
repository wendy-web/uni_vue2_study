import { useselectData } from "@/hooks/quality/selectData";

export function useAdd() {
  const { baseCheckStatusList } = useselectData();

  /**  顶部基础表单的数据 */
  const baseForm = ref({
    order_no: "", //单据编号
    ct_name: "", //制单人
    create_time: "", //创建时间

    workshop_name: "", //车间名称
    line_name: "", //线别名称
    check_date: "", //检测日期
    brand_text: "", //产品大类(产品品牌)
    check_ret: undefined as FormNumType, //检验状态
    pro_name: "", //检测项目
  });

  /** 1是新建,2是编辑 3是详情 */
  const pageType = ref(1);

  /** 顶部基础表单的数据的配置 */
  const baseColumns: PlusColumnList = [
    {
      label: "单据编号",
      prop: "order_no",
      fieldProps: {
        disabled: true,
      },
    },
    {
      label: "制单人",
      prop: "ct_name",
      fieldProps: {
        disabled: true,
      },
    },
    {
      label: "创建时间",
      prop: "create_time",
      fieldProps: {
        disabled: true,
      },
    },
    {
      label: "车间",
      prop: "workshop_name",
      fieldProps: {
        disabled: true,
      },
    },

    {
      label: "线别",
      prop: "line_name",
      fieldProps: {
        disabled: true,
      },
    },
    {
      label: "检测日期",
      prop: "check_date",
      fieldProps: {
        disabled: true,
      },
    },
    {
      label: "CIP项目",
      prop: "pro_name",
      fieldProps: {
        disabled: true,
      },
    },
    {
      label: "产品大类",
      prop: "brand_text",
      fieldProps: {
        disabled: true,
      },
    },
    {
      label: "检验状态",
      prop: "check_ret",
      valueType: "select",
      options: baseCheckStatusList,
      fieldProps: {
        disabled: true,
        placeholder: "自动判断",
      },
    },
  ];

  const isDetailDisable = computed(() => {
    return pageType.value === 3;
  });

  const fileData = ref<any[]>([]);

  return {
    baseForm,
    baseColumns,
    fileData,
    pageType,
    isDetailDisable,
  };
}
