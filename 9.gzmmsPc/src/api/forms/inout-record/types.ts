/** 查询api的请求参数 */
export interface ISearchQuery {
  start_date?: string;
  end_date?: string;
  keyword?: string;
  page: number;
  size?: number;
  document_type?: string;
}

/** 导出api的请求参数 */
export interface IExportQuery {
  ids?: number[];
  keyword?: string;
  start_time?: string;
  end_time?: string;
}
export interface IGoodType {
  id: number;
  title: string;
  spec: string;
  barcode: string;
  brand: string;
  company?: any;
  price?: any;
  img_url?: any;
  class_name: string;
  measure_name: string;
  goods_class?: any;
  ss_num?: any;
  order_point?: any;
  ct_uid: number;
  up_uid: number;
  purchase_price?: any;
}

export interface IWarehouseType {
  id: number;
  name: string;
  ct_uid: number;
  up_uid?: any;
}

export interface InoutObjType {
  id: number;
  inventory_id: number;
  batch_number: string;
  document_type: number;
  document_num: string;
  transaction_type: number;
  transaction_quantity: number;
  balance_quantity: number;
  transaction_date: string;
  warehouse_id: number;
  goods_id: number;
  goods: IGoodType;
  warehouse: IWarehouseType;
  type: number;
}

export interface InoutList {
  data: InoutObjType[];
  total: number;
}
