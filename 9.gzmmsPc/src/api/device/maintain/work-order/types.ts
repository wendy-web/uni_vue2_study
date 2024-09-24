/** 工单列表接口返回的数据类型 */
export interface WorkOrderListType {
  list: WorkOrderItemType[];
  total: number;
  page: string;
  size: string;
}

/** 保养情况类型 */
export interface SituationType {
  already_num: number;
  not_num: number;
}
/** 工单列表数据类型 */
export interface WorkOrderItemType {
  id: number;
  maintenance_order_no: string;
  plan_no: string;
  plan_id: number;
  plan_details_no: string;
  equipment_type_id: number;
  equipment_type_title: string;
  equipment_id: number;
  status: number;
  maintenance_start_time?: any;
  complete_time?: any;
  plan_start_time: string;
  reminder_time?: any;
  maintenance_level: string;
  maintenance_cost: string;
  equipment_cost: string;
  cycle_type: number;
  director_uid: string;
  other_uid: string;
  bar_title: string;
  barcode: string;
  img_info?: any;
  plan_name: string;
  asset_no: string;
  use_dept_id: string;
  save_addr: string;
  dept_id: number;
  process_arr?: any;
  spec: string;
  outsourced_units: string;
  note?: any;
  maintenance_desc?: any;
  up_uid?: any;
  ct_uid: number;
  ct_name: string;
  update_time: string;
  create_time: string;
  brand: string;
  director_names: string;
  other_names: string;
  use_dept_names: string;
  maintenance_level_name: string;
  maintenance_use_time: string;
  maintenance_situation: SituationType;
  assoc_type: any[];
}

export interface WorkOrderDetailType {
  id: number;
  is_replace: number;
  maintenance_order_no: string;
  plan_no: string;
  plan_id: number;
  plan_details_no: string;
  equipment_type_id: number;
  equipment_type_title: string;
  equipment_id: number;
  status: number;
  maintenance_start_time?: any;
  complete_time?: any;
  plan_start_time: string;
  reminder_time?: any;
  maintenance_level: string;
  maintenance_cost: string;
  equipment_cost: string;
  cycle_type: number;
  director_uid: string;
  other_uid: string;
  bar_title: string;
  barcode: string;
  img_info?: any;
  plan_name: string;
  asset_no: string;
  use_dept_id: string;
  save_addr: string;
  dept_id: number;
  process_arr?: any;
  spec: string;
  outsourced_units: string;
  note?: any;
  maintenance_desc?: any;
  up_uid?: any;
  ct_uid: number;
  ct_name: string;
  update_time: string;
  create_time: string;
  save_addr_names: string;
  use_dept_names: string;
  director_names: string;
  other_names: string;
  maintenance_project: MaintenanceProjectType[];
  rec_arr: any[];
  down_arr: any[];
  act_log: any[];
  assoc_type: any[];
}

export interface MaintenanceProjectType {
  id: number;
  plan_start_time: string;
  cycle_type: string;
  director_uid: string;
  other_uid: string;
  is_maintain: number;
  maintenance_area: string;
  name: string;
  maintenance_requirements: string;
  note?: any;
  director_names: string;
  other_names: string;
}
