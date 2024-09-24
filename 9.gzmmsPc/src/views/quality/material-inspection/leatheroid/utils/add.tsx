import { type TableColumnCtx, type TableInstance } from "element-plus";
import { ElImage, ElInput } from "element-plus";
import { useFavicon } from "@vueuse/core";
import dayjs from "dayjs";
import { getImgConfigMapApi, getTabelLabelApi } from "@/api/quality/common";
import type { TableDataType } from "@/api/quality/material-inspection/leatheroid/types";
import { onlyIntp, onlyNumPoint } from "@/utils/index";
import type { fieldConfigType } from "@/hooks/quality/index";
import { useCommonHooks } from "@/hooks/quality/index";
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useUserStoreHook } from "@/store/modules/user";

/** 尺寸字段的congif配置类型&输入尺寸实际值的表格数据类型  */
export type PaperSizeListType = {
  key: string;
  name: string;
  measuredValue: string;
} & fieldConfigType;

export type SizeColumnType = {
  paper_size_v1?: string;
  paper_size_v2?: string;
  paper_size_v3?: string;
  paper_size_v4?: string;
  paper_size_v5?: string;
  paper_size_v6?: string;
  paper_size_v7?: string;
  paper_size_v8?: string;
  paper_size_v9?: string;
  paper_size_v10?: string;
};

type tableCheckObjType = {
  [key: string]: number;
};

