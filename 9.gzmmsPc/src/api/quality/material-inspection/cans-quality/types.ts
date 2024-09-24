/** 空罐质量检验报告-列表接口返回的数据类型 */
export interface CansQualityDataType {
  list: CansQualityListType[];
  total: number;
  page: string;
  size: string;
}
export interface CansQualityCheckInfo {
  id: number;
  order_id: number;
  sample_num: number;
  bottom_arch_height: string;
  rac_inner_diameter: string;
  tank_axial_pressure: string;
  crs_strength_bottom: string;
  sample_time: string;
  boiling_experiment_res: number;
  acid_boiling_experiment_res: number;
  adhesion_experiment_res: number;
  dyeing_experiment_res: number;
  resistance_outer_coating_res: number;
  note: string;
  ct_uid: number;
  ct_name: string;
  update_time: string;
  up_uid?: any;
  create_time: string;
  tank_height1: string;
  tank_height2: string;
  tank_height3: string;
  flange_width1: string;
  flange_width2: string;
  flange_width3: string;
  is_use: number;
}
/** 空罐质量检验报告-列表接口返回的列表数据类型 */
export interface CansQualityListType {
  id: number;
  order_no: string;
  batch_no: string;
  empty_can_size_id: number;
  check_reagent_id: number;
  check_time: string;
  brand: string;
  sku: string;
  status: number;
  version_id: number;
  check_res: number;
  check_uid: number;
  check_user: string;
  check_user_signature?: any;
  is_delete: number;
  reviewer_user_signature?: any;
  ink_code_res: number;
  dept_id: number;
  process_arr?: any;
  note: string;
  up_uid?: any;
  ct_name: string;
  ct_uid: number;
  create_time: string;
  update_time: string;
  check_info: CansQualityCheckInfo[];
  brand_name: string;
  sku_name: string;
  assoc_type: any[];
}

/** 空罐质量详情接口返回的数据类型 */
export interface CansQualityDetailType {
  id: number;
  order_no: string;
  batch_no: string;
  empty_can_size_id: number;
  check_reagent_id: number;
  check_time: string;
  brand: string;
  sku: string;
  status: number;
  version_id: number;
  check_res?: any;
  check_uid?: any;
  check_user: string;
  check_user_signature?: any;
  is_delete: number;
  reviewer_user_signature?: any;
  ink_code_res?: any;
  dept_id: number;
  process_arr?: any;
  base_val: string;
  note?: any;
  up_uid: number;
  ct_name: string;
  ct_uid: number;
  create_time: string;
  update_time: string;
  brand_name: string;
  sku_name: string;
  total_samples: number;
  total_abnormal: number;
  up_name: string;
  empty_can_size: string;
  check_reagent: string;
  version: string;
  base_val_arr: any;
  file_list: any[];
  check_info: CheckInfoType[];
  act_log: ActLogType[];
  assoc_type: number[];
}

/** 详情数据的check_info中--内涂膜实测值录入明细的数据类型 */
export interface CheckInnerItem {
  id: number;
  order_id: number;
  detail_id: number;
  pro_package_number: number;
  sample_no?: any;
  actual_value: string;
  note?: any;
  ct_uid: number;
  ct_name: string;
  update_time: string;
  up_uid?: any;
  create_time: string;
}

/** 详情数据中的check_info的数据类型 */
export interface CheckInfoType {
  id: number;
  order_id: number;
  sample_num: number;
  bottom_arch_height?: any;
  rac_inner_diameter?: any;
  tank_axial_pressure?: any;
  crs_strength_bottom?: any;
  sample_time?: any;
  boiling_experiment_res?: any;
  acid_boiling_experiment_res?: number;
  adhesion_experiment_res: number;
  dyeing_experiment_res?: any;
  resistance_outer_coating_res?: any;
  note?: any;
  ct_uid: number;
  ct_name: string;
  update_time: string;
  up_uid: number;
  create_time: string;
  tank_height1?: any;
  tank_height2?: any;
  tank_height3?: any;
  flange_width1?: any;
  flange_width2?: any;
  flange_width3?: any;
  is_use: number;
  check_inner_item: CheckInnerItem[];
}

export interface ActLogType {
  id: number;
  order_id: number;
  act: string;
  act_msg?: any;
  ct_name: string;
  ct_uid: number;
  create_time: string;
}
