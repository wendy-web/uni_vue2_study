import { FormInstance } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import dayjs from "dayjs";
import type { PlusColumn, PlusFormGroupRow } from "plus-pro-components";
// 引入获取表头、下拉框的公共接口
import { getEmptyOrderBaseDataApi, getTabelLabelApi } from "@/api/quality/common/index";
import { QualityCommonModule, SelectStringOpions } from "@/api/quality/common/types";
import { CansSeamModule } from "@/api/quality/material-inspection/cans-seam/types";
import { useCommonHooks } from "@/hooks/quality/index";
import { useselectData } from "@/hooks/quality/selectData";
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();
const { validatorCell } = useCommonHooks();
const { statusOptions, basePassList } = useselectData();

interface useAddParams {
  page?: string;
  [key: string]: any;
}
interface columnItemType extends QualityCommonModule.InitTabelLabelItem {
  label: string;
  prop: string;
  minWidth?: number;
  headerRenderer?: any;
  [key: string]: any;
}

export function useAdd({ page = "add", ...rest }: useAddParams = {}) {
  const EmptyOrderBaseData = ref<QualityCommonModule.EmptyOrderBaseData>(); // 获取公共下拉框数据配置
  const checkUserOptions = ref<QualityCommonModule.seletcOptionItem[]>([]); // 检查员 下拉选项
  const brandOptions = ref<QualityCommonModule.seletcOptionItem[]>([]); // 产品大类 下拉选项
  const checkResultOptions = ref<QualityCommonModule.seletcOptionItem[]>([]); // 检验结果 下拉选项
  const tableLableOptions = ref<any>(); // 表头配置
  // 获取公共下拉框数据配置
  async function initEmptyOrderBaseData() {
    const result = await getEmptyOrderBaseDataApi();
    EmptyOrderBaseData.value = result.data;
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
  }
  // 获取表头
  async function initTableClumns({ sku, oid = 0 }: any) {
    const data: QualityCommonModule.TabelLabelQuery = {
      item: 1,
      sku,
    };
    if (oid) {
      data.oid = oid;
    }
    const arr: any = [
      {
        type: "selection",
        label: "勾选列",
        fixed: "left",
        sort: 0,
        hide: () => editDisabled.value,
      },
      {
        label: "序号",
        type: "index",
        width: 60,
        sort: 0,
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
        minWidth: 120,
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
      if (item.initval) {
        columnItem.minWidth = 120;
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

    checkTablecolumns.value = arr;

    checkTablecolumns.value.push({
      label: "检验结果",
      prop: "check_ret",
      slot: "check_ret",
    });
    // console.log("arr: ", arr);
  }
  // tab切换
  const tabList = ref([
    {
      title: "检验信息",
      key: "checkInfo",
    },
    {
      title: "单据日志",
      key: "orderLog",
    },
  ]);
  /** 1是新建,2是编辑 3是详情 */
  const pageType = ref(1);
  const editDisabled = computed(() => {
    return pageType.value === 3;
  });
  /** add表单数据 */
  const formData = ref<CansSeamModule.EmptypotInfo>({
    id: 0 as FormNumType,
    order_no: "", //单据编号
    batch_no: "", //生产批号
    brand: "ND1", //产品大类
    sku: "ND1-1", //产品类型
    check_date: dayjs().format("YYYY-MM-DD"), //检验日期
    check_user_id: userStore.uid as FormNumType, //检验员id
    check_user_name: userStore.nickname, //检验员名称
    check_ret: 3 as FormNumType, //检验结果
    check_sign: "", // 检验员签字 测试预览图 https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg
    recheck: [], // 复检信息
    status: 0 as FormNumType, //单据状态
    remark: "", // 备注
    check_remark: "", // 审核备注
    checkinfo: [], // 检测数据信息
    total: 0 as FormNumType, // 总检查项
    abnormal: 0 as FormNumType, // 异常数
    files: [], //文件数据
    logs: [], //日志信息
    ct_name: "", // 创建人
  });

  /** 如果是提交则设为true,表示必填 */
  const is_submit = ref(false);

  /** add表单验证规则 */
  const formRules = {
    batch_no: [
      {
        required: true,
        trigger: "blur",
        message: "请输入生产批号",
      },
    ],
    check_date: [
      {
        required: true,
        message: "请选择检验日期",
      },
    ],
    brand: [
      {
        required: true,
        trigger: "blur",
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
        trigger: "blur",
        message: "请选择产品类型",
      },
    ],
    check_user_id: [
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
  /** 添加页面使用的PlusForm表单数据 */
  const formColumns: PlusColumn[] = [
    {
      label: "单据编号",
      width: 90,
      prop: "order_no",
      // tooltip: "名称最多显示6个字符",
      colProps: {
        span: 6,
      },
      fieldProps: computed(() => ({ disabled: true })),
      hideInForm: computed(() => (formData.value.order_no ? false : true)),
    },
    {
      label: "生产批号",
      width: 90,
      prop: "batch_no",
      colProps: {
        span: 6,
      },
      fieldProps: computed(() => {
        return {
          disabled: checkTableData.value.length > 0,
        };
      }),
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
        clearable: false,
      },
      // 产品类型要根据 产品大类筛选过滤
      options: computed(() => {
        if (EmptyOrderBaseData.value?.brand_data) {
          let { brand, sku } = formData.value;
          let brandChild: SelectStringOpions[] = [];
          const matchingBrand = EmptyOrderBaseData.value?.brand_data.find(
            (item: QualityCommonModule.BrandDaum) => item.id === brand,
          );
          if (matchingBrand) {
            brandChild = matchingBrand.child;
          }
          // if (brand && sku) {
          //   initTableClumns();
          // }
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
      label: "检验日期",
      valueType: "date-picker",
      prop: "check_date",
      labelWidth: 90,
      fieldProps: {
        placeholder: "请选择检验日期",
        type: "date",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        clearable: false,
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
        disabled: true,
        placeholder: "请选择",
        filterable: true,
        clearable: false,
      },
      options: computed(() => {
        // 产品大类 通过公共接口返回
        return brandOptions.value;
      }),
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
      hideInForm: computed(() => (formData.value.ct_name ? false : true)),
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
  /** 表格表单数据 */
  const checkTableForm = reactive({
    checkTableData: [] as CansSeamModule.Checkinfo[],
    tableFormRef: {} as FormInstance,
  });
  /** 表格数据 */
  const { checkTableData, tableFormRef } = toRefs(checkTableForm);
  /** 检验信息表格配置 */
  const checkTablecolumns = ref<TableColumnList>([
    {
      type: "selection",
      width: 60,
      label: "勾选列",
      fixed: "left",
    },
    {
      label: "序号",
      type: "index",
      width: 60,
    },
  ]);

  /** 上传附件弹窗表单的columns */
  const fileUplodColumns: PlusColumn[] = [
    {
      label: "文件分类",
      prop: "type",
    },
    {
      label: "上传文件",
      prop: "file_name",
    },
    {
      label: "上传时间",
      prop: "create_time",
      valueType: "date-picker",
      fieldProps: {
        placeholder: "请选择上传时间",
      },
    },
    {
      label: "备注",
      prop: "note",
      fieldProps: {
        placeholder: "请输入备注",
      },
    },
  ];

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
    // {
    //   label: "上传人",
    //   prop: "ct_name",
    //   align: "center",
    // },
    // {
    //   label: "上传时间",
    //   prop: "create_time",
    //   align: "center",
    // },
    {
      label: "操作",
      slot: "operation",
      // hide: page == "add",
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
      checkTime = dayjs(lastCheckTime, "HH:mm").add(5, "minute").format("HH:mm");
      // id = (tableData[tableData.length - 1]?.id ?? 0) + 1;
    }
    // 获取包号：在上一个包号基础上+8
    let pack_no = undefined as FormNumType;
    if (tableData[tableData.length - 1]?.pack_no) {
      pack_no = Number(tableData[tableData.length - 1]?.pack_no ?? 0) + 8;
    }
    // 新增一行:需要动态取表头里面的字段
    checkTableData.value.push({
      unique_id,
      check_time: checkTime,
      batch_no,
      pack_no,
      check_json: [
        {
          body_high: "",
          lange_width: "",
          inner: "",
          w_standard: "",
          body_hook_length: "",
          end_hook_length: "",
          overlap: "",
          overlap_rate: "",
          t_standard: "",
          end_hook_clearance: "",
          body_hook_clearance: "",
        },
        {
          body_high: "",
          lange_width: "",
          inner: "",
          w_standard: "",
          body_hook_length: "",
          end_hook_length: "",
          overlap: "",
          overlap_rate: "",
          t_standard: "",
          end_hook_clearance: "",
          body_hook_clearance: "",
        },
        {
          body_high: "",
          lange_width: "",
          inner: "",
          w_standard: "",
          body_hook_length: "",
          end_hook_length: "",
          overlap: "",
          overlap_rate: "",
          t_standard: "",
          end_hook_clearance: "",
          body_hook_clearance: "",
        },
      ],
      wrinkle_rate: "",
      bule_dots: "",
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
        message: "请选择检验时间",
      },
    ],
    pack_no: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            // 判断列表里的包号是否重复
            let data = checkTableData.value;
            let count = data.filter((item) => item.pack_no === value);
            if (count.length >= 2) {
              callback(new Error("包号重复"));
            }
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入包号"));
            } else {
              callback();
            }
          }
        },
      },
    ],
    body_high: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["body_high"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入罐体高度"));
            } else {
              callback();
            }
          }
        },
      },
    ],
    inner: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["inner"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入罐内径"));
            }
            callback();
          }
        },
      },
    ],
    lange_width: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["lange_width"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入翻边尺寸"));
            }
            callback();
          }
        },
      },
    ],
    w_standard: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["w_standard"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入宽度"));
            }
            callback();
          }
        },
      },
    ],
    body_hook_length: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["body_hook_length"];
            let isOk = validatorCell(ruleItem, value);
            let { field } = rule;
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入身钩长度"));
            }
            callback();
          }
        },
      },
    ],
    end_hook_length: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["end_hook_length"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入盖钩长度"));
            }
            callback();
          }
        },
      },
    ],
    overlap: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            callback();
          } else {
            let ruleItem: any = tableLableOptions.value["overlap"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            if (is_submit.value) {
              callback(new Error("请输入迭接长度"));
            }
            callback();
          }
        },
      },
    ],
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
              callback(new Error("请输入迭接率"));
            }
            callback();
          }
        },
      },
    ],
    t_standard: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["t_standard"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入厚度"));
            }
            callback();
          }
        },
      },
    ],
    end_hook_clearance: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["end_hook_clearance"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入盖钩顶隙"));
            }
            callback();
          }
        },
      },
    ],
    body_hook_clearance: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["body_hook_clearance"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入罐钩顶隙"));
            }
            callback();
          }
        },
      },
    ],
    wrinkl_rate: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["wrinkle_rate"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入皱纹度"));
            }
            callback();
          }
        },
      },
    ],
    bule_dots: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value || value == 0) {
            // 校验是否合格的
            isOk = value == 1 ? true : false;
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入蓝点尺寸"));
            }
            callback();
          }
        },
      },
    ],
  };
  const updateBatchNo = (value: any) => {
    let tableData = checkTableData.value;
    if (tableData.length) {
      let err = 0;
      tableData.forEach((item: any) => {
        item.batch_no = value;
        // item.check_json.forEach(item => {
        //    Object.keys(item).forEach((key: any) => {
        //      item[key]
        //      xx[key].in
        //      err +
        //    })

        // });
      });
      checkTableData.value = tableData;
    }
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

  const abnormalNum = computed(() => {
    // // 罐体高度的规则
    // let body_high_rule: any = getRuleItem("body_high");
    // // 罐内径规则
    // let inner_rule: any = getRuleItem("inner");
    // // 翻边尺寸
    // let lange_width_rule: any = getRuleItem("lange_width");
    // // 宽度
    // let w_standard_rule: any = getRuleItem("w_standard_rule");
    // // 身钩长度
    // let body_hook_length_rule: any = getRuleItem("body_hook_length");
    // // 盖钩长度
    // let end_hook_length_rule: any = getRuleItem("end_hook_length");
    // // 迭接长度
    // let overlap_rule: any = getRuleItem("overlap");
    // // 迭接率
    // let overlap_rate_rule: any = getRuleItem("overlap_rate");
    // // 厚度
    // let t_standard_rule: any = getRuleItem("t_standard");
    // // 盖钩顶隙
    // let end_hook_clearance_rule: any = getRuleItem("end_hook_clearance");
    // // 罐钩顶隙
    // let body_hook_clearance_rule: any = getRuleItem("body_hook_clearance");
    // // 皱纹度
    // let wrinkle_rate_rule: any = getRuleItem("wrinkle_rate");
    // //
    // let body_high_list = getValidatorCellList(body_high_rule, "body_high");
    // let inner_list = getValidatorCellList(inner_rule, "inner");
    // let lange_width_list = getValidatorCellList(lange_width_rule, "lange_width");
    // let w_standard_list = getValidatorCellList(w_standard_rule, "w_standard");
    // let body_hook_length_list = getValidatorCellList(body_hook_length_rule, "body_hook_length");
    // let end_hook_length_list = getValidatorCellList(end_hook_length_rule, "end_hook_length");
    // let overlap_list = getValidatorCellList(overlap_rule, "overlap");
    // let overlap_rate_list = getValidatorCellList(overlap_rate_rule, "overlap_rate");
    // let t_standard_list = getValidatorCellList(t_standard_rule, "t_standard");
    // let end_hook_clearance_list = getValidatorCellList(
    //   end_hook_clearance_rule,
    //   "end_hook_clearance",
    // );
    // let body_hook_clearance_list = getValidatorCellList(
    //   body_hook_clearance_rule,
    //   "body_hook_clearance",
    // );
    // let wrinkle_rate_list = getValidatorCellList(wrinkle_rate_rule, "wrinkle_rate");
    // let list = [
    //   body_high_list,
    //   inner_list,
    //   lange_width_list,
    //   w_standard_list,
    //   body_hook_length_list,
    //   end_hook_length_list,
    //   overlap_list,
    //   overlap_rate_list,
    //   t_standard_list,
    //   end_hook_clearance_list,
    //   body_hook_clearance_list,
    //   wrinkle_rate_list,
    // ]
    //   .flat()
    //   .filter((item) => item === false);
    // console.log("list", list);
    // return list.length;
  });

  // function getRuleItem(key: string) {
  //   let ruleItem: any = checkTablecolumns.value.find((item) => item.prop === key);
  //   return ruleItem;
  // }

  // function getValidatorCellList(ruleItem: columnItemType, key: string) {
  //   return checkTableData.value.map((item: any) => {
  //     return validatorCell(ruleItem, item[key]);
  //   });
  // }

  // console.log("abnormalNum", abnormalNum.value);

  return {
    tabList,
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
    fileUplodColumns,
    handleAdd,
    initEmptyOrderBaseData,
    EmptyOrderBaseData,
    statusOptions,
    initTableClumns,
    handleDelRow,
    checkTableForm,
    checkFormRules,
    passList,
    validatorCell,
    updateBatchNo,
    errorCountMap,
    tableLableOptions,
    checkUserOptions,
    is_submit,
    abnormalNum,
  };
}
