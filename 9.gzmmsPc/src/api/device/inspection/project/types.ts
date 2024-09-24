/** 点巡检标准-列表接口返回的数据类型 */
export interface InspectionProjectList {
  list: InspectionProjectItem[];
  total: number;
  page: string;
  size: string;
}
export interface InspectionProjectItem {
  id: number;
  inspect_items_name: string;
  equipment_type_id: number;
  equipment_type_title: string;
  inspect_purpose: string;
  note?: any;
  up_uid?: any;
  ct_uid: number;
  ct_name: string;
  update_time: string;
  create_time: string;
  inspect_item_num: number;
}

export interface InspectionProjectDetailArr {
  id: number;
  inspect_id: string;
  method: string;
  std_explain: string;
  item_content: string;
  note: string;
  record_method: number;
  record_content?: any;
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
  record_content_item?: any;
  result_item: string;
}

export interface  InspectionProjectDetail{
  id: number;
  inspect_items_name: string;
  equipment_type_id: number;
  equipment_type_title: string;
  inspect_purpose: string;
  note?: any;
  up_uid?: any;
  ct_uid: number;
  ct_name: string;
  update_time: string;
  create_time: string;
  item_arr: InspectionProjectDetailArr[];
}
