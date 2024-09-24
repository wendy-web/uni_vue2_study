/** 查询参数 */
export type GoodsRecordQuery = {
  keyword?: string;
  /** 入库单号 */
  in_wh_no?: string;
  /** 开始入库日期 */
  in_wh_date_start?: string;
  /** 结束入库日期 */
  in_wh_date_end?: string;
  /** 入库仓库id */
  warehouse_id?: number;
  /** 供应商 */
  sup_name?: string;
  page: number;
  size: number;
};

export interface GoodsRecordList {
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
  dept_id?: any;
  ct_uid?: any;
  create_time: string;
  update_time: string;
  ws_code: string;
  pro_time?: any;
  exp_time?: any;
  is_gen_uniq: number;
  sup_name: string;
  procure_no?: any;
  in_wh_no?: any;
  price: string;
  stock_price: string;
  in_wh_date?: any;
  stock_id?: any;
  exp_day: number;
  barcode: string;
  brand: string;
  class_name: string;
  spec: string;
  measure_name: string;
  warehouse_name: string;
}

export interface GoodsRecordType {
  list: GoodsRecordList[];
  total: number;
  page: string;
  size: string;
}

/** 查看标签弹窗的表格数据列表 */
export interface LabelDataList {
  content: string;
  barcode: string;
  title: string;
  spec: string;
  stock_qty: number;
  batch_number: string;
  in_wh_date: string;
  sup_nam: string;
  num: number;
  code: string;
  label_type: number;
  print_num?:number;
}

/** 查看标签弹窗的数据 */
export interface LabelData {
  total: number;
  labels: LabelDataList[];
}
