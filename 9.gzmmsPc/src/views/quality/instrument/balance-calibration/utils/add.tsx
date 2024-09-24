import { ElForm, ElFormItem, ElImage, ElOption, ElSelect } from "element-plus";
import type { FormInstance } from "element-plus";
import dayjs from "dayjs";
import { unitListHooks } from "@/hooks/index";
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useUserStoreHook } from "@/store/modules/user";

/** 天平信息列表数据 */
export interface ScaledeviceInitType {
  id: number;
  sort: number;
  use_place_id: string;
  use_place: string;
  inst_id: number;
  name: string;
  productserial_no: string;
  inst_type_no: string;
  max_val: string;
  max_unit: string;
  e_val: string;
  e_unit: string;
  d_val: string;
  d_unit: string;
  weight_val: string;
  weight_unit: string;
  update_time: string;
  ct_uid: number;
  ct_name: string;
  up_uid: number;
  up_name: string;
  create_time: string;
  select_status?: boolean;
}

/** 表格数据 */
type TableType = {
  scaledevice_id: number;
  id?: number; //编辑时存在
  inst_type_no?: string;
  productserial_no?: string;
  A_val?: string;
  B_val?: string;
  C_val?: string;
  D_val?: string;
  E_val?: string;
  AVG_val?: string;
  check_ret?: number;
};

