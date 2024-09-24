import { ElImage, ElOption, ElSelect } from "element-plus";
import dayjs from "dayjs";
// import {
//   getInspMapApi,
//   getInstMapApi,
//   getQuantifyMapApi,
//   getTabelLabelApi,
// } from "@/api/quality/common";
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";

/** 获取配置的请求参数类型 */
export type GetConfigQuery = {
  item: number;
  brand: string;
  sku: string;
  pro: string;
};

export function useAdd() {
  const useSetting = useSettingsStoreHook();
  const {
    getBrandMap,
    getSkuMap,
    getStatusText,
    passList,
    getUserOptions,
    userOptions,
    brandList,
    skuList,
    basePassList,
  } = useselectData();

  const selectUserRef = ref<InstanceType<typeof ElSelect>>();

  /**  顶部基础表单的数据 */
  const baseForm = ref({
    order_no: "", //单据编号-保存剔除
    // 状态；0：暂存；1：待审核；2：已审核；3：已驳回；4：已撤回；5：已反审；
    order_status: "", //单据状态-保存剔除
    ct_name: "", //制单人-保存剔除
    create_time: "", //创建时间-保存剔除

    brand: "", // 产品大类(产品品牌)
    sku: "", //产品类型
    batch_no: "", //批次
    pro_id: undefined as FormNumType, //检测项目id
    pro_name: "", //检测项目名称
    insp_id: undefined as FormNumType, //检测标准(检验依据)id
    insp_name: "", //检验项目名名称

    // !~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    inst_id: undefined as FormNumType, //仪器名称id--定量测定和VB12测定的表单数据
    inst_name: "", //仪器名称--定量测定和VB12测定的表单数据
    heat: "", //室温--定量测定和VB12测定的表单数据
    criterion: "", //判断标准--定量测定和VB12测定的表单数据
    // !~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    char: "", //元素--A道原始数据的表单数据

    check_date: "", //检测日期
    check_ret: undefined as FormNumType, //检验结果
    check_user_id: undefined as FormNumType, //检验员id
    check_user_name: "", //检验员名称
    check_sign: "", //检验员的签名图片
    recheck_sign: "", //复核员签名图片
    remark: "", //备注
  });

  /** 1是新建定量测定原始记录,2是编辑 3是详情
   *  4是新增VB12测定记录, 5是编辑 6是详情
   *  7是新增A道原始数据,8是编辑,9是详情
   */
  const pageType = ref(1);
  /* 1是定量测定原始记录 2是VB12测定记录 3是A道原始数据  */
  const orderType = ref(1);

  /** 公式文本 */
  const formulaValue = ref("X=C×V2/V1");

  /** 判断是否是新建页面 */
  const isAddDisable = computed(() => {
    return pageType.value === 1;
  });
  /** 判断是否是详情页 */
  const isDetailDisable = computed(() => {
    return pageType.value === 3;
  });

  /** 判断是否是其他项目的页面 */
  const isOtherPage = computed(() => {
    return orderType.value === 1;
  });

  /** 判断是否是维生素B12的页面 */
  const isvitaminPage = computed(() => {
    return orderType.value === 2;
  });
  /** 判断是否是 A道原始的页面 */
  const isPlumbumPage = computed(() => {
    return orderType.value === 3;
  });

  /** 顶部基础表单的数据的配置 */
  const baseColumns: PlusColumnList = [
    {
      label: "单据编号",
      prop: "order_no",
      valueType: "text",
      hideInForm: computed(() => isAddDisable.value),
    },
    {
      label: "单据状态",
      prop: "order_status",
      valueType: "text",
      hideInForm: computed(() => isAddDisable.value),
    },
    {
      label: "制单人",
      prop: "ct_name",
      valueType: "text",
      hideInForm: computed(() => isAddDisable.value),
    },
    {
      label: "创建时间",
      prop: "create_time",
      valueType: "text",
      hideInForm: computed(() => isAddDisable.value),
    },

    {
      label: "产品大类",
      prop: "brand",
      valueType: "select",
      options: computed(() => {
        return brandList.value;
      }),
      fieldProps: {
        disabled: true,
      },
    },

    {
      label: "产品类型",
      prop: "sku",
      valueType: "select",
      options: computed(() => {
        return skuList.value;
      }),
      fieldProps: {
        disabled: true,
      },
    },
    {
      label: "批次",
      prop: "batch_no",
      fieldProps: {
        maxLength: 8,
      },
    },
    // {
    //   label: "检验项目",
    //   prop: "pro_id",
    //   valueType: "select",
    //   options: async () => {
    //     const reuslt = await getQuantifyMapApi({ is_open: 1 });
    //     return reuslt.data.map((item: any) => {
    //       return { label: item.name, value: item.id };
    //     });
    //   },
    //   fieldProps: {
    //     disabled: true,
    //   },
    // },
    {
      label: "检验项目",
      prop: "pro_name",
      fieldProps: {
        disabled: true,
      },
    },
    // !~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // {
    //   label: "检验依据",
    //   prop: "insp_id",
    //   valueType: "select",
    //   hideInForm: computed(() => isPlumbumPage.value),
    //   options: async () => {
    //     const reuslt = await getInspMapApi({ is_open: 1 });
    //     return reuslt.data.map((item: any) => {
    //       return { label: item.name, value: item.id };
    //     });
    //   },
    //   fieldProps: {
    //     disabled: true,
    //   },
    // },
    {
      label: "检验依据",
      prop: "insp_name",
      hideInForm: computed(() => isPlumbumPage.value),
      fieldProps: {
        disabled: true,
      },
    },
    // {
    //   label: "仪器名称",
    //   prop: "inst_id",
    //   valueType: "select",
    //   hideInForm: computed(() => isPlumbumPage.value),
    //   options: async () => {
    //     const reuslt = await getInstMapApi({ is_open: 1 });
    //     return reuslt.data.map((item: any) => {
    //       return { label: item.name, value: item.id };
    //     });
    //   },
    //   fieldProps: {
    //     disabled: true,
    //   },
    // },
    {
      label: "仪器名称",
      prop: "inst_name",
      hideInForm: computed(() => isPlumbumPage.value),
      fieldProps: {
        disabled: true,
      },
    },
    {
      label: "室温",
      prop: "heat",
      hideInForm: computed(() => isPlumbumPage.value),
    },
    {
      label: "判定标准",
      prop: "criterion",
      hideInForm: computed(() => isPlumbumPage.value),
      fieldProps: {
        disabled: true,
      },
    },
    {
      label: "元素",
      prop: "char",
      hideInForm: computed(() => isOtherPage.value || isvitaminPage.value),
      fieldProps: {
        disabled: true,
      },
    },
    // !~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
      label: "检验结果",
      prop: "check_ret",
      valueType: "select",
      options: basePassList,
      tooltip: "根据检验信息的检验结果自动判断,存在三种情况: 合格、不合格、部分合格",
      fieldProps: {
        placeholder: "自动判断",
        disabled: true,
      },
    },
    {
      label: "检验员",
      prop: "check_user_id",
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
      hideInForm: computed(() => !isDetailDisable.value),
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
      hideInForm: computed(() => !isDetailDisable.value),
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
    check_date: [
      {
        required: true,
        message: "请选择检测日期",
      },
    ],
    check_user_id: [
      {
        required: true,
        message: "请选择检验员",
      },
    ],
  };

  /** 如果是提交则设为true,表示必填 */
  const is_submit = ref(false);

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
    isOtherPage,
    isvitaminPage,
    isPlumbumPage,
    isAddDisable,
    formulaValue,
    getUserOptions,
    getBrandMap,
    getSkuMap,
    orderType,
  };
}
