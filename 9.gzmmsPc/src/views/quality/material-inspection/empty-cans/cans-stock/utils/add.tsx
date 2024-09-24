import { ElImage } from "element-plus";
import dayjs from "dayjs";
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useUserStoreHook } from "@/store/modules/user";

/** 表格展示信息的数据类型 */
export interface TableDataType {
  id?: number;
  batch_no: string;
  joint_pack_no?: string;
  line?: string;
  print_factor?: string;
  version?: string;
  line_id?: number;
  version_id?: number;
  print_factor_id?: number;
  note?: string;
}

/** 根据批号分组的数据类型 */
export type GroupedPacks = {
  [groupName: string]: GroupedList[];
};

/** 分组数据的value的数据类型 */
export type GroupedList = {
  id?: number; // 托盘信息记录id 编辑时存在
  detail_id?: number; // 检验明细 编辑时存在
  inner_detail_id: number; //内涂膜检验明细id,
  batch_no: string;
  line: string;
  print_factor: string;
  version: string;
  line_id: number;
  version_id: number;
  print_factor_id: number;
  pack_no: number;
  customNote?: string; // 自定义备注字段,记录编辑时首层数组存在的备注
  unique_id: string; // waitList数据的唯一值
};

/** 连续性数值的数据类型 */
export type ContinuityResult = {
  [groupName: string]: string;
};

