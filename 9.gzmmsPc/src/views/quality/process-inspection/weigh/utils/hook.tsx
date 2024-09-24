import { FormInstance } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import dayjs from "dayjs";
import type { PlusFormGroupRow } from "plus-pro-components";
import { withKeys } from "vue";

/** 引入公共方法 */
import { getEcwBaseData } from "@/api/quality/common/index";

export function useList(search: () => void) {
  const BaseData = ref<any>(); // 获取公共下拉框数据配置
  const supplierOptions = ref<any>();
  // 获取公共下拉框数据配置
  async function initBaseData() {
    const result = await getEcwBaseData();
    BaseData.value = result.data;
    supplierOptions.value = result.data.supplier.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
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
    supplier_name: "", // 供应商名称
    check_date_arr: "",
  });
  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    {
      label: "供应商",
      prop: "supplier_name",
      fieldProps: {
        placeholder: "请输入关键词",
      },
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
    },
    {
      label: "检测日期",
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
      reserveSelection: true,
      label: "勾选列",
      fixed: "left",
    },
    {
      label: "单据编号",
      prop: "order_no",
      align: "center",
      minWidth: 140,
      cellRenderer: ({ row }) => (
        <span class="cursor-pointer underline text-sky-800">{row.order_no}</span>
      ),
    },
    {
      label: "检测日期",
      prop: "check_date",
      align: "center",
    },
    {
      label: "供应商",
      prop: "supplier_name",
      align: "center",
    },
    {
      label: "重量(g)",
      prop: "weight",
      slot: "weight",
      align: "center",
      minWidth: 880,
    },
    {
      label: "最高值(g)",
      prop: "max_weight",
      align: "center",
      minWidth: 90,
    },

    {
      label: "最低值(g)",
      prop: "min_weight",
      align: "center",
      minWidth: 90,
    },
    {
      label: "差值(g)",
      prop: "diff_weight",
      align: "center",
    },
    {
      label: "平均值(g)",
      prop: "avg_weight",
      align: "center",
      minWidth: 90,
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
  function checkDate(date: string, diffDate: string, type = 1) {
    let isBefore = dayjs(date).isBefore(dayjs(diffDate).format("YYYY-MM-DD"));
    let isAfter = dayjs(date).isAfter(dayjs(diffDate));
    return type === 1 ? isBefore : isAfter;
  }
  // 新增弹窗的数据
  const addFormData = ref({
    supplier_id: "", // 供应商id
    supplier_name: "", // 供应商名称
    max_weight: 0, // 最高值
    min_weight: 0, // 最低值
    diff_weight: 0, // 差值
    avg_weight: 0, // 平均值
    remark: "", // 备注
    check_date: "", // 检测日期
    weight: Array.from({ length: 10 }, (_, i) => {
      return {
        index: i + 1,
        vals: "",
      };
    }),
  });
  // 新增弹窗的表单项
  const addFormColumns: PlusFormGroupRow[] = [
    {
      title: "基础信息",
      hideInGroup: false,
      columns: [
        {
          label: "供应商",
          prop: "supplier_id",
          valueType: "select",
          colProps: {
            span: 12,
          },
          fieldProps: {
            placeholder: "请选择",
            filterable: true,
            onChange: (event: any) => {
              if (event) {
                // 查找供应商名称
                const matchingCheckUser: any = supplierOptions.value?.find(
                  (item: any) => item.value === event,
                );
                addFormData.value.supplier_name = matchingCheckUser?.label;
              }
            },
          },
          options: computed(() => {
            return supplierOptions.value;
          }),
        },
        {
          label: "检测日期",
          valueType: "date-picker",
          prop: "check_date",
          labelWidth: 90,
          fieldProps: {
            placeholder: "请选择检测日期",
            type: "date",
            format: "YYYY-MM-DD",
            valueFormat: "YYYY-MM-DD",
            disabledDate: (date: string) => {
              return checkDate(date, dayjs().format("YYYY-MM-DD"), 2); // 2今天之后的日期不可选
            },
          },
          colProps: {
            span: 12,
          },
        },
      ],
    },
    {
      title: "称重信息",
      columns: [
        {
          label: "最高值(g)",
          width: 80,
          prop: "max_weight",
          fieldProps: {
            disabled: true,
          },
          colProps: {
            span: 12,
          },
        },
        {
          label: "最低值(g)",
          width: 80,
          prop: "min_weight",
          fieldProps: {
            disabled: true,
          },
          colProps: {
            span: 12,
          },
        },
        {
          label: "差值(g)",
          width: 80,
          prop: "diff_weight",
          fieldProps: {
            disabled: true,
          },
          colProps: {
            span: 12,
          },
        },
        {
          label: "平均值(g)",
          width: 80,
          prop: "avg_weight",
          fieldProps: {
            disabled: true,
          },
          colProps: {
            span: 12,
          },
        },
        {
          label: "备注",
          width: 80,
          prop: "remark",
          fieldProps: {},
          colProps: {
            span: 24,
          },
        },
      ],
    },
  ];
  // 新增弹窗的验证规则
  const addFormRules = {
    supplier_id: [
      {
        required: false,
        message: "请选择供应商",
      },
    ],
    check_date: [
      {
        required: true,
        message: "请选择检验日期",
      },
    ],
    weight: [
      {
        required: true,
        message: "请录入重量",
      },
    ],
  };
  const weightColumns: TableColumnList = [
    {
      label: "序号",
      prop: "index",
      align: "center",
    },
    {
      label: "重量",
      prop: "vals",
      slot: "vals",
      align: "center",
    },
  ];
  //   重量表单验证
  const weightFormRules = {
    // 重量
    vals: [
      {
        required: false,
        validator: (rule: any, value: any, callback: any) => {
          if (!value) {
            callback();
          } else {
            // 10个重量必须填
            // let weight_all_vals = addFormData.value.weight.every((item: any) => {
            //   return item.vals;
            // });
            // console.log("weight_all_vals:", weight_all_vals);
            // if (!weight_all_vals) {
            //   callback(new Error("所有重量必须填写"));
            // } else {
            //   callback();
            // }
            callback();
          }
        },
      },
    ],
  };
  // 新增弹窗开关
  const addVisible = ref(false);
  /** 表格表单数据 */
  const addTableForm = reactive({
    weightTableData: addFormData.value.weight,
    weightTableFormRef: {} as FormInstance,
  });
  /** 表格数据 */
  const { weightTableData, weightTableFormRef } = toRefs(addTableForm);
  return {
    pagination,
    formData,
    searchColumns,
    columns,
    addFormData,
    addFormColumns,
    addFormRules,
    addVisible,
    initBaseData,
    weightColumns,
    weightFormRules,
    weightTableData,
    weightTableFormRef,
    addTableForm,
  };
}
