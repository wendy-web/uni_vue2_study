import { ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { useRouter } from "vue-router";
import { formartDate } from "@/utils/validate";
import { useCommonHooks } from "@/hooks/quality";
import { useselectData } from "@/hooks/quality/selectData";

export function useList() {
  const router = useRouter();
  const { showApproveLog } = useCommonHooks();
  const { statusOptions, getStatusText, getTagType, getBasePassLabel, getLineList } =
    useselectData();

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
    order_no: "", // 单据编号
    line_id: undefined as FormNumType, //批次
    status: undefined as FormNumType, //状态
    check_date: "", //检验日期
  });
  /** 签字复核/反审核,都是进入详情页面 */
  function cellDetail(row: any) {
    router.push({
      path: "/quality/process-inspection/cip-microbes/add",
      query: {
        id: row.id,
        pageType: 3,
        assocType: JSON.stringify(row.assoc_type),
      },
    });
  }

  /** 表格列配置 */
  const columns: TableColumnList = [
    {
      label: "单据编号",
      prop: "order_no",
      align: "center",
      cellRenderer: ({ row }) => (
        <>
          <span class="cursor-pointer underline text-sky-800" onClick={() => cellDetail(row)}>
            {row.order_no}
          </span>
        </>
      ),
    },
    {
      label: "检验日期",
      prop: "check_date",
      align: "center",
    },
    {
      label: "生产日期",
      prop: "make_date",
      align: "center",
    },
    {
      label: "线别",
      prop: "line_name",
      align: "center",
    },
    {
      label: "清洗流程",
      prop: "clean_folw_text",
      align: "center",
    },
    {
      label: "检验结果",
      prop: "check_res",
      align: "center",
      cellRenderer: ({ row }) => {
        return typeof row.check_res === "number" ? getBasePassLabel(row.check_res) : "--";
      },
    },

    {
      label: "检验员1",
      prop: "check_sign",
      align: "center",
      slot: "check_sign",
    },
    {
      label: "检验员2",
      prop: "check_sign2",
      align: "center",
      slot: "check_sig2",
    },
    {
      label: "报告人",
      prop: "report_user_name",
      align: "center",
    },
    {
      label: "单据状态",
      prop: "status",
      align: "center",
      cellRenderer: ({ row }) => (
        <>
          <ElTag
            type={getTagType(row.status)}
            class={"cursor-pointer"}
            onClick={() => showApproveLog({ id: row.id, orderType: 34, orderStatus: row.status })}
          >
            {getStatusText(row.status, row.assoc_type)}
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
      label: "制单人",
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

  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    // {
    //   label: "关键字",
    //   prop: "keyword",
    // },
    {
      label: "单据编号",
      prop: "order_no",
    },
    {
      label: "线别",
      prop: "line_id",
      valueType: "select",
      options: getLineList,
    },
    {
      label: "单据状态",
      prop: "status",
      valueType: "select",
      options: statusOptions,
    },
    {
      label: "检验日期",
      prop: "check_date",
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
    formData,
    columns,
    searchColumns,
    router,
    cellDetail,
  };
}