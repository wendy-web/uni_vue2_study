import { ElImage, ElOption, ElSelect, FormInstance } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import dayjs from "dayjs";
// 引入获取表头、检测依据api
import { useCommonHooks } from "@/hooks/quality/index";
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();
const { validatorCell } = useCommonHooks();

interface columnItemType {
  label: string;
  prop: string;
  minWidth?: number;
  headerRenderer?: any;
  [key: string]: any;
}
export function useAdd() {
  const useSetting = useSettingsStoreHook();
  const { getStatusText, passList, getUserList, classTimeOptions, getClasstimeOptions } =
    useselectData();
  const selectClassTimeRef = ref<InstanceType<typeof ElSelect>>();

  const BaseData = ref<any>(); // 获取公共下拉框数据配置
  const userOptions = ref<any>([]); // 单据状态 下拉选项
  // 获取公共下拉框数据配置
  async function initBaseData() {
    userOptions.value = await getUserList();
    getClasstimeOptions();
  }
  const tableLableOptions = ref(); // 表头配置

  /** 1是新建,2是编辑,3是详情 */
  const pageType = ref(1);
  const editDisabled = computed(() => {
    return pageType.value === 3;
  });
  /** add表单数据 */
  const formData = ref<any>({
    order_no: "", //单据编号
    check_date: "", // 检测日期
    stat_date: "", // 统计日期
    pro_status: undefined as FormNumType, // 生产状态；0：开机；1：连续生产
    tsa_no: "", // TSA培养基批号
    tsa_config_uid: "", // 培养基配置人uid
    tsa_config_date: "", // 培养基配置日期
    ct_time: "", // CT时间
    class_type: "", // 班组 (1A、2B、3C)
    temperature_val: "", // 温度
    humidity_val: "", // 湿度
    check_uid: "", //检测员uid
    check_res: undefined as FormNumType, // 检查结果；0：不合格；1：合格
    check_user_signature: "", // 检验人签字
    reviewer_user_signature: "", // 复核人签字
    note: "", // 备注
    checkinfo: [], // 检测数据信息
    status: 0, //单据状态
    files: [], //文件数据
    logs: [], //日志信息
  });

  /** add表单验证规则 */
  const formRules = {
    check_date: [
      {
        required: true,
        message: "请选择检测日期",
      },
    ],
    stat_date: [
      {
        required: true,
        message: "请选择统计日期",
      },
    ],
    check_uid: [
      {
        required: true,
        message: "请选择检验员",
      },
    ],
    pro_status: [
      {
        required: true,
        message: "请选择生产状态",
      },
    ],
    tsa_no: [
      {
        required: true,
        message: "请输入TSA培养基批号",
      },
    ],
    tsa_config_uid: [
      {
        required: true,
        message: "请选择培养基配置人",
      },
    ],
    tsa_config_date: [
      {
        required: true,
        message: "请选择培养基配置日期",
      },
    ],
    ct_time: [
      {
        required: true,
        message: "请选择CT时间",
      },
    ],
    temperature_val: [
      {
        required: true,
        message: "请输入温度",
      },
    ],
    humidity_val: [
      {
        required: true,
        message: "请输入湿度",
      },
    ],
    class_type: [
      {
        required: true,
        message: "请选择班组",
      },
    ],
  };
  function checkDate(date: string, diffDate: string, type = 1) {
    let isBefore = dayjs(date).isBefore(dayjs(diffDate).format("YYYY-MM-DD"));
    let isAfter = dayjs(date).isAfter(dayjs(diffDate));
    return type === 1 ? isBefore : isAfter;
  }
  // 判断是否选择产品大类
  const disabledSku = ref(true);

  /** 添加页面使用的PlusForm表单数据 */
  const formColumns: PlusColumnList = [
    {
      label: "单据编号",
      width: 90,
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
      label: "检查日期",
      valueType: "date-picker",
      prop: "check_date",
      labelWidth: 90,
      fieldProps: {
        placeholder: "请选择日期(年月日)",
        type: "date",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        disabledDate: (date: string) => {
          return checkDate(date, dayjs().format("YYYY-MM-DD"), 2); // 2今天之后的日期不可选
        },
      },
      colProps: {
        span: 6,
      },
    },
    {
      label: "统计日期",
      valueType: "date-picker",
      prop: "stat_date",
      labelWidth: 90,
      fieldProps: {
        placeholder: "请选择日期(年月日)",
        type: "date",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        disabledDate: (date: string) => {
          return checkDate(date, dayjs().format("YYYY-MM-DD"), 2); // 2今天之后的日期不可选
        },
      },
      colProps: {
        span: 6,
      },
    },
    {
      label: "检验员",
      prop: "check_uid",
      valueType: "select",
      labelWidth: 90,
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择",
        filterable: true,
      },
      options: computed(() => userOptions.value),
    },
    {
      label: "生产状态",
      prop: "pro_status",
      valueType: "radio",
      options: [
        {
          label: "开机",
          value: 0,
        },
        {
          label: "连续生产",
          value: 1,
        },
      ],
    },
    {
      label: "TSA培养基批号",
      prop: "tsa_no",
      labelWidth: 130,
      fieldProps: {
        placeholder: "请输入",
        maxLength: 50,
      },
      colProps: {
        span: 6,
      },
    },
    {
      label: "培养基配置人",
      prop: "tsa_config_uid",
      valueType: "select",
      labelWidth: 110,
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择",
        filterable: true,
        // onChange: (event: any) => {
        // },
      },
      options: computed(() => userOptions.value),
    },
    {
      label: "培养基配置日期",
      valueType: "date-picker",
      prop: "tsa_config_date",
      labelWidth: 130,
      fieldProps: {
        placeholder: "请选择日期(年月日)",
        type: "date",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        disabledDate: (date: string) => {
          return checkDate(date, dayjs().format("YYYY-MM-DD"), 2); // 2今天之后的日期不可选
        },
      },
      colProps: {
        span: 6,
      },
    },
    {
      label: "CT时间",
      valueType: "time-picker",
      prop: "ct_time",
      labelWidth: 90,
      fieldProps: {
        placeholder: "请选择时/分",
        type: "time",
        format: "HH:mm",
        valueFormat: "HH:mm",
      },
      colProps: {
        span: 6,
      },
    },
    {
      label: "温度",
      prop: "temperature_val",
      labelWidth: 100,
      fieldProps: {
        placeholder: "请输入",
      },
      fieldSlots: {
        append: () => <span>°C</span>,
      },
    },
    {
      label: "湿度",
      labelWidth: 100,
      prop: "humidity_val",
      colProps: {
        span: 6,
      },
      fieldSlots: {
        append: () => <span>%</span>,
      },
    },
    {
      label: "班组",
      prop: "class_type",
      valueType: "select",
      labelWidth: 90,
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择班组",
        filterable: true,
      },
      renderField: () => {
        return (
          <ElSelect
            v-model={formData.value.class_type}
            ref={selectClassTimeRef}
            style="width:100%"
            filterable={true}
            onChange={() => {
              nextTick(() => {
                console.log("currentLabel:", selectClassTimeRef.value?.selected.currentLabel);
                // formData.value.class_name = selectClassTimeRef.value?.selected.currentLabel;
              });
            }}
          >
            {classTimeOptions.value.map((option) => (
              <ElOption key={option.id} label={option.name} value={option.id} />
            ))}
          </ElSelect>
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
    {
      label: "检验员签名",
      prop: "check_user_signature",
      labelWidth: 90,
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
      prop: "reviewer_user_signature",
      labelWidth: 90,
      hideInForm: computed(() => pageType.value !== 3),
      renderField: (value: any) => {
        return (
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
        );
        // let list =
        //   value.length > 0
        //     ? (value as any[]).map((el) => useSetting.baseHttp + el.recheck_sign)
        //     : [];
        // return (
        //   <>
        //     {list.length > 0 ? (
        //       list.map((item, index) => {
        //         return (
        //           <ElImage
        //             style="width: 60px; height: 60px;margin-right:8px;"
        //             src={item}
        //             preview-src-list={list}
        //             initial-index={index}
        //           />
        //         );
        //       })
        //     ) : (
        //       <span class="text-gray-400">暂无~</span>
        //     )}
        //   </>
        // );
      },
    },
  ];

  /** 表格表单数据 */
  const checkTableForm = reactive({
    checkTableData: {} as any,
    tableFormRef: {} as FormInstance,
  });
  /** 表格数据 */
  const { checkTableData, tableFormRef } = toRefs(checkTableForm);
  const disabledDate = (time: Date) => {
    return time.getTime() > Date.now();
  };
  /** 检验信息表格配置 */
  const checkTablecolumns = ref<TableColumnList>([
    // {
    //   label: "勾选列",
    //   type: "selection",
    //   fixed: "left",
    //   hide: () => editDisabled.value,
    // },
    // {
    //   label: "#",
    //   type: "index",
    //   width: 80,
    //   fixed: true,
    // },
    {
      label: "细菌学指标(个/皿)",
      prop: "title",
      slot: "title",
      minWidth: 140,
      fixed: true,
    },
    {
      label: "细菌学指标(个/皿)",
      prop: "subtitle ",
      slot: "subtitle",
      minWidth: 140,
      fixed: true,
    },
    {
      label: "洁净间",
      align: "center",
      children: [
        {
          label: "负压称量室",
          prop: "pressure_weighing_room_val",
          slot: "pressure_weighing_room_val",
          minWidth: 140,
        },
        {
          label: "称量间1",
          prop: "weighing_room1_val",
          slot: "weighing_room1_val",
          minWidth: 140,
        },
        {
          label: "投料间2",
          prop: "feeding_room2_val",
          slot: "feeding_room2_val",
          minWidth: 140,
        },
        {
          label: "配方暂存间",
          prop: "formula_storage_room_val",
          slot: "formula_storage_room_val",
          minWidth: 140,
        },
        {
          label: "化糖间",
          prop: "sugar_conversion_room_val",
          slot: "sugar_conversion_room_val",
          minWidth: 140,
        },
        {
          label: "配料间1",
          prop: "charge_mixture_room1_val",
          slot: "charge_mixture_room1_val",
          minWidth: 140,
        },
        {
          label: "配料间2",
          prop: "charge_mixture_room2_val",
          slot: "charge_mixture_room2_val",
          minWidth: 140,
        },
      ],
    },
    {
      label: "平均数≤10个/皿",
      prop: "avg_val",
      slot: "avg_val",
      minWidth: 140,
    },
    {
      label: "空白样",
      prop: "blank_sample_val",
      slot: "blank_sample_val",
      minWidth: 140,
    },
    {
      label: "结果",
      prop: "check_res",
      slot: "check_res",
      minWidth: 140,
    },

    {
      label: "压差(Pa)",
      prop: "pressure_diff_val",
      slot: "pressure_diff_val",
      minWidth: 140,
    },
    {
      label: "备注",
      prop: "note",
      slot: "note",
      minWidth: 140,
    },
  ]);

  /** 详情-日志表格的columns */
  const logColumns: TableColumnList = [
    {
      label: "操作人",
      prop: "up_name",
      align: "center",
    },
    {
      label: "操作类型",
      prop: "content",
      align: "center",
    },
  ];

  /** 新增检验信息表格2行 */
  function initCheckTableData() {
    let tableData = checkTableData.value;
    // 判断是否有数据
    // let unique_id: string = buildUUID();
    if (tableData.length) {
      return;
    }
    const item = {
      pressure_weighing_room_val: "",
      weighing_room1_val: "",
      feeding_room2_val: "",
      formula_storage_room_val: "",
      sugar_conversion_room_val: "",
      charge_mixture_room1_val: "",
      charge_mixture_room2_val: "",
      blank_sample_val: "",
      pressure_diff_val: "",
      pressure_weighing_room_2_val: "",
      weighing_room1_2_val: "",
      feeding_room2_2_val: "",
      formula_storage_room_2_val: "",
      sugar_conversion_room_2_val: "",
      charge_mixture_room1_2_val: "",
      charge_mixture_room2_2_val: "",
      avg_val: "",
      check_res: "",
    };
    // const dataArray = Array.from({ length: 2 }, () => ({ ...item }));

    // checkTableData.value = [...dataArray];
    checkTableData.value = { ...item };
    console.log("checkTableData.value:", checkTableData.value);
  }
  /** 如果是提交则设为true,表示必填 */
  const is_submit = ref(false);
  /** 检验表格信息 */
  const checkFormRules = {
    pressure_weighing_room_val: [
      {
        required: is_submit,
        message: "请填写负压称量室数据",
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写负压称量室数据"));
            }
            callback();
          }
        },
      },
    ],
    weighing_room1_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写称量间1数据"));
            }
            callback();
          }
        },
      },
    ],
    feeding_room2_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写投料间2数据"));
            }
            callback();
          }
        },
      },
    ],
    formula_storage_room_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写配方暂存间数据"));
            }
            callback();
          }
        },
      },
    ],
    sugar_conversion_room_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写化糖间数据"));
            }
            callback();
          }
        },
      },
    ],
    charge_mixture_room1_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写配料间1数据"));
            }
            callback();
          }
        },
      },
    ],
    charge_mixture_room2_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写配料间2数据"));
            }
            callback();
          }
        },
      },
    ],
    blank_sample_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写空样值"));
            }
            callback();
          }
        },
      },
    ],
    // 检查结果
    check_res: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择结果"));
            }
            callback();
          }
        },
      },
    ],
    pressure_diff_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写压差值"));
            }
            callback();
          }
        },
      },
    ],
    pressure_weighing_room_2_val: [
      {
        required: is_submit,
        message: "请填写负压称量室数据",
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写负压称量室数据"));
            }
            callback();
          }
        },
      },
    ],
    weighing_room1_2_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写称量间1数据"));
            }
            callback();
          }
        },
      },
    ],
    feeding_room2_2_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写投料间2数据"));
            }
            callback();
          }
        },
      },
    ],
    formula_storage_room_2_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写配方暂存间数据"));
            }
            callback();
          }
        },
      },
    ],
    sugar_conversion_room_2_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写化糖间数据"));
            }
            callback();
          }
        },
      },
    ],
    charge_mixture_room1_2_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写配料间1数据"));
            }
            callback();
          }
        },
      },
    ],
    charge_mixture_room2_2_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写配料间2数据"));
            }
            callback();
          }
        },
      },
    ],
    
  };
  // 异常数据统计
  const errorCountMap = ref(new Map<string, boolean>());
  const initErrorCountMap = (isOk: boolean, field: string) => {
    if (!isOk) {
      if (!errorCountMap.value.has(field)) {
        errorCountMap.value.set(field, true);
        // 手动触发更新
        errorCountMap.value = new Map(errorCountMap.value);
      }
      return;
    }
    if (errorCountMap.value.has(field)) {
      errorCountMap.value.delete(field);
      // 手动触发更新
      errorCountMap.value = new Map(errorCountMap.value);
    }
  };
  // 重置异常数据统计
  const resetErrorCountMap = () => {
    errorCountMap.value.clear();
    // 手动触发更新
    errorCountMap.value = new Map();
  };
  // 更新批次
  const updateBatchNo = (value: any) => {
    let tableData = checkTableData.value;
    if (tableData.length) {
      tableData.forEach((item: any, index: number) => {
        item.batch_no = value;
      });
      checkTableData.value = tableData;
    }
  };
  // 判断数值是否在范围内
  function isWithinRange(value1: number, value2: number, tolerance = 0.015, precision = 14) {
    // console.log("value1:", value1, "value2:", value2, "tolerance:", tolerance, "precision:", precision);
    const factor = Math.pow(10, precision);
    return Math.abs(Math.round((Number(value1) - Number(value2)) * factor) / factor) <= tolerance;
  }
  const meetList = [
    {
      label: "符合",
      value: "1",
    },
    {
      label: "不符合",
      value: "0",
    },
  ];
  return {
    pageType,
    editDisabled,
    formData,
    formRules,
    initBaseData,
    formColumns,
    checkTablecolumns,
    checkTableData,
    tableFormRef,
    logColumns,
    initCheckTableData,
    checkTableForm,
    checkFormRules,
    passList,
    errorCountMap,
    tableLableOptions,
    updateBatchNo,
    getStatusText,
    validatorCell,
    isWithinRange,
    meetList,
    resetErrorCountMap,
    is_submit,
    disabledSku,
  };
}
