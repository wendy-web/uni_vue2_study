import { ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
import { QualityCommonModule } from "@/api/quality/common/types";
// 引入获取下拉框的公共接口
import { getBaseDataInitApi } from "@/api/quality/material-inspection/hot-film/index";
import { HotFilmModule } from "@/api/quality/material-inspection/hot-film/types";
import { useCommonHooks } from "@/hooks/quality";
import { useselectData } from "@/hooks/quality/selectData";

export function useList(search: () => void) {
  const { showApproveLog } = useCommonHooks();
  const { statusOptions, getTagType, getStatusText } = useselectData();
  // 保存公共下拉框数据
  const BaseData = ref<HotFilmModule.BaseData>();
  const brandOptions = ref<OptionType[]>([]);
  // 产品-类型
  const filmItem = ref([]);
  // 单据状态
  // 获取公共下拉框数据配置
  async function getBaseData() {
    const result = await getBaseDataInitApi();
    BaseData.value = result.data;
    brandOptions.value = result.data.brand_data.map((item) => {
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
    brand: "", // 产品大类
    film: "", // 类型
    status: undefined as FormNumType, //单据状态
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
      label: "产品大类",
      prop: "brand",
      valueType: "select",
      options: computed(() => brandOptions.value),
      fieldProps: {
        onChange: () => {
          search();
        },
      },
    },
    {
      label: "类型",
      prop: "film",
      valueType: "select",
      options: computed(() => {
        // 根据产品大类去获取对应的类型
        const filmItem: any =
          BaseData.value?.brand_data.find((item) => item.id === formData.value.brand) ||
          BaseData.value?.brand_data[0];
        return filmItem?.film.map((item: any) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
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
      colProps: {
        span: 8,
      },
    },
  ];
  /** 表格列配置 */
  const columns: TableColumnList = [
    {
      label: "单据编号",
      prop: "order_no",
      align: "center",
      cellRenderer: ({ row }: any) => (
        <span class="cursor-pointer underline text-sky-800">{row.order_no}</span>
      ),
    },
    {
      label: "生产大类",
      prop: "brand_name",
      align: "center",
    },
    {
      label: "类型",
      prop: "film_name",
      align: "center",
    },
    {
      label: "到货批次",
      prop: "batch_no",
      align: "center",
    },
    {
      label: "到货数量",
      prop: "num",
      align: "center",
    },
    {
      label: "供应商",
      prop: "supplier_name",
      align: "center",
    },
    {
      label: "样品时间",
      prop: "sample_date",
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
      cellRenderer: ({ row }: any) => (
        <>
          <ElTag
            type={getTagType(row.status)}
            class={"cursor-pointer"}
            onClick={() => showApproveLog({ id: row.id, orderType: 4, orderStatus: row.status })}
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
  return {
    getBaseData,
    BaseData,
    statusOptions,
    pagination,
    formData,
    searchColumns,
    columns,
  };
}
