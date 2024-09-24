import { ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
import { useRouter } from "vue-router";
import { getQuantifyMapApi } from "@/api/quality/common";
import { formartDate } from "@/utils/validate";
import { useCommonHooks } from "@/hooks/quality";
import { useselectData } from "@/hooks/quality/selectData";

/** 需要传递给新建编辑页面的数据类型 */
export type SourceRecordDataType = {
  brand: string;
  sku: string;
  pro_name: string;
  pro_id: number;
  char: string;
  insp_id: number;
  insp_name: string;
  inst_id: number;
  inst_name: string;
  formula: string;
};

export function useList(search: () => void) {
  const router = useRouter();
  const { showApproveLog } = useCommonHooks();
  const { statusOptions, getStatusText, getTagType, getBrandMap, brandList, getSkuMap, skuList } =
    useselectData();

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
    brand: "", //产品大类
    pro_id: undefined as FormNumType, //检测项目ID
    status: undefined as FormNumType, //状态
    check_time: "", //检验日期
  });

  const checkItemList = ref<any[]>([]);

  /** 获取检测项目下拉列表数据 */
  async function getCheckItemList(brand?: string) {
    const reuslt = await getQuantifyMapApi({ is_open: 1, brand: brand });
    checkItemList.value = reuslt.data.map((item: any) => {
      return { label: item.name, value: item.id, ...item };
    });
  }

  /** 根据项目名称返回对应的orderType类型 */
  function checkOrderType(pro_name: string) {
    let orderType = 1;
    if (["总砷", "铅"].includes(pro_name)) {
      orderType = 3;
    } else if (["维生素B12"].includes(pro_name)) {
      orderType = 2;
    }
    return orderType;
  }

  /** 签字复核/反审核,都是进入详情页面 */
  function cellDetail(row: any) {
    let orderType = checkOrderType(row.pro_name);
    router.push({
      path: "/quality/product-quantify/source-record/add",
      query: {
        id: row.id,
        pageType: 3,
        orderType,
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
      label: "产品大类",
      prop: "brand_name",
      align: "center",
    },

    {
      label: "产品类型",
      prop: "sku_name",
      align: "center",
    },
    {
      label: "检验项目",
      prop: "pro_name",
      align: "center",
    },
    {
      label: "检验日期",
      prop: "check_date",
      align: "center",
      cellRenderer: ({ row }) => {
        return formartDate(row.check_date);
      },
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
      label: "检验员",
      prop: "check_user_name",
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
            onClick={() => showApproveLog({ id: row.id, orderType: 21, orderStatus: row.status })}
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
      label: "产品大类",
      prop: "brand",
      valueType: "select",
      options: computed(() => {
        return brandList.value;
      }),
      fieldProps: {
        onChange: () => {
          search();
        },
      },
    },
    {
      label: "检验项目",
      prop: "pro_id",
      valueType: "select",
      options: computed(() => {
        return checkItemList.value;
      }),
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
    },
  ];

  // 新增弹窗的数据
  const addFormData = ref({
    brand: "", //产品大类
    sku: "", //产品类型
    itemContent: {
      label: "",
      id: 0,
      char: "",
      insp_id: 0,
      inst_id: 0,
      insp_name: "",
      inst_name: "",
      formula: "",
    }, //项目内容
  });
  // 新增弹窗的表单项;
  const addFormColumns: PlusColumnList = [
    {
      label: "产品大类",
      prop: "brand",
      valueType: "select",
      options: computed(() => {
        return brandList.value;
      }),
      fieldProps: {
        onChange: (val: string) => {
          getCheckItemList(val);
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
      label: "项目名称",
      prop: "itemContent",
      valueType: "select",
      options: computed(() => {
        return checkItemList.value.map((item) => {
          return {
            label: item.label,
            value: {
              label: item.label,
              id: item.value,
              char: item.char,
              insp_id: item.insp_id,
              insp_name: item.insp_name,
              inst_id: item.inst_id,
              inst_name: item.inst_name,
              formula: item.formula || "",
            },
          };
        });
      }),
      fieldProps: computed(() => {
        return {
          placeholder: "请先选择产品大类",
          valueKey: "id",
          disabled: !addFormData.value.brand,
        };
      }),
    },
  ];

  function validatorContent(rule: any, value: any, callback: any) {
    if (!value.label) {
      callback(new Error("请选择项目名称"));
    } else {
      callback();
    }
  }

  // 新增弹窗的验证规则;
  const addFormRules = {
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
    itemContent: [{ required: true, validator: validatorContent }],
  };
  // 新增弹窗开关;
  const addVisible = ref(false);

  return {
    pagination,
    formData,
    columns,
    searchColumns,
    router,
    cellDetail,
    addFormData,
    addFormColumns,
    addFormRules,
    addVisible,
    checkItemList,
    getBrandMap,
    checkOrderType,
  };
}
