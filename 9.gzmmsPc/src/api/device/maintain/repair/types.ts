/** 设备维修单-列表接口返回的数据类型 */
export interface RepairListType {
  list: RepairItemType[];
  total: number;
  page: string;
  size: string;
}

/** 设备维修单-列表list的数据类型 */
export interface RepairItemType {
  id: number;
  assoc_type: number[];
  repair_no: string;
  equipment_id: number;
  status: number;
  occurrence_time: string;
  repair_user_id: number;
  fault_body: string;
  product_line: number;
  fault_note: string;
  fault_picture: string[];
  repair_type: number;
  fault_type: string;
  fault_reason: string;
  repair_director: number;
  other_repair_director: string;
  repair_start_time: string;
  repair_end_time?: any;
  is_stop: number;
  stop_time: string;
  outsourcing_id: number;
  repair_price: string;
  repair_note: string;
  repair_picture: string[];
  is_replace: number;
  dept_id: number;
  process_arr: string;
  reject_reason?: any;
  ct_uid: number;
  up_uid: number;
  create_time: string;
  update_time: string;
  bar_title: string;
  save_addr: string;
  status_text: string;
  repair_type_text: string;
  repair_director_text: string;
  repair_user_id_text: string;
  repair_total_time: string;
  save_addr_text: string;
  fault_reason_text: string;
}

/** 编辑维修单时返回的数据类型 */
export interface RepairInfoType {
  id: number;
  barcode: string;
  spec: string;
  eq_type_text: string;
  use_dept_text: string;
  use_duty_user_text: string;
  repair_no: string;
  equipment_id: number;
  status: number;
  occurrence_time: string;
  repair_user_id: number;
  fault_body: string;
  product_line: number;
  fault_note: string;
  fault_picture: string[];
  repair_type: number;
  fault_type: string;
  fault_reason: string;
  repair_director: number;
  other_repair_director: string;
  repair_start_time: string;
  repair_end_time?: any;
  is_stop: number;
  stop_time: string;
  outsourcing_id: number;
  repair_price: string;
  repair_note: string;
  repair_picture: string[];
  is_replace: number;
  dept_id?: any;
  process_arr?: any;
  reject_reason?: any;
  ct_uid: number;
  up_uid: number;
  create_time: string;
  update_time: string;
  bar_title: string;
  save_addr: string;
  status_text: string;
  repair_type_text: string;
  repair_director_text: string;
  repair_user_id_text: string;
  repair_total_time: string;
  save_addr_text: string;
  fault_reason_text: string;
  repair_parts: OrderUpListEditType[];
  chage_parts: DownListEditType[];
  class_type: number;
}
/** 编辑时详情接口返回的-关联领用单换上备件的数据类型 */
export interface OrderUpListEditType {
  id: number;
  type: number;
  repair_id: number;
  rec_detail_id: number;
  re_no: string;
  order_no: string;
  eq_id: number;
  order_status: number;
  goods_id: number;
  out_date: string;
  chage_date: string;
  down_date?: any;
  down_num: number;
  out_ware_id: number;
  out_ware: string;
  barcode: string;
  title: string;
  spec: string;
  brand: string;
  class_name: string;
  measure_name: string;
  received_num: number;
  price: string;
  in_wh_date: string;
  sup_name: string;
  use_addr: string;
  use_num: number;
  ct_uid: number;
  up_uid: number;
  ct_name?: any;
  create_time: string;
  update_time: string;
  /**  未使用数量(不需要适用) */
  no_use_num: number;
  /** 待用数 */
  rem_num: number;
  stock_id: number;
  unique_label_detail: uniqueLabelDetailType[];
  is_have_unique: boolean;
}

/** 编辑时详情接口返回的-关联换下备件的数据类型 */
export interface DownListEditType {
  id: number;
  edit_id?: number;
  assos_id?: number;
  type?: number;
  parts_id?: number;
  down_num: number;
  down_date: string;
  ct_uid?: number;
  up_uid?: number;
  create_time?: string;
  update_time?: string;
  repair_id: number;
  rec_detail_id: number;
  re_no: string;
  order_no: string;
  eq_id: number;
  order_status?: number;
  chage_date: string;
  out_ware: string;
  out_ware_id?: number;
  out_date: string;
  barcode: string;
  title: string;
  spec: string;
  brand: string;
  class_name: string;
  measure_name: string;
  received_num: number;
  price?: string;
  in_wh_date: string;
  sup_name: string;
  use_addr: string;
  use_num: number;
  online_num: number;
  type_text: string;
  stock_id: number;
  is_have_unique?: boolean;
  unique_label_detail?: uniqueLabelDetailType[];
}

type uniqueLabelDetailType = {
  unique_code: string;
};
