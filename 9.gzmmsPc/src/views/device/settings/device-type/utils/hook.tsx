import { ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";

export function useList() {
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });
  const columns: TableColumnList = [
    // {
    //   type: "selection",
    //   width: 60,
    //   reserveSelection: true,
    //   label: "勾选列",
    //   fixed: "left",
    // },
    {
      label: "资产类型名称",
      prop: "name",
      align: "center",
    },
    {
      width: 60,
      label: "排序",
      prop: "rank",
      align: "center",
    },

    {
      label: "状态",
      prop: "status",
      align: "center",
      cellRenderer: (scope) => (
        <>
          {scope.row.status === 1 ? (
            <ElTag type="success">启用</ElTag>
          ) : (
            <ElTag type="danger">停用</ElTag>
          )}
        </>
      ),
    },
    {
      label: "备注",
      prop: "note",
      align: "center",
    },
    {
      label: "创建人",
      prop: "ct_name",
      align: "center",
    },
    {
      label: "创建时间",
      prop: "create_time",
      align: "center",
    },
    {
      label: "操作",
      slot: "operation",
      fixed: "right",
      align: "center",
    },
  ];

  const searchColumns: PlusColumnList = [
    {
      label: "关键字",
      prop: "name",
      fieldProps: {
        placeholder: "请输入资产类型名称",
      },
    },
  ];

  const addColumns: PlusColumnList = [
    {
      label: "资产类型名称",
      prop: "name",
      fieldProps: {
        placeholder: "请输入资产类型名称",
      },
    },
    {
      label: "排序",
      prop: "rank",
      valueType: "input-number",
      fieldProps: {
        placeholder: "",
        controlsPosition: "right",
      },
    },
    {
      label: "状态",
      prop: "status",
      valueType: "radio",
      options: [
        {
          label: "启用",
          value: 1,
        },
        {
          label: "停用",
          value: 0,
        },
      ],
    },
    {
      label: "备注",
      prop: "note",
      fieldProps: {
        placeholder: "请输入备注",
      },
    },
  ];

  const addSubColumns: PlusColumnList = [
    {
      label: "上级类型",
      prop: "pid_name",
      valueType: "text",
      // fieldProps: {
      //   placeholder: "请输入资产类型名称",
      //   disabled: true,
      // },
    },
    ...addColumns,

  ]

  return {
    pagination,
    columns,
    searchColumns,
    addColumns,
    addSubColumns
  };
}
