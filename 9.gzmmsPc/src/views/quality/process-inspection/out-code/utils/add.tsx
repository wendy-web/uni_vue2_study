import { ElImage,ElSelect, FormInstance } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import dayjs from "dayjs";
// 引入获取表头、检测依据api
import { getBoxqrBaseData, getTabelLabelApi } from "@/api/quality/common/index";
import {
  QualityCommonModule as CommonModule,
  SelectStringOpions,
} from "@/api/quality/common/types";
import { useCommonHooks } from "@/hooks/quality/index";
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useUserStore } from "@/store/modules/user";


export type ElSelectRefType = InstanceType<typeof ElSelect>


const userStore = useUserStore();
const { validatorCell } = useCommonHooks();

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
  const lineOptions = ref<CommonModule.seletcOptionItem[]>([]); // 线别 下拉选项
  // 获取公共下拉框数据配置
  async function initBaseData() {
    const result = await getBoxqrBaseData();
    BaseData.value = result.data;
    statusOptions.value = result.data.status.map((item: any) => {
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
    lineOptions.value = result.data.line_init.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  }
  const tableLableOptions = ref(); // 表头配置
  // 获取表头
  async function initTableClumns({ sku, brand }: any) {
    const data: any = {
      item: 25, // 25、样品检验
      brand,
      sku,
    };
    const arr: any = [
      {
        type: "selection",
        label: "勾选列",
        fixed: "left",
        selectable: (row: any, index: number) => {
          return index !== 0;
        },
        hide: () => editDisabled.value,
      },
      {
        label: "#",
        type: "index",
        width: 80,
        fixed: true,
      },
    ];
    const result = await getTabelLabelApi(data);
    tableLableOptions.value = result.data;
    // Object.entries(result.data).forEach(([keys, item]) => {
    //   let { key, name } = item;
    //   let columnItem: columnItemType = {
    //     label: name,
    //     prop: key,
    //     minWidth: 140,
    //     slot: key,
    //     hide: false,
    //   };
    //   if (item.initval) {
    //     columnItem.headerRenderer = () => (
    //       <>
    //         <div>{item.name}</div>
    //         <div>
    //           ({item.initval}){item.unit}
    //         </div>
    //       </>
    //     );
    //   }
    //   // 根据 key 判断是否可编辑：生成对应可编辑单元格
    //   arr.push(columnItem);
    //   arr.sort((a: columnItemType, b: columnItemType) => a.sort - b.sort);
    // });

    // checkTablecolumns.value = arr;
    console.log("标准值配置: ", tableLableOptions.value);
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
    line_id: "", // 线别
    line_name: "", // 线别名称
    make_date: "", //生产日期
    check_ret: undefined as FormNumType, //检查结果
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

  /** add表单验证规则 */
  const formRules = {
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
    make_date: [
      {
        required: true,
        message: "请选择生产日期",
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
      label: "单据编号",
      width: 90,
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
      valueType: "select",
      labelWidth: "90",
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择",
        filterable: true,
      },
      options: computed(() => {
        // 线别下拉 通过公共接口返回
        return lineOptions.value;
      }),
    },
    {
      label: "生产日期",
      valueType: "date-picker",
      prop: "make_date",
      labelWidth: 90,
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
      labelWidth: 90,
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
    // {
    //   label: "检验员",
    //   prop: "check_user_id",
    //   valueType: "select",
    //   labelWidth: "90",
    //   colProps: {
    //     span: 6,
    //   },
    //   fieldProps: {
    //     placeholder: "请选择",
    //     filterable: true,
    //     onChange: (event: any) => {
    //       console.log("check_user_id onChange:", event);
    //       if (event) {
    //         // 查找检验员名称
    //         const matchingCheckUser: any = checkUserOptions.value?.find(
    //           (item) => item.value === event,
    //         );
    //         console.log("matchingCheckUser:", matchingCheckUser);
    //         formData.value.check_user_name = matchingCheckUser?.label;
    //       }
    //     },
    //   },
    //   options: computed(() => {
    //     // 线别下拉 通过公共接口返回
    //     return checkUserOptions.value;
    //   }),
    // },

    // {
    //   label: "检验员签名",
    //   prop: "check_sign",
    //   labelWidth: 120,
    //   hideInForm: computed(() => pageType.value !== 3),
    //   renderField: (value) => (
    //     <>
    //       {value ? (
    //         <ElImage
    //           style="width: 60px; height: 60px"
    //           src={useSetting.baseHttp + value}
    //           preview-src-list={[useSetting.baseHttp + value]}
    //         />
    //       ) : (
    //         <span class="text-gray-400">暂无~</span>
    //       )}
    //     </>
    //   ),
    // },
    // {
    //   label: "复核员签名",
    //   prop: "recheck",
    //   labelWidth: 120,
    //   hideInForm: computed(() => pageType.value !== 3),
    //   renderField: (value: any) => {
    //     let list =
    //       value.length > 0
    //         ? (value as any[]).map((el) => useSetting.baseHttp + el.recheck_sign)
    //         : [];
    //     return (
    //       <>
    //         {list.length > 0 ? (
    //           list.map((item, index) => {
    //             return (
    //               <ElImage
    //                 style="width: 60px; height: 60px;margin-right:8px;"
    //                 src={item}
    //                 preview-src-list={list}
    //                 initial-index={index}
    //               />
    //             );
    //           })
    //         ) : (
    //           <span class="text-gray-400">暂无~</span>
    //         )}
    //       </>
    //     );
    //   },
    // },
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
      label: "勾选列",
      type: "selection",
      fixed: "left",
      hide: () => editDisabled.value,
    },
    {
      label: "#",
      type: "index",
      width: 80,
      fixed: true,
    },
    {
      label: "时间",
      prop: "check_time",
      slot: "check_time",
      minWidth: 140,
      fixed: true,
    },
    {
      label: "检测数(箱)",
      prop: "box_num",
      slot: "box_num",
      minWidth: 140,
      fixed: true,
    },
    {
      label: "合格数量(箱)",
      prop: "pass_num",
      slot: "pass_num",
      minWidth: 140,
    },
    {
      label: "不合格数量(箱)",
      prop: "nopass_num",
      slot: "nopass_num",
      minWidth: 140,
    },
    {
      label: "批号",
      prop: "batch_num",
      slot: "batch_num",
      minWidth: 140,
    },
    {
      label: "身份编码",
      prop: "id_card",
      slot: "id_card",
      minWidth: 140,
    },
    {
      label: "检验结果",
      prop: "check_ret",
      slot: "check_ret",
      minWidth: 140,
    },
    {
      label: "扫码信息确认人",
      prop: "confirmer_id",
      slot: "confirmer_id",
      minWidth: 140,
    },
    {
      label: "确认人签名",
      prop: "confirmer_sign",
      slot: "confirmer_sign",
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

    const { batch_no } = formData.value;
    // 新增一行:需要动态取表头里面的字段
    checkTableData.value.push({
      unique_id,
      check_time: checkTime,
      batch_no,
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
  const checkFormRules = {
    check_time: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            // if (is_submit) {
            //   callback(new Error("请选择检验时间"));
            // }
            // callback();
            callback(new Error("请选择检验时间"));
          }
        },
      },
    ],
    /** 检测箱数 */
    box_num: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (typeof value  === 'number') {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写检测箱数"));
            }
            callback();
          }
        },
      },
    ],
    /** 合格数量 */
    pass_num: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          console.log("🚀 ~ useAdd ~ value:", value)
          if (typeof value  === 'number') {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写合格数量"));
            }
            callback();
          }
        },
      },
    ],
    /** 不合格数量 */
    nopass_num: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (typeof value  === 'number') {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写不合格数量"));
            }
            callback();
          }
        },
      },
    ],
    /** 批号 */
    batch_num: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            // 判断列表里的包号是否重复
            let data = checkTableData.value;
            let count = data.filter((item) => item.batch_num === value);
            if (count.length >= 2) {
              callback(new Error("批号重复"));
            }
            // 限制长度必须是5位
            if (value && value.toString().length !== 5) {
              callback(new Error("批号长度为5"));
            }
            callback();
          } else {
            // if (is_submit.value) {
            //   callback(new Error("请输入批号"));
            // }
            // callback();
            callback(new Error("请输入批号"));
          }
        },
      },
    ],
    /** 身份编码 */
    id_card: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写身份编码"));
            }
            callback();
          }
        },
      },
    ],
    /** 扫码信息确认人 */
    confirmer_id: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写扫码信息确认人"));
            }
            callback();
          }
        },
      },
    ],
    // 检查结果
    check_ret: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择检查结果"));
            }
            callback();
          }
        },
      },
    ],
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
    meetList,
    checkUserOptions,
    resetErrorCountMap,
    useSetting,
    is_submit,
  };
}
