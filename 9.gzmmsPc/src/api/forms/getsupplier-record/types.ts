export type getsupplierRecordList = {
  list: getsupplierRecordItem[];
  total: number;
  page: string;
  size: string;
};

export type getsupplierRecordItem = {
  id: number;
  ct_uid: number;
  dept_id: number;
  status: number;
  wh_rec_id: number;
  wh_rec_no: string;
  ct_name: string;
  out_time: string;
  barcode: string;
  title: string;
  spec: string;
  brand: string;
  measure_name: string;
  class_name: string;
  warehouse_name: string;
  use_place_id: string;
  rec_num: number;
  received_num: number;
  warehouse_id: number;
  use_places: string;
};
