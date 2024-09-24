import { ElOption, ElSelect } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
import { useProcuctStock } from "../../hooks";

export function useList(handleSearch: () => void) {
  const { factoryCodeList, getFactoryCodeList, stockType } = useProcuctStock();

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });

  const formData = ref({
    factory_code: "", //库存工厂编码
    wl_info: "", //物料信息
    batch_no: "", //批次信息
    stock_type: "", //批次信息
  });

  const searchColumns: PlusColumnList = [
    {
      label: "库存工厂编码",
      prop: "factory_code",
      valueType: "select",
      labelWidth: 100,
      renderField: () => {
        return (
          <ElSelect
            v-model={formData.value.factory_code}
            style="width:100%"
            filterable={true}
            clearable={true}
          >
            {factoryCodeList.value.map((option) => (
              <ElOption key={option.id} label={option.factory_code} value={option.factory_code} />
            ))}
          </ElSelect>
        );
      },
    },
    {
      label: "物料信息",
      prop: "wl_info",
      tooltip: "商品编号/名称",
      labelWidth: 90,
      // 当前输入框聚焦状态，按下Enter 键提交搜索
      onKeyup: withKeys(() => {
        handleSearch();
      }, ["enter"]),
    },
    {
      label: "批次信息",
      prop: "batch_no",
      // 当前输入框聚焦状态，按下Enter 键提交搜索
      onKeyup: withKeys(() => {
        handleSearch();
      }, ["enter"]),
    },
    {
      label: "库存类型",
      prop: "stock_type",
      valueType: "select",
      // 当前输入框聚焦状态，按下Enter 键提交搜索
      renderField: () => {
        return (
          <ElSelect
            v-model={formData.value.stock_type}
            style="width:100%"
            filterable={true}
            clearable={true}
          >
            {stockType.value.map((option) => (
              <ElOption key={option.key} label={option.name} value={option.key} />
            ))}
          </ElSelect>
        );
      },
    },
  ];

  const columns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      width: 60,
      align: "center",
      fixed: "left",
    },
    {
      label: "库存工厂编码",
      prop: "factory_code",
      align: "center",
    },
    {
      label: "库存工厂名称",
      prop: "factory_name",
      align: "center",
    },
    {
      label: "物料编码",
      prop: "barcode",
      align: "center",
    },
    {
      label: "物料名称",
      prop: "title",
      align: "center",
    },
    {
      label: "可用库存",
      prop: "stock_qty",
      align: "center",
    },
    {
      label: "箱序列号",
      prop: "box_serial_number_str",
      align: "center",
    },
    {
      label: "单位",
      prop: "measure_name",
      align: "center",
    },
    {
      label: "批次",
      prop: "batch_no",
      align: "center",
    },
    {
      label: "库位类型",
      prop: "stock_type",
      slot: "stock_type",
      align: "center",
    },
    {
      label: "库位名称",
      prop: "ws_code_name",
      align: "center",
    },
    {
      label: "库位编码",
      prop: "ws_code",
      align: "center",
    },
    {
      label: "库存库位地点",
      prop: "site",
      align: "center",
    },
  ];

  return {
    pagination,
    columns,
    searchColumns,
    formData,
    factoryCodeList,
    getFactoryCodeList,
  };
}
