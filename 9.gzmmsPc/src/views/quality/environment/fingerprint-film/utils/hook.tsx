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
    keyword: "", // 关键字搜索
    class_type: "", // 班组
    line_id: "", // 线别
    // check_res: "", // 检验结论,0：不合格；1：合格
    check_date_arr: "", // 检查日期
    create_date_arr: "", // 创建日期
    status: "", // 单据状态
    ct_uid: "", // 制单人
    // order_no: "", // 单据编号
  });
  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    {
      label: "关键字",
      prop: "keyword",
      fieldProps: {
        placeholder: "搜索单据编号",
      },
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
    },
    {
      label: "班组",
      prop: "class_type",
      valueType: "select",
      options: computed(() => classOptions.value),
      fieldProps: {
        onChange: () => {
          search();
        },
      },
    },
    {
      label: "线别",
      prop: "line_id",
      valueType: "select",
      options: computed(() => lineOptions.value),
      fieldProps: {
        onChange: () => {
          search();
        },
      },
    },
    // {
    //   label: "检测结论",
    //   prop: "check_res",
    //   valueType: "select",
    //   options: computed(() => {
    //     return passList.map(item=>{
    //       return {label:item.name, value:item.id}
    //     });
    //   }),
    //   fieldProps: {
    //     onChange: () => {
    //       search();
    //     },
    //   },
    // },
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
  const passMap: Record<number, string> = {
    0: "不合格",
    1: "合格",
    2: "部分合格",
  };
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
      label: "检验日期",
      prop: "check_date",
      align: "center",
    },
    {
      label: "CT时间",
      prop: "ct_time",
      align: "center",
    },
    {
      label: "班组",
      prop: "class_type_text",
      align: "center",
    },
    {
      label: "线别",
      prop: "line_text",
      align: "center",
    },
    {
      label: "被测人员",
      prop: "tested_user",
      align: "center",
    },
    // {
    //   label: "检验结论",
    //   prop: "check_res",
    //   align: "center",
    //   cellRenderer: ({ row }) => {
    //     return typeof row.check_res === "number" ? (row.check_res === 1 ? "合格" : "不合格") : "--";
    //   },
    // },
    {
      label: "检测人",
      prop: "check_user",
      align: "center",
    },
    {
      label: "记录人",
      prop: "record_user",
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
            onClick={() => showApproveLog({ id: row.id, orderType: 45, orderStatus: row.status })}
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
