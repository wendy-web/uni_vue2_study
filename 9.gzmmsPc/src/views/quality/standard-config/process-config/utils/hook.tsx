import { ElInput } from "element-plus";
import { BaseValSetModule } from "@/api/quality/standard-config/material/types";
import { onlyMinusNumPoint } from "@/utils/index";

export function useList() {
  const columns: TableColumnList = [
    {
      label: "检验项目",
      prop: "name",
      align: "center",
    },
    {
      label: "条件表达式",
      prop: "expression",
      align: "center",
      minWidth: 300,
    },
    {
      label: "操作",
      slot: "operation",
      fixed: "right",
    },
  ];

  const treeData = ref([
    {
      id: 24,
      name: "半成品检测",
    },
    {
      id: 25,
      name: "样品检测",
    },
    {
      id: 26,
      name: "工序控制检测报告",
    },
    {
      id: 27,
      name: "空罐+顶盖重量检测单",
    },
    {
      id: 28,
      name: "定期CIP检测",
    },
    {
      id: 29,
      name: "停机及CPI检测",
    },
    {
      id: 30,
      name: "开机确认单",
    },
    {
      id: 31,
      name: "香精入厂检测记录",
    },
  ]);

  // 品牌tab
  const brandTabList = [
    {
      key: "ND1",
      title: "红牛",
      skuIndex: 0,
      skuList: [
        {
          key: "ND1-1",
          title: "红牛-普通型",
        },
        {
          key: "ND1-2",
          title: "红牛-强化型",
        },
        // {
        //   key: 1,
        //   title: "普通版",
        // },
        // {
        //   key: 2,
        //   title: "强化版",
        // },
        // {
        //   key: 3,
        //   title: "彩膜",
        // },
      ],
    },
    {
      key: "ND2",
      title: "战马",
      skuIndex: 0,
      skuList: [
        {
          key: "ND2-1",
          title: "战马-罐装",
        },
        // {
        //   key: 1,
        //   title: "普通版",
        // },
      ],
    },
  ];
  const popupVisible = ref(false);
  const popupForm = ref<any>({
    id: 0,
    item: 24, // 类型
    brand: "",
    sku: "ND1-1", // 产品类型 ND1-1 普通型 ND1-2 强化型 ND2-1 战马灌装 ND2-2 战马瓶装
    name: "",
    en: "", // 别名
    unit: "", // 单位
    status: 1, // 状态 0 禁用 1启用
    type: 0, // 判断类型 0 =>区间, 1 => 大于,2 => 大于等于, 3 => 小于,4 => 小于等于, 5 => 等于 ,6 => 是否合格，7 => 文本
    upper_limit_val: "", //上限
    lower_limit_val: "", //下限
    error_limit_val: "", // 允许误差
    value: null, // 是否合格：1合格 0不合格
    key: "", // 前端无需显示编辑时候带过去
    default_val: 0,
  } as BaseValSetModule.BaseValSetParams);
  const popupColums: PlusColumnList = [
    {
      label: "项目名称",
      prop: "name",
      fieldProps: {
        placeholder: "请输入",
        disabled: true,
      },
    },
    {
      label: "英文名称",
      prop: "en",
      fieldProps: {
        placeholder: "请输入",
        disabled: true,
      },
    },
    {
      label: "单位",
      prop: "unit",
      fieldProps: {
        placeholder: "请输入",
        disabled: true,
      },
    },
    {
      label: "检验类型",
      prop: "type",
      fieldProps: {
        placeholder: "请选择",
      },
    },
    {
      // label: "下限",
      label: computed(() => {
        return [5, 8].includes(popupForm.value.type) ? "标准值" : "下限";
      }),
      prop: "lower_limit_val",
      fieldProps: {
        placeholder: "请输入",
      },
      renderField: (value, onChange) => {
        let val = value ? onlyMinusNumPoint(value) : "";
        return h(ElInput, {
          modelValue: val,
          onChange,
        });
      },
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (value === "" || value == null) {
                  callback(new Error("请输入下限"));
                } else if (
                  Number(value) > Number(popupForm.value.upper_limit_val) &&
                  popupForm.value.type === 0
                ) {
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
      hideInForm: computed(() => [7].includes(popupForm.value.type)),
    },
    {
      label: "上限",
      prop: "upper_limit_val",
      fieldProps: {
        placeholder: "输入",
      },
      renderField: (value, onChange) => {
        let val = value ? onlyMinusNumPoint(value) : "";
        return h(ElInput, {
          modelValue: val,
          onChange,
        });
      },
      hideInForm: computed(() => ![0, 6].includes(popupForm.value.type)),
    },
    {
      label: "允许误差",
      prop: "error_limit_val",
      fieldProps: {
        placeholder: "输入",
      },
      renderField: (value, onChange) => {
        let val = value ? onlyMinusNumPoint(value) : "";
        return h(ElInput, {
          modelValue: val,
          onChange,
        });
      },
      hideInForm: computed(() => ![6, 8].includes(popupForm.value.type)),
      // hideInForm: true,
    },
    {
      label: "是否合格",
      prop: "value",
      hideInForm: computed(() => ![6].includes(popupForm.value.type)),
    },
    {
      label: "标准值",
      prop: "default_val",
      hideInForm: computed(() => ![7].includes(popupForm.value.type)),
    },
  ];

  const popupRules = {
    name: [
      {
        required: true,
        message: "请输入项目名称",
      },
    ],
    error_limit_val: [
      {
        required: false,
        message: "请输入允许误差值",
      },
    ],
    upper_limit_val: [
      {
        required: true,
        message: "请输入上限",
      },
    ],
    lower_limit_val: [
      {
        required: true,
        message: "请输入下限",
      },
    ],
  };
  // 初始化表达式
  const initExpression = (row: BaseValSetModule.BaseValSetData) => {
    let { unit, type, lower_limit_val, upper_limit_val, error_limit_val, value, default_val } = row;
    let expression = "";
    switch (type) {
      case 0:
        if (lower_limit_val && upper_limit_val) {
          expression += `区间:${lower_limit_val}~${upper_limit_val}`;
        }
        break;
      case 1:
        expression += ` ${lower_limit_val ? "大于" + lower_limit_val : ""}`;
        break;
      case 2:
        expression += ` ${lower_limit_val ? "大于等于" + lower_limit_val : ""}`;
        break;
      case 3:
        expression += ` ${lower_limit_val ? "小于" + lower_limit_val : ""}`;
        break;
      case 4:
        expression += ` ${lower_limit_val ? "小于等于" + lower_limit_val : ""}`;
        break;
      case 5:
        expression += ` ${lower_limit_val ? "等于" + lower_limit_val : ""}`;
        break;
      case 6:
        if (lower_limit_val && upper_limit_val) {
          expression += `合格区间:${lower_limit_val}~${upper_limit_val}`;
        }
        if (value !== null && value !== "") {
          expression += ` 是否合格:${value === 1 ? "合格" : "不合格"}`;
        }
        break;
      case 7:
        expression += ` 标准值:${default_val}`;
        break;
      /** 允许误差 上下浮动：50±2 */
      case 8:
        expression += ` 标准值:${lower_limit_val}±${error_limit_val}`;
        break;
      default:
        break;
    }
    if (unit) {
      expression += ` 单位：${unit}`;
    }
    // if (Number(error_limit_val)) {
    //   expression += ` 允许误差:${error_limit_val}`;
    // }

    return expression;
  };
  return {
    columns,
    treeData,
    popupVisible,
    popupForm,
    popupColums,
    popupRules,
    initExpression,
    brandTabList,
  };
}
