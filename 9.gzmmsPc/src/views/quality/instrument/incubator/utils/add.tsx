import { ElDatePicker, ElImage, ElOption, ElSelect } from "element-plus";
import dayjs from "dayjs";
import { getInstMapApi } from "@/api/quality/common";
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useUserStoreHook } from "@/store/modules/user";
import { useList } from "./hook";

export function useAdd() {
  const useSetting = useSettingsStoreHook();
  const useUser = useUserStoreHook();

  const { proOptions, cultivateOptions, statusList, getStatusText } = useList();
  const { passList, getVersionList, getLineList, userOptions, getUserOptions } = useselectData();

  const instList = ref<any[]>([]);
  async function getInstMap() {
    const reuslt = await getInstMapApi({ is_open: 1 });
    instList.value = reuslt.data;
  }

  /**  顶部基础表单的数据 */
  const baseForm = ref({
    order_no: "", //单据编号-保存剔除
    // 状态；0：暂存；1：待审核；2：已审核；3：已驳回；4：已撤回；5：已反审；
    order_status: "", //单据状态-保存剔除
    ct_name: "", //制单人-保存剔除
    create_time: "", //创建时间-保存剔除

    use_date: dayjs().format("YYYY-MM-DD"), //使用日期
    type: undefined as FormNumType, //培养种类
    report_no: "", //检测报告编号
    temperature: "", //室温
    humidity: "", //湿度
    check_user_id: useUser.uid, //检测人id
    check_user_name: useUser.nickname, //检测人名称

    confirm_sign: "", //签字确认图片
    // recheck_sign: "", //复核人签名图片
    // remark: "", //备注
  });

  /** 1是新建,2是编辑 3是详情 */
  const pageType = ref(1);
  /** 是否是详情页不允许操作 */
  const isDetailDisable = computed(() => {
    return pageType.value === 3;
  });
  /** 是否不运行操作基本信息 */
  const isBaseDisable = ref(false);

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
      label: "使用日期",
      prop: "use_date",
      valueType: "date-picker",
      fieldProps: {
        type: "date",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        disabledDate: (date: string) => {
          return dayjs().isBefore(date);
        },
        clearable: false,
      },
    },

    {
      label: "培养种类",
      prop: "type",
      valueType: "select",
      options: cultivateOptions,
      fieldProps: {
        clearable: false,
      },
    },
    {
      label: "检测报告编号",
      prop: "report_no",
      fieldProps: {
        clearable: false,
      },
    },
    {
      label: "室温(℃)",
      prop: "temperature",
      fieldProps: {
        clearable: false,
      },
      fieldSlots: {
        suffix: () => "℃",
      },
    },
    {
      label: "相对湿度(℃)",
      prop: "humidity",
      fieldProps: {
        clearable: false,
      },
      fieldSlots: {
        suffix: () => "℃",
      },
    },
    {
      label: "检验员",
      prop: "check_user_id",
      renderField: () => {
        return (
          <ElSelect
            v-model={baseForm.value.check_user_id}
            ref={selectOperationUserRef}
            style="width:100%"
            filterable={true}
            onChange={() => {
              nextTick(() => {
                baseForm.value.check_user_name =
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
      label: "检验员签名",
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
  ];

  /** 如果是提交则设为true,表示必填 */
  const is_submit = ref(false);

  /** 基础信息表单验证规则 */
  const baseRules = reactive({
    use_date: [
      {
        required: true,
        message: "请选择使用日期",
      },
    ],
    type: [
      {
        required: true,
        message: "请选择培养种类",
      },
    ],
    report_no: [
      {
        required: true,
        message: "请输入检测报告编号",
      },
    ],
    temperature: [
      {
        required: true,
        message: "请输入室温",
      },
    ],
    humidity: [
      {
        required: true,
        message: "请输入相对湿度",
      },
    ],
    check_user_id: [
      {
        required: true,
        message: "请选择检验员",
      },
    ],
  });

  const timeFrameOptions = [
    {
      label: "上午",
      value: 1,
    },
    {
      label: "晚上",
      value: 2,
    },
  ];

  /** 细菌总数 */
  const germForm = ref({
    check_type: 1, //微生物检验项目
    temperature: "37", //标准温度
    inst_id: undefined as FormNumType, //仪器ID
    inst_code: "", //仪器编号
    inst_name: "", //仪器名称
    num: "", //培养数量
    test_time_type: "", //检测时间段1上午2晚上
    test_temperature: "", //检测温度
    end_time: "", //结束时间
    check_sign: "", //检验人签名
    out_sign: "", //取出人签名
    recheck_sign: "", //复核人签名
    status: 0, //状态
    id: undefined as FormNumType, //编辑时存在的id
  });

  const germColumns: PlusColumnList = [
    {
      label: "微生物检验项目",
      prop: "check_type",
      valueType: "select",
      options: proOptions,
      fieldProps: {
        clearable: false,
        disabled: true,
      },
    },
    {
      label: "标准温度",
      prop: "temperature",
      fieldProps: {
        clearable: false,
        disabled: true,
      },
      fieldSlots: {
        suffix: () => "℃",
      },
    },
    {
      label: "仪器名称",
      prop: "inst_id",
    },
    {
      label: "仪器编号",
      prop: "inst_code",
      fieldProps: {
        disabled: true,
        placeholder: "请选择仪器名称",
      },
    },
    {
      label: "培养框数量",
      prop: "num",
    },
    {
      label: "温度检测",
      prop: "test_temperature",
    },
    {
      label: "检测人签名",
      prop: "check_sign",
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
      label: "结束时间",
      prop: "end_time",
      hideInForm: computed(() => pageType.value !== 3),
      fieldProps: {
        placeholder: "",
      },
    },
    {
      label: "取出人签名",
      prop: "out_sign",
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
      label: "复核人签名",
      prop: "recheck_sign",
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
      label: "状态",
      prop: "status",
      hideInForm: computed(() => pageType.value !== 3),
      valueType: "select",
      options: statusList,
    },
  ];
  const commonRules = {
    inst_id: [
      {
        required: true,
        message: "请选择仪器名称",
      },
    ],
    inst_code: [
      {
        required: true,
        message: "请选择仪器名称",
      },
    ],
    temperature: [
      {
        required: true,
        message: "请输入标准温度",
      },
    ],
    num: [
      {
        required: true,
        message: "请输入培养框数量",
      },
    ],
  };
  const germRules = {
    ...commonRules,
    test_temperature: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          if (!value) {
            callback(new Error("请输入温度"));
          } else {
            if (germForm.value.test_time_type) {
              callback();
            } else {
              callback(new Error("请选择"));
            }
          }
        },
      },
    ],
  };
  const myceteRules = {
    ...commonRules,
    test_temperature: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          if (!value) {
            callback(new Error("请输入温度"));
          } else {
            if (myceteForm.value.test_time_type) {
              callback();
            } else {
              callback(new Error("请选择"));
            }
          }
        },
      },
    ],
  };

  /** 霉菌酵母菌 */
  const myceteForm = ref({
    check_type: 2, //微生物检验项目
    temperature: "25", //标准温度
    inst_id: undefined as FormNumType, //仪器ID
    inst_code: "", //仪器编号
    inst_name: "", //仪器名称
    num: "", //培养数量
    test_time_type: "", //检测时间段1上午2晚上
    test_temperature: "", //检测温度
    end_time: "", //结束时间 保存过滤
    check_sign: "", //检验人签名 保存过滤
    out_sign: "", //取出人签名 保存过滤
    recheck_sign: "", //复核人签名 保存过滤
    status: 0, //状态 保存过滤
    id: undefined as FormNumType, //编辑时存在的id
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
    statusList,
    isDetailDisable,
    useSetting,
    passList,
    getVersionList,
    getLineList,
    getUserOptions,
    germForm,
    germColumns,
    germRules,
    myceteForm,
    myceteRules,
    timeFrameOptions,
    getInstMap,
    instList,
    isBaseDisable,
  };
}
