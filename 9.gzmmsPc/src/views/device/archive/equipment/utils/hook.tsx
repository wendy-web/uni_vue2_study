import { ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { useUserStoreHook } from "@/store/modules/user";

export function useList() {
  const userStore = useUserStoreHook();
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });
  const columns: TableColumnList = [
    {
      type: "selection",
      width: 60,
      reserveSelection: true,
      label: "勾选列",
      fixed: "left",
    },
    {
      label: "使用状态",
      prop: "status",
      align: "center",
      cellRenderer: (scope) => (
        <>
          <ElTag type={getTagType(scope.row.status)}>{getStatusTitle(scope.row.status)}</ElTag>
        </>
      ),
    },
    {
      label: "资产名称",
      prop: "bar_title",
      align: "center",
    },
    {
      label: "资产类型",
      prop: "eq_type_text",
      align: "center",
      minWidth: 120,
    },
    {
      label: "登记编码",
      prop: "equipment_no",
      align: "center",
      minWidth: 120,
    },
    {
      // label: "设备编码",
      label: userStore.module_type == 1 ? "设备编码" : "资产编码",
      prop: "asset_no",
      align: "center",
      minWidth: 110,
    },
    {
      label: "资产条码",
      prop: "barcode",
      align: "center",
      minWidth: 120,
    },
    {
      // label: "资产编码",
      label: userStore.module_type == 1 ? "资产编码" : "设备编码",
      prop: "equipment_code",
      align: "center",
      minWidth: 110,
    },
    {
      label: "使用位置",
      prop: "save_addr_text",
      align: "center",
      minWidth: 110,
    },
    {
      label: "品牌",
      prop: "brand",
      align: "center",
    },
    {
      label: "型号",
      prop: "spec",
      align: "center",
      minWidth: 110,
    },
    {
      label: "功率(kw)",
      prop: "power",
      align: "center",
      minWidth: 90,
    },
    {
      label: "序列号",
      prop: "sn",
      align: "center",
    },
    {
      label: "国产/进口",
      prop: "export_type_text",
      align: "center",
      minWidth: 100,
    },
    {
      label: "启用日期",
      prop: "open_date",
      align: "center",
      minWidth: 110,
    },
    {
      label: "使用年限(月)",
      prop: "use_year",
      align: "center",
      minWidth: 110,
    },
    {
      label: "预计到期",
      prop: "expire_date",
      align: "center",
      minWidth: 110,
    },
    {
      label: "责任部门",
      prop: "duty_dept_text",
      align: "center",
      minWidth: 110,
    },
    {
      label: "点巡检状态",
      prop: "point_check_status_text",
      align: "center",
      minWidth: 100,
    },
    {
      label: "使用部门",
      prop: "use_dept_text",
      align: "center",
      minWidth: 110,
    },
    {
      label: "使用负责人",
      prop: "use_duty_user_text",
      align: "center",
      minWidth: 120,
    },
    {
      label: "采购人",
      prop: "purchase_uid_text",
      align: "center",
    },
    {
      label: "供应商",
      prop: "supplier_id_text",
      align: "center",
      minWidth: 110,
    },
    {
      label: "生产厂商",
      prop: "production_id_text",
      align: "center",
      minWidth: 110,
    },
    {
      label: "原始价值",
      prop: "price",
      align: "center",
    },
    {
      label: "残值率(%)",
      prop: "spoiled_rate",
      align: "center",
      minWidth: 90,
    },
    {
      label: "残值",
      prop: "spolied",
      align: "center",
    },
    {
      label: "折旧方法",
      prop: "depreciation_type_text",
      align: "center",
    },
    {
      label: "报废日期",
      prop: "scrap_date",
      align: "center",
      minWidth: 110,
    },
    {
      label: "报废原因",
      prop: "scrap_reason",
      align: "center",
    },
    {
      label: "操作",
      slot: "operation",
      fixed: "right",
    },
  ];

  const searchColumns: PlusColumnList = [
    {
      label: "关键字",
      prop: "keyword",
      fieldProps: {
        placeholder: "请输入",
      },
      tooltip: "支持搜索登记编码,设备编码,资产条码,资产名称,品牌,型号",
    },
    {
      label: "使用位置",
      prop: "save_addr",
      labelWidth: 90,
    },
    {
      label: "使用部门",
      prop: "use_dept_id",
      labelWidth: 90,
    },
    {
      label: "使用负责人",
      prop: "use_duty_user",
      labelWidth: 110,
    },
    {
      label: "启用日期",
      prop: "open_date",
      labelWidth: 90,
      valueType: "date-picker",
      fieldProps: {
        placeholder: "请选择日期",
        type: "daterange",
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      },
    },
    {
      label: "使用状态",
      prop: "status",
      labelWidth: 90,
      valueType: "select",
      // 使用状态 0停用 1正常 2闲置 3待报废 4已报废
      options: [
        {
          label: "停用",
          value: 0,
        },
        {
          label: "正常",
          value: 1,
        },
        {
          label: "闲置",
          value: 2,
        },
        {
          label: "待报废",
          value: 3,
        },
        {
          label: "已报废",
          value: 4,
        },
      ],
    },
    {
      label: "点巡检状态",
      prop: "point_check_status",
      labelWidth: 90,
      valueType: "select",
      options: [
        {
          label: "全部",
          value: 0,
        },
        {
          label: "正常",
          value: 1,
        },
        {
          label: "异常",
          value: 2,
        },
        {
          label: "检查中",
          value: 3,
        },
      ],
    },
  ];

  const getStatusTitle = (status: number) => {
    switch (status) {
      case 0:
        return "停用";
      case 1:
        return "正常";
      case 2:
        return "闲置";
      case 3:
        return "待报废";
      case 4:
        return "已报废";
      default:
        return "";
    }
  };

  const getTagType = (status: number) => {
    switch (status) {
      case 0:
        return "danger";
      case 1:
        return "success";
      case 2:
        return "info";
      case 3:
        return "warning";
      case 4:
        return "danger";
      default:
        return "";
    }
  };

  return {
    pagination,
    columns,
    searchColumns,
    getStatusTitle,
  };
}
