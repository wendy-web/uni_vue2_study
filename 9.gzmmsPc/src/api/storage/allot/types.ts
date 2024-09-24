// 调拨单类型
// 列表API返回数据类型
export interface IAllotItem {
  id: number;
  wh_tra_no: string;
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
  out_wh_id: number;
  out_wh_name: string;
  to_wh_id: number;
  to_wh_name: string;
  out_time: string;
  in_time: string;
  details: AllotGoods[];
}

export interface IAllotList {
  list: IAllotItem[];
  total: number;
  page: string;
  size: string;
}

// 详情API返回数据类型
// 单据日志类型
export type AllotActlog = {
  act: string;
  act_msg: string;
  create_time: string;
  ct_name: string;
  ct_uid: number;
  id: number;
  wh_tra_id: number;
};
// 商品数据类型
export type AllotGoods = {
  goods_id: number;
  stock: number;
  barcode: string; //条码
  brand: string;
  class_name: string;
  create_time: string;
  ct_uid: number;
  id: number;
  in_goods: string;
  measure_name: string; //单位
  note: string;
  ph_no: string; //批次/日期
  price: string;
  rec_num: number; //
  spec: string; //规格型号
  sup_name: string;
  title: string; //名称
  unique: string;
  up_uid: number;
  warehouse_id: number;
  warehouse_name: string; //仓库
  wh_tra_id: number;
  stock_id: number;
  ws_code: string;
  in_wh_date: string;
};

export interface IAllotDetail {
  act_log: AllotActlog[]; //单据日志
  all_num: number;
  all_price: string;
  create_time: string;
  ct_name: string;
  ct_uid: number;
  dept_id: number;
  file_info: { name: string; src: string };
  goods: AllotGoods[];
  id: number;
  wh_tra_no: string;
  out_wh_id: number; //调出仓库id
  out_wh_name: string; //调出仓库名称
  out_time: string;
  in_time: string;
  to_wh_id: number; //调入仓库id
  to_wh_name: string; //调出仓库名称
  note: string;
  process_arr: string;
  status: number;
  up_uid: number;
  goods_all_id: number;
  goods_id: number;
}

// 创建/编辑 发送数据类型
// 商品表格数据类型
export interface IAllotAdd {
  // goods_all_id: number;
  title: string; //名称
  barcode: string; //货品条码
  spec: string; //规格
  brand: string; //品牌
  measure_name: string; //单位
  class_name: string; //分类
  rec_num: number | string; //数量
  // sup_name: string; //供应商名称
  ph_no: string; //批次/日期
  warehouse_id: number;
  warehouse_name: string;
  note: string; //备注
  unique: string;
  /** 自定义属性 是否可选 */
  select_status?: boolean;
  /** 自定义属性 最大领料数量 */
  // old_rec_num?: number; //领料数量的备份,最大领料数量
  old_num: number; //领料数量的备份,最大领料数量
  goods_id: number;
  stock_id: number;
  ws_code: string;
  in_wh_date: string;
  price: string;
}

type IAllotPre = Omit<IAllotAdd, "old_num">; // 就是在 IGetSupAdd 的基础上，去掉 old_num 属性
export interface IAllotAddInfo {
  id?: number;
  out_wh_id: number; //调出仓库id
  out_wh_name: string; //调出仓库名称
  to_wh_id: number; //调入仓库id
  to_wh_name: string; //调入仓库名称
  out_time: string;
  in_time: string;
  goods: IAllotPre[];
  note: string; //主备注
  file_info: {
    //附件信息
    src: string;
    name: string;
  };
}
