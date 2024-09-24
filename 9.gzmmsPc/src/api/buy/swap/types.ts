/** 附件类型 */
export interface IFileInfo {
  src: string;
  name: string;
}
/** 部门类型 */
export interface IDept {
  id: number;
  name: string;
}

/** 列表表格数据类型 */
export interface ISwapList {
  id: number;
  replacement_no: string;
  procure_no: string;
  replacement_data: string;
  note?: any;
  create_id: number;
  create_name: string;
  update_id?: any;
  file_info: IFileInfo;
  dept_id: number;
  process_arr?: any;
  status: number;
  create_time: string;
  update_time: string;
  dept: IDept;
  assoc_type: number;
}

/** 列表返回的数据类型*/
export interface ISwapData {
  data: ISwapList[];
  total: number;
}

export interface IGood {
  id: number;
  title: string;
  spec: string;
  barcode: string;
  brand?: any;
  company?: any;
  price?: any;
  img_url?: any;
  class_name: string;
  measure_name: string;
  goods_class?: any;
  ss_num?: any;
  order_point?: any;
  ct_uid?: any;
  up_uid?: any;
  purchase_price?: any;
}
/** 详情返回的退回商品数据类型 */
export interface IReturnGood {
  id: number;
  replacement_id: number;
  procure_goods_id: number;
  goods_id: number;
  dept_id: number;
  return_num: number;
  depts: {
    id: number;
    name: string;
  } | null;
  supplier: {
    id: number;
    name: string;
  };
  supplier_id: number;
  note: string;
  create_time: string;
  update_time: string;
  goods: IGood;
}

/** 详情返回的 换货商品数据类型 */
export interface IReplacementGood {
  id: number;
  replacement_id: number;
  goods_id: number;
  dept_id: number;
  num: number;
  price: string;
  supplier_id: number;
  submit_time: string;
  delivery_time: string;
  contract_no: string;
  note: any;
  create_id?: any;
  update_id?: any;
  create_time: string;
  update_time: string;
  goods: IGood;
  depts: {
    id: number;
    name: string;
  } | null;
  supplier: {
    id: number;
    name: string;
  };
}
export interface ISwapLog {
  id: number;
  replacement_id: number;
  ct_name: string;
  act: string;
  act_msg?: any;
  text?: any;
  ct_uid: number;
  create_time: string;
  update_time: string;
}

export interface ISwapDetail {
  id: number;
  replacement_no: string;
  procure_no: string;
  replacement_data: string;
  note?: any;
  create_id: number;
  create_name: string;
  update_id?: any;
  file_info: IFileInfo;
  dept_id: number;
  process_arr?: any;
  status: number;
  create_time: string;
  update_time: string;
  dept: IDept;
  return_goods: IReturnGood[];
  replacement_goods: IReplacementGood[];
  return_goods_detail: string;
  replacement_goods_detail: string;
  log: ISwapLog[];
}
