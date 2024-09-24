import { ElImage, ElOption, ElSelect } from "element-plus";
import { cloneDeep } from "@pureadmin/utils";
import dayjs from "dayjs";
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useUserStoreHook } from "@/store/modules/user";

export function useAdd() {
  const useSetting = useSettingsStoreHook();
  const useUser = useUserStoreHook();

  const {
    getBrandMap,
    getStatusText,
    passList,
    getLineList,
    basePassList,
    ngAndOkList,
    getUserOptions,
    userOptions,
    lineList,
    classTimeOptions,
    getClasstimeOptions,
  } = useselectData();

  /**  顶部基础表单的数据 */
  const baseForm = ref({
    order_no: "", //单据编号-保存剔除
    // 状态；0：暂存；1：待审核；2：已审核；3：已驳回；4：已撤回；5：已反审；
    order_status: "", //单据状态-保存剔除
    ct_name: "", //制单人-保存剔除
    create_time: "", //创建时间-保存剔除

    batch_no: "", //批次号8位
    line_id: undefined as FormNumType, //产线id,
    line_name: "", //产线名称
    check_date: "", //检测日期
    class_id: undefined as FormNumType, //生产班组id,
    class_name: "", //生产班组名称
    brand: "", //产品大类(产品品牌)
    check_ret: undefined as FormNumType, //检验结果
    check_user_id: useUser.uid, //检验员id
    check_user_name: useUser.nickname, //检验员名称

    check_sign: "", //检验员的签名图片
    recheck_sign: "", //复核员签名图片
    remark: "", //备注
  });

  /** 1是新建,2是编辑 3是详情 */
  const pageType = ref(1);

  /** 判断是否是新建页面 */
  const isAddDisable = computed(() => {
    return pageType.value === 1;
  });

  const isDetailDisable = computed(() => {
    return pageType.value === 3;
  });

  const selectUserRef = ref<InstanceType<typeof ElSelect>>();
  const selectLineRef = ref<InstanceType<typeof ElSelect>>();
  const selectClassTimeRef = ref<InstanceType<typeof ElSelect>>();

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
      label: "批次",
      prop: "batch_no",
      fieldProps: {
        maxLength: 8,
      },
    },
    {
      label: "线别",
      prop: "line_id",
      // valueType: "select",
      // options: getLineList,
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
      label: "生产班组",
      prop: "class_id",
      // valueType: "select",
      // options: getClasstimeMap,
      renderField: () => {
        return (
          <ElSelect
            v-model={baseForm.value.class_id}
            ref={selectClassTimeRef}
            style="width:100%"
            filterable={true}
            onChange={() => {
              nextTick(() => {
                baseForm.value.class_name = selectClassTimeRef.value?.selected.currentLabel;
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
      label: "产品大类",
      prop: "brand",
      valueType: "select",
      options: getBrandMap,
      fieldProps: {
        filterable: true,
        clearable: false,
        disabled: true,
      },
    },

    {
      label: "检验结果",
      prop: "check_ret",
      valueType: "select",
      options: basePassList,
      tooltip: "根据岗位检测所有岗位的的检验结果自动判断,存在三种情况: 合格、不合格、部分合格",
      fieldProps: {
        disabled: true,
        placeholder: "自动判断",
      },
      labelWidth: 110,
    },
    {
      label: "检验员",
      prop: "check_user_id",
      // valueType: "select",
      // options: getUserList,
      // fieldProps: {
      //   filterable: true,
      // },
      renderField: () => {
        return (
          <ElSelect
            v-model={baseForm.value.check_user_id}
            ref={selectUserRef}
            style="width:100%"
            filterable={true}
            onChange={() => {
              nextTick(() => {
                baseForm.value.check_user_name = selectUserRef.value?.selected.currentLabel;
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
      label: "检验员签名图片",
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
  const baseRules = {
    batch_no: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          if (value && value.toString().length === 8) {
            // 如果长度为8，则验证通过
            callback();
          } else {
            // 否则，给出错误提示
            callback(new Error("请输入长度为8的批次"));
          }
        },
      },
    ],
    line_id: [
      {
        required: true,
        message: "请选择线别",
      },
    ],
    check_date: [
      {
        required: true,
        message: "请选择检测日期",
      },
    ],
    class_id: [
      {
        required: true,
        message: "请选择生产班组",
      },
    ],
    brand: [
      {
        required: true,
        message: "请选择产品大类",
      },
    ],
    check_ret: [
      {
        // message: "请选择所有岗位的检验结果",
        validator: (rule: any, value: any, callback: any) => {
          console.log("🚀 ~ useAdd ~ value:", value);
          if (value === undefined) {
            if (is_submit.value) {
              callback(new Error("请选择所有岗位的检验结果"));
            } else {
              callback();
            }
          } else {
            callback();
          }
        },
      },
    ],
    check_user_id: [
      {
        required: true,
        message: "请选择检验员",
      },
    ],
  };

  const fileData = ref<any[]>([]);
  const logList = ref<any[]>([]);

  return {
    baseForm,
    baseColumns,
    baseRules,
    fileData,
    logList,
    pageType,
    getStatusText,
    isDetailDisable,
    useSetting,
    passList,
    ngAndOkList,
    getUserOptions,
    getLineList,
    getClasstimeOptions,
    isAddDisable,
    is_submit,
  };
}
