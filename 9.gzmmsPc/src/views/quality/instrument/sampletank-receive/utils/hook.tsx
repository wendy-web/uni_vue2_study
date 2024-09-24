import { ElInput, ElOption, ElSelect, ElTag, dayjs } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { useRouter } from "vue-router";
import { unitListApi } from "@/api/common/index";
import { onlyIntp, onlyNumPoint } from "@/utils/index";
import { formartDate } from "@/utils/validate";
import { useselectData } from "@/hooks/quality/selectData";

export function useList() {
  const router = useRouter();
  const { userOptions, getUserOptions } = useselectData();

  const unitList = ref<SelectOpitonType[]>([]);
  async function getUnitList() {
    const result = await unitListApi();
    let list = result.data.list;
    unitList.value = list;
  }

  const statusOptions = [
    {
      label: "未确认",
      value: 0,
    },
    {
      label: "已确认",
      value: 1,
    },
    {
      label: "已销毁",
      value: 2,
    },
  ];

  function getStatausText(value: number) {
    return statusOptions.find((item) => item.value === value)?.label || "";
  }

  function getTagType(value: number) {
    switch (value) {
      case 0:
        return "info";
      case 1:
        return "success";
      case 2:
        return "warning";

      default:
        return "";
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
    order_no: "", //单据编号
    name: "", //样罐名称
    status: undefined as FormNumType, //领用状态
    isuse_date: "", //更换时间
  });
  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    {
      label: "单据编号",
      prop: "order_no",
    },
    {
      label: "样罐名称",
      prop: "name",
    },
    {
      label: "领用状态",
      prop: "status",
      valueType: "select",
      options: statusOptions,
    },
    {
      label: "领用日期",
      prop: "isuse_date",
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

  /** 表格列配置 */
  const columns: TableColumnList = [
    {
      label: "勾选列",
      type: "selection",
      reserveSelection: true,
    },
    {
      label: "单据编号",
      prop: "order_no",
      align: "center",
    },
    {
      label: "标准样罐名称",
      prop: "name",
      align: "center",
    },

    {
      label: "单位",
      prop: "unit",
      align: "center",
    },
    {
      label: "领用数量",
      prop: "isuse_num",
      align: "center",
    },
    {
      label: "领用日期",
      prop: "isuse_date",
      align: "center",
    },
    {
      label: "用途",
      prop: "purpose",
      align: "center",
    },
    {
      label: "归还日期",
      prop: "return_date",
      align: "center",
    },
    {
      label: "归还数量",
      prop: "return_num",
      align: "center",
    },
    {
      label: "领用人",
      prop: "confirm_sign",
      align: "center",
      slot: "confirm_sign",
      minWidth: 120,
    },
    {
      label: "领用状态",
      prop: "status",
      align: "center",
      cellRenderer: ({ row }) => (
        <>
          <ElTag type={getTagType(row.status)}>{getStatausText(row.status)}</ElTag>
        </>
      ),
    },
    {
      label: "销毁记录",
      align: "center",
      children: [
        {
          label: "销毁日期",
          prop: "destroy_date",
          align: "center",
        },
        {
          label: "销毁人",
          prop: "destroy_user_name",
          align: "center",
        },
        {
          label: "销毁人签名",
          prop: "destroy_sign",
          align: "center",
          slot: "destroy_sign",
        },
        {
          label: "销毁备注",
          prop: "destroy_remark",
          align: "center",
        },
      ],
    },

    {
      label: "备注",
      prop: "remark",
      align: "center",
    },
    // {
    //   label: "制单人",
    //   prop: "ct_name",
    //   align: "center",
    // },
    // {
    //   label: "创建时间",
    //   prop: "create_time",
    //   align: "center",
    //   width: 110,
    // },
    {
      label: "操作",
      slot: "operation",
      fixed: "right",
      align: "center",
    },
  ];

  // 新增弹窗的数据
  const addFormData = ref({
    name: "", // 标准样罐名称
    unit: "", //单位
    isuse_num: "", //领用数量
    isuse_date: "", //领用日期
    purpose: "", //用途
    return_num: "", //归还数量
    return_date: "", //归还日期
    remark: "", //备注
  });

  /** 确认签名 */
  const confirm_sign = ref("");

  // 新增弹窗的表单项;
  const addFormColumns: PlusColumnList = [
    {
      label: "标准样罐名称",
      prop: "name",
    },
    {
      label: "单位",
      prop: "unit",
      valueType: "select",
      renderField: () => {
        return (
          <ElSelect v-model={addFormData.value.unit} style="width:100%" filterable={true}>
            {unitList.value.map((option) => (
              <ElOption key={option.id} label={option.name} value={option.name} />
            ))}
          </ElSelect>
        );
      },
    },
    {
      label: "领用数量",
      prop: "isuse_num",
      renderField: (value, onChange) => {
        let val = onlyIntp(value);
        return h(ElInput, {
          modelValue: val,
          onChange,
          placeholder: "领用数量",
        });
      },
    },
    {
      label: "领用日期",
      prop: "isuse_date",
      valueType: "date-picker",
      fieldProps: {
        type: "date",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      },
    },

    {
      label: "用途",
      prop: "purpose",
      colProps: {
        span: 24,
      },
    },
    {
      label: "归还数量",
      prop: "return_num",
      renderField: (value, onChange) => {
        let val = onlyIntp(value);
        return h(ElInput, {
          modelValue: val,
          onChange,
          placeholder: "归还数量",
        });
      },
    },
    {
      label: "归还日期",
      prop: "return_date",
      valueType: "date-picker",
      fieldProps: {
        type: "date",
        placeholder: "请选择时间",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      },
    },
    {
      label: "备注",
      prop: "remark",
      fieldProps: {
        type: "textarea",
        rows: 3,
      },
      colProps: {
        span: 24,
      },
    },
  ];

  // 新增弹窗的验证规则;
  const addFormRules = {
    name: [
      {
        required: true,
        message: "请输入标准样罐名称",
      },
    ],
    unit: [
      {
        required: true,
        message: "请选择单位",
      },
    ],
    isuse_num: [
      {
        required: true,
        message: "请输入领用数量",
        trigger: "blur",
      },
    ],
    isuse_date: [
      {
        required: true,
        message: "请选择领用日期",
      },
    ],
    purpose: [
      {
        required: true,
        message: "请输入用途",
      },
    ],
    return_num: [
      {
        validator: (rule: any, value: string, callback: any) => {
          if (!value) {
            callback();
          } else {
            if (Number(value) > Number(addFormData.value.isuse_num)) {
              callback(new Error("归还数量不可大于领用数量"));
            } else {
              callback();
            }
          }
        },
      },
    ],
  };
  // 新增弹窗开关;
  const addVisible = ref(false);
  const addLoading = ref(false);

  /** 销毁弹窗的数据 */
  const destroyFormData = ref({
    destroy_date: dayjs().format("YYYY-MM-DD"), //销毁日期
    destroy_num: 0, //销毁数量
    destroy_time: "", //销毁时间
    destroy_user_id: undefined as FormNumType, //销毁人id
    destroy_user_name: "", //销毁人名称
    status: "", //单据状态
    destroy_remark: "", //销毁备注
    destroy_type: "", //销毁类别
    destroy_sign: "", //销毁签名
    destroy_max_num: 0, //销毁数量最大值
  });

  const selectUserRef = ref<InstanceType<typeof ElSelect>>();

  const destroyFormColumns: PlusColumnList = [
    {
      label: "销毁日期",
      prop: "destroy_date",
      valueType: "date-picker",
      fieldProps: {
        type: "date",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      },
    },
    {
      label: "销毁类别",
      prop: "destroy_type",
    },
    {
      label: "销毁数量",
      prop: "destroy_num",
      valueType: "input-number",
      fieldProps: computed(() => {
        return {
          max: destroyFormData.value.destroy_max_num,
          min: 0,
          onBlur: () => {
            if (!destroyFormData.value.destroy_num) {
              destroyFormData.value.destroy_num = 0;
            }
          },
        };
      }),
    },
    {
      label: "销毁人",
      prop: "destroy_user_id",
      renderField: () => {
        return (
          <ElSelect
            v-model={destroyFormData.value.destroy_user_id}
            ref={selectUserRef}
            style="width:100%"
            filterable={true}
            onChange={() => {
              nextTick(() => {
                destroyFormData.value.destroy_user_name =
                  selectUserRef.value?.selected.currentLabel;
              });
            }}
          >
            {userOptions.value.map((option) => (
              <ElOption key={option.id} label={option.name} value={option.id} />
            ))}
          </ElSelect>
        );
      },
    },
    {
      label: "销毁备注",
      prop: "destroy_remark",
      fieldProps: {
        type: "textarea",
        rows: 3,
      },
      colProps: {
        span: 24,
      },
    },
  ];

  const destroyFormRules = {
    destroy_date: [
      {
        required: true,
        message: "销毁日期",
      },
    ],
    destroy_type: [
      {
        required: true,
        message: "销毁类别",
      },
    ],
    destroy_num: [
      {
        required: true,
        message: "销毁数量",
        trigger: "blur",
      },
    ],
    destroy_user_id: [
      {
        required: true,
        message: "销毁人",
      },
    ],
  };

  // 新增弹窗开关;
  const destroyVisible = ref(false);
  const destroyLoading = ref(false);

  return {
    pagination,
    formData,
    columns,
    searchColumns,
    router,
    addFormData,
    addFormColumns,
    addFormRules,
    addVisible,
    addLoading,
    confirm_sign,
    getUnitList,
    destroyFormData,
    destroyFormColumns,
    destroyVisible,
    destroyLoading,
    destroyFormRules,
    getUserOptions,
  };
}
