import { ElOption, ElSelect } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
import { useProcuctStock } from "../../hooks";

export function useList(handleSearch: () => void) {
  const { stockType } = useProcuctStock();

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });

  const formData = ref({
    time: "", //批次信息
    stock_type: "", //批次信息
    goods_info: "", //物料信息
    pro_no: "", //生产订单
    delivery_no: "", //交货单号
  });

  const searchColumns: PlusColumnList = [
    {
      label: "生产批号",
      prop: "pro_ph_no",
      labelWidth: 90
    },
    {
      label: "生产日期",
      prop: "time",
      labelWidth: 90,
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
    {
      label: "库存类型",
      prop: "stock_type",
      valueType: "select",
      labelWidth: 90,
      // 当前输入框聚焦状态，按下Enter 键提交搜索
      renderField: () => {
        return (
          <ElSelect
            v-model={formData.value.stock_type}
            style="width:100%"
            filterable={true}
            clearable={true}
          >
            {stockType.value.map((option) => (
              <ElOption key={option.key} label={option.name} value={option.key} />
            ))}
          </ElSelect>
        );
      },
    },
    {
      label: "物料信息",
      prop: "goods_info",
      labelWidth: 90,
      fieldProps: {
        placeholder: "请输入商品编号/名称",
      },
      // 当前输入框聚焦状态，按下Enter 键提交搜索
      onKeyup: withKeys(() => {
        handleSearch();
      }, ["enter"]),
    },
    {
      label: "生产订单",
      prop: "pro_no",
      labelWidth: 90,
      // 当前输入框聚焦状态，按下Enter 键提交搜索
      onKeyup: withKeys(() => {
        handleSearch();
      }, ["enter"]),
    },

    {
      label: "交货单号",
      prop: "delivery_no",
      labelWidth: 90,
      // 当前输入框聚焦状态，按下Enter 键提交搜索
      onKeyup: withKeys(() => {
        handleSearch();
      }, ["enter"]),
    },
  ];

  const columns: TableColumnList = [
    {
      type: "selection",
      width: 40,
      reserveSelection: true,
      label: "勾选列",
      fixed: "left",
      selectable: (row: any) => {
        return !row.stock_type;
      },
    },
    {
      label: "序号",
      type: "index",
      width: 60,
      align: "center",
      fixed: "left",
    },
    {
      label: "操作",
      align: "center",
      slot: "operation",
      width: 124,
      fixed: "left",
    },
    {
      label: "生产日期",
      prop: "pro_date",
      align: "center",
    },
    {
      label: "生产订单",
      prop: "pro_no",
      align: "center",
    },
    {
      label: "生产批次",
      prop: "pro_ph_no",
      align: "center",
    },
    {
      label: "交货单号",
      prop: "delivery_no",
      align: "center",
    },
    {
      label: "库存类型",
      prop: "stock_type",
      slot: "stock_type",
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
      minWidth: 180,
    },
    {
      label: "成品批次",
      prop: "sc_no",
      align: "center",
    },
    {
      label: "库存数量",
      prop: "in_num",
      align: "center",
    },
    {
      label: "箱序列号",
      prop: "box_list",
      align: "center",
    },
    {
      label: "单位",
      prop: "measure_name",
      align: "center",
    }
  ];


  return {
    pagination,
    columns,
    searchColumns,
    formData
  };
}
