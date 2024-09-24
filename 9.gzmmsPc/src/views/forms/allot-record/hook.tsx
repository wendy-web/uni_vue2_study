import type { PaginationProps } from "@pureadmin/table";
import { formartDate } from "@/utils/validate";
import { useSearchFrom } from "@/hooks/searchForm";

export function useList() {
  const { storageList, userList } = useSearchFrom();

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
    dept_id: undefined as FormNumType,
    to_wh_id: undefined as FormNumType,
    out_wh_id: undefined as FormNumType,
    ct_uid: undefined as FormNumType,
    out_time: "",
  });

  const searchColumns: PlusColumnList = [
    {
      label: "关键字",
      prop: "keyword",
      tooltip: "关键字: 商品名称、条码、型号、品牌",
    },
    {
      label: "调入仓库",
      prop: "to_wh_id",
      valueType: "select",
      options: () => {
        return storageList;
      },
    },
    {
      label: "调出仓库",
      prop: "out_wh_id",
      valueType: "select",
      options: () => {
        return storageList;
      },
    },
    {
      label: "制单人",
      prop: "ct_uid",
      valueType: "select",
      labelWidth: 90,
      fieldProps: {
        clearable: true,
        filterable: true,
      },
      options: () => {
        return userList;
      },
    },
    {
      label: "部门",
      prop: "dept_id",
    },
    {
      label: "调出日期",
      prop: "out_time",
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
      type: "selection",
      width: 60,
      reserveSelection: true,
      label: "勾选列",
      fixed: "left",
    },
    {
      label: "调拨单号",
      prop: "wh_tra_no",
      align: "center",
    },
    {
      label: "调出仓库",
      prop: "out_wh_name",
      align: "center",
    },
    {
      label: "调出时间",
      prop: "out_time",
      align: "center",
      cellRenderer: (scope) => <span>{formartDate(scope.row.out_time) || "-"}</span>,
    },
    {
      label: "调入仓库",
      prop: "to_wh_name",
      align: "center",
    },
    {
      label: "调入时间",
      prop: "in_time",
      align: "center",
      cellRenderer: (scope) => <span>{formartDate(scope.row.in_time) || "-"}</span>,
    },
    {
      label: "货品条码",
      prop: "barcode",
      align: "center",
    },
    {
      label: "名称",
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
      label: "品牌",
      prop: "brand",
      align: "center",
      cellRenderer: ({ row }) => <span>{row.brand || "-"}</span>,
    },
    {
      label: "单位",
      prop: "measure_name",
      align: "center",
    },
    {
      label: "批次/日期",
      prop: "ph_no",
      align: "center",
      cellRenderer: ({ row }) => <span>{row.ph_no || "-"}</span>,
    },
    {
      label: "调拨数量",
      prop: "rec_num",
      align: "center",
    },
  ];

  return {
    formData,
    searchColumns,
    columns,
    pagination,
  };
}
