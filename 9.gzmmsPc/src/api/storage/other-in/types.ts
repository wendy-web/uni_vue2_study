/** 其他入库列表api返回的list字段数据类型 */
export type IOtherInItem = OrderItemType & {
  /** 其他入库单号 */
  wh_in_no: string;
  /** 其他入库时间 */
  in_time: string;
  /** 入库仓库id */
  in_wh_id: number;
  /** 入库仓库名称 */
  in_wh_name: string;
};

/** 其他入库列表api返回的数据类型 */
export type IOtherInList = OrderListType<IOtherInItem>;

// 其他入库单详情api返回的数据类型
export interface IOtherInDetailLog {
  act: string;
  act_msg: string;
  create_time: string;
  ct_name: string;
  ct_uid: number;
  id: number;
  wh_in_id: number;
}
export interface IOtherInDetailGoods {
  barcode: string;
  brand: string;
  class_name: string;
  contract_no: string;
  create_time: string;
  ct_uid: number;
  delivery_time: string;
  id: number;
  in_num: number;
  measure_name: string;
  note: string;
  ph_no: string;
  price: string;
  pro_time: string;
  procure_goods_id: number;
  procure_id: number;
  spec: string;
  sub_total: string;
  sup_name: string;
  title: string;
  warehouse_id: number;
  warehouse_name: string;
  wh_in_id: number;
  goods_id: number;
  dept: {
    id: number;
    name: string;
  };
  dept_id: number;
}

export interface IOtherInDetail {
  wh_in_no: string;
  procure_no: string;
  ct_name: string;
  create_time: string;
  all_price: string;
  note: string;
  status: number;
  act_log: [IOtherInDetailLog];
  goods: [IOtherInDetailGoods];
  file_info: {
    //附件信息
    src: string;
    name: string;
  };
  in_time: string;
  in_wh_name: string;
  in_wh_id: number;
  type: number;
  procure_id: number;
}

/** 其他入库 添加时的数据类型 */
export type IOtherInGoods = AddGoodsType & {
  /** 入库数量 */
  in_num: number | string;
  /** 交货日期 */
  delivery_time: string;
  /** 合同号 */
  contract_no: string;
  /** 批次/日期 */
  ph_no: string;
  /** 可选的 供应商id*/
  sup_id?: number;
  goods_id: number;
  pro_time: string;
  exp_day: string;
  exp_time: string;
  ws_code: string;
};

export interface IOtherInAddInfo {
  id?: number;
  in_time: string;
  in_wh_id: number;
  in_wh_name: string;
  procure_no?: string;
  procure_id?: number;
  type: number;
  goods: IOtherInGoods[];
  note: string; //主备注
  file_info: {
    //附件信息
    src: string;
    name: string;
  };
}
