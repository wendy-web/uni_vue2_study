import type { TableColumnCtx } from "element-plus";
import { ElOption, ElSelect } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import dayjs from "dayjs";
import { withKeys } from "vue";
import { useProcuctStock } from "../../hooks";

export function useList(handleSearch: () => void) {
  const { factoryCodeList, getFactoryCodeList, wsCodeList, getWscodeList } = useProcuctStock();

  // 获取前天的日期
  const dayBeforeYesterday = dayjs().subtract(2, "day");
  // 格式化为年月日
  const formattedDate = dayBeforeYesterday.format("YYYY-MM-DD");

  // 分页配置
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });
  /** 表单数据 */
  const formData = ref({
    factory_code: "", // 库存工厂编码
    keyword: "", // 库位信息
  });
  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    {
      label: "库存工厂编码",
      prop: "factory_code",
      labelWidth: 100,
      fieldProps: {
        placeholder: "请输入库存工厂编码",
      },
      onKeyup: withKeys(() => {
        handleSearch();
      }, ["enter"]),
    },
    {
      label: "库位信息",
      prop: "keyword",
      labelWidth: 100,
      fieldProps: {
        placeholder: "请输入库位编码/名称",
      },
      onKeyup: withKeys(() => {
        handleSearch();
      }, ["enter"]),
    },
  ];
  // 列表配置
  const columns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      align: "center",
      width: 60,
    },
    {
      label: "操作",
      slot: "operation",
      fixed: "left",
    },
    {
      label: "库存名称",
      prop: "ws_code_name",
      align: "center",
    },
    {
      label: "库位编码",
      prop: "ws_code",
      align: "center",
    },
    {
      label: "所属库存工厂编码",
      prop: "factory_code",
      align: "center",
    },
    {
      label: "备注信息",
      prop: "note",
      align: "center",
    },
  ];
  const tableData = ref<any[]>([]);
  interface SummaryMethodProps<T = any> {
    columns: TableColumnCtx<T>[];
    data: T[];
  }
  // 表尾合计行
  function getSummaries(param: SummaryMethodProps) {
    const { columns, data } = param;
    const len = columns.length;
    const sums: string[] = [];
    columns.forEach((column, index) => {
      if (index === 0) {
        //如果是第一列，则最后一行展示为“总计”两个字
        sums[index] = "合计";
      } else {
        let propList = ["dosage_num"];
        if (propList.includes(column.property)) {
          const values = data.map((item) => item[column.property as keyof any]);
          if (!values.every((value) => Number.isNaN(value))) {
            let totalRes = values.reduce((prev, curr) => {
              const prevValue = Number(prev);
              const value = Number(curr);
              if (!Number.isNaN(value)) {
                return prevValue + value;
              } else {
                return prevValue;
              }
            }, 0);
            sums[index] = totalRes.toFixed(4);
          }
        } else {
          sums[index] = "";
        }
      }
    });

    return sums;
  }
  /** 记录编辑的id */
  const listId = ref(0);
  // 新增弹窗的数据
  const addFormData = ref({
    ws_code_name: "",
    ws_code: "",
    factory_code: "",
    note: "",
  });
  // 新增弹窗的表单项
  const addFormColumns: PlusColumnList = [
    {
      label: "库位名称",
      prop: "ws_code_name",
    },
    {
      label: "库位编码",
      prop: "ws_code",
    },
    {
      label: "库存工厂编码",
      prop: "factory_code",
      valueType: "select",
      renderField: () => {
        return (
          <ElSelect
            v-model={addFormData.value.factory_code}
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
      label: "备注",
      prop: "note",
      colProps: {
        span: 24,
      },
    },
  ];
  // 新增弹窗的验证规则
  const addFormRules = {
    ws_code_name: [
      {
        required: true,
        message: "请输入库存名称",
      },
    ],
    ws_code: [
      {
        required: true,
        message: "请输入库位工厂名称",
      },
    ],
    factory_code: [
      {
        required: true,
        message: "请输入库存工厂编码",
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
    tableData,
    getSummaries,
    formattedDate,
    addFormData,
    addFormColumns,
    addFormRules,
    addVisible,
    listId,
    getFactoryCodeList
  };
}
