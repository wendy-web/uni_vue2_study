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
import { getBaseDataInitApi } from "@/api/quality/material-inspection/hot-film/index";
import { HotFilmModule } from "@/api/quality/material-inspection/hot-film/types";
import { useCommonHooks } from "@/hooks/quality/index";
import { useselectData } from "@/hooks/quality/selectData";
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();
const { validatorCell } = useCommonHooks();
const { statusOptions } = useselectData();

interface columnItemType extends CommonModule.InitTabelLabelItem {
  label: string;
  prop: string;
  minWidth?: number;
  headerRenderer?: any;
  [key: string]: any;
}

export function useAdd() {
  const BaseData = ref<HotFilmModule.BaseData>(); // 获取公共下拉框数据配置
  const checkUserOptions = ref<CommonModule.seletcOptionItem[]>([]); // 检查员 下拉选项
  const brandOptions = ref<CommonModule.seletcOptionItem[]>([]); // 产品大类 下拉选项
  const checkResultOptions = ref<CommonModule.seletcOptionItem[]>([]); // 检验结果 下拉选项
  const tableLableOptions = ref(); // 表头配置
  const supplyOptions = ref<CommonModule.seletcOptionItem[]>([]); // 供应商下拉选项
  const workshopOptions = ref<CommonModule.seletcOptionItem[]>([]); // 车间下拉选项
  const suppliersMap = ref({}); // 供应商map数据
  // 获取公共下拉框数据配置
  async function initBaseData() {
    const result = await getBaseDataInitApi();
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

    workshopOptions.value = result.data.workshop_init.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  }
  // 获取表头
  async function initTableClumns({ film, brand, workshop, oid = 0 }: any) {
    const data: any = {
      item: 4, //热缩膜
      brand,
      film,
      workshop,
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
        // hide: page === "detail",
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
    // Object.entries(result.data).forEach(([keys, item]) => {
    //   let {
    //     key,
    //     name,
    //     sort,
    //     child,
    //     initval,
    //     type,
    //     lower_limit_val,
    //     upper_limit_val,
    //     error_limit_val,
    //     value,
    //     unit,
    //   } = item;
    //   let columnItem: columnItemType = {
    //     label: name,
    //     prop: key,
    //     minWidth: 160,
    //     slot: key,
    //     key,
    //     name,
    //     sort,
    //     child,
    //     initval,
    //     check_type: type,
    //     lower_limit_val,
    //     upper_limit_val,
    //     error_limit_val,
    //     value,
    //     unit,
    //   };
    //   if (item.initval) {
    //     columnItem.minWidth = 180;
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
    brand: "ND1", //产品大类
    film: "", //类型
    batch_no: "", //到货批次
    num: "", // 到货数量
    workshop: 1, //车间
    check_date: dayjs().format("YYYY-MM-DD"), //检测日期
    sample_date: dayjs().format("YYYY-MM-DD"), //取样日期
    supplier_id: "", // 供应商id
    supplier_name: "", // 供应商名称
    check_user_id: userStore.uid as number, //检测员id
    check_user_name: userStore.nickname, //检测员名称
    check_sign: "", // 检验员签字
    check_ret: undefined as FormNumType, //检验结果
    recheck: [], // 复检信息
    ct_name: "", // 创建人
    remark: "", // 备注
    checkinfo: [], // 检测数据信息
    total: 0, // 总检查项
    abnormal: 0, // 异常数
    status: 0, //单据状态
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
    check_date: [
      {
        required: true,
        message: "请选择检测日期",
      },
    ],
    sample_date: [
      {
        required: true,
        message: "请选择样品时间",
      },
    ],
    workshop: [
      {
        required: true,
        message: "请选择使用车间",
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
    film: [
      {
        required: true,
        message: "请选择类型",
      },
    ],
    batch_no: [
      {
        required: true,
        message: "请输入到货批次",
      },
    ],
    num: [
      {
        required: true,
        message: "请输入到货数量",
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
      },
      options: computed(() => supplyOptions.value),
    },
    {
      label: "样品时间",
      valueType: "date-picker",
      prop: "sample_date",
      labelWidth: 90,
      fieldProps: {
        placeholder: "请选择日期",
        type: "datetime",
        format: "YYYY-MM-DD HH:mm",
        valueFormat: "YYYY-MM-DD HH:mm",
        defaultTime: new Date(),
        disabledDate: (date: string) => {
          return checkDate(date, dayjs().format("YYYY-MM-DD HH:mm:ss"), 2); // 2今天之后的日期不可选
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
      label: "类型",
      prop: "film",
      valueType: "select",
      labelWidth: "90",
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择类型",
        // onChange: (event:any) => {
        //   let item = brandOptions.value.find((item: any) => item.value == event);
        //   console.log("选择类型：",event);
        // }
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
            brandChild = matchingBrand.film;
            console.log("brandChild:", brandChild);
          }
          return brandChild.map((item) => {
            return {
              label: item.name,
              value: Number(item.id),
            };
          });
        }
        return [];
      }),
    },
    {
      label: "到货批次",
      width: 90,
      prop: "batch_no",
      colProps: {
        span: 6,
      },
    },
    {
      label: "到货数量",
      width: 90,
      prop: "num",
      valueType: "input-number",
      fieldProps: { precision: 0, min: 0 },
      colProps: {
        span: 6,
      },
    },
    {
      label: "使用车间",
      prop: "workshop",
      valueType: "select",
      labelWidth: "90",
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择",
        filterable: true,
      },
      options: computed(() => workshopOptions.value),
    },
    {
      label: "检验结果",
      width: 90,
      prop: "check_ret",
      valueType: "select",
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择",
      },
      options: computed(() => {
        // 下拉选项 通过公共接口返回
        return checkResultOptions.value;
      }),
    },
    {
      label: "检测员",
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
      label: "项目",
      prop: "name",
      slot: "name",
      fixed: true,
    },
    {
      label: "样品1",
      prop: "sample_1",
      children: [
        {
          label: "1",
          prop: "sample_1_1",
          slot: "sample_1_1",
        },
        {
          label: "2",
          prop: "sample_1_2",
          slot: "sample_1_2",
        },
        {
          label: "3",
          prop: "sample_1_3",
          slot: "sample_1_3",
        },
        {
          label: "x",
          prop: "sample_1_x",
          slot: "sample_1_x",
        },
      ],
    },
    {
      label: "样品2",
      prop: "sample_2",
      children: [
        {
          label: "1",
          prop: "sample_2_1",
          slot: "sample_2_1",
        },
        {
          label: "2",
          prop: "sample_2_2",
          slot: "sample_2_2",
        },
        {
          label: "3",
          prop: "sample_2_3",
          slot: "sample_2_3",
        },
        {
          label: "x",
          prop: "sample_2_x",
          slot: "sample_2_x",
        },
      ],
    },
    {
      label: "样品3",
      prop: "sample_3",
      children: [
        {
          label: "1",
          prop: "sample_3_1",
          slot: "sample_3_1",
        },
        {
          label: "2",
          prop: "sample_3_2",
          slot: "sample_3_2",
        },
        {
          label: "3",
          prop: "sample_3_3",
          slot: "sample_3_3",
        },
        {
          label: "x",
          prop: "sample_3_x",
          slot: "sample_3_x",
        },
      ],
    },
    {
      label: "结果",
      prop: "result",
      slot: "result",
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
      check_json: {
        list: [
          {
            name: "热缩膜厚度",
            key: "land",
            "1": {
              "1": "",
              "2": "",
              "3": "",
              x: "",
            },
            "2": {
              "1": "",
              "2": "",
              "3": "",
              x: "",
            },
            "3": {
              "1": "",
              "2": "",
              "3": "",
              x: "",
            },
            ret: 1,
            note: "",
          },
          {
            name: "热缩膜宽度",
            key: "width",
            "1": {
              "1": "",
              "2": "",
              "3": "",
              x: "",
            },
            "2": {
              "1": "",
              "2": "",
              "3": "",
              x: "",
            },
            "3": {
              "1": "",
              "2": "",
              "3": "",
              x: "",
            },
            ret: 1,
            note: "",
          },
          {
            name: "热缩膜筒内径",
            key: "internal",
            "1": {
              "1": "",
              "2": "",
              "3": "",
              x: "",
            },
            "2": {
              "1": "",
              "2": "",
              "3": "",
              x: "",
            },
            "3": {
              "1": "",
              "2": "",
              "3": "",
              x: "",
            },
            ret: 1,
            note: "",
          },
        ],
        exterior: {
          "1": 1,
          "2": 1,
          "3": 1,
          ret: 1,
          note: "",
        },
        weight: {
          "1": "",
          "2": "",
          "3": "",
          ret: 1,
          num: "",
        },
      },
      check_note: "",
    });
    // console.log("checkTableData.value:", checkTableData.value);
  }
  /** 删除表格的选中行 */
  function handleDelRow(index: any) {
    checkTableData.value.splice(index, 1);
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
    // 热缩膜厚度
    land: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["land"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入热缩膜厚度"));
            }
            callback();
          }
        },
      },
    ],
    //  热缩膜宽度
    width: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["width"];
            console.log("热缩膜宽度ruleItem:", ruleItem);
            console.log("热缩膜宽度value:", value);
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入热缩膜宽度"));
            }
            callback();
          }
        },
      },
    ],
    // 热缩膜筒内径
    internal: [
      {
        required: is_submit.value,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["internal"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请输入热缩膜筒内径"));
            }
            callback();
          }
        },
      },
    ],
    // 热缩膜净重
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
              callback(new Error("请输入热缩膜净重"));
            }
            callback();
          }
        },
      },
    ],
    // 结果
    ret: [
      {
        required: is_submit.value,
        message: "请选结果",
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
    let result: any = {
      list: [],
      exterior: {
        "1": "",
        "2": "",
        "3": "",
        ret: "",
        note: "",
      },
      weight: {
        "1": data.weight["1"],
        "2": data.weight["2"],
        "3": data.weight["3"],
        ret: Number(data.weight.ret),
        num: data.weight.num,
      },
    };
    // 战马类型才有
    if (data.exterior) {
      result.exterior = {
        "1": Number(data.exterior["1"]),
        "2": Number(data.exterior["2"]),
        "3": Number(data.exterior["3"]),
        ret: Number(data.exterior.ret),
        note: data.exterior.note,
      };
    }
    const keys = ["land", "width", "internal"];
    const names = ["热缩膜厚度", "热缩膜宽度", "热缩膜筒内径"];

    keys.forEach((key, index) => {
      result.list.push({
        name: names[index],
        key: key,
        "1": {
          "1": data[key]["1"]["1"],
          "2": data[key]["1"]["2"],
          "3": data[key]["1"]["3"],
          x: data[key]["1"]["x"],
        },
        "2": {
          "1": data[key]["2"]["1"],
          "2": data[key]["2"]["2"],
          "3": data[key]["2"]["3"],
          x: data[key]["2"]["x"],
        },
        "3": {
          "1": data[key]["3"]["1"],
          "2": data[key]["3"]["2"],
          "3": data[key]["3"]["3"],
          x: data[key]["3"]["x"],
        },
        ret: Number(data[key].ret),
        note: data[key].note,
      });
    });

    return result;
  }
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
    checkUserOptions,
    updateBatchNo,
    supplyOptions,
    suppliersMap,
    transformedSize,
    is_submit,
    validatorCell,
  };
}
