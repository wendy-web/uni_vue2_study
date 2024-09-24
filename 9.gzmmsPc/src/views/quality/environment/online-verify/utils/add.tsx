import { ElImage } from "element-plus";
import { useSettingsStoreHook } from "@/store/modules/settings";

export function useAdd() {
  const useSetting = useSettingsStoreHook();

  /**  顶部基础表单的数据 */
  const baseForm = ref({
    order_no: "", //单据编号
    ct_name: "", //制单人
    create_time: "", //创建时间
    line_name: "", //线别名称
    class_name: "", //班次名称
    check_date: "", //检测日期
    note: "", //备注

    sign: "", //确认签名
    status_text: "", //单据状态文字
  });

  /** 1是新建,2是编辑 3是详情 */
  const pageType = ref(2);

  const isDetailDisable = computed(() => {
    return pageType.value === 3;
  });

  /** 顶部基础表单的数据的配置 */
  const baseColumns: PlusColumnList = [
    {
      label: "单据编号",
      prop: "order_no",
      fieldProps: {
        disabled: true,
      },
    },
    {
      label: "单据状态",
      prop: "status_text",
      fieldProps: {
        placeholder: "",
        disabled: true,
      },
    },
    {
      label: "制单人",
      prop: "ct_name",
      fieldProps: {
        disabled: true,
      },
    },
    {
      label: "创建时间",
      prop: "create_time",
      fieldProps: {
        disabled: true,
      },
    },

    {
      label: "线别",
      prop: "line_name",
      fieldProps: {
        disabled: true,
      },
    },
    {
      label: "班次",
      prop: "class_name",
      fieldProps: {
        disabled: true,
      },
    },
    {
      label: "检测日期",
      prop: "check_date",
      fieldProps: {
        disabled: true,
      },
    },
    {
      label: "确认人签名图片",
      prop: "sign",
      labelWidth: 120,
      hideInForm: computed(() => pageType.value !== 3),
      renderField: (value) => (
        <>
          {value ? (
            <ElImage
              style="width: 60px; height: 60px"
              src={useSetting.baseHttp + value}
              preview-src-list={[useSetting.baseHttp + value]}
            />
          ) : (
            <span class="text-gray-400">暂无~</span>
          )}
        </>
      ),
    },
  ];
  /** 检查信息表格columns */
  const tableColumns: TableColumnList = [
    {
      label: "操作",
      align: "center",
      slot: "operation",
    },
    {
      label: "检查内容组名",
      prop: "name",
      align: "center",
    },
    {
      label: "检查目的",
      prop: "std_explain",
      align: "center",
    },
    {
      label: "备注",
      prop: "note",
      align: "center",
    },
    {
      label: "检查项总数",
      cellRenderer: ({ row }) => {
        return row.item.length + "项";
      },
      align: "center",
    },
    {
      label: "检查情况",
      prop: "note",
      align: "center",
    },
    {
      label: "检查人",
      prop: "note",
      align: "center",
    },
    {
      label: "检查时间",
      prop: "note",
      align: "center",
    },
  ];

  return {
    baseForm,
    baseColumns,
    pageType,
    isDetailDisable,
    tableColumns,
  };
}
