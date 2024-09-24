//采购入库单类型

/** 采购入库列表api返回的list字段数据类型 */
export type IBuyInItem = OrderItemType & {
  /** 采购入库单号 */
  wh_in_no: string;
  /** 采购入库时间 */
  in_time: string;
  /** 入库仓库id */
  in_wh_id: number;
  /** 入库仓库名称 */
  in_wh_name: string;
};

/** 采购入库列表api返回的数据类型 */
export type IBuyInList = OrderListType<IBuyInItem>;

// 详情api返回的数据类型
export interface IBuyInDetailLog {
  act: string;
  act_msg: null | string;
  create_time: string;
  ct_name: string;
  ct_uid: number;
  id: number;
  wh_in_id: number;
}

export interface IBuyInDetailGoods {
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
  procure_goods_id: number;
  procure_id: number;
  spec: string;
  sub_total: string;
  sup_name: string;
  title: string;
  up_uid: null | number;
  warehouse_id: number;
  warehouse_name: string;
  wh_in_id: number;
  goods_id: number;
  dept: {
    id: number;
    name: string;
  };
  dept_id: number;
  pro_time: string;
  exp_day: string;
  exp_time: string;
  ws_code: string;
  // dept_name?: string;
}

export interface IBuyInDetail {
  wh_in_no: string;
  procure_no: string;
  ct_name: string;
  create_time: string;
  all_price: string;
  note: string;
  status: number;
  act_log: IBuyInDetailLog[];
  goods: IBuyInDetailGoods[];
  file_info: {
    //附件信息
    src: string;
    name: string;
  };
  in_time: string;
  in_wh_name: string;
  in_wh_id: number;
  assoc_type: number[];
  type: number;
  procure_id: number;
}

// 导入货品api返回的数据类型
export interface IBuyInImportItem {
  barcode: string;
  brand: string;
  class_name: string;
  contract_no: string;
  delivery_time: string;
  id: number;
  measure_name: string;
  price: string;
  procure_id: number;
  /** 可入库数量 */
  rem_num: number;
  spec: string;
  sup_name: string;
  title: string;
  goods_id: number;
  /** 部门信息 */
  dept: {
    id: number;
    name: string;
  };
  dept_id: number;
  exp_day:string;
  select_status?: boolean;
}
export interface IBuyInImport {
  list: IBuyInImportItem[];
  data: IBuyInImportItem[];
  total: number;
}

/** 新建从采购单导入添加时的数据类型 */
export type IBuyInAddGoods = AddGoodsType & {
  /** 采购单商品ID */
  procure_goods_id: number;
  /** 采购单列表ID */
  procure_id: number;
  /** 入库数量 */
  in_num: number | undefined;
  /** 交货日期 */
  delivery_time: string;
  /** 合同号 */
  contract_no: string;
  /** 仓库id */
  // warehouse_id: number;
  /** 仓库名称 */
  // warehouse_name: string;
  /** 批次/日期 */
  ph_no: string;
  /** 生产日期 */
  // pro_time: string;
  /** 自定义可选的入库数量最大值 */
  old_in_num?: number;
  goods_id: number;
  /** 自定义是否可以选择 */
  isSelect?: boolean;
  /** 自定义需求部门 */
  dept_name?: string;
  pro_time: string;
  exp_day: string;
  exp_time: string;
  ws_code: string;
};

/** 直接入库 添加时的数据类型 */
export type IBuyInDirectGoods = AddGoodsType & {
  /** 入库数量 */
  in_num: number | string;
  /** 交货日期 */
  delivery_time: string;
  /** 合同号 */
  contract_no: string;
  /** 仓库id */
  // warehouse_id: number;
  /** 仓库名称 */
  // warehouse_name: string;
  /** 批次/日期 */
  ph_no: string;
  /** 生产日期 */
  // pro_time: string;
  /** 可选的 供应商id*/
  sup_id?: number;
  goods_id: number;
};

export interface IBuyInAddInfo {
  id?: number;
  in_time?: string;
  radio?: number;
  procure_no?: string;
  // warehouse_name?: string;
  in_wh_id?: number;
  in_wh_name?: string;
  goods: IBuyInAddGoods[];
  note: string; //主备注
  file_info: {
    //附件信息
    src: string;
    name: string;
  };
}
