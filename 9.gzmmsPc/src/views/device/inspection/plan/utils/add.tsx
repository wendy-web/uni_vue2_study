import type { PaginationProps } from "@pureadmin/table";
import { useCommon } from "@/hooks/device/baseData";

export function useAdd() {
  const { getRecordName, getInspecCycleName, getRulePlanTime } = useCommon();

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

  const cycleColumns: TableColumnList = [
    {
      label: "执行周期规则",
      prop: "executiveRuleName",
      align: "center",
    },
    {
      label: "循环周期",
      prop: "cycle_name",
      align: "center",
    },
    {
      label: "计划执行时间",
      prop: "plan_start_time",
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
      label: "检查项内容",
      prop: "item_content",
      align: "center",
    },
    {
      label: "检验方法",
      prop: "method",
      align: "center",
    },
    {
      label: "检查标准说明",
      prop: "std_explain",
      align: "center",
    },
    {
      label: "记录方式",
      prop: "record_method",
      align: "center",
      cellRenderer: ({ row }) => {
        return getRecordName(row.record_method);
      },
    },
    {
      label: "结果选项",
      align: "center",
      slot: "select",
      cellRenderer: ({ row }) => (
        <>
          <ul>
            {row.normal_val ? (
              <li>
                <span>正常值：</span>
                <span>{row.normal_value}</span>
              </li>
            ) : null}
            {row.abnormal_val ? (
              <li>
                <span>异常值：</span>
                <span>{row.abnormal_val}</span>
              </li>
            ) : null}
          </ul>
        </>
      ),
    },
    {
      label: "上限",
      prop: "upper_limit_val",
      align: "center",
    },
    {
      label: "下限",
      prop: "lower_limit_val",
      align: "center",
    },
    {
      label: "计划执行人",
      prop: "executor_name",
      align: "center",
    },
    {
      label: "操作",
      align: "center",
      slot: "operation",
    },
  ];

  return {
    pagination,
    columns,
    cycleColumns,
    getInspecCycleName,
  };
}
