import type { PlusFormGroupRow } from "plus-pro-components";
import { useCommon } from "@/hooks/device/baseData";

export function useAdd() {
  const { getRecordName, getLimitVal } = useCommon();

  const formData = ref({
    equipment_type_id: undefined as FormNumType, //资产类型id
    equipment_type_title: "", // 资产类型名称
    inspect_items_name: "", //检查内容组名
    inspect_purpose: "", //检查目的
    note: "", //备注
  });

  const addRules = {
    inspect_items_name: [
      {
        required: true,
        message: "请输入检查内容组名",
      },
    ],
  };

  const group: PlusFormGroupRow[] = [
    {
      title: "点巡检项目信息",
      columns: [
        {
          label: "检查内容组名",
          prop: "inspect_items_name",
          labelWidth: 110,
          fieldProps: {
            placeholder: "请输入",
          },
        },
        {
          label: "资产类型",
          prop: "equipment_type_id",
          labelWidth: 110,
          fieldProps: {
            placeholder: "请输入",
          },
        },
        {
          label: "检查目的",
          prop: "inspect_purpose",
          labelWidth: 110,
          fieldProps: {
            placeholder: "请输入",
          },
        },
        {
          label: "备注",
          prop: "note",
          labelWidth: 110,
          fieldProps: {
            placeholder: "请输入",
          },
        },
      ],
    },
  ];

  const columns: TableColumnList = [
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
    // lower_limit_val: [
    //   {
    //     required: true,
    //     message: "请输入下限",
    //   },
    // ],
  };

  return {
    formData,
    addRules,
    group,
    columns,
    popupColumns,
    popupVisible,
    popupForm,
    popupRules,
    getRecordName,
    getLimitVal,
  };
}
