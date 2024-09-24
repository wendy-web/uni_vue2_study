import type { PaginationProps } from "@pureadmin/table";
import dayjs from "dayjs";
import { addDialog } from "@/components/ReDialog";
import { useBaseData } from "@/hooks/device/baseData";
import inspectProject from "@/views/device/inspection/record/components/inspectProject.vue";

export function useList() {
  const { treeData, departmentList, getBase } = useBaseData();
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });

  const formData = ref({
    keyword: "", //关键字
    point_check_no: "", //检查单号
    use_dept_id: undefined as FormNumType, //使用部门id
    equipment_type_id: undefined as FormNumType, //资产类型
    plan_start_month: dayjs().format("YYYY-MM"), //执行月份
    point_check_time: "", //检查时间
    point_check_status: undefined as FormNumType, //检查状态
  });

  const status_list = ref<SelectOpitonType[]>([]);

  const checkable_number = ref(0); //应检数
  const finished_number = ref(0); //已完成
  const unfinished_number = ref(0); //未开展

  function clickLook(row: any, type = 1) {
    let { item_count, item_arr, error_list, cycle_type } = row;
    let info = {
      item_count,
      cycle_type,
      item_arr: type === 1 ? item_arr : error_list,
    };
    addDialog({
      width: "60%",
      btnClass: "w-[80px]",
      draggable: true,
      title: "检查项目明细",
      showCancel: false,
      contentRenderer: () =>
        h(inspectProject, {
          info: info,
        }),
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
      label: "计划明细单号",
      prop: "plan_details_no",
      align: "center",
      minWidth: 110,
    },
    {
      label: "使用部门",
      prop: "use_dept_text",
      align: "center",
    },
    {
      label: "设备编码",
      prop: "equipment_code",
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
      label: "检查单号",
      prop: "point_no",
      align: "center",
      minWidth: 110,
    },
    {
      label: "计划执行时间",
      prop: "plan_start_time",
      align: "center",
      width: 110,
    },
    {
      label: "检查状态",
      prop: "status_text",
      align: "center",
    },
    {
      label: "检查时间",
      prop: "create_time",
      align: "center",
      width: 110,
    },
    {
      label: "执行人员",
      prop: "ct_name",
      align: "center",
    },
    {
      label: "检查项",
      prop: "item_arr",
      align: "center",
      cellRenderer: ({ row }) => {
        return (
          <>
            <span>{row.item_arr.length}</span>
            {row.item_arr.length > 0 ? (
              <span
                class="inline-block cursor-pointer underline text-blue-500 ml-2"
                onClick={() => clickLook(row, 1)}
              >
                查看
              </span>
            ) : null}
          </>
        );
      },
    },
    {
      label: "异常数",
      prop: "",
      align: "center",
      cellRenderer: ({ row }) => {
        return (
          <>
            <span>{row.error_list.length}</span>
            {row.error_list.length > 0 ? (
              <span
                class="inline-block cursor-pointer underline text-blue-500 ml-2"
                onClick={() => clickLook(row, 2)}
              >
                查看
              </span>
            ) : null}
          </>
        );
      },
    },
    {
      label: "异常项",
      prop: "error_str",
      align: "center",
    },
    {
      label: "检查照片",
      prop: "picture",
      align: "center",
      slot: "picture",
    },
    {
      label: "整改状态",
      prop: "rectify_status",
      align: "center",
    },
    {
      label: "整改照片",
      prop: "rectify_picture",
      align: "center",
      slot: "rectify_picture",
    },
  ];

  const searchColumns: PlusColumnList = [
    {
      label: "关键字",
      prop: "keyword",
      fieldProps: {
        placeholder: "请输入",
      },
      tooltip: "计划明细单号/设备名称/设备编码",
    },
    {
      label: "检查单号",
      prop: "point_check_no",
    },
    {
      label: "资产类型",
      prop: "equipment_type_id",
    },
    {
      label: "使用部门",
      prop: "use_dept_id",
    },
    {
      label: "执行月份",
      prop: "plan_start_month",
      valueType: "date-picker",
      fieldProps: {
        type: "month",
        format: "YYYY-MM",
        valueFormat: "YYYY-MM",
        clearable: false,
      },
      colProps: {
        span: 8,
      },
    },
    {
      label: "检查时间",
      prop: "point_check_time",
      valueType: "date-picker",
      fieldProps: {
        type: "daterange",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
      },
    },
    {
      label: "检查状态",
      prop: "point_check_status",
      valueType: "select",
      options: computed(() => {
        return status_list.value.map((item) => {
          return {
            label: `${item.name}(${item.num})`,
            value: item.id,
          };
        });
      }),
    },
    // {
    //   label: "",
    //   prop: "",
    //   renderField: (value) => {
    //     return (
    //       <>
    //         <ul class="flex">
    //           <li class="w-[100px] h-[70px] bg-[#00BFBF] flex flex-col justify-center items-center text-white mr-2">
    //             <span class="text-[20px]">{checkable_number.value}</span>
    //             <span>应检数</span>
    //           </li>
    //           <li class="w-[100px] h-[70px] bg-[#C280FF] flex flex-col justify-center items-center text-white mr-2">
    //             <span class="text-[20px]">{finished_number.value}</span>
    //             <span>已完成</span>
    //           </li>
    //           <li class="w-[100px] h-[70px] bg-[#0079FE] flex flex-col justify-center items-center text-white mr-2">
    //             <span class="text-[20px]">{unfinished_number.value}</span>
    //             <span>未开展</span>
    //           </li>
    //         </ul>
    //       </>
    //     );
    //   },
    //   renderLabel: (label) => {
    //     return <span></span>;
    //   },
    // },
  ];
  return {
    pagination,
    columns,
    searchColumns,
    formData,
    treeData,
    departmentList,
    getBase,
    checkable_number,
    finished_number,
    unfinished_number,
    status_list,
  };
}
