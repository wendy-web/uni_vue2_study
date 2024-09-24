/** 环境检测-检查表配置-列表类型 */
export interface CheckConfigListType {
  id: number;
  type: number;
  name: string;
  note: string;
  up_uid: number;
  ct_uid: number;
  ct_name: string;
  update_time: string;
  create_time: string;
  group: ListGroupType[];
}

export interface ListGroupType {
  id: number;
  p_id: number;
  name: string;
  std_explain: string;
  note: string;
  up_uid: number;
  ct_uid: number;
  ct_name: string;
  update_time: string;
  create_time: string;
  item: ListGroupItemType[];
  item_count: number;
}
export interface ListGroupItemType {
  id: number;
  group_id: number;
  item_content: string;
  method: string;
  std_explain: string;
  record_method: number;
  normal_val: string;
  abnormal_val: string;
  default_val: string;
  upper_limit_val: string;
  lower_limit_val: string;
  up_uid: number;
  ct_uid: number;
  ct_name: string;
  update_time: string;
  create_time: string;
}
