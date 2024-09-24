export type BuyinRecordQuery = {
  keyword:string;
  procure_no?: string;
  barcode?: string;
  goods_name?: string;
  spec?: string;
  brand?: string;
  class_name?: string;
  sup_name?: string;
  in_wh_id?: number[];
  in_start_time?: string;
  in_end_time?: string;
  ph_no?: string;
  dept_id?: number[];
  page: number;
  size: number;
};

export type BuyinRecordForm = Omit<BuyinRecordQuery, "in_start_time" | "in_end_time"> & {
  time?: string;
};

export interface BuyinRecordList {
  id: number;
  goods_id: number;
  wh_in_id: number;
  procure_id: number;
  procure_goods_id: number;
  title: string;
  barcode: string;
  spec: string;
  brand: string;
  measure_name: string;
  class_name: string;
  price: string;
  in_num: number;
  in_time:string;
  rem_num: number;
  sup_name: string;
  delivery_time?: any;
  pro_time?: any;
  contract_no?: any;
  note?: any;
  ph_no: string;
  warehouse_id: number;
  warehouse_name: string;
  ct_uid: number;
  up_uid?: any;
  is_add: number;
  goods_all_id?: any;
  dept_id: number;
  create_time: string;
  update_time: string;
  status: number;
  ct_name: string;
}

export interface BuyinRecordData {
  list: BuyinRecordList[];
  total: number;
  page: string;
  size: string;
}
