import { ElDatePicker, ElImage, ElOption, ElSelect } from "element-plus";
import dayjs from "dayjs";
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";

export function useAdd() {
  const useSetting = useSettingsStoreHook();
  const {
    getStatusText,
    passList,
    getVersionList,
    basePassList,
    getLineList,
    lineList,
    userOptions,
    getUserOptions,
  } = useselectData();

  // 清洗流程 1 开机清洗 2 停机清洗 3 连续生产阶段维护性CIP清洗 4 季度维护性清洗
  const clean_folw_options = [
    {
      label: "开机清洗",
      value: 1,
    },
    {
      label: "停机清洗",
      value: 2,
    },
    {
      label: "连续生产阶段维护性CIP清洗",
      value: 3,
    },
    {
      label: "季度维护性清洗",
      value: 4,
    },
  ];
  // 清洗杀菌 1 无水柠檬菌 2 二氧化氯 3 氢氧化钠
  const clean_microbe_options = [
    {
      label: "无水柠檬菌",
      value: 1,
    },
    {
      label: "二氧化氯",
      value: 2,
    },
    {
      label: "氢氧化钠",
      value: 3,
    },
  ];

  /**  顶部基础表单的数据 */
  const baseForm = ref({
    order_no: "", //单据编号-保存剔除
    // 状态；0：暂存；1：待审核；2：已审核；3：已驳回；4：已撤回；5：已反审；
    order_status: "", //单据状态-保存剔除
    ct_name: "", //制单人-保存剔除
    create_time: "", //创建时间-保存剔除

    line_id: undefined as FormNumType, //线别
    line_name: "", //线别名称
    make_date: "", //生产日期
    check_date: "", //检测日期
    check_sign: "", //检验员1的签名图片
    check_sign2: "", //检验员2的签名图片
    clean_folw: undefined as FormNumType, //清洗流程
    clean_microbe: undefined as FormNumType, //清洗杀菌
    check_ret: undefined as FormNumType, //检验结果
    report_user_id: undefined as FormNumType, //报告人id
    report_user_name: "",

    report_sign: "", //报告人的签名图片
    recheck_sign: "", //复核人签名图片
    remark: "", //备注

    count_date1: "", //统计日期1
    count_date2: "", //统计日期2
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

  const selectUserRef = ref<InstanceType<typeof ElSelect>>();
  const selectLineRef = ref<InstanceType<typeof ElSelect>>();
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
      label: "线别",
      prop: "line_id",
      // valueType: "select",
      // options: getLineList,
      // fieldProps: computed(() => ({ disabled: isDisabled.value, filterable: true })),
      renderField: () => {
        return (
          <ElSelect
            v-model={baseForm.value.line_id}
            ref={selectLineRef}
            style="width:100%"
            filterable={true}
            onChange={() => {
              nextTick(() => {
                baseForm.value.line_name = selectLineRef.value?.selected.currentLabel;
              });
            }}
          >
            {lineList.value.map((option) => (
              <ElOption key={option.id} label={option.name} value={option.id} />
            ))}
          </ElSelect>
        );
      },
    },
    {
      label: "生产日期",
      prop: "make_date",
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
      label: "清洗流程",
      prop: "clean_folw",
      valueType: "select",
      options: clean_folw_options,
    },

    {
      label: "清洗杀菌",
      prop: "clean_microbe",
      valueType: "select",
      options: clean_microbe_options,
    },
    {
      label: "检验结果",
      prop: "check_ret",
      valueType: "select",
      options: basePassList,
    },
    {
      label: "报告人",
      prop: "report_user_id",
      // valueType: "select",
      // options: getUserList,
      // fieldProps: {
      //   filterable: true,
      // },
      renderField: () => {
        return (
          <ElSelect
            v-model={baseForm.value.report_user_id}
            ref={selectUserRef}
            style="width:100%"
            filterable={true}
            onChange={() => {
              nextTick(() => {
                baseForm.value.report_user_name = selectUserRef.value?.selected.currentLabel;
              });
            }}
          >
            {userOptions.value.map((option) => (
              <ElOption key={option.id} label={option.name} value={option.id} />
            ))}
          </ElSelect>
        );
      },
      colProps: {
        span: 12,
      },
    },
    {
      label: "检验员1",
      prop: "check_sign",
    },
    {
      label: "检验员2",
      prop: "check_sign2",
    },
    {
      label: "报告人签名图片",
      prop: "report_sign",
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
      prop: "remark",
      colProps: {
        span: 24,
      },
    },
  ];

  /** 如果是提交则设为true,表示必填 */
  const is_submit = ref(false);

  /** 基础信息表单验证规则 */
  const baseRules = reactive({
    line_id: [
      {
        required: true,
        message: "请选择线别",
      },
    ],
    make_date: [
      {
        required: true,
        message: "请选择生产日期",
      },
    ],
    check_date: [
      {
        required: true,
        message: "请选择检测日期",
      },
    ],
    clean_folw: [
      {
        required: true,
        message: "请选择清洗流程",
      },
    ],
    report_user_id: [
      {
        required: true,
        message: "请选择报告人",
      },
    ],
    check_sign: [
      {
        required: is_submit,
        message: "检验员1签名不能为空",
      },
    ],
    check_sign2: [
      {
        required: is_submit,
        message: "检验员1签名不能为空",
      },
    ],
    check_ret: [
      {
        required: is_submit,
        message: "请选择检验结果",
      },
    ],
  });

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
      label: "时间",
      prop: "time",
      slot: "time",
    },
    {
      label: "样品编号",
      prop: "sample_no",
      slot: "sample_no",
    },
    {
      label: "可溶性固形物（%）",
      prop: "tts",
      slot: "tts",
    },
    {
      label: "PH",
      prop: "pH",
      slot: "pH",
    },
    {
      label: "电导率（us/cm）",
      prop: "conductivity",
      slot: "conductivity",
    },
    {
      label: "微生物指标",
      align: "center",
      children: [
        {
          label: "统计日期",
          headerSlot: "statistical_date",
          renderHeader: (data) => {
            return (
              <>
                <div class="flex justify-between">
                  <span>统计日期</span>
                  <ElDatePicker
                    v-model={baseForm.value.count_date1}
                    type="date"
                    placeholder="选择日期"
                    format="YYYY-MM-DD"
                    valueFormat="YYYY-MM-DD"
                    disabled={isDetailDisable.value}
                    disabledDate={(date: string) => {
                      return dayjs().isBefore(date);
                    }}
                  ></ElDatePicker>
                </div>
              </>
            );
          },
          children: [
            {
              label: "M-endo培养基  (37℃，24h)",
              children: [
                {
                  label: "大肠菌群",
                  align: "center",
                  prop: "microbe_coliform_bacteria",
                  slot: "microbe_coliform_bacteria",
                },
              ],
            },
            {
              label: "PCA培养基（37℃，24h）",
              children: [
                {
                  label: "细菌总数",
                  align: "center",
                  prop: "microbe_bacterial",
                  slot: "microbe_bacterial",
                },
              ],
            },
          ],
        },
        {
          label: "统计日期",
          renderHeader: (data) => {
            return (
              <>
                <div class="flex justify-between">
                  <span>统计日期</span>
                  <ElDatePicker
                    v-model={baseForm.value.count_date2}
                    type="date"
                    placeholder="选择日期"
                    format="YYYY-MM-DD"
                    valueFormat="YYYY-MM-DD"
                    disabled={isDetailDisable.value}
                    disabledDate={(date: string) => {
                      return dayjs().isBefore(date);
                    }}
                  ></ElDatePicker>
                </div>
              </>
            );
          },
          children: [
            {
              label: "MEA培养基（25℃，48h）",
              align: "center",
              children: [
                {
                  label: "酵母菌",
                  align: "center",
                  prop: "microbe_saccharomyces",
                  slot: "microbe_saccharomyces",
                },
                {
                  label: "霉菌",
                  align: "center",
                  prop: "microbe_mold",
                  slot: "microbe_mold",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      label: "备注",
      prop: "note",
      slot: "note",
    },
  ];

  const tableRules = reactive({
    time: [
      {
        required: is_submit,
        message: "请选择检验时间",
      },
    ],
    sample_no: [
      {
        required: is_submit,
        message: "请输入样品编号",
      },
    ],
    tts: [
      {
        required: is_submit,
        message: "请输入可溶性固形物(%)",
      },
    ],
    pH: [
      {
        required: is_submit,
        message: "请输入PH",
      },
    ],
    conductivity: [
      {
        required: is_submit,
        message: "请输入电导率（us/cm）",
      },
    ],
    microbe_coliform_bacteria: [
      {
        required: is_submit,
        message: "大肠菌群",
      },
    ],
    microbe_bacterial: [
      {
        required: is_submit,
        message: "细菌总数",
      },
    ],
    microbe_saccharomyces: [
      {
        required: is_submit,
        message: "酵母菌",
      },
    ],
    microbe_mold: [
      {
        required: is_submit,
        message: "霉菌",
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
    getVersionList,
    getLineList,
    getUserOptions,
  };
}
