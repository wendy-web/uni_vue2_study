/** 保养计划-列表接口返回数据类型 */
export interface MaintainPlanList {
  list: MaintainPlanItem[];
  total: number;
  page: string;
  size: string;
}

/** 保养计划-列表接口返回的list数据类型 */
export interface MaintainPlanItem {
  id: number;
  plan_name: string;
  plan_no: string;
  cycle_type: number;
  plan_details_no: string;
  equipment_type_id: number;
  equipment_type_title: string;
  equipment_id: number;
  plan_start_time: string;
  last_start_time?: any;
  next_maintenance_time?: any;
  director_uid: string;
  other_uid: string;
  reminder_time?: any;
  maintenance_level: string;
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
  use_dept_id?: any;
  save_addr: string;
  director_names: string;
  other_names: string;
  use_dept_names: string;
  maintenance_level_name: string;
  overdue_day: string;
  use_places: string;
}

/** 计划详情返回的数据类型 */
export interface PlanDetailType {
  id: number;
  plan_name: string;
  plan_no: string;
  cycle_type: number;
  plan_details_no: string;
  equipment_type_id: number;
  equipment_type_title: string;
  equipment_id: number;
  plan_start_time: string;
  last_start_time?: any;
  next_maintenance_time?: any;
  director_uid: string;
  other_uid: string;
  reminder_time?: any;
  maintenance_level: string;
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
  use_dept_id: string;
  notice_day: number;
  director_uid_arr: string[];
  other_uid_arr: string[];
  director_names: string;
  other_names: string;
  equipment: EquipmentListType;
  cycle_item: CycleListType[];
}

export interface EquipmentListType {
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
  power?: any;
  sn: string;
  export_type?: any;
  product_line?: any;
  note: string;
  status: number;
  use_dept_id?: any;
  duty_dept_id?: any;
  use_duty_user: string;
  open_date?: any;
  use_year?: any;
  expire_date?: any;
  save_addr: string;
  scrap_date?: any;
  scrap_reason: string;
  supplier_id?: any;
  production_id?: any;
  purchase_uid?: any;
  price: string;
  spoiled_rate?: any;
  spolied?: any;
  depreciation_type?: any;
  ct_uid: number;
  up_uid: number;
  create_time: string;
  update_time: string;
  use_places: string;
  use_dept_names: string;
}

// export interface CycleListType {
//   id: number;
//   plan_id: string;
//   maintenance_project_id: number;
//   plan_start_time: string;
//   cycle_type: number;
//   note?: any;
//   up_uid?: any;
//   ct_uid: number;
//   ct_name: string;
//   director_uid: string;
//   other_uid: string;
//   update_time: string;
//   create_time: string;
//   name: string;
//   equipment_id: number;
//   equipment_title: string;
//   maintenance_requirements: string;
//   maintenance_area: string;
//   is_maintain: number;
// }
export interface CycleListType {
  id: number;
  plan_id?: string;
  maintenance_project_id?: number;
  plan_start_time: string;
  cycle_type: number | string;
  note?: any;
  up_uid?: any;
  ct_uid?: number;
  ct_name?: string;
  director_uid: string;
  other_uid: string;
  update_time?: string;
  create_time?: string;
  name: string;
  equipment_id?: number;
  equipment_title?: string;
  maintenance_requirements: string;
  maintenance_area: string;
  is_maintain: number;
}

