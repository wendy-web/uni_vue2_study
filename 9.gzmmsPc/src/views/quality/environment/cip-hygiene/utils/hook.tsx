import { ElButton, ElSelect, ElTag } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import dayjs from "dayjs";
import { withKeys } from "vue";
import { useRouter } from "vue-router";
import { addDialog } from "@/components/ReDialog";
import { useselectData } from "@/hooks/quality/selectData";
import checkContentVue from "@/views/quality/environment/components/checkOrder/checkContent.vue";

export function useList(search: () => void) {
  const router = useRouter();
  const { getLineList, getUserList } = useselectData();

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
    line_id: undefined as FormNumType, //线别id
    status: undefined as FormNumType, //状态
    ct_uid: undefined as FormNumType, //制单人
    create_time: "", //创建日期
    check_date: "", //检查日期
  });

  /** 签字复核/反审核,都是进入详情页面 */
  function cellDetail(row: any) {
    router.push({
      path: "/quality/environment/cip-hygiene/add",
      query: {
        id: row.id,
        pageType: 3,
      },
    });
  }

  function handleLook(row: any) {
    if (!row.normal_count && !row.abnormal_count && !row.nocheck_count) {
      return;
    }
    let list = row.group;
    addDialog({
      width: "60%",
      btnClass: "w-[80px]",
      draggable: true,
      title: "检查内容",
      showCancel: false,
      confirmText: "关闭",
      contentRenderer: () =>
        h(checkContentVue, {
          list,
        }),
      beforeCancel: (done) => {
        done();
      },
      beforeSure: (done) => {
        done();
      },
    });
  }
  // 单据状态 0 待检 1 检查中 2 待提交 3 已完成
  const statusOptions = [
    {
      label: "待检",
      value: 0,
    },
    {
      label: "检查中",
      value: 1,
    },
    {
      label: "待提交",
      value: 2,
    },
    {
      label: "已完成",
      value: 3,
    },
  ];

  function getTagType(status: number) {
    switch (status) {
      case 0:
        return "info";
      case 1:
        return "";
      case 2:
        return "warning";
      case 3:
        return "success";
      default:
        return "info";
    }
  }

  /** 搜索配置项 */
  const searchColumns: PlusColumnList = [
    {
      label: "单据编号",
      prop: "order_no",
      onKeyup: withKeys(() => {
        search();
      }, ["enter"]),
    },
    {
      label: "线别",
      prop: "line_id",
      valueType: "select",
      options: getLineList,
      fieldProps: {
        onChange: () => {
          search();
        },
      },
    },
    {
      label: "单据状态",
      prop: "status",
      valueType: "select",
      options: statusOptions,
      fieldProps: {
        onChange: () => {
          search();
        },
      },
    },
    {
      label: "制单人",
      prop: "ct_uid",
      valueType: "select",
      options: getUserList,
      fieldProps: {
        filterable: true,
        onChange: () => {
          search();
        },
      },
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
        onChange: () => {
          search();
        },
      },
    },
    {
      label: "创建日期",
      prop: "create_time",
      valueType: "date-picker",
      fieldProps: {
        placeholder: "请选择日期",
        type: "daterange",
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        onChange: () => {
          search();
        },
      },
    },
  ];

  /** 表格列配置 */
  const columns: TableColumnList = [
    {
      type: "selection",
      width: 60,
      label: "勾选列",
      fixed: "left",
      reserveSelection: true,
      selectable: (row: any) => {
        return row.status === 3;
      },
    },
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
      label: "线别",
      prop: "line_name",
      align: "center",
    },
    {
      label: "检查内容进度",
      prop: "brand_name",
      align: "center",
      cellRenderer: ({ row }) => {
        return (
          <>
            <ul class="flex items-center justify-center">
              <li class="text-green-500">
                <span>正常</span>
                <span>({row.normal_count})</span>
              </li>
              <li class={row.abnormal_count > 0 ? "text-red-500" : ""}>
                <span>异常</span>
                <span>({row.abnormal_count})</span>
              </li>
              <li class={row.nocheck_count > 0 ? "text-red-500" : ""}>
                <span>未检</span>
                <span>({row.nocheck_count})</span>
              </li>
              {!row.normal_count && !row.abnormal_count && !row.nocheck_count ? null : (
                <li>
                  <ElButton
                    link
                    type="primary"
                    class="ml-2 underline underline-offset-2"
                    onClick={() => handleLook(row)}
                  >
                    查看
                  </ElButton>
                </li>
              )}
            </ul>
          </>
        );
      },
    },
    {
      label: "单据状态",
      prop: "status",
      align: "center",
      cellRenderer: ({ row }) => (
        <>
          <ElTag type={getTagType(row.status)}>{row.status_text}</ElTag>
        </>
      ),
    },
    {
      label: "备注",
      prop: "note",
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
      align: "center",
    },
  ];

  // 新增弹窗的数据
  const addFormData = ref({
    line_id: undefined as FormNumType,
    line_name: "", //线别名称
    check_date: dayjs().format("YYYY-MM-DD"),
    note: "",
  });

  const selectLineRef = ref<InstanceType<typeof ElSelect>>();

  // 新增弹窗的表单项;
  const addFormColumns: PlusColumnList = [
    {
      label: "检测日期",
      prop: "check_date",
      valueType: "date-picker",
      fieldProps: {
        clearable: false,
        type: "date",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        disabledDate: (date: string) => {
          return dayjs().isBefore(date);
        },
      },
    },
    {
      label: "线别",
      prop: "line_id",
      valueType: "select",
      fieldProps: {
        ref: (instance: InstanceType<typeof ElSelect>) => {
          selectLineRef.value = instance;
        },
        onChange(value: number) {
          nextTick(() => {
            addFormData.value.line_name = selectLineRef.value?.selected.currentLabel;
          });
        },
      },
      options: getLineList,
    },
    {
      label: "备注",
      prop: "note",
    },
  ];

  // 新增弹窗的验证规则;
  const addFormRules = {
    check_date: [
      {
        required: true,
        message: "请选择检测日期",
        trigger: "change",
      },
    ],
    line_id: [
      {
        required: true,
        message: "请选择线别",
        trigger: "change",
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
    addFormColumns,
    addVisible,
    addFormRules,
    addLoading,
  };
}
