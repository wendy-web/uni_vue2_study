/*  此hooks-红牛成品检验和战马成品检验都使用 */
import { ElImage } from "element-plus";
import dayjs from "dayjs";
import { getInspMapApi } from "@/api/quality/common";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useProductGroupedHooks } from "@/hooks/quality/finishedProduct";
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";
import batchDetailVue from "@/views/quality/finished-product/redbull/components/batchDetail.vue";

/**  此hooks-红牛成品检验和战马成品检验都使用 */
export function useAdd() {
  const { groupsData, updateGroupsWithNewData, formatTable } = useProductGroupedHooks();

  const useSetting = useSettingsStoreHook();
  const { getBrandMap, getUserList, getStatusText, passList, getSkuMap, skuList } = useselectData();

  /**  顶部基础表单的数据 */
  const baseForm = ref({
    order_no: "", //单据编号-保存剔除
    // 状态；0：暂存；1：待审核；2：已审核；3：已驳回；4：已撤回；5：已反审；
    order_status: "", //单据状态-保存剔除
    ct_name: "", //制单人-保存剔除
    create_time: "", //创建时间-保存剔除
    lineName: "", //线别名称组合-保存剔除

    pro_date: "", //生产日期
    check_date: "", //检测日期
    inspection_basis_id: undefined as FormNumType, //检测依据id
    brand: "ND2", // 产品大类(产品品牌)
    report_uid: undefined as FormNumType, //报告人id
    report_user_signature: "", //报告人的签名图片
    reviewer_user_signature: "", //复核员签名图片
    note: "", //备注
  });

  /** 1是新建,2是编辑 3是详情 */
  const pageType = ref(1);
  const isDetailDisable = computed(() => {
    return pageType.value === 3;
  });

  const tableForm = reactive({
    tableData: [] as any[],
  });

  const { tableData } = toRefs(tableForm);
  /** 表格数据大于0 */
  const isDisabled = computed(() => {
    return tableData.value.length > 0;
  });

  /** 顶部基础表单的数据的配置 */
  const baseColumns: PlusColumnList = [
    {
      label: "单据编号",
      prop: "order_no",
      valueType: "text",
      hideInForm: computed(() => pageType.value === 1),
    },
    {
      label: "单据状态",
      prop: "order_status",
      valueType: "text",
      hideInForm: computed(() => pageType.value === 1),
    },
    {
      label: "制单人",
      prop: "ct_name",
      valueType: "text",
      hideInForm: computed(() => pageType.value === 1),
    },
    {
      label: "创建时间",
      prop: "create_time",
      valueType: "text",
      hideInForm: computed(() => pageType.value === 1),
    },

    {
      label: "生产日期",
      prop: "pro_date",
      valueType: "date-picker",
      fieldProps: {
        type: "date",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        disabledDate: (date: string) => {
          return dayjs().isBefore(date);
        },
      },
    },
    {
      label: "检测日期",
      prop: "check_date",
      valueType: "date-picker",
      fieldProps: {
        type: "date",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        disabledDate: (date: string) => {
          return dayjs().isBefore(date);
        },
      },
    },
    {
      label: "检测依据",
      prop: "inspection_basis_id",
      valueType: "select",
      options: async () => {
        const reuslt = await getInspMapApi({ is_open: 1 });
        return reuslt.data.map((item: any) => {
          return { label: item.name, value: item.id };
        });
      },
    },

    {
      label: "产品大类",
      prop: "brand",
      valueType: "select",
      options: getBrandMap,
      fieldProps: {
        disabled: true,
      },
    },
    {
      label: "线别",
      prop: "lineName",
      fieldProps: {
        placeholder: "自动获取",
        disabled: true,
      },
    },
    {
      label: "检验员",
      prop: "report_uid",
      valueType: "select",
      options: getUserList,
    },
    {
      label: "检验员签名图片",
      prop: "report_user_signature",
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
    {
      label: "复核员签名图片",
      prop: "reviewer_user_signature",
      labelWidth: 120,
      hideInForm: computed(() => pageType.value !== 3),
      renderField: (value) => {
        let list = value ? (value as string).split(",").map((el) => useSetting.baseHttp + el) : [];
        return (
          <>
            {list.length > 0 ? (
              list.map((item, index) => {
                return (
                  <ElImage
                    style="width: 60px; height: 60px;margin-right:8px;"
                    src={item}
                    preview-src-list={list}
                    initial-index={index}
                  />
                );
              })
            ) : (
              <span class="text-gray-400">暂无~</span>
            )}
          </>
        );
      },
    },
    {
      label: "备注",
      prop: "note",
      colProps: {
        span: 24,
      },
    },
  ];

  /** 基础信息表单验证规则 */
  const baseRules = {
    pro_date: [
      {
        required: true,
        message: "请选择生产日期",
      },
    ],
    check_date: [
      {
        required: true,
        message: "请选择检测日期",
      },
    ],
    inspection_basis_id: [
      {
        required: true,
        message: "请选择检测依据",
      },
    ],
  };

  const tableColumns: TableColumnList = [
    {
      label: "勾选列",
      type: "selection",
      hide: () => isDetailDisable.value,
    },
    {
      label: "#",
      type: "index",
      width: 70,
    },
    {
      label: "批次",
      prop: "batch_no",
    },
    {
      label: "批号",
      prop: "joint_batch_number",
      slot: "joint_batch_number",
    },
    {
      label: "线别",
      prop: "line",
    },
    {
      label: "产品类型",
      prop: "sku",
      cellRenderer: ({ row }) => {
        return skuList.value.find((el) => el.value === row.sku)?.label || "";
      },
    },
  ];

  const fileData = ref<any[]>([]);
  const logList = ref<any[]>([]);

  // function setLineName() {
  //   // 一个批次只会有一个线别, 且table已经按线别排好序了
  //   let uniqueItems: any[] = [];
  //   tableData.value.forEach((item) => {
  //     if (!uniqueItems.some((subItem) => subItem["line_id"] === item["line_id"])) {
  //       uniqueItems.push({
  //         line: item.line,
  //         line_id: item.line_id,
  //       });
  //     }
  //   });
  //   baseForm.value.lineName = tableData.value.map((item) => item.line).join(",");
  // }

  /** 转换batch_info字段数据格式为接口需要的格式 */
  function formatSendBatchList() {
    // 需要的数据格式 示例
    // batch_info = [
    //   {
    //     id: 0, //明细id,编辑需要,新建无需
    //     batch_no: "", //批次
    //     sku: "", //
    //     line_id: 0, //产线id
    //     line: "", //产线名称
    //     batch_detail: [
    //       {
    //         id: 0, // 记录id,编辑需要,新建无需
    //         batch_no: "", //批次
    //         sku: "", //
    //         line_id: 0, //产线id
    //         line: "", //产线名称
    //         batch_number: "", //批号
    //         check_detail_id: 0, // 微生物检验记录明细id
    //         check_order_id: 0, //微生物检验单id
    //         check_res: "", //检验结果
    //       },
    //     ],
    //   },
    // ];
    let arr = tableData.value.map((item) => {
      let { batch_no, id, sku, line_id, line } = item;
      let batch_detail = groupsData.value[item.batch_no].map((el) => {
        let { id } = el;
        let elObj = {
          batch_no: el.batch_no,
          sku: el.sku,
          line_id: el.line_id,
          line: el.line,
          batch_number: el.batch_number,
          check_detail_id: el.check_detail_id,
          check_order_id: el.check_order_id,
          check_res: el.check_res,
          phys_net_val: el.phys_net_val,
          phys_internal_pressure_val: el.phys_internal_pressure_val,
          ph_val: el.ph_val,
          soluble_solids_val: el.soluble_solids_val,
        };
        return id ? { id, ...elObj } : elObj;
      });
      let itemObj = {
        batch_no: batch_no,
        sku,
        line_id,
        line,
        batch_detail: batch_detail,
      };
      return id ? { id, ...itemObj } : itemObj;
    });
    return arr;
  }

  /** 表格鼠标移入事件 */
  function cellMouseEnter(row: any, column: any, cell: HTMLTableCellElement, event: Event) {
    if (column.property === "joint_batch_number") {
      cell.classList.add("cursor-pointer");
    }
  }

  /** 表格鼠标移出事件 */
  function cellMouseLeave(row: any, column: any, cell: HTMLTableCellElement, event: Event) {
    if (column.property === "joint_batch_number") {
      cell.classList.remove("cursor-pointer");
    }
  }

  const batchDetailRef = ref();
  /** 表格点击单元格事件 */
  function cellClick(row: any, column: any, cell: HTMLTableCellElement, event: Event) {
    if (column.property === "joint_batch_number") {
      if (isDetailDisable.value) return;
      let batch_no = row.batch_no;
      let groupsList = groupsData.value[batch_no] || [];
      addDialog({
        width: "60%",
        btnClass: "w-[80px]",
        draggable: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        btnLoading: false,
        showClose: false,
        title: "批号信息详情",
        contentRenderer: () =>
          h(batchDetailVue, { ref: batchDetailRef, list: groupsList, skuList: skuList.value }),
        beforeCancel: (done) => {
          done();
        },
        beforeSure: async (done) => {
          // updateDialog(true, "btnLoading");
          console.log("batchDetailRef.value.tableData", batchDetailRef.value.tableData);
          if (!batchDetailRef.value.tableData.length) {
            // 如果该批号没有数据，则删除该批号
            delete groupsData.value[batch_no];
          } else {
            groupsData.value[batch_no] = batchDetailRef.value.tableData;
          }
          console.log("🚀 ~ beforeSure: ~ groupsData.value:", groupsData.value);
          tableData.value = formatTable(groupsData.value);
          // updateDialog(false, "btnLoading");
          done();
        },
      });
    }
  }

  return {
    baseForm,
    baseColumns,
    baseRules,
    fileData,
    logList,
    tableForm,
    tableData,
    tableColumns,
    pageType,
    getStatusText,
    isDetailDisable,
    useSetting,
    passList,
    getSkuMap,
    skuList,
    groupsData,
    updateGroupsWithNewData,
    formatTable,
    formatSendBatchList,
    cellMouseEnter,
    cellMouseLeave,
    cellClick,
  };
}
