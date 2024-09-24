import { ElImage, FormInstance } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import dayjs from "dayjs";
// 引入获取表头、检测依据api
import { getTabelLabelApi, getWipBaseDataInitApi } from "@/api/quality/common/index";
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

  const { getStatusText, basePassList, passList, statusOptions } = useselectData();

  const BaseData = ref<any>(); // 获取公共下拉框数据配置
  const brandOptions = ref<CommonModule.seletcOptionItem[]>([]); // 产品大类 下拉选项
  const checkResultOptions = ref<CommonModule.seletcOptionItem[]>([]); // 检验结果 下拉选项
  const checkUserOptions = ref<CommonModule.seletcOptionItem[]>([]); // 检验人 下拉选项
  const lineOptions = ref<CommonModule.seletcOptionItem[]>([]); // 线别 下拉选项
  // 获取公共下拉框数据配置
  async function initBaseData() {
    const result = await getWipBaseDataInitApi();
    BaseData.value = result.data;
    brandOptions.value = result.data.brand_data.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    checkResultOptions.value = result.data.check_init.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    checkUserOptions.value = result.data.check_user_list.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    lineOptions.value = result.data.line_init.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  }
  const tableLableOptions = ref(); // 表头配置
  // 获取表头
  async function initTableClumns({ sku, brand, oid = 0 }: any) {
    const data: any = {
      item: 24, // 24、半成品检验
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
    ];
    const result = await getTabelLabelApi(data);
    tableLableOptions.value = result.data;
    // Object.entries(result.data).forEach(([keys, item]) => {
    //   let { key, name } = item;
    //   let columnItem: columnItemType = {
    //     label: name,
    //     prop: key,
    //     minWidth: 140,
    //     slot: key,
    //     hide: false,
    //   };
    //   if (item.initval) {
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
    console.log("标准值配置: ", arr);
  }

  /** 1是新建,2是编辑,3是详情 */
  const pageType = ref(1);
  const editDisabled = computed(() => {
    return pageType.value === 3;
  });
  /** add表单数据 */
  const formData = ref<any>({
    order_no: "", //单据编号
    batch_no: "", // 批次号8位
    brand: "", //产品大类
    sku: "", //类型
    line_id: "", // 线别
    line_name: "", // 线别名称
    check_date: "", //检测日期
    check_ret: undefined as FormNumType, //检查结果
    check_user_id: "", //检测员id
    check_user_name: "", //检测员名称
    check_sign: "", // 检验人签字
    recheck: [], // 复检人签名
    remark: "", // 备注
    check_remark: "", // 审核备注
    checkinfo: [], // 检测数据信息
    status: 0, //单据状态
    files: [], //文件数据
    logs: [], //日志信息
    total: 0, // 总样品数
    abnormal: 0, //不合格数
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
        message: "请选择产品大类",
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
        message: "请选择检验日期",
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
      prop: "batch_no",
      fieldProps: {
        maxLength: 8,
      },
    },
    {
      label: "产品大类",
      prop: "brand",
      valueType: "select",
      labelWidth: 90,
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
      options: computed(() => {
        // 产品大类 通过公共接口返回
        return brandOptions.value;
      }),
    },
    {
      label: "产品类型",
      prop: "sku",
      valueType: "select",
      labelWidth: 90,
      colProps: {
        span: 6,
      },
      fieldProps: computed(() => {
        return {
          placeholder: `${disabledSku.value ? "请先选择产品大类" : "请选择类型"}`,
          disabled: disabledSku.value,
        };
      }),
      // 产品类型要根据 产品大类筛选过滤
      options: computed(() => {
        if (BaseData.value?.brand_data) {
          let { brand } = formData.value;
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
      label: "线别",
      prop: "line_id",
      valueType: "select",
      labelWidth: 90,
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择",
        filterable: true,
      },
      options: computed(() => {
        // 线别下拉 通过公共接口返回
        return lineOptions.value;
      }),
    },
    {
      label: "检验员",
      prop: "check_user_id",
      valueType: "select",
      labelWidth: 90,
      colProps: {
        span: 6,
      },
      fieldProps: {
        placeholder: "请选择",
        filterable: true,
        onChange: (event: any) => {
          console.log("check_user_id onChange:", event);
          if (event) {
            // 查找检验员名称
            const matchingCheckUser: any = checkUserOptions.value?.find(
              (item) => item.value === event,
            );
            console.log("matchingCheckUser:", matchingCheckUser);
            formData.value.check_user_name = matchingCheckUser?.label;
          }
        },
      },
      options: computed(() => {
        // 线别下拉 通过公共接口返回
        return checkUserOptions.value;
      }),
    },

    {
      label: "检验结果",
      labelWidth: 90,
      prop: "check_ret",
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
      label: "检验员签名",
      prop: "check_sign",
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
      prop: "recheck",
      labelWidth: 90,
      hideInForm: computed(() => pageType.value !== 3),
      renderField: (value: any) => {
        let list =
          value.length > 0
            ? (value as any[]).map((el) => useSetting.baseHttp + el.recheck_sign)
            : [];
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
      prop: "remark",
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
      label: "勾选列",
      type: "selection",
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
      fixed: true,
    },
    {
      label: "批号",
      prop: "batch_num",
      slot: "batch_num",
      minWidth: 140,
      fixed: true,
    },
    {
      label: "感官指标",
      align: "center",
      children: [
        {
          label: "颜色",
          prop: "color",
          slot: "color",
          minWidth: 140,
          headerRenderer: () => (
            <ul>
              <li>颜色</li>
            </ul>
          ),
        },
        {
          label: "滋味和气味",
          prop: "scent",
          slot: "scent",
          minWidth: 140,
          headerRenderer: () => (
            <ul>
              <li>滋味和气味</li>
            </ul>
          ),
        },
        {
          label: "外观",
          prop: "look",
          slot: "look",
          minWidth: 140,
          headerRenderer: () => (
            <ul>
              <li>外观</li>
            </ul>
          ),
        },
        {
          label: "杂质",
          prop: "impurity",
          slot: "impurity",
          minWidth: 140,
          headerRenderer: () => (
            <ul>
              <li>杂质</li>
            </ul>
          ),
        },
      ],
    },
    {
      label: "Brix(%)",
      prop: "Brix",
      slot: "Brix",
      minWidth: 140,
      headerRenderer: () => (
        <ul>
          <li>{tableLableOptions.value?.Brix.name || "Brix"}</li>
          <li>{tableLableOptions.value?.Brix.initval}</li>
        </ul>
      ),
    },
    {
      label: "pH",
      prop: "pH",
      slot: "pH",
      minWidth: 140,
      headerRenderer: () => (
        <ul>
          <li>{tableLableOptions.value?.pH.name || "pH"}</li>
          <li>{tableLableOptions.value?.pH.initval}</li>
        </ul>
      ),
    },
    {
      label: "UV(271.5mm)",
      align: "center",
      children: [
        {
          label: "CT",
          prop: "CT",
          slot: "CT",
          minWidth: 140,
        },
        {
          label: "样品",
          prop: "sample",
          slot: "sample",
          minWidth: 140,
        },
        {
          label: "差值",
          prop: "delta",
          slot: "delta",
          minWidth: 140,
          headerRenderer: () => (
            <ul>
              <li>{tableLableOptions.value?.delta.name || "差值"}</li>
              <li>{tableLableOptions.value?.delta.initval}</li>
            </ul>
          ),
        },
      ],
    },
    {
      label: "送样人",
      prop: "sample_sender_id",
      slot: "sample_sender_id",
      minWidth: 140,
    },
    {
      label: "检验员",
      prop: "check_uid",
      slot: "check_uid",
      minWidth: 140,
    },
    {
      label: "备注",
      prop: "note",
      slot: "note",
      minWidth: 140,
    },
    {
      label: "检验结果",
      prop: "check_ret",
      slot: "check_ret",
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
      check_time: checkTime,
      batch_no,
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
    batch_num: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            // 判断列表里的包号是否重复
            let data = checkTableData.value;
            let count = data.filter((item) => item.batch_num === value);
            if (count.length >= 2) {
              callback(new Error("批号重复"));
            }
            // 限制长度必须是5位
            if (value && value.toString().length !== 5) {
              callback(new Error("批号长度为5"));
            }
            callback();
          } else {
            // if (is_submit) {
            //   callback(new Error("请输入批号"));
            // }
            // callback();
            callback(new Error("请输入批号"));
          }
        },
      },
    ],
    // 颜色
    color: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择颜色结果"));
            }
            callback();
          }
        },
      },
    ],
    // 滋味和气味
    scent: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择滋味和气味结果"));
            }
            callback();
          }
        },
      },
    ],
    // 外观
    look: [
      {
        required: is_submit,
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
    // 杂质
    impurity: [
      {
        required: is_submit,
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
    // Brix
    Brix: [
      {
        required: is_submit,
        message: "请填写Brix",
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["Brix"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写Brix"));
            }
            callback();
          }
        },
      },
    ],
    // pH
    pH: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["pH"];
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
    // CT值
    CT: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写CT值"));
            }
            callback();
          }
        },
      },
    ],
    // 样品
    sample: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写样品值"));
            }
            callback();
          }
        },
      },
    ],
    //delta 差值
    delta: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["delta"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写差值"));
            }
            callback();
          }
        },
      },
    ],
    // 送样人
    sample_sender_id: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择送样人"));
            }
            callback();
          }
        },
      },
    ],
    // 检验员
    check_uid: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择检验员"));
            }
            callback();
          }
        },
      },
    ],
    // 检查结果
    check_ret: [
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
    initBaseData,
    formColumns,
    checkTablecolumns,
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
    checkUserOptions,
    resetErrorCountMap,
    is_submit,
  };
}
