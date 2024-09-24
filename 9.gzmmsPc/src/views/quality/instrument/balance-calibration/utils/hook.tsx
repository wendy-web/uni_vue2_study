import { ElOption, ElSelect, ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { useStorage } from "@vueuse/core";
import { useRouter } from "vue-router";
import { getScaledeviceInitApi } from "@/api/quality/instrument/balance-calibration";
import { formartDate } from "@/utils/validate";
import { useCommonHooks } from "@/hooks/quality";
import { useselectData } from "@/hooks/quality/selectData";

type PlaceListType = {
  use_place_id: string;
  use_place: string;
};

export function useList() {
  const router = useRouter();
  const { showApproveLog } = useCommonHooks();
  const { statusOptions, getStatusText, getTagType, getBasePassLabel, getLineList } =
    useselectData();

  /** 表格分页配置 */
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });

  /** 表单数据 */
  const formData = ref({
    order_no: "", // 单据编号
    scaledevice_types: undefined as FormNumType, //型号
    status: undefined as FormNumType, //状态
    check_date: "", //检验日期
  });
  /** 签字复核/反审核,都是进入详情页面 */
  function cellDetail(row: any) {
    router.push({
      path: "/quality/instrument/balance-calibration/add",
      query: {
        id: row.id,
        pageType: 3,
        assocType: JSON.stringify(row.assoc_type),
      },
    });
  }

  /** 表格列配置 */
  const columns: TableColumnList = [
    {
      label: "单据编号",
      prop: "order_no",
      align: "center",
      cellRenderer: ({ row }) => (
        <>
          <span class="cursor-pointer underline text-sky-800" onClick={() => cellDetail(row)}>
            {row.order_no}
          </span>
        </>
      ),
    },
    {
      label: "检验日期",
      prop: "check_date",
      align: "center",
    },
    {
      label: "型号",
      prop: "scaledevice_types",
      align: "center",
    },
    {
      label: "Max规格",
      prop: "max_val",
      align: "center",
    },
    {
      label: "砝码重量",
      prop: "weight_val",
      align: "center",
    },
    {
      label: "数值单位",
      prop: "max_unit",
      align: "center",
    },
    {
      label: "检验结果",
      prop: "check_res",
      align: "center",
      cellRenderer: ({ row }) => {
        return typeof row.check_res === "number" ? getBasePassLabel(row.check_res) : "--";
      },
    },

    {
      label: "检验员",
      prop: "check_sign",
      align: "center",
      slot: "check_sign",
    },
    {
      label: "单据状态",
      prop: "status",
      align: "center",
      cellRenderer: ({ row }) => (
        <>
          <ElTag
            type={getTagType(row.status)}
            class={"cursor-pointer"}
            onClick={() => showApproveLog({ id: row.id, orderType: 36, orderStatus: row.status })}
          >
            {getStatusText(row.status, row.assoc_type)}
          </ElTag>
        </>
      ),
    },
    {
      label: "备注",
      prop: "remark",
      align: "center",
    },
    {
      label: "制单人",
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
      align: "center",
    },
  ];

  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    {
      label: "单据编号",
      prop: "order_no",
    },
    {
      label: "型号",
      prop: "scaledevice_types",
      labelWidth: 60,
    },
    {
      label: "单据状态",
      prop: "status",
      valueType: "select",
      options: statusOptions,
    },
    {
      label: "检验日期",
      prop: "check_date",
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

  const placeOptions = ref<PlaceListType[]>([]);

  const balanceCalibrationData = useStorage(
    "balanceCalibrationData",
    {
      use_place_id: "", //使用地点id
      use_place: "", //使用地点名称
      weight_val: "", //砝码重量
      weight_unit: "", //砝码单位
      weight_content: "", //砝码重量显示内容
      max_val: "", //Max规格
      max_unit: "", //Max规格单位
      max_content: "", //Max规格显示内容
    },
    sessionStorage,
  );

  async function getScaledeviceInit(
    type: number = 1,
    use_place_id?: string,
    weight_val?: string,
    weight_unit?: string,
  ) {
    let data = {
      type,
      use_place_id,
      weight_val,
      weight_unit,
    };
    addLoading.value = true;
    const result = await getScaledeviceInitApi(data);
    addLoading.value = false;
    if (type === 1) {
      placeOptions.value = result.data;
    } else if (type === 2) {
      let itemValue = result.data[0] || {};
      let { weight_val, weight_unit } = itemValue;
      addFormData.value.weight_val = weight_val;
      addFormData.value.weight_unit = weight_unit;
      addFormData.value.weight_content = weight_val + weight_unit;
      getScaledeviceInit(3, addFormData.value.use_place_id, weight_val, weight_unit);
    } else if (type === 3) {
      let itemValue = result.data[0] || {};
      let { max_val, max_unit } = itemValue;
      addFormData.value.max_val = max_val;
      addFormData.value.max_unit = max_unit;
      addFormData.value.max_content = max_val + max_unit;

      balanceCalibrationData.value = addFormData.value;
    }
  }

  function selectPlaceChange(val: string) {
    console.log("🚀 ~ selectPlaceChange ~ val:", val);
    addFormData.value.use_place =
      placeOptions.value.find((item) => item.use_place_id === val)?.use_place || "";
    getScaledeviceInit(2, val);
  }

  // 新增弹窗的数据
  const addFormData = ref({
    use_place_id: "", //使用地点id
    use_place: "", //使用地点名称
    weight_val: "", //砝码重量
    weight_unit: "", //砝码单位
    weight_content: "", //砝码重量显示内容
    max_val: "", //Max规格
    max_unit: "", //Max规格单位
    max_content: "", //Max规格显示内容
  });
  // 新增弹窗的表单项;
  const addFormColumns: PlusColumnList = [
    {
      label: "使用地点",
      prop: "use_place_id",
      valueType: "select",
      renderField: () => {
        return (
          <ElSelect
            v-model={addFormData.value.use_place_id}
            style="width:100%"
            filterable={true}
            onChange={selectPlaceChange}
          >
            {placeOptions.value.map((option) => (
              <ElOption
                key={option.use_place_id}
                label={option.use_place}
                value={option.use_place_id}
              />
            ))}
          </ElSelect>
        );
      },
    },
    {
      label: "砝码重量",
      prop: "weight_content",
      fieldProps: {
        disabled: true,
      },
    },
    {
      label: "Max规格",
      prop: "max_content",
      fieldProps: {
        disabled: true,
      },
    },
  ];
  // 新增弹窗的验证规则;
  const addFormRules = {
    use_place_id: [
      {
        required: true,
        message: "请选择使用地点",
      },
    ],
  };
  // 新增弹窗开关;
  const addVisible = ref(false);
  const addLoading = ref(false);
  return {
    pagination,
    formData,
    columns,
    searchColumns,
    router,
    cellDetail,
    addFormData,
    addFormRules,
    addVisible,
    addLoading,
    addFormColumns,
    getScaledeviceInit,
  };
}
