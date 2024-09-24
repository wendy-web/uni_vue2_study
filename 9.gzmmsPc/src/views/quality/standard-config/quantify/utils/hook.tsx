import { ElSwitch, ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
import { getBrandMapApi, getInspMapApi, getInstMapApi } from "@/api/quality/common/index";
import { changeStatusApi } from "@/api/quality/standard-config/quantify/index";
import { perms } from "@/utils/auth";

export function useList(search: () => void) {
  // 品牌大类
  const brandOptions = ref<OptionType[]>([]);
  async function getBrandData() {
    const result = await getBrandMapApi();
    brandOptions.value = result.data.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  }

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });
  /** 表单数据 */
  const formData = ref({
    name: "", // 项目名称
    is_open: "", // 可用状态
  });
  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    {
      label: "项目名称",
      prop: "name",
      fieldProps: {
        placeholder: "请输入关键字",
      },
      labelWidth: 100,
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
    },
    {
      label: "可用状态",
      prop: "is_open",
      valueType: "select",
      options: [
        {
          label: "可用",
          value: 1,
        },
        {
          label: "禁用",
          value: 0,
        },
      ],
      fieldProps: {
        clearable: true,
        onChange: () => {
          search();
        },
      },
    },
  ];
  async function changeOpen(data: any) {
    let result = await changeStatusApi(data);
    ElMessage.success(result.msg);
  }
  const columns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      width: 60,
      align: "center",
    },
    {
      label: "产品大类",
      prop: "brand_text",
      align: "center",
      width: 160,
      showOverflowTooltip: true,
    },
    {
      label: "项目名称",
      prop: "name",
      width: 160,
      align: "center",
      showOverflowTooltip: true,
      cellRenderer: (scope) => <span>{scope.row.name || "-"}</span>,
    },
    {
      label: "检验依据",
      prop: "insp_name",
      width: 160,
      align: "center",
      cellRenderer: (scope) => <span>{scope.row.insp_name || "-"}</span>,
    },
    {
      label: "检测仪器",
      prop: "inst_name",
      align: "center",
      cellRenderer: (scope) => <span>{scope.row.inst_name || "-"}</span>,
    },
    {
      label: "可用状态",
      prop: "is_open",
      align: "center",
      showOverflowTooltip: true,
      cellRenderer: ({ row }) => (
        <>
          {perms(["sc:quantify:open"]) ? (
            <ElSwitch
              v-model={row.is_open}
              activeValue={1} // on的状态值
              inactiveValue={0} // off的状态值
              class={"cursor-pointer"}
              onClick={() => changeOpen({ id: row.id, is_open: row.is_open })}
            ></ElSwitch>
          ) : (
            <ElTag type={row.is_open === 1 ? "success" : "danger"}>
              {row.is_open === 1 ? "启用" : "停用"}
            </ElTag>
          )}
        </>
      ),
    },
    {
      label: "创建人",
      width: 120,
      prop: "ct_name",
      align: "center",
    },
    {
      label: "创建时间",
      width: 180,
      prop: "create_time",
      align: "center",
    },
    {
      label: "更新人",
      width: 120,
      prop: "up_name",
      align: "center",
    },
    {
      label: "更新时间",
      width: 180,
      prop: "update_time",
      align: "center",
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation",
    },
  ];
  interface OptionsItem {
    value: string | number;
    label: string;
  }
  //   检验依据下拉选项
  const yijuOptions = ref([]);
  //   检测仪器下拉选项
  const yiqiOptions = ref([]);
  const querySearchYiju = (queryString?: string, cb?: any) => {
    getInspMapApi({ is_open: 1, name: queryString })
      .then((result) => {
        yijuOptions.value = result.data.map((item: any) => {
          return {
            // label: item.id,
            // value: item.name,
            label: item.name,
            value: item.id,
          };
        });

        // cb(yijuOptions.value);
      })
      .catch((error) => {
        console.log("querySearchYiju异步获取数据报错了：", error);
      });
  };
  const querySearchYiqi = (queryString?: string, cb?: any) => {
    getInstMapApi({ is_open: 1, name: queryString })
      .then((result) => {
        yiqiOptions.value = result.data.map((item: any) => {
          return {
            // label: item.id,
            // value: item.name,
            label: item.name,
            value: item.id,
          };
        });
        // cb(yiqiOptions.value);
      })
      .catch((error) => {
        console.log("querySearchYiqi异步获取数据报错了：", error);
      });
  };
  /** 记录编辑的id */
  const listId = ref(0);
  // 新增弹窗的数据
  const addFormData = ref({
    brand: "" || [], // 产品大类
    name: "", // 项目名称
    insp_name: "", // 检验依据
    insp_id: "",
    inst_name: "", // 检测仪器
    inst_id: "",
    is_open: 0, //启用/停用
  });
  // 新增弹窗的表单项
  const addFormColumns: PlusColumnList = [
    {
      label: "产品大类",
      prop: "brand",
      valueType: "select",
      options: computed(() => brandOptions.value),
      fieldProps: computed(() => ({ disabled: listId.value ? true : false, multiple: true })),
    },
    {
      label: "项目名称",
      prop: "name",
    },
    {
      label: "检验依据",
      prop: "insp_id",
      // valueType: "autocomplete",
      valueType: "select",
      options: computed(() => yijuOptions.value),
      fieldProps: {
        filterable: true,
        clearable: true,
        fetchSuggestions: querySearchYiju,
        onSelect: (event: any) => {
          // addFormData.value.insp_id = event.label;
          console.log("检验依据onSelect:", event);
        },
        onChange: (event: any) => {
          console.log("检测依据onChange:", event);
          let findItem: any = yijuOptions.value.find((item: any) => item.value === event);
          addFormData.value.insp_name = findItem?.label;
        },
      },
    },
    {
      label: "检测仪器",
      prop: "inst_id",
      // valueType: "autocomplete",
      valueType: "select",
      options: computed(() => yiqiOptions.value),
      fieldProps: {
        filterable: true,
        clearable: true,
        fetchSuggestions: querySearchYiqi,
        onSelect: (event: any) => {
          // addFormData.value.inst_id = event.label;
          console.log("检测仪器onSelect:", event);
        },
        onChange: (event: any) => {
          console.log("检测仪器onChange:", event);
          let findItem: any = yiqiOptions.value.find((item: any) => item.value === event);
          addFormData.value.inst_name = findItem?.label;
        },
      },
    },
    {
      label: "可用状态",
      prop: "is_open",
      valueType: "switch",
      fieldProps: {
        inlinePrompt: true,
        activeText: "启用",
        inactiveText: "停用",
        activeValue: 1, // on的状态值
        inactiveValue: 0, // off的状态值
      },
    },
  ];
  // 新增弹窗的验证规则
  const addFormRules = {
    brand: [
      {
        required: true,
        message: "请选择产品大类",
      },
    ],
    name: [
      {
        required: true,
        message: "请输入项目名称",
      },
    ],
    insp_id: [
      {
        required: true,
        message: "请输入检验依据",
      },
    ],
    inst_id: [
      {
        required: true,
        message: "请输入检测仪器",
      },
    ],
  };

  // 新增弹窗开关
  const addVisible = ref(false);
  return {
    getBrandData,
    pagination,
    formData,
    searchColumns,
    columns,
    addFormData,
    addFormColumns,
    addFormRules,
    addVisible,
    listId,
    querySearchYiqi,
    querySearchYiju,
  };
}
