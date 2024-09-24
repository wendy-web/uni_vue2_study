// 退货出库单类型
// 列表API返回数据类型
export interface IRetGoodsItem {
  id: number;
  wh_ret_no: string;
  procure_no: string;
  all_price: string;
  all_num: number;
  note: string;
  file_info: {
    name: string;
    src: string;
  };
  dept_id: number;
  ct_name: string;
  ct_uid: number;
  status: number;
  create_time: string;
  assoc_type: number;
}

export interface IRetGoodsList {
  list: IRetGoodsItem[];
  total: number;
  page: string;
  size: string;
}

// 详情API返回数据类型
// 单据日志类型
export type RetGoodsActlog = {
  act: string;
  act_msg: string;
  create_time: string;
  ct_name: string;
  ct_uid: number;
  id: number;
  wh_ret_id: number;
};
// 商品数据类型
export type RetGoodsGoods = {
  barcode: string; //货品条码
  brand: string;
  class_name: string;
  contract_no: string;
  create_time: string;
  ct_uid: number;
  delivery_time: string;
  id: number;
  in_goods_id: number;
  is_add: number;
  measure_name: string; //单位
  note: string; //备注
  ph_no: string; //批次/日期
  price: string;
  pro_time: string; //生产日期
  procure_id: number;
  ret_num: number; //出库数量
  spec: string; //规格型号
  sub_total: string;
  sup_name: string;
  title: string; //名称
  up_uid: number;
  warehouse_id: number;
  warehouse_name: string; //出库仓库名
  wh_ret_id: number;
  goods_all_id: number; //
  goods_id: number;
  unique: string;
  stock: number;
  stock_id: number;
  max_rem_num: number;
};

export interface IRetGoodsDetail {
  act_log: RetGoodsActlog[]; //单据日志
  all_num: number;
  all_price: string;
  create_time: string;
  ct_name: string;
  ct_uid: number;
  dept_id: number;
  file_info: { name: string; src: string };
  goods: RetGoodsGoods[];
  id: number;
  note: string;
  process_arr: string;
  procure_no: string;
  procure_id: number;
  status: number;
  up_uid: number;
  wh_ret_no: string;
  return_time: string;
  out_time: string;
  out_wh_id: number;
  out_wh_name: string;
  type: number;
}

// 创建/编辑 发送数据类型
// 商品表格数据类型
export interface IRetGoodsAdd {
  /** 编辑时需要传的id */
  id?: number;
  /** 入库商品id */
  in_goods_id?: number;
  /** 导入采集的id */
  procure_id?: number;
  /** 名称 */
  title: string;
  /** 货品条码 */
  barcode: string;
  /** 规格 */
  spec: string;
  /** 品牌 */
  brand: string;
  /** 单位 */
  measure_name: string;
  /** 分类 */
  class_name: string;
  /** 退货出库数量 */
  ret_num: number | undefined;
  /** 供应商名称 */
  sup_name?: string;
  /** 交货日期 */
  delivery_time?: string;
  /** 合同号 */
  contract_no?: string;
  /** 备注 */
  note?: string;
  /** 仓库id */
  warehouse_id: number;
  /** 仓库名称 */
  warehouse_name: string;
  /** 批次/日期 */
  ph_no?: string;
  /** ret_num的留底,相当于最大退货出库数量ret_num的留底,相当于最大退货出库数量 */
  old_ret_num: number;
  /** 是否可选 */
  select_status?: boolean;
  /** goods_id */
  goods_id: number;
  price: string;
}
/* directTable其他出库页面使用的商品数据类型 */
export type IRetGoodsDirect = Omit<IRetGoodsAdd, "old_ret_num"> & {
  unique?: string;
  old_num: number;
  stock_id: number;
};

export interface IRetGoodsAddInfo {
  id?: number;
  procure_no?: string;
  procure_id?: number;
  out_wh_id?: number;
  out_wh_name?: string;
  return_time?: string;
  type: number;
  out_time: string;
  goods: any[];
  note: string; //主备注
  file_info: {
    //附件信息
    src: string;
    name: string;
  };
}

// 导入货品API返回的数据类型
export interface IRetGoodsImportItem {
  id: number;
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
  rem_num: number;
  sup_name: string;
  delivery_time: string;
  pro_time: string;
  contract_no: string;
  note: string;
  ph_no: string;
  warehouse_id: number;
  warehouse_name: string;
  ct_uid: number;
  up_uid: number;
  is_add: number;
  create_time: string;
  goods_id: number;
  stock_id: number;
}
export interface IRetGoodsImport {
  list: IRetGoodsImportItem[];
}
