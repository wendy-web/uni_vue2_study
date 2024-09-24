import { useBaseData, useCommon } from "@/hooks/device/baseData";
import type { PaginationProps } from "@pureadmin/table";
import { ElTag } from "element-plus";

export function useList() {
  const { treeData, userList, departmentList, getBase } = useBaseData();
  const { getInspecCycleName, getRulePlanTime, getExecutiveRuleName } = useCommon();

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });

  function getStatusName(status: number) {
    const statusMap = new Map([
      [0, "未开始"],
      [1, "待检查"],
      [2, "检查中"],
      [3, "待审核"],
      [4, "停用"],
    ]);

    return statusMap.get(status) || "";
  }
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

  const columns: TableColumnList = [
    // {
    //   type: "selection",
    //   width: 60,
    //   reserveSelection: true,
    //   label: "勾选列",
    //   fixed: "left",
    // },
    {
      label: "资产类型",
      prop: "equipment_type_title",
      align: "center",
    },
    {
      label: "设备编码",
      prop: "asset_no",
      minWidth: 110,
      align: "center",
    },
    {
      label: "资产名称",
      prop: "bar_title",
      minWidth: 100,
      align: "center",
    },
    {
      label: "计划明细单号",
      prop: "plan_details_no",
      minWidth: 110,
      align: "center",
    },
    {
      label: "计划状态",
      prop: "status",
      align: "center",
      minWidth: 160,
      cellRenderer: ({ row }) => (
        <>
          <div class="mb-1">
            <ElTag type={getTagType(row.status)}>{getStatusName(row.status)}</ElTag>
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
      label: "检查项目名",
      prop: "inspect_items_name",
      minWidth: 120,
      align: "center",
      sortable: true,
    },
    {
      label: "计划执行时间",
      prop: "plan_start_time",
      width: 180,
      align: "center",
      cellRenderer: ({ row }) => {
        let data = {
          rule_type: row.executive_rule_type,
          start_time: row.plan_start_time,
          end_time: row.plan_end_time,
        };
        return getRulePlanTime(data);
      },
    },
    {
      label: "使用部门",
      prop: "use_dept_names",
      align: "center",
      minWidth: 100,
    },

    {
      label: "计划编号",
      prop: "plan_no",
      minWidth: 100,
      align: "center",
    },

    {
      label: "规格型号",
      prop: "spec",
      minWidth: 100,
      align: "center",
    },

    {
      label: "计划执行人",
      prop: "executor_names",
      align: "center",
      minWidth: 100,
    },
    {
      label: "使用位置",
      prop: "use_places",
      align: "center",
      minWidth: 100,
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
      cellRenderer: ({ row }) => {
        return getInspecCycleName(row.cycle_type);
      },
    },
    {
      label: "执行时间规则",
      prop: "executive_rule_type",
      align: "center",
      minWidth: 110,
      cellRenderer: ({ row }) => {
        return getExecutiveRuleName(row.executive_rule_type);
      },
    },
    {
      label: "必须拍照",
      prop: "is_must_pho",
      align: "center",
      cellRenderer: ({ row }) => {
        return row.is_must_pho === 1 ? "是" : "否";
      },
    },
    {
      label: "必须签名",
      prop: "is_must_sig",
      align: "center",
      cellRenderer: ({ row }) => {
        return row.is_must_sig === 1 ? "是" : "否";
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
      minWidth: 110,
    },
    {
      label: "操作",
      slot: "operation",
      fixed: "right",
    },
  ];
  const filterList = [
    "plan_no",
    "spec",
    "executor_names",
    "use_places",
    // "ct_name",
    "create_time",
  ];
  const searchColumns: PlusColumnList = [
    {
      label: "关键字",
      prop: "keyword",
      fieldProps: {
        placeholder: "请输入",
      },
    },
    {
      label: "资产类型",
      prop: "equipment_type_id",
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
      label: "计划状态",
      prop: "status",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择",
      },
      options: [
        {
          label: "未开始",
          value: 0,
        },
        {
          label: "待检查",
          value: 1,
        },
        {
          label: "检查中",
          value: 2,
        },
        {
          label: "待审核",
          value: 3,
        },
        {
          label: "停用",
          value: 4,
        },
      ],
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
      label: "计划执行人",
      prop: "executor_uid",
      labelWidth: 90,
      valueType: "select",
      fieldProps: {
        placeholder: "请选择",
      },
      options: computed(() => {
        return userList.value.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      }),
    },
    {
      label: "循环周期",
      prop: "cycle_type",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择",
      },
      // options: cycleOptions,
    },
    {
      label: "创建人",
      prop: "ct_uid",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择",
      },
      options: computed(() => {
        return userList.value.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      }),
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
  return {
    pagination,
    columns,
    searchColumns,
    treeData,
    userList,
    departmentList,
    getBase,
    filterList,
  };
}
