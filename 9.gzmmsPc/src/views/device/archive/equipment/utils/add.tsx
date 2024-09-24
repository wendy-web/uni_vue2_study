import { ElDatePicker, ElInput } from "element-plus";
import dayjs from "dayjs";
import type { PlusColumn, PlusFormGroupRow } from "plus-pro-components";
import { onlyInt, onlyIntp } from "@/utils/index";
import { useBaseData } from "@/hooks/device/baseData";
import { useUserStoreHook } from "@/store/modules/user";

export function useAdd(page = "add") {
  const userStore = useUserStoreHook();
  /* 如果page是detail则隐藏勾选列 */

  const {
    getBase,
    treeData,
    departmentList,
    placeList,
    lineList,
    eqipment_status,
    supplierList,
    userList,
    fileTypeList,
  } = useBaseData();

  /** add表单数据 */
  const formData = ref({
    asset_no: "", //设备编码
    bar_title: "", //资产名称
    brand: "", //设备品牌
    barcode: "", //资产条码
    spec: "", //设备规格型号
    equipment_type: "", //资产类型
    equipment_code: "", //资产编码
    power: "", //功率
    sn: "", // 序列号
    export_type: undefined as FormNumType, // 出口类型
    product_line: undefined as FormNumType, //所属产线
    note: "", //备注
    status: undefined as FormNumType, // 可用状态
    use_dept_id: undefined as FormNumType, // 使用部门
    duty_dept_id: undefined as FormNumType, // 责任部门
    use_duty_user: [] as number[], //使用负责人
    open_date: "", //启用日期
    use_year: undefined as FormNumType, //使用年限
    expire_date: "", // 预计到期
    // save_addr: undefined as FormNumType, //使用位置
    save_addr: [] as number[], //使用位置
    scrap_date: "", //报废日期
    scrap_reason: "", //报废原因
    supplier_id: undefined as FormNumType, //供应商id
    production_id: undefined as FormNumType, // 生产厂家id
    purchase_uid: undefined as FormNumType, // 采购人员id
    price: "0", // 原始价值
    spoiled_rate: "", //残存率
    depreciation_type: undefined as FormNumType, //折旧方法
  });

  const hideScrapList = [3, 4];
  const isHideScrap = (type = 1) => {
    // type: 1表示是否隐藏,2表示是否必填
    if (typeof formData.value.status === "undefined") {
      return type === 1 ? true : false;
    } else {
      return type === 1
        ? !hideScrapList.includes(formData.value.status)
        : hideScrapList.includes(formData.value.status);
    }
  };

  /** add表单验证规则 */
  const addRelus = {
    asset_no: [
      {
        required: true,
        trigger: "blur",
        validator: (rule: any, value: string, callback: any) => {
          if (!value) {
            callback(new Error("请输入设备编码"));
          } else if (value.length < 8) {
            callback(new Error("设备编码长度最低8位"));
          } else {
            callback();
          }
        },
      },
    ],
    bar_title: [
      {
        required: true,
        message: "请选择资产名称",
      },
    ],
    equipment_type: [
      {
        required: true,
        message: "请选择资产类型",
      },
    ],
    status: [
      {
        required: true,
        message: "请选择使用状态",
      },
    ],
    use_dept_id: [
      {
        required: true,
        message: "请选择使用部门",
      },
    ],
    use_duty_user: [
      {
        required: true,
        message: "请选择使用负责人",
      },
    ],
    open_date: [
      {
        required: true,
        message: "请选择启用日期",
      },
    ],
  };

  /** 添加页面使用的PlusForm表单数据 */
  const group: PlusFormGroupRow[] = [
    {
      title: "设备信息",
      columns: [
        {
          // label: "设备编码",
          label: userStore.module_type == 1 ? "设备编码" : "资产编码",
          prop: "asset_no",
          labelWidth: 130,
          fieldProps: {
            placeholder: "请输入",
            maxlength: 24
          },
          tooltip: "长度最低8位,最长24位,填写保存为唯一值",
        },
        {
          label: "资产名称",
          labelWidth: 100,
          prop: "bar_title",
          tooltip: "可输入资产条码或名称进行搜索",
        },
        {
          label: "资产条码",
          labelWidth: 90,
          prop: "barcode",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
          tooltip: "选择资产名称后自动填入资产条码",
        },
        {
          label: "品牌",
          prop: "brand",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
          tooltip: "选择资产名称后自动填入品牌",
        },
        {
          label: "型号",
          prop: "spec",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
          tooltip: "选择资产名称后自动填入型号",
        },
        {
          // label: "资产编码",
          label: userStore.module_type == 1 ? "资产编码" : "设备编码",
          prop: "equipment_code",
          fieldProps: {
            placeholder: "请输入",
          },
        },
        {
          label: "资产类型",
          labelWidth: 90,
          prop: "equipment_type",
        },
        {
          label: "功率(kw)",
          prop: "power",
          fieldProps: {
            placeholder: "请输入",
          },
        },
        {
          label: "序列号",
          prop: "sn",
          fieldProps: {
            placeholder: "请输入",
          },
        },
        {
          label: "国产/进口",
          prop: "export_type",
          valueType: "select",
          options: [
            {
              label: "国产",
              value: 1,
            },
            {
              label: "进口",
              value: 2,
            },
          ],
          fieldProps: {
            placeholder: "请选择",
          },
        },
        {
          label: "所属产线",
          prop: "product_line",
          valueType: "select",
          fieldProps: {
            placeholder: "请选择",
          },
          options: computed(() => {
            return lineList.value.map((item: any) => {
              return {
                label: item.name,
                value: item.id,
              };
            });
          }),
        },
        {
          label: "备注",
          prop: "note",
          fieldProps: {
            placeholder: "请输入",
          },
          colProps: {
            span: 16,
          },
        },
      ],
    },
    {
      title: "使用情况",
      columns: [
        {
          label: "使用状态",
          labelWidth: 90,
          prop: "status",
          valueType: "select",
          fieldProps: {
            placeholder: "请选择",
          },
          options: computed(() => {
            return eqipment_status.value.map((item: any) => {
              return {
                label: item.name,
                value: item.id,
              };
            });
          }),
        },
        {
          label: "使用部门",
          prop: "use_dept_id",
          labelWidth: 90,
        },
        {
          label: "责任部门",
          prop: "duty_dept_id",
        },
        {
          label: "使用负责人",
          labelWidth: 100,
          prop: "use_duty_user",
          valueType: "select",
          fieldProps: {
            placeholder: "请选择",
            multiple: true,
            multipleLimit: 2,
          },
          options: computed(() => {
            return userList.value.map((item: any) => {
              return {
                label: item.name,
                value: item.id,
              };
            });
          }),
        },
        {
          label: "启用日期",
          valueType: "date-picker",
          prop: "open_date",
          labelWidth: 90,
          fieldProps: {
            placeholder: "请选择启用日期",
            type: "date",
            format: "YYYY-MM-DD",
            valueFormat: "YYYY-MM-DD",
          },
        },
        {
          label: "使用年限(月)",
          labelWidth: 100,
          prop: "use_year",
          fieldProps: {
            placeholder: "请输入",
          },
          renderField: (value, onChange) => {
            let val = onlyIntp(value);
            return h(ElInput, {
              modelValue: val,
              onChange,
              onBlur() {
                if (formData.value.open_date) {
                  formData.value.expire_date = dayjs(formData.value.open_date)
                    .add(Number(value), "month")
                    .format("YYYY-MM-DD");
                }
              },
            });
            // return h(ElInput, {
            //   modelValue: formData.value.use_year,
            //   onInput(val) {
            //     onChange(onlyIntp(val));
            //   },
            // });
          },
        },
        {
          label: "预计到期",
          prop: "expire_date",
          fieldProps: {
            placeholder: "请输入",
          },
        },
        {
          label: "使用位置",
          prop: "save_addr",
        },
        {
          label: "报废日期",
          labelWidth: 100,
          valueType: "date-picker",
          prop: "scrap_date",
          fieldProps: {
            placeholder: "请选择报废日期",
            type: "date",
            format: "YYYY-MM-DD",
            valueFormat: "YYYY-MM-DD",
          },
          hideInForm: computed(() => isHideScrap(1)),
          formItemProps: computed(() => ({
            rules: [{ required: isHideScrap(2), message: "请选择报废日期" }],
          })),
        },
        {
          label: "报废原因",
          labelWidth: 100,
          prop: "scrap_reason",
          fieldProps: {
            placeholder: "请输入",
          },
          hideInForm: computed(() => isHideScrap(1)),
          formItemProps: computed(() => ({
            rules: [{ required: isHideScrap(2), message: "输入报废原因" }],
          })),
        },
      ],
    },
    {
      title: "购置信息",
      columns: [
        {
          label: "供应商",
          prop: "supplier_id",
          valueType: "select",
          fieldProps: {
            placeholder: "请选择",
          },
          options: computed(() => {
            return supplierList.value.map((item: any) => {
              return {
                label: item.name,
                value: item.id,
              };
            });
          }),
        },
        {
          label: "生产厂家",
          prop: "production_id",
          valueType: "select",
          fieldProps: {
            placeholder: "请选择",
          },
          options: computed(() => {
            return supplierList.value.map((item: any) => {
              return {
                label: item.name,
                value: item.id,
              };
            });
          }),
        },
        {
          label: "采购人员",
          prop: "purchase_uid",
          valueType: "select",
          fieldProps: {
            placeholder: "请选择",
          },
          options: computed(() => {
            return userList.value.map((item: any) => {
              return {
                label: item.name,
                value: item.id,
              };
            });
          }),
        },
        {
          label: "原始价值(元)",
          labelWidth: 100,
          valueType: "input-number",
          prop: "price",
          fieldProps: {
            placeholder: "请输入",
            controlsPosition: "right",
          },
        },
        {
          label: "残值率(%)",
          prop: "spoiled_rate",
          fieldProps: {
            placeholder: "请输入",
          },
          renderField: (_, onChange) => {
            return h(ElInput, {
              modelValue: formData.value.spoiled_rate,
              onInput(val) {
                onChange(onlyInt(val));
              },
            });
          },
        },
        {
          label: "残值",
          prop: "spolied",
          fieldProps: {
            placeholder: "请输入",
          },
        },
        {
          label: "折旧方法",
          prop: "depreciation_type",
          valueType: "select",
          fieldProps: {
            placeholder: "请选择",
          },
          options: [
            {
              label: "不计提折旧",
              value: 1,
            },
            {
              label: "平均年限法",
              value: 2,
            },
            {
              label: "年数总和法",
              value: 3,
            },
            {
              label: "双倍余额法",
              value: 4,
            },
          ],
        },
      ],
    },
  ];

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

  const fileUplodRules = {
    type: [
      {
        required: true,
        message: "请选择文件分类",
      },
    ],
    // file_name: [
    //   {
    //     required: true,
    //     message: "请上传文件",
    //   },
    // ],
  };

  /** 附件表格的columns */
  const fileColumns: TableColumnList = [
    {
      type: "selection",
      width: 60,
      label: "勾选列",
      fixed: "left",
      hide: page === "detail",
    },
    {
      label: "序号",
      type: "index",
      width: 60,
    },
    {
      label: "文件名",
      prop: "file_name",
      align: "center",
    },
    {
      label: "文件分类",
      prop: "type",
      align: "center",
      cellRenderer: (scope) => (
        <>
          <span>{getFileTypeText(scope.row.type)}</span>
        </>
      ),
    },
    {
      label: "上传时间",
      prop: "create_time",
      align: "center",
    },
    {
      label: "操作",
      slot: "operation",
      hide: page == "add",
    },
    // {
    //   label: "上传者",
    //   prop: "up_name",
    //   align: "center",
    // },
    // {
    //   label: "更新时间",
    //   prop: "update_time",
    //   align: "center",
    // },
    // {
    //   label: "更新人",
    //   prop: "up_name",
    //   align: "center",
    // },
    // {
    //   label: "操作",
    //   slot: "operation",
    //   fixed: "right",
    // },
  ];

  /** 关联子设备表格的columns */
  const deviceColumns: TableColumnList = [
    {
      type: "selection",
      width: 60,
      label: "勾选列",
      fixed: "left",
      hide: page === "detail",
    },
    {
      label: "资产编码",
      prop: "barcode",
      align: "center",
    },
    {
      label: "资产名称",
      prop: "bar_title",
      align: "center",
    },
    {
      label: "规格型号",
      prop: "spec",
      align: "center",
    },
    {
      label: "使用位置",
      prop: "save_addr",
      align: "center",
    },
    {
      label: "使用部门",
      prop: "use_dept_text",
      align: "center",
    },
  ];

  /** 关联备件表格的columns */
  const sparePartColumns: TableColumnList = [
    {
      type: "selection",
      width: 60,
      label: "勾选列",
      fixed: "left",
      hide: page === "detail",
    },
    {
      label: "备件编码",
      prop: "parts_code",
      align: "center",
    },
    {
      label: "备件名称",
      prop: "title",
      align: "center",
    },
    {
      label: "规格型号",
      prop: "spec",
      align: "center",
    },
    {
      label: "库存数量",
      prop: "stock",
      align: "center",
    },
    {
      label: "设备部位",
      prop: "note",
      align: "center",
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
  /** 详情设备信息页面的表单columns */
  const detailGroup: PlusFormGroupRow[] = [
    {
      title: "设备信息",
      columns: [
        {
          label: "设备编码",
          prop: "asset_no",
          labelWidth: 120,
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
        {
          label: "资产名称",
          labelWidth: 90,
          prop: "bar_title",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
        {
          label: "资产条码",
          labelWidth: 90,
          prop: "barcode",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
        {
          label: "品牌",
          prop: "brand",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
        {
          label: "型号",
          prop: "spec",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
        {
          label: "资产编码",
          prop: "equipment_code",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
        {
          label: "资产类型",
          prop: "eq_type_text",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
        {
          label: "功率(kw)",
          prop: "power",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
        {
          label: "序列号",
          prop: "sn",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
        {
          label: "国产/进口",
          prop: "export_type_text",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
        {
          label: "所属产线",
          prop: "product_line",
          // fieldProps: {
          //   placeholder: "--",
          //   readonly: true,
          // },
        },
        {
          label: "备注",
          prop: "note",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
          colProps: {
            span: 16,
          },
        },
      ],
    },
    {
      title: "使用情况",
      columns: [
        {
          label: "可用状态",
          prop: "status",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
        {
          label: "使用部门",
          prop: "use_dept_text",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
        {
          label: "责任部门",
          prop: "duty_dept_text",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
        {
          label: "使用负责人",
          labelWidth: 100,
          prop: "use_duty_user_text",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
        {
          label: "启用日期",
          prop: "open_date",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
        {
          label: "使用年限(月)",
          labelWidth: 100,
          prop: "use_year",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
        {
          label: "预计到期",
          prop: "expire_date",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
        {
          label: "使用位置",
          prop: "save_addr_text",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
        {
          label: "报废日期",
          prop: "scrap_date",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
        {
          label: "报废原因",
          prop: "scrap_reason",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
      ],
    },
    {
      title: "购置信息",
      columns: [
        {
          label: "供应商",
          prop: "supplier_id_text",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
        {
          label: "生产厂家",
          prop: "production_id_text",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
        {
          label: "采购人员",
          prop: "purchase_uid_text",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
        {
          label: "原始价值(元)",
          labelWidth: 100,
          prop: "price",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
        {
          label: "残值率(%)",
          prop: "spoiled_rate",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
        {
          label: "残值",
          prop: "spolied",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
        {
          label: "折旧方法",
          prop: "depreciation_type_text",
          fieldProps: {
            placeholder: "--",
            readonly: true,
          },
        },
      ],
    },
  ];

  function getFileTypeText(type: number) {
    // 文件类型 '1 设备图片 2设备文档 3图纸 4课件 5停机报告 6经验分享报告'
    switch (type) {
      case 1:
        return "设备图片";
        break;
      case 2:
        return "设备文档";
        break;
      case 3:
        return "图纸";
        break;
      case 4:
        return "课件";
        break;
      case 5:
        return "停机报告";
        break;
      case 6:
        return "经验分享报告";
        break;

      default:
        break;
    }
  }

  return {
    formData,
    addRelus,
    group,
    fileColumns,
    deviceColumns,
    sparePartColumns,
    logColumns,
    detailGroup,
    fileUplodColumns,
    fileUplodRules,

    getBase,
    treeData,
    departmentList,
    placeList,
    lineList,
    eqipment_status,
    supplierList,
    userList,
    fileTypeList,
  };
}
