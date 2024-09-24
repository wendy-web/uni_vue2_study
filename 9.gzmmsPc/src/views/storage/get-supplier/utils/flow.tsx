export function useAssginFlow() {
  const approverColumns: TableColumnList = [
    {
      label: "名称",
      prop: "name",
      align: "center",
    },
    // {
    //   label: "手机号/账号",
    //   prop: "user",
    //   align: "center",
    // },
    {
      label: "所属部门",
      prop: "dept_name",
      align: "center",
    },
    {
      label: "所属仓库",
      prop: "warehouse_name",
      align: "center",
    },
    {
      label: "操作",
      slot: "operation",
    },
  ];

  const receiverColumns: TableColumnList = [
    {
      type: "selection",
      width: 60,
      align: "center",
      fixed: "left",
      reserveSelection: true,
      // selectable: (row) => !row.disable,
    },
    ...approverColumns,
  ];

  return {
    approverColumns,
    receiverColumns,
  };
}
