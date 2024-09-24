import { ElImage, ElOption, ElSelect, FormInstance } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import dayjs from "dayjs";
import {
  getCleanAreaInfo,
  getCleanRoomSelectMap,
  getParticleStandardInfo,
} from "@/api/quality/common/index";
// 引入获取表头、检测依据api
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();

export function useAdd() {
  const useSetting = useSettingsStoreHook();
  const { getStatusText, passList } = useselectData();
  // 洁净区域名称选项
  const areaOptions = ref<any>();
  // 洁净度级别选项
  const levelOptions = ref<any>();
  // 检测状态选项
  const checkTypeOptions = ref<any>();
  // 标准粒子浓度信息
  const standardInfo = ref<any>({
    level: "",
    all: {},
    ucl: {},
  });
  // 存储接口返回的check_info信息
  const checkInfoApiData = ref<any>();
  // 获取公共下拉框数据配置
  async function initBaseData() {
    let { data: cleanRoomSelectMap }: any = await getCleanRoomSelectMap();
    areaOptions.value = cleanRoomSelectMap?.clean_area_data.map((item: any) => {
      return { label: item.area_name, value: item.area_id };
    });
    levelOptions.value = cleanRoomSelectMap?.clean_level_map.map((item: any) => {
      return { label: item.level_name, value: item.type };
    });
    checkTypeOptions.value = cleanRoomSelectMap?.clean_check_type_map.map((item: any) => {
      return { label: item.check_type_name, value: item.type };
    });
    // console.log("checkTypeOptions:", checkTypeOptions.value);
  }

  /** 1是新建,2是编辑,3是详情 */
  const pageType = ref(1);
  const editDisabled = computed(() => {
    return pageType.value === 3;
  });
  /** add表单数据 */
  const formData = ref<any>({
    order_no: "", //单据编号
    area_id: "", // 洁净区域id
    level: "", // 洁净度级别；0：百级；1：万级；2：十万级
    check_type: "", // 检测状态；0：动态+静态；1：静态
    temperature: "", // 温度
    humidity: "", // 湿度
    ucl05_val: "", // UCL>=0.5um实测值
    ucl5_val: "", // UCL>=5um实测值
    check_date: "", // 监测日期
    check_res: undefined as FormNumType, // 检查结果；0：不合格；1：合格
    check_user_signature: "", // 检验人签字
    reviewer_user_signature: "", // 复核人签字
    note: "", // 备注
    check_info: [], // 检测数据信息
    status: 0, //单据状态
    files: [], //文件数据
    logs: [], //日志信息
  });

  /** add表单验证规则 */
  const formRules = {
    area_id: [
      {
        required: true,
        message: "请选择洁净区域名称",
      },
    ],
    check_date: [
      {
        required: true,
        message: "请选择监测日期",
      },
    ],
    check_res: [
      {
        required: true,
        message: "请选择判定结果",
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
  };
  function checkDate(date: string, diffDate: string, type = 1) {
    let isBefore = dayjs(date).isBefore(dayjs(diffDate).format("YYYY-MM-DD"));
    let isAfter = dayjs(date).isAfter(dayjs(diffDate));
    return type === 1 ? isBefore : isAfter;
  }

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
      label: "洁净区域名称",
      valueType: "select",
      prop: "area_id",
      labelWidth: 120,
      fieldProps: {
        placeholder: "请选择洁净区域",
        onChange: async () => {
          console.log("select:", formData.value.area_id);
          // 洁净区域选择以后 同步获取洁净级别、检测状态、浓度等基础信息
          if (formData.value.area_id) {
            let params = {
              area_id: formData.value.area_id,
            };
            let { data = null } = await getCleanAreaInfo(params);
            if (data) {
              let { level, check_type, sampling_point } = data?.list;
              formData.value.level = level;
              formData.value.check_type = check_type;
              // 更新标准粒子浓度
              let { data: standardInfoData } = await getParticleStandardInfo({ level });
              standardInfo.value = standardInfoData?.list || {};
              // 根据 sampling_point 动态渲染 check_info 数据
              let baseItem = {
                one05_val: "",
                one5_val: "",
                two05_val: "",
                two5_val: "",
                avg05_val: "",
                avg5_val: "",
              };
              if (sampling_point.length) {
                checkTableData.value = sampling_point.map((item: any) => {
                  return {
                    ...item,
                    ...baseItem,
                  };
                });
              }
            }
            // console.log("洁净区域信息：", formData.value);
            // console.log("浓度基础配置：", standardInfo.value);
            // console.log("重组的checkInfo：", checkTableData.value);
            return;
          }
          // 清空洁净区域同步置空 级别、检测状态、检测信息列表、标准浓度信息
          formData.value.level = "";
          formData.value.check_type = "";
          checkTableData.value = [];
          standardInfo.value = {};
        },
      },
      options: computed(() => areaOptions.value),
      colProps: {
        span: 8,
      },
    },
    {
      label: "洁净度级别",
      prop: "level",
      valueType: "select",
      labelWidth: 120,
      fieldProps: {
        placeholder: "请选择洁净度级别",
        disabled: true,
      },
      options: computed(() => levelOptions.value),
      colProps: {
        span: 8,
      },
    },
    {
      label: "检测状态",
      prop: "check_type",
      valueType: "select",
      labelWidth: 120,
      fieldProps: {
        placeholder: "请选择",
        disabled: true,
      },
      options: computed(() => checkTypeOptions.value),
      colProps: {
        span: 8,
      },
    },
    {
      label: "温度",
      prop: "temperature",
      labelWidth: 90,
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请输入温度",
      },
      fieldSlots: {
        append: () => <span>°C</span>,
      },
    },
    {
      label: "湿度",
      prop: "humidity",
      labelWidth: 90,
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请输入湿度",
      },
      fieldSlots: {
        append: () => <span>%</span>,
      },
    },
    {
      label: "监测日期",
      valueType: "date-picker",
      prop: "check_date",
      labelWidth: 90,
      fieldProps: {
        placeholder: "请选择日期(年月日)",
        type: "datetime",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm",
        disabledDate: (date: string) => {
          return checkDate(date, dayjs().format("YYYY-MM-DD"), 2); // 2今天之后的日期不可选
        },
      },
      colProps: {
        span: 8,
      },
    },

    {
      label: "判定结果",
      prop: "check_res",
      valueType: "select",
      labelWidth: 90,
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择判定结果",
        filterable: true,
      },
      options: computed(() => passList.map((item) => ({ label: item.name, value: item.id }))),
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
    checkTableData: [] as any[],
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
    let checkInfo = checkInfoApiData.value;
    // 判断是否有数据
    if (!tableData.length || !checkInfo) {
      return;
    }
    const item = {
      room3_check_res: "",
    };
    // const dataArray = Array.from({ length: 1 }, () => ({...item}));
    // checkTableData.value = { ...item };
    console.log("checkTableData.value:", checkTableData.value);
  }
  /** 如果是提交则设为true,表示必填 */
  const is_submit = ref(false);
  /** 检验表格信息 */
  const checkFormRules = {
    one05_val: [
      {
        required: is_submit,
        message: "请填写采样粒子",
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写第一次采样粒子"));
            }
            callback();
          }
        },
      },
    ],
    one5_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写第一次采样粒子"));
            }
            callback();
          }
        },
      },
    ],
    two05_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写第二次采样粒子"));
            }
            callback();
          }
        },
      },
    ],
    two5_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写第二次采样粒子"));
            }
            callback();
          }
        },
      },
    ],
    avg5_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写各点平均粒子浓度"));
            }
            callback();
          }
        },
      },
    ],
    avg05_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写各点平均粒子浓度"));
            }
            callback();
          }
        },
      },
    ],
    ucl5_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (formData.value.ucl5_val) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写UCL(粒/m³)"));
            }
            callback();
          }
        },
      },
    ],
    ucl05_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (formData.value.ucl05_val) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写UCL(粒/m³)"));
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
    standardInfo,
    checkInfoApiData,
  };
}
