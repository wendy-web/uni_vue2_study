import { ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
import { QualityCommonModule } from "@/api/quality/common/types";
// 引入获取下拉框的公共接口
import { getBaseDataInitApi } from "@/api/quality/material-inspection/hot-film/index";
import { HotFilmModule } from "@/api/quality/material-inspection/hot-film/types";
import { useCommonHooks } from "@/hooks/quality";
import { useselectData } from "@/hooks/quality/selectData";

export function useList(search: () => void) {
  const { showApproveLog } = useCommonHooks();
  const { statusOptions, getTagType, getStatusText } = useselectData();
  // 保存公共下拉框数据
  const BaseData = ref<HotFilmModule.BaseData>();
  // 获取公共下拉框数据配置
  async function getBaseData() {
    const result = await getBaseDataInitApi();
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
    report_no: "", // 报告编号
    batch_no: "", // 生产批号
    status: "", //单据状态
    check_date_arr: "",
  });
  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    {
      label: "报告编号",
      prop: "report_no",
      fieldProps: {
        placeholder: "请输入关键词",
      },
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
    },
    {
      label: "生产批号",
      prop: "批次号",
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
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
      label: "检验完成日期",
      prop: "check_date_arr",
      labelWidth: 100,
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
      label: "报告编号",
      prop: "report_no",
      align: "center",
      cellRenderer: ({ row }) => (
        <span class="cursor-pointer underline text-sky-800">{row.order_no}</span>
      ),
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
      // cellRenderer: ({ row }) => {
      //   return typeof row.check_res === "number" ? (row.check_res === 1 ? "合格" : "不合格") : "--";
      // },
    },
    {
      label: "检验完成日期",
      prop: "check_date",
      align: "center",
    },
    {
      label: "报告人",
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
            onClick={() => showApproveLog({ id: row.id, orderType: 23, orderStatus: row.status })}
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
  // 新增弹窗开关;
  const addVisible = ref(false);
  // 新增弹窗的数据
  const addFormData = ref({
    batch_no: "", // 批次
  });

  // 新增弹窗的表单项;
  const addFormColumns: PlusColumnList = [
    {
      label: "批次",
      prop: "batch_no",
      fieldProps: {
        placeholder: "请输入批次",
      },
    },
  ];
  // 新增弹窗的验证规则;
  const addFormRules = {
    batch_no: [
      {
        required: true,
        message: "请输入批次",
      },
    ],
  };
  return {
    getBaseData,
    BaseData,
    statusOptions,
    pagination,
    formData,
    searchColumns,
    columns,
    addVisible,
    addFormData,
    addFormColumns,
    addFormRules,
  };
}
