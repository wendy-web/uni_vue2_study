export function useList() {
  const columns: TableColumnList = [
    {
      label: "菜单名称",
      prop: "auth_title",
      align: "left",
    },
    {
      label: "ID",
      prop: "id",
      align: "center",
      width: 60,
    },
    {
      label: "操作",
      align: "left",
      slot: "operation",
    },
    {
      label: "图标",
      align: "center",
      width: 60,
      cellRenderer: (scope) => (
        <div class="flex justify-center">
          <svg-icon icon-class={scope.row.icon} size="16" align="center" />
        </div>
      ),
    },
    {
      label: "是否显示",
      align: "center",
      slot: "switch",
      width: 100,
    },
    {
      label: "排序",
      prop: "rank",
      align: "center",
      slot: "rank",
      width: 100,
    },
   
    {
      label: "菜单路径",
      align: "center",
      cellRenderer: (scope) => (
        <>
          {scope.row.module ? <span>{scope.row.module}/</span> : <span></span>}
          {scope.row.controller ? <span>{scope.row.controller}/</span> : <span></span>}
          {scope.row.action ? <span>{scope.row.action}</span> : <span></span>}
        </>
      ),
    },
    {
      label: "页面路径",
      prop: "page_path",
      align: "center",
    },
    {
      label: "所属模块",
      align: "center",
      prop: "module_names",
    },
    {
      label: "添加时间",
      prop: "create_time",
      align: "center",
    },
    
  ];

  //  tab选项卡
  const tabMap = [
    {
      type: 0,
      name: "物料管理",
    },
    {
      type: 1,
      name: "设备管理",
    },
    {
      type: 2,
      name: "安全管理",
    },
    {
      type: 3,
      name: "质量管理",
    },
    {
      type: 4,
      name: "生产管理",
    },
    {
      type: 5,
      name: "能源管理",
    },
  ];

  const tabIndex = ref(0); // 默认物料管理

  return {
    columns,
    tabMap,
    tabIndex,
  };
}
