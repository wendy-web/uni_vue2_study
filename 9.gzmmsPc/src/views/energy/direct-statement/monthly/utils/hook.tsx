import type { TableColumnCtx } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import dayjs from "dayjs";
import { withKeys } from "vue";
import { flitterData } from "@/utils";
// 引入能量获取下拉框的公共接口
import { useSelectData } from "@/views/energy/hooks/index";

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
    rel_id: "", // 远程采集仪表ID
    bar_title: "", // 资产名称
    asset_no: "", //资产编号
    save_addr: "", // 使用位置
    type: 0, // 仪表类型
    month: dayjs().subtract(1, "month").format("YYYY-MM"),
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
      label: "月份",
      prop: "month",
      valueType: "date-picker",
      fieldProps: {
        type: "month",
        disabledDate: (time: any) => {
          return dayjs(time) > dayjs();
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
      label: "月份",
      prop: "month_text",
      width: 80,
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
      label: "上月抄表(起码读数)",
      prop: "last_start_num",
      align: "center",
    },
    {
      label: "上月抄表时间",
      prop: "last_meter_time",
      align: "center",
    },
    {
      label: "本月抄表(止码读数)",
      prop: "this_month_num",
      align: "center",
    },
    {
      label: "本月抄表时间",
      prop: "this_month_time",
      align: "center",
    },
    {
      label: "用量",
      prop: "this_month_use_num",
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
      prop: "use_addr_text",
      align: "center",
    },
  ];
  const tableData = ref<any[]>([]);

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
    tableData,
  };
}
