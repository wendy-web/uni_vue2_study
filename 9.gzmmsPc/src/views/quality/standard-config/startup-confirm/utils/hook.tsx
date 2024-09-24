import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
import { useselectData } from "@/hooks/quality/selectData";

export function useList(search: () => void) {
  const { getLineList,getUserList } = useselectData();

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });
  /** 表单数据 */
  const formData = ref({
    name: "", // 项目名称
    is_open: "", // 可用状态
  });
  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    {
      label: "生产线别",
      prop: "name",
      fieldProps: {
        placeholder: "搜索关键词",
      },
      labelWidth: 100,
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
    },
  ];

  const columns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      width: 60,
      align: "center",
      hide: true,
    },
    {
      label: "生产线别",
      prop: "line_name",
      align: "center",
      showOverflowTooltip: true,
    },
    {
      label: "品质部经理",
      prop: "pz_manager_name",
      align: "center",
    },
    {
      label: "生产部经理",
      prop: "product_manag_name",
      align: "center",
    },
    {
      label: "化验室负责人",
      prop: "laboratory_manager_name",
      align: "center",
    },
    {
      label: "创建人",
      width: 120,
      prop: "ct_name",
      align: "center",
    },
    {
      label: "创建时间",
      width: 180,
      prop: "create_time",
      align: "center",
    },
    {
      label: "更新人",
      width: 120,
      prop: "up_name",
      align: "center",
    },
    {
      label: "更新时间",
      width: 180,
      prop: "update_time",
      align: "center",
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation",
    },
  ];

  // 新增弹窗的数据
  const addFormData = ref({
    line_id: undefined as FormNumType, // 生产线别
    pz_manager_uid: undefined as FormNumType, // 品质部经理
    product_manag_uid: undefined as FormNumType, // 生产部经理
    laboratory_manager_uid: undefined as FormNumType, // 化验室负责人
  });
  // 新增弹窗的表单项
  const addFormColumns: PlusColumnList = [
    {
      label: "生产线别",
      prop: "line_id",
      labelWidth: 120,
      valueType: "select",
      fieldProps:{
        filterable: true
      },
      options: getLineList,
    },
    {
      label: "品质部经理",
      prop: "pz_manager_uid",
      labelWidth: 120,
      valueType: "select",
      fieldProps:{
        filterable: true
      },
      options: getUserList,
    },
    {
      label: "生产部经理",
      prop: "product_manag_uid",
      labelWidth: 120,
      valueType: "select",
      fieldProps:{
        filterable: true
      },
      options: getUserList,
    },
    {
      label: "化验室负责人",
      prop: "laboratory_manager_uid",
      labelWidth: 120,
      valueType: "select",
      fieldProps:{
        filterable: true
      },
      options: getUserList,
    },
  ];
  // 新增弹窗的验证规则
  const addFormRules = {
    line_id: [
      {
        required: true,
        message: "请选择生产线别",
      },
    ],
    pz_manager_uid: [
      {
        required: true,
        message: "请选择品质部经理",
      },
    ],
    product_manag_uid: [
      {
        required: true,
        message: "请选择生产部经理",
      },
    ],
    laboratory_manager_uid: [
      {
        required: true,
        message: "请选择化验室负责人",
      },
    ],
  };

  // 新增弹窗开关
  const addVisible = ref(false);
  return {
    pagination,
    formData,
    searchColumns,
    columns,
    addFormData,
    addFormColumns,
    addFormRules,
    addVisible,
  };
}
