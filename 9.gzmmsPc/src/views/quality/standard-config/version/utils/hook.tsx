import { ElSwitch, ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
import { changeStatusApi } from "@/api/quality/standard-config/version/index";
import { perms } from "@/utils/auth";

export function useList(search: () => void) {
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
    version_no: "", // 版本号
    name: "", // 版本名
  });

  async function changeOpen(data: any) {
    let result = await changeStatusApi(data);
    ElMessage.success(result.msg);
  }

  /** 表格列配置 */
  const columns: TableColumnList = [
    {
      label: "版本号",
      prop: "version_no",
      align: "center",
    },
    {
      label: "版本名称",
      prop: "name",
      align: "center",
    },
    {
      label: "可用状态",
      prop: "is_open",
      align: "center",
      cellRenderer: ({ row }) => (
        <>
          {perms(["sc:version:open"]) ? (
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
      prop: "ct_name",
      align: "center",
    },
    {
      label: "创建时间",
      prop: "create_time",
      align: "center",
    },
    {
      label: "更新人",
      prop: "up_name",
      align: "center",
    },
    {
      label: "更新时间",
      prop: "up_time",
      align: "center",
    },
    {
      label: "操作",
      slot: "operation",
    },
  ];

  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    {
      label: "版本号",
      prop: "version_no",
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
    },
    {
      label: "版本名",
      prop: "name",
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
    },
  ];

 

  // 新增弹窗的数据
  const addFormData = ref({
    version_no: "", //版本号
    name: "", //版本名
    is_open: 0, //启用/停用
  });
  // 新增弹窗的表单项
  const addFormColumns: PlusColumnList = [
    {
      label: "版本号",
      prop: "version_no",
    },
    {
      label: "版本名",
      prop: "name",
    },
    {
      label: "可用状态",
      prop: "is_open",
      valueType: "switch",
      fieldProps: {
        activeValue: 1,
        inactiveValue: 0,
        inlinePrompt: true,
        activeText: "启用",
        inactiveText: "停用",
      },
    },
  ];
  // 新增弹窗的验证规则
  const addFormRules = {
    version_no: [
      {
        required: true,
        message: "请输入版本号",
      },
    ],
    name: [
      {
        required: true,
        message: "请输入版本名",
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
  };
}
