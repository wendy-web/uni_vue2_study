import { ElImage, FormInstance } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import dayjs from "dayjs";
// 引入获取表头、检测依据api
import { getSampleBaseData, getTabelLabelApi } from "@/api/quality/common/index";
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

  const { getStatusText, basePassList, passList } = useselectData();

  const BaseData = ref<any>(); // 获取公共下拉框数据配置
  const statusOptions = ref<CommonModule.seletcOptionItem[]>([]); // 单据状态 下拉选项
  const brandOptions = ref<CommonModule.seletcOptionItem[]>([]); // 产品大类 下拉选项
  const checkResultOptions = ref<CommonModule.seletcOptionItem[]>([]); // 检验结果 下拉选项
  const checkUserOptions = ref<CommonModule.seletcOptionItem[]>([]); // 检验人 下拉选项
  const lineOptions = ref<CommonModule.seletcOptionItem[]>([]); // 线别 下拉选项
  // 获取公共下拉框数据配置
  async function initBaseData() {
    const result = await getSampleBaseData();
    BaseData.value = result.data;
    statusOptions.value = result.data.status.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      };
    });

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
      item: 25, // 25、样品检验
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
    console.log("标准值配置: ", tableLableOptions.value);
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
    sample_num: "", //工序取样量
    net_ret: "", // 净含量平均值0不及格1及格红牛≥250.0ml，战马≥310.0ml才为合格
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
    sample_num: [
      {
        required: true,
        message: "请输入工序取样量",
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
        // onChange: (event: any) => {
        // },
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
      label: "工序取样量",
      prop: "sample_num",
      labelWidth: 100,
      fieldProps: {
        placeholder: "请输入",
      },
    },
    {
      label: "净含量平均值",
      labelWidth: 100,
      prop: "net_ret",
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
            label: item.name,
            value: item.id,
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
          if (event) {
            // 查找检验员名称
            const matchingCheckUser: any = checkUserOptions.value?.find(
              (item) => item.value === event,
            );
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
      label: "批号",
      prop: "batch_num",
      slot: "batch_num",
      minWidth: 140,
      fixed: true,
    },
    {
      label: "Brix(%)",
      prop: "Brix",
      slot: "Brix",
      minWidth: 140,
      headerRenderer: () => (
        <ul>
          <li>{tableLableOptions.value?.Brix?.name || "Brix"}</li>
          <li>{tableLableOptions.value?.Brix?.initval}</li>
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
          <li>{tableLableOptions.value?.pH?.name || "pH"}</li>
          <li>{tableLableOptions.value?.pH?.initval}</li>
        </ul>
      ),
    },
    {
      label: "液位",
      prop: "net",
      slot: "net",
      minWidth: 140,
    },
    {
      label: "内压（Mpa）",
      prop: "pressure",
      slot: "pressure",
      minWidth: 140,
      headerRenderer: () => (
        <ul>
          <li>{tableLableOptions.value?.pressure?.name || "内压（Mpa）"}</li>
          <li>{tableLableOptions.value?.pressure?.initval}</li>
        </ul>
      ),
    },
    {
      label: "温度（℃）",
      prop: "temperature",
      slot: "temperature",
      minWidth: 140,
      hide: () => formData.value.brand != "ND2", // 红牛不显示，战马显示
    },
    {
      label: "色泽",
      prop: "color",
      slot: "color",
      minWidth: 140,
    },
    {
      label: "滋味气味",
      prop: "scent",
      slot: "scent",
      minWidth: 140,
      hide: () => formData.value.brand != "ND2", // 战马显示
    },
    {
      label: "组织状态",
      prop: "group_status",
      slot: "group_status",
      minWidth: 140,
      hide: () => formData.value.brand != "ND2", // 战马显示
    },
    {
      label: "杂质",
      prop: "impurity",
      slot: "impurity",
      minWidth: 140,
      hide: () => formData.value.brand != "ND2", // 战马显示
    },
    {
      label: "味道",
      prop: "taste",
      slot: "taste",
      minWidth: 140,
      hide: () => formData.value.brand != "ND1", // 红牛显示
    },
    {
      label: "纯净度",
      prop: "purity",
      slot: "purity",
      minWidth: 140,
      hide: () => formData.value.brand != "ND1", // 红牛显示
    },
    {
      label: "迭接长度",
      prop: "overlap",
      slot: "overlap",
      minWidth: 140,
      headerRenderer: () => (
        <ul>
          <li>{tableLableOptions.value?.overlap?.name || "迭接长度"}</li>
          <li>{tableLableOptions.value?.overlap?.initval}</li>
        </ul>
      ),
    },
    {
      label: "迭接率%",
      prop: "overlap_rate",
      slot: "overlap_rate",
      minWidth: 140,
      headerRenderer: () => (
        <ul>
          <li>{tableLableOptions.value?.overlap_rate?.name || "迭接率%"}</li>
          <li>{tableLableOptions.value?.overlap_rate?.initval}</li>
        </ul>
      ),
    },
    {
      label: "盖钩顶隙",
      prop: "end_hook_clearance",
      slot: "end_hook_clearance",
      minWidth: 140,
      headerRenderer: () => (
        <ul>
          <li>{tableLableOptions.value?.end_hook_clearance?.name || "盖钩顶隙"}</li>
          <li>{tableLableOptions.value?.end_hook_clearance?.initval}</li>
        </ul>
      ),
    },
    {
      label: "罐钩顶隙",
      prop: "body_hook_clearance",
      slot: "body_hook_clearance",
      minWidth: 140,
      headerRenderer: () => (
        <ul>
          <li>{tableLableOptions.value?.body_hook_clearance?.name || "罐钩顶隙"}</li>
          <li>{tableLableOptions.value?.body_hook_clearance?.initval}</li>
        </ul>
      ),
    },
    {
      label: "紧密度",
      prop: "density",
      slot: "density",
      minWidth: 140,
      hide: () => formData.value.brand != "ND2", // 战马显示
      headerRenderer: () => (
        <ul>
          <li>{tableLableOptions.value?.density?.name || "紧密度"}</li>
          <li>{tableLableOptions.value?.density?.initval}</li>
        </ul>
      ),
    },
    {
      label: "皱纹度",
      prop: "wrinkle",
      slot: "wrinkle",
      minWidth: 140,
      hide: () => formData.value.brand != "ND1", // 红牛显示
      headerRenderer: () => (
        <ul>
          <li>{tableLableOptions.value?.wrinkle?.name || "皱纹度"}</li>
          <li>{tableLableOptions.value?.wrinkle?.initval}</li>
        </ul>
      ),
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
      check_json: [
        {
          overlap: "",
          overlap_rate: "",
          end_hook_clearance: "",
          body_hook_clearance: "",
        },
        {
          overlap: "",
          overlap_rate: "",
          end_hook_clearance: "",
          body_hook_clearance: "",
        },
        {
          overlap: "",
          overlap_rate: "",
          end_hook_clearance: "",
          body_hook_clearance: "",
        },
      ],
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
  const checkFormRules = {
    // 检验时间
    check_time: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
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
            // if (count.length >= 2) {
            //   callback(new Error("批号重复"));
            // }
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
    // 液位
    net: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写液位"));
            }
            callback();
          }
        },
      },
    ],
    // 内压
    pressure: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["pressure"];
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
    // 温度
    temperature: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写温度"));
            }
            callback();
          }
        },
      },
    ],
    // 色泽
    color: [
      {
        required: is_submit,
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
    // 滋味气味
    scent: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择滋味气味结果"));
            }
            callback();
          }
        },
      },
    ],
    // 组织状态
    group_status: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择组织状态结果"));
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
    // 味道
    taste: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择味道结果"));
            }
            callback();
          }
        },
      },
    ],
    // 纯净度
    purity: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          if ([0, 1].includes(value)) {
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请选择纯净度结果"));
            }
            callback();
          }
        },
      },
    ],

    // 迭接长度
    overlap: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["overlap"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写迭接长度"));
            }
            callback();
          }
        },
      },
    ],
    // 迭接率
    overlap_rate: [
      {
        required: is_submit,
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
              callback(new Error("请填写迭接率"));
            }
            callback();
          }
        },
      },
    ],
    // 盖钩顶隙
    end_hook_clearance: [
      {
        required: is_submit,
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
              callback(new Error("请填写盖钩顶隙"));
            }
            callback();
          }
        },
      },
    ],
    // 罐钩顶隙
    body_hook_clearance: [
      {
        required: is_submit,
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
              callback(new Error("请填写罐钩顶隙"));
            }
            callback();
          }
        },
      },
    ],
    // 紧密度
    density: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["density"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写紧密度"));
            }
            callback();
          }
        },
      },
    ],
    // 皱纹度
    wrinkle: [
      {
        required: is_submit,
        validator: (rule: any, value: any, callback: any) => {
          let { field } = rule;
          let isOk = true;
          initErrorCountMap(isOk, field); // 初始化错误数量
          if (value) {
            let ruleItem: any = tableLableOptions.value["wrinkle"];
            isOk = validatorCell(ruleItem, value);
            initErrorCountMap(isOk, field); // 统计错误数量
            callback();
          } else {
            if (is_submit.value) {
              callback(new Error("请填写皱纹度"));
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
    disabledSku,
  };
}
