/** 标签标识检验检验报告列表接口-返回的数据类型 */
export interface LabelDataType {
  list: LabelListType[];
  total: number;
  page: string;
  size: string;
}

export interface CheckInfo {
  id: number;
  order_id: number;
  batch_no: number;
  color_res: number;
  check_time: string;
  packet_number: number;
  trademark_res: number;
  layout_structure_res: number;
  health_food_mark_res: number;
  mandatory_logo_res: number;
  barcode_res: number;
  qr_code_res: number;
  version_id: number;
  version_no: string;
  note: string;
  create_time: string;
  update_time: string;
  ct_uid: number;
  ct_name: string;
  up_uid: number;
}
/** 标签标识检验检验报告列表接口-数据中的list的类型 */
export interface LabelListType {
  id: number;
  order_no: string;
  supplier_id: number;
  supplier_name: string;
  pro_time: string;
  check_time: string;
  brand: string;
  sku: string;
  batch_no: string;
  status: number;
  check_res: number;
  check_uid: number;
  check_user: string;
  check_user_signature: string;
  reviewer_user_signature?: any;
  is_delete: number;
  process_arr: string;
  dept_id: number;
  paper_id: number;
  top_cover_img: string;
  can_body_img: string;
  bottom_cover_img: string;
  note: string;
  up_uid: number;
  ct_name: string;
  ct_uid: number;
  create_time: string;
  update_time: string;
  check_info: CheckInfo[];
  brand_name: string;
  sku_name: string;
  assoc_type: number[];
}

/** 标签标识检验检验报告详情接口返回的数据类型 */

export interface LabelDetailType {
  id: number;
  order_no: string;
  supplier_id: number;
  supplier_name?: any;
  pro_time: string;
  check_time: string;
  brand: string;
  sku: string;
  batch_no: string;
  status: number;
  check_res: number;
  check_uid: number;
  check_user: string;
  check_user_signature: string;
  reviewer_user_signature?: any;
  is_delete: number;
  process_arr: string;
  dept_id: number;
  paper_id: number;
  top_cover_img: string;
  can_body_img: string;
  bottom_cover_img: string;
  note: string;
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
  sup_name: string;
  file_list: any[];
  check_info: Check_info[];
  act_log: Act_log[];
  assoc_type: number[];
  [key: string]: any;
}
export interface Check_info {
  id: number;
  order_id: number;
  batch_no: number;
  color_res: number;
  check_time: string;
  packet_number: number;
  trademark_res: number;
  layout_structure_res: number;
  health_food_mark_res: number;
  mandatory_logo_res: number;
  barcode_res: number;
  qr_code_res: number;
  version_id: number;
  version_no: string;
  note: string;
  create_time: string;
  update_time: string;
  ct_uid: number;
  ct_name: string;
  up_uid: number;
}

export interface Act_log {
  id: number;
  order_id: number;
  act: string;
  act_msg: string;
  ct_name: string;
  ct_uid: number;
  create_time: string;
}
