import { ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
import { QualityCommonModule } from "@/api/quality/common/types";
import { useCommonHooks } from "@/hooks/quality";
import { useselectData } from "@/hooks/quality/selectData";
import { useUserStore } from "@/store/modules/user";
const userStore = useUserStore();

export function useList(search: () => void) {
  const { showApproveLog } = useCommonHooks();
  const { getTagType, getStatusText, getSupList, getUserList, statusOptions } = useselectData();
  const supplierOptions = ref(); // 供应商下拉选项
  const userOptions = ref(); // 人员下拉选项
  // 初始化基础数据
  async function initBaseData() {
    supplierOptions.value = await getSupList();
    userOptions.value = await getUserList();
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
    batch_no: "", // 批次
    status: "", //单据状态
    check_date_arr: "",
    supplier_id: "", // 供应商id
  });
  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    {
      label: "单据编号",
      prop: "order_no",
      fieldProps: {
        placeholder: "请输入关键词",
      },
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
    },
    {
      label: "供应商",
      prop: "supplier_id",
      valueType: "select",
      options: getSupList,
      fieldProps: {
        filterable: true,
        onChange: () => {
          search();
        },
      },
    },
    {
      label: "审核状态",
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
        // status=2 已审核状态才可勾选
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
      label: "供应商",
      prop: "supplier_name",
      align: "center",
      minWidth: 100,
      cellRenderer: ({ row }) => {
        let { supplier_id } = row;
        let { supplier_name } = row;
        if (!supplier_name) {
          supplier_name = supplierOptions.value?.find(
            (item: any) => item.value === supplier_id,
          )?.label;
        }
        return <span>{supplier_name}</span>;
      },
    },
    {
      label: "检验日期",
      prop: "check_date",
      align: "center",
    },
    {
      label: "生产日期",
      prop: "pro_date",
      align: "center",
    },
    {
      label: "生产批号",
      prop: "batch_no",
      align: "center",
    },
    {
      label: "色度",
      prop: "color_val",
      align: "center",
    },
    {
      label: "Brix(%)",
      prop: "brix_val",
      align: "center",
    },
    {
      label: "密度",
      prop: "density_val",
      align: "center",
    },
    {
      label: "取样人",
      prop: "sampling_name",
      align: "center",
      cellRenderer: ({ row }) => {
        let { sampling_uid } = row;
        let { sampling_name } = row;
        if (!sampling_name) {
          sampling_name = userOptions.value?.find(
            (item: any) => item.value === sampling_uid,
          )?.label;
        }
        return <span>{sampling_name}</span>;
      },
    },
    {
      label: "检验员",
      prop: "check_user",
      align: "center",
    },
    {
      label: "香气",
      prop: "aroma_val",
      align: "center",
    },
    {
      label: "口感",
      prop: "taste_val",
      align: "center",
    },
    {
      label: "重金属(mg/kg)",
      align: "center",
      children: [
        {
          label: "铅",
          prop: "lead_val",
          align: "center",
        },
        {
          label: "砷",
          prop: "arsenic_val",
          align: "center",
        },
      ],
    },
    {
      label: "审批状态",
      prop: "status",
      align: "center",
      cellRenderer: ({ row }) => (
        <>
          <ElTag
            type={getTagType(row.status)}
            class={"cursor-pointer"}
            onClick={() => showApproveLog({ id: row.id, orderType: 32, orderStatus: row.status })}
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
    },

    {
      label: "操作",
      slot: "operation",
      fixed: "right",
    },
  ];
  // 执行年检相关
  const executeFormData = ref({
    aroma_val: "", // 香气实测值
    taste_val: "", // 口感
    lead_val: "",// 铅
    arsenic_val: "", // 砷
    check_user_id: userStore.uid, // 默认当前用户
    check_user_name: userStore.nickname,
    check_user_sign: "",
  });
  const tasteOptions = [
    {
      label: "✔",
      value: 1,
    },
    {
      label: "✖",
      value: 0,
    },
  ]
  const executeFormColumns: PlusColumnList = [
    {
      label: "感官检测信息",
      prop: "title1",
      colProps: {
        span: 24,
      }
    },
    {
      label: "香气",
      prop: "aroma_val",
      valueType: "select",
      labelWidth: 90,
      options: tasteOptions,
      fieldProps: {
        placeholder: "请选择",
      },
    },
    {
      label: "口感",
      prop: "taste_val",
      valueType: "select",
      labelWidth: 90,
      options: tasteOptions,
      fieldProps: {
        placeholder: "请选择",
      },
    },
    {
      label: "重金属检测信息",
      prop: "title2",
      labelWidth: 120,
      colProps: {
        span: 24,
      }
    },
    {
      label: "铅(mg/kg)",
      width: 90,
      prop: "lead_val",
    },
    {
      label: "砷(mg/kg)",
      width: 90,
      prop: "arsenic_val",
    },
    {
      label: "检验员",
      prop: "check_user_name",
      fieldProps: {
        disabled: true,
      }
    },
  ];
  const executeFormRules = {
    aroma_val: [
      {
        required: true,
        message: "请选择香气检测结果",
      },
    ],
    taste_val: [
      {
        required: true,
        message: "请选择口感检测结果",
      },
    ],
    lead_val: [
      {
        required: true,
        message: "请输入重金属检测结果",
      },
    ],
    arsenic_val: [
      {
        required: true,
        message: "请输入重金属检测结果",
      },
    ],
  };
  return {
    statusOptions,
    pagination,
    formData,
    searchColumns,
    columns,
    initBaseData,
    executeFormData,
    executeFormColumns,
    executeFormRules
  };
}
