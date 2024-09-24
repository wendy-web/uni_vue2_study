/** 空罐进货检验报告-列表接口返回的数据类型 */
export interface CansStockDataType {
  list: CansStockListType[];
  total: number;
  page: string;
  size: string;
}

export interface CansStockCheckInfo {
  id: number;
  order_id: number;
  batch_no: string;
  mfr_id?: any;
  line_id: number;
  version_id: number;
  note: string;
  create_time: string;
  update_time: string;
  ct_uid: number;
  ct_name: string;
  up_uid?: any;
}

/** 空罐进货检验报告-列表接口返回的列表数据类型 */
export interface CansStockListType {
  id: number;
  order_no: string;
  supplier_id: number;
  check_time: string;
  brand: string;
  sku: string;
  status: number;
  check_res?: any;
  check_uid: number;
  check_user: string;
  check_user_signature?: any;
  reviewer_user_signature?: any;
  exterior_res: number;
  label_recog_res: number;
  inner_coating_film_res: number;
  weld_integrity_res: number;
  roll_sealing_res: number;
  silent_code_test_res: number;
  bottom_cover_blue_res: number;
  bursting_power_res: number;
  is_delete: number;
  process_arr?: any;
  dept_id: number;
  note: string;
  up_uid?: any;
  ct_name: string;
  ct_uid: number;
  create_time: string;
  update_time: string;
  check_info: CansStockCheckInfo[];
  supplier_name: string;
  brand_name: string;
  sku_name: string;
  assoc_type: any[];
}
