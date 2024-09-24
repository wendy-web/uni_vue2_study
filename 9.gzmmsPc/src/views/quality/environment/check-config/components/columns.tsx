import { useCommon as useDeviceCommon } from "@/hooks/device/baseData";

export type AddTableType = {
  id: number | string;
  name: string; //检查内容组名
  std_explain: string; //检查目的
  note: string; //备注
  item: AddTableItemType[];
};

/** 检查内容列表的数据类型 */
export type AddTableItemType = {
  id: number | string;
  item_content: string;
  method: string;
  std_explain: string;
  record_method: number;
  normal_val: string;
  abnormal_val: string;
  upper_limit_val: string;
  lower_limit_val: string;
};

export function useAdd() {
  const baseFormData = ref({
    type: undefined as FormNumType,
    note: "",
  });
  /** 所属表下拉数据列表 */
  const orderTypeList = ref<SelectOpitonType[]>([]);
  const tableData = ref<AddTableType[]>([]);

  /** 基础信息 */
  const baseColumns: PlusColumnList = [
    {
      label: "所属表类型",
      prop: "type",
      valueType: "select",
      fieldProps: {
        clearable: false,
        filterable: true,
      },
      options: computed(() => {
        return orderTypeList.value.map((item) => ({
          label: item.name,
          value: item.id,
          fieldItemProps: {
            disabled: item.disable,
          },
        }));
      }),
    },

    {
      label: "备注",
      prop: "note",
      labelWidth: 70,
    },
  ];

  const baseRules = {
    type: [{ required: true, message: "请选择所属表类型", trigger: "change" }],
  };

  const addTableColumns: TableColumnList = [
    {
      label: "操作",
      align: "center",
      slot: "operation",
    },
    {
      label: "检查内容组名",
      prop: "name",
      align: "center",
    },
    {
      label: "检查目的",
      prop: "std_explain",
      align: "center",
    },
    {
      label: "备注",
      prop: "note",
      align: "center",
    },
    {
      label: "检查项总数",
      cellRenderer: ({ row }) => {
        return row.item.length + "项";
      },
      align: "center",
    },
  ];

  return {
    baseFormData,
    baseColumns,
    addTableColumns,
    baseRules,
    tableData,
    orderTypeList,
  };
}

/** 处理检查组信息的 */
export function useAddGroup() {
  const { getRecordName, getLimitVal } = useDeviceCommon();

  const formData = ref({
    name: "", //检查内容组名
    std_explain: "", //检查目的
    note: "", //备注
  });

  const tableList = ref<AddTableItemType[]>([]);
  const tableColumns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      width: 60,
    },
    {
      label: "检查内容",
      prop: "item_content",
      align: "center",
    },
    {
      label: "检验方法/工具/依据",
      prop: "method",
      align: "center",
    },
    {
      label: "检查标准说明",
      prop: "std_explain",
      align: "center",
    },
    {
      label: "记录方式",
      prop: "record_method",
      align: "center",
      cellRenderer: ({ row }) => {
        return getRecordName(row.record_method);
      },
    },
    {
      label: "结果选项",
      align: "center",
      slot: "select",
    },
    {
      label: "上限",
      prop: "upper_limit_val",
      align: "center",
      cellRenderer: ({ row }) => {
        return getLimitVal(row.record_method, row.upper_limit_val);
      },
    },
    {
      label: "下限",
      prop: "lower_limit_val",
      align: "center",
      cellRenderer: ({ row }) => {
        return getLimitVal(row.record_method, row.lower_limit_val);
      },
    },
    {
      label: "操作",
      slot: "operation",
    },
  ];

  const fromRules = {
    name: [
      {
        required: true,
        message: "请输入检查内容组名",
      },
    ],
  };

  const formColumns: PlusColumnList = [
    {
      label: "检查内容组名",
      prop: "name",
    },
    {
      label: "检查目的",
      prop: "std_explain",
    },
    {
      label: "备注",
      prop: "note",
    },
  ];

  const popupVisible = ref(false);
  const popupForm = ref({
    item_content: "", //检查内容
    method: "", //检查方法
    std_explain: "", // 检查标准说明
    record_method: 0,
    normal_val: [] as string[], //正常值
    abnormal_val: [] as string[], //异常值
    upper_limit_val: "", //上限
    lower_limit_val: "", //下限
  });

  const popupColumns: PlusColumnList = [
    {
      label: "检查内容",
      prop: "item_content",
    },
    {
      label: "检验方法",
      prop: "method",
    },
    {
      label: "检查标准说明",
      prop: "std_explain",
      renderExtra: () => (
        <>
          <div class="h-[40px]  bg-gray-100 flex items-center">
            <i class="bg-sky-500 w-[2px] h-full mr-2"></i>
            <span class="text-black font-bold">检查结果</span>
          </div>
        </>
      ),
    },
    {
      label: "记录方式",
      prop: "record_method",
    },
    {
      label: "正常",
      prop: "normal_val",
      hideInForm: computed(() => ![0, 1].includes(popupForm.value.record_method)),
    },
    {
      label: "异常",
      prop: "abnormal_val",
      hideInForm: computed(() => ![0, 1].includes(popupForm.value.record_method)),
    },
    {
      label: "上限",
      prop: "upper_limit_val",
      hideInForm: computed(() => popupForm.value.record_method !== 2),
    },
    {
      label: "下限",
      prop: "lower_limit_val",
      hideInForm: computed(() => popupForm.value.record_method !== 2),
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error("请输入下限"));
                } else if (Number(value) > Number(popupForm.value.upper_limit_val)) {
                  callback(new Error("下限应小于或等于上限"));
                } else {
                  callback();
                }
              },
              trigger: "blur",
            },
          ],
        };
      },
    },
  ];

  const popupRules = {
    item_content: [
      {
        required: true,
        message: "请输入检查内容",
        trigger: "blur",
      },
    ],
    normal_val: [
      {
        required: true,
        message: "请输入正常值",
        trigger: "blur",
      },
    ],
    abnormal_val: [
      {
        required: true,
        message: "请输入异常值",
        trigger: "blur",
      },
    ],
    upper_limit_val: [
      {
        required: true,
        message: "请输入上限",
        trigger: "blur",
      },
    ],
  };

  return {
    formData,
    fromRules,
    formColumns,
    tableList,
    tableColumns,
    popupColumns,
    popupVisible,
    popupForm,
    popupRules,
  };
}
