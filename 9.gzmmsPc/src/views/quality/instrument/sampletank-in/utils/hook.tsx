import { ElInput, ElOption, ElSelect, ElTag, dayjs } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { useRouter } from "vue-router";
import { unitListApi } from "@/api/common/index";
import { onlyIntp } from "@/utils/index";
import { formartDate } from "@/utils/validate";
import { useCommonHooks } from "@/hooks/quality";
import { useselectData } from "@/hooks/quality/selectData";

export function useList() {
  const router = useRouter();
  const { showApproveLog } = useCommonHooks();
  const { userOptions, getUserOptions, getStatusText, getTagType } = useselectData();

  const unitList = ref<SelectOpitonType[]>([]);
  async function getUnitList() {
    const result = await unitListApi();
    let list = result.data.list;
    unitList.value = list;
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
    status: undefined as FormNumType, //单据状态
    stock_date: "", //入库日期
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
    },
    {
      label: "入库日期",
      prop: "stock_date",
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
      label: "入库数量",
      prop: "stock_num",
      align: "center",
    },
    {
      label: "入库日期",
      prop: "stock_date",
      align: "center",
    },
    {
      label: "入库人",
      prop: "stock_user_name",
      align: "center",
    },
    {
      label: "入库人签字",
      prop: "stock_sign",
      align: "center",
      slot: "stock_sign",
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
            onClick={() => showApproveLog({ id: row.id, orderType: 37, orderStatus: row.status })}
          >
            {getStatusText(row.status, row.assoc_type)}
          </ElTag>
        </>
      ),
    },
    {
      label: "确认人签字",
      prop: "confirm_sign",
      align: "center",
      slot: "confirm_sign",
      minWidth: 120,
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
    stock_num: "", //入库数量
    stock_date: "", //入库日期
    stock_user_id: undefined as FormNumType, //入库人ID
    stock_user_name: "", //入库人名称

    remark: "", //备注
  });

  /** 入库签名 */
  const stock_sign = ref("");
  /** 复核员签名 */
  const recheck_sign = ref("");
  /** 审核备注 */
  const check_remark = ref("");
  const addDisabled = ref(false);

  const selectUserRef = ref<InstanceType<typeof ElSelect>>();

  // 新增弹窗的表单项;
  const addFormColumns: PlusColumnList = [
    {
      label: "标准样罐名称",
      prop: "name",
      fieldProps: computed(() => {
        return {
          disabled: addDisabled.value,
        };
      }),
    },
    {
      label: "单位",
      prop: "unit",
      valueType: "select",
      renderField: () => {
        return (
          <ElSelect
            disabled={addDisabled.value}
            v-model={addFormData.value.unit}
            style="width:100%"
            filterable={true}
          >
            {unitList.value.map((option) => (
              <ElOption key={option.id} label={option.name} value={option.name} />
            ))}
          </ElSelect>
        );
      },
    },
    {
      label: "入库数量",
      prop: "stock_num",
      renderField: (value, onChange) => {
        let val = onlyIntp(value);
        return h(ElInput, {
          modelValue: val,
          onChange,
          disabled: addDisabled.value,
        });
      },
    },
    {
      label: "入库日期",
      prop: "stock_date",
      valueType: "date-picker",
      fieldProps: computed(() => {
        return {
          format: "YYYY-MM-DD",
          valueFormat: "YYYY-MM-DD",
          disabled: addDisabled.value,
        };
      }),
    },
    {
      label: "入库人",
      prop: "stock_user_id",
      renderField: () => {
        return (
          <ElSelect
            v-model={addFormData.value.stock_user_id}
            ref={selectUserRef}
            style="width:100%"
            filterable={true}
            onChange={() => {
              nextTick(() => {
                addFormData.value.stock_user_name = selectUserRef.value?.selected.currentLabel;
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
      label: "备注",
      prop: "remark",
      // @ts-expect-error
      fieldProps: computed(() => {
        return {
          type: "textarea",
          rows: 3,
          disabled: addDisabled.value,
        };
      }),
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
    stock_num: [
      {
        required: true,
        message: "请输入入库数量",
      },
    ],
    stock_date: [
      {
        required: true,
        message: "请选择入库日期",
      },
    ],
    stock_user_id: [
      {
        required: true,
        message: "请选择入库人",
      },
    ],
  };
  // 新增弹窗开关;
  const addVisible = ref(false);
  const addLoading = ref(false);

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
    stock_sign,
    recheck_sign,
    getUnitList,
    getUserOptions,
    check_remark,
    addDisabled,
  };
}
