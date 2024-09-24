import { ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import dayjs from "dayjs";
import DeviceApproveFlow from "@/components/Device/DeviceApproveFlow/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import maintainInfo from "../components/maintainInfo.vue";

export function useList() {
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });

  function getStatusTitle(status: number) {
    // 保养状态；0 待提审；1：待验证；2：已完成；3：已驳回
    const statusMap = new Map([
      [0, "待提审"],
      [1, "待验证"],
      [2, "已完成"],
      [3, "已驳回"],
      [4, "已撤回"],
    ]);
    return statusMap.get(status) || "";
  }
  const getTagType = (status: number) => {
    switch (status) {
      case 0:
        return "";
      case 1:
        return "warning";
      case 2:
        return "success";
      case 3:
        return "danger";
      case 4:
        return "info";
      default:
        return "";
    }
  };

  const approveFlowInfo = ref();

  function showApproveLog(row: any) {
    let { id, status } = row;
    // if (!status) {
    //   ElMessage.info("暂无审批日志");
    //   return;
    // }
    approveFlowInfo.value = {
      id,
      orderType: 2,
      status,
      type: 4,
    };

    addDialog({
      width: "60%",
      btnClass: "w-[80px]",
      draggable: true,
      title: "审批流程",
      showCancel: false,
      top: "20vh",
      contentRenderer: () =>
        h(DeviceApproveFlow, {
          id: approveFlowInfo.value.id,
          orderType: approveFlowInfo.value.orderType,
          status: approveFlowInfo.value.status,
          type: approveFlowInfo.value.type,
        }),
      beforeCancel: (done, { options, index }) => {
        console.log("点击了取消按钮");
        done();
      },
    });
  }

  function showWorkOrderDetail(row: any) {
    let { id } = row;
    addDialog({
      width: "60%",
      btnClass: "w-[80px]",
      draggable: true,
      title: "保养项目明细",
      showCancel: false,
      contentRenderer: () =>
        h(maintainInfo, {
          id: id,
        }),
    });
  }

  // onClick={() => showApproveLog(row)}

  const columns: TableColumnList = [
    {
      label: "保养状态",
      prop: "status",
      align: "center",
      minWidth: 160,
      cellRenderer: ({ row }) => (
        <>
          <div class="mb-1">
            <ElTag
              type={getTagType(row.status)}
              class={"cursor-pointer"}
              onClick={() => showApproveLog(row)}
            >
              {getStatusTitle(row.status)}
            </ElTag>
          </div>
          {row.overdue_day > 0 && row.status !== 2 ? (
            <span class="inline-block bg-red-400 rounded-[10px] px-2 text-white">
              逾期{row.overdue_day}天
            </span>
          ) : null}
        </>
      ),
    },
    {
      label: "项目标准名称",
      prop: "project_std_name",
      align: "center",
      minWidth: 160,
      sortable: true,
    },
    {
      label: "保养单号",
      prop: "maintenance_order_no",
      align: "center",
      minWidth: 110,
    },
    {
      label: "保养情况",
      prop: "maintenance_situation",
      align: "center",
      minWidth: 160,
      cellRenderer: ({ row }) => (
        <>
          <ul class={"flex items-center justify-center"}>
            <li class={"mr-1"}>
              <span>已保</span>
              <span>({row.maintenance_situation.already_num})</span>
            </li>
            <li>
              <span>未保</span>
              <span class={row.maintenance_situation.not_num > 0 ? "text-red-400" : ""}>
                ({row.maintenance_situation.not_num})
              </span>
            </li>
            <li class="ml-[4px]">
              <span
                class="underline text-blue-500 cursor-pointer"
                onClick={() => showWorkOrderDetail(row)}
              >
                查看
              </span>
            </li>
          </ul>
        </>
      ),
    },
    {
      label: "设备编码",
      prop: "asset_no",
      align: "center",
      minWidth: 110,
    },

    {
      label: "资产名称",
      prop: "bar_title",
      align: "center",
      minWidth: 110,
    },
    {
      label: "规格型号",
      prop: "spec",
      align: "center",
      minWidth: 110,
    },
    {
      label: "使用部门",
      prop: "use_dept_names",
      align: "center",
      minWidth: 110,
    },
    {
      label: "任务开始时间",
      prop: "maintenance_start_time",
      align: "center",
      width: 110,
    },
    {
      label: "任务完成时间",
      prop: "complete_time",
      align: "center",
      width: 110,
    },
    {
      label: "任务用时",
      prop: "maintenance_use_time",
      align: "center",
    },
    {
      label: "计划执行时间",
      prop: "plan_start_time",
      align: "center",
      width: 110,
    },
    {
      label: "保养费用(元)",
      prop: "maintenance_cost",
      align: "center",
      minWidth: 110,
    },
    {
      label: "保养负责人",
      prop: "director_names",
      align: "center",
      minWidth: 110,
    },
    {
      label: "外委单位",
      prop: "outsourced_units_name",
      align: "center",
    },
    {
      label: "计划明细单号",
      prop: "plan_no",
      align: "center",
      minWidth: 110,
    },
    {
      label: "创建人",
      prop: "ct_name",
      align: "center",
    },
    {
      label: "创建时间",
      prop: "create_time",
      align: "center",
      width: 110,
    },
    {
      label: "操作",
      slot: "operation",
      fixed: "right",
    },
  ];

  const filterList = [
    "asset_no",
    "spec",
    "use_dept_names",
    "maintenance_start_time",
    "complete_time",
    "maintenance_use_time",
    "plan_start_time",
    "outsourced_units_name",
    "plan_no",
  ];

  const searchColumns: PlusColumnList = [
    {
      label: "关键字",
      prop: "keyword",
      fieldProps: {
        placeholder: "请输入",
      },
    },
    {
      label: "资产类型",
      prop: "equipment_type_id",
    },
    {
      label: "使用位置",
      prop: "save_addr_id",
    },
    {
      label: "使用部门",
      prop: "use_dept_id",
    },
    {
      label: "状态",
      prop: "status",
      valueType: "select",
      fieldProps: {
        placeholder: "请输入",
      },
      options: [
        {
          label: "待提审",
          value: 0,
        },
        {
          label: "待验证",
          value: 1,
        },
        {
          label: "已完成",
          value: 2,
        },
        {
          label: "已驳回",
          value: 3,
        },
      ],
    },
    {
      label: "保养负责人",
      labelWidth: 100,
      prop: "director_uid",
    },
    {
      label: "计划开始日期",
      prop: "",
      labelWidth: 100,
      valueType: "date-picker",
      fieldProps: {
        placeholder: "请选择日期",
        type: "date",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      },
    },
  ];

  const submitFormData = ref({
    maintenance_start_time: "",
    complete_time: "",
  });

  function checkDate(date: string, diffDate: string, type = 1) {
    let isBefore = dayjs(date).isBefore(dayjs(diffDate).format("YYYY-MM-DD"));

    let isAfter = dayjs(date).isAfter(dayjs(diffDate));
    return type === 1 ? isBefore : isAfter;
  }

  function validateEndTime(rule: any, value: any, callback: any) {
    // if (!value) {
    //   callback(new Error("请选择维修结束时间"));
    // } else
    if (value && !checkDate(value, submitFormData.value.maintenance_start_time, 2)) {
      callback(new Error("结束日期时分不可在开始日期时分之前"));
    } else {
      callback();
    }
  }

  const submitVisible = ref(false);

  const submitColumns: PlusColumnList = [
    {
      label: "任务开始时间",
      prop: "maintenance_start_time",
      labelWidth: 120,
      valueType: "date-picker",
      fieldProps: {
        type: "datetime",
        placeholder: "请选择任务开始时间",
        format: "YYYY-MM-DD HH:mm",
        valueFormat: "YYYY-MM-DD HH:mm",
      },
    },
    {
      label: "任务结束时间",
      prop: "complete_time",
      labelWidth: 120,
      valueType: "date-picker",
      fieldProps: {
        type: "datetime",
        placeholder: "请选择任务结束时间",
        format: "YYYY-MM-DD HH:mm",
        valueFormat: "YYYY-MM-DD HH:mm",
        disabledDate: (date: string) => {
          return checkDate(date, submitFormData.value.maintenance_start_time);
        },
      },
    },
  ];
  const submitRules = {
    maintenance_start_time: {
      required: true,
      message: "请选择任务开始时间",
    },
    complete_time: [
      {
        // required: true,
        validator: validateEndTime,
      },
    ],
  };

  /**
   *
   * @param assocType 接口返回的assoc_type数组
   * @param query 需要判断的值
   * @returns
   */
  const checkAssocType = (assocType: number[], query: number | number[]) => {
    if (Array.isArray(query)) {
      return query.some((item) => assocType.includes(item));
    }
    if (assocType.includes(query)) {
      return true;
    } else {
      return false;
    }
  };

  return {
    pagination,
    columns,
    searchColumns,
    submitColumns,
    submitRules,
    checkAssocType,
    submitFormData,
    submitVisible,
    getStatusTitle,
    getTagType,
    filterList,
  };
}
