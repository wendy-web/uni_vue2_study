import { ElImage, FormInstance } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import dayjs from "dayjs";
// 下拉框的公共接口
import { useCommonHooks } from "@/hooks/quality/index";
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();
const { validatorCell } = useCommonHooks();
const {
  statusOptions,
  getVersionMap,
  getLineList,
  getBrandMap,
  getUserList,
  getStatusText,
  getSupList,
  getSkuMap,
} = useselectData();
const useSetting = useSettingsStoreHook();

export function useAdd() {
  const supplyOptions = ref<any>([]); // 供应商下拉选项
  const suppliersMap = ref({});
  // 获取公共下拉框数据配置
  async function initBaseData() {
    supplyOptions.value = await getSupList();
    console.log("delay nomore:", supplyOptions.value);
    suppliersMap.value = supplyOptions.value.reduce((map: any, supplier: any) => {
      map[supplier.value] = supplier.name;
      return map;
    }, {} as any);
  }
  /** 1是新建,2是编辑 */
  const pageType = ref(1);
  const editDisabled = computed(() => {
    return pageType.value === 3;
  });
  /** add表单数据 */
  const formData = ref({
    order_no: "", // 单据编号
    batch_no: "", // 生产批号
    pack_no: "", // 包号
    brand: "ND1", //产品大类
    sku: "", //产品类型
    check_date: dayjs().format("YYYY-MM-DD"), //检测日期
    version_id: "", //版本id
    version_name: "", //版本名称
    line_id: "", // 空罐线别
    check_user_id: userStore.uid as number, //检测员id
    check_user_name: userStore.nickname, //检测员名称
    check_sign: "", // 检验员签字
    ct_name: "", // 创建人
    remark: "", // 备注
    checkinfo: [] as any, // 检测数据信息
    total: 0, // 总检查项
    status: 0, //单据状态
    files: [], //文件数据
    logs: [], //日志信息
    create_time: "",
    ct_uid: undefined as FormNumType,
    dept_id: undefined as FormNumType,
    order_status: "",
    oid: "",
  });

  /** 如果是提交则设为true,表示必填 */
  const is_submit = ref(false);

  /** add表单验证规则 */
  const formRules = {
    order_no: [
      {
        required: true,
        message: "请输入生产批号",
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
    version_id: [
      {
        required: true,
        message: "请选择版本",
      },
    ],
    line_id: [
      {
        required: true,
        message: "请选择空罐线别",
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
    check_user_id: [
      {
        required: true,
        message: "请选择确认人",
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
      label: "生产批号",
      prop: "batch_no",
      fieldProps: {
        placeholder: "请输入生产批号",
      },
    },
    {
      label: "包号",
      prop: "pack_no",
      fieldProps: {
        placeholder: "请填写检验信息",
        disabled: true,
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
        placeholder: "请选择产品类型",
      },
      // 产品类型要根据 产品大类筛选过滤
      options: getSkuMap(formData.value.brand),
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
      options: getVersionMap(),
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
      options: getLineList(),
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
        disabled: true,
      },
      options: getBrandMap(),
    },

    {
      label: "确认人",
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
      options: getUserList(),
    },
    {
      label: "确认人签字",
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
    // {
    //   label: "复核员签名",
    //   prop: "recheck",
    //   labelWidth: 90,
    //   hideInForm: computed(() => pageType.value !== 3),
    //   renderField: (value: any) => {
    //     let list =
    //       value.length > 0
    //         ? (value as any[]).map((el) => useSetting.baseHttp + el.recheck_sign)
    //         : [];
    //     return (
    //       <>
    //         {list.length > 0 ? (
    //           list.map((item, index) => {
    //             return (
    //               <ElImage
    //                 style="width: 60px; height: 60px;margin-right:8px;"
    //                 src={item}
    //                 preview-src-list={list}
    //                 initial-index={index}
    //               />
    //             );
    //           })
    //         ) : (
    //           <span class="text-gray-400">暂无~</span>
    //         )}
    //       </>
    //     );
    //   },
    // },
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
      label: "生产批号",
      prop: "batch_no",
      slot: "batch_no",
      fixed: "left",
    },
    {
      label: "包号",
      prop: "pack_no",
      slot: "pack_no",
      fixed: "left",
    },
    {
      label: "彩印铁厂家",
      prop: "print_factor_id",
      slot: "print_factor_id",
      minWidth: 150,
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
    });
    console.log("checkTableData.value:", checkTableData.value);
  }
  /** 删除表格的选中行 */
  function handleDelRow(row: any) {
    let ids = row.map((item: any) => item.unique_id || item.id);
    checkTableData.value = checkTableData.value.filter(
      (item) => !ids.includes(item.unique_id || item.id),
    );
  }

  /** 检验表格信息 */
  const checkFormRules = {
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
  /** 新增包号弹窗相关 start */
  const addPackNoDialogRef = ref();
  const addPackNoDialogVisible = ref(false);
  const addPackNoDialogLoading = ref(false);
  const packNoStartMin = ref(0); // 包号最小初始值
  const packNoEndMin = ref(0); // 包号最小结束值
  const addPackNoFormData = ref({
    pack_no_start: "", // 包号初始值：默认取列表最后一条的包号，再加一
    pack_no_end: "", // 包号结束值
    print_factor_id: "", // 彩印铁厂家id
    print_factor: "",
  });
  const addPackNoFormColumns: PlusColumnList = [
    {
      label: "包号",
      prop: "pack_no_start",
      valueType: "input-number",
      colProps: {
        span: 12,
      },
      fieldProps: computed(() => {
        return {
          placeholder: "请输入包号初始值",
          min: packNoStartMin.value,
        };
      })
    },
    {
      label: "————",
      prop: "pack_no_end",
      valueType: "input-number",
      colProps: {
        span: 12,
      },
      fieldProps: computed(() => {
        return {
          placeholder: "请输入包号结束值",
          disabled: !addPackNoFormData.value.pack_no_start,
          min: packNoEndMin.value,
        };
      }),
    },
    {
      label: "彩印铁厂家",
      prop: "print_factor_id",
      valueType: "select",
      labelWidth: 110,
      options: computed(() => {
        return supplyOptions.value;
      }),
      fieldProps: {
        placeholder: "请选择",
      },
    },
  ];
  const addPackNoFormRules = {
    pack_no_start: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            // 初始值必须大于结束值
            let { pack_no_end } = addPackNoFormData.value;
            if (pack_no_end && value >= pack_no_end) {
              callback(new Error("初始值必须小于结束值"));
            }
            callback();
          } else {
            callback();
          }
        },
      },
    ],
    pack_no_end: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            // 结束值必须大于初始值
            let { pack_no_start } = addPackNoFormData.value;
            if (value <= pack_no_start) {
              callback(new Error("结束值必须大于初始值"));
            }
            callback();
          } else {
            callback();
          }
        },
      },
    ],
    print_factor_id: [
      {
        required: true,
        message: "请选择彩印铁厂家",
      },
    ],
  };
  /** 新增包号弹窗相关 end */

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
    statusOptions,
    handleDelRow,
    checkTableForm,
    checkFormRules,
    is_submit,
    validatorCell,
    updateBatchNo,
    getStatusText,
    getSupList,
    suppliersMap,
    supplyOptions,
    initBaseData,
    addPackNoDialogRef,
    addPackNoDialogVisible,
    addPackNoDialogLoading,
    addPackNoFormColumns,
    addPackNoFormRules,
    addPackNoFormData,
    packNoStartMin,
    packNoEndMin
  };
}
