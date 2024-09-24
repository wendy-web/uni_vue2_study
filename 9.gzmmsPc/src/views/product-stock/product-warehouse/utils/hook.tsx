import type { TableColumnCtx } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import dayjs from "dayjs";
import { withKeys } from "vue";
export function useList(handleSearch: () => void) {
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
    site: "", // 库存库位地点
    factory_name: "", //库存工厂名称
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
      label: "库存库位地点",
      prop: "site",
      labelWidth: 100,
      fieldProps: {
        placeholder: "请输入库存库位地点",
      },
      onKeyup: withKeys(() => {
        handleSearch();
      }, ["enter"]),
    },
    {
      label: "库存工厂名称",
      prop: "factory_name",
      labelWidth: 100,
      fieldProps: {
        placeholder: "请输入库存工厂名称",
      },
      onKeyup: withKeys(() => {
        handleSearch();
      }, ["enter"]),
    },
  ];
  // 列表配置
  const columns: TableColumnList = [
    {
      label: "操作",
      slot: "operation",
      fixed: "left",
    },
    {
      label: "序号",
      type: "index",
      align: "center",
      width: 60,
    },
    {
      label: "库存工厂名称",
      prop: "factory_name",
      align: "center",
    },
    {
      label: "库存工厂编码",
      prop: "factory_code",
      align: "center",
    },
    {
      label: "库存库位地点",
      prop: "site",
      align: "center",
    },
    {
      label: "库位图形",
      prop: "graphical_img_url",
      slot: "graphical_img_url",
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
    factory_code: "",
    factory_name: "",
    site: "",
    note: "",
  });
  // 新增弹窗的表单项
  const addFormColumns: PlusColumnList = [
    {
      label: "库存工厂编码",
      prop: "factory_code",
    },
    {
      label: "库存工厂名称",
      prop: "factory_name",
    },
    {
      label: "库存库位地点",
      prop: "site",
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
    factory_code: [
      {
        required: true,
        message: "请输入库存工厂编码",
      },
    ],
    factory_name: [
      {
        required: true,
        message: "请输入库存工厂名称",
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
  };
}
