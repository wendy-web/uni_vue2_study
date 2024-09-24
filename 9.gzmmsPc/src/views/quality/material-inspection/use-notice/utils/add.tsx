import { ElImage } from "element-plus";
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useUserStoreHook } from "@/store/modules/user";

/** 表格展示信息的数据类型 */
export interface TableDataType {
  id?: number; //编辑时存在的id
  batch_no: string; //批号
  joint_pack_no: string; //托盘号
}

/** 根据批号分组的分组数据的类型key-value */
export type GroupedPacks = {
  [groupName: string]: GroupedList[];
};

/** 根据批号分组数据类型的value类型 */
export type GroupedList = {
  check_date: string; //检验日期
  batch_no: string; //批次号
  pack_no: number; //包号
  check_detail_id: number | string; //托盘信息id
  detail_id?: number; // 批次明细id 编辑时存在
  id?: number; // 记录id 编辑时存在
};
/** 定义连续性报告的数据 */
export type ContinuityResult = {
  [groupName: string]: string;
};

export function useAdd() {
  const useSetting = useSettingsStoreHook();
  const useUser = useUserStoreHook();
  const { getBrandMap, materialsClassOptions, getUserList, getStatusText, passList } =
    useselectData();

  /**  顶部基础表单的数据 */
  const baseForm = ref({
    order_no: "", //单据编号-保存剔除
    // 状态；0：暂存；1：待审核；2：已审核；3：已驳回；4：已撤回；5：已反审；
    order_status: "", //单据状态-保存剔除
    ct_name: "", //制单人-保存剔除
    create_time: "", //创建时间-保存剔除
    check_time: "", //检测日期
    notice_time: "", //通知时间
    // check_uid: undefined as FormNumType, //检验员id
    check_uid: useUser.uid, //检验员id
    materials_class: undefined as FormNumType, //原材料类别; 0：空罐；1：顶盖
    brand: "", // 产品大类(产品品牌)
    check_res: undefined as FormNumType, //检验结果
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
    tableData: [] as TableDataType[],
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
      label: "日期",
      prop: "check_time",
      valueType: "date-picker",
      fieldProps: {
        type: "date",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      },
    },
    {
      label: "时间",
      prop: "notice_time",
      valueType: "time-picker",
      fieldProps: {
        format: "HH:mm",
        valueFormat: "HH:mm",
      },
    },
    {
      label: "原材料类别",
      prop: "materials_class",
      valueType: "select",
      labelWidth: 100,
      options: materialsClassOptions,
      fieldProps: computed(() => ({ disabled: isDisabled.value })),
    },
    {
      label: "产品大类",
      prop: "brand",
      valueType: "select",
      options: getBrandMap,
    },
    {
      label: "检验结果",
      prop: "check_res",
      valueType: "select",
      options: () => {
        return passList.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      },
    },
    {
      label: "检验员",
      prop: "check_uid",
      valueType: "select",
      options: getUserList,
      fieldProps: {
        filterable: true,
        clearable: false,
      },
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
    check_time: [
      {
        required: true,
        message: "请选择日期",
      },
    ],
    notice_time: [
      {
        required: true,
        message: "请选择时间",
      },
    ],
    materials_class: [
      {
        required: true,
        message: "请选择原材料类别",
      },
    ],
    brand: [
      {
        required: true,
        message: "请选择产品大类",
      },
    ],
    check_uid: [
      {
        required: true,
        message: "请选择检验人员",
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
      width: 70,
    },
    {
      label: "批号",
      prop: "batch_no",
    },
    {
      label: "托盘号",
      prop: "joint_pack_no",
      slot: "joint_pack_no",
    },
  ];

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
    tableForm,
    tableData,
    tableColumns,
    pageType,
    is_submit,
    getStatusText,
    isDetailDisable,
    useSetting,
  };
}
