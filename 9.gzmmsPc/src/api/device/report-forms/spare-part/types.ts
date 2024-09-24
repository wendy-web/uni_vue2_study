export interface StatsReportDataType {
  list: StatsReportItemType[];
  total: number;
  page: string;
  size: string;
}

export interface StatsReportItemType {
  id: number;
  chage_type: string;
  repair_id: number;
  rec_detail_id: number;
  re_no: string;
  order_no: string;
  eq_id: number;
  order_status: number;
  goods_id: number;
  out_date: string;
  chage_date?: any;
  down_date: string;
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
  in_wh_date?: any;
  sup_name?: any;
  use_addr: string;
  use_num: number;
  bar_title: string;
  asset_no: string;
  save_addr: string;
  equipment_type_id: string;
  use_dept_id: string;
  assos_id: number;
  down_type: string;
  use_places: string;
  save_places: string;
  down_no: string;
  use_duration: string;
  amount: string;
  down_re_no?: any;
}
