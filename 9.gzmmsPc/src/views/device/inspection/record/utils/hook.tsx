import { ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { checkIsBeforeDate } from "@/utils/validate";
import DeviceApproveFlow from "@/components/Device/DeviceApproveFlow/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useBaseData, useCommon } from "@/hooks/device/baseData";
import inspectProject from "../components/inspectProject.vue";

export function useList() {
  const { treeData, userList, departmentList, getBase } = useBaseData();
  const { getRulePlanTime } = useCommon();

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });

  function getStatusName(status: number) {
    const statusMap = new Map([
      [0, "待提审"],
      [1, "待验收"],
      [2, "已完成"],
      [3, "已驳回"],
      [4, "已撤回"],
      [-2, "过期未检"],
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
      case -2:
        return "danger";
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
      orderType: 3,
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

  function showinspectProjectDetail(row: any) {
    let { item_count, item_arr, cycle_type } = row;
    addDialog({
      width: "60%",
      btnClass: "w-[80px]",
      draggable: true,
      title: "检查项目明细",
      showCancel: false,
      contentRenderer: () =>
        h(inspectProject, {
          info: { item_count, item_arr, cycle_type },
        }),
    });
  }

  function checkRectifyText(is_report_rectify: number, rectify_status_text: string) {
    if (is_report_rectify === 1) {
      return rectify_status_text;
    } else {
      return "无需整改";
    }
  }
  function checkRectifyColor(is_report_rectify: number, rectify_status: number) {
    if (is_report_rectify === 1) {
      return rectify_status === 1 ? "text-green-500" : "text-red-500";
    } else {
      return "";
    }
  }

  const columns: TableColumnList = [
    {
      label: "状态",
      prop: "status_text",
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
              {row.status_text}
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
      label: "检查单号",
      prop: "point_no",
      minWidth: 100,
      align: "center",
    },
    {
      label: "检查项目名",
      prop: "inspect_items_name",
      minWidth: 120,
      align: "center",
      sortable: true,
    },
    {
      label: "检查情况",
      prop: "item_count",
      align: "center",
      minWidth: 160,
      cellRenderer: ({ row }) => (
        <>
          <ul class={"flex items-center justify-center"}>
            <li class={"mr-1"}>
              <span>已检</span>
              <span>({row.item_count.count})</span>
            </li>
            <li>
              <span>异常</span>
              <span class={row.item_count.normal > 0 ? "text-red-400" : ""}>
                ({row.item_count.normal})
              </span>
            </li>
            <li class="ml-[4px]">
              <span
                class="underline text-blue-500 cursor-pointer"
                onClick={() => showinspectProjectDetail(row)}
              >
                查看
              </span>
            </li>
          </ul>
        </>
      ),
    },
    {
      label: "整改状态",
      prop: "asset_no",
      align: "center",
      cellRenderer: ({ row }) => (
        <>
          <span class={checkRectifyColor(row.is_report_rectify, row.rectify_status)}>
            {checkRectifyText(row.is_report_rectify, row.rectify_status_text)}
          </span>
        </>
      ),
    },
    {
      label: "整改负责人",
      prop: "rectify_uid_text",
      align: "center",
      minWidth: 100,
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
      minWidth: 100,
    },
    {
      label: "规格型号",
      prop: "spec",
      align: "center",
      minWidth: 100,
    },
    {
      label: "资产类型",
      prop: "equipment_type_text",
      align: "center",
    },
    {
      label: "使用部门",
      prop: "use_dept_names",
      align: "center",
    },
    {
      label: "任务开始时间",
      prop: "task_time_start",
      align: "center",
      minWidth: 110,
    },
    {
      label: "任务结束时间",
      prop: "task_time_end",
      align: "center",
      minWidth: 110,
    },

    {
      label: "任务用时",
      prop: "task_time",
      align: "center",
    },
    {
      label: "计划执行时间",
      prop: "plan_start_time",
      align: "center",
      width: 180,
      cellRenderer: ({ row }) => {
        let data = {
          rule_type: row.executive_rule_type,
          start_time: row.plan_start_time,
          end_time: row.plan_end_time,
        };
        return getRulePlanTime(data);
      },
    },
    {
      label: "执行人",
      prop: "executor_user_text",
      align: "center",
    },
    {
      label: "照片",
      prop: "picture",
      align: "center",
      slot: "picture",
      minWidth: 120,
    },
    {
      label: "签名",
      prop: "sign",
      align: "center",
      slot: "sign",
      minWidth: 120,
    },
    {
      label: "计划明细单号",
      prop: "plan_details_no",
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
      minWidth: 110,
    },
    {
      label: "操作",
      slot: "operation",
      fixed: "right",
    },
  ];

  const filterList = [
    "spec",
    // "ct_name",
    // "create_time",
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
      label: "单据状态",
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
          label: "过期未检",
          value: -2,
        },
      ],
    },
    {
      label: "执行人",
      prop: "executor_uid",
      labelWidth: 90,
      valueType: "select",
      fieldProps: {
        placeholder: "请选择",
      },
      options: computed(() => {
        return userList.value.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      }),
    },
    {
      label: "创建人",
      prop: "ct_uid",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择",
      },
      options: computed(() => {
        return userList.value.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      }),
    },
    {
      label: "创建时间",
      prop: "time",
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

  function validateEndTime(rule: any, value: any, callback: any) {
    if (value && checkIsBeforeDate(value, submitFormData.value.task_time_start)) {
      callback(new Error("结束日期时分不可在开始日期时分之前"));
    } else {
      callback();
    }
  }

  const submitFormData = ref({
    task_time_start: "",
    task_time_end: "",
  });

  const submitVisible = ref(false);

  const submitColumns: PlusColumnList = [
    {
      label: "任务开始时间",
      prop: "task_time_start",
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
      prop: "task_time_end",
      labelWidth: 120,
      valueType: "date-picker",
      fieldProps: {
        type: "datetime",
        placeholder: "请选择任务结束时间",
        format: "YYYY-MM-DD HH:mm",
        valueFormat: "YYYY-MM-DD HH:mm",
        disabledDate: (date: string) => {
          return checkIsBeforeDate(date, submitFormData.value.task_time_start, "YYYY-MM-DD");
        },
      },
    },
  ];

  const submitRules = {
    task_time_start: {
      required: true,
      message: "请选择任务开始时间",
    },
    task_time_end: [
      {
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
    treeData,
    departmentList,
    getBase,
    checkAssocType,
    getStatusName,
    getTagType,
    submitColumns,
    submitRules,
    submitFormData,
    submitVisible,
    filterList,
  };
}
