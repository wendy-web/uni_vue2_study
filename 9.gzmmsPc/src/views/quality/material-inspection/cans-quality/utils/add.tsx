import { ElImage } from "element-plus";
import dayjs from "dayjs";
import { getTabelLabelApi } from "@/api/quality/common";
import type { fieldConfigType } from "@/hooks/quality/index";
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useUserStoreHook } from "@/store/modules/user";

export type TableDataType = {
  id: number | string;
  sample_num?: number; //样品数
  check_inner_item?: CheckInnerItem[]; //内涂膜明细
  tank_height1?: string; //罐体高度1
  tank_height2?: string; //罐体高度2
  tank_height3?: string; //罐体高度3
  flange_width1?: string; //翻边宽度1
  flange_width2?: string; //翻边宽度2
  flange_width3?: string; //翻边宽度3
  bottom_arch_height?: string; //底拱高度
  rac_inner_diameter?: string; //缩颈内径
  tank_axial_pressure?: string; //罐体轴向称压力
  crs_strength_bottom?: string; //罐底耐压强度
  sample_time?: string; //样品时间
  boiling_experiment_res?: number; //水煮实验检测结果；0：不合格；1：合格
  acid_boiling_experiment_res?: number; //酸煮实验检测结果；0：不合格；1：合格
  adhesion_experiment_res?: number; //内涂膜附着力实验检测结果；0：不合格；1：合格
  dyeing_experiment_res?: number; //染色实验检测结果；0：不合格；1：合格
  resistance_outer_coating_res?: number; //外涂层耐酸实验检测结果；0：不合格；1：合格
  check_ret?: number;
};

export interface CheckInnerItem {
  id?: number;
  pro_package_number: number;
  actual_value: string;
}

