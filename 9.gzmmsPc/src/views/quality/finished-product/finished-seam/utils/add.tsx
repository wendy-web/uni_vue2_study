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

  const {
    getBrandMap,
    getSkuMap,
    getUserList,
    getStatusText,
    basePassList,
    passList,
    statusOptions,
  } = useselectData();
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
      item: 14, // 成品卷封检验报告
      brand,
      sku,
    };
    if (oid) data.oid = oid;
    const arr: any = [
      {
        type: "selection",
        label: "勾选列",
        fixed: "left",
        hide: () => editDisabled.value,
      },
      {
        label: "#",
        type: "index",
        slot: "index",
        width: 80,
        fixed: true,
      },
      {
        label: "生产日期",
        prop: "pro_date",
        slot: "pro_date",
        minWidth: 160,
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
      // 判断brand 是红牛时候隐藏列
      if (["compactness"].includes(key) && brand === "ND1") {
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
    ];
    let newHeaders = arr.concat(end_arr);
    // 清空当前表头配置
    checkTablecolumns.value.splice(0, checkTablecolumns.value.length);
    // 在下一次 DOM 更新后插入新的表头配置
    nextTick(() => {
      checkTablecolumns.value.splice(0, 0, ...newHeaders);
    });
    console.log("标准值配置: ", checkTablecolumns.value);
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
    check_date: "", //检测日期
    check_uid: userStore.uid as number, // 检验人id
    check_res: "", //检查结果
    check_user_signature: "", // 检验人签字
    reviewer_user_signature: "", // 复检员签名图片
    note: "", // 备注
    check_info: [], // 检测数据信息
    status: 0, //单据状态
    file_list: [], //文件数据
    act_log: [], //日志信息
    total_samples: 0, // 总样品数
    total_abnormal: 0, // 总异常数
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
    check_date: [
      {
        required: true,
        message: "请选择检测日期",
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
      label: "线别",
      prop: "line_id",
      valueType: "select",
      labelWidth: 90,
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择线别",
      },
      options: computed(() => productLineOptions.value),
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
      },
      // 产品类型要根据 产品大类筛选过滤
      options: filteredSkuOptions,
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
      label: "复合员签名",
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
      fixed: "left",
      hide: () => editDisabled.value,
    },
    {
      label: "#",
      type: "index",
      slot: "index",
      width: 80,
      fixed: true,
    },
    {
      label: "生产日期",
      prop: "pro_date",
      slot: "pro_date",
      minWidth: 160,
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
      label: "宽度",
      prop: "weight_val",
      slot: "weight",
      minWidth: 140,
    },
    {
      label: "身钩长度",
      prop: "hook_length_val",
      slot: "hook_length",
      minWidth: 140,
    },
    {
      label: "盖钩长度",
      prop: "cover_hook_length_val",
      slot: "cover_hook_length",
      minWidth: 140,
    },
    {
      label: "迭接长度",
      prop: "overlapping_length_val",
      slot: "overlapping_length",
      minWidth: 140,
    },
    {
      label: "迭接率",
      prop: "overlap_rate_val",
      slot: "overlap_rate",
      minWidth: 140,
    },
    {
      label: "厚度",
      prop: "thickness_val",
      slot: "thickness",
      minWidth: 140,
    },
    {
      label: "盖钩顶隙",
      prop: "cover_hook_top_gap_val",
      slot: "cover_hook_top_gap",
      minWidth: 140,
    },
    {
      label: "罐钩顶隙",
      prop: "can_hook_top_gap_val",
      slot: "can_hook_top_gap",
      minWidth: 140,
    },
    {
      label: "皱纹度",
      prop: "corrugation_val",
      slot: "corrugation",
      minWidth: 140,
    },
    // 战马才显示
    {
      label: "紧密度",
      prop: "compactness_val",
      slot: "compactness",
      minWidth: 140,
      hide: () => formData.value.brand != "ND2",
    },
    {
      label: "检查结果",
      prop: "check_res",
      slot: "check_res",
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
    let unique_id: string = buildUUID();
    let checkTime = initDay.format("HH:mm");
    if (tableData.length) {
      let lastCheckTime = tableData[tableData.length - 1]?.check_time;
      checkTime = dayjs(lastCheckTime, "HH:mm").add(5, "minute").format("HH:mm");
    }

    const { batch_no, pro_date } = formData.value;
    const newRows = [
      {
        unique_id,
        batch_no,
        pro_date,
        check_time: checkTime,
      },
      {
        unique_id: buildUUID(),
        batch_no,
        pro_date,
        check_time: checkTime,
      },
      {
        unique_id: buildUUID(),
        batch_no,
        pro_date,
        check_time: checkTime,
      },
    ];
    // 新增一行:需要动态取表头里面的字段
    checkTableData.value.push(...newRows);
    // console.log("checkTableData.value:", checkTableData.value);
  }
  /** 删除表格的选中行 */
  function handleDelRow(selectedRows: any[]) {
    const groupsToDelete = new Set<number>();
    selectedRows.forEach((row) => {
      const index = checkTableData.value.indexOf(row);
      const groupIndex = Math.floor(index / 3);
      groupsToDelete.add(groupIndex);
    });
    const newData = checkTableData.value.filter((_, index) => {
      const groupIndex = Math.floor(index / 3);
      return !groupsToDelete.has(groupIndex);
    });
    checkTableData.value = newData;
  }
  /** 如果是提交则设为true,表示必填 */
  const is_submit = ref(false);
  /** 检验表格信息 */
  const checkFormRules = reactive({
    // 生产日期
    pro_date: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit) {
              callback(new Error("请选择生产日期"));
            }
            callback();
          }
        },
      },
    ],
    // 时间
    check_time: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择时间"));
            }
            callback();
          }
        },
      },
    ],
    // 批次
    batch_no: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入批次"));
            }
            callback();
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
            // 这里≥4 是因为每次新增3行，合并了部分数据
            if (count.length >= 4) {
              callback(new Error("批号重复"));
            }
            callback();
          } else {
            if (is_submit) {
              callback(new Error("请输入批号"));
            }
            callback();
          }
        },
      },
    ],
    // 宽度
    weight: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["weight"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入内容"));
            }
            callback();
          }
        },
      },
    ],
    // 身钩长度
    hook_length: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["hook_length"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入内容"));
            }
            callback();
          }
        },
      },
    ],
    // 盖钩长度
    cover_hook_length: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["cover_hook_length"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入内容"));
            }
            callback();
          }
        },
      },
    ],
    // 迭接长度
    overlapping_length: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["overlapping_length"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入内容"));
            }
            callback();
          }
        },
      },
    ],
    // 迭接率
    overlap_rate: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["overlap_rate"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入内容"));
            }
            callback();
          }
        },
      },
    ],
    // 厚度
    thickness: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["thickness"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入内容"));
            }
            callback();
          }
        },
      },
    ],
    // 盖钩顶隙
    cover_hook_top_gap: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["cover_hook_top_gap"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入内容"));
            }
            callback();
          }
        },
      },
    ],
    // 罐钩顶隙
    can_hook_top_gap: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["can_hook_top_gap"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入内容"));
            }
            callback();
          }
        },
      },
    ],
    // 皱纹度
    corrugation: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["corrugation"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入内容"));
            }
            callback();
          }
        },
      },
    ],
    // 紧密度
    compactness: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["compactness"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入内容"));
            }
            callback();
          }
        },
      },
    ],
    // 检查结果
    check_res: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          // console.log("检验结果：", value);
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
  // 更新检验信息表格批次
  const updateBatchNo = (value: any) => {
    // 注意：批次从表头带入
    let tableData = checkTableData.value;
    if (tableData.length) {
      tableData.forEach((item: any, index: number) => {
        item.batch_no = value;
      });
      checkTableData.value = tableData;
    }
  };
  // 更新检验信息表格单元格
  const updateGroupData = (index: any, key: string, value: any) => {
    const groupIndex = Math.floor(index / 3);
    const groupStartIndex = groupIndex * 3;
    for (let i = 0; i < 3; i++) {
      checkTableData.value[groupStartIndex + i][key] = value;
    }
  };
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
    updateGroupData,
    is_submit,
  };
}
