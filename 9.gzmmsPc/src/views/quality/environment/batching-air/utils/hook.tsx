import { ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
// 引入获取下拉框的公共接口
import { getSampleBaseData } from "@/api/quality/common/index";
import { QualityCommonModule } from "@/api/quality/common/types";
import { useCommonHooks } from "@/hooks/quality";
import { useselectData } from "@/hooks/quality/selectData";

export function useList(search: () => void) {
  const { showApproveLog } = useCommonHooks();
  const { statusOptions, getTagType, getStatusText, getUserList } = useselectData();
  // 生产状态
  const proStatusOptions = ref<any>([
    {
      label: "全部",
      value: "",
    },
    {
      label: "开机",
      value: 0,
    },
    {
      label: "连续生产",
      value: 1,
    },
  ]);
  // 保存公共下拉框数据
  const BaseData = ref<any>();
  // 获取公共下拉框数据配置
  async function getBaseData() {
    const result = await getSampleBaseData();
    BaseData.value = result.data;
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
    tsa_no: "", // TSA培养基批号
    pro_status: "", // 生产状态
    status: "", // 单据状态
    check_date_arr: "", // 检查日期
    create_date_arr: "", // 创建日期
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
      label: "TSA培养基批号",
      prop: "tsa_no",
      labelWidth: 120,
      fieldProps: {
        placeholder: "请输入培养基批号",
      },
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
    },
    {
      label: "生产状态",
      prop: "pro_status",
      valueType: "select",
      options: computed(() => proStatusOptions.value),
      fieldProps: {
        onChange: () => {
          search();
        },
      },
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
  const passMap: Record<number, string> = {
    0: "不合格",
    1: "合格",
    2: "部分合格",
  };
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
      label: "培养基配置时间",
      prop: "tsa_config_date",
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
            onClick={() => showApproveLog({ id: row.id, orderType: 41, orderStatus: row.status })}
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
