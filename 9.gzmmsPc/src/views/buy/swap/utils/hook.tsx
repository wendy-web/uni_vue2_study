import { formartDate } from "@/utils/validate";
import { IReplacementGood, IReturnGood,ISwapLog } from "@/api/buy/swap/types";

/** @explain 列表页的hooks */
export function useList() {
  const columns: TableColumnList = [
    {
      label: "采购换货单号",
      prop: "replacement_no",
      align: "center",
      width: 160,
    },
    {
      label: "采购单号",
      prop: "procure_no",
      width: 160,
      align: "center",
    },
    {
      label: "退回商品明细",
      prop: "return_goods_detail",
      align: "center",
      showOverflowTooltip: true,
    },
    {
      label: "换货商品明细",
      prop: "replacement_goods_detail",
      align: "center",
      showOverflowTooltip: true,
    },
    {
      label: "换货日期",
      prop: "replacement_data",
      align: "center",
      cellRenderer: (scope) => <span>{formartDate(scope.row.replacement_data) || "-"}</span>,
    },
    {
      label: "单据备注",
      prop: "note",
      width: 200,
      align: "center",
      showOverflowTooltip: true,
      cellRenderer: (scope) => <span>{scope.row.note || "-"}</span>,
    },

    {
      label: "制单人",
      prop: "create_name",
      align: "center",
    },
    {
      label: "创建时间",
      width: 180,
      prop: "create_time",
      align: "center",
    },
    {
      label: "状态",
      width: 100,
      align: "center",
      slot: "status",
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation",
    },
  ];

  const options = ref([
    {
      value: 0,
      label: "待提审",
    },
    {
      value: 1,
      label: "待审核",
    },
    {
      value: 2,
      label: "待入库",
    },
    {
      value: 3,
      label: "已完成",
    },
    {
      value: 4,
      label: "已撤回",
    },
    {
      value: 5,
      label: "已驳回",
    },
    {
      value: 6,
      label: "已作废",
    },
    {
      value: 7,
      label: "已审核",
    },
  ]);

  return {
    columns,
    options,
  };
}

/** @explain 详情页的hooks */
export function useDetail() {
  const state = reactive({
    listId: 0,
    assoc_type: 0,
    refundThead: [
      "货品条码",
      "名称",
      "规格型号",
      "品牌",
      "分类",
      "单位",
      "退货数量",
      "供应商",
      "需求部门",
      "备注",
    ],
    buyThead: [
      "货品条码",
      "名称",
      "规格型号",
      "品牌",
      "分类",
      "单位",
      "采购数量",
      "采购单价",
      "小计",
      "供应商",
      "需求部门",
      "提交日期",
      "交货期",
      "合同号",
      "备注",
    ],
    logData: [] as ISwapLog[], //单据日志
    tabList: ["采购换货单详情", "单据日志"],
    currentIndex: 0,
    replacement_no: "", //采购换货单号
    ct_name: "", //制单人
    create_time: "", //创建时间
    file_info: {
      //附件信息
      src: "",
      name: "",
    },
    status: 0, //状态0待提审,1待审核,2待入库,3已完成,4已撤回,5已驳回,6已作废
    note: "", //总备注
    loading: false, //加载状态
    refundGoods: [] as IReturnGood[],
    buyGoods: [] as IReplacementGood[],
  });

  return {
    state,
  };
}
