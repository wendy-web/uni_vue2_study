import { ElImage } from "element-plus";
import dayjs from "dayjs";
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useUserStoreHook } from "@/store/modules/user";
import { useList } from "./hook";

export function useAdd() {
  const useSetting = useSettingsStoreHook();
  const useUser = useUserStoreHook();
  const { getStatusText, passList, getClasstimeMap, getUserList, lineList, getLineList } =
    useselectData();

  const { productionOptions } = useList();

  /**  顶部基础表单的数据 */
  const baseForm = ref({
    order_no: "", //单据编号-保存剔除
    // 状态；0：暂存；1：待审核；2：已审核；3：已驳回；4：已撤回；5：已反审；
    order_status: "", //单据状态-保存剔除
    ct_name: "", //制单人-保存剔除
    create_time: "", //创建时间-保存剔除

    check_date: "", //检查日期
    stat_date: "", //统计日期
    tsa_config_date: "", //培养基配置日期
    tsa_no: "", //TSA培养基批号
    class_type: undefined as FormNumType, //班组
    pro_status: undefined as FormNumType, //生产状态
    tsa_config_uid: undefined as FormNumType, //培养基配置人uid

    check_user_signature: "", //检验员的签名图片
    reviewer_user_signature: "", //复核员签名图片
    note: "", //备注
  });

  /** 1是新建,2是编辑 3是详情 */
  const pageType = ref(1);
  const isDetailDisable = computed(() => {
    return pageType.value === 3;
  });

  const tableForm = reactive({
    tableData: [] as any[],
  });

  const { tableData } = toRefs(tableForm);
  /** 表格数据大于0 */
  const isDisabled = computed(() => {
    return tableData.value.length > 0;
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
      label: "检查日期",
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
      label: "统计日期",
      prop: "stat_date",
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
      label: "培养基配置日期",
      prop: "tsa_config_date",
      valueType: "date-picker",
      labelWidth: 130,
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
      label: "TSA培养基批号",
      prop: "tsa_no",
      labelWidth: 130,
    },

    {
      label: "班组",
      prop: "class_type",
      valueType: "select",
      options: getClasstimeMap,
    },

    {
      label: "生产状态",
      prop: "pro_status",
      valueType: "radio",
      options: productionOptions,
    },
    {
      label: "培养基配置人",
      prop: "tsa_config_uid",
      valueType: "select",
      options: getUserList,
      fieldProps: {
        filterable: true,
      },
      labelWidth: 130,
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
    check_date: [
      {
        required: true,
        message: "请选择检查日期",
      },
    ],
    stat_date: [
      {
        required: true,
        message: "请选择统计日期",
      },
    ],
    tsa_config_date: [
      {
        required: true,
        message: "请选择培养基配置日期",
      },
    ],
    tsa_no: [
      {
        required: true,
        message: "请选择TSA培养基批号",
      },
    ],
    class_type: [
      {
        required: true,
        message: "请选择班组",
      },
    ],
    pro_status: [
      {
        required: true,
        message: "请选择生产状态",
      },
    ],
    tsa_config_uid: [
      {
        required: true,
        message: "请选择培养基配置人",
      },
    ],
  };

  const tableColumns: TableColumnList = [
    {
      label: "勾选列",
      type: "selection",
      hide: () => isDetailDisable.value,
    },
    {
      label: "线别",
      prop: "line_id",
      slot: "line_id",
      minWidth: 110,
    },
    {
      label: "细菌学指标(个/皿)",
      width: 90,
      cellRenderer: () => {
        return <span class="font-bold table-span">TSA</span>;
      },
    },
    {
      label: "",
      width: 60,
      cellRenderer: () => {
        return <span class="font-bold table-span">细菌总数</span>;
      },
    },
    {
      label: "洁净间",
      align: "center",
      children: [
        {
          label: "1",
          prop: "clean_room1_val",
          slot: "clean_room1_val",
        },
        {
          label: "2",
          prop: "clean_room2_val",
          slot: "clean_room2_val",
        },
        {
          label: "3",
          prop: "clean_room3_val",
          slot: "clean_room3_val",
        },
        {
          label: "4",
          prop: "clean_room4_val",
          slot: "clean_room4_val",
        },
        {
          label: "灌装机",
          prop: "fill_machine_val",
          slot: "fill_machine_val",
        },
        {
          label: "封口机",
          prop: "seal_machine_val",
          slot: "seal_machine_val",
        },
        {
          label: "上盖间",
          prop: "upper_cover_room_val",
          slot: "upper_cover_room_val",
        },
      ],
    },
    {
      label: "平均数≤10个/皿",
      prop: "avg_val",
      slot: "avg_val",
    },
    {
      label: "空白样",
      prop: "blank_sample_val",
      slot: "blank_sample_val",
    },
    {
      label: "结果",
      prop: "check_res",
      slot: "check_res",
      minWidth: 110,
    },
    {
      label: "压差(Pa)",
      prop: "pressure_diff_val",
      slot: "pressure_diff_val",
    },
    {
      label: "灌装间温度/湿度",
      align: "center",
      children: [
        {
          label: "温度",
          prop: "temperature_val",
          slot: "temperature_val",
        },
        {
          label: "湿度",
          prop: "humidity_val",
          slot: "humidity_val",
        },
      ],
    },
    {
      label: "灌装人员",
      prop: "filling_user_signature",
      slot: "filling_user_signature",
      minWidth: 90,
    },
    {
      label: "备注",
      prop: "note",
      slot: "note",
    },
  ];

  /** 如果是提交则设为true,表示必填 */
  const is_submit = ref(false);

  const tableRules = reactive({
    line_id: [
      {
        required: is_submit,
        message: "请选择线别",
      },
    ],
    clean_room1_val: [
      {
        required: is_submit,
        message: "请输入洁净间1实测值",
      },
    ],
    clean_room2_val: [
      {
        required: is_submit,
        message: "请输入洁净间2实测值",
      },
    ],
    clean_room3_val: [
      {
        required: is_submit,
        message: "请输入洁净间3实测值",
      },
    ],
    clean_room4_val: [
      {
        required: is_submit,
        message: "请输入洁净间4实测值",
      },
    ],
    fill_machine_val: [
      {
        required: is_submit,
        message: "请输入灌装机实测值",
      },
    ],
    seal_machine_val: [
      {
        required: is_submit,
        message: "请输入封口机实测值",
      },
    ],
    upper_cover_room_val: [
      {
        required: is_submit,
        message: "请输入上盖间实测值",
      },
    ],
    blank_sample_val: [
      {
        required: is_submit,
        message: "请输入空白样实测值",
      },
    ],
    check_res: [
      {
        required: is_submit,
        message: "请选择结果",
      },
    ],
    pressure_diff_val: [
      {
        required: is_submit,
        message: "请输入压差",
      },
    ],
    temperature_val: [
      {
        required: is_submit,
        message: "请输入温度",
      },
    ],
    humidity_val: [
      {
        required: is_submit,
        message: "请输入湿度",
      },
    ],
    filling_user_signature: [
      {
        required: is_submit,
        message: "请点击签名",
      },
    ],
  });

  const logList = ref<any[]>([]);

  return {
    baseForm,
    baseColumns,
    baseRules,
    logList,
    tableForm,
    tableData,
    tableColumns,
    pageType,
    is_submit,
    getStatusText,
    isDetailDisable,
    useSetting,
    tableRules,
    passList,
    lineList,
    getLineList,
  };
}