export function useAdd() {
  const useSetting = useSettingsStoreHook();
  const useUser = useUserStoreHook();
  const { getBrandMap, getSkuMap, getSupList, getUserList, getStatusText, passList, basePassList } =
    useselectData();

  const passOptions = passList.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  /**  顶部基础表单的数据 */
  const baseForm = ref({
    order_no: "", //单据编号-保存剔除
    // 状态；0：暂存；1：待审核；2：已审核；3：已驳回；4：已撤回；5：已反审；
    order_status: "", //单据状态-保存剔除
    ct_name: "", //制单人-保存剔除
    create_time: "", //创建时间-保存剔除
    supplier_id: undefined as FormNumType, //供应商id
    sku: "", //产品类型
    check_time: "", //检验日期
    brand: "ND1", // 产品大类(产品品牌)不可选择,默认红牛
    // check_uid: undefined as FormNumType, //检验员id
    check_uid: useUser.uid, //检验员id
    check_res: 3 as FormNumType, //检验结果
    note: "", //备注
    check_user_signature: "", //检验员的签名图片
    reviewer_user_signature: "", //复核员签名图片
  });

  /** 检验信息表单数据 */
  const checkForm = ref({
    exterior_res: undefined as FormNumType, //外观
    label_recog_res: undefined as FormNumType, //标签标识
    inner_coating_film_res: undefined as FormNumType, //内涂膜
    weld_integrity_res: undefined as FormNumType, //焊缝完整性
    roll_sealing_res: undefined as FormNumType, //卷封
    silent_code_test_res: undefined as FormNumType, //默码试机
    bottom_cover_blue_res: undefined as FormNumType, //底盖蓝点
    bursting_power_res: undefined as FormNumType, //启破力
  });

  /** 如果是提交则设为true,表示必填 */
  const is_submit = ref(false);

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

  /** 基础信息表单验证规则 */
  const baseRules = {
    supplier_id: [
      {
        required: true,
        message: "请选择供应商",
      },
    ],
    sku: [
      {
        required: true,
        message: "请选择产品类型",
      },
    ],
    check_time: [
      {
        required: true,
        message: "请选择检验日期",
      },
    ],
    check_uid: [
      {
        required: true,
        message: "请选择检测人员",
      },
    ],
  };

  /** 检验信息表单验证规则 */
  const checkRules = reactive({
    exterior_res: [
      {
        required: is_submit,
        message: "请选择外观是否合格",
      },
    ],
    label_recog_res: [
      {
        required: is_submit,
        message: "请选择标签标识是否合格",
      },
    ],
    inner_coating_film_res: [
      {
        required: is_submit,
        message: "请选择内涂膜是否合格",
      },
    ],
    weld_integrity_res: [
      {
        required: is_submit,
        message: "请选择焊缝完整性是否合格",
      },
    ],
    roll_sealing_res: [
      {
        required: is_submit,
        message: "请选择卷封是否合格",
      },
    ],
    silent_code_test_res: [
      {
        required: is_submit,
        message: "请选择默码试机是否合格",
      },
    ],
    bottom_cover_blue_res: [
      {
        required: is_submit,
        message: "请选择底盖蓝点是否合格",
      },
    ],
    bursting_power_res: [
      {
        required: is_submit,
        message: "请选择启破力是否合格",
      },
    ],
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
      label: "供应商",
      prop: "supplier_id",
      valueType: "select",
      options: getSupList,
      fieldProps: computed(() => {
        return {
          filterable: true,
          disabled: isDisabled.value,
        };
      }),
    },
    {
      label: "产品类型",
      prop: "sku",
      valueType: "select",
      options: () => getSkuMap(baseForm.value.brand),
      fieldProps: computed(() => {
        return {
          onChange: () => {
            // 切换产品类型时,检验信息表单数据的默码试机/底盖蓝点/启破力--清空选择数据
            checkForm.value.silent_code_test_res = undefined;
            checkForm.value.bottom_cover_blue_res = undefined;
            checkForm.value.bursting_power_res = undefined;
          },
          filterable: true,
          clearable: false,
          disabled: isDisabled.value,
        };
      }),
    },
    {
      label: "检验日期",
      prop: "check_time",
      valueType: "date-picker",
      fieldProps: computed(() => {
        return {
          format: "YYYY-MM-DD",
          valueFormat: "YYYY-MM-DD",
          disabledDate: (date: string) => {
            return dayjs().isBefore(date);
          },
          disabled: isDisabled.value,
        };
      }),
    },
    {
      label: "产品大类",
      prop: "brand",
      valueType: "select",
      options: getBrandMap,
      fieldProps: {
        disabled: true,
      },
    },
    {
      label: "检验员",
      prop: "check_uid",
      valueType: "select",
      options: getUserList,
      colProps: {
        span: 12,
      },
      fieldProps: {
        filterable: true,
        clearable: false,
      },
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
      // options: passOptions,
      colProps: {
        span: 12,
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
      colProps: {
        span: 16,
      },
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

  /** 检验信息表单的配置 */
  const checkColumns: PlusColumnList = [
    {
      label: "外观",
      prop: "exterior_res",
      // valueType: "plus-radio",
      valueType: "radio",
      options: passOptions,
    },
    {
      label: "标签标识",
      prop: "label_recog_res",
      // valueType: "plus-radio",
      valueType: "radio",
      options: passOptions,
    },
    {
      label: "内涂膜",
      prop: "inner_coating_film_res",
      // valueType: "plus-radio",
      valueType: "radio",
      options: passOptions,
    },
    {
      label: "焊缝完整性",
      prop: "weld_integrity_res",
      // valueType: "plus-radio",
      valueType: "radio",
      labelWidth: 100,
      options: passOptions,
    },
    {
      label: "卷封",
      prop: "roll_sealing_res",
      // valueType: "plus-radio",
      valueType: "radio",
      options: passOptions,
    },
    {
      label: "默码试机",
      prop: "silent_code_test_res",
      // valueType: "plus-radio",
      valueType: "radio",
      options: passOptions,
      hideInForm: computed(() => baseForm.value.sku !== "ND1-1"),
    },
    {
      label: "底盖蓝点",
      prop: "bottom_cover_blue_res",
      // valueType: "plus-radio",
      valueType: "radio",
      options: passOptions,
      hideInForm: computed(() => baseForm.value.sku !== "ND1-1"),
    },
    {
      label: "启破力",
      prop: "bursting_power_res",
      // valueType: "plus-radio",
      valueType: "radio",
      options: passOptions,
      hideInForm: computed(() => baseForm.value.sku !== "ND1-2"),
    },
  ];

  const tableColumns: TableColumnList = [
    {
      label: "勾选列",
      type: "selection",
      hide: () => isDetailDisable.value,
    },
    {
      label: "#",
      type: "index",
      width: 70,
    },
    {
      label: "批号",
      prop: "batch_no",
    },
    {
      label: "托盘号",
      prop: "joint_pack_no",
      slot: "joint_pack_no",
    },
    {
      label: "线别",
      prop: "line",
    },
    {
      label: "彩印铁厂家",
      prop: "print_factor",
    },
    {
      label: "版本",
      prop: "version",
    },
    {
      label: "备注",
      prop: "note",
      slot: "note",
    },
  ];

  const fileData = ref<any[]>([]);
  const logList = ref<any[]>([]);

  return {
    baseForm,
    baseColumns,
    fileData,
    logList,
    tableForm,
    tableData,
    tableColumns,
    checkColumns,
    checkForm,
    baseRules,
    pageType,
    getStatusText,
    is_submit,
    checkRules,
    useSetting,
    isDetailDisable,
  };
}
