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
    check_date: "", // 检测日期
    class_type: "", // 班组 (1A、2B、3C)
    line_id: "", // 线别
    tested_uid: "", // 被检测人员uid
    ct_time: "", // ct时间
    check_uid: "", //检测员uid
    germ_val: "", // 检验结果-细菌实测值
    mould_val: "", // 检验结果-霉菌实测值
    yeast_val: "", // 检验结果-酵母菌实测值

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
    class_type: [
      {
        required: true,
        message: "请选择班组",
      },
    ],
    line_id: [
      {
        required: true,
        message: "请选择线别",
      },
    ],
    tested_uid: [
      {
        required: true,
        message: "请选择被测人员",
      },
    ],
    ct_time: [
      {
        required: true,
        message: "请选择CT时间",
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
      options: getClasstimeMap(),
    },
    {
      label: "线别",
      prop: "line_id",
      valueType: "select",
      labelWidth: 90,
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择线别",
        filterable: true,
      },
      options: computed(() => lineOptions.value),
    },
    {
      label: "被测人员",
      prop: "tested_uid",
      valueType: "select",
      labelWidth: 110,
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
      label: "备注",
      prop: "note",
      colProps: {
        span: 24,
      },
    },
    {
      label: "检测签字",
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
      label: "记录人签名",
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
  const checkTablecolumns = ref<TableColumnList>([
    {
      label: "微生物检测",
      align: "center",
      children: [
        {
          label: "细菌",
          prop: "germ_val",
          slot: "germ_val",
          minWidth: 140,
        },
        {
          label: "霉菌",
          prop: "mould_val",
          slot: "mould_val",
          minWidth: 140,
        },
        {
          label: "酵母菌",
          prop: "yeast_val",
          slot: "yeast_val",
          minWidth: 140,
        },
      ],
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
    const { germ_val = "", mould_val = "", yeast_val = ""  } = formData.value;
    const dataArray = Array.from({ length: 1 }, () => ({
      germ_val,
      mould_val,
      yeast_val,
    }));
    checkTableData.value = [...dataArray];
    console.log("checkTableData.value:", checkTableData.value);
  }
  /** 如果是提交则设为true,表示必填 */
  const is_submit = ref(false);
  /** 检验表格信息 */
  const checkFormRules = {
    ct_val: [
      {
        required: is_submit,
        message: "请填写CT实测值",
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写CT实测值"));
            }
            callback();
          }
        },
      },
    ],
    glove_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写手套实测值"));
            }
            callback();
          }
        },
      },
    ],
    zipper_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写拉链实测值"));
            }
            callback();
          }
        },
      },
    ],
    cuff_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写袖口实测值"));
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
