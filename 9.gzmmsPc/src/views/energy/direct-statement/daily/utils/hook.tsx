import type { TableColumnCtx } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import dayjs from "dayjs";
import { withKeys } from "vue";
import { flitterData } from "@/utils";
// 引入能量获取下拉框的公共接口
import { useSelectData } from "@/views/energy/hooks/index";

// 班次
const classNoMap: any = {
  1: "早",
  2: "中",
  3: "晚",
};
// 班别
const classTypeMap: any = {
  1: "A",
  2: "B",
  3: "C",
};
export function useList(handleSearch: () => void) {
  const { getRelData, relList, getPlaceList, placeList } = useSelectData();

  // 采集表类型 tab选项卡
  const tabMap = [
    {
      type: 0,
      name: "电表",
    },
    {
      type: 1,
      name: "水表",
    },
    {
      type: 2,
      name: "蒸汽表",
    },
  ];
  const tabIndex = ref(0); // 默认选中电表
  // 获取前天的日期
  const dayBeforeYesterday = dayjs().subtract(1, "day");
  // 格式化为年月日
  const formattedDate = dayBeforeYesterday.format("YYYY-MM-DD");
  async function getBaseData() {
    await getRelData(tabIndex.value);
    await getPlaceList();
  }
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
    rel_id: [], // 远程采集仪表ID
    bar_title: "", // 资产名称
    asset_no: "", //资产编号
    save_addr: "", // 使用位置
    type: 0, // 仪表类型
    this_meter_time_arr: [formattedDate, formattedDate], // 抄表时间
  });
  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    {
      label: "资产名称",
      prop: "bar_title",
      fieldProps: {
        placeholder: "请输入关键词",
      },
      onKeyup: withKeys(() => {
        handleSearch();
      }, ["enter"]),
    },
    {
      label: "资产编码",
      prop: "asset_no",
      fieldProps: {
        placeholder: "请输入关键词",
      },
      onKeyup: withKeys(() => {
        handleSearch();
      }, ["enter"]),
    },
    {
      label: "采集表名",
      prop: "rel_id",
      valueType: "select",
      options: computed(() =>
        relList.value.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        }),
      ),
      fieldProps: {
        filterable: true,
        multiple: true,
        onChange: () => {
          handleSearch();
        },
      },
    },
    {
      label: "使用位置",
      prop: "save_addr",
      slot: "save_addr",
    },
    {
      label: "抄表时间",
      prop: "this_meter_time_arr",
      valueType: "date-picker",
      fieldProps: {
        placeholder: "请选择日期",
        type: "daterange",
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        clearable: false, // 如果不传日期接口 会报错
        disabledDate: (time: any) => {
          return time.getTime() > Date.now();
        },
        onChange: () => {
          handleSearch();
        },
      },
    },
  ];
  // 列表配置
  const columns: TableColumnList = [
    {
      type: "selection",
      width: 60,
      reserveSelection: true,
      label: "勾选列",
      fixed: "left",
    },
    {
      label: "采集表名",
      prop: "rel_name",
      align: "center",
    },
    {
      label: "采集表类型",
      prop: "type_text",
      align: "center",
    },
    {
      label: "上次抄表(起码读数)",
      prop: "start_num",
      align: "center",
    },
    {
      label: "本次抄表(止码读数)",
      prop: "end_num",
      align: "center",
    },
    {
      label: "用量",
      prop: "dosage_num",
      align: "center",
    },
    {
      label: "班次",
      prop: "class_no_text",
      align: "center",
      // cellRenderer: ({ row }) => <span>{classNoMap[row.class_no] || ""}</span>,
    },
    {
      label: "班别",
      prop: "class_type_text",
      align: "center",
      // cellRenderer: ({ row }) => <span>{classTypeMap[row.class_type] || ""}</span>,
    },
    {
      label: "绑定设备编码",
      prop: "asset_no",
      align: "center",
    },
    {
      label: "资产名称",
      prop: "bar_title",
      align: "center",
    },
    {
      label: "使用位置",
      prop: "use_addr_text",
      align: "center",
    },
    {
      label: "抄表时间",
      prop: "this_meter_time",
      align: "center",
    },
    // {
    //   label: "操作",
    //   slot: "operation",
    //   fixed: "right",
    // },
  ];
  const tableData = ref<any[]>([]);

  //  初始化列表数据，拆分list, 单元格合并按天
  function initTableData(data: any[]) {
    let tableData: any[] = [];
    data.forEach((item) => {
      const baseData = {
        type: item.type,
        rel_id: item.rel_id,
        rel_name: item.rel_name,
        asset_no: item.asset_no,
        bar_title: item.bar_title,
        use_addr_text: item.use_addr_text,
        type_text: item.type_text,
      };

      item.list.forEach((listItem: any) => {
        // 获取日期部分作为 merge_day
        const merge_day = listItem.this_meter_time.split(" ")[0];
        tableData.push({
          ...baseData,
          ...listItem,
          merge_day,
        });
      });
    });

    return tableData;
  }
  // 单元格合并
  function tableSpanMethod({ row, column, rowIndex, columnIndex }: any): any {
    // 获取上一行的数据
    // const prevRow = tableData.value[rowIndex - 1];
    // 勾选列、采集表名、表类型按天合并
    if ([0, 1, 2, 8, 9, 10].includes(columnIndex)) {
      const _row = flitterData(tableData.value, "rel_id").one[rowIndex];
      const _col = _row > 0 ? 1 : 0;
      return {
        rowspan: _row,
        colspan: _col,
      };
    }
  }
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
  return {
    tabMap,
    tabIndex,
    pagination,
    formData,
    searchColumns,
    columns,
    getBaseData,
    getRelData,
    placeList,
    initTableData,
    tableData,
    tableSpanMethod,
    getSummaries,
    formattedDate,
  };
}
