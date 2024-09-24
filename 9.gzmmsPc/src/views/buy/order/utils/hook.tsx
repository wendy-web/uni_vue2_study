import { Refresh } from "@element-plus/icons-vue";
import { ElButton, ElIcon, ElTooltip } from "element-plus";
import { type PaginationProps } from "@pureadmin/table";
import { useSearchFrom } from "@/hooks/searchForm";
import "./input_icon.scss";

type userParams = {
  formData?: Ref;
  selectSubmitDate?: (val: string) => void;
  selectDate?: (val: string) => void;
  immediateDebounce?: (val: string) => void;
};

export function useOrderList(params: userParams = {}) {
  const columns: TableColumnList = [
    {
      label: "采购单号",
      prop: "procure_no",
      width: 160,
      align: "center",
    },
    {
      label: "商品明细",
      prop: "product_name",
      // width: 200,
      align: "center",
      showOverflowTooltip: true,
    },
    {
      label: "分类",
      prop: "product_class",
      width: 90,
      align: "center",
    },
    {
      label: "采购数量",
      prop: "all_num",
      width: 90,
      align: "center",
    },
    {
      label: "待入数量",
      prop: "total_rem_num",
      width: 90,
      align: "center",
    },
    {
      label: "入库数量",
      prop: "total_rec_num",
      width: 90,
      align: "center",
    },
    {
      label: "退货数量",
      prop: "total_ret_num",
      width: 90,
      align: "center",
    },
    {
      label: "采购类型",
      prop: "type",
      width: 90,
      align: "center",
      cellRenderer: (scope) => (
        <>{scope.row.type === 1 ? <span>普通采购</span> : <span>退换补货</span>}</>
      ),
    },
    {
      label: "采购金额",
      prop: "all_price",
      width: 90,
      align: "center",
    },
    {
      label: "需求月份",
      prop: "demand_date",
      width: 90,
      align: "center",
    },
    {
      label: "需求部门",
      prop: "demand_depts",
      width: 120,
      align: "center",
      showOverflowTooltip: true,
    },
    {
      label: "采购事由",
      prop: "purpose",
      width: 90,
      align: "center",
      showOverflowTooltip: true,
    },
    {
      label: "单据备注",
      prop: "note",
      width: 200,
      align: "center",
      showOverflowTooltip: true,
      cellRenderer: (scope) => (
        <span>{scope.row.note || "-"}</span>
        // <el-switch
        //   size={scope.props.size === "small" ? "small" : "default"}
        //   v-model={scope.row.status}
        //   active-value={1}
        //   inactive-value={0}
        //   active-text="已启用"
        //   inactive-text="已停用"
        //   inline-prompt
        // />
      ),
    },
    {
      label: "制单人",
      prop: "ct_name",
      align: "center",
      minWidth: 90,
    },
    {
      label: "创建时间",
      width: 180,
      prop: "create_time",
      align: "center",
    },
    // {
    //   label: "状态",
    //   width: 100,
    //   prop: "status",
    //   align: "center",
    //   cellRenderer: ({ row, $index }) => (
    //     <>
    //       {row.status == 0 ? <el-tag>待提审</el-tag> : null}
    //       {row.status == 1 ? (
    //         <el-tag effect="plain" onClick={tagClick}>
    //           待审核
    //         </el-tag>
    //       ) : null}
    //       {row.status == 2 ? <el-tag effect="dark">待入库</el-tag> : null}
    //       {row.status == 3 ? <el-tag type="success">已完成</el-tag> : null}
    //       {row.status == 4 ? <el-tag type="info">已撤回</el-tag> : null}
    //       {row.status == 5 ? <el-tag type="warning">已驳回</el-tag> : null}
    //       {row.status == 6 ? <el-tag type="danger">已作废</el-tag> : null}
    //     </>
    //   ),
    // },
    {
      label: "状态",
      width: 100,
      align: "center",
      slot: "status",
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation",
    },
  ];

  const paginationSetup = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
  });

  const options = [
    {
      value: 0,
      label: "待提审",
    },
    {
      value: 1,
      label: "待审核",
    },
    {
      value: 2,
      label: "待入库",
    },
    {
      value: 3,
      label: "已完成",
    },
    {
      value: 4,
      label: "已撤回",
    },
    {
      value: 5,
      label: "已驳回",
    },
    {
      value: 6,
      label: "已作废",
    },
    {
      value: 7,
      label: "已审核",
    },
  ];

  const { classList } = useSearchFrom();

  async function classChange(val: number[]) {
    const list = await classList;
    console.log("🚀 ~ classChange ~ list:", list);
    const class_list = list.filter((item) => val.includes(item.value as number)).map((el) => el.label);
    let formData = params.formData;
    if (formData) {
      formData.value.class_list = class_list;
    }
  }

  const searchColumns: PlusColumnList = [
    {
      label: "关键字",
      prop: "keyword",
      fieldProps: {
        placeholder: "制单人姓名/采购单号",
      },
      tooltip: "请输入制单人姓名或者采购单号",
    },
    {
      label: "商品分类",
      labelWidth: 90,
      prop: "class_ids",
      valueType: "select",
      tooltip: "多选",
      fieldProps: {
        placeholder: "请选择商品分类",
        multiple: true,
        collapseTags: true,
        collapseTagsTooltip: true,
        multipleLimit: 5,
      },
      options: classList,
      onChange: classChange,
    },
    {
      label: "需求月份",
      prop: "demand_date",
      valueType: "date-picker",
      fieldProps: {
        placeholder: "请选择需求月份",
        type: "monthrange",
        startPlaceholder: "开始月份",
        endPlaceholder: "结束月份",
        format: "YYYY-MM",
        valueFormat: "YYYY-MM",
      },
    },
    {
      label: "需求部门",
      prop: "demand_dept_ids",
    },
    {
      label: "状态",
      prop: "status",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择状态",
      },
      options: options,
    },
    {
      label: "创建部门",
      prop: "dept_id",
    },
    {
      label: "创建日期",
      prop: "time",
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

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~下方新建页面使用~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  let { selectSubmitDate, selectDate, immediateDebounce } = params;

  const inputStep = ref(false);

  const formColumns: PlusColumnList = [
    {
      label: "需求月份",
      width: 120,
      prop: "demand_date",
      valueType: "date-picker",
      fieldProps: {
        type: "month",
        placeholder: "请选择需求月份",
        format: "YYYY-MM",
        valueFormat: "YYYY-MM",
      },
    },
    {
      label: "需求部门",
      prop: "dept_id",
      tooltip: "如下方列表已存在货品,选择此项后,下方列表的需求部门会统一设置成此项",
    },
    {
      label: "供应商",
      prop: "sup_name",
      tooltip: "如下方列表已存在货品,选择此项后,下方列表的供应商会统一设置成此项",
    },
    {
      label: "提交日期",
      prop: "submit_time",
      valueType: "date-picker",
      tooltip: "如下方列表已存在货品,选择此项后,下方列表的提交日期会统一设置成此项",
      fieldProps: {
        type: "date",
        placeholder: "请选择日期",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        clearable: false,
        onChange: selectSubmitDate,
      },
    },
    {
      label: "交货日期",
      prop: "delivery_time",
      valueType: "date-picker",
      tooltip: "如下方列表已存在货品,选择此项后,下方列表的交货日期会统一设置成此项",
      fieldProps: {
        type: "date",
        placeholder: "请选择日期",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        onChange: selectDate,
      },
    },
    {
      label: "合同编号",
      prop: "contract_no",
      tooltip: "如下方列表已存在货品,点击右侧同步按钮后,下方列表的合同编号会统一设置成此项",
      fieldProps: {
        placeholder: "请输入合同编号",
      },
      fieldSlots: {
        append: () => {
          return (
            <>
              <ElTooltip effect="dark" content="点击同步到下方表格" placement="top-start">
                <ElButton link type="primary" onClick={immediateDebounce}>
                  <ElIcon slot="icon" class={[inputStep.value ? "step-icon" : ""]}>
                    <Refresh />
                  </ElIcon>
                </ElButton>
              </ElTooltip>
            </>
          );
        },
      },
    },
  ];

  return {
    columns,
    paginationSetup,
    formColumns,
    inputStep,
    searchColumns,
  };
}
