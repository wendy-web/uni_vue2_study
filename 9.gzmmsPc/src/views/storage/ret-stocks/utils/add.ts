import type { FormInstance, FormRules } from "element-plus";
import { ElSelect } from "element-plus";

export type ElSelectType = InstanceType<typeof ElSelect>;
export type GoodsListType = {
  id?: number;
  title: string;
  /** 使用地点 */
  use_place_id?: number;
  barcode: string;
  spec: string;
  brand: string;
  measure_name: string;
  class_name: string;
  /** 退货数量 */
  ret_num: string;
  sup_name: string;
  /** 换下日期 */
  replace_time?: string;
  note?: string;
  goods_id: number;
  /** 可用状态 */
  available_status?: number;
};
export function useAdd() {
  const rules = reactive<FormRules>({
    warehouse_id: [
      {
        required: true,
        message: "请选择退入仓库",
        trigger: "change",
      },
    ],
    title: [
      {
        required: true,
        message: "请选择名称",
        trigger: "change",
      },
    ],
    num: [
      {
        required: true,
        message: "请输入数量",
        trigger: "blur",
      },
    ],
  });

  // 地点级联选择器的配置
  const selectProps = {
    // 显示方式
    expandTrigger: "hover" as const,
    emitPath: false,
    value: "id",
    label: "place_name",
    children: "children",
    multiple: false,
  };

  const statusOptions = [
    {
      label: "报废",
      value: 0,
    },
    {
      label: "待修",
      value: 1,
    },
    {
      label: "可用",
      value: 2,
    },
  ];

  function getAvailableName(status: number) {
    return statusOptions.find((item) => item.value === status)?.label || "";
  }

  return {
    rules,
    selectProps,
    statusOptions,
    ElSelect,
    getAvailableName
  };
}
