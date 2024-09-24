import { ElOption, ElSelect } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import { formartDate } from "@/utils/validate";
import { useselectData } from "@/hooks/quality/selectData";

export function useList() {
  const router = useRouter();

  const { baseCheckStatusList, getSkuMap, skuList, baseCheckStatusLabel } = useselectData();

  const brand_data = ref<SelectOpitonType[]>([]); //产品大类
  const check_init = ref<SelectOpitonType[]>([]); //检测结果
  const line_init = ref<SelectOpitonType[]>([]); //线别
  const pro_init = ref<SelectOpitonType[]>([]); //项目
  const work_shop_init = ref<SelectOpitonType[]>([]); //车间

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
    // keyword: "", // 关键字
    order_no: "", // 单据编号
    line_id: "", //线别
    check_ret: undefined as FormNumType, //检验结果
    check_date: "", //检验日期
  });
  /** 签字复核/反审核,都是进入详情页面 */
  function cellDetail(row: any) {
    router.push({
      path: "/quality/process-inspection/cip/add",
      query: {
        id: row.id,
        pageType: 3,
      },
    });
  }

  /** 表格列配置 */
  const columns: TableColumnList = [
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
      label: "车间",
      prop: "workshop_name",
      align: "center",
    },
    {
      label: "线别",
      prop: "line_name",
      align: "center",
    },
    {
      label: "CIP项目",
      prop: "pro_name",
      align: "center",
    },

    {
      label: "检测日期",
      prop: "check_date",
      align: "center",
      cellRenderer: ({ row }) => {
        return formartDate(row.check_date);
      },
    },
    {
      label: "检测状态",
      prop: "check_ret",
      align: "center",
      cellRenderer: ({ row }) => {
        return baseCheckStatusLabel(row.check_ret);
      },
    },

    // {
    //   label: "备注",
    //   prop: "remark",
    //   align: "center",
    // },
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
    },
    {
      label: "线别",
      prop: "line_id",
      valueType: "select",
      options: computed(() => {
        return line_init.value.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      }),
    },
    {
      label: "检测状态",
      prop: "check_ret",
      valueType: "select",
      options: baseCheckStatusList,
    },
    {
      label: "检测日期",
      prop: "check_date",
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

  // 新增弹窗的数据
  const addFormData = ref({
    workshop_id: undefined as FormNumType,
    workshop_name: "", //车间名称
    line_id: undefined as FormNumType,
    line_name: "", //线别名称
    brand: "", //产品大类
    sku: "", //产品类型
    check_date: dayjs().format("YYYY-MM-DD"),
    pro_id: undefined as FormNumType, //项目id
    pro_name: "", //项目内容
  });

  const selectWorkshopRef = ref<InstanceType<typeof ElSelect>>();
  const selectLineRef = ref<InstanceType<typeof ElSelect>>();
  const selectProRef = ref<InstanceType<typeof ElSelect>>();

  // 新增弹窗的表单项;
  const addFormColumns: PlusColumnList = [
    {
      label: "车间",
      prop: "workshop_id",
      renderField: () => {
        return (
          <ElSelect
            v-model={addFormData.value.workshop_id}
            ref={selectWorkshopRef}
            style="width:100%"
            filterable={true}
            onChange={() => {
              nextTick(() => {
                addFormData.value.workshop_name = selectWorkshopRef.value?.selected.currentLabel;
              });
            }}
          >
            {work_shop_init.value.map((option) => (
              <ElOption key={option.id} label={option.name} value={option.id} />
            ))}
          </ElSelect>
        );
      },
    },
    {
      label: "线别",
      prop: "line_id",
      renderField: () => {
        return (
          <ElSelect
            v-model={addFormData.value.line_id}
            ref={selectLineRef}
            style="width:100%"
            filterable={true}
            onChange={() => {
              nextTick(() => {
                addFormData.value.line_name = selectLineRef.value?.selected.currentLabel;
              });
            }}
          >
            {line_init.value.map((option) => (
              <ElOption key={option.id} label={option.name} value={option.id} />
            ))}
          </ElSelect>
        );
      },
    },
    {
      label: "产品大类",
      prop: "brand",
      valueType: "select",
      options: computed(() => {
        return brand_data.value.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      }),
      fieldProps: {
        onChange(val: string) {
          addFormData.value.sku = "";
          getSkuMap(val);
        },
      },
    },
    {
      label: "产品类型",
      prop: "sku",
      valueType: "select",
      options: computed(() => {
        return skuList.value;
      }),
      fieldProps: computed(() => {
        return {
          placeholder: "请先选择产品大类",
          disabled: !addFormData.value.brand,
        };
      }),
    },
    {
      label: "检测日期",
      prop: "check_date",
      valueType: "date-picker",
      fieldProps: {
        clearable: false,
        type: "date",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      },
    },
    {
      label: "CIP项目",
      prop: "pro_id",
      valueType: "select",
      renderField: () => {
        return (
          <ElSelect
            v-model={addFormData.value.pro_id}
            ref={selectProRef}
            style="width:100%"
            filterable={true}
            onChange={() => {
              nextTick(() => {
                addFormData.value.pro_name = selectProRef.value?.selected.currentLabel;
              });
            }}
          >
            {pro_init.value.map((option) => (
              <ElOption key={option.id} label={option.name} value={option.id} />
            ))}
          </ElSelect>
        );
      },
    },
  ];

  // 新增弹窗的验证规则;
  const addFormRules = {
    workshop_id: [
      {
        required: true,
        message: "请选择车间",
      },
    ],
    line_id: [
      {
        required: true,
        message: "请选择线别",
      },
    ],
    brand: [
      {
        required: true,
        message: "请选择产品大类",
      },
    ],
    sku: [
      {
        required: true,
        message: "请选择产品类型",
      },
    ],
    check_date: [
      {
        required: true,
        message: "请选择检测日期",
      },
    ],
    pro_id: [
      {
        required: true,
        message: "请选择CIP项目",
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
    cellDetail,
    addFormData,
    addFormColumns,
    addVisible,
    addFormRules,
    addLoading,
    brand_data,
    check_init,
    line_init,
    pro_init,
    work_shop_init,
  };
}
