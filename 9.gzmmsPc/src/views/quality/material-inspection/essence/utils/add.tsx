import { ElImage, FormInstance } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import dayjs from "dayjs";
// 引入获取表头api
import { getTabelLabelApi } from "@/api/quality/common/index";
import {
  QualityCommonModule as CommonModule,
  SelectStringOpions,
} from "@/api/quality/common/types";
import { useCommonHooks } from "@/hooks/quality/index";
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useUserStore } from "@/store/modules/user";

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

  const {
    getStatusText,
    basePassList,
    passList,
    getSupList,
    statusOptions,
    getUserList,
    getBasePassLabel,
    tasteOptions,
  } = useselectData();
  const tableLableOptions = ref<any>([]); // 表头配置
  // 获取表头
  async function initTableClumns({ supplier_id, oid = 0 }: any) {
    const data: any = {
      item: 31, // 31、香精入厂检测记录
      supplier_id,
    };
    if (oid) data.oid = oid;
    const result = await getTabelLabelApi(data);
    tableLableOptions.value = result.data;
    // console.log("标准值配置: ", tableLableOptions.value);
  }

  /** 1是新建,2是编辑,3是详情 */
  const pageType = ref(1);
  const editDisabled = computed(() => {
    return pageType.value === 3;
  });
  /** add表单数据 */
  const formData = ref<any>({
    batch_no: "", // 生产批号
    supplier_id: "", // 供应商id
    check_date: "", // 检测日期
    pro_date: "", // 生产日期
    sampling_uid: "", // 取样人uid
    check_uid: "", // 检验员uid
    check_res: "", // 检查结果；0：不合格；1：合格
    check_user_signature: "", // 检测员签名图片
    reviewer_user_signature: "", // 审核人签名图片
    note: "", // 备注
    check_info: [
      {
        brix_val: "", // 外观及理化检测信息-Brix实测值
        color_val: "", // 外观及理化检测信息-色度实测值
        density_val: "", // 外观及理化检测信息-密度实测值
        appearance_val: "", // 外观及理化检测信息-外观实测值
        arsenic_val: "", // 感官及重金属检测信息-砷实测值
        lead_val: "", // 感官及重金属检测信息-铅实测值
        taste_val: "", // 感官及重金属检测信息-口感实测值
        aroma_val: "", // 感官及重金属检测信息-香气实测值
        check_user_name: "", // 检查人
        check_user_sign: "",
      },
    ],
    file_list: [
      // {
      //   file_name: "", // 文件名
      //   file_url: "", // 文件链接
      //   note: "", // 备注
      // },
    ],
    status: 0, //单据状态
    act_log: [], //日志信息
    total: 0, // 总样品数
    abnormal: 0, //不合格数
  });

  /** add表单验证规则 */
  const formRules = {
    supplier_id: [
      {
        required: true,
        message: "请选择供应商 ",
      },
    ],
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
    sampling_uid: [
      {
        required: true,
        message: "请选择取样人",
      },
    ],
    pro_date: [
      {
        required: true,
        message: "请选择生产日期",
      },
    ],
    check_date: [
      {
        required: true,
        message: "请选择检验日期",
      },
    ],
    check_uid: [
      {
        required: true,
        message: "请选择检验员",
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
      prop: "check_res",
      valueType: "text",
      renderField: (value) => {
        return typeof value === "number" ? getBasePassLabel(value) : "--";
      },
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
      label: "供应商",
      prop: "supplier_id",
      valueType: "select",
      labelWidth: 90,
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择",
        filterable: true,
      },
      options: getSupList(),
    },
    {
      label: "生产批号",
      prop: "batch_no",
      fieldProps: {
        maxLength: 8,
      },
    },
    {
      label: "取样人",
      prop: "sampling_uid",
      valueType: "select",
      labelWidth: 90,
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择",
        filterable: true,
      },
      options: getUserList(),
    },
    {
      label: "生产日期",
      valueType: "date-picker",
      prop: "pro_date",
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
      label: "检测日期",
      valueType: "date-picker",
      prop: "check_date",
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
    // {
    //   label: "检验结果",
    //   labelWidth: 80,
    //   prop: "check_ret",
    //   valueType: "select",
    //   colProps: {
    //     span: 6,
    //   },
    //   fieldProps: {
    //     disabled: true,
    //     placeholder: " ",
    //   },
    //   options: () => {
    //     return basePassList.map((item) => {
    //       return {
    //         label: item.label,
    //         value: item.value,
    //       };
    //     });
    //   },
    // },
    {
      label: "检验员",
      prop: "check_uid",
      valueType: "select",
      labelWidth: 90,
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择",
        filterable: true,
      },
      options: getUserList(),
    },

    {
      label: "检验员签名",
      prop: "check_user_signature",
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
      label: "复核员签名",
      prop: "reviewer_user_signature",
      labelWidth: 90,
      hideInForm: computed(() => pageType.value !== 3),
      renderField: (value: any) => {
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
  /** 外观及理化检测信息表格配置 */
  const VisualChemicalTestingTablecolumns = ref<TableColumnList>([
    {
      label: "外观",
      prop: "appearance_val",
      slot: "appearance_val",
      minWidth: 140,
      fixed: true,
    },
    {
      label: "色度",
      prop: "color_val",
      slot: "color_val",
      minWidth: 140,
      fixed: true,
      headerRenderer: () => (
        <ul>
          <li>色度</li>
          <li>（比色刻度≥50）</li>
        </ul>
      ),
    },
    {
      label: "Brix(%)",
      prop: "brix_val",
      slot: "brix_val",
      minWidth: 140,
      headerRenderer: () => (
        <ul>
          <li>{tableLableOptions.value?.Brix?.name || "Brix"}</li>
          <li>{tableLableOptions.value?.Brix?.initval}</li>
        </ul>
      ),
    },
    {
      label: "密度",
      prop: "density_val",
      slot: "density_val",
      minWidth: 140,
      headerRenderer: () => (
        <ul>
          <li>{tableLableOptions.value?.density?.name || "pH"}</li>
          <li>{tableLableOptions.value?.density?.initval}</li>
        </ul>
      ),
    },
  ]);
  /** 感官及重金属检测信息表格配置
   * 2024年9月5日 新增 检验员、检验员签名、检验时间
   */
  const SensoryHeavyMetalTestingTablecolumns = ref<TableColumnList>([
    {
      label: "香气",
      prop: "aroma_val",
      slot: "aroma_val",
      minWidth: 140,
      fixed: true,
    },
    {
      label: "口感",
      prop: "taste_val",
      slot: "taste_val",
      minWidth: 140,
      fixed: true,
    },
    {
      label: "重金属(mg/kg)",
      align: "center",
      children: [
        {
          label: "铅",
          prop: "lead_val",
          slot: "lead_val",
          align: "center",
        },
        {
          label: "砷",
          prop: "arsenic_val",
          slot: "arsenic_val",
          align: "center",
        },
      ],
    },
    {
      label: "检验员",
      prop: "check_user_name",
      minWidth: 90,
    },
    {
      label: "检验员签名",
      prop: "check_user_sign",
      slot: "check_user_sign",
      minWidth: 90,
      cellRenderer: ({ row }) => (
        <>
          {row.check_user_sign ? (
            <ElImage
              style="width: 60px; height: 60px"
              src={useSetting.baseHttp + row.check_user_sign}
              preview-src-list={[useSetting.baseHttp + row.check_user_sign]}
              preview-teleported={true}
            />
          ) : (
            <span class="text-gray-400">暂无~</span>
          )}
        </>
      ),
    },
    {
      label: "检验时间",
      prop: "check_time",
      minWidth: 90,
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
    // 外观
    appearance_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          // initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            // let ruleItem: any = tableLableOptions.value["appearance"];
            // isOk = validatorCell(ruleItem, value);
            // initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit) {
              callback(new Error("请填写外观"));
            }
            callback();
          }
        },
      },
    ],
    // 色度
    color_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          // initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["color"];
            isOk = validatorCell(ruleItem, value);
            // initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit) {
              callback(new Error("请填写内压"));
            }
            callback();
          }
        },
      },
    ],
    // Brix
    brix_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["brix"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit) {
              callback(new Error("请填写Brix"));
            }
            callback();
          }
        },
      },
    ],
    // 密度
    density_val: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["density"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit) {
              callback(new Error("请填写密度"));
            }
            callback();
          }
        },
      },
    ],
  });

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
    formColumns,
    VisualChemicalTestingTablecolumns,
    SensoryHeavyMetalTestingTablecolumns,
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
    resetErrorCountMap,
    is_submit,
    tasteOptions,
  };
}
