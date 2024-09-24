import { ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import type { RepairItemType } from "@/api/device/maintain/repair/types";
import { checkIsBeforeDate } from "@/utils/validate";
import DeviceApproveFlow from "@/components/Device/DeviceApproveFlow/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useBaseData } from "@/hooks/device/baseData";

export function useList() {
  const formData = ref({
    equipment_type: undefined as FormNumType,
    save_addr: undefined as FormNumType,
    use_dept_id: undefined as FormNumType,
    create_time: "",
    status: undefined as FormNumType,
  });
  const {
    getReBase,
    repairTypeList,
    outsourcingList,
    repairReasonList,
    faultList,
    userList,
    lineList,
    getBase,
    treeData,
    departmentList,
    placeList,
  } = useBaseData();

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

  const getStatusTitle = (status: number) => {
    switch (status) {
      case 0:
        return "待提审";
      case 1:
        return "待验收";
      case 2:
        return "已完成";
      case 3:
        return "已驳回";
      case 4:
        return "已撤回";
      case 5:
        return "已作废";
      default:
        return "";
    }
  };

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
      case 5:
        return "danger";
      default:
        return "";
    }
  };

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });

  const approveFlowInfo = ref();

  const approveFlowVisible = ref(false);

  function showApproveLog(row: RepairItemType) {
    let { id, status } = row;
    // if (!status) {
    //   ElMessage.info("暂无审批日志");
    //   return;
    // }
    approveFlowInfo.value = {
      id,
      orderType: 1,
      status,
      type: 4,
    };

    // approveFlowVisible.value = true;
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

  const columns: TableColumnList = [
    // {
    //   type: "selection",
    //   width: 60,
    //   reserveSelection: true,
    //   label: "勾选列",
    //   fixed: "left",
    // },
    {
      label: "维修单号",
      prop: "repair_no",
      align: "center",
      minWidth: 100,
    },
    // onClick={() => showApproveLog(row)}
    {
      label: "维修状态",
      prop: "status",
      align: "center",
      cellRenderer: ({ row }) => (
        <>
          <ElTag
            type={getTagType(row.status)}
            class={"cursor-pointer"}
            onClick={() => showApproveLog(row)}
          >
            {row.status_text}
          </ElTag>
        </>
      ),
    },
    {
      label: "维修负责人",
      prop: "repair_director_text",
      align: "center",
      minWidth: 100,
    },
    {
      label: "制单人",
      prop: "ct_name",
      align: "center",
    },
    {
      label: "维修开始时间",
      prop: "repair_start_time",
      align: "center",
      width: 110,
    },
    {
      label: "维修结束时间",
      prop: "repair_end_time",
      align: "center",
      width: 110,
    },
    {
      label: "维修总时长",
      prop: "repair_total_time",
      align: "center",
      minWidth: 100,
    },
    {
      label: "累计误时(分)",
      prop: "stop_time",
      align: "center",
      minWidth: 110,
    },
    {
      label: "是否停机",
      prop: "is_stop",
      align: "center",
      cellRenderer: ({ row }) => {
        return row.is_stop === 1 ? "是" : "否";
      },
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
      label: "报修人",
      prop: "repair_user_id_text",
      align: "center",
    },
    {
      label: "故障原因",
      prop: "fault_reason_text",
      align: "center",
    },
    {
      label: "维修类型",
      prop: "repair_type_text",
      align: "center",
    },
    {
      label: "维修费用(元)",
      prop: "repair_price",
      align: "center",
      minWidth: 110,
    },
    {
      label: "外委单位",
      prop: "outsourcing_text",
      align: "center",
    },
    {
      label: "操作",
      slot: "operation",
      fixed: "right",
      minWidth: 120,
    },
  ];

  const searchColumns: PlusColumnList = [
    {
      label: "关键字",
      prop: "keyword",
      fieldProps: {
        placeholder: "请输入",
      },
      tooltip: "关键词 维修单号/设备编码/资产名称",
    },
    {
      label: "资产类型",
      prop: "equipment_type",
      fieldProps: {
        placeholder: "请输入",
      },
    },
    {
      label: "使用位置",
      prop: "save_addr",
      fieldProps: {
        placeholder: "请输入",
      },
    },
    {
      label: "使用部门",
      prop: "use_dept_id",
      fieldProps: {
        placeholder: "请输入",
      },
    },
    {
      label: "维修状态",
      prop: "status",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择",
      },
      options: [
        {
          label: "待提审",
          value: 0,
        },
        {
          label: "待验收",
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
        {
          label: "已撤回",
          value: 4,
        },
        {
          label: "已作废",
          value: 5,
        },
      ],
    },
    {
      label: "维修负责人",
      labelWidth: 100,
      prop: "repair_director",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择",
      },
      options: computed(() => {
        return userList.value.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      }),
    },
    {
      label: "报修人",
      prop: "repair_user_id",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择",
      },
      options: computed(() => {
        return userList.value.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      }),
    },
    {
      label: "故障原因",
      prop: "fault_reason",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择",
      },
      options: computed(() => {
        return repairReasonList.value.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      }),
    },
    {
      label: "维修类型",
      prop: "repair_type",
      valueType: "select",
      fieldProps: {
        placeholder: "请输入",
      },
      options: computed(() => {
        return repairTypeList.value.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      }),
    },
    {
      label: "创建日期",
      prop: "create_time",
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
  ];

  const submitVisible = ref(false);

  const submitFormData = ref({
    repair_start_time: "",
    repair_end_time: "",
  });

  function validateEndTime(rule: any, value: any, callback: any) {
    if (!value) {
      callback(new Error("请选择维修结束时间"));
    } else if (value && checkIsBeforeDate(value, submitFormData.value.repair_start_time)) {
      callback(new Error("结束日期时分不可在开始日期时分之前"));
    } else {
      callback();
    }
  }

  const submitColumns: PlusColumnList = [
    {
      label: "维修开始时间",
      prop: "repair_start_time",
      valueType: "date-picker",
      fieldProps: {
        type: "datetime",
        placeholder: "请选择维修开始时间",
        format: "YYYY-MM-DD HH:mm",
        valueFormat: "YYYY-MM-DD HH:mm",
        // dateFormat: "YYYY-MM-DD",
        // timeFormat: "HH:mm",
        clearable: false,
      },
    },
    {
      label: "维修结束时间",
      prop: "repair_end_time",
      valueType: "date-picker",
      fieldProps: {
        type: "datetime",
        placeholder: "请选择维修结束时间",
        format: "YYYY-MM-DD HH:mm",
        valueFormat: "YYYY-MM-DD HH:mm",
        // dateFormat: "YYYY-MM-DD",
        // timeFormat: "HH:mm",
        disabledDate: (date: string) => {
          return checkIsBeforeDate(date, submitFormData.value.repair_start_time, "YYYY-MM-DD");
        },
      },
    },
  ];

  const submitRules = {
    repair_start_time: [
      {
        required: true,
        message: "请选择维修开始时间",
      },
    ],
    repair_end_time: [
      {
        required: true,
        validator: validateEndTime,
      },
    ],
  };

  return {
    formData,
    pagination,
    columns,
    searchColumns,
    /* ~~~~~~~~~~ */
    getReBase,
    repairTypeList,
    outsourcingList,
    repairReasonList,
    faultList,
    userList,
    lineList,
    getBase,
    treeData,
    departmentList,
    placeList,
    checkAssocType,
    submitColumns,
    submitRules,
    submitFormData,
    submitVisible,
    getStatusTitle,
    getTagType,
    approveFlowInfo,
    approveFlowVisible,
  };
}
