import { ElImage } from "element-plus";
import dayjs from "dayjs";
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";

export function useAdd() {
  const useSetting = useSettingsStoreHook();
  const {
    getBrandMap,
    getUserList,
    getStatusText,
    passList,
    getVersionList,
    workshopOptions,
    basePassList,
    getLineList,
  } = useselectData();

  /**  顶部基础表单的数据 */
  const baseForm = ref({
    order_no: "", //单据编号-保存剔除
    // 状态；0：暂存；1：待审核；2：已审核；3：已驳回；4：已撤回；5：已反审；
    order_status: "", //单据状态-保存剔除
    ct_name: "", //制单人-保存剔除
    create_time: "", //创建时间-保存剔除

    line_id: undefined as FormNumType, //产线id
    batch_no: "", //批次
    workshop: undefined as FormNumType, //车间
    check_date: "", //检测日期
    brand: "ND1", // 产品大类(产品品牌)
    check_res: undefined as FormNumType, //检验结果
    check_uid: undefined as FormNumType, //检验员id

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

  /** 总样品数 */
  const totalNum = computed(() => {
    return tableData.value.length;
  });

  /** 总异常数 */
  const abnormalNum = computed(() => {
    let count = 0;
    // 只检查检验结果是否为0
    tableData.value.forEach((item) => {
      if (item.check_res === 0) {
        count++;
      }
    });

    return count;
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
      label: "批次",
      prop: "batch_no",
    },
    {
      label: "车间",
      prop: "workshop",
      valueType: "select",
      options: workshopOptions,
    },
    {
      label: "线别",
      prop: "line_id",
      valueType: "select",
      options: getLineList,
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
      label: "产品大类",
      prop: "brand",
      valueType: "select",
      options: getBrandMap,
      fieldProps: {
        disabled: true,
      },
    },

    {
      label: "检验结果",
      prop: "check_res",
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
      prop: "check_uid",
      valueType: "select",
      options: getUserList,
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
    batch_no: [
      {
        required: true,
        message: "请输入批次",
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
        message: "检测日期",
      },
    ],
    brand: [
      {
        required: true,
        message: "请选择产品大类",
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
      label: "#",
      type: "index",
      width: 50,
    },
    {
      label: "检验日期",
      prop: "check_date",
      slot: "check_date",
    },
    {
      label: "检验时间",
      prop: "check_time",
      slot: "check_time",
    },
    {
      label: "批号",
      prop: "batch_number",
      slot: "batch_number",
    },
    {
      label: "检验结果",
      align: "center",
      children: [
        {
          label: "罐底二维码",
          prop: "bottom_qr_code_res",
          slot: "bottom_qr_code_res",
        },
        {
          label: "拉环二维码",
          prop: "pull_ring_qr_code_res",
          slot: "pull_ring_qr_code_res",
        },
        {
          label: "纸箱",
          prop: "layout_structure_res",
          slot: "layout_structure_res",
        },
      ],
    },
    {
      label: "防伪点",
      prop: "security_point_res",
      slot: "security_point_res",
    },
    {
      label: "复检项目",
      prop: "reinspection_items",
      slot: "reinspection_items",
      minWidth: 160,
    },
    {
      label: "复检情况",
      prop: "reinspection_situation_res",
      slot: "reinspection_situation_res",
    },
    {
      label: "备注",
      prop: "note",
      slot: "note",
    },
    {
      label: "检验结果",
      prop: "check_res",
      slot: "check_res",
    },
  ];

  /** 如果是提交则设为true,表示必填 */
  const is_submit = ref(false);

  const tableRules = reactive({
    check_date: [
      {
        required: is_submit,
        message: "请选择检验日期",
      },
    ],
    check_time: [
      {
        required: is_submit,
        message: "请选择检验时间",
      },
    ],
    batch_number: [
      {
        required: is_submit,
        message: "请输入批号",
      },
    ],
    bottom_qr_code_res: [
      {
        required: is_submit,
        message: "罐底二维码是否合格",
      },
    ],
    pull_ring_qr_code_res: [
      {
        required: is_submit,
        message: "拉环二维码是否合格",
      },
    ],
    layout_structure_res: [
      {
        required: is_submit,
        message: "纸箱是否合格",
      },
    ],
    security_point_res: [
      {
        required: is_submit,
        message: "防伪点是否合格",
      },
    ],
  });

  const fileData = ref<any[]>([]);
  const logList = ref<any[]>([]);

  watchEffect(() => {
    let isHaveUndefined = tableData.value.length
      ? tableData.value.some((item) => item.check_res === undefined)
      : true;
    if (isHaveUndefined) {
      // 如果表格中 有任何一个值为undefined 则 基础信息的check_res值也设置为undefined
      baseForm.value.check_res = undefined;
      return;
    }

    let someRes = tableData.value.some((item) => item.check_res === 1);
    if (someRes) {
      // 如果表格中 有任何一个值为 1(合格), 则基础信息的check_res值先设为-部分合格;
      baseForm.value.check_res = 2;
      let everyRes = tableData.value.every((item) => item.check_res === 1);
      if (everyRes) {
        // 如果所有的值都为 1(合格),则基础信息的check_res值设为-合格;
        baseForm.value.check_res = 1;
      }
    } else {
      // 此条件标识, 没有一个是合格的,基础信息的check_res值设为-不合格
      baseForm.value.check_res = 0;
    }
  });

  // 复检项目,多个用逗号隔开 项目；1:罐底二维码;2:拉环二维码;3:纸箱;4:防伪点;
  const checkItemList = [
    {
      id: 1,
      name: "罐底二维码",
    },
    {
      id: 2,
      name: "拉环二维码",
    },
    {
      id: 3,
      name: "纸箱",
    },
    {
      id: 4,
      name: "防伪点",
    },
  ];

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
    checkItemList,
    totalNum,
    abnormalNum,
  };
}
