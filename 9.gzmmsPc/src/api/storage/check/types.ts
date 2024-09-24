// 调拨单类型
// 列表API返回数据类型
export interface ICheckItem {
  id: number;
  wh_inv_no: string;
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
  warehouse_id: number;
  warehouse_name: string;
}
export interface ICheckList {
  list: ICheckItem[];
  total: number;
  page: string;
  size: string;
}

// 详情API返回数据类型
// 单据日志类型
export type CheckActlog = {
  act: string;
  act_msg: string;
  create_time: string;
  ct_name: string;
  ct_uid: number;
  id: number;
  wh_inv_id: number;
};

// 商品数据类型
export type CheckGoods = {
  goods_id:number;
  id: number;
  wh_inv_id: number;
  title: string; //名称
  barcode: string; //条码
  brand: string;
  spec: string; //规格型号
  measure_name: string; //单位
  class_name: string;
  price: string;
  in_num: number; //
  inv_num: number;
  diff_num: number;
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
  stock_id:number;
  ws_code: string;
  in_wh_date:string;
};

export interface ICheckDetail {
  act_log: CheckActlog[]; //单据日志
  all_num: number;
  all_price: string;
  create_time: string;
  ct_name: string;
  ct_uid: number;
  dept_id: number;
  file_info: { name: string; src: string };
  goods: CheckGoods[];
  id: number;
  wh_inv_no: string;
  note: string;
  process_arr: string;
  status: number;
  up_uid: number;
  warehouse_id: number;
  warehouse_name: string;
  inventory_time:string;
  
}

// 创建/编辑 发送数据类型
// 商品表格数据类型
export interface ICheckAdd {
  goods_id:number;
  barcode: string; //货品条码
  title: string; //名称
  spec: string; //规格
  brand: string; //品牌
  measure_name: string; //单位
  class_name: string; //分类
  /** 库存 */
  in_num: number;
  /** 盘点数量 */
  inv_num: number;
  // sup_name: string; //供应商名称
  ph_no: string; //批次/日期
  warehouse_id: number;
  warehouse_name: string;
  unique: string;
  note: string;
  /** 自定义属性 盘盈盘亏 */
  diff_num?: number;
  /** 自定义属性 已盘:true,待盘false */
  check_status?: boolean;
  /** 自定义属性 是否扫描后的状态 */
  scan_status?: boolean;
  stock_id: number;
  ws_code:string;
  price:string;
  in_wh_date: string;
}

export interface ICheckAddInfo {
  id?: number;
  warehouse_id: number;
  warehouse_name: string;
  /** 盘点日期 */
  inventory_time: string;
  /** 盘盈总数量 */
  surplus_num: number;
  /** 盘亏总数量 */
  shortage_num: number;
  goods: ICheckAdd[];
  note: string; //主备注
  file_info: {
    //附件信息
    src: string;
    name: string;
  };
}
