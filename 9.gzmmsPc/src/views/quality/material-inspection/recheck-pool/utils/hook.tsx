import { ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
import { useCommonHooks } from "@/hooks/quality";
import { useselectData } from "@/hooks/quality/selectData";

export function useList(search: () => void) {
  const { showApproveLog } = useCommonHooks();
  const { getTagType } = useselectData();

  /** 表格分页配置 */
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });

  /** 表单数据 */
  const formData = ref({
    batch_no: "", // 生产批号
    order_no: "", // 复检单据
    status: undefined as FormNumType, //单据状态
    check_date_arr: "", // 检测日期
    order_module: undefined as FormNumType, // 所属模块:复检模块 0 原材料检测 1 成品检测 2 定量检测 3 工序检测
  });
  function getStatusText(status: any) {
    let findItem = statusOptions.find((item: any) => item.value === status + 1);
    return findItem?.label || "——";
  }
  function getMouduleText(status: any) {
    let findItem = moduleOptions.find((item: any) => item.value === status);
    return findItem?.label || "——";
  }
  function getRecheckStatusText(status: any) {
    let findItem = recheckStatusOptions.find((item: any) => item.value === status);
    return findItem?.label || "——";
  }
  /** 表格列配置 */
  const columns: TableColumnList = [
    {
      label: "单据编号",
      prop: "order_no",
      align: "center",
      cellRenderer: ({ row }) => (
        <span class="cursor-pointer underline text-sky-800">{row.order_no}</span>
      ),
    },
    {
      label: "复检单据",
      prop: "order_name",
      align: "center",
    },
    {
      label: "复检单号",
      prop: "recheck_order_no",
      align: "center",
    },
    {
      label: "复检批号",
      prop: "batch_no",
      align: "center",
    },

    {
      label: "所属模块",
      prop: "order_module",
      align: "center",
      cellRenderer: ({ row }) => (
        <>
          <span>{getMouduleText(row.order_module)}</span>
        </>
      ),
    },
    {
      label: "复检结果",
      prop: "recheck_ret",
      align: "center",
      cellRenderer: ({ row }) => (
        <>
          <span>{getRecheckStatusText(row.recheck_ret)}</span>
        </>
      ),
    },
    {
      label: "发起时间",
      prop: "create_time",
      align: "center",
    },
    {
      label: "发起人",
      prop: "ct_name",
      align: "center",
    },
    {
      label: "单据状态",
      prop: "status_text",
      align: "center",
      cellRenderer: ({ row }) => (
        <>
          <ElTag
            type={getTagType(row.status)}
            class={"cursor-pointer"}
            onClick={() => showApproveLog({ id: row.id, orderType: 2, orderStatus: row.status })}
          >
            {getStatusText(row.status)}
          </ElTag>
        </>
      ),
    },
    {
      label: "备注",
      prop: "remark",
      align: "center",
    },
    {
      label: "操作",
      slot: "operation",
      fixed: "right",
    },
  ];
  // 所属模块配置
  const moduleOptions = [
    {
      label: "原材料检验",
      value: 0,
    },
    {
      label: "成品检验",
      value: 1,
    },
    {
      label: "定量检验",
      value: 2,
    },
    {
      label: "工序检验",
      value: 3,
    },
  ];
  const recheckStatusOptions = [
    {
      label: "不合格",
      value: 0,
    },
    {
      label: "合格",
      value: 1,
    },
    {
      label: "部分合格",
      value: 2,
    },
    {
      label: "复检中",
      value: 3,
    },
  ];

  const statusOptions = [
    {
      label: "已删除",
      value: 0,
    },
    {
      label: "未确认",
      value: 1,
    },
    {
      label: "已确认",
      value: 2,
    },
  ];
  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    {
      label: "生产批号",
      prop: "batch_no",
      fieldProps: {
        placeholder: "请输入关键字",
      },
      labelWidth: 90,
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
    },

    {
      label: "复检单据",
      prop: "order_no",
      colProps: {
        span: 5,
      },
      fieldProps: {
        placeholder: "请输入关键字",
      },
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
    },
    {
      label: "状态",
      prop: "status",
      valueType: "select",
      options: statusOptions,
      colProps: {
        span: 5,
      },
      fieldProps: {
        onChange: () => {
          search();
        },
      },
    },
    {
      label: "日期",
      prop: "check_date_arr",
      valueType: "date-picker",
      fieldProps: {
        placeholder: "请选择日期",
        type: "daterange",
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        onChange: () => {
          search();
        },
      },
      colProps: {
        span: 7,
      },
    },
    {
      label: "所属模块",
      prop: "order_module",
      valueType: "select",
      options: moduleOptions,
      colProps: {
        span: 5,
      },
      fieldProps: {
        onChange: () => {
          search();
        },
      },
    },
  ];

  return {
    pagination,
    formData,
    columns,
    searchColumns,
    statusOptions,
  };
}
