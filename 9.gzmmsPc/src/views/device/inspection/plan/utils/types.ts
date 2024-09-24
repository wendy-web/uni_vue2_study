/** 循环列表需要显示的字段 */
export type CycleListType = {
  /** 点巡检标准明细id */
  inspect_item_id: number;
  /** 是否必须拍照；0：不是；1：是；*/
  is_must_pho: number;
  /** 计划执行人id */
  executor_uid: string;
  /** 是否必须签名；0：不是；1：是*/
  is_must_sig: number;
  /** 计划执行时间 */
  plan_start_time: string;

  /** 循环周期名称 */
  cycle_name: string;
  /** 检查项内容 */
  item_content: string;
  /** 检验方法/工具/依据 */
  method: string;
  /** 检查标准说明 */
  std_explain: string;
  /** 记录方式 */
  record_method: number;
  /** 正常值 */
  normal_val: string;
  /** 异常值 */
  abnormal_val: string;
  /** 上限 */
  upper_limit_val: number;
  /** 下限 */
  lower_limit_val: number;
  /** 计划执行人名称 */
  executor_name: string;
  /** 检查项目名 */
  inspect_items_name: string;
  /** 执行时间规则名称 */
  executiveRuleName: string;
  /** 执行时间规则 */
  executive_rule_type: number;
  /** 计划执行结束时间-当执行时间规则为按固定周期时，该字段必填 */
  plan_end_time: string;
};
