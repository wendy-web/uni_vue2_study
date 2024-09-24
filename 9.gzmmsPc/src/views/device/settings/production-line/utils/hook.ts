export function useList() {
  const columns: TableColumnList = [
    {
      type: "index",
      label: "#",
      width: 60,
      align: "center",
    },
    {
      label: "产线名称",
      prop: "name",
      align: "center",
    },
    {
      label: "操作",
      slot: "operation",
      fixed: "right",
      align: "center",
    },
  ];

  const addColumns: PlusColumnList = [
    {
      label: "产线名称",
      prop: "name",
      fieldProps: {
        placeholder: "请输入产线名称",
        autofocus: true
      },
    },
  ];

  return {
    columns,
    addColumns
  };
}
