import { ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
import { useRouter } from "vue-router";
import { useCommonHooks } from "@/hooks/quality";
import { useselectData } from "@/hooks/quality/selectData";

export function useList(search = () => {}) {
  const router = useRouter();
  const { showApproveLog } = useCommonHooks();
  const { statusOptions, getStatusText, getTagType, getUserList, getClasstimeMap } =
    useselectData();
  const addPath = "/quality/environment/bottling-air/add";

  const productionOptions = [
    {
      label: "开机",
      value: 0,
    },
    {
      label: "连续生产",
      value: 1,
    },
  ];

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
    tsa_no: "", //TSA培养基批号
    pro_status: undefined as FormNumType, // 生产状态
    class_type: undefined as FormNumType, //班组
    status: undefined as FormNumType, //状态
    ct_uid: undefined as FormNumType, //制单人
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
      label: "TSA培养基批号",
      prop: "tsa_no",
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
      labelWidth: 120,
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
      label: "生产状态",
      prop: "pro_status",
      valueType: "select",
      options: productionOptions,
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
      label: "检验日期",
      prop: "check_date",
      align: "center",
    },
    {
      label: "统计日期",
      prop: "stat_date",
      align: "center",
    },
    {
      label: "检验员",
      prop: "check_user",
      align: "center",
    },
    {
      label: "生产状态",
      prop: "pro_status_text",
      align: "center",
    },
    {
      label: "班组",
      prop: "class_type_text",
      align: "center",
    },
    {
      label: "TSA培养基批号",
      prop: "tsa_no",
      align: "center",
    },
    {
      label: "培养基配置人",
      prop: "tsa_config_user",
      align: "center",
    },
    {
      label: "培养基配置日期",
      prop: "tsa_config_date",
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
            onClick={() => showApproveLog({ id: row.id, orderType: 40, orderStatus: row.status })}
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

  return {
    pagination,
    formData,
    columns,
    searchColumns,
    router,
    cellDetail,
    addPath,
    productionOptions,
  };
}
