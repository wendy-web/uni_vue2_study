/** 成品标签标识-列表页面返回的数据类型 */
export interface IdentifyDataType {
  list: IdentifyListType[];
  total: number;
  page: string;
  size: string;
}
export interface Check_info {
  id: number;
  order_id: number;
  check_time: string;
  batch_number: string;
  batch_no: string;
  color_res: number;
  registered_trademark_res: number;
  layout_structure_res: number;
  health_food_labeling_res: number;
  mandatory_identify_content_res: number;
  check_res: number;
  barcode_res: number;
  qr_code_res: number;
  version_id: number;
  version_no: string;
  note: string;
  up_uid?: any;
  update_time: string;
  ct_name: string;
  ct_uid: number;
  create_time: string;
}

/** 成品标签标识-table列表的类型 */
export interface IdentifyListType {
  id: number;
  order_no: string;
  supplier_id: number;
  sup_name: string;
  pro_date: string;
  batch_no: string;
  check_date: string;
  brand: string;
  sku: string;
  check_res: number;
  status: number;
  top_cover_img: string;
  bottom_cover_img: string;
  can_body_img: string;
  check_uid: number;
  check_user: string;
  check_user_signature?: any;
  is_delete: number;
  reviewer_user_signature?: any;
  paper_id: number;
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
  sku_name: string;
  assoc_type: any[];
}
