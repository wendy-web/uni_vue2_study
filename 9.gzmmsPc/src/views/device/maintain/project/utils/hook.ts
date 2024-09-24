import { ElInput } from "element-plus";
import type { FormRules } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { getEqipmentTypeSelectApi } from "@/api/device/common";
import type { EquipmentModule } from "@/api/device/common/types";

export function useList() {
  const typeList = ref<EquipmentModule.EqipmentType[]>([]);
  async function getTypeList() {
    const result = await getEqipmentTypeSelectApi();
    typeList.value = result.data;
  }

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });

  const columns: TableColumnList = [
    // {
    //   type: "selection",
    //   width: 60,
    //   reserveSelection: true,
    //   label: "勾选列",
    //   fixed: "left",
    // },
    {
      label: "项目标准名称",
      prop: "name",
      align: "center",
    },
    {
      label: "资产类型",
      prop: "equipment_title",
      align: "center",
    },
    {
      label: "保养部位",
      prop: "maintenance_area",
      align: "center",
    },
    {
      label: "保养要求/标准",
      prop: "maintenance_requirements",
      align: "center",
    },
    {
      label: "备注",
      prop: "note",
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
      //   labelWidth: 60,
      fieldProps: {
        placeholder: "请输入保养项目名称、设备或部位",
      },
      renderField: (_, onChange) => {
        return h(ElInput, {
          // 返回VNode时，需要手动调用 renderField 的onChange 回调把值传给表单
          onChange,
          onkeydown: (event: KeyboardEvent) => {
            if (event.key === "Enter") {
              event.preventDefault();
            }
          },
        });
      },
    },
  ];

  const addRules = reactive<FormRules>({
    name: [
      {
        required: true,
        message: "请输入项目标准名称",
        trigger: "blur",
      },
    ],
    maintenance_area: [
      {
        required: true,
        message: "请输入保养部位",
        trigger: "blur",
      },
    ],
    maintenance_requirements: [
      {
        required: true,
        message: "保养要求/标准",
        trigger: "blur",
      },
    ],
  });

  const editColumns: PlusColumnList = [
    {
      label: "项目标准名称",
      prop: "name",
      //   labelWidth: 60,
      fieldProps: {
        placeholder: "请输入项目标准名称",
      },
    },
    {
      label: "资产类型",
      prop: "equipment_id",
      //   labelWidth: 60,
      fieldProps: {
        placeholder: "请输入项目标准名称",
      },
    },
    {
      label: "保养部位",
      prop: "maintenance_area",
      //   labelWidth: 60,
      fieldProps: {
        placeholder: "请输入保养部位",
      },
    },
    {
      label: "保养要求/标准",
      prop: "maintenance_requirements",
      //   labelWidth: 60,
      fieldProps: {
        placeholder: "请输入保养要求/标准",
      },
    },
    {
      label: "备注",
      prop: "note",
      //   labelWidth: 60,
      fieldProps: {
        placeholder: "请输入备注",
      },
    },
  ];

  return {
    pagination,
    columns,
    searchColumns,
    addRules,
    editColumns,
    getTypeList,
    typeList
  };
}
