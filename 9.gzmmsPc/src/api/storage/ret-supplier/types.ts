// 退料入库单类型
// 列表数据类型
export interface IRetSupInItem {
  id: number;
  wh_recin_no: string;
  wh_rec_no: string;
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

export interface IRetSupInList {
  list: IRetSupInItem[];
  total: number;
  page: string;
  size: string;
}

// 详情API返回数据类型
// 单据日志类型
export type IRetSupInActlog = {
  act: string;
  act_msg: string;
  create_time: string;
  ct_name: string;
  ct_uid: number;
  id: number;
  wh_recin_id: number;
};
// 商品数据类型
export type IRetSupInGoods = {
  goods_all_id: number;
  barcode: string; //货品条码
  brand: string;
  class_name: string;
  create_time: string;
  ct_uid: number;
  id: number; //货品id
  measure_name: string; //单位
  note: string; //备注
  ph_no: string; //批次/日期
  price: string;
  rec_goods_id: number;
  rec_num: number; //
  rem_num: number; //
  spec: string; //规格型号
  sup_name: string;
  title: string; //名称
  up_uid: number;
  warehouse_confirm: number;
  warehouse_id: number;
  warehouse_name: string; //出库仓库名
  wh_recin_id: number;
  goods_id: number;
  stock_id: number;
  ws_code: string;
  in_wh_date: string;
};

export interface IRetSupInDetail {
  act_log: IRetSupInActlog[]; //单据日志
  all_num: number;
  all_price: string;
  create_time: string;
  ct_name: string;
  ct_uid: number;
  dept_id: number;
  file_info: { name: string; src: string };
  goods: IRetSupInGoods[];
  id: number;
  note: string;
  process_arr: string;
  status: number;
  up_uid: number;
  wh_rec_no: string;
  wh_recin_no: string;
  in_time: string;
  assoc_type:number[]
}

// 创建/编辑 发送数据类型
// 商品表格数据类型
export interface IRetSupInAdd {
  /** 编辑需要的id */
  id?: number;
  /** 返回的id */
  goods_all_id?: number;
  /** 导入的商品id */
  rec_goods_id: number;
  wh_rec_id?: number; //导入采集的领料出库单的id,编辑的时候不需要
  title: string; //名称
  barcode: string; //货品条码
  price: string; //价格
  rec_num: number | string; // 取导入的rem_num
  spec: string; //规格
  brand: string; //品牌
  class_name: string; //分类
  measure_name: string; //单位
  sup_name: string; //供应商名称
  note: string; //备注
  warehouse_id: number; //仓库id
  warehouse_name: string; //仓库名称
  ph_no: string; //批次/日期
  old_rec_num?: number; //rec_num的留底,相当于最大退料入库数量
  goods_id: number;
  stock_id: number;
  ws_code: string;
  in_wh_date: string;
}

export interface IRetSupInAddInfo {
  id?: number; // 领料入库单id 传给预览页面的
  wh_rec_no?: string; //领料入库单号 传给预览页面的
  in_time: string;
  goods: IRetSupInAdd[];
  note: string; //主备注
  file_info: {
    //附件信息
    src: string;
    name: string;
  };
}

// 导入货品API返回的数据类型
export interface IRetSupInImportItem {
  goods_all_id: number;
  id: number;
  wh_rec_id: number;
  title: string;
  barcode: string;
  spec: string;
  brand: string;
  measure_name: string;
  class_name: string;
  price: string;
  rec_num: number;
  rem_num: number;
  sup_name: string;
  note: string;
  ph_no: string;
  warehouse_id: number;
  warehouse_name: string;
  warehouse_confirm: number;
  ct_uid: number;
  up_uid: number;
  create_time: string;
  goods_id: number;
  /** 唯一标识 */
  stock_id: number;
  ws_code: string;
  in_wh_date: string;
  select_status?: boolean;
}
export interface IRetSupInImport {
  list: IRetSupInImportItem[];
  data: IRetSupInImportItem[];
  total: number;
}
