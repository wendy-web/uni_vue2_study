export interface Check_info {
  id: number;
  order_id: number;
  check_date: string;
  check_time: string;
  batch_number: string;
  batch_no: string;
  bottom_qr_code_res: number;
  pull_ring_qr_code_res: number;
  layout_structure_res: number;
  security_point_res: number;
  reinspection_items: string;
  reinspection_situation_res: number;
  check_res: number;
  note: string;
  up_uid?: any;
  update_time: string;
  ct_name: string;
  ct_uid: number;
  create_time: string;
  reinspection_items_id: number[];
}

export interface FinishedQrcodeListType {
  id: number;
  order_no: string;
  workshop: number;
  batch_no: string;
  check_date: string;
  brand: string;
  check_res: number;
  status: number;
  check_uid: number;
  check_user: string;
  check_user_signature?: any;
  is_delete: number;
  reviewer_user_signature?: any;
  dept_id: number;
  process_arr?: any;
  base_val?: any;
  note: string;
  up_uid?: any;
  ct_name: string;
  ct_uid: number;
  create_time: string;
  update_time: string;
  check_info: Check_info[];
  brand_name: string;
  assoc_type: any[];
}
/** 成品二维码列表页面数据类型 */
export interface FinishedQrcodeDataType {
  list: FinishedQrcodeListType[];
  total: number;
  page: string;
  size: string;
}

/** 成品二维码详情数据类型  */
export interface FinishedQrcodeDetailType {
  id: number;
  order_no: string;
  workshop: number;
  batch_no: string;
  check_date: string;
  brand: string;
  check_res: number;
  status: number;
  check_uid?: any;
  check_user: string;
  check_user_signature?: any;
  is_delete: number;
  reviewer_user_signature?: any;
  dept_id: number;
  process_arr?: any;
  base_val?: any;
  note?: any;
  up_uid: number;
  ct_name: string;
  ct_uid: number;
  create_time: string;
  update_time: string;
  brand_name: string;
  workshop_name: string;
  total_samples: number;
  total_abnormal: number;
  up_name: string;
  file_list: any[];
  check_info: Check_info[];
  act_log: Act_log[];
  assoc_type: number[];
  line_id: number;
}

export interface Act_log {
  id: number;
  order_id: number;
  act: string;
  act_msg?: any;
  ct_name: string;
  ct_uid: number;
  create_time: string;
}
