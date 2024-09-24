import { ElOption, ElSelect } from "element-plus";
import dayjs from "dayjs";
import { getWlCodeDropApi } from "@/api/product-stock/common";
import { useProcuctStock } from "../../hooks";

export function useAdd(isEdit: boolean = false) {
  const { factoryCodeList, getFactoryCodeList, wsCodeList, getWscodeList } = useProcuctStock();
  /** 记录的物料信息列表 */
  const wlSelectList = ref<any[]>([]);
  /** 获取物料信息列表 */
  async function getWlData() {
    const result = await getWlCodeDropApi({ keyword: "", type: 1 });
    wlSelectList.value = result.data.data;
  }
  /** el-select-v2的props */
  const selectProps = {
    label: "wl_code",
    value: "id",
  };

  // 选择文件改变
  const bindFile = (file: { name: string; src: string }) => {
    console.log("file", file);
    addFormData.value.file_info = file;
  };

  const addFormData = ref({
    pro_no: "", //生产订单
    factory_code: "", // 库存工厂编码
    delivery_no: "", //交货单号
    ws_code_ids: [] as number[], //存放库位,可多选
    pro_date: "", //生产日期
    goods_id: undefined as FormNumType, //选择物料信息
    note: "", //入库备注
    file_info: {
      src: "",
      name: "",
    },
  });

  const addColumns: PlusColumnList = [
    {
      label: "生产订单",
      prop: "pro_no",
      fieldProps: {
        disabled: isEdit,
      },
    },
    {
      label: "库存工厂编码",
      prop: "factory_code",
      valueType: "select",
      renderField: () => {
        return (
          <ElSelect
            v-model={addFormData.value.factory_code}
            style="width:100%"
            filterable={true}
            clearable={true}
            disabled={isEdit}
          >
            {factoryCodeList.value.map((option) => (
              <ElOption key={option.id} label={option.factory_code} value={option.factory_code} />
            ))}
          </ElSelect>
        );
      },
    },
    {
      label: "交货单号",
      prop: "delivery_no",
      fieldProps: {
        disabled: isEdit,
      },
    },
    {
      label: "存放库位",
      prop: "ws_code_ids",
      valueType: "select",

      renderField: () => {
        return (
          <ElSelect
            v-model={addFormData.value.ws_code_ids}
            style="width:100%"
            filterable={true}
            clearable={true}
            multiple={true}
            disabled={isEdit}
          >
            {wsCodeList.value.map((option) => (
              <ElOption key={option.id} label={option.ws_code_name} value={option.id} />
            ))}
          </ElSelect>
        );
      },
    },
    {
      label: "生产日期",
      prop: "pro_date",
      valueType: "date-picker",
      fieldProps: {
        type: "date",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        disabled: isEdit,
        disabledDate: (date: string) => {
          return dayjs().isBefore(date);
        },
      },
    },
    {
      label: "物料信息",
      prop: "goods_id",
    },
    {
      label: "入库备注",
      prop: "note",
    },
    {
      label: "附件信息",
      prop: "file_info",
    },
  ];

  const addRules = {
    pro_no: [
      {
        required: true,
        message: "请输入生产订单",
      },
    ],
    factory_code: [
      {
        required: true,
        message: "请输入库存工厂编码",
      },
    ],
    delivery_no: [
      {
        required: true,
        message: "请输入交货单号",
      },
    ],
    ws_code_ids: [
      {
        required: true,
        message: "请选择存放库位",
      },
    ],
    pro_date: [
      {
        required: true,
        message: "请选择生产日期",
      },
    ],
    goods_id: [
      {
        required: true,
        message: "请选择物料信息",
      },
    ],
  };

  const inColumns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      width: 60,
      align: "center",
    },
    {
      label: "操作",
      align: "center",
      slot: "operation",
      width: 120,
    },
    {
      label: "物料编码",
      prop: "barcode",
      align: "center",
    },

    {
      label: "物料名称",
      prop: "title",
      align: "center",
      minWidth: 110,
    },
    {
      label: "入库数量",
      prop: "in_num",
      align: "center",
      width: 90,
    },
    {
      label: "单位",
      prop: "measure_name",
      align: "center",
      width: 60,
    },
    {
      label: "箱序列号",
      prop: "box_serial_number",
      align: "center",
      minWidth: 110,
    },
    {
      label: "生产批次",
      prop: "pro_ph_no",
      align: "center",
      minWidth: 140,
    },
    {
      label: "成品批次",
      prop: "batch_no_str",
      align: "center",
      minWidth: 120
    },
    {
      label: "库位名称",
      prop: "ws_code_name_str",
      align: "center",
      width: 90,
    },
    {
      label: "库位编码",
      prop: "ws_code",
      align: "center",
      width: 90,
    },
    {
      label: "库存地点",
      prop: "site",
      align: "center",
      width: 90,
    },
    {
      label: "库存类型",
      prop: "note",
      align: "center",
      cellRenderer: ({ row }) => {
        return "质量检查";
      },
    },
  ];

  return {
    addFormData,
    addColumns,
    addRules,
    getFactoryCodeList,
    getWscodeList,
    wsCodeList,
    wlSelectList,
    getWlData,
    selectProps,
    bindFile,
    inColumns
  };
}
