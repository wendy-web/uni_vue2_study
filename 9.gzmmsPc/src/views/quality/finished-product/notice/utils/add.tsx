import { ElImage } from "element-plus";
import dayjs from "dayjs";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useProductGroupedHooks } from "@/hooks/quality/finishedProduct";
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";
import batchDetailVue from "../components/batchDetail.vue";

/** 根据批号分组的分组数据的类型key-value */
export type GroupedPacks = {
  [groupName: string]: GroupedList[];
};

/** 定义连续性报告的数据 */
export type ContinuityResult = {
  [groupName: string]: string;
};

/** 根据批号分组数据类型的value类型 */
export type GroupedList = {
  unique_id: string;
  batch_no: string; //批次
  batch_number: string; //批号
  line: string; //线别名称
  line_id: number; //线别id
  product_detail_id: number; //红牛/战马成品检验记录明细id
  product_order_id: number; // 红牛/战马成品检验单id
  sku: string; // 产品类型
  check_res: number; //检验结果
  type: number; //成品检验单据类型；0：红牛成品；1：战马成品
  id?: number; // 记录id 编辑时存在
  batch_info_id?: number; //批次明细id,编辑时存在
};

export function useAdd() {
  const useSetting = useSettingsStoreHook();
  const { getSkuMap, getUserList, getStatusText, passList, skuList } = useselectData();
  const { lineOptions } = useProductGroupedHooks();

  /**  顶部基础表单的数据 */
  const baseForm = ref({
    order_no: "", //单据编号-保存剔除
    // 状态；0：暂存；1：待审核；2：已审核；3：已驳回；4：已撤回；5：已反审；
    order_status: "", //单据状态-保存剔除
    ct_name: "", //制单人-保存剔除
    create_time: "", //创建时间-保存剔除

    check_date: "", //日期
    check_time: "", //通知时间
    report_uid: undefined as FormNumType, //报告人id
    lineName: "", //线别名称组合
    report_user_signature: "", //报告人的签名图片
    reviewer_user_signature: "", //复核员签名图片
    note: "", //备注
  });

  /** 1是新建,2是编辑 3是详情 */
  const pageType = ref(1);
  const isDetailDisable = computed(() => {
    return pageType.value === 3;
  });

  const tableData = ref<any[]>([]);

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
      label: "日期",
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
      label: "时间",
      prop: "check_time",
      valueType: "time-picker",
      fieldProps: {
        format: "HH:mm",
        valueFormat: "HH:mm",
      },
    },
    {
      label: "报告人",
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
    check_date: [
      {
        required: true,
        message: "请选择日期",
      },
    ],
    check_time: [
      {
        required: true,
        message: "请选择时间",
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
    {
      label: "批数",
      prop: "",
      cellRenderer: ({ row }) => {
        return getBatchNumSum(row.batch_no);
      },
    },
  ];
  function getBatchNumSum(batch_no: string) {
    return groupsData.value[batch_no].length.toString();
  }

  /** 如果是提交则设为true,表示必填 */
  const is_submit = ref(false);

  const fileData = ref<any[]>([]);
  const logList = ref<any[]>([]);

  /** 根据批号分组的一个 对象分组数组 */
  const groupsData = ref<GroupedPacks>({});

  function updateGroupsWithNewData(newData: any[], data: GroupedPacks) {
    // 遍历新数据
    newData.forEach((item) => {
      let { batch_no, ...rest } = item;
      // 如果分组中已有该batch_no，则在对应数组中追加数据并排序
      if (data.hasOwnProperty(batch_no)) {
        data[batch_no].push({
          batch_no,
          ...rest,
        });
      } else {
        // 否则，创建新的分组
        data[batch_no] = [{ batch_no, ...rest }];
      }
    });
  }

  function getLineSort(str: string) {
    return lineOptions.find((item) => str === item.label)?.value || 0;
  }

  /** 获取分组连续性数值和不连续性数值 */
  function formatGroupsPackNo(groups: GroupedPacks) {
    const result: ContinuityResult = {};

    Object.entries(groups).forEach(([groupName, groupPacks]) => {
      if (groupPacks.length) {
        groupPacks.sort(
          (a, b) =>
            parseInt(a.batch_number.slice(0, 3), 10) - parseInt(b.batch_number.slice(0, 3), 10),
        );

        let formattedRange: string[] = [];
        let currentRangeStart = groupPacks[0].batch_number;
        let previousPackNo = groupPacks[0].batch_number;

        groupPacks.slice(1).forEach((pack) => {
          const currentPackNo = pack.batch_number;
          const currentPackNoPrefix = currentPackNo.slice(0, 3);
          const previousPackNoPrefix = previousPackNo.slice(0, 3);

          if (parseInt(currentPackNoPrefix, 10) === parseInt(previousPackNoPrefix, 10) + 1) {
            // 连续，更新当前范围的结束点（这里其实不需要更新currentRangeStart，因为我们关心的是连续性）
          } else {
            // 非连续，检查并添加前一个范围到结果数组
            if (currentRangeStart !== previousPackNo) {
              formattedRange.push(
                currentRangeStart !== previousPackNo
                  ? `${currentRangeStart}-${previousPackNo}`
                  : currentRangeStart,
              );
            }
            // 开始新的范围
            currentRangeStart = currentPackNo;
          }
          previousPackNo = currentPackNo;
        });

        // 处理最后一个元素，无论是否连续，都应添加到结果中
        if (currentRangeStart !== previousPackNo) {
          formattedRange.push(
            currentRangeStart !== previousPackNo
              ? `${currentRangeStart}-${previousPackNo}`
              : currentRangeStart,
          );
        } else if (!formattedRange.includes(currentRangeStart)) {
          // 防止重复添加最后一个元素
          formattedRange.push(currentRangeStart);
        }

        // 转换为逗号分隔的字符串，但移除末尾可能的逗号
        result[groupName] = formattedRange.join(", ").replace(/,\s*$/, "");
      }
    });

    return result;
  }

  /** 根据groupsData数据格式化tableData表格数据 */
  function formatTable(data: GroupedPacks) {
    // 获取分组连续性数值和不连续性数值
    let packNoList = formatGroupsPackNo(data);
    const arr = Object.keys(data).map((key) => {
      if (data[key].length > 0) {
        let item = data[key][0];
        // 对于每个key，只取其对应的数组中的第一个元素作为代表
        let itemObj = {
          batch_no: item.batch_no,
          joint_batch_number: packNoList[key],
          line: item.line,
          sku: item.sku,
          line_id: item.line_id,
        };
        // 如果batch_info_id存在，则返回包含batch_info_id的itemObj,且batch_info_id设为id，否则返回itemObj
        return item.batch_info_id ? { id: item.batch_info_id, ...itemObj } : itemObj;
      } else {
        return {
          batch_no: "",
          joint_batch_number: "",
          line: "",
          sku: "",
          line_id: 0,
        };
      }
    });

    arr.sort((a, b) => {
      return getLineSort(a.line) - getLineSort(b.line);
    });

    return arr;
  }

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
    //         product_detail_id: 0, // 微生物检验记录明细id
    //         product_order_id: 0, //微生物检验单id
    //         check_res: "", //检验结果
    //         type : 0, 成品检验单据类型；0：红牛成品；1：战马成品
    //         unique_id: "", //
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
          product_detail_id: el.product_detail_id,
          product_order_id: el.product_order_id,
          check_res: el.check_res,
          type: el.type,
          unique_id: el.unique_id,
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
    tableData,
    tableColumns,
    pageType,
    is_submit,
    getStatusText,
    isDetailDisable,
    useSetting,
    skuList,
    getSkuMap,
    groupsData,
    formatTable,
    updateGroupsWithNewData,
    cellMouseEnter,
    cellMouseLeave,
    cellClick,
    formatSendBatchList
  };
}