export function useAdd() {
  const useSetting = useSettingsStoreHook();
  const useUser = useUserStoreHook();
  const {
    getBrandMap,
    getSkuMap,
    getUserList,
    getStatusText,
    getVersionMap,
    passList,
    getCheckReagent,
    getEmptyCanSizeMap,
    basePassList,
  } = useselectData();

  /**  顶部基础表单的数据 */
  const baseForm = ref({
    order_no: "", //单据编号-保存剔除
    // 状态；0：暂存；1：待审核；2：已审核；3：已驳回；4：已撤回；5：已反审；
    order_status: "", //单据状态-保存剔除
    ct_name: "", //制单人-保存剔除
    create_time: "", //创建时间-保存剔除

    brand: "ND2", // 产品大类(产品品牌)
    check_time: "", //检验日期
    sku: "ND2-1", //产品类型
    batch_no: "", //生产批号
    // check_uid: undefined as FormNumType, //检验员id
    check_uid: useUser.uid, //检验员id
    check_res: 3 as FormNumType, //检验结果
    check_user_signature: "", //检验员的签名图片
    reviewer_user_signature: "", //复核员签名图片
    note: "", //备注
    check_reagent_id: undefined as FormNumType, //检测试剂id
    empty_can_size_id: undefined as FormNumType, //空罐尺寸id
    version_id: undefined as FormNumType, //版本id
  });

  /** 1是新建,2是编辑 3是详情 */
  const pageType = ref(1);
  const isDetailDisable = computed(() => {
    return pageType.value === 3;
  });

  const tableForm = reactive({
    tableData: [] as TableDataType[],
  });

  const { tableData } = toRefs(tableForm);
  /** 表格数据大于0 */
  const isDisabled = computed(() => {
    return tableData.value.length > 0;
  });

  const configData = ref();
  //底拱高度--标准配置项
  const bottom_arch_config = ref<fieldConfigType>();
  //罐底耐压强度--标准配置项
  const crs_strength_config = ref<fieldConfigType>();
  //翻边宽度--标准配置项
  const flange_width_config = ref<fieldConfigType>();
  //内涂膜--标准配置项
  const inner_coating_config = ref<fieldConfigType>();
  //缩颈内径--标准配置项
  const rac_inner_config = ref<fieldConfigType>();
  //罐体轴向承压力--标准配置项
  const tank_axial_confg = ref<fieldConfigType>();
  //罐体高度--标准配置项
  const tank_height_config = ref<fieldConfigType>();

  /** 获取标准配置 */
  async function getSettingConfig() {
    let data = {
      item: 8,
      sku: baseForm.value.sku,
    };
    const result = await getTabelLabelApi(data);
    configData.value = result.data;
    bottom_arch_config.value = getFieldConfig("bottom_arch_height", result.data); //底拱高度
    crs_strength_config.value = getFieldConfig("crs_strength_bottom", result.data); //罐底耐压强度
    flange_width_config.value = getFieldConfig("flange_width", result.data); //翻边宽度
    inner_coating_config.value = getFieldConfig("inner_coating_film", result.data); //内涂膜
    rac_inner_config.value = getFieldConfig("rac_inner_diameter", result.data); //缩颈内径
    tank_axial_confg.value = getFieldConfig("tank_axial_pressure", result.data); //罐体轴向承压力
    tank_height_config.value = getFieldConfig("tank_height", result.data); //罐体高度
  }
  /** 根据字段来获取标准配置 */
  function getFieldConfig(field: string, data: any) {
    let { type, unit, lower_limit_val, upper_limit_val, default_val, initval, error_limit_val } =
      data[field];
    return { type, unit, lower_limit_val, upper_limit_val, default_val, initval, error_limit_val };
  }

  /** 当产品类型change时触发 */
  function changeCheckConfig() {
    if (baseForm.value.sku) {
      getSettingConfig();
    }
  }

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
      label: "空罐尺寸",
      prop: "empty_can_size_id",
      valueType: "select",
      options: getEmptyCanSizeMap,
    },
    {
      label: "生产批号",
      prop: "batch_no",
    },
    {
      label: "检验日期",
      prop: "check_time",
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
      label: "版本",
      prop: "version_id",
      valueType: "select",
      options: getVersionMap,
    },
    {
      label: "检测试剂",
      prop: "check_reagent_id",
      valueType: "select",
      options: getCheckReagent,
    },
    {
      label: "产品类型",
      prop: "sku",
      valueType: "select",
      options: () => getSkuMap(baseForm.value.brand),
      fieldProps: computed(() => ({
        onChange: () => {
          changeCheckConfig();
        },
        disabled: isDisabled.value,
        filterable: true,
        clearable: false,
      })),
    },
    {
      label: "检验结果",
      prop: "check_res",
      valueType: "select",
      options: basePassList,
      fieldProps: {
        disabled: true,
      },
      tooltip: "自动判断: 合格,不合格,部分合格",
    },
    {
      label: "检验员",
      prop: "check_uid",
      valueType: "select",
      options: getUserList,
      fieldProps: {
        clearable: false,
        filterable: true,
      },
    },
    {
      label: "产品大类",
      prop: "brand",
      valueType: "select",
      options: getBrandMap,
      fieldProps: {
        disabled: true,
        filterable: true,
        clearable: false,
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
        span: 24,
      },
    },
  ];

  /** 基础信息表单验证规则 */
  const baseRules = {
    empty_can_size_id: [
      {
        required: true,
        message: "请选择空罐尺寸",
      },
    ],
    batch_no: [
      {
        required: true,
        message: "请输入生产批号",
      },
    ],
    check_time: [
      {
        required: true,
        message: "请选择检测日期",
      },
    ],
    version_id: [
      {
        required: true,
        message: "请选择版本",
      },
    ],
    sku: [
      {
        required: true,
        message: "请选择产品类型",
      },
    ],
    check_uid: [
      {
        required: true,
        message: "请选择检验员",
      },
    ],
  };

  const tableColumns = ref<TableColumnList>([
    {
      label: "勾选列",
      type: "selection",
      hide: () => isDetailDisable.value,
    },
    {
      label: "组别",
      type: "index",
      width: 70,
    },
    {
      label: "样品数",
      prop: "sample_num",
      slot: "sample_num",
    },
    {
      // label: "内涂膜(mA)",
      label: "内涂膜",
      prop: "check_inner_item",
      slot: "check_inner_item",
      headerRenderer: () => <span>内涂膜({inner_coating_config.value?.unit || "mA"})</span>,
    },
    {
      // label: "罐体高度(mm)",
      label: "罐体高度",
      prop: "tank_height",
      slot: "tank_height",
      headerRenderer: () => <span>罐体高度({tank_height_config.value?.unit || "mm"})</span>,
    },
    {
      // label: "翻边宽度(mm)",
      label: "翻边宽度",
      prop: "flange_width",
      slot: "flange_width",
      headerRenderer: () => <span>翻边宽度({flange_width_config.value?.unit || "mm"})</span>,
    },
    {
      // label: "底拱高度(mm)",
      label: "底拱高度",
      prop: "bottom_arch_height",
      slot: "bottom_arch_height",
      headerRenderer: () => (
        <>
          <span>底拱高度({bottom_arch_config.value?.unit || "mm"})</span>
          <p>{bottom_arch_config.value?.initval}</p>
        </>
      ),
    },
    {
      // label: "缩颈内径(mm)",
      label: "缩颈内径",
      prop: "rac_inner_diameter",
      slot: "rac_inner_diameter",
      headerRenderer: () => (
        <>
          <span>缩颈内径({rac_inner_config.value?.unit || "mm"})</span>
          <p>{rac_inner_config.value?.initval}</p>
        </>
      ),
    },
    {
      // label: "罐体轴向称压力(mm)",
      label: "罐体轴向称压力",
      prop: "tank_axial_pressure",
      slot: "tank_axial_pressure",
      headerRenderer: () => (
        <>
          <span>罐体轴向称压力({tank_axial_confg.value?.unit || "mm"})</span>
          <p>{tank_axial_confg.value?.initval}</p>
        </>
      ),
    },
    {
      // label: "罐底耐压强度(mm)",
      label: "罐底耐压强度",
      prop: "crs_strength_bottom",
      slot: "crs_strength_bottom",
      headerRenderer: () => (
        <>
          <span>罐底耐压强度({crs_strength_config.value?.unit || "mm"})</span>
          <p>{crs_strength_config.value?.initval}</p>
        </>
      ),
    },
    {
      label: "内涂膜实验结果",
      prop: "custom_experiment",
      slot: "custom_experiment",
    },
    {
      label: "样品时间",
      prop: "sample_time",
      slot: "sample_time",
    },
    {
      label: "检验结果",
      prop: "check_ret",
      slot: "check_ret",
    },
  ]);

  /** 如果是提交则设为true,表示必填 */
  const is_submit = ref(false);

  function checkInputNumValidator(
    rule: any,
    value: any,
    callback: any,
    num: number,
    type: number,
    title?: string,
  ) {
    let content = `请将${title}录入完整`;
    // let content = `请录入完整`;
    if (is_submit.value) {
      switch (type) {
        case 1:
          num === 0 ? callback(new Error(content)) : callback();
          break;
        case 2:
          num !== 3 ? callback(new Error(content)) : callback();
          break;
        case 3:
          num !== 3 ? callback(new Error(content)) : callback();
          break;
        case 4:
          num !== 5 ? callback(new Error(content)) : callback();
          break;

        default:
          break;
      }
    } else {
      callback();
    }
  }

  const tableRules = reactive({
    bottom_arch_height: [
      {
        required: is_submit,
        message: "请输入底拱高度",
        // message: "请输入",
      },
    ],
    rac_inner_diameter: [
      {
        required: is_submit,
        message: "请输入缩颈内径",
        // message: "请输入",
      },
    ],
    tank_axial_pressure: [
      {
        required: is_submit,
        message: "请输入罐体轴向称压力",
        // message: "请输入",
      },
    ],
    crs_strength_bottom: [
      {
        required: is_submit,
        message: "请输入罐底耐压强度",
        // message: "请输入",
      },
    ],
    sample_time: [
      {
        required: is_submit,
        message: "请选择样品时间",
      },
    ],
  });

  const otherForm = ref({
    ink_code_res: undefined as FormNumType, //墨码试机检测检测结果；0：不合格；1：合格
  });
  const otherFormColumns: PlusColumnList = [
    {
      label: "墨码试机检测结果",
      prop: "ink_code_res",
      valueType: "plus-radio",
      labelWidth: "130",
      options: () => {
        return passList.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      },
    },
  ];

  const fileData = ref<any[]>([]);
  const logList = ref<any[]>([]);

  return {
    baseForm,
    baseColumns,
    fileData,
    tableForm,
    tableData,
    tableColumns,
    pageType,
    passList,
    baseRules,
    is_submit,
    getStatusText,
    getSettingConfig,
    tank_height_config,
    flange_width_config,
    tableRules,
    isDetailDisable,
    useSetting,
    logList,
    checkInputNumValidator,
    otherForm,
    otherFormColumns,
    bottom_arch_config,
    rac_inner_config,
    tank_axial_confg,
    crs_strength_config,
    inner_coating_config,
  };
}
