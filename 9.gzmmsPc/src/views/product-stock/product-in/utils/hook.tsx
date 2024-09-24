import { ElOption, ElSelect, ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
import { useProcuctStock } from "../../hooks";

export function useList(handleSearch?: () => void) {
  const { factoryCodeList, getFactoryCodeList } = useProcuctStock();

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });

  // 库存类型；0：质量检查；1：非限制
  const stockTypeList = [
    { label: "质量检查", value: 0 },
    { label: "非限制", value: 1 },
  ];

  function getStockTypeName(value: number) {
    return stockTypeList.find((item) => item.value === value)?.label || "--";
  }

  // 入库状态，-2待入库,-1入库中,0待提审,1待审核,3已完成
  const statusList = [
    { label: "待入库", value: -2 },
    { label: "入库中", value: -1 },
    { label: "待提审", value: 0 },
    { label: "待审核", value: 1 },
    { label: "已完成", value: 3 },
  ];
  function getStatusName(status: number) {
    return statusList.find((item) => item.value === status)?.label || "--";
  }

  function getStatusTagType(status: number) {
    if (status === -1) {
      return "warning";
    } else if (status === 0 || status === 1) {
      return "";
    } else if (status === 3) {
      return "success";
    } else {
      return "info";
    }
  }

  const formData = ref({
    pro_no: "", //生产订单
    status: "", //入库状态
    delivery_no: "", //交货单号
    wl_info: "", //物料信息
    factory_code: "", //库存工厂编码
    pro_date: "", //生产日期
  });

  const searchColumns: PlusColumnList = [
    {
      label: "生产订单",
      prop: "pro_no",
      // 当前输入框聚焦状态，按下Enter 键提交搜索
      onKeyup: withKeys(() => {
        handleSearch && handleSearch();
      }, ["enter"]),
    },
    {
      label: "入库状态",
      prop: "status",
      valueType: "select",
      options: statusList,
    },
    {
      label: "交货单号",
      prop: "delivery_no",
      // 当前输入框聚焦状态，按下Enter 键提交搜索
      onKeyup: withKeys(() => {
        handleSearch && handleSearch();
      }, ["enter"]),
    },
    {
      label: "物料信息",
      prop: "wl_info",
      tooltip: "商品编号/名称",
      labelWidth: 90,
      // 当前输入框聚焦状态，按下Enter 键提交搜索
      onKeyup: withKeys(() => {
        handleSearch && handleSearch();
      }, ["enter"]),
    },
    {
      label: "库存工厂编码",
      prop: "factory_code",
      valueType: "select",
      labelWidth: 100,
      renderField: () => {
        return (
          <ElSelect
            v-model={formData.value.factory_code}
            style="width:100%"
            filterable={true}
            clearable={true}
          >
            {factoryCodeList.value.map((option) => (
              <ElOption key={option.id} label={option.factory_code} value={option.factory_code} />
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
        type: "daterange",
        rangeSeparator: "至",
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      },
    },
  ];

  const columns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      width: 60,
      align: "center",
      fixed: "left",
    },
    {
      label: "入库单号",
      prop: "pro_in_no",
      align: "center",
      minWidth: 140
    },
    {
      label: "入库状态",
      prop: "status",
      align: "center",
      minWidth: 90,
      cellRenderer: ({ row }) => {
        return (
          <>
            <ElTag type={getStatusTagType(row.status)}>{getStatusName(row.status)}</ElTag>
          </>
        );
      },
    },
    {
      label: "库存工厂编码",
      prop: "factory_code",
      align: "center",
      minWidth: 140
    },
    {
      label: "入库方式",
      prop: "in_type",
      slot: "in_type",
      align: "center",
      minWidth: 140
    },
    {
      label: "生产日期",
      prop: "pro_date",
      align: "center",
      width: 110,
    },
    {
      label: "生产订单号",
      prop: "pro_no",
      align: "center",
      width: 110,
    },
    {
      label: "交货单号",
      prop: "delivery_no",
      align: "center",
    },
    {
      label: "物料编码",
      prop: "barcode",
      align: "center",
    },
    {
      label: "物料名称",
      prop: "goods_name",
      align: "center",
      width: 110,
    },
    {
      label: "实际已入库数",
      prop: "in_wh_num",
      align: "center",
      minWidth: 140
    },
    {
      label: "单位",
      prop: "measure_name",
      align: "center",
    },
    {
      label: "入库日期",
      prop: "in_wh_date",
      align: "center",
      width: 110,
    },
    {
      label: "备注信息",
      prop: "note",
      align: "center",
    },
    {
      label: "操作",
      align: "center",
      slot: "operation",
      fixed: "right",
    },
  ];

  return {
    pagination,
    columns,
    searchColumns,
    formData,
    factoryCodeList,
    getFactoryCodeList,
    getStatusName,
    getStockTypeName,
    getStatusTagType,
  };
}
