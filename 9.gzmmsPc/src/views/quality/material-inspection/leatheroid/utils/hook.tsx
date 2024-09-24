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
  const { statusOptions, getStatusText, getTagType } = useselectData();

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
    system_serial_number: "", // 系统流水号
    status: undefined as FormNumType, //单据状态
    check_time: "",
  });

  /** 签字复核/反审核,都是进入详情页面 */
  function cellDetail(row: any) {
    router.push({
      path: "/quality/material-inspection/leatheroid/add",
      query: {
        id: row.id,
        pageType: 3,
      },
    });
  }

  /** 表格列配置 */
  const columns: TableColumnList = [
    // {
    //   label: "勾选列",
    //   type: "selection",
    // },
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
      label: "供应商",
      prop: "supplier_name",
      align: "center",
    },
    {
      label: "流水号",
      prop: "system_serial_number",
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
      label: "版本",
      prop: "version_no",
      align: "center",
    },
    {
      label: "检验日期",
      prop: "check_time",
      align: "center",
      cellRenderer: ({ row }) => {
        return formartDate(row.check_time);
      },
    },
    {
      label: "检验结果",
      prop: "check_res",
      align: "center",
      cellRenderer: ({ row }) => {
        return typeof row.check_res === "number" ? (row.check_res === 1 ? "合格" : "不合格") : "--";
      },
    },
    {
      label: "检验员",
      prop: "check_user",
      align: "center",
    },

    // 单据状态；0：暂存；1：待审核；2：已审核；3：已驳回；4：已撤回；5：已反审；
    {
      label: "单据状态",
      prop: "status",
      align: "center",
      cellRenderer: ({ row }) => (
        <>
          <ElTag
            type={getTagType(row.status)}
            class={"cursor-pointer"}
            onClick={() => showApproveLog({ id: row.id, orderType: 5, orderStatus: row.status })}
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
      label: "创建时间",
      prop: "create_time",
      align: "center",
      width: 110,
    },
    {
      label: "创建人",
      prop: "ct_name",
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
    // {
    //   label: "关键字",
    //   prop: "keyword",
    //   tooltip: "关键字:单据编号/流水号",
    // },
    {
      label: "单据编号",
      prop: "order_no",
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
    },
    {
      label: "系统流水号",
      prop: "system_serial_number",
      labelWidth: 90,
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
    },
    {
      label: "单据状态",
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
      label: "检验日期",
      prop: "check_time",
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
    cellDetail,
    router,
  };
}
