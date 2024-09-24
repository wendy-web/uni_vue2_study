import { ElDatePicker, ElImage, FormInstance } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import dayjs from "dayjs";
// 引入获取表头、检测依据下拉接口
import { getInspMapApi, getTabelLabelApi } from "@/api/quality/common/index";
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
    statusOptions
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
      item: 10, // 液体糖检验报告
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
    batch_no: "", // 生产批次
    inspection_basis_id: "", // 检测依据id
    inspection_basis_name: "", // 检测依据名称
    pro_date: "", // 生产日期
    check_date: "", //检测日期
    report_uid: userStore.uid as number, //报告人id
    report_user_signature: "", // 报告人签字
    reviewer_user_signature: "", // 审核人签名图片
    check_res: "", //检查结果
    note: "", // 备注
    check_info: [], // 检测数据信息
    status: 0, //单据状态
    file_list: [], //文件数据
    act_log: [], //日志信息
    // total_samples: 0, // 总样品数
    total_abnorma: 0, // 不合格数
    check_view: "", // 检验意见
  });

  /** add表单验证规则 */
  const formRules = {
    batch_no: [
      {
        required: true,
        message: "请输入批号",
      },
    ],

    inspection_basis_name: [
      {
        required: true,
        message: "请选择检测依据",
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
  };
  function checkDate(date: string, diffDate: string, type = 1) {
    let isBefore = dayjs(date).isBefore(dayjs(diffDate).format("YYYY-MM-DD"));
    let isAfter = dayjs(date).isAfter(dayjs(diffDate));
    return type === 1 ? isBefore : isAfter;
  }
  //   检验依据下拉选项
  const yijuOptions = ref([]);
  const querySearchYiju = (queryString: string, cb: any) => {
    getInspMapApi({ is_open: 1, name: queryString })
      .then((result) => {
        yijuOptions.value = result.data.map((item: any) => {
          return {
            label: item.id,
            value: item.name,
          };
        });

        cb(yijuOptions.value);
      })
      .catch((error) => {
        console.log("querySearchYiju异步获取数据报错了：", error);
      });
  };
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
      label: "批号",
      minWidth: 60,
      prop: "batch_no",
      colProps: {
        span: 6,
      },
    },

    {
      label: "检测依据",
      labelWidth: 90,
      prop: "inspection_basis_name",
      valueType: "autocomplete",
      fieldProps: {
        clearable: true,
        fetchSuggestions: querySearchYiju,
        onSelect: (event: any) => {
          formData.value.inspection_basis_id = event.label;
          console.log("检验依据onSelect:", event);
        },
        onBlur: (event: any) => {
          if (!formData.value.inspection_basis_id || !yijuOptions.value.length) {
            formData.value.inspection_basis_name = "";
          }
        },
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
      label: "复核员签名",
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
  interface tableItemType {
    /** 感官检测 - 色值 */
    sense_color_val: string;
    /** 感官检测 - 气味 */
    sense_smell_val: string;
    /** 感官检测 - 杂质 */
    sense_impurity_val: string;
    /** 感官检测 - 形态 */
    sense_morphology_val: string;
    /** 感官检测结果 - 色值 */
    sense_color_res: number;
    /** 感官检测结果 - 气味 */
    sense_smell_res: number;
    /** 感官检测结果 - 杂质 */
    sense_impurity_res: number;
    /** 感官检测结果 - 形态 */
    sense_morphology_res: number;
    /** 感官检测人员签名 */
    sense_check_user_signature: string;
    /** 固含量检测人员签名 */
    solid_check_user_signature: string;
    /** 微生物检测人员签名 */
    microbe_check_user_signature: string;
    /** 固含量检测值 */
    solid_content_val: number;
    /** 干物质中蔗糖含量检测值 */
    sucrose_in_dry_matter_val: number;
    /** 还原糖含量检测值 */
    reduced_sugars_matter_val: number;
    /** pH值检测值 */
    ph_val: number;
    /** 色值检测值 */
    color_val: number;
    /** 电导率检测值 */
    electric_conductivity_val: number;
    /** 浊度检测值 */
    turbidity_val: number;
    /** 固含量检测结果 */
    solid_content_res: number;
    /** 干物质中蔗糖含量检测结果 */
    sucrose_in_dry_matter_res: number;
    /** 还原糖含量检测结果 */
    reduced_sugars_matter_res: number;
    /** pH值检测结果 */
    ph_res: number;
    /** 色值检测结果 */
    color_res: number;
    /** 电导率检测结果 */
    electric_conductivity_res: number;
    /** 浊度检测结果 */
    turbidity_res: number;
    /** 微生物检测 - 大肠菌群检测值 */
    microbe_coliform_bacteria_val: number;
    /** 微生物检测 - 酵母菌检测值 */
    microbe_saccharomyces_val: number;
    /** 微生物检测 - 霉菌检测值 */
    microbe_mold_val: number;
    /** 微生物检测 - 总菌落数检测值 */
    microbe_total_colony_val: number;
    /** 微生物检测结果 - 大肠菌群 */
    microbe_coliform_bacteria_res: number;
    /** 微生物检测结果 - 酵母菌 */
    microbe_saccharomyces_res: number;
    /** 微生物检测结果 - 霉菌 */
    microbe_mold_res: number;
    /** 微生物检测结果 - 总菌落数 */
    microbe_total_colony_res: number;
    /** 检测结论 */
    conclusion: string;
    /** 备注 */
    note: string;
  }
  const tableItem = ref<tableItemType>({} as tableItemType);

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
  function handleDelRow(index: any) {
    checkTableData.value.splice(index, 1);
  }
  /** 如果是提交则设为true,表示必填 */
  const is_submit = ref(false);
  /** 检验表格信息 */
  const checkFormRules = {
    // 色泽
    sense_color_val: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入感官指标-色泽测定值"));
            }
            callback();
          }
        },
      },
    ],
    // 色泽结果
    sense_color_res: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择感官指标-色泽单项判定"));
            }
            callback();
          }
        },
      },
    ],
    // 滋味和气味
    sense_smell_val: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入感官指标-滋味和气味测定值"));
            }
            callback();
          }
        },
      },
    ],
    sense_smell_res: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择感官指标-滋味和气味单项判定"));
            }
            callback();
          }
        },
      },
    ],
    // 组织形态
    sense_morphology_val: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入感官指标-组织形态测定值"));
            }
            callback();
          }
        },
      },
    ],
    sense_morphology_res: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择感官指标-组织形态单项判定"));
            }
            callback();
          }
        },
      },
    ],
    // 杂质
    sense_impurity_val: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入感官指标-杂质测定值"));
            }
            callback();
          }
        },
      },
    ],
    sense_impurity_res: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择感官指标-杂质单项判定"));
            }
            callback();
          }
        },
      },
    ],
    // 干物质（固形物）含量
    solid_content_val: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            // let ruleItem: any = tableLableOptions.value["solid_content"];
            // isOk = validatorCell(ruleItem, value);
            // initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入干物质（固形物）含量测定值"));
            }
            callback();
          }
        },
      },
    ],
    solid_content_res: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择干物质（固形物）含量单项判定"));
            }
            callback();
          }
        },
      },
    ],
    // 干物质中蔗糖分
    sucrose_in_dry_matter_val: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入干物质中蔗糖分测定值"));
            }
            callback();
          }
        },
      },
    ],
    sucrose_in_dry_matter_res: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择干物质中蔗糖分单项判定"));
            }
            callback();
          }
        },
      },
    ],
    // 干物质中还原糖分
    reduced_sugars_matter_val: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入干物质中还原糖分测定值"));
            }
            callback();
          }
        },
      },
    ],
    reduced_sugars_matter_res: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择干物质中还原糖分单项判定"));
            }
            callback();
          }
        },
      },
    ],
    // pH
    ph_val: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入pH测定值"));
            }
            callback();
          }
        },
      },
    ],
    ph_res: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择pH单项判定"));
            }
            callback();
          }
        },
      },
    ],
    // 色值
    color_val: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入色值测定值"));
            }
            callback();
          }
        },
      },
    ],
    color_res: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择色值单项判定"));
            }
            callback();
          }
        },
      },
    ],
    // 电导率
    electric_conductivity_val: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入电导率测定值"));
            }
            callback();
          }
        },
      },
    ],
    electric_conductivity_res: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择电导率单项判定"));
            }
            callback();
          }
        },
      },
    ],
    // 混浊度
    turbidity_val: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入混浊度测定值"));
            }
            callback();
          }
        },
      },
    ],
    turbidity_res: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择混浊度单项判定"));
            }
            callback();
          }
        },
      },
    ],
    // 微生物-细菌总数
    microbe_total_colony_val: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入微生物-细菌总数测定值"));
            }
            callback();
          }
        },
      },
    ],
    microbe_total_colony_res: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择微生物-细菌总数单项判定"));
            }
            callback();
          }
        },
      },
    ],
    // 微生物-大肠菌群
    microbe_coliform_bacteria_val: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入微生物-大肠菌群测定值"));
            }
            callback();
          }
        },
      },
    ],
    microbe_coliform_bacteria_res: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择微生物-大肠菌群单项判定"));
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
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入微生物-酵母菌测定值"));
            }
            callback();
          }
        },
      },
    ],
    microbe_saccharomyces_res: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择微生物-酵母菌单项判定"));
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
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入微生物-霉菌测定值"));
            }
            callback();
          }
        },
      },
    ],
    microbe_mold_res: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择微生物-霉菌单项判定"));
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
    tableItem,
    useSetting,
    is_submit,
  };
}
