import type { PaginationProps } from "@pureadmin/table";
import { formartDate } from "@/utils/validate";
import { useSearchFrom } from "@/hooks/searchForm";

export function useList() {
  const { storageList, userList } = useSearchFrom();

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
    align: "left",
  });

  const formData = ref({
    keyword: "",
    ret_wh_id: undefined as FormNumType,
    ret_name: undefined as FormNumType,
    dept_id: undefined as FormNumType,
    status: undefined as FormNumType,
    time: "",
  });

  const searchColumns: PlusColumnList = [
    {
      label: "关键字",
      prop: "keyword",
    },
    {
      label: "仓库",
      prop: "ret_wh_id",
      valueType: "select",
      options: () => {
        return storageList;
      },
    },
    {
      label: "退库人",
      prop: "ret_name",
      valueType: "select",
      options: () => {
        return userList;
      },
    },
    {
      label: "部门",
      prop: "dept_id",
    },
    {
      label: "状态",
      prop: "status",
      valueType: "select",
      options: [
        {
          label: "待提审",
          value: 0,
        },
        {
          label: "待审核",
          value: 1,
        },
        {
          label: "已完成",
          value: 3,
        },
        {
          label: "已撤回",
          value: 4,
        },
        {
          label: "已驳回",
          value: 5,
        },
        {
          label: "已作废",
          value: 6,
        },
        {
          label: "已审核",
          value: 7,
        },
      ],
    },
    {
      label: "时间",
      prop: "time",
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

  const columns: TableColumnList = [
    {
      label: "退库单号",
      prop: "wh_inv_ret_no",
      align: "center",
    },
    {
      label: "入库日期",
      prop: "ret_time",
      align: "center",
      cellRenderer: ({ row }) => {
        return formartDate(row.ret_time);
      },
    },
    {
      label: "备品备件明细",
      prop: "product_name",
      align: "center",
    },
    {
      label: "总数量",
      prop: "total_num",
      align: "center",
    },
    {
      label: "退库人",
      prop: "ret_name",
      align: "center",
    },
    {
      label: "退入仓库",
      prop: "ret_wh_name",
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
      label: "备注",
      prop: "note",
      align: "center",
    },
    {
      label: "状态",
      prop: "status",
      align: "center",
      slot: "status",
      width: 90
    },
    {
      label: "操作",
      align: "center",
      slot: "opreation",
    },
  ];

  /**
   *
   * @param assocType 接口返回的assoc_type数组
   * @param query 需要判断的值
   * @returns
   */
  const checkAssocType = (assocType: number[], query: number | number[]) => {
    if (Array.isArray(query)) {
      return query.some((item) => assocType.includes(item));
    }
    if (assocType.includes(query)) {
      return true;
    } else {
      return false;
    }
  };

  return {
    pagination,
    formData,
    searchColumns,
    columns,
    checkAssocType,
  };
}
