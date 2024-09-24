import { ElOption, ElSelect } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
import { getInstMapApi } from "@/api/quality/common";
import { getPlaceListHooks, unitListHooks } from "@/hooks/index";

export function useList(search: () => void) {
  const { placeList } = getPlaceListHooks();
  const { unitList } = unitListHooks();
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
    name: "", // 名称
    inst_type_no: "", // 型号
  });

  /** 表格列配置 */
  const columns: TableColumnList = [
    {
      label: "排序编号",
      prop: "sort",
      align: "center",
    },
    {
      label: "使用地点",
      prop: "use_place",
      align: "center",
    },
    {
      label: "名称",
      prop: "name",
      align: "center",
    },
    {
      label: "型号",
      prop: "inst_type_no",
      align: "center",
    },
    {
      label: "出厂编号",
      prop: "productserial_no",
      align: "center",
    },
    {
      label: "规格",
      prop: "",
      align: "center",
      children: [
        {
          label: "Max",
          prop: "max_val",
          align: "center",
          cellRenderer: ({ row }) => {
            return (
              <>
                <span>{row.max_val}</span>
                <span>{row.max_unit}</span>
              </>
            );
          },
        },
        {
          label: "e",
          prop: "e_val",
          align: "center",
          cellRenderer: ({ row }) => {
            return (
              <>
                <span>{row.e_val}</span>
                <span>{row.e_unit}</span>
              </>
            );
          },
        },
        {
          label: "d",
          prop: "d_val",
          align: "center",
          cellRenderer: ({ row }) => {
            return (
              <>
                <span>{row.d_val}</span>
                <span>{row.d_unit}</span>
              </>
            );
          },
        },
      ],
    },
    {
      label: "砝码重量",
      prop: "weight_val",
      align: "center",
      cellRenderer: ({ row }) => {
        return (
          <>
            <span>{row.weight_val}</span>
            <span>{row.weight_unit}</span>
          </>
        );
      },
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
      label: "更新人",
      prop: "up_name",
      align: "center",
    },

    {
      label: "操作",
      slot: "operation",
      fixed: "right",
    },
  ];

  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    {
      label: "名称",
      prop: "name",
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
    },
    {
      label: "型号",
      prop: "inst_type_no",
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
    },
  ];

  const instList = ref<any[]>([]);
  async function getInstMap() {
    const reuslt = await getInstMapApi({ is_open: 1 });
    instList.value = reuslt.data;
  }

  // 新增弹窗的数据
  const addFormData = ref({
    sort: "", //排序号
    inst_id: "", //仪器id
    name: "", //名称
    productserial_no: "", //出厂编号
    inst_type_no: "", //仪器型号
    max_val: "", //max值
    max_unit: "", //max单位
    e_val: "", //e值
    e_unit: "", //e单位
    d_val: "", //d值
    d_unit: "", //d单位
    weight_val: "", //重量值
    weight_unit: "", //重量单位
    use_place_id: [] as number[],
  });

  const selectNameRef = ref();
  function selectNameChange(val: number) {
    console.log("🚀 ~ selectNameChange ~ val:", val);

    const item = instList.value.find((item: any) => item.id === val);
    console.log("item", item);
    addFormData.value.inst_type_no = item.inst_type_no;
    addFormData.value.name = item.name;
    addFormData.value.productserial_no = item.productserial_no;
  }

  // 新增弹窗的表单项
  const addFormColumns: PlusColumnList = [
    {
      label: "排序号",
      prop: "sort",
    },
    {
      label: "使用地点",
      prop: "use_place_id",
    },
    {
      label: "名称",
      prop: "inst_id",
      valueType: "select",
      // options: computed(() => {
      //   return instOptions.value;
      // }),
      renderField: () => {
        return (
          <ElSelect
            v-model={addFormData.value.inst_id}
            ref={selectNameRef}
            style="width:100%"
            filterable={true}
            onChange={selectNameChange}
          >
            {instList.value.map((option) => (
              <ElOption key={option.id} label={option.name} value={option.id} />
            ))}
          </ElSelect>
        );
      },

      // fieldProps: {
      //   onChange: (value: any) => {
      //     const item = instList.value.find((item: any) => item.id === value);
      //     console.log("item", item);
      //     addFormData.value.inst_type_no = item.inst_type_no;
      //     addFormData.value.productserial_no = item.productserial_no;
      //   },
      // },
    },
    {
      label: "型号",
      prop: "inst_type_no",
      fieldProps: {
        disabled: true,
        placeholder: "请选择名称",
      },
    },
    {
      label: "出厂编号",
      prop: "productserial_no",
      fieldProps: {
        disabled: true,
        placeholder: "请选择名称",
      },
    },
    {
      label: "Max",
      prop: "max_val",
      fieldSlots: {
        append: () => (
          <>
            <ElSelect style="width:100px" v-model={addFormData.value.max_unit} filterable={true}>
              {unitList.value.map((option) => (
                <ElOption key={option.id} label={option.name} value={option.name} />
              ))}
            </ElSelect>
          </>
        ),
      },
    },
    {
      label: "e",
      prop: "e_val",
      fieldSlots: {
        append: () => (
          <>
            <ElSelect style="width:100px" v-model={addFormData.value.e_unit} filterable={true}>
              {unitList.value.map((option) => (
                <ElOption key={option.id} label={option.name} value={option.name} />
              ))}
            </ElSelect>
          </>
        ),
      },
    },
    {
      label: "d",
      prop: "d_val",
      fieldSlots: {
        append: () => (
          <>
            <ElSelect style="width:100px" v-model={addFormData.value.d_unit} filterable={true}>
              {unitList.value.map((option) => (
                <ElOption key={option.id} label={option.name} value={option.name} />
              ))}
            </ElSelect>
          </>
        ),
      },
    },
    {
      label: "砝码重量",
      prop: "weight_val",
      fieldSlots: {
        append: () => (
          <>
            <ElSelect style="width:100px" v-model={addFormData.value.weight_unit} filterable={true}>
              {unitList.value.map((option) => (
                <ElOption key={option.id} label={option.name} value={option.name} />
              ))}
            </ElSelect>
          </>
        ),
      },
    },
  ];
  // 新增弹窗的验证规则
  const addFormRules = {
    sort: [
      {
        required: true,
        message: "请输入排序号",
      },
    ],
    use_place_id: [
      {
        required: true,
        message: "请选择使用地点",
      },
    ],
    inst_id: [
      {
        required: true,
        message: "请选择仪器",
      },
    ],
    productserial_no: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          if (!value) {
            if (addFormData.value.inst_id) {
              callback(new Error("该仪器未设置出厂编号"));
            } else {
              callback(new Error("请选择仪器"));
            }
          } else {
            callback();
          }
        },
      },
    ],
    inst_type_no: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          if (!value) {
            if (addFormData.value.inst_id) {
              callback(new Error("该仪器未设置仪器型号"));
            } else {
              callback(new Error("请选择仪器"));
            }
          } else {
            callback();
          }
        },
      },
    ],
    max_val: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          if (!value) {
            callback(new Error("请输入Max值"));
          } else {
            if (addFormData.value.max_unit) {
              callback();
            } else {
              callback(new Error("请选择Max单位"));
            }
          }
        },
      },
    ],
    e_val: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          if (!value) {
            callback(new Error("请输入e值"));
          } else {
            if (addFormData.value.e_unit) {
              callback();
            } else {
              callback(new Error("请选择e值单位"));
            }
          }
        },
      },
    ],
    d_val: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          if (!value) {
            callback(new Error("请输入d值"));
          } else {
            if (addFormData.value.d_unit) {
              callback();
            } else {
              callback(new Error("请选择d值单位"));
            }
          }
        },
      },
    ],
    weight_val: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          if (!value) {
            callback(new Error("请输入砝码重量"));
          } else {
            if (addFormData.value.weight_unit) {
              callback();
            } else {
              callback(new Error("请选择砝码重量单位"));
            }
          }
        },
      },
    ],
  };
  // 新增弹窗开关
  const addVisible = ref(false);

  return {
    pagination,
    formData,
    columns,
    searchColumns,
    addFormData,
    addFormColumns,
    addFormRules,
    addVisible,
    instList,
    getInstMap,
    placeList,
    unitList,
  };
}
