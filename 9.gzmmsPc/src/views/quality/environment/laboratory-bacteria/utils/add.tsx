import { ElImage, ElOption, ElSelect, FormInstance } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import dayjs from "dayjs";
import {
  getImgApi, // 获取空气洁净度检查示意图
} from "@/api/quality/environment/laboratory-bacteria/index";
// 引入获取表头、检测依据api
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();

export function useAdd() {
  const useSetting = useSettingsStoreHook();
  const { getStatusText, passList, getUserList, getLineList, getClasstimeMap, workshopOptions } =
    useselectData();
  const userOptions = ref<any>([]); // 单据状态 下拉选项
  const lineOptions = ref<any>([]); // 线别
  const imgExample = ref<any>([]); // 图片列表
  // 获取公共下拉框数据配置
  async function initBaseData() {
    userOptions.value = await getUserList();
    lineOptions.value = await getLineList();
    let getImgRes: any = await getImgApi();
    if(getImgRes.data.img_list) {
      imgExample.value = getImgRes.data.img_list
    }
    console.log("imgExample:", imgExample.value);
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
    ct_time: "", // CT时间
    culture_end_time: "", // 培养结束时间
    culture_temperature: "", // 培养温度
    workshop: "", // 车间
    item: "浮游菌 (菌落总数 个/皿)", // 项目名称
    pressure_diff_val: "", // 压差值
    temperature: "", // 温度
    humidity: "", // 湿度
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
    ct_time: [
      {
        required: true,
        message: "请选择培养结束时间",
      },
    ],
    workshop: [
      {
        required: true,
        message: "请选择车间",
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
        disabledDate: (date: string) => {
          return checkDate(date, dayjs().format("YYYY-MM-DD HH:mm"), 2); // 2今天之后的日期不可选
        },
      },
      colProps: {
        span: 8,
      },
    },
    {
      label: "CT时间",
      valueType: "time-picker",
      prop: "ct_time",
      labelWidth: 120,
      fieldProps: {
        placeholder: "请选择时分",
        type: "time",
        format: "HH:mm",
        timeFormat: "HH:mm",
        valueFormat: "HH:mm",
        disabledDate: (date: string) => {
          return checkDate(date, dayjs().format("YYYY-MM-DD HH:mm"), 2); // 2今天之后的日期不可选
        },
      },
      colProps: {
        span: 8,
      },
    },
    {
      label: "车间",
      prop: "workshop",
      valueType: "select",
      labelWidth: 90,
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择车间",
        filterable: true,
      },
      options: computed(() => workshopOptions),
    },
    {
      label: "培养结束时间",
      valueType: "date-picker",
      prop: "culture_end_time",
      labelWidth: 110,
      fieldProps: {
        placeholder: "请选择日期(年月日/时分)",
        type: "datetime",
        format: "YYYY-MM-DD HH:mm",
        valueFormat: "YYYY-MM-DD HH:mm",
        timeFormat: "HH:mm",
        disabledDate: (date: string) => {
          return checkDate(date, dayjs().format("YYYY-MM-DD HH:mm"), 2); // 2今天之后的日期不可选
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
      // room1_avg_colony_count_val: "",
      // room2_avg_colony_count_val: "",
      // room3_avg_colony_count_val: "",
      // room4_avg_colony_count_val: "",
      room1_avg_density_val: "",
      room3_avg_density_val: "",
      room1_check_res: "",
      room3_check_res: "",
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
        message: "请填写菌落数",
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写菌落数"));
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
              callback(new Error("请填写菌落数"));
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
              callback(new Error("请填写菌落数"));
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
              callback(new Error("请填写菌落数"));
            }
            callback();
          }
        },
      },
    ],
    // room1_avg_colony_count_val: [
    //   {
    //     required: is_submit,
    //     validator: (rule: any, value: any, callback: any) => {
    //       if (value) {
    //         callback();
    //       } else {
    //         if (is_submit.value) {
    //           callback(new Error("请填写平均菌落数"));
    //         }
    //         callback();
    //       }
    //     },
    //   },
    // ],
    // room2_avg_colony_count_val: [
    //   {
    //     required: is_submit,
    //     validator: (rule: any, value: any, callback: any) => {
    //       if (value) {
    //         callback();
    //       } else {
    //         if (is_submit.value) {
    //           callback(new Error("请填写平均菌落数"));
    //         }
    //         callback();
    //       }
    //     },
    //   },
    // ],
    // room3_avg_colony_count_val: [
    //   {
    //     required: is_submit,
    //     validator: (rule: any, value: any, callback: any) => {
    //       if (value) {
    //         callback();
    //       } else {
    //         if (is_submit.value) {
    //           callback(new Error("请填写平均菌落数"));
    //         }
    //         callback();
    //       }
    //     },
    //   },
    // ],
    // room4_avg_colony_count_val: [
    //   {
    //     required: is_submit,
    //     validator: (rule: any, value: any, callback: any) => {
    //       if (value) {
    //         callback();
    //       } else {
    //         if (is_submit.value) {
    //           callback(new Error("请填写平均菌落数"));
    //         }
    //         callback();
    //       }
    //     },
    //   },
    // ],
    room1_avg_density_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写平均浓度"));
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
              callback(new Error("请填写平均浓度"));
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
    imgExample
  };
}
