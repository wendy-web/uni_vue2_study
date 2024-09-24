import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
import { useSelectData } from "@/views/energy/hooks/index";

export function useList(handleSearch: () => void) {
  const { getRelData, relList, getPlaceList, placeList } = useSelectData();

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });

  const formData = ref({
    bar_title: "", //资产名称
    asset_no: "", //设备编码
    save_addr: undefined as FormNumType, //使用位置id
    rel_id: undefined as FormNumType, //采集表名
  });

  const searchColumns: PlusColumnList = [
    {
      label: "资产名称",
      prop: "bar_title",
      // 当前输入框聚焦状态，按下Enter 键提交搜索
      onKeyup: withKeys(() => {
        handleSearch();
      }, ["enter"]),
    },
    {
      label: "设备编码",
      prop: "asset_no",
      // 当前输入框聚焦状态，按下Enter 键提交搜索
      onKeyup: withKeys(() => {
        handleSearch();
      }, ["enter"]),
    },
    {
      label: "使用位置",
      prop: "save_addr",
    },
    {
      label: "采集表名",
      prop: "rel_id",
      valueType: "select",
      fieldProps: {
        filterable: true,
      },
      options: computed(() => {
        return relList.value.map((item) => {
          return {
            label: item.name,
            value: item.id,
            ...item,
          };
        });
      }),
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
      label: "采集表名",
      prop: "rel_name",
      align: "center",
    },
    {
      label: "最新表码数",
      prop: "meter_num",
      align: "center",
    },
    {
      label: "最近采集时间",
      prop: "meter_time",
      align: "center",
    },
    {
      label: "自动抄表规则",
      prop: "rule_text",
      align: "center",
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
      prop: "save_addr_text",
      align: "center",
    },
    {
      label: "采集负责人",
      prop: "collector_text",
      align: "center",
    },
    {
      label: "操作",
      align: "center",
      slot: "operation",
      fixed: "right",
    },
  ];

  return {
    pagination,
    columns,
    searchColumns,
    formData,
    getPlaceList,
    placeList,
    relList,
    getRelData,
  };
}