export function useAdd() {
  const { validatorCell } = useCommonHooks();
  const useSetting = useSettingsStoreHook();
  const useUser = useUserStoreHook();

  const {
    getBrandMap,
    getSkuMap,
    getSupList,
    getUserList,
    getVersionMap,
    getStatusText,
    passList,
    workshopOptions,
    skuList,
    basePassList,
  } = useselectData();
  /** 记录接口返回的标准配置 */
  const configData = ref();
  const weightConfig = ref<fieldConfigType>();
  /** 记录接口返回的箱内二维码--长度配置 */
  const barcodeLengthConfig = ref<fieldConfigType>();
  /** 记录接口返回的箱内二维码--宽度配置 */
  const barcodewidthConfig = ref<fieldConfigType>();
  /** 记录接口返回的尺寸配置并转为了,适用的数组 */
  const paperSizeList = ref<PaperSizeListType[]>([]);

  /** 纸皮图片的显示链接 */
  const singImgUrl = computed(() => {
    return baseForm.value.singImg ? useSetting.baseHttp + baseForm.value.singImg : "";
  });

  /** 检验员签名图片的显示链接 */
  const checkSignatureImgUrl = computed(() => {
    return baseForm.value.check_user_signature
      ? useSetting.baseHttp + baseForm.value.check_user_signature
      : "";
  });

  /** 复核员签名图片的显示链接 */
  const reviewSignatureImgUrl = computed(() => {
    return baseForm.value.reviewer_user_signature
      ? useSetting.baseHttp + baseForm.value.reviewer_user_signature
      : "";
  });

  /** 1是新建,2是编辑 3是详情 */
  const pageType = ref(1);
  const isDetailDisable = computed(() => {
    return pageType.value === 3;
  });

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
    version_id: undefined as FormNumType, //版本id
    class: undefined as FormNumType, //产品类别
    num: undefined as FormNumType, //数量
    system_serial_number: "", //流水号
    // check_uid: undefined as FormNumType, //检验员id
    check_uid: useUser.uid, //检验员id
    workshop: undefined as FormNumType, //车间
    singImg: "", //纸皮配置图片-保存剔除
    paper_id: undefined as FormNumType, //纸皮id
    check_res: undefined as FormNumType, //检验结果
    check_user_signature: "", //检验员的签名图片
    reviewer_user_signature: "", //复核员签名图片
    note: "", //备注
  });

  /** 表格表单数据 */
  const tableForm = reactive({
    check_view: "", //检验意见
    tableData: [] as TableDataType[],
  });

  /** 表格数据 */
  const { tableData, check_view } = toRefs(tableForm);

  /** 获取纸皮配置图片 */
  async function getImgConfig() {
    let data = {
      type: 0,
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
    baseForm.value.singImg = result.data.can_body_img;
    baseForm.value.paper_id = result.data.id;
  }
  /** 获取标准配置 */
  async function getSettingConfig() {
    let data = {
      item: 5,
      sku: baseForm.value.sku,
      // brand: baseForm.value.brand,
      // workshop: baseForm.value.workshop,
    };
    const result = await getTabelLabelApi(data);
    configData.value = result.data;

    weightConfig.value = getFieldConfig("weight_res", result.data);

    barcodeLengthConfig.value = getFieldConfig("barcode_length", result.data);
    barcodewidthConfig.value = getFieldConfig("barcode_width", result.data);

    paperSizeList.value = getPaperSizeConfig(result.data);
    console.log("🚀 ~ getSettingConfig ~ paperSizeList.value:", paperSizeList.value);
  }

  /** 转换一下尺寸配置信息的格式 */
  function getPaperSizeConfig(data: any) {
    let list = [];
    for (const key in data) {
      if (data.hasOwnProperty(key) && key.includes("paper_size")) {
        list.push({
          key: data[key].key,
          type: data[key].type,
          unit: data[key].unit,
          initval: data[key].initval,
          default_val: data[key].default_val,
          error_limit_val: data[key].error_limit_val,
          lower_limit_val: data[key].lower_limit_val,
          upper_limit_val: data[key].upper_limit_val,
          name: data[key].name,
          measuredValue: "",
        });
      }
    }
    return list;
  }

  /** 根据字段来获取标准配置 */
  function getFieldConfig(field: string, data: any) {
    let { type, unit, lower_limit_val, upper_limit_val, default_val, initval, error_limit_val } =
      data[field];
    return { type, unit, lower_limit_val, upper_limit_val, default_val, initval, error_limit_val };
  }

  /** 当产品类型和产品大类change时触发 */
  function changeCheckConfig() {
    // if (baseForm.value.sku && baseForm.value.brand) {
    //   getSettingConfig();
    // }
    if (baseForm.value.sku) {
      getSettingConfig();
    }
  }

  /** 产品类别列表 */
  const classOptions = [
    {
      label: "箱内码",
      value: 1,
    },
    {
      label: "无箱内码",
      value: 2,
    },
  ];

  /** 附件表格数据 */
  const fileData = ref<any[]>([]);
  const logList = ref<any[]>([]);

  /** 顶部基础表单的数据的配置 */
  const baseColumns: PlusColumnList = [
    {
      label: "单据编号",
      prop: "order_no",
      valueType: "text",
      hideInForm: computed(() => pageType.value === 1),
      // fieldProps: {
      //   disabled: true,
      // },
    },
    {
      label: "单据状态",
      prop: "order_status",
      valueType: "text",
      hideInForm: computed(() => pageType.value === 1),
      // fieldProps: {
      //   disabled: true,
      // },
    },
    {
      label: "制单人",
      prop: "ct_name",
      valueType: "text",
      hideInForm: computed(() => pageType.value === 1),
      // fieldProps: {
      //   disabled: true,
      // },
    },
    {
      label: "创建时间",
      prop: "create_time",
      valueType: "text",
      hideInForm: computed(() => pageType.value === 1),
      // fieldProps: {
      //   disabled: true,
      // },
    },
    {
      label: "供应商",
      prop: "supplier_id",
      valueType: "select",
      options: getSupList,
      fieldProps: {
        filterable: true,
      },
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
      fieldProps: {
        onChange: async (val: string) => {
          await getSkuMap(val);
          baseForm.value.sku = skuList.value[0]?.value;
          changeCheckConfig();
        },
        filterable: true,
        clearable: false,
      },
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
          changeCheckConfig();
        },
        filterable: true,
        clearable: false,
        disabled: !baseForm.value.brand,
        placeholder: !baseForm.value.brand ? "请先选择产品大类" : "请选择产品类型",
      })),
    },
    {
      label: "数量",
      prop: "num",
      renderField: (value, onChange) => {
        let val = onlyIntp(value);
        return h(ElInput, {
          modelValue: val,
          onChange,
        });
      },
    },
    {
      label: "系统流水号",
      prop: "system_serial_number",
    },
    {
      label: "产品类别",
      prop: "class",
      valueType: "select",
      options: classOptions,
    },
    {
      label: "版本",
      prop: "version_id",
      valueType: "select",
      options: getVersionMap,
    },
    {
      label: "使用车间",
      prop: "workshop",
      valueType: "select",
      options: workshopOptions,
    },
    {
      label: "检验结果",
      prop: "check_res",
      valueType: "select",
      options: basePassList,
      fieldProps: {
        disabled: true,
      },
      tooltip: "自动判断: 合格,不合格,部分合格",
      // options: () => {
      //   return passList.map((item) => {
      //     return {
      //       label: item.name,
      //       value: item.id,
      //     };
      //   });
      // },
    },
    {
      label: "检验员",
      prop: "check_uid",
      valueType: "select",
      options: getUserList,
      fieldProps: {
        filterable: true,
        clearable: false,
      },
    },
    {
      label: "纸皮图片",
      prop: "signImg",
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
    num: [
      {
        required: true,
        message: "请输入数量",
      },
    ],
    system_serial_number: [
      {
        required: true,
        message: "请输入系统流水号",
      },
    ],
    class: [
      {
        required: true,
        message: "请选择产品类别",
      },
    ],
    version_id: [
      {
        required: true,
        message: "请选择版本",
      },
    ],
    check_uid: [
      {
        required: true,
        message: "请选择检验员",
      },
    ],
  };
  /** 如果是提交则设为true,表示必填 */
  const is_submit = ref(false);

  const tableRules = reactive({
    weight_res: [
      {
        required: is_submit,
        message: "请输入重量",
      },
    ],
    color_res: [
      {
        required: is_submit,
        // message: "请选择",
        message: "色泽是否合格",
      },
    ],
    red_bull_res: [
      {
        required: is_submit,
        // message: "请选择",
        message: "红牛标记是否合格",
      },
    ],
    warhorse_res: [
      {
        required: is_submit,
        // message: "请选择",
        message: "战马标记是否合格",
      },
    ],
    printing_quality_res: [
      {
        required: is_submit,
        // message: "请选择",
        message: "印刷质量是否合格",
      },
    ],
    opening_crack_res: [
      {
        required: is_submit,
        // message: "请选择",
        message: "开合裂度是否合格",
      },
    ],
    barcode_res: [
      {
        required: is_submit,
        // message: "请选择",
        message: "条形码是否合格",
      },
    ],
    laser_code_res: [
      {
        required: is_submit,
        // message: "请选择",
        message: "激光码是否合格",
      },
    ],
    laser_qr_code_res: [
      {
        required: is_submit,
        // message: "请选择",
        message: "激光码二维码是否合格",
      },
    ],
    position_res: [
      {
        required: is_submit,
        // message: "请选择",
        message: "位置是否合格",
      },
    ],
    barcode_length: [
      {
        required: is_submit,
        // message: "请选择",
        message: "请输入长度",
      },
    ],
    barcode_width: [
      {
        required: is_submit,
        // message: "请选择",
        message: "请输入宽度",
      },
    ],
    scan_reading_res: [
      {
        required: is_submit,
        // message: "请选择",
        message: "扫读是否合格",
      },
    ],
  });

  const tableColumns = ref<TableColumnList>([
    {
      label: "勾选列",
      type: "selection",
      hide: () => isDetailDisable.value,
      width: 50,
    },
    {
      label: "样品号",
      type: "index",
      width: 90,
    },
    {
      label: "尺寸(mm)",
      prop: "custom_size",
      slot: "custom_size",
    },
    {
      label: "重量g",
      prop: "weight_res",
      slot: "weight_res",
      headerRenderer: () => (
        <ul>
          <li>重量({weightConfig.value?.unit ? weightConfig.value?.unit : "g"})</li>
          <li>{weightConfig.value?.initval}</li>
        </ul>
      ),
    },
    {
      label: "色泽",
      prop: "color_res",
      slot: "color_res",
    },
    {
      label: "红牛标记",
      prop: "red_bull_res",
      slot: "red_bull_res",
      hide: () => baseForm.value.brand !== "ND1",
    },
    {
      label: "战马标记",
      prop: "warhorse_res",
      slot: "warhorse_res",
      hide: () => baseForm.value.brand !== "ND2",
    },
    {
      label: "印刷质量",
      prop: "printing_quality_res",
      slot: "printing_quality_res",
    },
    {
      label: "开合裂度",
      prop: "opening_crack_res",
      slot: "opening_crack_res",
      hide: () => baseForm.value.brand !== "ND2",
    },
    {
      label: "条形码",
      prop: "barcode_res",
      slot: "barcode_res",
      hide: () => baseForm.value.brand !== "ND2",
    },
    {
      label: "激光码",
      prop: "laser_code_res",
      slot: "laser_code_res",
      hide: () => baseForm.value.brand !== "ND2",
    },
    {
      label: "激光码、二维码",
      prop: "laser_qr_code_res",
      slot: "laser_qr_code_res",
      hide: () => baseForm.value.brand !== "ND1",
      headerRenderer: () => (
        <ul>
          <li>激光码</li>
          <li>二维码</li>
        </ul>
      ),
    },
    {
      label: "箱内二维码",
      align: "center",
      hide: () => baseForm.value.class !== 1,
      children: [
        {
          label: "位置",
          prop: "position_res",
          slot: "position_res",
        },
        {
          label: "大小mm(标准值)",
          prop: "barcode_length",
          slot: "barcode_length",
          headerRenderer: () => (
            <ul>
              <li>
                大小({barcodeLengthConfig.value?.unit ? barcodeLengthConfig.value?.unit : "mm"})
              </li>
              <li>
                {barcodeLengthConfig.value?.initval} x {barcodewidthConfig.value?.initval}
              </li>
            </ul>
          ),
        },
        {
          label: "扫读",
          prop: "scan_reading_res",
          slot: "scan_reading_res",
        },
      ],
    },
  ]);

  /** 明细puretable的ref */
  const prueTableRef = ref();
  /** 明细表格的ref */
  const tableRef = computed<TableInstance>(() => {
    return prueTableRef.value?.getTableRef();
  });

  const tableCheckObj = ref<tableCheckObjType>({});

  /* 明细底部结果展示处理 */
  interface Product {
    color_res: number;
    red_bull_res: number;
    warhorse_res: number;
    printing_quality_res: number;
    opening_crack_res: number;
    barcode_res: number;
    laser_code_res: number;
    laser_qr_code_res: number;
    custom_size_res: number[];
    position_res: number;
    scan_reading_res: number;
    barcode_length: string;
    barcode_width: string;
  }

  interface SummaryMethodProps<T = Product> {
    columns: TableColumnCtx<T>[];
    data: T[];
  }
  const getSummaries = (param: SummaryMethodProps) => {
    const { columns, data } = param;
    const sums: string[] = [];
    columns.forEach((column, index) => {
      if (index === 0) {
        //如果是第一列
        sums[index] = "检验结果";
        if (isDetailDisable.value) return;
        nextTick(() => {
          if (tableRef.value.$el) {
            let current = tableRef.value.$el
              .querySelector(".el-table__footer-wrapper")
              .querySelector(".el-table__footer");
            let cell = current.rows[0].cells;
            cell[0].style.textAlign = "center"; // 合计行第一列字段居中显示。
            cell[1].style.display = "none";
            cell[0].colSpan = "2"; // 合并单元格
          }
        });
      } else {
        let propList = [
          "weight_res",
          "color_res",
          "red_bull_res",
          "warhorse_res",
          "printing_quality_res",
          "opening_crack_res",
          "barcode_res",
          "laser_code_res",
          "laser_qr_code_res",
          "custom_size",
          "position_res",
          "scan_reading_res",
          "barcode_length",
        ];
        if (propList.includes(column.property)) {
          if (column.property === "custom_size") {
            const sizeValues = data.map((item) => item["custom_size_res"]).flat();
            let isUndetected = sizeValues.every((item) => item === -1);
            if (sizeValues.length === 0 || isUndetected) {
              // 如果为0,  表示没有输入数据
              sums[index] = "";
              tableCheckObj.value[column.property] = -1;
            } else {
              // 只要有一个不合格的即为不合格
              let sizeCheckRes = sizeValues.some((item) => !item);
              sums[index] = sizeCheckRes ? "不合格" : "合格";
              tableCheckObj.value[column.property] = sizeCheckRes ? 0 : 1;
              setSumsOrange(sizeCheckRes, index);
            }
          } else if (column.property === "barcode_length") {
            // 长度
            const barcode_length_list = data.map((item) => item["barcode_length"]);
            // 宽度
            const barcode_width_list = data.map((item) => item["barcode_width"]);
            let allValueList = [...barcode_length_list, ...barcode_width_list];
           
            let isUndetected = allValueList.some(
              (item) => item === undefined || item === "" || item === null,
            );
            if (isUndetected) {
              sums[index] = "";
              tableCheckObj.value[column.property] = -1;
              return;
            }
            let barcode_length_res = barcode_length_list.some(
              (item) => !validatorCell(barcodeLengthConfig.value, item + ""),
            );

            let barcode_width_res = barcode_width_list.some(
              (item) => !validatorCell(barcodewidthConfig.value, item + ""),
            );

            let checkRes = barcode_length_res || barcode_width_res;

            sums[index] = checkRes ? "不合格" : "合格";
            setSumsOrange(checkRes, index);
            tableCheckObj.value[column.property] = checkRes ? 0 : 1;
          } else {
            const values = data.map((item) => item[column.property as keyof Product]);
            if (!values.every((value) => value === undefined || value === null)) {
              if (column.property === "weight_res") {
                // 如果是重量  只要有一个不合格的即为不合格
                let someRes = values.some((item) => !validatorCell(weightConfig.value, item + ""));
                sums[index] = someRes ? "不合格" : "合格";
                setSumsOrange(someRes, index);
                tableCheckObj.value[column.property] = someRes ? 0 : 1;
              } else {
                let someRes = values.some((item) => item === 0);
                sums[index] = someRes ? "不合格" : "合格";
                setSumsOrange(someRes, index);
                tableCheckObj.value[column.property] = someRes ? 0 : 1;
              }
            } else {
              sums[index] = "";
              tableCheckObj.value[column.property] = -1;
            }
          }
        } else {
          sums[index] = "";
        }
      }
    });

    return sums;
  };

  function setSumsOrange(checkRes: boolean, index: number) {
    nextTick(() => {
      if (tableRef.value.$el) {
        let current = tableRef.value.$el
          .querySelector(".el-table__footer-wrapper")
          .querySelector(".el-table__footer");
        let cell = current.rows[0].cells;
        if (!checkRes) {
          cell[index].classList.remove("!text-orange-500");
        } else {
          cell[index].classList.add("!text-orange-500");
        }
      }
    });
  }

  function checkSizeValue(rule: any, value: any, callback: any, row: any) {
    let paper_size_list = [];
    for (let i = 1; i <= 10; i++) {
      const variableName = `paper_size_v${i}`;
      paper_size_list.push(row[variableName]);
    }
    let list = paper_size_list.filter((item) => {
      return typeof item === "string" && item.trim() !== "";
    });

    if (list.length >= 10) {
      callback();
    } else {
      callback(new Error("请将实测值填写完整"));
    }
  }

  return {
    baseForm,
    baseColumns,
    tableColumns,
    tableForm,
    tableData,
    passList,
    getSummaries,
    prueTableRef,
    logList,
    fileData,
    baseRules,
    singImgUrl,
    paperSizeList,
    check_view,
    getImgConfig,
    getSettingConfig,
    pageType,
    getStatusText,
    checkSignatureImgUrl,
    reviewSignatureImgUrl,
    tableRules,
    is_submit,
    useSetting,
    isDetailDisable,
    weightConfig,
    barcodeLengthConfig,
    barcodewidthConfig,
    getSkuMap,
    checkSizeValue,
    tableCheckObj,
  };
}
