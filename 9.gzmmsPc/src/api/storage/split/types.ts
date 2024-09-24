import { type } from "os";

// 搜索传入的类型
export interface ISearchQuery {
  keyword?: string;
  dept_id?: number;
  start_time?: string;
  end_time?: string;
  status?: string;
  page: number;
  size: number;
}

export interface IFileInfo {
  src: string;
  name: string;
}

export interface IDept {
  id: number;
  name: string;
  pid: number;
  top_id: number;
  rank: number;
}

export interface IGood {
  id: number;
  title: string;
  spec: string;
  barcode: string;
  brand: string;
  company: string;
  price: string;
  img_url: string;
  class_name: string;
  measure_name: string;
  goods_class: string;
  ss_num: string;
  order_point: string;
  purchase_price: string;
  split_quantity: number;
}

export interface IBeforeGood {
  id: number;
  split_assemble_id: number;
  warehouse_id: number;
  goods_id: number;
  batch_number: string;
  split_assemble_num: string;
  note: string;
  goods: IGood;
  after: IAfterGood;
  unique: string;
  stock: string;
  stock_id: number;
  price: string;
  ws_code: string;
  in_wh_date: string;
}

export interface IAfterGood {
  id: number;
  split_assemble_id: number;
  before_goods_id: number;
  warehouse_id: number;
  goods_id: number;
  batch_number: string;
  split_assemble_num: string;
  note: string;
  goods: IGood;
  price: string;
  ws_code: string;
  in_wh_date:string;
}
/** 列表api中table数据具体类型 */
export interface IlistData {
  id: number;
  split_assemble_no: string;
  before_num: number;
  after_num: number;
  warehouse_id: number;
  split_assemble_time: string;
  create_id: number;
  dept_id: number;
  file_info: IFileInfo;
  process_arr?: any;
  note: string;
  status: number;
  dept: IDept;
  before_goods: IBeforeGood[];
  assoc_type: number;
  before_goods_detail: string;
  after_goods_detail: string;
  warehouse: {
    id: number;
    name: string;
  };
  create_name: string;
  create_time: string;
}
/** 列表Api返回的类型 */
export interface IListType {
  total: number;
  data: IlistData[];
}

/** 详情数据中的 日志类型 */
export interface IDetailLog {
  id: number;
  split_assemble_id: number;
  ct_name: string;
  act: string;
  act_msg: string;
  text: string;
  ct_uid: number;
  create_time: string;
  update_time: string;
}
/** 详情API返回的数据类型, 与列表API返回的数据类型相似 */
export type DetailDataType = IlistData & {
  log: IDetailLog[];
};
