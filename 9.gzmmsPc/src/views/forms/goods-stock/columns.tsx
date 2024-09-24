import type { PlusColumn } from "plus-pro-components";
import { useSearchFrom } from "@/hooks/searchForm";

export function useList() {
  const { classNameList, storageList } = useSearchFrom();

  const defaultColumns = ref<TableColumnList>([
    {
      type: "selection",
      width: 60,
      label: "勾选列",
      fixed: "left",
    },
    {
      type: "expand",
      slot: "expand",
      width: 40,
      label: " ",
      fixed: "left",
    },
    {
      label: "条码",
      prop: "goods.barcode",
      align: "center",
    },
    {
      label: "名称",
      prop: "goods.title",
      align: "center",
    },
    {
      label: "品牌",
      prop: "goods.brand",
      align: "center",
      headerSlot: "brand",
      cellRenderer: (scope) => <span>{scope.row.goods.brand || "-"}</span>,
    },
    {
      label: "自定义类别",
      prop: "goods.goods_class",
      align: "center",
      cellRenderer: (scope) => <span>{scope.row.goods.goods_class || "-"}</span>,
    },
    {
      label: "规格型号",
      prop: "goods.spec",
      align: "center",
      headerSlot: "spec",
      cellRenderer: (scope) => <span>{scope.row.goods.spec || "-"}</span>,
    },

    {
      label: "计量单位",
      prop: "goods.measure_name",
      align: "center",
      width: 100,
    },
    {
      label: "所属分类",
      prop: "goods.class_name",
      align: "center",
    },
    {
      label: "仓库",
      prop: "warehouse.name",
      align: "center",
    },
    {
      label: "可用库存",
      prop: "stock",
      align: "center",
      width: 100,
    },
    {
      label: "安全库存",
      prop: "stock_warning_qty",
      align: "center",
      width: 100,
      cellRenderer: (scope) => (
        <>
          <div>
            <span class={[scope.row.is_stock_warning ? "text-red-500" : ""]}>
              {scope.row.stock_warning_qty}
            </span>
            {scope.row.is_stock_warning ? (
              <span class="text-red-500 inline-block ml-1 bg-red-100 w-[26px] rounded-[4px]">
                警
              </span>
            ) : (
              <span></span>
            )}
          </div>
          <div>
            <span class={[scope.row.is_stock_upper_warning ? "text-red-500" : ""]}>
              {scope.row.stock_upper_qty}
            </span>
            {scope.row.is_stock_upper_warning ? (
              <span class="text-red-500 inline-block ml-1 bg-red-100 w-[26px] rounded-[4px]">
                警
              </span>
            ) : (
              <span></span>
            )}
          </div>
        </>
      ),
      headerRenderer: (scope) => (
        <>
          <p>库存下限</p>
          <p>库存上限</p>
        </>
      ),
    },
    {
      label: "订货点",
      prop: "goods_warning_qty",
      align: "center",
      width: 100,
      cellRenderer: (scope) => (
        <>
          <span class={[scope.row.is_goods_warning ? "text-red-500" : ""]}>
            {scope.row.goods_warning_qty}
          </span>
          {scope.row.is_goods_warning ? (
            <span class="text-red-500 inline-block ml-1 bg-red-100 w-[26px] rounded-[4px]">警</span>
          ) : (
            <span></span>
          )}
        </>
      ),
    },
    {
      label: "是否到期",
      prop: "is_exp_warning",
      align: "center",
      width: 100,
      cellRenderer: (scope) => (
        <>{scope.row.is_exp_warning ? <span class="text-red-500">是</span> : <span>否</span>}</>
      ),
    },
  ]);

  // const columns: TableColumnList = [
  //   ...defaultColumns,
  //   {
  //     label: "库存金额",
  //     prop: "stock_price",
  //     align: "center",
  //     width: 100,
  //   },
  // ];

  const columns = ref<TableColumnList>([
    ...defaultColumns.value,
    {
      label: "库存金额",
      prop: "total_stock_price",
      align: "center",
      width: 100,
    },
  ]);

  const searchColumns: PlusColumn[] = [
    {
      label: "关键字",
      tooltip: "关键字: 商品名称、条码、型号、品牌",
      prop: "title",
    },

    {
      label: "仓库",
      prop: "warehouse_id",
      labelWidth: 50,
      valueType: "select",
      fieldProps: {
        placeholder: "请选择仓库",
      },
      options: () => {
        return storageList;
      },
    },
    {
      label: "所属分类",
      prop: "class_name",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择所属分类",
      },
      options: () => {
        return classNameList;
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
    {
      label: "预警类型",
      prop: "type",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择库存数",
      },
      options: [
        {
          label: "全部",
          value: 0,
        },
        {
          label: "库存上限",
          value: 1,
        },
        {
          label: "库存下限",
          value: 2,
        },
        {
          label: "订货预警",
          value: 3,
        },
      ],
    },
  ];

  return {
    defaultColumns,
    columns,
    searchColumns,
  };
}
