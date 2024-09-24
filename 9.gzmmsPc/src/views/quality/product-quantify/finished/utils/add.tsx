import { ElDatePicker, ElImage, FormInstance } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import dayjs from "dayjs";
// 引入获取表头、检测依据api
import { getEndProductBaseDataApi, getTabelLabelApi } from "@/api/quality/common/index";
import {
  QualityCommonModule as CommonModule,
  SelectStringOpions,
} from "@/api/quality/common/types";
// 根据批次获取检测信息api
import { submitOrderApi } from "@/api/quality/product-quantify/finished/index";
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();

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
  const statusOptions = ref<CommonModule.seletcOptionItem[]>([]); // 单据状态 下拉选项
  const brandOptions = ref<CommonModule.seletcOptionItem[]>([]); // 产品大类 下拉选项
  const checkResultOptions = ref<CommonModule.seletcOptionItem[]>([]); // 检验结果 下拉选项
  const checkUserOptions = ref<CommonModule.seletcOptionItem[]>([]); // 检验人 下拉选项
  // 获取公共下拉框数据配置
  async function initBaseData() {
    const result = await getEndProductBaseDataApi();
    BaseData.value = result.data;
    statusOptions.value = result.data.status.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      };
    });

    brandOptions.value = result.data.brand_data.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    checkResultOptions.value = result.data.check_init.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    checkUserOptions.value = result.data.check_user_list.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  }
  const tableLableOptions = ref(); // 表头配置
  // 获取表头
  async function initTableClumns({ sku, brand, oid = 0 }: any) {
    const data: any = {
      item: 23, // 23、成品检测
      brand,
      sku,
    };
    if (oid) data.oid = oid;
    const arr: any = [
      // {
      //   type: "selection",
      //   label: "勾选列",
      //   fixed: "left",
      //   selectable: (row: any, index: number) => {
      //     return index !== 0;
      //   },
      //   hide: () => editDisabled.value,
      // },
      {
        label: "#",
        type: "index",
        width: 80,
        fixed: true,
      },
    ];
    const result = await getTabelLabelApi(data);
    tableLableOptions.value = result.data;
    Object.entries(result.data).forEach(([keys, item]) => {
      let { key, name } = item;
      let columnItem: columnItemType = {
        label: name,
        prop: key,
        minWidth: 140,
        slot: key,
        hide: false,
      };
      if (item.initval) {
        columnItem.headerRenderer = () => (
          <>
            <div>{item.name}</div>
            <div>
              ({item.initval}){item.unit}
            </div>
          </>
        );
      }
      // 根据 key 判断是否可编辑：生成对应可编辑单元格
      arr.push(columnItem);
      arr.sort((a: columnItemType, b: columnItemType) => a.sort - b.sort);
    });

    // checkTablecolumns.value = arr;
    console.log("标准值配置: ", arr);
  }
  // 列表页面传参
  const batchParams = ref<any>();
  // 根据批次+批号获取检验信息
  async function getCheckInfoBaseData(data: any) {
    const result = await submitOrderApi(data);
    let { code } = result;
    if (code != 1) return;
    let { batch_no, brand, sku, make_start_date, make_end_date, list } = result.data;
    formData.value.batch_no = batch_no;
    formData.value.brand = brand;
    formData.value.sku = sku;
    formData.value.make_start_date = make_start_date;
    formData.value.make_end_date = make_end_date;
    formData.value.makeDateArr = [make_start_date,make_end_date];
    // 规格spec 需要取公共数据 brand_data 里面的child 对应sku 的spec
    let spec = BaseData.value.brand_data.find((item: any) => item.id == brand)?.child.find((item: any) => item.id == sku)?.spec;
    formData.value.spec = spec;
    checkTableData.value = list;
  }

  /** 1是新建,2是编辑,3是详情 */
  const pageType = ref(1);
  const editDisabled = computed(() => {
    return pageType.value === 3;
  });
  /** add表单数据 */
  const formData = ref<any>({
    order_no: "", //单据编号
    batch_no: "", // 批次号8位
    report_no: "", // 报告编号
    brand: "", //产品大类
    sku: "", //类型
    spec: "", // 规格
    package: "", // 包装
    make_start_date: "", // 生产日期
    make_end_date: "", // 生产日期
    check_date: "", //检测完成日期
    check_ret: "", //检查结果
    check_user_id: userStore.uid as number, //检测员id
    check_user_name: userStore.nickname, //检测员名称
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

  /** add表单验证规则 */
  const formRules = {
    package: [
      {
        required: true,
        message: "请选择包装",
      },
    ],
    makeDateArr: [
      {
        required: true,
        message: "请选择生产日期",
      },
    ],
    check_date: [
      {
        required: true,
        message: "请选择检验完成日期",
      },
    ],
    check_user_id: [
      {
        required: true,
        message: "请选择检验人",
      },
    ],
  };
  function checkDate(date: string, diffDate: string, type = 1) {
    let isBefore = dayjs(date).isBefore(dayjs(diffDate).format("YYYY-MM-DD"));
    let isAfter = dayjs(date).isAfter(dayjs(diffDate));
    return type === 1 ? isBefore : isAfter;
  }
  // 判断是否选择产品大类
  const disabledSku = ref(true);

  /** 添加页面使用的PlusForm表单数据 */
  const formColumns: PlusColumnList = [
    {
      label: "生产批号",
      width: 90,
      prop: "batch_no",
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
      label: "产品大类",
      prop: "brand",
      valueType: "select",
      labelWidth: "90",
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择",
        filterable: true,
        disabled: true,
        onChange: (event: any) => {
          disabledSku.value = event ? false : true;
        },
      },
      options: computed(() => {
        // 产品大类 通过公共接口返回
        return brandOptions.value;
      }),
    },
    {
      label: "产品类型",
      prop: "sku",
      valueType: "select",
      labelWidth: 90,
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: `请选择类型`,
        // placeholder: `${disabledSku.value ? "请先选择产品大类" : "请选择类型"}`,
        disabled: true,
      },
      // 产品类型要根据 产品大类筛选过滤
      options: computed(() => {
        if (BaseData.value?.brand_data) {
          let { brand, sku } = formData.value;
          let brandChild: SelectStringOpions[] = [];
          const matchingBrand = BaseData.value?.brand_data.find(
            (item: CommonModule.BrandDaum) => item.id === brand,
          );
          if (matchingBrand) {
            brandChild = matchingBrand.child;
          }
          return brandChild.map((item) => {
            return {
              label: item.name,
              value: item.id,
            };
          });
        }
        return [];
      }),
    },
    {
      label: "报告编号",
      minWidth: 90,
      prop: "report_no",
      valueType: "text",
      colProps: {
        span: 6,
      },
      fieldProps: {
        disabled: true,
      },
      hideInForm: computed(() => pageType.value === 1),
    },
    {
      label: "规格",
      labelWidth: 80,
      prop: "spec",
      colProps: {
        span: 6,
      },
      fieldProps: {
        disabled: true,
      },
    },
    {
      label: "包装",
      labelWidth: 90,
      prop: "package",
      valueType: "select",
      colProps: {
        span: 6,
      },
      fieldProps: {},
      options: [
        {
          label: "24罐/箱（与外包装一致）",
          value: "24罐/箱（与外包装一致）",
        },
      ],
    },
    {
      label: "生产日期",
      valueType: "date-picker",
      prop: "makeDateArr",
      labelWidth: 90,
      fieldProps: {
        placeholder: "请选择检测日期",
        type: "datetimerange",
        startPlaceholder: "请选择开始时间",
        endPlaceholder: "请选择结束时间",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        // disabledDate: (date: string) => {
        //   return checkDate(date, dayjs().format("YYYY-MM-DD"), 2); // 2今天之后的日期不可选
        // },
      },
      colProps: {
        span: 6,
      },
    },
    {
      label: "检测完成日期",
      valueType: "date-picker",
      prop: "check_date",
      labelWidth: 110,
      fieldProps: {
        placeholder: "请选择检测日期",
        type: "date",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        disabledDate: (date: string) => {
          return checkDate(date, dayjs().format("YYYY-MM-DD"), 2); // 2今天之后的日期不可选
        },
      },
      colProps: {
        span: 6,
      },
    },

    {
      label: "检验结果",
      labelWidth: 80,
      prop: "check_ret",
      valueType: "select",
      colProps: {
        span: 6,
      },
      fieldProps: {
        disabled: true,
        placeholder: " ",
      },
      options: () => {
        return basePassList.map((item) => {
          return {
            label: item.label,
            value: item.value,
          };
        });
      },
    },

    {
      label: "检验人签名",
      prop: "check_sign",
      labelWidth: 90,
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
      prop: "recheck",
      labelWidth: 90,
      hideInForm: computed(() => pageType.value !== 3),
      renderField: (value: any) => {
        let list =
          value.length > 0
            ? (value as any[]).map((el) => useSetting.baseHttp + el.recheck_sign)
            : [];
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
  /** 检验信息表格配置 */
  const checkTablecolumns = ref<TableColumnList>([
    {
      label: "检验项目",
      prop: "pro_name",
      slot: "pro_name",
      minWidth: 140,
      fixed: true,
    },
    {
      label: "单位",
      prop: "unit",
      minWidth: 140,
      fixed: true,
    },
    {
      label: "标准规定值",
      prop: "require_val",
      slot: "require_val",
      minWidth: 140,
      fixed: true,
    },
    {
      label: "测定值",
      prop: "test_val",
      slot: "test_val",
      minWidth: 140,
    },
    {
      label: "检验结论",
      prop: "check_ret",
      slot: "check_ret",
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

  /** 新增检验信息表格一行 */
  function handleAdd() {
    let tableData = checkTableData.value;

    let initDay = dayjs();
    // 判断是否有数据
    let checkTime = initDay.format("HH:mm");
    let unique_id: string = buildUUID();
    if (tableData.length) {
      let lastCheckTime = tableData[tableData.length - 1]?.check_time;
      checkTime = dayjs(lastCheckTime, "HH:mm").add(5, "minute").format("HH:mm");
    }

    // const { batch_no, pro_date } = formData.value;
    // 新增一行:需要动态取表头里面的字段
    checkTableData.value.push({
      unique_id,
    });
    // console.log("checkTableData.value:", checkTableData.value);
  }
  /** 删除表格的选中行 */
  function handleDelRow(ids: any) {
    checkTableData.value = checkTableData.value.filter((item) => {
      return !ids.includes(item.id || item.unique_id);
    });
  }
  /** 如果是提交则设为true,表示必填 */
  const is_submit = ref(false);
  /** 检验表格信息 */
  const checkFormRules = reactive({
    // test_val: [
    //   {
    //     // required: is_submit,
    //     required: false,
    //     validator: (rule: any, value: any, callback: any) => {
    //       if (value) {
    //         callback();
    //       } else {
    //         if (is_submit) {
    //           callback(new Error("请填写内容"));
    //         }
    //         callback();
    //       }
    //     },
    //   },
    // ],
    // 检查结果
    check_ret: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit) {
              callback(new Error("请选择检查结果"));
            }
            callback();
          }
        },
      },
    ],
  });

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
  // 更新批次
  const updateBatchNo = (value: any) => {
    // 注意：ph成分分析检验详情 第一行是标准数据，批次单独输入, 第二行从表头带入
    let tableData = checkTableData.value;
    if (tableData.length) {
      tableData.forEach((item: any, index: number) => {
        if (index > 0) {
          item.batch_no = value;
        }
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
    formRules,
    initBaseData,
    formColumns,
    checkTablecolumns,
    checkTableData,
    tableFormRef,
    fileColumns,
    logColumns,
    handleAdd,
    handleDelRow,
    checkTableForm,
    checkFormRules,
    passList,
    basePassList,
    errorCountMap,
    tableLableOptions,
    initTableClumns,
    updateBatchNo,
    getStatusText,
    validatorCell,
    isWithinRange,
    batchParams,
    getCheckInfoBaseData,
    meetList,
    is_submit,
  };
}
