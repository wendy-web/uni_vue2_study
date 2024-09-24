import type { PaginationProps } from "@pureadmin/table";
import { useSearchFrom } from "@/hooks/searchForm";

export function useList() {
  const { storageList, classList } = useSearchFrom();

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
    align: "left",
  });

  const formData = ref({
    keyword: "",
    class_name: undefined as FormNumType,
    warehouse_id: undefined as FormNumType,
    is_all: undefined as FormNumType,
    available_status: undefined as FormNumType,
  });
  const statusOptions = [
    {
      label: "报废",
      value: 0,
    },
    {
      label: "待修",
      value: 1,
    },
    {
      label: "可用",
      value: 2,
    },
  ];
  function getAvailableName(status: number) {
    return statusOptions.find((item) => item.value === status)?.label || "";
  }

  const searchColumns: PlusColumnList = [
    {
      label: "关键字",
      prop: "keyword",
      tooltip: "关键字: 商品名称、条码、型号、品牌",
    },
    {
      label: "可用状态",
      prop: "available_status",
      valueType: "select",
      options: statusOptions,
    },
    {
      label: "所属分类",
      prop: "class_name",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择所属分类",
      },
      options: () => {
        return classList;
      },
    },
    {
      label: "仓库",
      prop: "warehouse_id",
      valueType: "select",
      options: () => {
        return storageList;
      },
    },
    {
      label: "库存数",
      prop: "is_all",
      labelWidth: 60,
      valueType: "select",
      fieldProps: {
        placeholder: "请选择库存数",
      },
      options: [
        {
          label: "大于0",
          value: 0,
        },
        {
          label: "全部",
          value: 1,
        },
        {
          label: "等于0",
          value: 2,
        },
      ],
    },
  ];

  const columns: TableColumnList = [
    {
      type: "selection",
      width: 60,
      reserveSelection: true,
      label: "勾选列",
      fixed: "left",
    },
    {
      label: "备品备件条码",
      prop: "barcode",
      align: "center",
    },
    {
      label: "备品备件名称",
      prop: "title",
      align: "center",
    },
    {
      label: "规格型号",
      prop: "spec",
      align: "center",
      cellRenderer: ({ row }) => <span>{row.spec || "-"}</span>,
    },
    {
      label: "分类",
      prop: "class_name",
      align: "center",
      cellRenderer: ({ row }) => <span>{row.class_name || "-"}</span>,
    },
    {
      label: "单位",
      prop: "measure_name",
      align: "center",
    },  
    {
      label: "可用库存",
      prop: "stock_qty",
      align: "center",
      cellRenderer: ({ row }) => <span>{row.stock_qty || "-"}</span>,
    },
    {
      label: "仓库",
      prop: "measure_name",
      align: "center",
    },
    {
      label: "可用状态",
      prop: "available_status",
      align: "center",
      cellRenderer: ({ row }) => getAvailableName(row.available_status),
    },
    {
      label: "使用位置",
      prop: "use_addr_names",
      align: "center",
    },
    {
      label: "备注",
      prop: "note",
      align: "center",
    },
    {
      label: "入库日期",
      prop: "in_wh_date",
      align: "center",
    },
    {
      label: "退库单号",
      prop: "document_num",
      align: "center",
    },
    {
      label: "单价",
      prop: "price",
      align: "center",
    },
  ];

  return {
    pagination,
    formData,
    searchColumns,
    columns,
  };
}
