import { ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
import { useCommonHooks } from "@/hooks/quality";
import { useselectData } from "@/hooks/quality/selectData";

export function useList(search: () => void) {
  const { showApproveLog } = useCommonHooks();
  const { statusOptions, getTagType, getStatusText, getLineList } = useselectData();

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
    line_id: "", // 空罐线别
    status: undefined as FormNumType, //单据状态
    check_date_arr: "", // 检测日期
  });

  /** 表格列配置 */
  const columns: TableColumnList = [
    {
      label: "生产批号",
      prop: "batch_no",
      align: "center",
      cellRenderer: ({ row }) => (
        <span class="cursor-pointer underline text-sky-800">{row.batch_no}</span>
      ),
    },
    {
      label: "空罐线别",
      prop: "line_name",
      align: "center",
    },
    {
      label: "版本",
      prop: "version_name",
      align: "center",
    },
    {
      label: "包号",
      prop: "batch_no",
      align: "center",
    },

    {
      label: "检验日期",
      prop: "check_date",
      align: "center",
    },
    {
      label: "产品大类",
      prop: "brand_name",
      align: "center",
    },
    {
      label: "产品类型",
      prop: "sku_name",
      align: "center",
    },
    {
      label: "确认人",
      prop: "check_user_name",
      align: "center",
    },
    {
      label: "状态",
      prop: "status_text",
      align: "center",
      cellRenderer: ({ row }) => (
        <>
          <ElTag
            type={getTagType(row.status)}
            class={"cursor-pointer"}
            onClick={() => showApproveLog({ id: row.id, orderType: 2, orderStatus: row.status })}
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
    },
    {
      label: "操作",
      slot: "operation",
      fixed: "right",
    },
  ];

  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    {
      label: "生产批号",
      prop: "order_no",
      fieldProps: {
        placeholder: "请输入关键字",
      },
      tooltip: "关键字:单据编号",
      labelWidth: 90,
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
    },

    {
      label: "空罐线别",
      prop: "line_id",
      valueType: "select",
      options: getLineList(),
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
  ];

  return {
    pagination,
    formData,
    columns,
    searchColumns,
    statusOptions,
  };
}
