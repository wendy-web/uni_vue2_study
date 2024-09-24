import { ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
import { QualityCommonModule } from "@/api/quality/common/types";
// 引入获取下拉框的公共接口
import { getCapInitApi } from "@/api/quality/material-inspection/cap/index";
import { CapModule } from "@/api/quality/material-inspection/cap/types";
import { useCommonHooks } from "@/hooks/quality";
import { useselectData } from "@/hooks/quality/selectData";

export function useList(search: () => void) {
  const { showApproveLog } = useCommonHooks();
  const { getTagType, statusOptions, getStatusText } = useselectData();
  // 保存公共下拉框数据
  const BaseData = ref<CapModule.BaseData>();
  // 产品大类
  const brandData = ref<OptionType[]>([]);
  // 单据状态
  // 供应商
  const supplierOption = ref<QualityCommonModule.seletcOptionItem[]>([]);
  // 获取公共下拉框数据配置
  async function getBaseData() {
    const result = await getCapInitApi();
    BaseData.value = result.data;
    brandData.value = result.data.brand_data.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    supplierOption.value = result.data.supplier.map((item) => {
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
    batch_no: "", // 生产批号
    status: undefined as FormNumType, //单据状态
    brand: "", // 产品大类
    supplier_id: "", // 供应商
    check_date_arr: "", // 检测日期
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
      label: "供应商",
      prop: "supplier_id",
      valueType: "select",
      options: computed(() => supplierOption.value),
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
      options: computed(() => statusOptions),
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
      colProps: {
        span: 7,
      },
    },
    {
      label: "生产批号",
      prop: "batch_no",
      fieldProps: {
        placeholder: "请输入关键字",
      },
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
    },
    {
      label: "产品大类",
      prop: "brand",
      valueType: "select",
      options: computed(() => brandData.value),
      fieldProps: {
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
      label: "生产批号",
      prop: "batch_no",
      align: "center",
    },
    {
      label: "供应商",
      prop: "supplier_name",
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
    },
    {
      label: "检验日期",
      prop: "check_date",
      align: "center",
    },
    {
      label: "检验员",
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
            onClick={() => showApproveLog({ id: row.id, orderType: 3, orderStatus: row.status })}
          >
            {getStatusText(row.status, row.assoc_type)}
          </ElTag>
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
    },

    {
      label: "操作",
      slot: "operation",
      fixed: "right",
    },
  ];
  return {
    getBaseData,
    BaseData,
    brandData,
    statusOptions,
    pagination,
    formData,
    searchColumns,
    columns,
  };
}
