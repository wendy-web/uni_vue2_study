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
import { getCapInitApi } from "@/api/quality/material-inspection/cap/index";
import { CapModule } from "@/api/quality/material-inspection/cap/types";
import { useCommonHooks } from "@/hooks/quality/index";
import { useselectData } from "@/hooks/quality/selectData";
import { useUserStore } from "@/store/modules/user";

const { validatorCell } = useCommonHooks();
const userStore = useUserStore();
const { statusOptions, basePassList } = useselectData();

interface columnItemType extends CommonModule.InitTabelLabelItem {
  label: string;
  prop: string;
  minWidth?: number;
  headerRenderer?: any;
  [key: string]: any;
}

export function useAdd() {
  const BaseData = ref<CapModule.BaseData>(); // 获取公共下拉框数据配置
  const checkUserOptions = ref<CommonModule.seletcOptionItem[]>([]); // 检查员 下拉选项
  const brandOptions = ref<CommonModule.seletcOptionItem[]>([]); // 产品大类 下拉选项
  const checkResultOptions = ref<CommonModule.seletcOptionItem[]>([]); // 检验结果 下拉选项
  const tableLableOptions = ref(); // 表头配置
  const supplyOptions = ref<CommonModule.seletcOptionItem[]>([]); // 供应商下拉选项
  const suppliersMap = ref({}); // 供应商map数据
  // 获取公共下拉框数据配置
  async function initBaseData() {
    const result = await getCapInitApi();
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

    supplyOptions.value = result.data.supplier.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    suppliersMap.value = result.data.supplier.reduce((map, supplier) => {
      map[supplier.id] = supplier.name;
      return map;
    }, {} as any);
  }
  // 获取表头
  async function initTableClumns({ sku, oid = 0 }: any) {
    const data: CommonModule.TabelLabelQuery = {
      item: 3, //顶盖尾盖
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
        minWidth: 160,
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
        unit,
      };
      if (item.initval) {
        columnItem.minWidth = 180;
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
  }
  /** 1是新建,2是编辑,3是详情 */
  const pageType = ref(1);
  const editDisabled = computed(() => {
    return pageType.value === 3;
  });
  /** add表单数据 */
  const formData = ref<any>({
    order_no: "", //单据编号
    brand: "ND1", //产品大类
    sku: "ND1-1", //产品类型
    batch_no: "", //生产批号
    check_date: dayjs().format("YYYY-MM-DD"), //检验日期
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
    status: 0, //单据状态
    adhesion: "", // 防伪附着力检测（普通型） 0 不及格 1及格
    code_ret: "", // 二维码检测结果（强化型） 0 不及格 1及格
    bule_ret: "", // 蓝点检测结果（强化型） 0 不及格 1及格
    files: [], //文件数据
    logs: [], //日志信息
    create_time: "",
  });
  /** 如果是提交则设为true,表示必填 */
  const is_submit = ref(false);

  /** add表单验证规则 */
  const formRules = {
    supplier_id: [
      {
        required: true,
        message: "请选择供应商",
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
        onChange: (id: any) => {
          let item: any = supplyOptions.value?.find((item) => item.value === id);
          formData.value.supplier_name = item?.label;
        },
      },
      options: computed(() => supplyOptions.value),
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
      options: computed(() => {
        // 产品大类 通过公共接口返回
        return brandOptions.value;
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
        placeholder: "请选择产品大类",
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
      label: "防伪附着力检测",
      prop: "adhesion",
      slot: "adhesion",
      width: 200,
      hide: () => (formData.value.sku === "ND1-1" ? false : true), // 只有红牛-普通型时，才能录入
    },
    {
      label: "二维码检测",
      prop: "code_ret",
      slot: "code_ret",
      width: 200,
      hide: () => (formData.value.sku === "ND1-2" ? true : false), // 等于红牛-强化型时，不能录入
    },
    {
      label: "蓝点检测",
      prop: "bule_ret",
      slot: "bule_ret",
      width: 200,
      hide: () => (formData.value.sku === "ND1-2" ? false : true), // 等于红牛-强化型时，才能录入
    },
  ]);
  /** 其他检验表格数据 */
  const otherTableData = ref([
    {
      adhesion: "", // 防伪附着力检测
      code_ret: "", // 二维码检测
      bule_ret: "", // 蓝点检测
    },
  ]);

  /** 其他检验表单 */
  const otherCheckForm = ref({
    adhesion: "", // 防伪附着力检测
    code_ret: "", // 二维码检测
    bule_ret: "", // 蓝点检测
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
    },
    {
      label: "序号",
      type: "index",
      fixed: "left",
      width: 60,
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
      checkTime = dayjs(lastCheckTime, "HH:mm").add(5, "minute").format("HH:mm");
    }
    // 获取包号：在上一个包号基础上+8
    let pack_no = undefined as FormNumType;
    if (tableData[tableData.length - 1]?.pack_no) {
      pack_no = Number(tableData[tableData.length - 1]?.pack_no ?? 0) + 1;
    }
    const croche_height_len = formData.value.brand == "ND2" ? 10 : 3;
    // 新增一行:需要动态取表头里面的字段
    checkTableData.value.push({
      unique_id,
      make_date: dayjs().format("YYYY-MM-DD"),
      batch_no,
      pack_no,
      // emergence: 1,
      // exterior: 1,
      emergence: "", //羽化检测
      exterior: "", //外观检测
      size: {
        outside_dimension: Array.from({ length: 3 }, (_, index) => {
          return {
            "1": "",
            "2": "",
            "3": "",
            x: "",
          };
        }),
        countersink_depth: Array.from({ length: 3 }, (_, index) => {
          return {
            "1": "",
            "2": "",
            "3": "",
            x: "",
          };
        }),
        croche_height: Array.from({ length: croche_height_len }, (_, index) => {
          return {
            "1": "",
            "2": "",
            "3": "",
            x: "",
          };
        }),
      },
      // electric: [0, 0, 0],
      // dry_film: [0, 0, 0],
      // open: [0, 0, 0],
      // allopen: [0, 0, 0],
      // check_ret: 1,
      electric: ["", "", ""], //缺陷电流
      dry_film: ["", "", ""], //干膜重量
      open: ["", "", ""], //启破力
      allopen: ["", "", ""], //全开力
      check_ret: -1, //检验结果
    });
    // console.log("checkTableData.value:", checkTableData.value);
  }
  /** 删除表格的选中行 */
  function handleDelRow(row: any) {
    let ids = row.map((item: any) => item.unique_id || item.id);
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
    make_date: [
      {
        required: true,
        message: "请选择生产日期",
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
    // 羽化检测
    emergence: [
      {
        required: is_submit.value,
        message: "请选择羽化检测结果",
      },
    ],
    // 外观检测
    exterior: [
      {
        required: is_submit.value,
        message: "请选择外观检测结果",
      },
    ],
    // 缺陷电流
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
              callback(new Error("请输入缺陷电流"));
            }
            callback();
          }
        },
      },
    ],
    // 干膜重量
    dry_film: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["dry_film"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入干膜重量"));
            }
            callback();
          }
        },
      },
    ],
    // 启破力
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
    // 全开力
    allopen: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["allopen"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入全开力"));
            }
            callback();
          }
        },
      },
    ],
    // 检验结果
    check_ret: [
      {
        required: is_submit.value,
        message: "请选择检验结果",
      },
    ],
  };
  // 尺寸检测规则
  const sizeFormRules = {
    // 外径尺寸
    outside_dimension: [
      {
        required: true,
        message: "异常",
        trigger: "change",
        validator: (rule: any, value: any, callback: any) => {
          if (value === "") {
            callback();
          } else {
            let ruleItem: any = tableLableOptions.value["size"]["child"]["outside_dimension"];
            let isOk = validatorCell(ruleItem, value);
            let { field } = rule;
            initErrorCountMap(isOk, field); // 统计错误数量
            if (!isOk) {
              callback(new Error(" "));
            }
            callback();
          }
        },
      },
    ],
    // 埋头度
    countersink_depth: [
      {
        required: true,
        message: "异常",
        trigger: "change",
        validator: (rule: any, value: any, callback: any) => {
          if (value === "") {
            callback();
          } else {
            let ruleItem: any = tableLableOptions.value["size"]["child"]["countersink_depth"];
            let isOk = validatorCell(ruleItem, value);
            let { field } = rule;
            initErrorCountMap(isOk, field); // 统计错误数量
            if (!isOk) {
              callback(new Error(" "));
            }
            callback();
          }
        },
      },
    ],
    // 勾边高度
    croche_height: [
      {
        required: true,
        message: "异常",
        trigger: "change",
        validator: (rule: any, value: any, callback: any) => {
          if (value === "") {
            callback();
          } else {
            let ruleItem: any = tableLableOptions.value["size"]["child"]["croche_height"];
            let isOk = validatorCell(ruleItem, value);
            let { field } = rule;
            initErrorCountMap(isOk, field); // 统计错误数量
            if (!isOk) {
              callback(new Error(" "));
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
  function transformedSize(data: any) {
    const result: any = {};
    for (const key in data) {
      result[key] = data[key].map((itemArray: any) => {
        return itemArray.reduce((acc: any, item: any) => {
          return { ...acc, ...item };
        }, {});
      });
    }
    return result;
  }
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
  const otherRules = reactive({
    adhesion: [
      {
        required: is_submit,
        message: "请选择防伪附着力检测结果",
      },
    ],
    code_ret: [
      {
        required: is_submit,
        message: "请选择二维码检测结果",
      },
    ],
    bule_ret: [
      {
        required: is_submit,
        message: "请选择蓝点检测结果",
      },
    ],
  });
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
    updateBatchNo,
    supplyOptions,
    suppliersMap,
    otherCheckForm,
    transformedSize,
    validatorCell,
    is_submit,
    otherRules,
  };
}
