
/** 成品发货通知单列表页面table表格的数据类型 */
export interface ProductNoticeListType {
  id: number;
  order_no: string;
  check_date: string;
  check_time: string;
  status: number;
  report_user_signature?: any;
  reviewer_user_signature?: any;
  report_uid: number;
  report_user: string;
  dept_id: number;
  process_arr?: any;
  base_val: string;
  note: string;
  up_uid?: any;
  ct_name: string;
  ct_uid: number;
  create_time: string;
  update_time: string;
  is_delete: number;
  assoc_type: any[];
  line_str: string;
}

/** 成品发货通知单列表页面的数据类型 */
export interface ProductNoticeDataType {
  list: ProductNoticeListType[];
  total: number;
  page: string;
  size: string;
}
