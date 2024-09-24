import { ElSwitch, ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
import { changeStatusApi } from "@/api/quality/standard-config/instrument/index";
import { perms } from "@/utils/auth";

export function useList(search: () => void) {
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });
  /** 表单数据 */
  const formData = ref({
    name: "", // 仪器名称
    is_open: "", // 可用状态
  });
  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    {
      label: "仪器名称",
      prop: "name",
      fieldProps: {
        placeholder: "搜索关键词",
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
      label: "仪器编码",
      prop: "code",
      align: "center",
      showOverflowTooltip: true,
    },
    {
      label: "仪器名称",
      prop: "name",
      align: "center",
      showOverflowTooltip: true,
    },
    {
      label: "出厂编号",
      prop: "productserial_no",
      align: "center",
    },
    {
      label: "仪器型号",
      prop: "inst_type_no",
      align: "center",
    },
    {
      label: "所属品牌",
      prop: "brand",
      align: "center",
      showOverflowTooltip: true,
      cellRenderer: (scope) => <span>{scope.row.brand || "-"}</span>,
    },

    {
      label: "可用状态",
      prop: "is_open",
      align: "center",
      showOverflowTooltip: true,
      cellRenderer: ({ row }) => (
        <>
          {perms(["sc:instrument:open"]) ? (
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

  // 新增弹窗的数据
  const addFormData = ref({
    name: "", // 仪器名称
    code: "", // 仪器编码
    brand: "", // 所属品牌
    productserial_no: "", //出厂编号
    inst_type_no: "", //仪器型号
    is_open: 0, //启用/停用
  });
  // 新增弹窗的表单项
  const addFormColumns: PlusColumnList = [
    {
      label: "仪器编码",
      prop: "code",
    },
    {
      label: "仪器名称",
      prop: "name",
    },
    {
      label: "出厂编号",
      prop: "productserial_no",
    },
    {
      label: "仪器型号",
      prop: "inst_type_no",
    },
    {
      label: "仪器品牌",
      prop: "brand",
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
    code: [
      {
        required: true,
        message: "请输入仪器编码",
      },
    ],
    name: [
      {
        required: true,
        message: "请输入仪器名称",
      },
    ],
    productserial_no: [
      {
        required: true,
        message: "请输入出厂编号",
      },
    ],
    inst_type_no: [
      {
        required: true,
        message: "请输入仪器型号",
      },
    ],
    brand: [
      {
        required: true,
        message: "请输入仪器品牌",
      },
    ],
  };

  // 新增弹窗开关
  const addVisible = ref(false);
  return {
    pagination,
    formData,
    searchColumns,
    columns,
    addFormData,
    addFormColumns,
    addFormRules,
    addVisible,
  };
}
