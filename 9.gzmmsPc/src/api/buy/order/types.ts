//采购单类表请求参数类型
export interface IBuyOrderQuery {
  keyword?: string;
  dept_id?: number;
  start_time?: string;
  end_time?: string;
  status?: number;
  page: number;
  size: number;
}

/** 采购单列表返回的list字段数据类型 */
export type IBuyOrderItem = OrderItemType;

/** 采购单列表返回的数据类型 */
export type IBuyOrderList = OrderListType<IBuyOrderItem>;

/** 采购单页面 新建页面 table表格数据类型 */
export type IOrderAddTable = AddGoodsType & {
  /** 采购数量 */
  num: string;
  /** 可选的小计 */
  sub_total?: string;
  /** 交货日期 */
  delivery_time: string;
  /** 提交日期 */
  submit_time: string;
  /** 需求部门id */
  dept_id: number;
  /** 合同编号 */
  contract_no: string;
  /** 供应商id */
  supplier_id: number;
  /** 商品id */
  goods_id: number;
  dept?: {
    id: number;
    name: string;
  };
  dept_name?: string;
};

// 采购单新建页面 创建采购单,请求参数类型
export interface IOrderAddInfo {
  goods: IOrderAddTable[]; //表格内容
  note: string; //主备注
  file_info: {
    //附件信息
    src: string;
    name: string;
  };
}
// 采购单页面 新建页面 传递给预览页面的数据类型
export interface IOrderPreInfo extends IOrderAddInfo {
  id: number;
  purpose: string;
  demand_date: string;
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
  preInfo?: IOrderPreInfo;
}

// detail页面 emit携带的参数类型
export interface IDetailEmit {
  val: number;
  id?: number;
}

/** 采购单导入的类型 */
export type ProcureImportType = {
  id: number;
  barcode: string;
  brand: string;
  title: string;
  spec: string;
  class_name: string;
  measure_name: string;
  ss_num: string;
  goods_class: string;
  order_point: string;
  price: string;
  purchase_price: string;
  split_quantity: number;
  num: string;
  supplier_id: number;
  sup_name: string;
  pro_time: string;
  exp_day: string;
  exp_time: string;
  ws_code: string;
};
