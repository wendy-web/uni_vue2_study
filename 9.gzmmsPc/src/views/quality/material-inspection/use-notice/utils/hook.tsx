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
  const { statusOptions, getStatusText, getTagType, materialsClassOptions } = useselectData();

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
    materials_class_id: undefined as FormNumType, // 原材料类别
    status: undefined as FormNumType, //状态
    check_time: "",
  });

  /** 签字复核/反审核,都是进入详情页面 */
  function cellDetail(row: any) {
    router.push({
      path: "/quality/material-inspection/use-notice/add",
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
    //   selectable: (row) => {
    //     return row.status === 2;
    //   },
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
      label: "原材料类别",
      prop: "materials_class",
      align: "center",
    },
    {
      label: "产品大类",
      prop: "brand_name",
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
    {
      label: "单据状态",
      prop: "status",
      align: "center",
      cellRenderer: ({ row }) => (
        <>
          <ElTag
            type={getTagType(row.status)}
            class={"cursor-pointer"}
            onClick={() => showApproveLog({ id: row.id, orderType: 9, orderStatus: row.status })}
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

  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    // {
    //   label: "关键字",
    //   prop: "keyword",
    // },
    {
      label: "单据编号",
      prop: "order_no",
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
    },
    {
      label: "原材料类别",
      prop: "materials_class_id",
      valueType: "select",
      labelWidth: 100,
      options: materialsClassOptions,
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

  // 新增弹窗的数据
  // const addFormData = ref({
  //   type: undefined as FormNumType, //原材料类型
  //   class: undefined as FormNumType, //产品大类
  //   date: "", //日期
  // });
  // 新增弹窗的表单项
  // const addFormColumns: PlusColumnList = [
  //   {
  //     label: "原材料类别",
  //     prop: "type",
  //     valueType: "plus-radio",
  //     options: [
  //       {
  //         label: "空罐",
  //         value: 0,
  //       },
  //       {
  //         label: "顶盖",
  //         value: 1,
  //       },
  //     ],
  //   },
  //   {
  //     label: "产品大类",
  //     prop: "class",
  //     valueType: "plus-radio",
  //     options: getBrandMap(),
  //   },
  //   {
  //     label: "检验日期",
  //     prop: "date",
  //     valueType: "date-picker",
  //   },
  // ];
  // 新增弹窗的验证规则
  // const addFormRules = {
  //   type: [
  //     {
  //       required: true,
  //       message: "请选择原材料类型",
  //     },
  //   ],
  //   class: [
  //     {
  //       required: true,
  //       message: "请选择产品大类",
  //     },
  //   ],
  //   date: [{ required: true, message: "请选择日期" }],
  // };
  // 新增弹窗开关
  // const addVisible = ref(false);

  return {
    pagination,
    formData,
    columns,
    searchColumns,
    router,
    cellDetail,
    // addFormData,
    // addFormColumns,
    // addFormRules,
    // addVisible,
  };
}
