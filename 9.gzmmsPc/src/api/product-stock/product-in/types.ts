/** 成品入库管理列表页数据类型 */
export interface ProductInListData {
  list: ProductInListType[];
  total: number;
  page: string;
  size: string;
}
/** 成品入库管理table数据类型 */
export interface ProductInListType {
  id: number | any;
  in_type: number;
  pro_no: string;
  pro_in_no: string;
  goods_id: number;
  barcode: string;
  goods_name: string;
  factory_code: string;
  ws_codes: string;
  delivery_no: string;
  dept_id: number;
  ct_name: string;
  ct_uid: number;
  up_uid?: any;
  status: number;
  file_info?: any;
  pro_date: string;
  note?: any;
  in_wh_date?: any;
  in_wh_num?: any;
  in_wh_id: number;
  in_wh_name: string;
  is_delete: number;
  create_time: string;
  update_time: string;
  measure_name: string;
}

/** 成品入库管理详情页面数据 */
export interface ProductInDetailData {
  id: number;
  pro_no: string;
  pro_in_no: string;
  goods_id: number;
  barcode?: any;
  goods_name: string;
  factory_code: string;
  ws_codes: string;
  delivery_no: string;
  dept_id: number;
  ct_name: string;
  ct_uid: number;
  up_uid: number;
  status: number;
  file_info: File_info;
  pro_date: string;
  note: string;
  in_wh_date?: any;
  in_wh_num?: any;
  in_wh_id: number;
  in_wh_name: string;
  is_delete: number;
  create_time: string;
  update_time: string;
  ws_code_ids_arr: string[];
  ws_code_ids: string;
  wl_code: string;
  goods: ProductInGoodsType[];
  act_log: ActLogType[];
}

export interface ProductInGoodsType {
  id: number;
  order_id: number;
  title: string;
  barcode: string;
  measure_name: string;
  price: string;
  box_serial_number: string;
  in_num: number;
  pro_ph_no: string;
  site: string;
  warehouse_id?: any;
  warehouse_name?: any;
  stock_type: number;
  ct_uid: number;
  up_uid: number;
  is_add: number;
  dept_id: number;
  exp_time?: any;
  ws_code: string;
  note?: any;
  create_time: string;
  update_time: string;
  ws_code_name_str: string;
  batch_no_str: string;
  goods_detail: GoodsDetailType[];
}

export interface GoodsDetailType {
  id: number;
  stack_no: number;
  order_id: number;
  detail_id: number;
  title: string;
  barcode: string;
  measure_name: string;
  in_num: number;
  box_serial_number_start: number;
  box_serial_number_end: number;
  pro_ph_no: string;
  batch_no: string;
  ws_code_name: string;
  ws_code: string;
  ws_code_id: number;
  site: string;
  warehouse_id?: any;
  warehouse_name?: any;
  stock_type: number;
  ct_uid: number;
  up_uid?: any;
  is_add: number;
  dept_id: number;
  exp_time?: any;
  note: string;
  create_time: string;
  update_time: string;
  stock_type_name: string;
}

export interface ActLogType {
  id: number;
  order_id: number;
  ct_name: string;
  act: string;
  act_msg?: any;
  ct_uid: number;
  create_time: string;
}

export interface File_info {
  name: string;
  src: string;
}
