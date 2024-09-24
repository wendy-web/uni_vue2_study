import type { PaginationProps } from "@pureadmin/table";
import dayjs from "dayjs";
import type { EquipmentModule } from "@/api/device/common/types";
import { useBaseData } from "@/hooks/device/baseData";

export function useList() {
  const { getBase, treeData, userList, placeList } = useBaseData();
  const formData = ref({
    keyword: "", //关键字
    equipment_type_id: undefined as FormNumType, //资产类型id
    use_addr_id: undefined as FormNumType, //使用位置id
    meter_readings_id: undefined as FormNumType, //抄表人id
    purpose: undefined as FormNumType, //用途
    this_meter_time: "", //抄表日期
    create_time: "", //创建日期
  });

  const dialogType = ref(1);

  /** 设备档案列表 */
  const deviceEquipmentData = ref<EquipmentModule.EquipmentItemType[]>([]);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });

  function getPurposeName(type: number) {
    const purposeNameMap = new Map([
      [0, "生产"],
      [1, "清洁"],
      [2, "其他"],
    ]);
    return purposeNameMap.get(type) || "";
  }

  /** 获取班别名称 */
  function getClassTypeName(type: number) {
    const classTypeMap = new Map([
      [1, "A"],
      [2, "B"],
      [3, "C"],
    ]);
    return classTypeMap.get(type) || "";
  }
  /** 获取班次名称 */
  function getClassNoName(type: number) {
    const classNoMap = new Map([
      [1, "早"],
      [2, "中"],
      [3, "晚"],
    ]);

    return classNoMap.get(type) || "";
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
      label: "抄表流水号",
      prop: "serial_number_no",
      align: "center",
      minWidth: 100,
    },
    {
      label: "资产名称",
      prop: "bar_title",
      align: "center",
      minWidth: 110,
    },
    {
      label: "使用位置",
      prop: "use_places",
      align: "center",
      minWidth: 110,
    },
    {
      label: "资产类型",
      prop: "equipment_type_name",
      align: "center",
    },
    {
      label: "倍率",
      prop: "multiplier",
      align: "center",
    },
    {
      label: "班次",
      prop: "class_no",
      align: "center",
      cellRenderer: ({ row }) => {
        return getClassNoName(row.class_no);
      },
    },
    {
      label: "班别",
      prop: "class_type",
      align: "center",
      cellRenderer: ({ row }) => {
        return getClassTypeName(row.class_type);
      },
    },
    {
      label: "起码读数",
      prop: "start_num",
      align: "center",
    },
    {
      label: "起码时间",
      prop: "start_time",
      align: "center",
    },
    {
      label: "止码读数",
      prop: "end_num",
      align: "center",
    },
    {
      label: "止码时间",
      prop: "end_time",
      align: "center",
    },
    {
      label: "用量",
      prop: "dosage_num",
      align: "center",
    },
    {
      label: "用途",
      prop: "purpose",
      align: "center",
      cellRenderer: ({ row }) => {
        return getPurposeName(row.purpose);
      },
    },
    {
      label: "是否生产",
      prop: "is_produce",
      align: "center",
      cellRenderer: ({ row }) => {
        return row.is_produce === 1 ? "是" : "否";
      },
    },
    {
      label: "抄表日期",
      prop: "this_meter_time",
      align: "center",
      minWidth: 110,
    },
    {
      label: "抄表人",
      prop: "meter_readings_name",
      align: "center",
    },
    {
      label: "制单人",
      prop: "ct_name",
      align: "center",
    },
    {
      label: "制单时间",
      prop: "create_time",
      align: "center",
      minWidth: 110,
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
      labelWidth: 60,
      fieldProps: {
        placeholder: "请输入名称/编号",
      },
    },
    {
      label: "资产类型",
      prop: "equipment_type_id",
    },
    {
      label: "使用位置",
      prop: "use_addr_id",
    },
    {
      label: "抄表人",
      prop: "meter_readings_id",
      valueType: "select",
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
      label: "用途",
      prop: "purpose",
      valueType: "select",
      options: [
        {
          label: "生产",
          value: 0,
        },
        {
          label: "清洁",
          value: 1,
        },
      ],
    },
    {
      label: "抄表日期",
      prop: "this_meter_time",
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

  const addFormData = ref({
    equipment_type_id: undefined as FormNumType, // 资产类型id
    equipment_id: undefined as FormNumType, //设备id
    equipment_name: "", //资产名称
    is_produce: undefined as FormNumType, //是否生产；0：否；1：是
    use_addr: "",
    save_addr_text: "",
    class_no: undefined as FormNumType, //班次 1早 2中 3晚
    class_type: undefined as FormNumType, //班别(1A、2B、3C)
    last_meter_time: "", //上次抄表时间
    this_meter_time: dayjs().format("YYYY-MM-DD HH:mm:ss"), //本次抄表时间
    start_num: "", //起码读数
    end_num: "", //止码读数
    purpose: undefined as FormNumType, //用途
    dosage_num: "", //用量
    meter_readings_id: undefined as FormNumType, //抄表人ud
    note: "",
  });

  const addRules = {
    equipment_type_id: [
      {
        required: true,
        message: "请选择表计类型",
      },
    ],
    equipment_id: [
      {
        required: true,
        message: "请选择表计设备",
      },
    ],
    is_produce: [
      {
        required: true,
        message: "请选择是否生产",
      },
    ],

    start_num: [
      {
        required: true,
        message: "请输入起数",
      },
    ],
    purpose: [
      {
        required: true,
        message: "请输入用途",
      },
    ],
    this_meter_time: [
      {
        required: true,
        message: "请选择本次抄表时间",
      },
    ],
    last_meter_time: [
      {
        required: true,
        message: "请选择上次抄表时间",
      },
    ],
    end_num: [
      {
        required: true,
        message: "请输入止数",
      },
    ],
    meter_readings_id: [
      {
        required: true,
        message: "请选择抄表人",
      },
    ],
  };

  /** 是否可以选择设备开关 */
  const selectEquipment = ref(false);

  const addFormColumns: PlusColumnList = [
    {
      label: "资产类型",
      prop: "equipment_type_id",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择",
        //@ts-ignore
        disabled: computed(() => dialogType.value !== 1),
      },
    },
    {
      label: "资产名称",
      prop: "equipment_id",
      valueType: "select",
      fieldProps: {
        //@ts-ignore
        disabled: computed(() => !selectEquipment.value),
        valueKey: "id",
      },
      options: computed(() => {
        return deviceEquipmentData.value.map((item) => {
          return {
            label: item.bar_title,
            value: item.id,
          };
        });
      }),
      hideInForm: computed(() => {
        return dialogType.value !== 1;
      }),
    },
    {
      label: "资产名称",
      prop: "equipment_name",
      fieldProps: {
        disabled: true,
      },
      hideInForm: computed(() => {
        return dialogType.value === 1;
      }),
    },
    {
      label: "使用位置",
      prop: "save_addr_text",
      fieldProps: {
        //@ts-ignore
        placeholder: computed(() => (addFormData.value.equipment_id ? "--" : "选择设备后自动带入")),
        disabled: true,
      },
    },
    {
      label: "是否生产",
      prop: "is_produce",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择",
      },
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
    {
      label: "班次",
      prop: "class_no",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择",
      },
      options: [
        {
          label: "早",
          value: 1,
        },
        {
          label: "中",
          value: 2,
        },
        {
          label: "晚",
          value: 3,
        },
      ],
    },
    {
      label: "班别",
      prop: "class_type",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择",
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
      label: "上次抄表时间",
      prop: "last_meter_time",
      valueType: "date-picker",
      fieldProps: {
        type: "datetime",
        placeholder: "请选择",
        format: "YYYY-MM-DD HH:mm:ss",
        valueFormat: "YYYY-MM-DD HH:mm:ss",
        clearable: false,
      },
    },
    {
      label: "起数",
      prop: "start_num",
    },
    {
      label: "用途",
      prop: "purpose",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择",
      },
      options: [
        {
          label: "生产",
          value: 0,
        },
        {
          label: "清洁",
          value: 1,
        },
        {
          label: "其他",
          value: 2,
        },
      ],
    },
    {
      label: "本次抄表时间",
      prop: "this_meter_time",
      valueType: "date-picker",
      fieldProps: {
        type: "datetime",
        placeholder: "请选择",
        format: "YYYY-MM-DD HH:mm:ss",
        valueFormat: "YYYY-MM-DD HH:mm:ss",
        clearable: false,
      },
    },
    {
      label: "止数",
      prop: "end_num",
      fieldProps: {
        placeholder: "请选择",
      },
    },
    {
      label: "用量",
      prop: "dosage_num",
    },
    {
      label: "抄表人",
      prop: "meter_readings_id",
      valueType: "select",
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
      label: "备注",
      prop: "note",
      fieldProps: {
        placeholder: "请输入",
      },
      colProps: {
        span: 24,
      },
    },
  ];

  return {
    pagination,
    columns,
    searchColumns,
    addFormColumns,
    getBase,
    treeData,
    placeList,
    formData,
    addFormData,
    addRules,
    deviceEquipmentData,
    selectEquipment,
    dialogType,
  };
}
