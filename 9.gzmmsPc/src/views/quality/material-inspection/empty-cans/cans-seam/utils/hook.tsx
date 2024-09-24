import { ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
// 引入获取表头、下拉框的公共接口
import { getEmptyOrderBaseDataApi, getTabelLabelApi } from "@/api/quality/common/index";
import { QualityCommonModule } from "@/api/quality/common/types";
import { useCommonHooks } from "@/hooks/quality";
import { useselectData } from "@/hooks/quality/selectData";

export function useList(search: () => void) {
  const { showApproveLog } = useCommonHooks();
  const { statusOptions, getTagType, getStatusText } = useselectData();
  const EmptyOrderBaseData = ref<QualityCommonModule.EmptyOrderBaseData>();
  // 获取公共下拉框数据配置
  async function getEmptyOrderBaseData() {
    const result = await getEmptyOrderBaseDataApi();
    EmptyOrderBaseData.value = result.data;
    // statusOptions.value.splice(
    //   0,
    //   0,
    //   ...result.data.status.map((item) => {
    //     return {
    //       label: item.name,
    //       value: item.id,
    //     };
    //   }),
    // );
  }
  // 获取表头
  async function getTableClumns(data: QualityCommonModule.TabelLabelQuery) {
    const result = await getTabelLabelApi(data);
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
    batch_no: "", // 生产批号
    status: undefined as FormNumType, //单据状态
    check_date_arr: "", // 检测日期
  });

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
      label: "生产批号",
      prop: "batch_no",
      align: "center",
    },
    {
      label: "检验结果",
      prop: "check_ret_text",
      align: "center",
    },
    {
      label: "检验日期",
      prop: "check_date",
      align: "center",
    },
    {
      label: "检验员",
      prop: "check_user_name",
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
            onClick={() => showApproveLog({ id: row.id, orderType: 1, orderStatus: row.status })}
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
      label: "单据编号",
      prop: "order_no",
      fieldProps: {
        placeholder: "请输入关键字",
      },
      tooltip: "关键字:单据编号",
      labelWidth: 100,
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
    },
    {
      label: "生产批号",
      prop: "batch_no",
      fieldProps: {
        placeholder: "请输入关键字",
      },
      tooltip: "关键字:生产批号",
      labelWidth: 100,
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
    getEmptyOrderBaseData,
    statusOptions,
    EmptyOrderBaseData,
  };
}
