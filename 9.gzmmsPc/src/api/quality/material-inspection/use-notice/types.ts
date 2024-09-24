/** 列表接口返回的数据类型 */
export interface UseNoticeDataType {
  list: UseNoticeListType[];
  total: number;
  page: string;
  size: string;
}

/** 列表接口返回的-list字段的数据类型 */
export interface UseNoticeListType {
  id: number;
  order_no: string;
  materials_class: string;
  check_time: string;
  notice_time: string;
  brand: string;
  status: number;
  check_res: number;
  check_uid?: any;
  check_user: string;
  check_user_signature?: any;
  reviewer_user_signature?: any;
  ink_code_res?: any;
  is_delete: number;
  note: string;
  up_uid: number;
  ct_name: string;
  process_arr: string;
  dept_id: number;
  ct_uid: number;
  create_time: string;
  update_time: string;
  batch_info: BatchInfoType[];
  brand_name: string;
  assoc_type: number[];
}

/** 使用通知单详情接口返回的数据类型 */
export interface UseNoticeDetailType {
  id: number;
  order_no: string;
  materials_class: number;
  check_time: string;
  notice_time: string;
  brand: string;
  status: number;
  check_res?: any;
  check_uid?: any;
  check_user: string;
  check_user_signature?: any;
  reviewer_user_signature?: any;
  ink_code_res?: any;
  is_delete: number;
  note?: any;
  up_uid?: any;
  ct_name: string;
  process_arr?: any;
  dept_id: number;
  ct_uid: number;
  create_time: string;
  update_time: string;
  brand_name: string;
  up_name: string;
  file_list: any[];
  batch_info: BatchInfoType[];
  act_log: ActLogType[];
  assoc_type: number[];
}
/** 详情数据类型中的batch_info数组中的类型 */
export interface BatchInfoType {
  id: number;
  order_id: number;
  batch_no: string;
  update_time: string;
  note?: any;
  ct_uid: number;
  create_time: string;
  ct_name: string;
  up_uid?: any;
  pallet_number: string;
  pallet_detail: PalletDetailType[];
}
/** 详情数据类型中的batch_info数组中的类型 */
export interface PalletDetailType {
  id: number;
  order_id: number;
  detail_id: number;
  check_detail_id: number;
  pallet_number: number;
  batch_no: string;
  note?: any;
  create_time: string;
  update_time: string;
  ct_uid: number;
  ct_name: string;
  up_uid?: any;
  check_date: string;
}
/** 详情数据类型中的日志数据类型 */
export interface ActLogType {
  id: number;
  order_id: number;
  act: string;
  act_msg?: any;
  ct_name: string;
  ct_uid: number;
  create_time: string;
}
