/** 点巡检记录列表接口返回的数据类型 */
export interface InspecRecordListType {
  list: InspecRecordItemType[];
  total: number;
  page: string;
  size: string;
}

/** 点巡检记录列表list表格的数据类型 */
export interface InspecRecordItemType {
  id: number;
  status: number;
  point_no: string;
  asset_no: string;
  bar_title: string;
  spec: string;
  equipment_type: string;
  use_dept_id: string;
  use_dept_names: string;
  task_time_start: string;
  task_time_end: string;
  plan_start_time?: any;
  executor_uid: string;
  picture: string[];
  sign: string;
  ct_name?: any;
  create_time: string;
  item_arr: ItemArrType[];
  item_count: ItemCountType;
  status_text: string;
  equipment_type_text: string;
  task_time: string;
  assoc_type: number[];
}

export interface ItemArrType {
  id: number;
  item_id: number;
  item_content: string;
  method: string;
  record_method: number;
  std_explain: string;
  result_content: ResultContentType[];
  upper_limit_val: string;
  lower_limit_val: string;
  default_val: string;
  note?: any;
  ct_uid: number;
  up_uid?: any;
  create_time: string;
  update_time: string;
  val: any;
}

export interface ResultContentType {
  type: number;
  val: string;
  is_check: number;
  is_normal: number;
}

/** 统计 */
export interface ItemCountType {
  pass: number;
  normal: number;
  count: number;
}
/** 详情接口返回的数据类型 */
export interface InspecRecordDetailData {
  id: number;
  status: number;
  equipment_id: number;
  point_no: string;
  asset_no: string;
  bar_title: string;
  barcode: string;
  spec: string;
  equipment_type: string;
  use_dept_id?: any;
  use_dept_names?: any;
  task_time_start: string;
  task_time_end: string;
  plan_start_time: string;
  executor_uid: string;
  picture: string[];
  sign: string;
  ct_name: string;
  create_time: string;
  plan_details_no: string;
  save_addr: string;
  note: string;
  cycle_type: number;
  is_must_pho: number;
  is_must_sig: number;
  item_arr: ItemArrType[];
  item_count: ItemCountType;
  status_text: string;
  equipment_type_text: string;
  task_time: string;
  assoc_type: number[];
  save_addr_text: string;
  executor_user_text: string;
  is_report_rectify: number;
  rectify_uid: number;
  rectify_problem: string;
  rectify_uid_text: string;
  rectify_picture: string[];
  rectify_time: string;
  rectify_feedback: string;
  rectify_status: number;
  rectify_status_text: string;
  rectify_list: any[];
  plant_id: number;
  executive_rule_type: number;
  plan_end_time: string;
}
