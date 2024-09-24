export interface GoodsType {
  id: number;
  title: string;
  spec: string;
  barcode: string;
  brand: string;
  company: string;
  price?: any;
  img_url: string;
  class_name: string;
  measure_name: string;
  goods_class: string;
  ss_num?: any;
  order_point?: any;
  is_stop_using: number;
  module_type: number;
  exp_day: number;
  exp_warning_day: number;
  is_unique_identify: number;
  is_expensed_assets: number;
  ct_uid?: any;
  up_uid: number;
  purchase_price?: any;
  split_quantity: number;
}

export interface WarehouseType {
  id: number;
  name: string;
  ct_uid: number;
  up_uid?: any;
  module_type: number;
}

export interface ListType {
  id: number;
  inventory_id: number;
  batch_number: string;
  document_type: number;
  document_num: string;
  stock_qty: number;
  title: string;
  transaction_date: string;
  warehouse_id: number;
  goods_id: number;
  dept_id: number;
  ct_uid: number;
  ws_code: string;
  pro_time?: any;
  exp_time?: any;
  is_gen_uniq: number;
  sup_name: string;
  procure_no: string;
  in_wh_no: string;
  price: string;
  stock_price: string;
  in_wh_date: string;
  stock_id: number;
  available_status: number;
  exp_day: number;
  exp_warning_day: number;
  is_expensed_assets: number;
  initial_in_wh_date: string;
  initial_stock_id?: any;
  detail_ctime?: any;
  goods: GoodsType;
  warehouse: WarehouseType;
  barcode: string;
  spec: string;
  brand: string;
  class_name: string;
  measure_name: string;
  warehouse_name: string;
  is_have_unique: boolean;
}

export interface RetstockReportData {
  list: ListType[];
  total: number;
  page: string;
  size: string;
}