export function useAdd() {
  const useSetting = useSettingsStoreHook();
  const useUser = useUserStoreHook();

  const { getStatusText, passList, userOptions, getUserOptions, basePassList } = useselectData();

  const { unitList } = unitListHooks();

  /**  顶部基础表单的数据 */
  const baseForm = ref({
    order_no: "", //单据编号-保存剔除
    // 状态；0：暂存；1：待审核；2：已审核；3：已驳回；4：已撤回；5：已反审；
    order_status: "", //单据状态-保存剔除
    ct_name: "", //制单人-保存剔除
    create_time: "", //创建时间-保存剔除

    scaledevice_types: "", //型号
    use_place_id: "", //使用地点id
    use_place: "", //使用地点名称
    check_date: dayjs().format("YYYY-MM-DD"), //检测日期
    temperature: "", //温度
    humidity: "", //湿度
    weight_val: "", //砝码重量
    weight_unit: "", //砝码重量单位
    weight_content: "", //砝码重量显示内容
    max_val: "", //MAX重量
    max_unit: "", //MAX重量单位
    max_content: "", //Max规格显示内容

    check_user_id: useUser.uid, //检验员id
    check_user_name: useUser.nickname, //检验员名称

    check_sign: "", //检验员签字
    recheck_sign: "", //复核人签名图片
    remark: "", //备注
    check_ret: undefined as FormNumType, //检验结果
  });

  const unitForm = ref({
    unit: "", //单位
  });
  const unitFormRef = ref<FormInstance>();
  const unitRules = {
    unit: [
      {
        required: true,
        message: "请选择单位",
      },
    ],
  };

  /** 1是新建,2是编辑 3是详情 */
  const pageType = ref(1);
  /** 判断是否是新建页面 */
  const isAddDisable = computed(() => {
    return pageType.value === 1;
  });
  /** 判断是否是详情页 */
  const isDetailDisable = computed(() => {
    return pageType.value === 3;
  });

  const tableForm = reactive({
    tableData: [] as TableType[], //感官性状和一般化学指标数据
  });

  const { tableData } = toRefs(tableForm);

  const selectCheckUserRef = ref<InstanceType<typeof ElSelect>>(); //操作员ref
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
      label: "型号",
      prop: "scaledevice_types",
      fieldProps: {
        disabled: true,
        placeholder: "自动生成",
      },
      tooltip: "由添加的检验信息去重组合生成",
    },

    {
      label: "检测日期",
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
      label: "使用地点",
      prop: "use_place",
      fieldProps: {
        disabled: true,
      },
    },
    {
      label: "温度",
      prop: "temperature",
      fieldProps: {
        clearable: false,
      },
      fieldSlots: {
        suffix: () => {
          return "℃";
        },
      },
    },
    {
      label: "湿度",
      prop: "humidity",
      fieldProps: {
        clearable: false,
      },
      fieldSlots: {
        suffix: () => {
          return "%";
        },
      },
    },
    {
      label: "砝码重量",
      prop: "weight_content",
      fieldProps: {
        disabled: true,
      },
    },
    {
      label: "Max规格",
      prop: "max_content",
      fieldProps: {
        disabled: true,
      },
    },
    {
      label: "检验结果",
      prop: "check_ret",
      valueType: "select",
      options: basePassList,
      tooltip: "根据检验信息的检验结果自动判断,存在三种情况: 合格、不合格、部分合格",
      fieldProps: {
        disabled: true,
        placeholder: "自动判断",
      },
    },
    {
      label: "检验员",
      prop: "operation_user_id",
      renderField: () => {
        return (
          <ElSelect
            v-model={baseForm.value.check_user_id}
            ref={selectCheckUserRef}
            style="width:100%"
            filterable={true}
            onChange={() => {
              nextTick(() => {
                baseForm.value.check_user_name = selectCheckUserRef.value?.selected.currentLabel;
              });
            }}
          >
            {userOptions.value.map((option) => (
              <ElOption key={option.id} label={option.name} value={option.id} />
            ))}
          </ElSelect>
        );
      },
    },
    {
      label: "检验员签名",
      prop: "check_sign",
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
      label: "复核员签名",
      prop: "recheck_sign",
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

  /** 如果是提交则设为true,表示必填 */
  const is_submit = ref(false);

  /** 基础信息表单验证规则 */
  const baseRules = reactive({
    // scaledevice_types: [
    //   {
    //     required: true,
    //     message: "请选择型号",
    //   },
    // ],
    check_date: [
      {
        required: true,
        message: "请选择检验日期",
      },
    ],
    temperature: [
      {
        required: true,
        message: "请输入温度",
      },
    ],
    humidity: [
      {
        required: true,
        message: "请输入湿度",
      },
    ],
    check_user_id: [
      {
        required: true,
        message: "请选择检验员",
      },
    ],
  });

  const tableColumns: TableColumnList = [
    {
      label: "勾选列",
      type: "selection",
    },
    {
      label: "序号",
      type: "index",
      width: 60,
      align: "center",
    },
    {
      label: "型号",
      prop: "inst_type_no",
      align: "center",
    },
    {
      label: "出厂编号",
      prop: "productserial_no",
      align: "center",
    },
    {
      label: "数值",
      align: "center",
      renderHeader: () => {
        return (
          <>
            <ElForm
              class="flex justify-center"
              ref={unitFormRef}
              rules={unitRules}
              model={unitForm}
            >
              <ElFormItem label="数值单位" prop="unit">
                <ElSelect
                  v-model={unitForm.value.unit}
                  filterable={true}
                  disabled={isDetailDisable.value}
                >
                  {unitList.value.map((option) => (
                    <ElOption key={option.id} label={option.name} value={option.name} />
                  ))}
                </ElSelect>
              </ElFormItem>
            </ElForm>
          </>
        );
      },
      children: [
        {
          label: "A",
          prop: "A_val",
          align: "center",
          slot: "A_val",
        },
        {
          label: "B",
          prop: "B_val",
          align: "center",
          slot: "B_val",
        },
        {
          label: "C",
          prop: "C_val",
          align: "center",
          slot: "C_val",
        },
        {
          label: "D",
          align: "center",
          prop: "D_val",
          slot: "D_val",
        },
        {
          label: "E",
          prop: "E_val",
          align: "center",
          slot: "E_val",
        },
        {
          label: "平均",
          prop: "AVG_val",
          align: "center",
          slot: "AVG_val",
        },
      ],
    },
    {
      label: "检定结论",
      prop: "check_ret",
      align: "center",
      slot: "check_ret",
    },
  ];

  const tableRules = reactive({
    A_val: [
      {
        required: is_submit,
        message: "请输入A值",
      },
    ],
    B_val: [
      {
        required: is_submit,
        message: "请输入A值",
      },
    ],
    C_val: [
      {
        required: is_submit,
        message: "请输入A值",
      },
    ],
    D_val: [
      {
        required: is_submit,
        message: "请输入A值",
      },
    ],
    E_val: [
      {
        required: is_submit,
        message: "请输入A值",
      },
    ],
    check_ret: [
      {
        required: is_submit,
        message: "请选择检定结论",
      },
    ],
  });

  const fileData = ref<any[]>([]);
  const logList = ref<any[]>([]);

  return {
    baseForm,
    baseColumns,
    baseRules,
    fileData,
    logList,
    pageType,
    is_submit,
    getStatusText,
    isDetailDisable,
    useSetting,
    passList,
    getUserOptions,
    tableForm,
    tableData,
    tableRules,
    tableColumns,
    unitForm,
    unitFormRef,
    isAddDisable,
  };
}
