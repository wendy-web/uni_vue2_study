export function useOrderList() {
  const columns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      width: 60,
      align: "center",
    },
    {
      label: "名称",
      prop: "name",

      align: "center",
      showOverflowTooltip: true,
    },
    {
      label: "地址",
      prop: "address",
      align: "center",
      showOverflowTooltip: true,
      cellRenderer: (scope) => <span>{scope.row.address || "-"}</span>,
    },
    {
      label: "联系人",
      prop: "contact",
      width: 160,
      align: "center",
      cellRenderer: (scope) => <span>{scope.row.contact || "-"}</span>,
    },
    {
      label: "联系电话",
      prop: "mobile",
      align: "center",
      cellRenderer: (scope) => <span>{scope.row.mobile || "-"}</span>,
    },
    {
      label: "邮件地址",
      prop: "e_mail",
      align: "center",
      showOverflowTooltip: true,
      cellRenderer: (scope) => <span>{scope.row.e_mail || "-"}</span>,
    },
    {
      label: "创建时间",
      width: 180,
      prop: "create_time",
      align: "center",
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation",
    },
  ];

  return {
    columns,
  };
}
