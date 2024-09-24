/* 灌装封口机清洗记录 */
import { ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
import { useRouter } from "vue-router";
import { useCommonHooks } from "@/hooks/quality";
import { useselectData } from "@/hooks/quality/selectData";

export function useList(search: () => void) {
  const router = useRouter();
  const { showApproveLog } = useCommonHooks();
  const { statusOptions, getStatusText, getTagType, getLineList, getUserList, getClasstimeMap } =
    useselectData();
  const addPath = "/quality/environment/capper-rinse/add";

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
    keyword: "", // 关键字搜索
    line_id: undefined as FormNumType, //产线id
    class_no: undefined as FormNumType, //班次
    class_type: undefined as FormNumType, //班组
    status: undefined as FormNumType, //状态
    ct_uid: undefined as FormNumType, //制单人
    check_res: undefined as FormNumType, //检验结果
    create_time: "", //创建日期
    check_date: "", //检查日期
  });

  /** 签字复核/反审核,都是进入详情页面 */
  function cellDetail(row: any) {
    router.push({
      path: addPath,
      query: {
        id: row.id,
        pageType: 3,
      },
    });
  }

  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    {
      label: "单据编号",
      prop: "order_no",
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
    },
    {
      label: "线别",
      prop: "line_id",
      valueType: "select",
      options: getLineList,
      fieldProps: {
        onChange: () => {
          search();
        },
      },
    },
    {
      label: "班次",
      prop: "class_no",
      valueType: "select",
      options: [
        {
          label: "早",
          value: 1,
        },
        {
          label: "中",
          value: 2,
        },
        {
          label: "夜",
          value: 3,
        },
      ],
      fieldProps: {
        onChange: () => {
          search();
        },
      },
    },
    {
      label: "班组",
      prop: "class_type",
      valueType: "select",
      options: getClasstimeMap,
      fieldProps: {
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
      label: "制单人",
      prop: "ct_uid",
      valueType: "select",
      options: getUserList,
      fieldProps: {
        filterable: true,
        onChange: () => {
          search();
        },
      },
    },
    {
      label: "检查日期",
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
    {
      label: "创建日期",
      prop: "create_time",
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
      label: "检查日期",
      prop: "check_date",
      align: "center",
    },
    {
      label: "产线",
      prop: "line_text",
      align: "center",
    },
    {
      label: "班次",
      prop: "class_no_text",
      align: "center",
    },
    {
      label: "班组",
      prop: "class_type_text",
      align: "center",
    },
    {
      label: "清洗时间",
      prop: "clean_time",
      align: "center",
    },
    {
      label: "检验结果",
      prop: "check_res",
      align: "center",
      cellRenderer: ({ row }) => {
        return typeof row.check_res === "number" ? (row.check_res === 1 ? "合格" : "异常") : "--";
      },
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
            onClick={() => showApproveLog({ id: row.id, orderType: 39, orderStatus: row.status })}
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
      align: "center",
    },
  ];

  return {
    pagination,
    formData,
    columns,
    searchColumns,
    router,
    cellDetail,
    addPath,
  };
}
