import { ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";

export function useAdd() {
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
    hideOnSinglePage: true,
  });
  const columns: TableColumnList = [
    {
      type: "selection",
      width: 60,
      reserveSelection: true,
      label: "勾选列",
      fixed: "left",
    },
    {
      label: "设备编码",
      prop: "asset_no",
      align: "center",
      minWidth: 110,
    },
    {
      label: "资产类型",
      prop: "eq_type_text",
      align: "center",
      minWidth: 110,
    },
    {
      label: "资产名称",
      prop: "bar_title",
      align: "center",
      minWidth: 120,
    },
    {
      label: "资产条码",
      prop: "barcode",
      align: "center",
      minWidth: 120,
    },

    {
      label: "规格型号",
      prop: "spec",
      align: "center",
      minWidth: 110,
    },
    {
      label: "可用状态",
      prop: "status",
      align: "center",
      cellRenderer: (scope) => (
        <>
          <ElTag type={getTagType(scope.row.status)}>{getStatusTitle(scope.row.status)}</ElTag>
        </>
      ),
    },
    {
      label: "使用位置",
      prop: "save_addr_text",
      align: "center",
      minWidth: 110,
    },
    {
      label: "使用部门",
      prop: "use_dept_text",
      align: "center",
      minWidth: 110,
    },
  ];

  const getStatusTitle = (status: number) => {
    switch (status) {
      case 0:
        return "停用";
      case 1:
        return "正常";
      case 2:
        return "闲置";
      case 3:
        return "待报废";
      case 4:
        return "已报废";
      default:
        return "";
    }
  };

  const getTagType = (status: number) => {
    switch (status) {
      case 0:
        return "danger";
      case 1:
        return "success";
      case 2:
        return "info";
      case 3:
        return "warning";
      case 4:
        return "danger";
      default:
        return "";
    }
  };

  const cycleColumns: TableColumnList = [
    {
      label: "循环周期",
      prop: "cycle_name",
      align: "center",
    },
    {
      label: "计划开始时间",
      prop: "plan_start_time",
      align: "center",
    },
    {
      label: "保养要求/标准",
      prop: "maintenance_requirements",
      align: "center",
    },
    {
      label: "保养部位",
      prop: "maintenance_area",
      align: "center",
    },
    {
      label: "项目标准名称",
      prop: "name",
      align: "center",
    },
    {
      label: "保养负责人",
      prop: "director_name",
      align: "center",
    },
    {
      label: "其他保养人",
      prop: "other_name",
      align: "center",
    },
    {
      label: "操作",
      slot: "operation",
      align: "center",
    },
  ];

  return {
    pagination,
    columns,
    cycleColumns,
  };
}
