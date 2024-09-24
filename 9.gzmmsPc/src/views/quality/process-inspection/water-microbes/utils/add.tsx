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
    getLineList,
    userOptions,
    getUserOptions,
    tasteOptions,
  } = useselectData();

  /**  顶部基础表单的数据 */
  const baseForm = ref({
    order_no: "", //单据编号-保存剔除
    // 状态；0：暂存；1：待审核；2：已审核；3：已驳回；4：已撤回；5：已反审；
    order_status: "", //单据状态-保存剔除
    ct_name: "", //制单人-保存剔除
    create_time: "", //创建时间-保存剔除

    smaple_user_id: undefined as FormNumType, //取样人id
    smaple_user_name: "", //取样人名称
    smaple_date: "", //取样日期
    check_date: "", //检测日期
    assist_user_id: undefined as FormNumType, //内助人id
    assist_user_name: "", //内助人名称
    operation_user_id: undefined as FormNumType, //操作员id
    operation_user_name: undefined as FormNumType, //操作员名称

    operation_sign: "", //操作员签字
    check_method: "中国药典二部纯化水", //校验方法

    recheck_sign: "", //复核人签名图片
    remark: "", //备注
  });

  /** 1是新建,2是编辑 3是详情 */
  const pageType = ref(1);
  const isDetailDisable = computed(() => {
    return pageType.value === 3;
  });

  const sensesTableForm = reactive({
    sensesData: [] as any[], //感官性状和一般化学指标数据
  });

  const microbeTableForm = reactive({
    microbeData: [] as any[], //细菌指标
  });

  const { sensesData } = toRefs(sensesTableForm);
  const { microbeData } = toRefs(microbeTableForm);

  const selectSmapleUserRef = ref<InstanceType<typeof ElSelect>>(); // 取样人ref
  const selectAssistUserRef = ref<InstanceType<typeof ElSelect>>(); //内助ref
  const selectOperationUserRef = ref<InstanceType<typeof ElSelect>>(); //操作员ref
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
      label: "取样人",
      prop: "smaple_user_id",
      renderField: () => {
        return (
          <ElSelect
            v-model={baseForm.value.smaple_user_id}
            ref={selectSmapleUserRef}
            style="width:100%"
            filterable={true}
            onChange={() => {
              nextTick(() => {
                baseForm.value.smaple_user_name = selectSmapleUserRef.value?.selected.currentLabel;
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
      label: "取样日期",
      prop: "smaple_date",
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
      label: "内助",
      prop: "assist_user_id",
      renderField: () => {
        return (
          <ElSelect
            v-model={baseForm.value.assist_user_id}
            ref={selectAssistUserRef}
            style="width:100%"
            filterable={true}
            onChange={() => {
              nextTick(() => {
                baseForm.value.assist_user_name = selectAssistUserRef.value?.selected.currentLabel;
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
      label: "操作员",
      prop: "operation_user_id",
      renderField: () => {
        return (
          <ElSelect
            v-model={baseForm.value.operation_user_id}
            ref={selectOperationUserRef}
            style="width:100%"
            filterable={true}
            onChange={() => {
              nextTick(() => {
                baseForm.value.operation_user_name =
                  selectOperationUserRef.value?.selected.currentLabel;
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
      label: "检验方法",
      prop: "check_method",
    },

    {
      label: "操作员签名图片",
      prop: "operation_sign",
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
    smaple_user_id: [
      {
        required: true,
        message: "请选择取样人",
      },
    ],
    smaple_date: [
      {
        required: true,
        message: "请选择取样日期",
      },
    ],
    check_date: [
      {
        required: true,
        message: "请选择检验日期",
      },
    ],
    assist_user_id: [
      {
        required: true,
        message: "请选择内助",
      },
    ],
    operation_user_id: [
      {
        required: true,
        message: "请选择操作员",
      },
    ],
  });

  const sensesColumns: TableColumnList = [
    {
      label: "指标",
      align: "center",
      prop: "name",
    },
    {
      label: "单位",
      align: "center",
      prop: "unit",
    },
    {
      label: "卫生标准",
      align: "center",
      children: [
        {
          label: "标准",
          align: "center",
          prop: "standard",
        },
        {
          label: "内控",
          align: "center",
          prop: "control",
        },
      ],
    },
    {
      label: "制水车间",
      align: "center",
      children: [
        {
          label: "RO水一级",
          align: "center",
          prop: "ro_water1",
          slot: "ro_water1",
        },
        {
          label: "RO水二级",
          align: "center",
          prop: "ro_water2",
          slot: "ro_water2",
        },
        {
          label: "储水A",
          align: "center",
          prop: "water_a",
          slot: "water_a",
        },
        {
          label: "储水B",
          align: "center",
          prop: "water_b",
          slot: "water_b",
        },
        {
          label: "杀菌后RO水",
          align: "center",
          prop: "room_ro_water",
          slot: "room_ro_water",
        },
      ],
    },
    {
      label: "配料",
      align: "center",
      children: [
        {
          label: "杀菌后RO水",
          align: "center",
          prop: "ingredients_ro_water",
          slot: "ingredients_ro_water",
        },
      ],
    },
    {
      label: "CT",
      align: "center",
      children: [
        {
          label: "RO水",
          align: "center",
          prop: "ct_ro_water",
          slot: "ct_ro_water",
        },
      ],
    },
  ];

  const sensesRules = reactive({
    ro_water1: [
      {
        required: is_submit,
        message: "请输入RO水一级",
      },
    ],
    ro_water2: [
      {
        required: is_submit,
        message: "请输入RO水二级",
      },
    ],
    water_a: [
      {
        required: is_submit,
        message: "请输入储水A",
      },
    ],
    water_b: [
      {
        required: is_submit,
        message: "请输入储水B",
      },
    ],
    room_ro_water: [
      {
        required: is_submit,
        message: "请输入杀菌后RO水",
      },
    ],
    ingredients_ro_water: [
      {
        required: is_submit,
        message: "请输入配料杀菌后RO水",
      },
    ],
    ct_ro_water: [
      {
        required: is_submit,
        message: "请输入CTRO水",
      },
    ],
  });
  const microbeRules = reactive({
    ro_water1: [
      {
        required: is_submit,
        message: "请选择RO水一级",
      },
    ],
    ro_water2: [
      {
        required: is_submit,
        message: "请选择RO水二级",
      },
    ],
    water_a: [
      {
        required: is_submit,
        message: "请选择储水A",
      },
    ],
    water_b: [
      {
        required: is_submit,
        message: "请选择储水B",
      },
    ],
    room_ro_water: [
      {
        required: is_submit,
        message: "请选择杀菌后RO水",
      },
    ],
    ingredients_ro_water: [
      {
        required: is_submit,
        message: "请选择配料杀菌后RO水",
      },
    ],
    ct_ro_water: [
      {
        required: is_submit,
        message: "请选择CTRO水",
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
    getVersionList,
    getLineList,
    getUserOptions,
    tasteOptions,
    microbeRules,
    sensesTableForm,
    microbeTableForm,
    sensesData,
    microbeData,
    sensesRules,
    sensesColumns,
  };
}
