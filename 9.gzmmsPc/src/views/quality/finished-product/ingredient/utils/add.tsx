import { ElDatePicker, ElImage, FormInstance } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import dayjs from "dayjs";
// 引入获取表头
import { getProductLineListApi, getTabelLabelApi } from "@/api/quality/common/index";
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

  const { getBrandMap, getSkuMap, getUserList, getStatusText, basePassList, passList } =
    useselectData();
  const brandOptions = getBrandMap();
  const skuOptions = ref<any>([]);
  const fetchSkuOptions = async () => {
    skuOptions.value = await getSkuMap();
  };
  const filteredSkuOptions = computed(() => {
    return skuOptions.value?.filter((item: any) => item?.value.startsWith(formData.value?.brand));
  });
  // 获取
  const tableLableOptions = ref(); // 表头配置
  // 获取表头
  async function initTableClumns({ sku, brand, oid = 0 }: any) {
    const data: any = {
      item: 13, // 13、pH和成分分析检验单
      brand,
      sku,
    };
    if (oid) data.oid = oid;
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
      {
        label: "生产日期",
        prop: "pro_date",
        slot: "pro_date",
        minWidth: 140,
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
        label: "批次",
        prop: "batch_no",
        slot: "batch_no",
        minWidth: 140,
        fixed: true,
      },
      {
        label: "批号",
        prop: "batch_number",
        slot: "batch_number",
        minWidth: 140,
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
      if (item.initval && !["abs", "nm"].includes(key)) {
        columnItem.headerRenderer = () => (
          <>
            <div>{item.name}</div>
            <div>
              ({item.initval}){item.unit}
            </div>
          </>
        );
      }
      // 判断brand 不是红牛时候隐藏列
      if (["taurine", "caffeine"].includes(key) && brand === "ND2") {
        columnItem.hide = true;
      }
      // 根据 key 判断是否可编辑：生成对应可编辑单元格
      arr.push(columnItem);
      arr.sort((a: columnItemType, b: columnItemType) => a.sort - b.sort);
    });
    let end_arr = [
      {
        label: "检查结果",
        prop: "check_res",
        slot: "check_res",
        minWidth: 140,
      },
      {
        label: "备注",
        prop: "note",
        slot: "note",
        minWidth: 140,
      },
    ];

    checkTablecolumns.value = arr.concat(end_arr);
    // console.log("标准值配置: ", arr);
  }
  const productLineOptions = ref();
  // 获取产线列表
  async function initProductLineList() {
    const result = await getProductLineListApi();
    productLineOptions.value = result.data.list.map((item: any) => {
      return { label: item.name, value: item.id };
    });
  }
  /** 1是新建,2是编辑,3是详情 */
  const pageType = ref(1);
  const editDisabled = computed(() => {
    return pageType.value === 3;
  });
  /** add表单数据 */
  const formData = ref<any>({
    order_no: "", //单据编号
    batch_no: "", // 生产批次
    brand: "", //产品大类
    sku: "", //类型
    line_id: "", // 线别id
    check_time: dayjs().format("HH:mm"), // 检查时间
    check_date: "", //检测日期
    abs_avg_val: "", // ABS平均值
    abs_max_val: "", //ABS最大差值
    uv_check_res: "", // uv曲线检测结果；0:不合格；1:合格
    check_uid: userStore.uid as number, // 检验人id
    check_res: "", //检查结果
    check_user_signature: "", // 检验人签字
    uv_graph_img: "", // UV曲线图片地址
    reviewer_user_signature: "", // 复检员签名图片
    note: "", // 备注
    check_info: [], // 检测数据信息
    status: 0, //单据状态
    file_list: [], //文件数据
    act_log: [], //日志信息
    total_samples: 0, // 总样品数
    total_abnorma: 0, // 总异常数
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
    brand: [
      {
        required: true,
        validator: (rule: any, value: string, callback: any) => {
          if (!value) {
            callback(new Error("请选择产品大类"));
          } else {
            callback();
          }
        },
      },
    ],
    sku: [
      {
        required: true,
        message: "请选择产品类型",
      },
    ],
    line_id: [
      {
        required: true,
        message: "请选择线别",
      },
    ],
    check_time: [
      {
        required: true,
        message: "请选择时间",
      },
    ],
    check_date: [
      {
        required: true,
        message: "请选择检测日期",
      },
    ],
    // 需要先判断是否上传uv图片
    uv_check_res: [
      {
        required: true,
        // message: "请选择UV曲线检测结果",
        validator: (rule: any, value: any, callback: any) => {
          if (formData.value.uv_graph_img == "") {
            callback(new Error("请先上传UV曲线图片"));
          }
          if (value === "" || value == null) {
            callback(new Error("请选择UV曲线检测结果"));
          } else {
            callback();
          }
        },
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
      minWidth: 60,
      prop: "batch_no",
      colProps: {
        span: 6,
      },
      fieldProps: {
        maxLength: 8,
      },
    },
    {
      label: "线别",
      prop: "line_id",
      valueType: "select",
      labelWidth: 60,
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择线别",
      },
      options: computed(() => productLineOptions.value),
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
        onChange: (event: any) => {
          disabledSku.value = event ? false : true;
        },
      },
      options: brandOptions,
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
        // disabled: disabledSku.value,
      },
      // 产品类型要根据 产品大类筛选过滤
      options: filteredSkuOptions,
    },
    {
      label: "时间",
      valueType: "time-select",
      prop: "check_time",
      labelWidth: 60,
      fieldProps: {
        placeholder: "请选择时间",
        start: "00:00",
        end: "23:59",
        step: "00:01",
      },
      colProps: {
        span: 6,
      },
    },

    {
      label: "检验结果",
      labelWidth: 90,
      prop: "check_res",
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
      label: "检验员",
      labelWidth: 90,
      prop: "check_uid",
      valueType: "select",
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
      label: "复合员签名",
      prop: "reviewer_user_signature",
      labelWidth: 90,
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
      label: "ABS平均值",
      labelWidth: 90,
      prop: "abs_avg_val",
      colProps: {
        span: 6,
      },
      fieldProps: {
        disabled: true,
      },
    },
    {
      label: "ABS最大差值",
      labelWidth: 100,
      prop: "abs_max_val",
      colProps: {
        span: 6,
      },
      fieldProps: {
        disabled: true,
      },
    },
    {
      label: "uv曲线",
      width: 90,
      prop: "uv_check_res",
      valueType: "select",
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "",
      },
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
  /** 检验信息表格配置 */
  const checkTablecolumns = ref<TableColumnList>([
    {
      type: "selection",
      label: "勾选列",
      selectable: (row: any, index: number) => {
        return index !== 0;
      },
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
      label: "生产日期",
      prop: "pro_date",
      slot: "pro_date",
      minWidth: 140,
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
      label: "批次",
      prop: "batch_no",
      slot: "batch_no",
      minWidth: 140,
      fixed: true,
    },
    {
      label: "批号",
      prop: "batch_number",
      slot: "batch_number",
      minWidth: 140,
    },
    {
      label: "可溶性固形物",
      prop: "soluble_solid_val",
      slot: "soluble_solid",
      minWidth: 140,
    },
    {
      label: "pH（25℃）",
      prop: "ph_val",
      slot: "ph",
      minWidth: 140,
    },
    {
      label: "牛磺酸（mh/L）",
      prop: "taurine_val",
      slot: "taurine",
      minWidth: 140,
      hide: () => formData.value.brand === "ND2",
    },
    {
      label: "咖啡因（mh/L）",
      prop: "caffeine_val",
      slot: "caffeine",
      minWidth: 140,
      hide: () => formData.value.brand === "ND2",
    },
    {
      label: "ABS",
      prop: "abs_val",
      slot: "abs",
      minWidth: 140,
    },
    {
      label: "nm",
      prop: "nm_val",
      slot: "nm",
      minWidth: 140,
    },
    {
      label: "检查结果",
      prop: "check_res",
      slot: "check_res",
      minWidth: 140,
    },
    {
      label: "备注",
      prop: "note",
      slot: "note",
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

    const { batch_no, pro_date } = formData.value;
    let nm_val = tableData.length === 0 ? 271.5 : "";
    // 新增一行:需要动态取表头里面的字段
    checkTableData.value.push({
      unique_id,
      batch_no,
      pro_date,
      nm_val,
      check_time: checkTime,
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
    // 生产日期
    pro_date: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            // if (is_submit.value) {
            //   callback(new Error("请选择生产日期"));
            // }
            // callback();
            callback(new Error("请选择生产日期"));
          }
        },
      },
    ],
    // 时间
    check_time: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            // if (is_submit.value) {
            //   callback(new Error("请选择时间"));
            // }
            // callback();
            callback(new Error("请选择时间"));
          }
        },
      },
    ],
    // 批次
    batch_no: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            // if (is_submit.value) {
            //   callback(new Error("请输入批次"));
            // }
            // callback();
            callback(new Error("请输入批次"));
          }
        },
      },
    ],
    // 批号
    batch_number: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            // 判断列表里的包号是否重复
            let data = checkTableData.value;
            let count = data.filter((item) => item.batch_number === value);
            if (count.length >= 2) {
              callback(new Error("批号重复"));
            }
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入批号"));
            }
            callback();
          }
        },
      },
    ],
    // 可溶性固形物
    soluble_solid: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["soluble_solid"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写可溶性固形物"));
            }
            callback();
          }
        },
      },
    ],
    // pH
    ph: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["ph"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写pH"));
            }
            callback();
          }
        },
      },
    ],
    // 牛磺酸
    taurine: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["taurine"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写牛磺酸"));
            }
            callback();
          }
        },
      },
    ],
    // 咖啡因
    caffeine: [
      {
        required: is_submit,
        message: "请填写咖啡因",
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["caffeine"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写咖啡因"));
            }
            callback();
          }
        },
      },
    ],
    // ABS
    abs: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let firstItem = checkTableData.value[0];
            if (firstItem) {
              let { abs_val } = firstItem;
              isOk = isWithinRange(abs_val, value) ? true : false;
            }
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写ABS"));
            }
            callback();
          }
        },
      },
    ],
    // nm
    nm: [
      {
        required: is_submit,
        message: "请填写nm",
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let firstItem = checkTableData.value[0];
            if (firstItem) {
              let { nm_val } = firstItem;
              isOk = isWithinRange(nm_val, value) ? true : false;
            }
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写nm"));
            }
            callback();
          }
        },
      },
    ],
    // 检查结果
    check_res: [
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
  return {
    pageType,
    editDisabled,
    formData,
    formRules,
    formColumns,
    checkTablecolumns,
    checkTableData,
    tableFormRef,
    fileColumns,
    logColumns,
    handleAdd,
    initTableClumns,
    initProductLineList,
    handleDelRow,
    checkTableForm,
    checkFormRules,
    passList,
    basePassList,
    errorCountMap,
    tableLableOptions,
    updateBatchNo,
    getStatusText,
    fetchSkuOptions,
    filteredSkuOptions,
    validatorCell,
    isWithinRange,
    is_submit,
  };
}
