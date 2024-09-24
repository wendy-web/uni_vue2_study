/** 点巡检计划列表接口返回的数据类型 */
export interface InspectionListType {
  list: InspectionItemType[];
  total: number;
  page: string;
  size: string;
}

/** 点巡检计划列表list表格数据类型 */
export interface InspectionItemType {
  id: number;
  plan_no: string;
  cycle_type: number;
  plan_details_no: string;
  equipment_type_id: number;
  equipment_type_title: string;
  equipment_id: number;
  is_must_pho: number;
  is_must_sig: number;
  plan_start_time: string;
  executor_uid: string;
  last_start_time?: any;
  status: number;
  note?: any;
  up_uid?: any;
  ct_uid: number;
  ct_name: string;
  update_time: string;
  create_time: string;
  asset_no: string;
  bar_title: string;
  barcode: string;
  spec: string;
  brand: string;
  use_dept_id: string;
  save_addr: string;
  director_names: string;
  other_names: string;
  use_dept_names: string;
  overdue_day: number;
  executor_names: string;
  use_places: string;
}

/** 点巡检计划-详情接口返回的数据类型 */
export interface InspecDetailType {
  id: number;
  plan_no: string;
  cycle_type: number;
  plan_details_no: string;
  equipment_type_id: number;
  equipment_type_title: string;
  equipment_id: number;
  is_must_pho: number;
  is_must_sig: number;
  plan_start_time: string;
  executor_uid: string;
  last_start_time?: any;
  status: number;
  note?: any;
  up_uid?: any;
  ct_uid: number;
  ct_name: string;
  update_time: string;
  create_time: string;
  asset_no: string;
  barcode: string;
  bar_title: string;
  spec: string;
  use_places: string;
  save_addr: string;
  use_dept_names: string;
  result_options: string;
  use_dept_id: string;
  executor_names: string;
  equipment: EquipmentDataType;
  cycle: CycleListType[];
  executive_rule_type: number;
  plan_end_time: string;
  notice_day: number;
}

export interface EquipmentDataType {
  id: number;
  pid: number;
  equipment_no: string;
  asset_no: string;
  barcode: string;
  bar_title: string;
  brand: string;
  spec: string;
  equipment_code: string;
  equipment_type: string;
  equipment_type_id: string;
  power: string;
  sn: string;
  export_type: number;
  product_line: number;
  note: string;
  status: number;
  use_dept_id: string;
  duty_dept_id: string;
  use_duty_user: string;
  open_date: string;
  use_year: number;
  expire_date: string;
  save_addr: string;
  scrap_date?: any;
  scrap_reason: string;
  supplier_id: number;
  production_id: number;
  purchase_uid: number;
  price: string;
  spoiled_rate: string;
  spolied: string;
  depreciation_type: number;
  ct_uid: number;
  up_uid: number;
  create_time: string;
  update_time: string;
  use_places: string;
  use_dept_names: string;
}

export interface CycleListType {
  id: number;
  plan_id: number;
  inspect_item_id: number;
  plan_start_time: string;
  cycle_type: number;
  note?: any;
  executor_uid: string;
  up_uid?: any;
  ct_uid: number;
  ct_name: string;
  update_time: string;
  create_time: string;
  inspect_id: string;
  method: string;
  std_explain: string;
  item_content: string;
  record_method: number;
  record_content?: any;
  normal_val: string;
  abnormal_val: string;
  default_val: string;
  upper_limit_val: string;
  lower_limit_val: string;
  inspect_items_name: string;
  equipment_type_id: number;
  equipment_type_title: string;
  inspect_purpose: string;
  result_content: any[][];
}
