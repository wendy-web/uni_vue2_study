import { ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
import { useRouter } from "vue-router";
import { formartDate } from "@/utils/validate";
import { useCommonHooks } from "@/hooks/quality";
import { useselectData } from "@/hooks/quality/selectData";

export function useList(search: () => void) {
  const router = useRouter();
  const { showApproveLog } = useCommonHooks();
  const { statusOptions, getStatusText, getTagType, materialsClassOptions } = useselectData();

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
    keyword: "", // 关键字
    order_no: "", // 单据编号
    status: undefined as FormNumType, //状态
    check_date: "", //检验日期
    pro_date: "", //生产日期
  });
  /** 签字复核/反审核,都是进入详情页面 */
  function cellDetail(row: any) {
    router.push({
      path: "/quality/finished-product/war-horse/add",
      query: {
        id: row.id,
        pageType: 3,
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
      label: "产品大类",
      prop: "brand_name",
      align: "center",
    },
    {
      label: "生产日期",
      prop: "pro_date",
      align: "center",
    },
    {
      label: "检验日期",
      prop: "check_date",
      align: "center",
      cellRenderer: ({ row }) => {
        return formartDate(row.check_date);
      },
    },
    {
      label: "产线",
      prop: "line_str",
      align: "center",
    },
    {
      label: "报告人",
      prop: "report_user",
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
            onClick={() => showApproveLog({ id: row.id, orderType: 18, orderStatus: row.status })}
          >
            {getStatusText(row.status, row.assoc_type)}
          </ElTag>
        </>
      ),
    },
    {
      label: "备注",
      prop: "note",
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
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
    },
    {
      label: "生产日期",
      prop: "pro_date",
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
    },
    {
      label: "单据状态",
      prop: "status",
      valueType: "select",
      options: statusOptions,
      fieldProps: {
        onChange: () => {
          search();
        },
      },
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
    router,
    cellDetail,
  };
}
