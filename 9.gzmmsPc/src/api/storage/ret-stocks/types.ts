/** 列表接口返回的数据类型 */
export interface RetStocksDataType {
  list: RetStocksItemType[];
  total: number;
  page: string;
  size: string;
}
export interface File_info {
  name: string;
  src: string;
}

export interface RetStocksItemType {
  id: number;
  wh_inv_ret_no: string;
  process_arr?: any;
  ret_name: string;
  note: string;
  file_info: File_info;
  dept_id: number;
  ct_name: string;
  ct_uid: number;
  status: number;
  ret_time: string;
  ret_wh_id: number;
  ret_wh_name: string;
  create_time: string;
  assoc_type: any[];
  title: string;
  spec: string;
  barcode: string;
  product_name: string;
  total_num: number;
}


export interface RetStocksDetailType {
  id: number;
  wh_inv_ret_no: string;
  note?: any;
  file_info: File_info;
  dept_id: number;
  ct_name: string;
  ct_uid: number;
  up_uid?: any;
  status: number;
  process_arr?: any;
  ret_time: string;
  ret_name: string;
  ret_uid: number;
  ret_wh_id: number;
  ret_wh_name: string;
  ap_uid: number;
  create_time: string;
  goods: GoodsType[];
  act_log: Act_log[];
  ap_names: string;
  is_ct_user: number;
  assoc_type: number[];
}


export interface GoodsType {
  id: number;
  goods_id: number;
  wh_inv_ret_id: number;
  title: string;
  barcode: string;
  spec: string;
  brand?: any;
  measure_name: string;
  class_name: string;
  price: string;
  ret_num: string;
  rem_num: number;
  sup_name?: any;
  replace_time: string;
  pro_time?: any;
  contract_no?: any;
  note?: any;
  ph_no: string;
  ct_uid: number;
  up_uid?: any;
  is_add: number;
  goods_all_id?: any;
  dept_id?: any;
  exp_time?: any;
  ws_code: string;
  is_gen_uniq: number;
  exp_day?: any;
  goods_type: number;
  available_status: number;
  use_place_id: number;
  create_time: string;
  sub_total: string;
  use_places: string;
}

export interface Act_log {
  id: number;
  wh_inv_ret_id: number;
  ct_name: string;
  act: string;
  act_msg?: any;
  ct_uid: number;
  create_time: string;
}

