import { ElTag, dayjs } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { useRouter } from "vue-router";

export function useList() {
  const proOptions = [
    {
      label: "细菌总数、大肠菌群24h",
      value: 1,
    },
    {
      label: "霉菌、酵母菌48h",
      value: 2,
    },
  ];

  /** 培养种类 1 成品 2 其他 3 环境检测 */
  const cultivateOptions = [
    {
      label: "成品",
      value: 1,
    },
    {
      label: "其他",
      value: 2,
    },
    {
      label: "环境检测",
      value: 3,
    },
  ];

  function getCultivateName(type: number) {
    return cultivateOptions.find((item) => item.value === type)?.label || "--";
  }

  function getProTypeName(type: number) {
    return proOptions.find((item) => item.value === type)?.label || "--";
  }

  const router = useRouter();

  // 单据状态 -1删除 0 待确认 1 已确认(待取出) 2 已取出(待复核) 3 已复核
  const statusList = [
    {
      label: "待确认",
      value: 0,
    },
    {
      label: "待取出",
      value: 1,
    },
    {
      label: "待复核",
      value: 2,
    },
    {
      label: "已完成",
      value: 3,
    },
  ];

  function getStatusText(status: number) {
    return statusList.find((item) => item.value === status)?.label || "-";
  }

  function getTagType(status: number) {
    switch (status) {
      case 0:
        return "info";
      case 1:
        return "warning";
      case 2:
        return "";
      case 3:
        return "success";
      default:
        break;
    }
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
    inst_code: "", // 仪器编码
    status: undefined as FormNumType, //状态
    use_date: "", //使用日期
  });
  /** 签字复核/反审核,都是进入详情页面 */
  function cellDetail(row: any) {
    router.push({
      path: "/quality/instrument/incubator/add",
      query: {
        id: row.oid,
        pageType: 3,
      },
    });
  }

  /** 表格列配置 */
  const columns: TableColumnList = [
    {
      label: "勾选列",
      type: "selection",
      reserveSelection: true,
      // selectable: (row: any) => {
      //   return row.status == 3;
      // },
    },
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
      label: "使用日期",
      prop: "use_date",
      align: "center",
    },
    {
      label: "培养种类",
      prop: "type",
      align: "center",
      cellRenderer: ({ row }) => {
        return getCultivateName(row.type);
      },
    },
    {
      label: "检测报告编号",
      prop: "report_no",
      align: "center",
      minWidth: 110,
    },
    {
      label: "环境条件",
      align: "center",
      children: [
        {
          label: "室温（℃）",
          align: "center",
          prop: "temperature",
        },
        {
          label: "相对湿度（%）",
          align: "center",
          prop: "humidity",
        },
      ],
    },
    {
      label: "微生物检测项目",
      prop: "check_type_name",
      align: "center",
      minWidth: 110,
      slot: "check_type_name",
    },
    {
      label: "仪器名称",
      prop: "inst_name",
      align: "center",
      slot: "inst_name",
      minWidth: 100,
    },
    {
      label: "仪器编号",
      prop: "inst_code",
      align: "center",
      slot: "inst_code",
      minWidth: 90,
    },
    {
      label: "检测人",
      prop: "check_sign",
      align: "center",
      slot: "check_sign",
      minWidth: 120,
    },
    {
      label: "结束使用时间",
      prop: "end_time",
      align: "center",
      width: 110,
    },
    {
      label: "取出人",
      prop: "out_sign",
      align: "center",
      slot: "out_sign",
      minWidth: 120,
    },
    {
      label: "复核人",
      prop: "recheck_sign",
      align: "center",
      slot: "recheck_sign",
      minWidth: 120,
    },
    {
      label: "状态",
      prop: "status",
      align: "center",
      cellRenderer: ({ row }) => (
        <>
          {row.status != -1 ? (
            <ElTag type={getTagType(row.status)}>{getStatusText(row.status)}</ElTag>
          ) : (
            <span>--</span>
          )}
        </>
      ),
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
      fixed: "right",
      align: "center",
    },
  ];

  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    {
      label: "单据编号",
      prop: "order_no",
    },
    {
      label: "仪器编号",
      prop: "inst_code",
    },
    {
      label: "单据状态",
      prop: "status",
      valueType: "select",
      options: statusList,
    },
    {
      label: "使用日期",
      prop: "use_date",
      valueType: "date-picker",
      fieldProps: {
        placeholder: "请选择日期",
        type: "daterange",
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      },
    },
  ];

  const outFormData = ref({
    out_time: dayjs().format("YYYY-MM-DD HH:mm"), // 取出时间
  });

  const outVisible = ref(false);
  const outColumns: PlusColumnList = [
    {
      label: "取出时间",
      prop: "out_time",
      valueType: "date-picker",
      fieldProps: {
        placeholder: "请选择时间",
        type: "datetime",
        format: "YYYY-MM-DD HH:mm",
        valueFormat: "YYYY-MM-DD HH:mm",
        clearable: false,
      },
    },
  ];

  const outRules = {
    out_time: {
      required: true,
      message: "请选择取出时间",
    },
  };

  return {
    pagination,
    formData,
    columns,
    searchColumns,
    router,
    cellDetail,
    proOptions,
    getProTypeName,
    statusList,
    getStatusText,
    outFormData,
    outVisible,
    outColumns,
    outRules,
    cultivateOptions,
    getCultivateName,
  };
}
