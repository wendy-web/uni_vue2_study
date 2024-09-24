import { ElImage, FormInstance } from "element-plus";
import dayjs from "dayjs";
import type { PlusFormGroupRow } from "plus-pro-components";
import {
  QualityCommonModule as CommonModule,
  SelectStringOpions,
} from "@/api/quality/common/types";
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";

interface columnItemType {
  label: string;
  prop: string;
  minWidth?: number;
  headerRenderer?: any;
  [key: string]: any;
}
export function useAdd() {
  const useSetting = useSettingsStoreHook();

  const { getStatusText, basePassList, passList } = useselectData();

  const BaseData = ref<any>(); // 获取公共下拉框数据配置
  const brandOptions = ref<CommonModule.seletcOptionItem[]>([]); // 产品大类 下拉选项
  const checkUserOptions = ref<CommonModule.seletcOptionItem[]>([]); // 检验人 下拉选项
  const lineOptions = ref<CommonModule.seletcOptionItem[]>([]); // 线别 下拉选项

  /** 1是新建,2是编辑,3是详情 */
  const pageType = ref(1);
  const editDisabled = computed(() => {
    return pageType.value === 3;
  });
  /** add表单数据 */
  const formData = ref<any>({
    order_no: "", //单据编号
    batch_no: "", // 批次号8位
    brand: "", //产品大类
    sku: "", //类型
    line_id: "", // 线别
    line_name: "", // 线别名称
    sample_num: "", //工序取样量
    net_ret: "", // 净含量平均值0不及格1及格红牛≥250.0ml，战马≥310.0ml才为合格
    check_date: "", //检测日期
    check_ret: "", //检查结果
    check_user_id: "", //检测员id
    check_user_name: "", //检测员名称
    check_sign: "", // 检验人签字
    recheck: [], // 复检人签名
    remark: "", // 备注
    check_remark: "", // 审核备注
    checkinfo: [], // 检测数据信息
    status: 0, //单据状态
    files: [], //文件数据
    logs: [], //日志信息
    total: 0, // 总样品数
    abnormal: 0, //不合格数
  });

  function checkDate(date: string, diffDate: string, type = 1) {
    let isBefore = dayjs(date).isBefore(dayjs(diffDate).format("YYYY-MM-DD"));
    let isAfter = dayjs(date).isAfter(dayjs(diffDate));
    return type === 1 ? isBefore : isAfter;
  }
  // 判断是否选择产品大类
  const disabledSku = ref(true);

  /** 添加页面使用的PlusForm表单数据 */
  const formColumns: PlusFormGroupRow[] = [
    {
      title: "基础信息",
      hideInGroup: false,
      columns: [
        {
          label: "单据编号",
          labelWidth: 80,
          prop: "order_no",
          valueType: "text",
          fieldProps: {
            disabled: true,
          },
          colProps: {
            span: 5,
          },
        },
        {
          label: "制单人",
          prop: "ct_name",
          valueType: "text",
          labelWidth: 80,
          colProps: {
            span: 5,
          },
        },
        {
          label: "创建时间",
          prop: "create_time",
          valueType: "text",
          labelWidth: 80,
          colProps: {
            span: 5,
          },
          // hideInForm: computed(() => pageType.value === 1),
        },
        {
          label: "供应商",
          prop: "supplier_name",
          valueType: "text",
          labelWidth: 80,
          colProps: {
            span: 5,
          },
          fieldProps: {
            disabled: true,
          },
        },
        {
          label: "检测日期",
          valueType: "text",
          prop: "check_date",
          labelWidth: 80,
          fieldProps: {
            disabled: true,
          },
          colProps: {
            span: 4,
          },
        },
        {
          label: "备注",
          width: 80,
          labelWidth: 80,
          prop: "remark",
          valueType: "text",
          fieldProps: {},
          colProps: {
            span: 24,
          },
        },
      ],
    },
    {
      title: "称重信息",
      columns: [
        {
          label: "最高值(g)",
          width: 80,
          labelWidth: 80,
          prop: "max_weight",
          valueType: "text",
          fieldProps: {
            disabled: true,
          },
          colProps: {
            span: 12,
          },
        },
        {
          label: "最低值(g)",
          width: 80,
          labelWidth: 80,
          prop: "min_weight",
          valueType: "text",
          fieldProps: {
            disabled: true,
          },
          colProps: {
            span: 12,
          },
        },
        {
          label: "差值(g)",
          width: 80,
          labelWidth: 80,
          prop: "diff_weight",
          valueType: "text",
          fieldProps: {
            disabled: true,
          },
          colProps: {
            span: 12,
          },
        },
        {
          label: "平均值(g)",
          width: 80,
          labelWidth: 80,
          prop: "avg_weight",
          valueType: "text",
          fieldProps: {
            disabled: true,
          },
          colProps: {
            span: 12,
          },
        },
      ],
    },
    {
      title: "称重数据",
      columns: [
        {
          label: "",
          hasLabel: false,
          width: 80,
          prop: "weight",
          valueType: "text",
          fieldProps: {
            disabled: true,
          },
          colProps: {
            span: 24,
          },
        },
      ],
    },
  ];

  /** 表格表单数据 */
  const checkTableForm = reactive({
    checkTableData: [] as any[],
    tableFormRef: {} as FormInstance,
  });
  /** 表格数据 */
  const { checkTableData, tableFormRef } = toRefs(checkTableForm);
  const disabledDate = (time: Date) => {
    return time.getTime() > Date.now();
  };
  /** 称重数据表格配置 */
  const checkTablecolumns = ref<TableColumnList>([
    {
      label: "序号",
      type: "index",
      width: 80,
      fixed: true,
      slot: "index",
    },
    {
      label: "1",
      prop: "1",
      slot: "1",
      minWidth: 140,
      fixed: true,
    },
    {
      label: "2",
      prop: "2",
      slot: "2",
      minWidth: 140,
      fixed: true,
    },
    {
      label: "3",
      prop: "3",
      slot: "3",
      minWidth: 140,
    },
    {
      label: "4",
      prop: "4",
      slot: "4",
      minWidth: 140,
    },
    {
      label: "5",
      prop: "5",
      slot: "5",
      minWidth: 140,
    },
    {
      label: "6",
      prop: "6",
      slot: "6",
      minWidth: 140,
    },
    {
      label: "7",
      prop: "7",
      slot: "7",
      minWidth: 140,
    },
    {
      label: "8",
      prop: "8",
      slot: "8",
      minWidth: 140,
    },
    {
      label: "9",
      prop: "9",
      slot: "9",
      minWidth: 140,
    },
    {
      label: "10",
      prop: "10",
      slot: "10",
      minWidth: 140,
    },
  ]);

  /** 附件表格的columns */
  const fileColumns: TableColumnList = [
    {
      type: "selection",
      width: 60,
      label: "勾选列",
      fixed: "left",
      hide: () => editDisabled.value,
    },
    {
      label: "附件名称",
      prop: "file_name",
    },
    {
      label: "备注",
      prop: "note",
    },
    {
      label: "上传人",
      prop: "ct_name",
      align: "center",
    },
    {
      label: "上传时间",
      prop: "create_time",
      align: "center",
    },
    {
      label: "操作",
      slot: "operation",
    },
  ];

  /** 详情-日志表格的columns */
  const logColumns: TableColumnList = [
    {
      label: "操作人",
      prop: "up_name",
      align: "center",
    },
    {
      label: "操作类型",
      prop: "content",
      align: "center",
    },
  ];

  // 表单单元格校验：是否合格
  const validatorCell = (ruleItem: columnItemType, value: any) => {
    let { type: check_type, lower_limit_val, upper_limit_val, error_limit_val } = ruleItem;
    let lower_limit = Number(lower_limit_val);
    let upper_limit = Number(upper_limit_val);
    let error_limit = Number(error_limit_val);
    if (error_limit) {
      lower_limit = lower_limit - error_limit;
      upper_limit = upper_limit + error_limit;
    }
    // console.log("lower_limit:", lower_limit, "upper_limit:", upper_limit);
    let isOk = true;
    switch (check_type) {
      case 0: // 区间
        if (value < lower_limit || value > upper_limit) {
          isOk = false;
        }
        break;
      case 1: // 大于
        if (value <= lower_limit) {
          isOk = false;
        }
        break;
      case 2: // 大于等于
        if (value < lower_limit) {
          isOk = false;
        }
        break;
      case 3: // 小于
        if (value >= lower_limit) {
          isOk = false;
        }
        break;
      case 4: // 小于等于
        if (value > lower_limit) {
          isOk = false;
        }
        break;
      case 5: // 等于
        if (value != lower_limit) {
          isOk = false;
        }
        break;

      default:
        isOk = true;
        break;
    }

    return isOk;
  };

  // 异常数据统计
  const errorCountMap = ref(new Map<string, boolean>());
  const initErrorCountMap = (isOk: boolean, field: string) => {
    if (!isOk) {
      if (!errorCountMap.value.has(field)) {
        errorCountMap.value.set(field, true);
        // 手动触发更新
        errorCountMap.value = new Map(errorCountMap.value);
      }
      return;
    }
    if (errorCountMap.value.has(field)) {
      errorCountMap.value.delete(field);
      // 手动触发更新
      errorCountMap.value = new Map(errorCountMap.value);
    }
  };
  // 重置异常数据统计
  const resetErrorCountMap = () => {
    errorCountMap.value.clear();
    // 手动触发更新
    errorCountMap.value = new Map();
  };
  // 更新批次
  const updateBatchNo = (value: any) => {
    let tableData = checkTableData.value;
    if (tableData.length) {
      tableData.forEach((item: any, index: number) => {
        item.batch_no = value;
      });
      checkTableData.value = tableData;
    }
  };
  // 判断数值是否在范围内
  function isWithinRange(value1: number, value2: number, tolerance = 0.015, precision = 14) {
    // console.log("value1:", value1, "value2:", value2, "tolerance:", tolerance, "precision:", precision);
    const factor = Math.pow(10, precision);
    return Math.abs(Math.round((Number(value1) - Number(value2)) * factor) / factor) <= tolerance;
  }
  const meetList = [
    {
      label: "符合",
      value: "1",
    },
    {
      label: "不符合",
      value: "0",
    },
  ];
  return {
    pageType,
    editDisabled,
    formData,
    formColumns,
    checkTablecolumns,
    checkTableData,
    tableFormRef,
    fileColumns,
    logColumns,
    checkTableForm,
    passList,
    basePassList,
    errorCountMap,
    updateBatchNo,
    getStatusText,
    validatorCell,
    isWithinRange,
    meetList,
    checkUserOptions,
    resetErrorCountMap,
  };
}
