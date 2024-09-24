import { ElOption, ElSelect, ElSwitch, ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { withKeys } from "vue";
import { changeStatusApi, editApi } from "@/api/quality/standard-config/inspection/index";
import { perms } from "@/utils/auth";

export function useList(search: () => void) {
  // 标准类型
  const standardOptions = [
    {
      value: 0,
      label: "国家标准",
    },
    {
      value: 1,
      label: "行业标准",
    },
    {
      value: 2,
      label: "客户标准",
    },
    {
      value: 3,
      label: "企业标准",
    },
  ];

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
      label: "检验依据",
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
  async function changeStandard(data: any) {
    let result = await editApi(data);
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
      label: "检验依据",
      prop: "name",
      align: "center",
      showOverflowTooltip: true,
    },
    {
      label: "说明",
      prop: "desp",
      align: "center",
      showOverflowTooltip: true,
      cellRenderer: (scope) => <span>{scope.row.desp || "-"}</span>,
    },
    {
      label: "标准类型",
      prop: "stand_type",
      width: 160,
      align: "center",
      cellRenderer: ({ row }) => (
        <>
          {/* {perms(["sc:inspection:edit"]) ? (
            <ElSelect
              v-model={row.stand_type}
              placeholder="请选择标准"
              onChange={() => changeStandard({ ...row })}
            >
              {standardOptions.map((item) => {
                return <ElOption key={item.value} label={item.label} value={item.value} />;
              })}
            </ElSelect>
          ) : (
            <span></span>
          )} */}
          <ElSelect
            v-model={row.stand_type}
            placeholder="请选择标准"
            onChange={() => changeStandard({ ...row })}
            disabled={!perms(["sc:inspection:edit"])}
          >
            {standardOptions.map((item) => {
              return <ElOption key={item.value} label={item.label} value={item.value} />;
            })}
          </ElSelect>
        </>
      ),
    },
    {
      label: "可用状态",
      prop: "is_open",
      align: "center",
      showOverflowTooltip: true,
      cellRenderer: ({ row }) => (
        <>
          {perms(["sc:inspection:open"]) ? (
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
    name: "", // 检验依据名称
    desp: "", // 说明
    stand_type: "", // 标准类型
    is_open: 0, //启用/停用
  });
  // 新增弹窗的表单项
  const addFormColumns: PlusColumnList = [
    {
      label: "检验依据",
      prop: "name",
    },
    {
      label: "说明",
      prop: "desp",
      valueType: "textarea",
    },
    {
      label: "标准类型",
      prop: "stand_type",
      valueType: "select",
      options: standardOptions,
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
    name: [
      {
        required: true,
        message: "请输入检验依据",
      },
    ],
    stand_type: [
      {
        required: true,
        message: "请选择标准类型",
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
