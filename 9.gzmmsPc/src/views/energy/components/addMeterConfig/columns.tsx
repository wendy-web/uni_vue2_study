import { ElOption, ElSelect, ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { useSelectData } from "@/views/energy/hooks/index";

export function useColumns() {
  const { autoRuleOptions, getTypeList, treeData, getUserList, getRelData, relList } =
    useSelectData();

  const addFormData = ref({
    rel_id: undefined as FormNumType, //采集表名id
    rel_name: "", // 采集表名,名称
    auto_rule_type: undefined as FormNumType, //自动抄表规则 0 不自动 1 按班次 2 按每天 3 按每月
    eq_type: undefined as FormNumType, //仪表类型
    director_uid: [] as number[], //多选负责人
    eq_id: undefined as FormNumType, //选择绑定设备id
    eq_name: "", //选择绑定设备名称
  });

  const tableData = ref<any[]>([]);
  const tableLoading = ref(false);
  const rel_id = ref(0);

  const selectRelRef = ref<InstanceType<typeof ElSelect>>();

  const addColumns: PlusColumnList = [
    {
      label: "采集表名",
      prop: "rel_id",
      colProps: {
        span: 12,
      },
      tooltip: "不可选择已添加过的",
      valueType: "select",
      // fieldProps: {
      //   filterable: true,
      //   ref: (instance: InstanceType<typeof ElSelect>) => {
      //     selectRelRef.value = instance;
      //   },
      //   onChange(value: number) {
      //     nextTick(() => {
      //       addFormData.value.rel_name = selectRelRef.value?.selected.currentLabel;
      //       console.log("🚀 ~ nextTick ~ addFormData.value.rel_name :", addFormData.value.rel_name);
      //     });
      //   },
      // },
      // options: computed(() => {
      //   return relList.value.map((item) => {
      //     return {
      //       label: item.name,
      //       value: item.id,
      //       fieldItemProps: {
      //         disabled: item.is_bind,
      //       },
      //     };
      //   });
      // }),
      renderField: (value) => {
        return (
          <ElSelect
            v-model={addFormData.value.rel_id}
            ref={selectRelRef}
            style="width:100%"
            filterable={true}
            onChange={() => {
              nextTick(() => {
                addFormData.value.rel_name = selectRelRef.value?.selected.currentLabel;
                console.log(
                  "🚀 ~ nextTick ~ addFormData.value.rel_name:",
                  addFormData.value.rel_name,
                );
              });
            }}
          >
            {relList.value.map((option) => (
              <ElOption
                key={option.id}
                label={option.name}
                value={option.id}
                disabled={option.is_bind && option.id !== rel_id.value}
              />
            ))}
          </ElSelect>
        );
      },
    },
    {
      label: "采集负责人",
      prop: "director_uid",
      valueType: "select",
      fieldProps: {
        filterable: true,
        multiple: true,
        multipleLimit: 2,
      },
      options: getUserList,
      colProps: {
        span: 12,
      },
    },
    {
      label: "自动抄表规则",
      prop: "auto_rule_type",
      valueType: "radio",
      options: autoRuleOptions,
    },
    {
      label: "绑定仪表类型",
      prop: "eq_type",
      colProps: {
        span: 12,
      },
      //   renderExtra: () => (
      //     <>
      //       <span class="text-[#606266] inline-block w-[94px] text-right mr-4">选择绑定设备:</span>
      //       {!addFormData.value.eq_type ? <span>请先选择资产类型</span> : null}
      //       {addFormData.value.eq_type && !addFormData.value.eq_name ? (
      //         <span class="text-slate-400">请选择下方设备</span>
      //       ) : null}
      //       {addFormData.value.eq_type && addFormData.value.eq_name ? (
      //         <ElTag closable class="mr-2 mb-2" size="large" onClose={tagClose}>
      //           {addFormData.value.eq_name}
      //         </ElTag>
      //       ) : null}
      //     </>
      //   ),
    },
    {
      label: "选择绑定设备",
      prop: "eq_name",
      colProps: {
        span: 13,
      },
    },
  ];

  const addRules = {
    rel_id: [{ required: true, message: "请选择采集表名" }],
    auto_rule_type: [{ required: true, message: "请选择自动抄表规则" }],
    eq_name: [
      {
        validator: (rule: any, value: any, callback: any) => {
          if (addFormData.value.eq_type) {
            if (!value) {
              callback(new Error("请选择设备"));
            } else {
              callback();
            }
          } else {
            callback();
          }
        },
      },
    ],
  };

  const columns: TableColumnList = [
    {
      label: "操作",
      slot: "operation",
      align: "center",
      width: 90,
      fixed: "left",
    },
    {
      label: "设备编码",
      prop: "asset_no",
      align: "center",
      minWidth: 110,
    },
    {
      label: "资产类型",
      prop: "eq_type_text",
      align: "center",
      minWidth: 110,
    },
    {
      label: "资产名称",
      prop: "bar_title",
      align: "center",
      minWidth: 120,
    },
    {
      label: "资产条码",
      prop: "barcode",
      align: "center",
      minWidth: 120,
    },

    {
      label: "规格型号",
      prop: "spec",
      align: "center",
      minWidth: 110,
    },
    {
      label: "可用状态",
      prop: "status",
      align: "center",
      cellRenderer: (scope) => (
        <>
          <ElTag type={getTagType(scope.row.status)}>{getStatusTitle(scope.row.status)}</ElTag>
        </>
      ),
    },
    {
      label: "使用位置",
      prop: "save_addr_text",
      align: "center",
      minWidth: 110,
    },
    {
      label: "使用部门",
      prop: "use_dept_text",
      align: "center",
      minWidth: 110,
    },
  ];
  const getStatusTitle = (status: number) => {
    switch (status) {
      case 0:
        return "停用";
      case 1:
        return "正常";
      case 2:
        return "闲置";
      case 3:
        return "待报废";
      case 4:
        return "已报废";
      default:
        return "";
    }
  };

  const getTagType = (status: number) => {
    switch (status) {
      case 0:
        return "danger";
      case 1:
        return "success";
      case 2:
        return "info";
      case 3:
        return "warning";
      case 4:
        return "danger";
      default:
        return "";
    }
  };

  return {
    getTypeList,
    treeData,
    addFormData,
    addColumns,
    columns,
    tableData,
    tableLoading,
    addRules,
    getRelData,
    relList,
    rel_id,
  };
}
