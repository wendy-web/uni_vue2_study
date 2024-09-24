import { ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
// 引入获取下拉框的公共接口
import { useCommonHooks } from "@/hooks/quality";
import { useselectData } from "@/hooks/quality/selectData";

export function useList(search: () => void) {
  const { showApproveLog } = useCommonHooks();
  const {
    statusOptions,
    getTagType,
    getStatusText,
    getUserList,
    classTimeOptions,
    getClasstimeMap,
    getLineList,
    passList,
  } = useselectData();
  // 保存公共下拉框数据
  const BaseData = ref<any>();
  // 线别
  const lineOptions = ref<any>();
  // 班组
  const classOptions = ref<any>();
  // 获取公共下拉框数据配置
  async function getBaseData() {
    classOptions.value = await getClasstimeMap();
    lineOptions.value = await getLineList();
    console.log("lineOptions.value", lineOptions.value);
  }
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
    check_date_arr: "", // 检查日期
    create_date_arr: "", // 创建日期
    status: "", // 单据状态
    ct_uid: "", // 制单人
  });
  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    {
      label: "单据编号",
      prop: "order_no",
      fieldProps: {
        placeholder: "搜索单据编号",
      },
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
    },
    {
      label: "检验日期",
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
    },
    {
      label: "创建日期",
      prop: "create_date_arr",
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
      options: computed(() => statusOptions),
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
      options: getUserList(),
      fieldProps: {
        onChange: () => {
          search();
        },
      },
    },
  ];
  /** 表格列配置 */
  const columns: TableColumnList = [
    {
      type: "selection",
      width: 60,
      label: "勾选列",
      fixed: "left",
      reserveSelection: true,
      selectable: (row: any) => {
        return row.status === 2;
      },
    },
    {
      label: "单据编号",
      prop: "order_no",
      align: "center",
      cellRenderer: ({ row }) => (
        <span class="cursor-pointer underline text-sky-800">{row.order_no}</span>
      ),
    },
    {
      label: "检验时间",
      prop: "check_time",
      align: "center",
    },
    {
      label: "培养结束时间",
      prop: "culture_end_time",
      align: "center",
    },
    {
      label: "检测员",
      prop: "check_user",
      align: "center",
    },
    {
      label: "报告人",
      prop: "report_user",
      align: "center",
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
            onClick={() => showApproveLog({ id: row.id, orderType: 46, orderStatus: row.status })}
          >
            {getStatusText(row.status, row.assoc_type)}
          </ElTag>
        </>
      ),
    },
    {
      label: "操作",
      slot: "operation",
      fixed: "right",
    },
  ];
  return {
    getBaseData,
    BaseData,
    statusOptions,
    pagination,
    formData,
    searchColumns,
    columns,
  };
}
