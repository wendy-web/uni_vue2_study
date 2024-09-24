import { ElImage, ElOption, ElSelect, FormInstance } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import dayjs from "dayjs";
// 引入获取表头、检测依据api
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();

export function useAdd() {
  const useSetting = useSettingsStoreHook();
  const { getStatusText, passList, getUserList, getLineList, getClasstimeMap } = useselectData();
  const userOptions = ref<any>([]); // 单据状态 下拉选项
  const lineOptions = ref<any>([]); // 线别
  // 获取公共下拉框数据配置
  async function initBaseData() {
    userOptions.value = await getUserList();
    lineOptions.value = await getLineList();
  }

  /** 1是新建,2是编辑,3是详情 */
  const pageType = ref(1);
  const editDisabled = computed(() => {
    return pageType.value === 3;
  });
  /** add表单数据 */
  const formData = ref<any>({
    order_no: "", //单据编号
    check_time: "", // 检验时间
    item: "浮游菌 (菌落总数 个/皿)", // 项目名称
    culture_end_time: "", // 培养结束时间
    culture_temperature: "", // 培养温度
    pressure_diff_val: "", // 压差值
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
    check_time: [
      {
        required: true,
        message: "请选择检测时间",
      },
    ],
    culture_end_time: [
      {
        required: true,
        message: "请选择培养结束时间",
      },
    ],
    culture_temperature: [
      {
        required: true,
        message: "请输入培养温度",
      },
    ],
    pressure_diff_val: [
      {
        required: true,
        message: "请输入压差值",
      },
    ],
  };
  function checkDate(date: string, diffDate: string, type = 1) {
    let isBefore = dayjs(date).isBefore(dayjs(diffDate).format("YYYY-MM-DD"));
    let isAfter = dayjs(date).isAfter(dayjs(diffDate));
    return type === 1 ? isBefore : isAfter;
  }

  /** 添加页面使用的PlusForm表单数据 */
  const formColumns: PlusColumnList = [
    {
      label: "项目",
      width: 40,
      prop: "item",
      valueType: "text",
    },
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
      label: "检验时间",
      valueType: "date-picker",
      prop: "check_time",
      labelWidth: 90,
      fieldProps: {
        placeholder: "请选择日期(年月日/时分)",
        type: "datetime",
        format: "YYYY-MM-DD HH:mm",
        valueFormat: "YYYY-MM-DD HH:mm",
        timeFormat: "HH:mm",
        // defaultTime: dayjs().format("HH:mm"),
        disabledDate: (date: string) => {
          return checkDate(date, dayjs().format("YYYY-MM-DD"), 2); // 2今天之后的日期不可选
        },
      },
      colProps: {
        span: 8,
      },
    },
    {
      label: "培养结束时间",
      valueType: "date-picker",
      prop: "culture_end_time",
      labelWidth: 120,
      fieldProps: {
        placeholder: "请选择日期(年月日/时分)",
        type: "datetime",
        format: "YYYY-MM-DD HH:mm",
        timeFormat: "HH:mm",
        valueFormat: "YYYY-MM-DD HH:mm",
        disabledDate: (date: string) => {
          return checkDate(date, dayjs().format("YYYY-MM-DD"), 2); // 2今天之后的日期不可选
        },
      },
      colProps: {
        span: 8,
      },
    },
    {
      label: "培养温度",
      prop: "culture_temperature",
      labelWidth: 90,
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请输入培养温度",
      },
      fieldSlots: {
        append: () => <span>°C</span>,
      },
    },
    {
      label: "压差(Pa)",
      prop: "pressure_diff_val",
      labelWidth: 90,
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请输入压差值",
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
      label: "检验员签字",
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
      label: "报告人签名",
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
  const checkTablecolumns = ref<TableColumnList>([]);

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
      room1_colony_count_val: "",
      room2_colony_count_val: "",
      room3_colony_count_val: "",
      room4_colony_count_val: "",
      room5_colony_count_val: "",
      room6_colony_count_val: "",
      room7_colony_count_val: "",
      room1_avg_density_val: "",
      room3_avg_density_val: "",
      room5_avg_density_val: "",
      room6_avg_density_val: "",
      room1_avg_colony_count_val: "",
      room3_avg_colony_count_val: "",
      room5_avg_colony_count_val: "",
      room6_avg_colony_count_val: "",
      room1_temperature_val: "",
      room3_temperature_val: "",
      room5_temperature_val: "",
      room6_temperature_val: "",
      room1_humidity_val: "",
      room3_humidity_val: "",
      room5_humidity_val: "",
      room6_humidity_val: "",
      room1_check_res: "",
      room3_check_res: "",
      room5_check_res: "",
      room6_check_res: "",
    };
    // const dataArray = Array.from({ length: 1 }, () => ({...item}));
    checkTableData.value = { ...item };
    console.log("checkTableData.value:", checkTableData.value);
  }
  /** 如果是提交则设为true,表示必填 */
  const is_submit = ref(false);
  /** 检验表格信息 */
  const checkFormRules = {
    room1_colony_count_val: [
      {
        required: is_submit,
        message: "请填写称量间1-菌落数",
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写称量间1-菌落数"));
            }
            callback();
          }
        },
      },
    ],
    room2_colony_count_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写称量间2-菌落数"));
            }
            callback();
          }
        },
      },
    ],
    room3_colony_count_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写配方暂存间-菌落数"));
            }
            callback();
          }
        },
      },
    ],
    room4_colony_count_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写化糖间-菌落数"));
            }
            callback();
          }
        },
      },
    ],
    room5_colony_count_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写负压称量室-菌落数"));
            }
            callback();
          }
        },
      },
    ],
    room6_colony_count_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写配料间1-菌落数"));
            }
            callback();
          }
        },
      },
    ],
    room7_colony_count_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写配料间2-菌落数"));
            }
            callback();
          }
        },
      },
    ],
    room1_avg_colony_count_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写-平均菌落数"));
            }
            callback();
          }
        },
      },
    ],
    room3_avg_colony_count_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写-平均菌落数"));
            }
            callback();
          }
        },
      },
    ],
    room5_avg_colony_count_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写-平均菌落数"));
            }
            callback();
          }
        },
      },
    ],
    room6_avg_colony_count_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写-平均菌落数"));
            }
            callback();
          }
        },
      },
    ],
    room1_avg_density_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写-平均浓度"));
            }
            callback();
          }
        },
      },
    ],
    room3_avg_density_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写-平均浓度"));
            }
            callback();
          }
        },
      },
    ],
    room5_avg_density_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写-平均浓度"));
            }
            callback();
          }
        },
      },
    ],
    room6_avg_density_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写-平均浓度"));
            }
            callback();
          }
        },
      },
    ],
    room1_temperature_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写-温度"));
            }
            callback();
          }
        },
      },
    ],
    room3_temperature_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写-温度"));
            }
            callback();
          }
        },
      },
    ],
    room5_temperature_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写-温度"));
            }
            callback();
          }
        },
      },
    ],
    room6_temperature_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写-温度"));
            }
            callback();
          }
        },
      },
    ],
    room1_humidity_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写-湿度"));
            }
            callback();
          }
        },
      },
    ],
    room3_humidity_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写-湿度"));
            }
            callback();
          }
        },
      },
    ],
    room5_humidity_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写-湿度"));
            }
            callback();
          }
        },
      },
    ],
    room6_humidity_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写-湿度"));
            }
            callback();
          }
        },
      },
    ],
    room1_check_res: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择结果判定"));
            }
            callback();
          }
        },
      },
    ],
    room3_check_res: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择结果判定"));
            }
            callback();
          }
        },
      },
    ],
    room5_check_res: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择结果判定"));
            }
            callback();
          }
        },
      },
    ],
    room6_check_res: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择结果判定"));
            }
            callback();
          }
        },
      },
    ],
  };
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
    getStatusText,
    is_submit,
  };
}
