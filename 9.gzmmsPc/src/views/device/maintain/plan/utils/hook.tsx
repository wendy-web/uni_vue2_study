import { useCommon } from "@/hooks/device/baseData";
import type { PaginationProps } from "@pureadmin/table";
import { ElTag } from "element-plus";

export function useList() {
  const { getCycleName } = useCommon();

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
      label: "计划状态",
      prop: "status",
      align: "center",
      minWidth: 160,
      cellRenderer: ({ row }) => (
        <>
          <div class="mb-1">
            <ElTag type={getTagType(row.status)}>{getStatusTitle(row.status)}</ElTag>
          </div>
          {row.overdue_day > 0 ? (
            <span class="inline-block bg-red-400 rounded-[10px] px-2 text-white">
              逾期{row.overdue_day}天
            </span>
          ) : null}
        </>
      ),
    },
    {
      label: "项目标准名称",
      prop: "project_std_name",
      align: "center",
      minWidth: 160,
      sortable: true,
      // sortBy:"descending"
    },
    {
      label: "计划明细单号",
      prop: "plan_details_no",
      align: "center",
      minWidth: 110,
    },
    {
      label: "计划编号",
      prop: "plan_no",
      align: "center",
    },
    {
      label: "设备编码",
      prop: "asset_no",
      align: "center",
      minWidth: 110,
    },
    {
      label: "资产名称",
      prop: "bar_title",
      align: "center",
    },
    {
      label: "规格型号",
      prop: "spec",
      align: "center",
    },
    {
      label: "计划执行时间",
      prop: "plan_start_time",
      align: "center",
      minWidth: 110,
    },

    {
      label: "保养负责人",
      prop: "director_names",
      align: "center",
      minWidth: 110,
    },
    {
      label: "使用位置",
      prop: "use_places",
      align: "center",
    },
    {
      label: "使用部门",
      prop: "use_dept_names",
      align: "center",
    },
    {
      label: "上次执行时间",
      prop: "last_start_time",
      align: "center",
      minWidth: 110,
    },
    {
      label: "循环周期",
      prop: "cycle_type",
      align: "center",
      cellRenderer: (scope: any) => {
        return getCycleName(scope.row.cycle_type);
      },
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
      width: 110,
    },

    {
      label: "操作",
      slot: "operation",
      fixed: "right",
      align: "center",
    },
  ];

  const filterList = ["plan_no", "asset_no", "spec", "use_places", "use_dept_names"];

  const searchColumns: PlusColumnList = [
    {
      label: "关键字",
      prop: "keyword",
      fieldProps: {
        placeholder: "请输入",
      },
      tooltip: "请输入: 计划明细单号/设备编码/资产名称/保养计划名称",
    },
    {
      label: "资产类型",
      prop: "equipment_type_id",
      fieldProps: {
        placeholder: "请输入",
      },
    },
    {
      label: "使用位置",
      prop: "save_addr_id",
      fieldProps: {
        placeholder: "请输入",
      },
    },
    {
      label: "使用部门",
      prop: "use_dept_id",
      fieldProps: {
        placeholder: "请输入",
      },
    },
    {
      label: "临期任务",
      prop: "is_advent",
      valueType: "switch",
      fieldProps: {
        inlinePrompt: true,
        activeValue: 1,
        inactiveValue: 0,
        activeText: "是",
        inactiveText: "否",
      },
    },
    {
      label: "状态",
      prop: "status",
      valueType: "select",
      fieldProps: {
        placeholder: "请输入",
      },
      options: [
        {
          label: "未开始",
          value: 0,
        },
        {
          label: "待保养",
          value: 1,
        },
        {
          label: "保养中",
          value: 2,
        },
        {
          label: "待验证",
          value: 3,
        },
        {
          label: "停用",
          value: 4,
        },
      ],
    },
    {
      label: "保养负责人",
      prop: "director_uid",
      labelWidth: 90,
      fieldProps: {
        placeholder: "请输入",
      },
    },
    {
      label: "下次保养时间",
      prop: "next_maintenance_time",
      labelWidth: 100,
      valueType: "date-picker",
      fieldProps: {
        placeholder: "请选择日期",
        type: "daterange",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期",
      },
    },
    // {
    //   label: "上次保养时间",
    //   prop: "last_maintenance_time",
    //   labelWidth: 100,
    //   valueType: "date-picker",
    //   fieldProps: {
    //     placeholder: "请选择日期",
    //     type: "daterange",
    //     format: "YYYY-MM-DD",
    //     valueFormat: "YYYY-MM-DD",
    //     startPlaceholder: "开始日期",
    //     endPlaceholder: "结束日期",
    //   },
    // },
    {
      label: "创建人",
      prop: "ct_uid",
      fieldProps: {
        placeholder: "请输入",
      },
    },
    {
      label: "创建时间",
      prop: "create_time",
      labelWidth: 90,
      valueType: "date-picker",
      fieldProps: {
        placeholder: "请选择日期",
        type: "daterange",
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      },
    },
  ];
  const getStatusTitle = (status: number) => {
    switch (status) {
      case 0:
        return "未开始";
      case 1:
        return "待保养";
      case 2:
        return "保养中";
      case 3:
        return "待验证";
      case 4:
        return "停用";
      default:
        return "";
    }
  };

  const getTagType = (status: number) => {
    switch (status) {
      case 0:
        return "info";
      case 1:
        return "warning";
      case 2:
        return "success";
      case 3:
        return "";
      case 4:
        return "danger";
      default:
        return "";
    }
  };
  return {
    pagination,
    columns,
    searchColumns,
    filterList,
  };
}
