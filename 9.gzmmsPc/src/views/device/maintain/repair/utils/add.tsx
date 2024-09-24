import { QuestionFilled } from "@element-plus/icons-vue";
import { ElIcon, ElInput, ElTooltip } from "element-plus";
import dayjs from "dayjs";
import type { PlusFormGroupRow } from "plus-pro-components";
import { useRouter } from "vue-router";
import { onlyIntp, onlyNumPoint } from "@/utils/index";
import { formartDate } from "@/utils/validate";
import { checkIsAfterDate, checkIsBeforeDate } from "@/utils/validate";
import { useSelectOrder } from "@/components/Device/SelectOrder/hook";
import { useBaseData } from "@/hooks/device/baseData";

export function useAdd() {
  // const { getType, getStatus } = useSelectOrder();
  const router = useRouter();
  const {
    getReBase,
    repairTypeList,
    outsourcingList,
    repairReasonList,
    faultList,
    userList,
    lineList,
  } = useBaseData();

  const formData = ref({
    bar_title: "", //资产名称
    barcode: "", // 资产条码
    spec: "", //规格型号
    eq_type_text: "", //资产类型
    save_addr_text: "", //使用位置
    use_dept_text: "", // 使用部门
    use_duty_user_text: "", //使用负责人
    occurrence_time: dayjs().format("YYYY-MM-DD HH:mm"), // 发生时间
    repair_user_id: undefined as FormNumType, //报修人
    fault_body: "", //设备部位
    product_line: undefined as FormNumType, //所属产线
    fault_note: "", //故障描述
    fault_picture: [] as string[], //故障图片
    repair_type: undefined as FormNumType, // 维修类型
    fault_reason: [] as number[], //故障原因 多选
    fault_type: [] as number[], // 故障类型
    repair_director: undefined as FormNumType, // 维修负责人
    other_repair_director: [] as number[], //其他维修负责人 多选
    repair_start_time: dayjs().format("YYYY-MM-DD HH:mm"), //维修开始时间
    repair_end_time: "", //维修结束时间
    is_stop: 0, //是否停机 0 否 1是
    stop_time: "", //累计误时
    outsourcing_id: undefined as FormNumType, //外委单位
    repair_price: "", //维修费用
    repair_note: "", //维修描述
    repair_picture: [] as string[], //维修图片
    is_replace: 0, //是否更换备件,默认否
    class_type: undefined as FormNumType, //班次内容
  });

  function validateEndTime(rule: any, value: any, callback: any) {
    if (value && checkIsBeforeDate(value, formData.value.repair_start_time)) {
      callback(new Error("结束日期时分不可在开始日期时分之前"));
    } else {
      callback();
    }
  }

  const addRules = {
    bar_title: [
      {
        required: true,
        message: "请选择设备",
      },
    ],
    occurrence_time: [
      {
        required: true,
        message: "请选择发生时间",
      },
    ],
    class_type: [
      {
        required: true,
        message: "请选择发生时间",
      },
    ],
    repair_user_id: [
      {
        required: true,
        message: "请选择报修人",
      },
    ],
    fault_note: [
      {
        required: true,
        message: "请输入故障描述",
      },
    ],
    repair_type: [
      {
        required: true,
        message: "请选择维修类型",
      },
    ],
    fault_reason: [
      {
        required: true,
        message: "请选择故障原因",
      },
    ],
    fault_type: [
      {
        required: true,
        message: "请选择故障类型",
      },
    ],
    repair_director: [
      {
        required: true,
        message: "请选择维修负责人",
      },
    ],
    repair_start_time: [
      {
        required: true,
        message: "请选择维修开始时间",
      },
    ],
    repair_end_time: [
      {
        validator: validateEndTime,
        // message: "请选择维修开始时间",
      },
    ],
    repair_note: [
      {
        required: true,
        message: "请输入维修描述",
      },
    ],
    is_replace: [
      {
        required: true,
        message: "请选择是否更换备件",
      },
    ],
  };

  function targetPage() {
    router.push({
      path: "/data/settings/cause",
    });
  }

  const group: PlusFormGroupRow[] = [
    {
      title: "设备信息",
      columns: [
        {
          label: "资产名称",
          labelWidth: 90,
          prop: "bar_title",
          fieldProps: {
            placeholder: "请点击搜索",
          },
        },
        {
          label: "资产条码",
          labelWidth: 90,
          prop: "barcode",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
          tooltip: "选择资产名称后自动填入",
        },
        {
          label: "规格型号",
          prop: "spec",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
          tooltip: "选择资产名称后自动填入",
        },
        {
          label: "资产类型",
          prop: "eq_type_text",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
          tooltip: "选择资产名称后自动填入",
        },
        {
          label: "使用位置",
          prop: "save_addr_text",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
          tooltip: "选择资产名称后自动填入",
        },
        {
          label: "使用部门",
          prop: "use_dept_text",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
          tooltip: "选择资产名称后自动填入",
        },
        {
          label: "使用负责人",
          prop: "use_duty_user_text",
          fieldProps: {
            placeholder: "--",
            disabled: true,
          },
          tooltip: "选择资产名称后自动填入",
        },
      ],
    },
    {
      title: "故障信息",
      hideInGroup: computed(() => {
        return !formData.value.bar_title;
      }),
      columns: [
        {
          label: "发生时间",
          prop: "occurrence_time",
          valueType: "date-picker",
          fieldProps: {
            type: "datetime",
            placeholder: "请选择时间",
            format: "YYYY-MM-DD HH:mm",
            valueFormat: "YYYY-MM-DD HH:mm",
            clearable: false,
            disabledDate: (date: string) => {
              return checkIsAfterDate(date, dayjs().format());
            },
          },
        },
        {
          label: "班次",
          prop: "class_type",
          valueType: "select",
          fieldProps: {
            placeholder: "请选择",
            filterable: true,
          },
          options: [
            {
              label: "A",
              value: 1,
            },
            {
              label: "B",
              value: 2,
            },
            {
              label: "C",
              value: 3,
            },
          ],
        },
        {
          label: "报修人",
          prop: "repair_user_id",
          valueType: "select",
          fieldProps: {
            placeholder: "请选择",
            filterable: true,
          },
          options: computed(() => {
            return userList.value.map((item) => ({
              label: item.name,
              value: item.id,
            }));
          }),
        },
        {
          label: "设备部位",
          prop: "fault_body",
          fieldProps: {
            placeholder: "请输入",
          },
        },
        {
          label: "所属产线",
          prop: "product_line",
          valueType: "select",
          fieldProps: {
            placeholder: "请选择",
          },
          options: computed(() => {
            return lineList.value.map((item) => ({
              label: item.name,
              value: item.id,
            }));
          }),
        },
        {
          label: "故障描述",
          prop: "fault_note",
          fieldProps: {
            placeholder: "请输入",
          },
          colProps: {
            span: 16,
          },
        },
        {
          label: "故障图片",
          prop: "fault_picture",
          fieldProps: {
            placeholder: "请选择",
          },
          colProps: {
            span: 24,
          },
        },
      ],
    },
    {
      title: "维修处理情况",
      hideInGroup: computed(() => {
        return !formData.value.bar_title;
      }),
      columns: [
        {
          label: "维修类型",
          prop: "repair_type",
          valueType: "select",
          fieldProps: {
            placeholder: "请选择",
          },
          options: computed(() => {
            return repairTypeList.value.map((item) => ({
              label: item.name,
              value: item.id,
            }));
          }),
        },
        {
          label: "故障原因",
          prop: "fault_reason",
          valueType: "select",
          // tooltip:"资料管理-故障原因中维护",
          fieldProps: {
            placeholder: "请选择",
            multiple: true,
            filterable: true,
          },
          renderLabel: (label) => {
            return (
              <div>
                {label}
                <ElTooltip
                  effect="dark"
                  placement="top"
                  v-slots={{
                    content: () => (
                      <>
                        <div class="cursor-pointer" onClick={() => targetPage()}>
                          资料管理-故障原因中维护
                        </div>
                      </>
                    ),
                  }}
                >
                  <ElIcon size="16">
                    <QuestionFilled style="width:16px" />
                  </ElIcon>
                </ElTooltip>
              </div>
            );
          },
          options: computed(() => {
            return repairReasonList.value.map((item) => ({
              label: item.name,
              value: item.id,
            }));
          }),
        },
        {
          label: "故障类型",
          prop: "fault_type",
          valueType: "select",
          fieldProps: {
            placeholder: "请选择",
            multiple: true,
          },
          options: computed(() => {
            return faultList.value.map((item) => ({
              label: item.name,
              value: item.id,
            }));
          }),
        },
        {
          label: "维修负责人",
          prop: "repair_director",
          valueType: "select",
          fieldProps: {
            placeholder: "请选择",
            filterable: true,
          },
          options: computed(() => {
            return userList.value.map((item) => ({
              label: item.name,
              value: item.id,
            }));
          }),
        },
        {
          label: "其他维修员工",
          prop: "other_repair_director",
          valueType: "select",
          fieldProps: {
            placeholder: "请选择",
            multiple: true,
            filterable: true,
          },
          options: computed(() => {
            return userList.value.map((item) => ({
              label: item.name,
              value: item.id,
            }));
          }),
        },
        {
          label: "维修开始时间",
          prop: "repair_start_time",
          valueType: "date-picker",
          fieldProps: {
            type: "datetime",
            placeholder: "请选择时间",
            format: "YYYY-MM-DD HH:mm",
            valueFormat: "YYYY-MM-DD HH:mm",
            clearable: false,
          },
        },
        {
          label: "维修结束时间",
          prop: "repair_end_time",
          valueType: "date-picker",
          fieldProps: {
            type: "datetime",
            placeholder: "请选择时间",
            format: "YYYY-MM-DD HH:mm",
            valueFormat: "YYYY-MM-DD HH:mm",
            disabledDate: (date: string) => {
              return checkIsBeforeDate(date, formData.value.repair_start_time, "YYYY-MM-DD");
            },
          },
        },
        {
          label: "是否停机",
          prop: "is_stop",
          valueType: "switch",
          fieldProps: {
            inlinePrompt: true,
            activeValue: 1,
            inactiveValue: 0,
            activeText: "是",
            inactiveText: "否",
          },
        },
        {
          label: "累计误时(分)",
          prop: "stop_time",
          labelWidth: 120,
          fieldProps: {
            placeholder: "请输入",
          },
          renderField: (value, onChange) => {
            let val = onlyIntp(value);
            return h(ElInput, {
              modelValue: val,
              onChange,
            });
          },
        },
        {
          label: "外委单位",
          prop: "outsourcing_id",
          valueType: "select",
          fieldProps: {
            placeholder: "请选择",
          },
          options: computed(() => {
            return outsourcingList.value.map((item) => ({
              label: item.name,
              value: item.id,
            }));
          }),
        },
        {
          label: "维修费用(元)",
          prop: "repair_price",
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
          label: "维修描述",
          prop: "repair_note",
          fieldProps: {
            placeholder: "请输入",
          },
          colProps: {
            span: 24,
          },
        },
        {
          label: "维修图片",
          prop: "repair_picture",
          fieldProps: {
            placeholder: "请输入",
          },
          colProps: {
            span: 24,
          },
        },
      ],
    },
    {
      title: "更换备件",
      hideInGroup: computed(() => {
        return !formData.value.bar_title;
      }),
      columns: [
        {
          label: "是否更换备件",
          prop: "is_replace",
          valueType: "radio",
          options: [
            {
              label: "是",
              value: 1,
            },
            {
              label: "否",
              value: 0,
            },
          ],
        },
      ],
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
    // {
    //   label: "制单人",
    //   prop: "",
    //   align: "center",
    // },
    // {
    //   label: "领料申请人",
    //   prop: "receiver_name",
    //   align: "center",
    //   minWidth: 110,
    // },
    // {
    //   label: "指定领取人",
    //   prop: "ar_names",
    //   align: "center",
    //   minWidth: 110,
    // },
    // {
    //   label: "领料类型",
    //   prop: "rec_type",
    //   align: "center",
    //   cellRenderer: (scope) => {
    //     return getType(scope.row.rec_type);
    //   },
    // },
    // {
    //   label: "单据状态",
    //   prop: "status",
    //   align: "center",
    //   cellRenderer: (scope) => {
    //     return getStatus(scope.row.status);
    //   },
    // },
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
    // {
    //   label: "批次/日期",
    //   prop: "ph_no",
    //   align: "center",
    //   minWidth: 110,
    // },
    // {
    //   label: "入库日期",
    //   prop: "in_wh_date",
    //   align: "center",
    //   minWidth: 110,
    //   // cellRenderer: (scope) => {
    //   //   return formartDate(scope.row.in_wh_date);
    //   // },
    // },
    // {
    //   label: "单价",
    //   prop: "price",
    //   align: "center",
    // },
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
    addRules,
    getReBase,
    orderColumns,
    downColumns,
    userList,
  };
}
