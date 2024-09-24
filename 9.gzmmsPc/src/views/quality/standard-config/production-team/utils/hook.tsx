import { ElSwitch, ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
import { changeStatusApi } from "@/api/quality/standard-config/productionteam/index";
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
    name: "", // 项目名称
    is_open: "", // 可用状态
  });
  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    {
      label: "生产班组",
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
      hideInForm: true,
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
    try {
      let result = await changeStatusApi(data);
      let { code, msg } = result;
      if (code == 0) {
        ElMessage.error(msg);
        search();
        return;
      }
      ElMessage.success(msg);
    } catch (error) {
      console.log("状态切换失败：", error);
    }
  }
  const columns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      width: 60,
      align: "center",
      hide: true,
    },
    {
      label: "生产班组",
      prop: "name",
      align: "center",
      showOverflowTooltip: true,
    },
    {
      label: "可用状态",
      prop: "is_open",
      align: "center",
      showOverflowTooltip: true,
      cellRenderer: ({ row }) => (
        <>
          {perms(["sc:productionteam:open"]) ? (
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
    name: "", // 生产班组
    is_open: 0, //启用/停用
  });
  // 新增弹窗的表单项
  const addFormColumns: PlusColumnList = [
    {
      label: "生产班组",
      prop: "name",
      labelWidth: 90,
      width: 50,
      fieldProps: {},
    },
    {
      label: "可用状态",
      prop: "is_open",
      labelWidth: 90,
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
    name: [
      {
        required: true,
        message: "请输入生产班组",
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
