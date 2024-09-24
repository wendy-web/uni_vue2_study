export function useAccount() {
  const columns: TableColumnList = [
    {
      label: "ID",
      prop: "id",
      align: "center",
      width: 60,
    },
    {
      label: "手机号/账号",
      prop: "user",
      align: "center",
    },
    {
      label: "IP白名单",
      prop: "is_white_user",
      align: "center",
      slot: "white_user",
    },
    {
      label: "绑定微信",
      prop: "unionid",
      align: "center",
      slot: "uid",
    },
    {
      label: "部门",
      prop: "dept_name",
      align: "center",
    },
    {
      label: "姓名",
      prop: "name",
      align: "center",
    },
    {
      label: "角色",
      prop: "role_name",
      align: "center",
      sortable: true,
    },
    {
      label: "所属仓库",
      prop: "belong_warehouses",
      align: "center",
    },
    {
      label: "查看仓库",
      prop: "view_warehouses",
      align: "center",
    },
    // {
    //   label: "启用",
    //   align: "center",
    //   width: 100,
    //   sortable: true,
    //   slot: "status",
    // },
    {
      label: "创建时间",
      prop: "create_time",
      align: "center",
      sortable: true,
    },
    {
      label: "操作",
      slot: "operation",
    },
  ];

  const ipColumns: TableColumnList = [
    {
      label: "IP地址",
      prop: "ip",
      align: "center",
    },
    {
      label: "备注",
      prop: "desc",
      align: "center",
    },
    {
      headerSlot:"pc-header",
      label: "PC端",
      align: "center",
      slot: "pc-status",
    },
    {
      headerSlot:"wx-header",
      label: "小程序端",
      align: "center",
      slot: "mp-weixin",
    },
    {
      label: "创建时间",
      prop: "create_time",
      align: "center",
    },
    {
      label: "操作",
      slot: "operation",
    },
  ];

  return {
    columns,
    ipColumns,
  };
}
