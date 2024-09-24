// 调拨单类型
// 列表API返回数据类型
export interface IScrapItem {
  id: number;
  wh_scr_no: string;
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
export interface IScrapList {
  list: IScrapItem[];
  total: number;
  page: string;
  size: string;
}

// 详情API返回数据类型
// 单据日志类型
export type ScrapActlog = {
  act: string;
  act_msg: string;
  create_time: string;
  ct_name: string;
  ct_uid: number;
  id: number;
  wh_inv_id: number;
};

// 商品数据类型
export type ScrapGoods = {
  goods_all_id: number;
  id: number;
  wh_scr_id: number;
  title: string; //名称
  barcode: string; //条码
  brand: string;
  spec: string; //规格型号
  measure_name: string; //单位
  class_name: string;
  price: string;
  scr_num: number; //
  sup_name: string;
  note: string;
  ph_no: string; //批次/日期
  warehouse_id: number;
  warehouse_name: string; //仓库
  unique: string;
  up_uid: number;
  create_time: string;
  ct_uid: number;
  in_goods: string;
  goods_id: number;
  stock: number;
  stock_id: number;
  ws_code: string;
  in_wh_date: string;
};

export interface IScrapDetail {
  act_log: ScrapActlog[]; //单据日志
  all_num: number;
  all_price: string;
  create_time: string;
  ct_name: string;
  ct_uid: number;
  dept_id: number;
  file_info: { name: string; src: string };
  goods: ScrapGoods[];
  id: number;
  wh_scr_no: string;
  note: string;
  process_arr: string;
  status: number;
  up_uid: number;
  out_time: string;
}

// 创建/编辑 发送数据类型
// 商品表格数据类型
export interface IScrapAdd {
  /** 商品库id */
  goods_all_id?: number;
  barcode: string; //货品条码
  title: string; //名称
  spec: string; //规格
  brand: string; //品牌
  measure_name: string; //单位
  class_name: string; //分类
  scr_num: number | undefined; //数量
  sup_name?: string; //供应商名称
  ph_no: string; //批次/日期
  warehouse_id: number;
  warehouse_name: string;
  unique: string;
  note: string;
  /** 自定义属性 最大数量 */
  // old_scr_num?: number;
  old_num: number;
  goods_id: number;
  /** 最终唯一值 */
  stock_id: number;
  /** 库位 */
  ws_code: string;
  /** 入库日期 */
  in_wh_date: string;
  price: string;
}

type IScrapPre = Omit<IScrapAdd, "old_num">; // 就是在 IGetSupAdd 的基础上，去掉 old_num 属性

export interface IScrapAddInfo {
  id?: number;
  out_time: string;
  goods: IScrapPre[];
  note: string; //主备注
  file_info: {
    //附件信息
    src: string;
    name: string;
  };
}
