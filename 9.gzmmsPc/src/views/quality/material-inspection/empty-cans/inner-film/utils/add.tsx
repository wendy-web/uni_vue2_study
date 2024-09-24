import { FormInstance } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import dayjs from "dayjs";
// 引入获取表头
import { getTabelLabelApi } from "@/api/quality/common/index";
import {
  QualityCommonModule as CommonModule,
  SelectStringOpions,
} from "@/api/quality/common/types";
// 下拉框的公共接口
import { getInnercoatingInitApi } from "@/api/quality/material-inspection/inner-film/index";
import { InnerFilmModule } from "@/api/quality/material-inspection/inner-film/types";
import { useCommonHooks } from "@/hooks/quality/index";
import { useselectData } from "@/hooks/quality/selectData";
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();
const { validatorCell } = useCommonHooks();
const { statusOptions, basePassList } = useselectData();

interface columnItemType extends CommonModule.InitTabelLabelItem {
  label: string;
  prop: string;
  minWidth?: number;
  headerRenderer?: any;
  [key: string]: any;
}

export function useAdd() {
  const BaseData = ref<InnerFilmModule.InnerFilmInitOptions>(); // 获取公共下拉框数据配置
  const checkUserOptions = ref<CommonModule.seletcOptionItem[]>([]); // 检查员 下拉选项
  const brandOptions = ref<CommonModule.seletcOptionItem[]>([]); // 产品大类 下拉选项
  const checkResultOptions = ref<CommonModule.seletcOptionItem[]>([]); // 检验结果 下拉选项
  const tableLableOptions = ref<any>(); // 表头配置
  const sizeOptions = ref<CommonModule.seletcOptionItem[]>([]); // 空罐尺寸下拉选项
  const versionOptions = ref<CommonModule.seletcOptionItem[]>([]); // 版本下拉选项
  const reagentOptions = ref<CommonModule.seletcOptionItem[]>([]); // 检测试剂下拉选项
  const lineOptions = ref<CommonModule.seletcOptionItem[]>([]); // 空罐线别下拉选项
  const supplyOptions = ref<CommonModule.seletcOptionItem[]>([]); // 供应商下拉选项
  const suppliersMap = ref({}); // 供应商map数据
  // 单元列表头子项目
  const cellColumns = ref([]);
  // 获取公共下拉框数据配置
  async function initBaseData() {
    const result = await getInnercoatingInitApi();
    BaseData.value = result.data;
    checkUserOptions.value = result.data.check_user_list.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    // 添加当前登录用户
    if (checkUserOptions.value.findIndex((item) => item.value === userStore.uid) === -1) {
      checkUserOptions.value.unshift({ label: userStore.nickname, value: userStore.uid });
    }
    brandOptions.value = result.data.brand_data.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    checkResultOptions.value = result.data.check_init.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    sizeOptions.value = result.data.size_init.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    versionOptions.value = result.data.version.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    reagentOptions.value = result.data.reagent_init.map((item) => {
      return {
        label: item.name,
        value: Number(item.id),
      };
    });
    lineOptions.value = result.data.line_init.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    supplyOptions.value = result.data.print_factor.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    suppliersMap.value = result.data.print_factor.reduce((map, supplier) => {
      map[supplier.id] = supplier.name;
      return map;
    }, {} as any);
  }
  // 获取表头
  async function initTableClumns({ sku, oid = 0 }: any) {
    const data: any = {
      item: 2,
      sku,
    };
    if (oid) data.oid = oid;
    const arr: any = [
      {
        label: "Lot No.（包号）",
        prop: "pack_no",
        width: 100,
      },
    ];
    const result = await getTabelLabelApi(data);
    tableLableOptions.value = result.data;
    // console.log("keys: ", Object.keys(result.data));
    Object.entries(result.data).forEach(([keys, item]) => {
      let {
        key,
        name,
        sort,
        child,
        initval,
        type,
        lower_limit_val,
        upper_limit_val,
        error_limit_val,
        value,
        unit,
      } = item;
      let columnItem: columnItemType = {
        label: name,
        prop: key,
        minWidth: 140,
        slot: key,
        key,
        name,
        sort,
        child,
        initval,
        check_type: type,
        lower_limit_val,
        upper_limit_val,
        error_limit_val,
        value,
        class_name: "", // 如有异常数据，高亮标红 table-input-danger
        unit,
      };
      // if (item.initval) {
      //   columnItem.minWidth = 180;
      //   columnItem.headerRenderer = () => (
      //     <>
      //       <div>{item.name}</div>
      //       <div>
      //         ({item.initval}){item.unit}
      //       </div>
      //     </>
      //   );
      // }
      // 根据 key 判断是否可编辑：生成对应可编辑单元格
      arr.push(columnItem);
      arr.sort((a: columnItemType, b: columnItemType) => a.sort - b.sort);
    });

    cellColumns.value = arr;
    // console.log("arr: ", arr);
  }
  /** 1是新建,2是编辑 */
  const pageType = ref(1);
  const editDisabled = computed(() => {
    return pageType.value === 3;
  });
  /** add表单数据 */
  const formData = ref({
    order_no: "", //单据编号
    sku: "ND1-1", //产品类型
    batch_no: "", //生产批号
    check_date: dayjs().format("YYYY-MM-DD"), //检验日期
    sample_date: dayjs().format("YYYY-MM-DD"), //样品日期
    size_id: "", //尺寸id
    version_id: "", //版本id
    version_name: "", //版本名称
    reagent_id: "", //检测试剂
    line_id: "", // 空罐线别
    supplier_id: "", // 供应商id
    supplier_name: "", // 供应商名称
    check_user_id: userStore.uid as number, //检验员id
    check_user_name: userStore.nickname, //检验员名称
    check_sign: "", // 检验员签字
    check_ret: 3 as FormNumType, //检验结果
    recheck: [], // 复检信息
    ct_name: "", // 创建人
    remark: "", // 备注
    checkinfo: [], // 检测数据信息
    total: 0, // 总检查项
    abnormal: 0, // 异常数
    brand: "ND1", //产品大类
    status: 0, //单据状态

    files: [], //文件数据
    logs: [], //日志信息
    create_time: "",

    line_text: "",
    ct_uid: undefined as FormNumType,
    dept_id: undefined as FormNumType,
    reagent_text: "",
    size_text: "",
    sku_name: "",
    brand_name: "",
    check_remark: "",
    check_ret_text: "",
  });

  /** 如果是提交则设为true,表示必填 */
  const is_submit = ref(false);

  /** add表单验证规则 */
  const formRules = {
    sku: [
      {
        required: true,
        message: "请选择产品类型",
      },
    ],
    batch_no: [
      {
        required: true,
        message: "请输入生产批号",
      },
    ],
    check_date: [
      {
        required: true,
        message: "请选择检验日期",
      },
    ],
    sample_date: [
      {
        required: true,
        message: "请选择样品日期",
      },
    ],
    size_id: [
      {
        required: true,
        message: "请选择空罐尺寸",
      },
    ],
    version_id: [
      {
        required: true,
        message: "请选择版本",
      },
    ],
    reagent_id: [
      {
        required: true,
        message: "请选择检测试剂",
      },
    ],
    line_id: [
      {
        required: true,
        message: "请选择空罐线别",
      },
    ],
    supplier_id: [
      {
        required: true,
        message: "请选择供应商",
      },
    ],
    check_user_id: [
      {
        required: true,
        message: "请选择检验员",
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
      colProps: {
        span: 6,
      },
      fieldProps: computed(() => ({ disabled: true })),
      hideInForm: computed(() => (formData.value.order_no ? false : true)),
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
        placeholder: "请选择产品类型",
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
      label: "生产批号",
      width: 90,
      prop: "batch_no",
      colProps: {
        span: 6,
      },
    },
    {
      label: "检验日期",
      valueType: "date-picker",
      prop: "check_date",
      labelWidth: 90,
      fieldProps: {
        placeholder: "请选择检验日期",
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
      label: "样品日期",
      valueType: "date-picker",
      prop: "sample_date",
      labelWidth: 90,
      fieldProps: {
        placeholder: "请选择样品日期",
        type: "date",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      },
      colProps: {
        span: 6,
      },
    },
    {
      label: "空罐尺寸",
      prop: "size_id",
      valueType: "select",
      labelWidth: "90",
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择",
        filterable: true,
      },
      options: computed(() => sizeOptions.value),
    },
    {
      label: "版本",
      prop: "version_id",
      valueType: "select",
      labelWidth: "90",
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择",
        filterable: true,
      },
      options: computed(() => versionOptions.value),
    },
    {
      label: "检测试剂",
      prop: "reagent_id",
      valueType: "select",
      labelWidth: "90",
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择",
        filterable: true,
      },
      options: computed(() => reagentOptions.value),
    },
    {
      label: "空罐线别",
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
      options: computed(() => lineOptions.value),
    },
    {
      label: "供应商",
      prop: "supplier_id",
      valueType: "select",
      labelWidth: "90",
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择",
        filterable: true,
      },
      options: computed(() => supplyOptions.value),
    },
    {
      label: "检验员",
      width: 90,
      prop: "check_user_id",
      valueType: "select",
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择",
        filterable: true,
      },
      options: computed(() => checkUserOptions.value),
    },
    {
      label: "检验员签字",
      prop: "check_sign",
      labelWidth: 90,
      valueType: "img",
      colProps: {
        span: 6,
      },
      hideInForm: computed(() => (formData.value.check_sign ? false : true)),
    },
    {
      label: "检验结果",
      width: 90,
      prop: "check_ret",
      valueType: "select",
      colProps: {
        span: 6,
      },
      // fieldProps: {
      //   placeholder: "请选择",
      // },
      // options: computed(() => {
      //   // 下拉选项 通过公共接口返回
      //   return checkResultOptions.value;
      // }),
      options: basePassList,
      fieldProps: {
        disabled: true,
      },
      tooltip: "自动判断: 合格,不合格,部分合格",
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
      },
      options: computed(() => {
        // 产品大类 通过公共接口返回
        return brandOptions.value;
      }),
    },
    {
      label: "单据状态",
      width: 90,
      prop: "status",
      valueType: "select",
      colProps: {
        span: 6,
      },
      fieldProps: computed(() => ({ disabled: true, placeholder: "请选择" })),
      options: computed(() => {
        // 下拉选项 通过公共接口返回
        return statusOptions;
      }),
    },
    {
      label: "制单人",
      width: 90,
      prop: "ct_name",
      colProps: {
        span: 6,
      },
      fieldProps: computed(() => ({ disabled: true })),
      hideInForm: computed(() => (formData.value.ct_name ? false : true)),
    },
    {
      label: "创建时间",
      width: 90,
      prop: "create_time",
      colProps: {
        span: 6,
      },
      fieldProps: computed(() => ({ disabled: true })),
      hideInForm: computed(() => (formData.value.create_time ? false : true)),
    },
    {
      label: "复合员签名",
      prop: "recheck",
      labelWidth: 90,
      valueType: "img",
      colProps: {
        span: 6,
      },
      hideInForm: computed(() => (formData.value.recheck?.length ? false : true)),
    },
    {
      label: "备注",
      prop: "remark",
      colProps: {
        span: 24,
      },
      valueType: "textarea",
      fieldProps: {
        // maxlength: 10,
        showWordLimit: true,
        autosize: { minRows: 2, maxRows: 4 },
      },
    },
  ];
  /** 其他检验表格 */
  const otherTableColumns = ref<TableColumnList>([
    {
      label: "焊缝完整性实验检测",
      prop: "weld_seam_ret",
      slot: "weld_seam_ret",
      width: 200,
    },
    {
      label: "电流检测",
      prop: "electric_ret",
      slot: "electric_ret",
      width: 200,
    },
    {
      label: "墨码试机",
      prop: "code_ret",
      slot: "code_ret",
      width: 200,
      hide: () => (formData.value.sku === "ND1-1" ? false : true),
    },
    {
      label: "底盖蓝底检测",
      prop: "end_ret",
      slot: "end_ret",
      width: 200,
      hide: () => (formData.value.sku === "ND1-1" ? false : true),
    },
    {
      label: "启破力检测",
      prop: "open_ret",
      slot: "open_ret",
      width: 200,
      hide: () => (formData.value.sku === "ND1-2" ? false : true),
    },
  ]);
  /** 其他检验表格数据 */
  const otherTableData = ref([
    {
      weld_seam_ret: "", //焊缝完整性实验检测结果
      electric_ret: "", //电流检测结果
      code_ret: "", //墨码检测结果（普通型）
      end_ret: "", //底盖蓝底检测结果（普通型）
      open_ret: "", // 启破力检测结果（强化型）
    },
  ]);
  /** 其他检验表单 */
  const otherCheckForm = ref({
    weld_seam_ret: "", //焊缝完整性实验检测结果
    electric_ret: "", //电流检测结果
    code_ret: "", //墨码检测结果（普通型）
    end_ret: "", //底盖蓝底检测结果（普通型）
    open_ret: "", // 启破力检测结果（强化型）
  });
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
      label: "序号",
      type: "index",
      fixed: "left",
      width: 60,
    },
    {
      label: "时间",
      prop: "check_time",
      width: 140,
      slot: "check_time",
      fixed: "left",
    },
    {
      label: "单元",
      prop: "cell_column",
      width: 180,
      slot: "cell_column",
      fixed: "left",
    },
    {
      label: "1",
      prop: "value_1",
      width: 140,
      slot: "value_1",
    },
    {
      label: "2",
      prop: "value_2",
      width: 140,
      slot: "value_2",
    },
    {
      label: "3",
      prop: "value_3",
      width: 140,
      slot: "value_3",
    },
    {
      label: "4",
      prop: "value_4",
      width: 140,
      slot: "value_4",
    },
    {
      label: "5",
      prop: "value_5",
      width: 140,
      slot: "value_5",
    },
    {
      label: "6",
      prop: "value_6",
      width: 140,
      slot: "value_6",
    },
    {
      label: "7",
      prop: "value_7",
      width: 140,
      slot: "value_7",
    },
    {
      label: "8",
      prop: "value_8",
      width: 140,
      slot: "value_8",
    },
    {
      label: "彩印铁厂家",
      prop: "print_factor_id",
      slot: "print_factor_id",
      minWidth: 150,
    },
    {
      label: "检验结果",
      prop: "check_ret",
      slot: "check_ret",
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
    // 先判定批次号是否填写，表格数据的批号同步更新
    let batch_no = formData.value.batch_no;
    if (!batch_no) {
      ElMessage.warning("请先填写生产批号");
      return;
    }
    let tableData = checkTableData.value;

    let initDay = dayjs();
    // 判断是否有数据
    let checkTime = initDay.format("HH:mm");
    let unique_id: string = buildUUID();
    if (tableData.length) {
      let lastCheckTime = tableData[tableData.length - 1]?.check_time;
      if (lastCheckTime) {
        checkTime = dayjs(lastCheckTime, "HH:mm").add(5, "minute").format("HH:mm");
      }
    }
    // 新增一行:需要动态取表头里面的字段
    checkTableData.value.push({
      unique_id,
      check_time: checkTime,
      batch_no,
      check_json: Array.from({ length: 8 }, (_, index) => {
        return {
          key: index + 1,
          pack_no: "",
          electric: "",
          open: "",
        };
      }),
      print_factor_id: "",
      print_factor: "",
      check_ret: -1,
    });
    console.log("checkTableData.value:", checkTableData.value);
  }
  /** 删除表格的选中行 */
  function handleDelRow(row: any) {
    let ids = row.map((item: any) => item.unique_id || item.id);
    console.log("ids:", ids);
    checkTableData.value = checkTableData.value.filter(
      (item) => !ids.includes(item.unique_id || item.id),
    );
  }
  /** 通用选择是否合格列表 */
  const passList = [
    {
      id: 1,
      name: "合格",
    },
    {
      id: 0,
      name: "不合格",
    },
  ];
  /** 检验表格信息 */
  const checkFormRules = {
    check_time: [
      {
        required: is_submit.value,
        message: "请选择时间",
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择检测时间"));
            }
            callback();
          }
        },
      },
    ],
    pack_no: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            // 判断列表里的包号是否重复
            let data = checkTableData.value;
            let total = 0;
            data.forEach((item) => {
              item.check_json.forEach((itm: any) => {
                if (itm.pack_no === value) {
                  total += 1;
                }
              });
            });
            if (total >= 2) {
              callback(new Error("包号重复"));
            }
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入包号"));
            }
            callback();
          }
        },
      },
    ],
    electric: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["electric"];
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
    open: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["open"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入启破力"));
            }
            callback();
          }
        },
      },
    ],
    print_factor_id: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择彩印铁厂家"));
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
  // 重组数据check_json
  function transformedCheckJson(check_json: any) {
    check_json = check_json || [];

    const transformedData = check_json.map((item: any) => {
      const key = Object.keys(item)[0];
      return {
        key: parseInt(key),
        pack_no: item[key].pack_no?.val || "",
        electric: item[key].electric?.val || "",
        open: item[key].open?.val || "",
      };
    });

    return transformedData;
  }

  const otherRules = reactive({
    weld_seam_ret: [
      {
        required: is_submit,
        message: "请选择焊缝完整性实验检测",
      },
    ],
    electric_ret: [
      {
        required: is_submit,
        message: "请选择电流检测结果",
      },
    ],
    code_ret: [
      {
        required: is_submit,
        message: "请选择墨码检测结果",
      },
    ],
    end_ret: [
      {
        required: is_submit,
        message: "请选择底盖蓝底检测结果",
      },
    ],
    open_ret: [
      {
        required: is_submit,
        message: "请选择启破力检测结果",
      },
    ],
  });
  // 保存时候校验检验信息明细：有数据的情况下，时间和 彩印铁厂家必填，包号至少录入一个 type：0 新增，1保存
  const validatorTableRow = (type = 0) => {
    let isOk = true;
    let operateText = type === 0 ? "新增" : "提交";
    if (checkTableData.value.length > 0) {
      checkTableData.value.forEach((item: any, index: number) => {
        let checkPackNo = item.check_json.some((itm: any) => itm.pack_no && itm.electric);
        console.log("checkPackNo:", checkPackNo);
        if (!item.check_time) {
          ElMessage.warning(`${operateText}失败，请选择序号${index + 1}的时间`);
          isOk = false;
          return;
        }
        if (!checkPackNo) {
          ElMessage.warning(
            `${operateText}失败，序号${index + 1}至少需要录入一个包号和电流检验信息`,
          );
          isOk = false;
          return;
        }
        if (!item.print_factor_id) {
          ElMessage.warning(`${operateText}失败，请选择序号${index + 1}的彩印铁厂家`);
          isOk = false;
          return;
        }
      });
      return isOk;
    }
    return isOk;
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
    initBaseData,
    BaseData,
    statusOptions,
    initTableClumns,
    handleDelRow,
    checkTableForm,
    checkFormRules,
    passList,
    errorCountMap,
    tableLableOptions,
    otherTableColumns,
    otherTableData,
    checkUserOptions,
    cellColumns,
    supplyOptions,
    suppliersMap,
    otherCheckForm,
    versionOptions,
    transformedCheckJson,
    is_submit,
    otherRules,
    validatorCell,
    validatorTableRow,
  };
}
