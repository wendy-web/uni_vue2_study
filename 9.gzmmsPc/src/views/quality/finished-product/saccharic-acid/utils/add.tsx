import { ElImage, FormInstance } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import dayjs from "dayjs";
// 引入获取表头
import { getTabelLabelApi } from "@/api/quality/common/index";
import { QualityCommonModule as CommonModule } from "@/api/quality/common/types";
import { useCommonHooks } from "@/hooks/quality/index";
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useUserStore } from "@/store/modules/user";
import { tr } from "element-plus/es/locale";

const userStore = useUserStore();
const { validatorCell } = useCommonHooks();

interface columnItemType extends CommonModule.InitTabelLabelItem {
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
      item: 11, // 成品糖酸检测报告
      brand,
      sku,
    };
    if (oid) data.oid = oid;
    const result = await getTabelLabelApi(data);
    tableLableOptions.value = result.data;
    // console.log("标准值配置: ", result.data);
  }
  /** 1是新建,2是编辑,3是详情 */
  const pageType = ref(1);
  const editDisabled = computed(() => {
    return pageType.value === 3;
  });
  /** add表单数据 */
  const formData = ref<any>({
    order_no: "", //单据编号
    brand: "", //产品大类
    sku: "", //类型
    batch_no: "", //批次
    check_date: dayjs().format("YYYY-MM-DD"), //检测日期
    check_uid: userStore.uid as number, //检测员id
    check_user_signature: "", // 检验员签字
    check_res: "", //检验结果
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
    check_date: [
      {
        required: true,
        message: "请选择检测日期",
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
  };
  function checkDate(date: string, diffDate: string, type = 1) {
    let isBefore = dayjs(date).isBefore(dayjs(diffDate).format("YYYY-MM-DD"));
    let isAfter = dayjs(date).isAfter(dayjs(diffDate));
    return type === 1 ? isBefore : isAfter;
  }
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
      },
      options: brandOptions,
    },
    {
      label: "产品类型",
      prop: "sku",
      valueType: "select",
      labelWidth: "90",
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择类型",
      },
      // 产品类型要根据 产品大类筛选过滤
      options: filteredSkuOptions,
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
      label: "批次",
      width: 90,
      prop: "batch_no",
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请输入批次",
        maxlength: 8,
      },
    },
    {
      label: "检验结果",
      width: 90,
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
      label: "检测员",
      width: 90,
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
      width: 60,
      fixed: true,
    },
    {
      label: "生产日期",
      prop: "pro_date",
      slot: "pro_date",
      fixed: true,
    },
    {
      label: "时间",
      prop: "check_time",
      slot: "check_time",
    },
    {
      label: "批号",
      prop: "batch_number",
      slot: "batch_number",
    },
    {
      label: "可溶性固形物实测值",
      prop: "soluble_solid_val",
      slot: "soluble_solid_val",
      headerRenderer: () => (
        <>
          <div>可溶性固形物(%,20°)</div>
          <span>({tableLableOptions.value?.soluble_solid.initval})</span>
        </>
      ),
    },
    {
      label: "ph实测值",
      prop: "ph_val",
      slot: "ph_val",
      headerRenderer: () => (
        <>
          <div>pH(25°)</div>
          <span>({tableLableOptions.value?.ph.initval})</span>
        </>
      ),
    },
    {
      label: "检查结果",
      prop: "check_res",
      slot: "check_res",
    },
    {
      label: "备注",
      prop: "note",
      slot: "note",
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

    const croche_height_len = formData.value.brand == "ND2" ? 10 : 3;
    // 新增一行:需要动态取表头里面的字段
    checkTableData.value.push({
      unique_id,
      // pro_date: "",
      // check_time: "",
      // batch_number: "",
      // soluble_solid_val: "",
      // ph_val: "",
      // check_res: "",
      // note: "",
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
    // 检验时间
    check_time: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            // if (is_submit.value) {
            //   callback(new Error("请选择检验时间"));
            // }
            // callback();
            callback(new Error("请选择检验时间"));
          }
        },
      },
    ],
    // 批号
    batch_number: [
      {
        required: true,
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
            // if (is_submit.value) {
            //   callback(new Error("请输入批号"));
            // }
            // callback();
            callback(new Error("请输入批号"));
          }
        },
      },
    ],
    // 可溶性固形物实测值
    soluble_solid_val: [
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
              callback(new Error("请输入可溶性固形物"));
            }
            callback();
          }
        },
      },
    ],
    //  ph实测值
    ph_val: [
      {
        required: is_submit,
        message: "请输入ph实测值",
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
              callback(new Error("请输入ph实测值"));
            }
            callback();
          }
        },
      },
    ],
    // 检验结果
    check_res: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          // console.log("检验结果：", value);
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择检验结果"));
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

  const updateBatchNo = (value: any) => {
    let tableData = checkTableData.value;
    if (tableData.length) {
      let err = 0;
      tableData.forEach((item: any) => {
        item.batch_no = value;
      });
      checkTableData.value = tableData;
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
    handleDelRow,
    checkTableForm,
    checkFormRules,
    passList,
    errorCountMap,
    tableLableOptions,
    updateBatchNo,
    getStatusText,
    fetchSkuOptions,
    filteredSkuOptions,
    validatorCell,
    is_submit,
  };
}
