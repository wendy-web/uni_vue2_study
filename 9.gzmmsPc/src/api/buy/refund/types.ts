/** 扩展的类型 */
type EType = {
  /** 采购退货单号 */
  procure_ret_no: string;
};

/** 采购退货单list数据类型 */
export type IRefundItem = OrderItemType & EType;

/** 采购退货单列表返回数据类型 */
export type IRefundList = OrderListType<IRefundItem>;

/** 采购退货单-新建页面-table表格数据类型 */
export type IRefundGoods = AddGoodsType & {
  /** 采购单商品ID */
  procure_goods_id: number;
  /** 采购单列表ID */
  procure_id: number;
  /** 退货数量 */
  ret_num: number | string;
  /** 交货日期 */
  delivery_time: string;
  /** 合同号 */
  contract_no: string;
  /** 可选的退货数量最大值 */
  old_ret_num?: number; //最大值

  goods_id: number;
  supplier_id?: number;
  dept_id?: number;
};

// 导入数据返回数据类型
export interface IImportItem {
  id: number;
  procure_id: number;
  title: string;
  barcode: string;
  spec: string;
  brand: string;
  measure_name: string;
  class_name: string;
  price: string;
  /** 可退剩余数量 */
  rem_num: number;
  supplier_id: number;
  sup_name: string;
  delivery_time: string;
  contract_no: string;
  goods_id: number;
  dept: {
    id: number;
    name: string;
  };
  dept_id:number,
}

export interface IImportData {
  list: IImportItem[];
}

export interface IRefundPreInfo {
  id?: number;
  procure_no?: string;
  return_time?: string;
  goods: IRefundGoods[];
  note: string; //主备注
  dept?: {
    id: number;
    name: string;
  };
  file_info: {
    //附件信息
    src: string;
    name: string;
  };
}

// list页面 emit携带的参数类型
export interface IListEmit {
  val: number;
  id?: number;
  assocType?: number;
}

// add页面 emit携带的参数类型
export interface IAddEmit {
  val: number;
  preInfo?: IRefundPreInfo;
}

// detail页面 emit携带的参数类型
export interface IDetailEmit {
  val: number;
  id?: number;
}
