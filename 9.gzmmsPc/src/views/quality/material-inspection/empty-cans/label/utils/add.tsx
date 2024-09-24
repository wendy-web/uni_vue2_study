import { ElImage } from "element-plus";
import dayjs from "dayjs";
import { getImgConfigMapApi } from "@/api/quality/common";
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useUserStoreHook } from "@/store/modules/user";

/** 新建/编辑/详情--检验信息表格的数据类型 */
export type TableDataType = {
  id: number | string;
  check_time?: string; //检验时间
  batch_no?: string; //生产批号
  packet_number?: number; //生产包号
  color_res?: number; //颜色
  trademark_res?: number; //注册商标
  layout_structure_res?: number; // 版面结构
  health_food_mark_res?: number; //保健食品标识
  mandatory_logo_res?: number; //强制标识内容
  barcode_res?: number; //条形码
  version_id?: number; //版本号
  qr_code_res?: number; //二维码
  note?: string; //备注
};

export function useAdd() {
  const useSetting = useSettingsStoreHook();
  const useUser = useUserStoreHook();
  const {
    getBrandMap,
    getSkuMap,
    getSupList,
    getUserList,
    getStatusText,
    getVersionList,
    passList,
    skuList,
    basePassList,
    getVersionMap

  } = useselectData();

  /**  顶部基础表单的数据 */
  const baseForm = ref({
    order_no: "", //单据编号-保存剔除
    // 状态；0：暂存；1：待审核；2：已审核；3：已驳回；4：已撤回；5：已反审；
    order_status: "", //单据状态-保存剔除
    ct_name: "", //制单人-保存剔除
    create_time: "", //创建时间-保存剔除
    supplier_id: undefined as FormNumType, //供应商id
    brand: "", // 产品大类(产品品牌)
    check_time: "", //检验日期
    pro_time: "", //生产日期
    sku: "", //产品类型
    batch_no: "", //生产批号
    // check_uid: undefined as FormNumType, //检验员id
    check_uid: useUser.uid, //检验员id
    check_res: 3 as FormNumType, //检验结果
    check_user_signature: "", //检验员的签名图片
    reviewer_user_signature: "", //复核员签名图片
    note: "", //备注
    paper_id: undefined as FormNumType, //图片id
    top_cover_img: "", //顶盖图片地址
    can_body_img: "", //罐身图片地址
    bottom_cover_img: "", //底盖图片地址
    version_id: undefined as FormNumType, //版本id
  });

  /** 1是新建,2是编辑 3是详情 */
  const pageType = ref(1);
  const isDetailDisable = computed(() => {
    return pageType.value === 3;
  });

  const tableForm = reactive({
    tableData: [] as any[],
  });

  const isDisabled = computed(() => {
    return tableData.value.length > 0;
  });

  const { tableData } = toRefs(tableForm);
  /** 组合顶盖/罐身/底盖三张图的图片数组 */
  const multipleImgUrl = computed(() => {
    let top_cover_img = baseForm.value.top_cover_img;
    let can_body_img = baseForm.value.can_body_img;
    let bottom_cover_img = baseForm.value.bottom_cover_img;
    top_cover_img = top_cover_img ? useSetting.baseHttp + top_cover_img : "";
    can_body_img = can_body_img ? useSetting.baseHttp + can_body_img : "";
    bottom_cover_img = bottom_cover_img ? useSetting.baseHttp + bottom_cover_img : "";
    let arr = [top_cover_img, can_body_img, bottom_cover_img].filter((item) => {
      return !!item;
    });

    return arr;
  });

  /** 获取纸皮配置图片 */
  async function getImgConfig() {
    let data = {
      type: 1,
      class_type: baseForm.value.sku,
      version_id: baseForm.value.version_id,
    };
    const result = await getImgConfigMapApi(data);
    if (!result.data) {
      ElMessageBox.confirm(`该产品未设置配置图片`, "警告", {
        confirmButtonText: "我知道了",
        showCancelButton: false,
        type: "warning",
      }).then(() => {
        console.log("点击了");
      });
    }
    baseForm.value.top_cover_img = result.data.top_cover_img;
    baseForm.value.can_body_img = result.data.can_body_img;
    baseForm.value.bottom_cover_img = result.data.bottom_cover_img;
    baseForm.value.paper_id = result.data.id;
  }

  /** 顶部基础表单的数据的配置 */
  const baseColumns: PlusColumnList = [
    {
      label: "单据编号",
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
      label: "供应商",
      prop: "supplier_id",
      valueType: "select",
      options: getSupList,
      fieldProps: computed(() => ({ disabled: isDisabled.value, filterable: true })),
    },
    {
      label: "生产日期",
      prop: "pro_time",
      valueType: "date-picker",
      fieldProps: {
        type: "date",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        disabledDate: (date: string) => {
          return dayjs().isBefore(date);
        },
      },
    },
    {
      label: "检验日期",
      prop: "check_time",
      valueType: "date-picker",
      fieldProps: {
        type: "date",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        disabledDate: (date: string) => {
          return dayjs().isBefore(date);
        },
      },
    },
    {
      label: "产品大类",
      prop: "brand",
      valueType: "select",
      options: getBrandMap,
      fieldProps: computed(() => ({
        onChange: async (val: string) => {
          await getSkuMap(val);
          baseForm.value.sku = skuList.value[0]?.value;
          // getImgConfig();
        },
        filterable: true,
        clearable: false,
        disabled: isDisabled.value,
      })),
    },
    {
      label: "产品类型",
      prop: "sku",
      valueType: "select",
      options: computed(() => {
        return skuList.value;
      }),
      fieldProps: computed(() => ({
        onChange: () => {
          console.log("产品类型onChange");
          // getImgConfig();
        },
        filterable: true,
        clearable: false,
        disabled: isDisabled.value || !baseForm.value.brand,
        placeholder: !baseForm.value.brand ? "请先选择产品大类" : "请选择产品类型",
      })),
    },
    {
      label: "版本号",
      prop: "version_id",
      valueType: "select",
      options: getVersionMap,
      fieldProps: computed(() => ({
        
        filterable: true,
        clearable: false,
        disabled: !baseForm.value.brand&&!baseForm.value.sku,
        placeholder: !baseForm.value.brand&&!baseForm.value.sku ? "请先选择产品大类、产品类型" : "请选择版本号",
      })),
    },
    {
      label: "生产批号",
      prop: "batch_no",
      fieldProps: computed(() => ({ disabled: isDisabled.value })),
    },
    {
      label: "检验结果",
      prop: "check_res",
      valueType: "select",
      // options: () => {
      //   return passList.map((item) => {
      //     return {
      //       label: item.name,
      //       value: item.id,
      //     };
      //   });
      // },
      options: basePassList,
      fieldProps: {
        disabled: true,
      },
      tooltip: "自动判断: 合格,不合格,部分合格",
    },
    {
      label: "检验员",
      prop: "check_uid",
      valueType: "select",
      options: getUserList,
      fieldProps: computed(() => ({
        disabled: isDisabled.value,
        filterable: true,
        clearable: false,
      })),
    },
    {
      label: "标签标识图片",
      prop: "paper_id",
      labelWidth: 120,
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
      label: "复核员签名图片",
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

  /** 基础信息表单验证规则 */
  const baseRules = {
    supplier_id: [
      {
        required: true,
        message: "请选择供应商",
      },
    ],
    pro_time: [
      {
        required: true,
        message: "请选择生产日期",
      },
    ],
    check_time: [
      {
        required: true,
        message: "请选择检验日期",
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
    version_id: [
      {
        required: true,
        message: "请选择版本号",
      },
    ],
    batch_no: [
      {
        required: true,
        message: "请输入生成批号",
      },
    ],
    check_uid: [
      {
        required: true,
        message: "请选择检验员",
      },
    ],
  };

  const tableColumns = ref<TableColumnList>([
    {
      label: "勾选列",
      type: "selection",
      hide: () => isDetailDisable.value,
    },
    {
      label: "#",
      type: "index",
      width: 70,
    },
    {
      label: "检验时间",
      prop: "check_time",
      slot: "check_time",
    },
    {
      label: "生产批号",
      prop: "batch_no",
      slot: "batch_no",
      cellRenderer: ({ row }) => {
        return row.batch_no || "";
      },
    },
    {
      label: "生产包号",
      prop: "packet_number",
      slot: "packet_number",
    },
    {
      label: "颜色",
      prop: "color_res",
      slot: "color_res",
    },
    {
      label: "注册商标",
      prop: "trademark_res",
      slot: "trademark_res",
    },
    {
      label: "版面结构",
      prop: "layout_structure_res",
      slot: "layout_structure_res",
    },
    {
      label: "保健食品标识",
      prop: "health_food_mark_res",
      slot: "health_food_mark_res",
    },
    {
      label: "强制标识内容",
      prop: "mandatory_logo_res",
      slot: "mandatory_logo_res",
    },
    {
      label: "条形码",
      prop: "barcode_res",
      slot: "barcode_res",
    },
    {
      label: "版本号",
      prop: "version_id",
      slot: "version_id",
    },
    {
      label: "二维码",
      prop: "qr_code_res",
      hide: () => baseForm.value.brand !== "ND1",
      slot: "qr_code_res",
    },
    {
      label: "备注",
      prop: "note",
      slot: "note",
    },
    {
      label: "检验结果",
      prop: "check_ret",
      slot: "check_ret",
    },
  ]);

  /** 如果是提交则设为true,表示必填 */
  const is_submit = ref(false);

  const tableRules = reactive({
    check_time: [
      {
        required: true,
        message: "请选择检验时间",
      },
    ],
    packet_number: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            // 判断列表里的包号是否重复
            let data = tableData.value;
            let count = data.filter((item) => item.packet_number === value);
            if (count.length >= 2) {
              callback(new Error("包号重复"));
            }
            callback();
          } else {
            callback(new Error("请输入包号"));
          }
        },
      },
    ],
    color_res: [
      {
        required: is_submit,
        message: "颜色是否合格",
      },
    ],
    trademark_res: [
      {
        required: is_submit,
        message: "注册商标是否合格",
      },
    ],
    layout_structure_res: [
      {
        required: is_submit,
        message: "版面结构是否合格",
      },
    ],
    health_food_mark_res: [
      {
        required: is_submit,
        message: "保健食品标识是否合格",
      },
    ],
    mandatory_logo_res: [
      {
        required: is_submit,
        message: "强制标识内容是否合格",
      },
    ],
    barcode_res: [
      {
        required: is_submit,
        message: "条形码是否合格",
      },
    ],
    version_id: [
      {
        required: is_submit,
        message: "请选择版本号",
      },
    ],
    qr_code_res: [
      {
        required: is_submit,
        message: "二维码是否合格",
      },
    ],
  });

  const fileData = ref<any[]>([]);
  const logList = ref<any[]>([]);

  return {
    baseForm,
    baseColumns,
    fileData,
    logList,
    tableForm,
    tableData,
    tableColumns,
    pageType,
    passList,
    baseRules,
    is_submit,
    getVersionList,
    tableRules,
    multipleImgUrl,
    getStatusText,
    useSetting,
    isDetailDisable,
    getSkuMap,
    getImgConfig
  };
}
