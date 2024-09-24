import { ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
// 引入获取下拉框的公共接口
import { getQuantifyOrdBaseDataApi } from "@/api/quality/common/index";
import { QualityCommonModule, SelectStringOpions } from "@/api/quality/common/types";
import { HotFilmModule } from "@/api/quality/material-inspection/hot-film/types";
import { useCommonHooks } from "@/hooks/quality";
import { useselectData } from "@/hooks/quality/selectData";

export function useList(search: () => void) {
  const { showApproveLog } = useCommonHooks();
  const { statusOptions, getTagType, getStatusText, getBrandMap, getSkuMap } = useselectData();
  // 保存公共下拉框数据
  const BaseData = ref<HotFilmModule.BaseData>();
  // 产品大类
  const brandOptions = ref<any>([]);
  // 产品类型
  const skuOptions = computed(() => {
    if (BaseData.value?.brand_data) {
      let { brand } = addFormData.value;
      let brandChild: SelectStringOpions[] = [];
      const matchingBrand = BaseData.value?.brand_data.find(
        (item: QualityCommonModule.BrandDaum) => item.id === brand,
      );
      if (matchingBrand) {
        brandChild = matchingBrand.child;
      }
      return brandChild.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
    }
    return [];
  });
  // 获取公共下拉框数据配置
  async function getBaseData() {
    const result = await getQuantifyOrdBaseDataApi();
    BaseData.value = result.data;
    brandOptions.value = result.data.brand_data.map((item: any) => {
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
    batch_no: "", // 批次
    status: "", //单据状态
    check_date_arr: "", // 检验日期
  });
  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    {
      label: "单据编号",
      prop: "order_no",
      fieldProps: {
        placeholder: "请输入关键字",
      },
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
    },
    {
      label: "批号",
      prop: "sample_batch_no",
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
    },
    {
      label: "单据状态",
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
  /** 表格列配置 */
  const columns: TableColumnList = [
    {
      label: "单据编号",
      prop: "order_no",
      align: "center",
      cellRenderer: ({ row }) => (
        <span class="cursor-pointer underline text-sky-800">{row.order_no}</span>
      ),
    },
    {
      label: "批次",
      prop: "batch_no",
      align: "center",
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
      label: "检验结果",
      prop: "check_ret_text",
      align: "center",
      // cellRenderer: ({ row }) => {
      //   return typeof row.check_res === "number" ? (row.check_res === 1 ? "合格" : "不合格") : "--";
      // },
    },
    {
      label: "检验日期",
      prop: "check_date",
      align: "center",
    },
    {
      label: "报告人",
      prop: "check_user_name",
      align: "center",
    },
    {
      label: "单据状态",
      prop: "status_text",
      align: "center",
      cellRenderer: ({ row }) => (
        <>
          <ElTag
            type={getTagType(row.status)}
            class={"cursor-pointer"}
            onClick={() => showApproveLog({ id: row.id, orderType: 22, orderStatus: row.status })}
          >
            {getStatusText(row.status, row.assoc_type)}
          </ElTag>
        </>
      ),
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

  // 新增弹窗的数据
  const addFormData = ref({
    brand: "", //产品大类
    sku: "", //产品类型
    batch_no: "", //原材料批次
    sample_batch_no: "", //原材料批号
    make_date: "", // 生产日期
  });

  // 新增弹窗的表单项;
  const addFormColumns: PlusColumnList = [
    {
      label: "产品大类",
      prop: "brand",
      valueType: "select",
      options: computed(() => {
        // 产品大类 通过公共接口返回
        return brandOptions.value;
      }),
    },
    {
      label: "产品类型",
      prop: "sku",
      valueType: "select",
    },
    {
      label: "批号",
      prop: "sample_batch_no",
      valueType: "autocomplete",
    },
    {
      label: "批次",
      prop: "batch_no",
      fieldProps: {
        placeholder: "请先选择批号",
        disabled: true,
      },
    },
  ];
  // 是否有数据
  const noBatchNo = ref(false);
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
    sample_batch_no: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          if (noBatchNo.value) {
            callback(new Error("无批次数据"));
            return;
          }
          if (!value) {
            callback(new Error("请输入批号"));
          } else {
            callback();
          }
        },
      },
    ],
  };
  // 新增弹窗开关;
  const addVisible = ref(false);
  // 批次选择表格
  const batchTableData = ref<any[]>([]);
  const batchTableColumns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      width: 80,
    },
    {
      label: "批次",
      prop: "batch_no",
      minWidth: 120,
    },
    {
      label: "批号",
      prop: "sample_batch_no",
    },
    {
      label: "生产日期",
      prop: "make_date",
    },
  ];
  /** 分页配置 */
  const batchTablePagination = reactive<PaginationProps>({
    pageSize: 10,
    currentPage: 1,
    layout: "prev, pager, next",
    total: batchTableData.value.length,
    background: true,
    small: true,
  });
  /** 高亮当前选中行 */
  function batchRowStyle({ row: { batch_no } }: any) {
    return {
      cursor: "pointer",
      background: batch_no === addFormData.value.batch_no ? "var(--el-fill-color-light)" : "",
    };
  }

  return {
    getBaseData,
    BaseData,
    statusOptions,
    pagination,
    formData,
    searchColumns,
    columns,
    addFormData,
    addFormColumns,
    addFormRules,
    addVisible,
    skuOptions,
    noBatchNo,
    batchTableData,
    batchTableColumns,
    batchTablePagination,
    batchRowStyle,
  };
}
