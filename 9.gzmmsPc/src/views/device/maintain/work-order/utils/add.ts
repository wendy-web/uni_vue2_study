import { ElInput } from "element-plus";
import dayjs from "dayjs";
import type { PlusFormGroupRow } from "plus-pro-components";
import { onlyNumPoint } from "@/utils/index";
import { formartDate } from "@/utils/validate";
import { useBaseData, useCommon } from "@/hooks/device/baseData";

export function useAdd() {
  const { getReBase, outsourcingList, userList } = useBaseData();
  const { getCycleName } = useCommon();

  const formData = ref({
    plan_details_no: "", //计划明细单号
    bar_title: "", //资产名称
    asset_no: "", //设备编码
    barcode: "", //资产条码
    spec: "", //规格型号
    equipment_type_title: "", //资产类型
    save_addr: "", //使用位置
    use_dept_names: "", //使用部门
    plan_start_time: "", //计划执行时间
    maintenance_start_time: dayjs().format("YYYY-MM-DD HH:mm"), //任务开始时间
    complete_time: "", //任务结束时间
    director_uid: [] as number[], // 保养负责人
    other_uid: [] as number[], //其他负责人
    outsourced_units: undefined as FormNumType, //外委单位
    maintenance_desc: "", //保养描述
    maintenance_cost: "", //保养费用
    img_info: [] as string[], //保养推片
  });

  const addRules = {
    maintenance_start_time: [
      {
        required: true,
        message: "请选择任务开始时间",
      },
    ],
    complete_time: [
      {
        validator: validateEndTime,
      },
    ],
  };

  function checkDate(date: string, diffDate: string, type = 1) {
    let isBefore = dayjs(date).isBefore(dayjs(diffDate).format("YYYY-MM-DD"));

    let isAfter = dayjs(date).isAfter(dayjs(diffDate));
    return type === 1 ? isBefore : isAfter;
  }

  function validateEndTime(rule: any, value: any, callback: any) {
    if (value && !checkDate(value, formData.value.maintenance_start_time, 2)) {
      callback(new Error("结束日期时分不可在开始日期时分之前"));
    } else {
      callback();
    }
  }

  const group: PlusFormGroupRow[] = [
    {
      title: "设备信息",
      columns: [
        {
          label: "计划明细单号",
          labelWidth: 110,
          prop: "plan_details_no",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
        },
        {
          label: "资产名称",
          labelWidth: 110,
          prop: "bar_title",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
        },
        {
          label: "设备编码",
          labelWidth: 110,
          prop: "asset_no",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
        },
        {
          label: "资产条码",
          labelWidth: 110,
          prop: "barcode",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
        },
        {
          label: "规格型号",
          labelWidth: 110,
          prop: "spec",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
        },
        {
          label: "资产类型",
          labelWidth: 110,
          prop: "equipment_type_title",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
        },
        {
          label: "使用位置",
          labelWidth: 110,
          prop: "save_addr",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
        },
        {
          label: "使用部门",
          labelWidth: 110,
          prop: "use_dept_names",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
        },
      ],
    },
    {
      title: "保养处理情况",
      columns: [
        {
          label: "计划执行时间",
          prop: "plan_start_time",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
        },
        {
          label: "任务开始时间",
          prop: "maintenance_start_time",
          valueType: "date-picker",
          fieldProps: {
            type: "datetime",
            placeholder: "请选择时间",
            format: "YYYY-MM-DD HH:mm",
            valueFormat: "YYYY-MM-DD HH:mm",
            // dateFormat: "YYYY-MM-DD",
            // timeFormat: "HH:mm",
            clearable: false,
            disabledDate: (date: string) => {
              return checkDate(date, formData.value.plan_start_time);
            },
          },
        },
        {
          label: "任务结束时间",
          prop: "complete_time",
          valueType: "date-picker",
          fieldProps: {
            type: "datetime",
            placeholder: "请选择时间",
            format: "YYYY-MM-DD HH:mm",
            valueFormat: "YYYY-MM-DD HH:mm",
            // dateFormat: "YYYY-MM-DD",
            // timeFormat: "HH:mm",
            disabledDate: (date: string) => {
              return checkDate(date, formData.value.maintenance_start_time);
            },
          },
        },
        {
          label: "保养负责人",
          prop: "director_uid",
          valueType: "select",
          fieldProps: {
            placeholder: "请选择",
            multiple: true,
            disabled: true,
          },
          // options: computed(() => {
          //   return userList.value.map((item) => {
          //     return {
          //       label: item.name,
          //       value: item.id,
          //     };
          //   });
          // }),
        },
        {
          label: "其他负责人",
          prop: "other_uid",
          valueType: "select",
          fieldProps: {
            placeholder: "请选择",
            multiple: true,
            disabled: true,
          },
          // options: computed(() => {
          //   return userList.value.map((item) => {
          //     return {
          //       label: item.name,
          //       value: item.id,
          //     };
          //   });
          // }),
        },
        {
          label: "外委单位",
          prop: "outsourced_units",
          valueType: "select",
          fieldProps: {
            placeholder: "请选择",
          },
          options: computed(() => {
            return outsourcingList.value.map((item) => {
              return {
                label: item.name,
                value: item.id,
              };
            });
          }),
        },
        {
          label: "保养费用",
          prop: "maintenance_cost",
          fieldProps: {
            placeholder: "请输入",
          },
          renderField: (value, onChange) => {
            let val = onlyNumPoint(value);
            return h(ElInput, {
              modelValue: val,
              onChange,
            });
          },
        },
        {
          label: "保养描述",
          prop: "maintenance_desc",
          fieldProps: {
            placeholder: "请输入",
          },
          colProps: {
            span: 16,
          },
        },
        {
          label: "保养图片",
          prop: "img_info",
          fieldProps: {
            placeholder: "请选择",
          },
          colProps: {
            span: 24,
          },
        },
      ],
    },
  ];

  const standardColumns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      align: "center",
      width: 60,
    },
    {
      label: "项目标准名称",
      prop: "name",
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
      label: "操作",
      prop: "is_maintain",
      align: "center",
      slot: "operation",
      width: 200,
    },
    {
      label: "备注",
      prop: "note",
      align: "center",
      slot: "note",
    },
  ];

  // 领用单列表显示字段
  const orderColumns: TableColumnList = [
    {
      type: "selection",
      width: 60,
      label: "勾选列",
      fixed: "left",
    },
    {
      label: "领料出库单号",
      prop: "re_no",
      align: "center",
      minWidth: 130,
    },
    {
      label: "出库日期",
      prop: "out_date",
      align: "center",
      minWidth: 110,
    },
    {
      label: "条码",
      prop: "barcode",
      align: "center",
      minWidth: 120,
    },
    {
      label: "名称",
      prop: "title",
      align: "center",
      minWidth: 120,
    },
    {
      label: "规格型号",
      prop: "spec",
      align: "center",
      minWidth: 120,
    },
    {
      label: "品牌",
      prop: "brand",
      align: "center",
    },
    {
      label: "分类",
      prop: "class_name",
      align: "center",
    },
    {
      label: "单位",
      prop: "measure_name",
      align: "center",
    },
    {
      label: "出库仓库",
      prop: "out_ware",
      align: "center",
    },
    // {
    //   label: "使用位置",
    //   prop: "",
    //   align: "center",
    // },
    {
      label: "已领数",
      prop: "received_num",
      align: "center",
    },
    {
      label: "待用数",
      prop: "rem_num",
      align: "center",
    },
    {
      label: "使用数",
      prop: "use_num",
      align: "center",
      slot: "use_num",
      fixed: "right",
      minWidth: 140,
    },
  ];

  // 换下备件列表显示字段
  const downColumns: TableColumnList = [
    {
      type: "selection",
      width: 60,
      label: "勾选列",
      fixed: "left",
    },
    {
      label: "换上关联单号",
      prop: "order_no",
      align: "center",
      minWidth: 130,
    },
    {
      label: "单据类型",
      prop: "type_text",
      align: "center",
    },
    {
      label: "换上时间",
      prop: "chage_date",
      align: "center",
      minWidth: 110,
      cellRenderer: (scope) => {
        return formartDate(scope.row.chage_date);
      },
    },
    {
      label: "领料出库单号",
      prop: "re_no",
      align: "center",
      minWidth: 130,
    },
    {
      label: "出库仓库",
      prop: "out_ware",
      align: "center",
    },
    {
      label: "条码",
      prop: "barcode",
      align: "center",
      minWidth: 120,
    },
    {
      label: "名称",
      prop: "title",
      align: "center",
      minWidth: 120,
    },
    {
      label: "规格型号",
      prop: "spec",
      align: "center",
    },
    {
      label: "品牌",
      prop: "brand",
      align: "center",
    },
    {
      label: "分类",
      prop: "class_name",
      align: "center",
    },
    {
      label: "单位",
      prop: "measure_name",
      align: "center",
    },
    {
      label: "入库日期",
      prop: "in_wh_date",
      align: "center",
      minWidth: 110,
    },
    {
      label: "供应商",
      prop: "sup_name",
      align: "center",
    },
    {
      label: "使用位置",
      prop: "use_addr",
      align: "center",
    },
    {
      label: "使用数量",
      prop: "use_num",
      align: "center",
    },
    {
      label: "在线数量",
      prop: "online_num",
      align: "center",
    },
    {
      label: "换下数量",
      prop: "down_num",
      align: "center",
      slot: "down_num",
      fixed: "right",
      minWidth: 140,
    },
  ];

  return {
    formData,
    group,
    standardColumns,
    orderColumns,
    downColumns,
    getReBase,
    userList,
    getCycleName,
    addRules,
  };
}
