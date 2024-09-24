import { ElDatePicker, ElImage, FormInstance } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import dayjs from "dayjs";
// 引入获取表头
import { getProductLineListApi, getTabelLabelApi } from "@/api/quality/common/index";
import { QualityCommonModule as CommonModule } from "@/api/quality/common/types";
import { useCommonHooks } from "@/hooks/quality/index";
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useUserStore } from "@/store/modules/user";

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

  const {
    getBrandMap,
    getSkuMap,
    getUserList,
    getStatusText,
    basePassList: passList,
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
      item: 12, // 理化及微生物检验报告
      brand,
      sku,
    };
    if (oid) data.oid = oid;
    const result = await getTabelLabelApi(data);
    tableLableOptions.value = result.data;
    // console.log("标准值配置: ", result.data);
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
    pro_date: "", // 生产日期
    check_date: "", //检测日期
    report_uid: userStore.uid as number, //报告人id
    report_user_signature: "", // 报告人签字
    microbial_check_user_signature: "", // 微生物指标检验员签名图片
    physical_check_user_signature: "", // 理化指标检验员签名图片
    reviewer_user_signature: "", // 审核人签名图片
    net_check_res: "", // 净含量平均值检验结果
    liquid_level_check_res: "", // 液体占比检验结果
    microbe_statistical_date1: "", // 微生物统计日期1
    microbe_statistical_date2: "", // 微生物统计日期2
    check_res: "", //检查结果
    note: "", // 备注
    check_info: [], // 检测数据信息
    status: 0, //单据状态
    file_list: [], //文件数据
    act_log: [], //日志信息
    total_samples: 0, // 总样品数
    total_abnorma: 0, // 总异常数
  });
  /** 如果是提交则设为true,表示必填 */
  const is_submit = ref(false);
  // 签名提交验证需要单独处理
  const signSubmit = ref(false);
  /** add表单验证规则 */
  const formRules = reactive({
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
    pro_date: [
      {
        required: true,
        message: "请选择生产日期",
      },
    ],
    check_date: [
      {
        required: true,
        message: "请选择检测日期",
      },
    ],
    physical_check_user_signature: [
      {
        required: signSubmit,
        message: "请上传理化指标检验员签名图片",
      },
    ],
    microbial_check_user_signature: [
      {
        required: signSubmit,
        message: "请上传微生物指标检验员签名图片",
      },
    ],
    report_uid: [
      {
        required: true,
        message: "请选择报告人",
      },
    ],
  });
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
      label: "线别",
      prop: "line_id",
      valueType: "select",
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择线别",
      },
      options: computed(() => productLineOptions.value),
    },
    {
      label: "生产日期",
      valueType: "date-picker",
      prop: "pro_date",
      labelWidth: 90,
      fieldProps: {
        placeholder: "请选择生产日期",
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
        return passList.map((item) => {
          return {
            label: item.label,
            value: item.value,
          };
        });
      },
    },
    {
      label: "净含量平均值",
      labelWidth: "100px",
      prop: "net_check_res",
      valueType: "select",
      colProps: {
        span: 6,
      },
      fieldProps: {
        disabled: true,
        placeholder: " ",
      },
      options: () => {
        return passList.map((item) => {
          return {
            label: item.label,
            value: item.value,
          };
        });
      },
    },
    {
      label: "液位占比",
      width: 90,
      prop: "liquid_level_check_res",
      valueType: "select",
      colProps: {
        span: 6,
      },
      fieldProps: {
        disabled: true,
        placeholder: " ",
      },
      options: () => {
        return passList.map((item) => {
          return {
            label: item.label,
            value: item.value,
          };
        });
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
      label: "报告人",
      width: 90,
      prop: "report_uid",
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
      label: "理化指标检验员",
      prop: "physical_check_user_signature",
      labelWidth: 130,
      // hideInForm: computed(() => pageType.value !== 3),
      // renderField: (value) => (
      //   <>
      //     {value ? (
      //       <ElImage
      //         style="width: 60px; height: 60px"
      //         src={useSetting.baseHttp + value}
      //         preview-src-list={[useSetting.baseHttp + value]}
      //       />
      //     ) : (
      //       <span class="text-gray-400">暂无~</span>
      //     )}
      //   </>
      // ),
    },
    {
      label: "微生物指标检验员",
      prop: "microbial_check_user_signature",
      labelWidth: 140,
      // hideInForm: computed(() => pageType.value !== 3),
      // renderField: (value) => (
      //   <>
      //     {value ? (
      //       <ElImage
      //         style="width: 60px; height: 60px"
      //         src={useSetting.baseHttp + value}
      //         preview-src-list={[useSetting.baseHttp + value]}
      //       />
      //     ) : (
      //       <span class="text-gray-400">暂无~</span>
      //     )}
      //   </>
      // ),
    },
    {
      label: "报告人签名图片",
      prop: "report_user_signature",
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
      width: 80,
      fixed: true,
    },
    {
      label: "检验时间",
      prop: "check_time",
      slot: "check_time",
      minWidth: 140,
      fixed: true,
    },
    {
      label: "批次",
      prop: "batch_no",
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
      label: "理化指标",
      align: "center",
      children: [
        {
          label: "重量(g)", // 标准值
          prop: "phys_weight_val",
          slot: "phys_weight_val",
          minWidth: 120,
          headerRenderer: () => (
            <>
              <div>重量(g)</div>
              <span>({tableLableOptions.value?.phys_weight.initval})</span>
            </>
          ),
        },
        {
          label: "净含量(ml)", // 标准值
          prop: "phys_net_val",
          slot: "phys_net_val",
          minWidth: 120,
          headerRenderer: () => (
            <>
              <div>净含量(ml)</div>
              <span>({tableLableOptions.value?.phys_net.initval})</span>
            </>
          ),
        },
        {
          label: "内压(Mpa)", // 标准值
          prop: "phys_internal_pressure_val",
          slot: "phys_internal_pressure_val",
          minWidth: 120,
          headerRenderer: () => (
            <>
              <div>内压(Mpa)</div>
              <span>({tableLableOptions.value?.phys_internal_pressure.initval})</span>
            </>
          ),
        },
      ],
    },
    {
      label: "感官指标",
      align: "center",
      children: [
        {
          label: "色泽",
          prop: "sense_color_res",
          slot: "sense_color_res",
          minWidth: 120,
        },
        {
          label: "滋味和气味",
          prop: "sense_smell_res",
          slot: "sense_smell_res",
          minWidth: 120,
        },
        {
          label: "外观",
          prop: "sense_appearance_res",
          slot: "sense_appearance_res",
          minWidth: 120,
        },
        {
          label: "杂质",
          prop: "sense_impurity_res",
          slot: "sense_impurity_res",
          width: 120,
        },
      ],
    },
    {
      label: "微生物指标",
      align: "center",
      children: [
        {
          label: "",
          prop: "microbe_statistical_date1",
          slot: "microbe_statistical_date1",
          minWidth: 280,
          renderHeader: (data) => {
            return h("div", { style: "display: flex; align-items: center;" }, [
              h("span", { style: "margin-right: 10px;flex-shrink: 0;" }, "统计时间"),
              h(ElDatePicker, {
                modelValue: formData.value.microbe_statistical_date1,
                "onUpdate:modelValue": (value) =>
                  (formData.value.microbe_statistical_date1 = value),
                type: "datetime",
                placeholder: "选择日期时间",
                disabledDate: disabledDate,
                format: "YYYY-MM-DD",
                valueFormat: "YYYY-MM-DD",
                // format: "YYYY-MM-DD HH:mm:ss",
                // valueFormat: "YYYY-MM-DD HH:mm:ss",
              }),
            ]);
          },
          children: [
            {
              label: "M-endo培养基",
              headerRenderer: () => (
                <>
                  <div>M-endo培养基</div>
                  <div>(37°C,24H)</div>
                </>
              ),
              children: [
                {
                  label: "大肠杆菌", // 标准值
                  prop: "microbe_coliform_bacteria_val",
                  slot: "microbe_coliform_bacteria_val",
                  width: 140,
                  headerRenderer: () => (
                    <>
                      <div>大肠杆菌</div>
                      <span>({tableLableOptions.value?.microbe_coliform_bacteria.initval})</span>
                    </>
                  ),
                },
              ],
            },
            {
              label: "PCA培养基",
              headerRenderer: () => (
                <>
                  <div>PCA培养基</div>
                  <div>(37°C,24H)</div>
                </>
              ),
              children: [
                {
                  label: "细菌总数", // 标准值
                  prop: "microbe_bacterial_val",
                  slot: "microbe_bacterial_val",
                  width: 140,
                  headerRenderer: () => (
                    <>
                      <div>细菌总数</div>
                      <span>({tableLableOptions.value?.microbe_bacterial.initval})</span>
                    </>
                  ),
                },
              ],
            },
          ],
        },
        {
          label: "统计时间2",
          prop: "microbe_statistical_date2",
          slot: "microbe_statistical_date2",
          minWidth: 200,
          renderHeader: (data) => {
            return h("div", { style: "display: flex; align-items: center;" }, [
              h("span", { style: "margin-right: 10px;flex-shrink: 0;" }, "统计时间"),
              h(ElDatePicker, {
                modelValue: formData.value.microbe_statistical_date2,
                "onUpdate:modelValue": (value) =>
                  (formData.value.microbe_statistical_date2 = value),
                type: "datetime",
                placeholder: "选择日期时间",
                disabledDate: disabledDate,
                format: "YYYY-MM-DD",
                valueFormat: "YYYY-MM-DD",
                // format: "YYYY-MM-DD HH:mm:ss",
                // valueFormat: "YYYY-MM-DD HH:mm:ss",
              }),
            ]);
          },
          children: [
            {
              label: "MEA培养基",
              headerRenderer: () => (
                <>
                  <div>MEA培养基</div>
                  <div>(25°C,48H)</div>
                </>
              ),
              children: [
                {
                  label: "酵母菌", // 标准值
                  prop: "microbe_saccharomyces_val",
                  slot: "microbe_saccharomyces_val",
                  width: 140,
                  headerRenderer: () => (
                    <>
                      <div>酵母菌</div>
                      <span>({tableLableOptions.value?.microbe_saccharomyces.initval})</span>
                    </>
                  ),
                },
                {
                  label: "霉菌", // 标准值
                  prop: "microbe_mold_val",
                  slot: "microbe_mold_val",
                  width: 140,
                  headerRenderer: () => (
                    <>
                      <div>霉菌</div>
                      <span>({tableLableOptions.value?.microbe_mold.initval})</span>
                    </>
                  ),
                },
              ],
            },
          ],
        },
      ],
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
    let checkTime = initDay.format("HH:mm");
    let unique_id: string = buildUUID();
    if (tableData.length) {
      let lastCheckTime = tableData[tableData.length - 1]?.check_time;
      checkTime = dayjs(lastCheckTime, "HH:mm").add(5, "minute").format("HH:mm");
    }

    const { batch_no, pro_date } = formData.value;
    // 新增一行:需要动态取表头里面的字段
    checkTableData.value.push({
      unique_id,
      batch_no,
      pro_date,
    });
    // console.log("checkTableData.value:", checkTableData.value);
  }
  /** 删除表格的选中行 */
  function handleDelRow(ids: any) {
    checkTableData.value = checkTableData.value.filter((item) => {
      return !ids.includes(item.id || item.unique_id);
    });
  }

  /** 检验表格信息 */
  const checkFormRules = reactive({
    // 检验时间
    check_time: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit) {
              callback(new Error("请选择检验时间"));
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
            if (count.length >= 2) {
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
    // 理化-重量
    phys_weight_val: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["phys_weight"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写重量"));
            }
            callback();
          }
        },
      },
    ],
    // 理化-净含量
    phys_net_val: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["phys_net"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写净含量"));
            }
            callback();
          }
        },
      },
    ],
    // 理化-内压
    phys_internal_pressure_val: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["phys_internal_pressure"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写内压"));
            }
            callback();
          }
        },
      },
    ],
    // 感官-色泽
    sense_color_res: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择色泽结果"));
            }
            callback();
          }
        },
      },
    ],
    // 感官-气味
    sense_smell_res: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择气味结果"));
            }
            callback();
          }
        },
      },
    ],
    // 感官-外观
    sense_appearance_res: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择外观结果"));
            }
            callback();
          }
        },
      },
    ],
    // 感官-杂质
    sense_impurity_res: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择杂质结果"));
            }
            callback();
          }
        },
      },
    ],
    // 微生物-大肠杆菌
    microbe_coliform_bacteria_val: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["microbe_coliform_bacteria"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写大肠杆菌数值"));
            }
            callback();
          }
        },
      },
    ],
    // 微生物-细菌
    microbe_bacterial_val: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["microbe_bacterial"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写细菌总数"));
            }
            callback();
          }
        },
      },
    ],
    // 微生物-酵母菌
    microbe_saccharomyces_val: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["microbe_saccharomyces"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写酵母菌数"));
            }
            callback();
          }
        },
      },
    ],
    // 微生物-霉菌
    microbe_mold_val: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["microbe_mold"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写霉菌数"));
            }
            callback();
          }
        },
      },
    ],
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

  const updateBatchNo = (value: any) => {
    let tableData = checkTableData.value;
    if (tableData.length) {
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
    initProductLineList,
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
    signSubmit,
  };
}
