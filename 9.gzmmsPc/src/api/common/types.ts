/**
 * 文件API类型声明
 */
// export interface FileInfo {
//   name: string;
//   url: string;
// }

// 文件API返回数据类型声明
export interface FileInfo {
  src: string;
  name: string;
}
// 扫码获取商品信息请求参数类型声明
export interface ICode {
  barcode: string;
}

// 扫码获取商品信息返回数据类型声明
export interface ICodeInfo {
  title: string;
  brand: string;
  spec: string;
  company: string;
  price: string;
  img_url: string;
  barcode: string;
  gid: number | string;
}

// 货品分类列表和仓库列表类型声明
export interface ICateItem {
  id: number;
  name: string;
  inputStatus?: number; //输入框状态
  selectStatus?: boolean; //可选状态
  module_type?: number;
}

export interface ICateInfo {
  list: ICateItem[];
}

// 部门列表类型声明
export interface IDeptItem {
  id: number;
  name: string;
  pid: number;
  top_id: number;
  rank: number;
  create_time: string;
  _level: number;
  _children: IDeptItem[];
  module_type?: number;
}

export interface IDeptInfo {
  list: IDeptItem[];
}

// 供应商列表返回数据类型
export interface ISupItem {
  id: number;
  name: string;
  mobile: string;
  /** 控制是否可选 */
  disable?: boolean;
}

export interface ISupList {
  list: ISupItem[];
}

// 货品列表返回数据类型
export interface IGoodsItem {
  id: number;
  barcode: string;
  title: string;
  spec: string;
  class_name: string;
  measure_name: string;
  ss_num?: number;
  order_point?: number;
  brand: string;
  goods_class: string;
  select_status?: number;
  price?: string;
  supplier_id?: number;
  sup_name: string;
  purchase_price: string;
  flag: boolean;
  exp_day: string;
}
export interface IGoodsList {
  list: IGoodsItem[];
  data: IGoodsItem[];
  total: 10;
}

// 已入库-分组请求参数
export interface IGoodsQuery {
  is_all?: number; //默认0只显示大于0,1显示全部
  warehouse_id?: number; //仓库筛选，默认全部
  keyword?: string;
  page?: number;
  size?: number;
}

// 已入库-分组API返回的数据类型
export interface IGoodsGroupItem {
  id: number;
  title: string;
  barcode: string;
  spec: string;
  brand: string;
  measure_name: string;
  class_name: string;
  in_num?: number;
  rem_num: number;
  sup_name: string;
  // ph_no: string;
  batch_number: string;
  warehouse_id: number;
  warehouse_name: string;
  unique?: string;
  /** 是否可选 自定义参数*/
  select_status?: boolean;
  /** 编辑id 自定义参数 */
  editId?: number;
  /** goods_id */
  goods_id: number;
  /** 新的货品库存数量字段 */
  stock?: number;
}
export interface IGoodsGroupList {
  list: IGoodsGroupItem[];
}

/** 新的已入库分组api返回的数据类型 */
export interface IinStockItem {
  /** 商品编码 */
  barcode: string;
  /** 品牌 */
  brand: string;
  /** 分类 */
  class_name: string;
  /** 公司名称 */
  company?: string;
  /** 货品分类 */
  goods_class?: string;
  /** 商品id */
  goods_id: number;
  img_url?: string;
  /** 计量单位 */
  measure_name: string;
  /** 订货点 */
  order_point?: string;
  /** 价格 */
  price: string;
  /** 规格 */
  spec: string;
  /** 安全库存 */
  ss_num?: string;
  /** 库存数量 */
  stock: number;
  /** 商品名称 */
  title: string;
  /** 仓库id */
  warehouse_id: number;
  /** 仓库名称 */
  warehouse_name: string;
  /** 详情商品列表与入库库存匹配唯一值 仓库id-条码-批号 */
  unique: string;
  /** 最终唯一值,代替unique */
  stock_id: number;
  /** 批次/日期 */
  batch_number: string;
  /** 是否可选 自定义参数 */
  select_status?: boolean;
  /** 编辑id 自定义参数 */
  editId?: number;
  /** 到期日期 */
  exp_time: string;
  /** 生产日期 */
  pro_time: string;
  /** 保质期 */
  exp_day: number;
  /** 库位 */
  ws_code: string;
  /** 入库日期 */
  in_wh_date: string;
  /** 是否是生成唯一码 */
  is_have_unique: boolean;
  /** 唯一码 */
  unique_code: string;
}
/** 新的已入库分组api返回的数据类型列表 */
export interface IinStockList {
  list: IinStockItem[];
  total: number;
}

export interface IProcureItem {
  id: number;
  /** 采购单号 */
  procure_no: string;
  /** 商品名称--多个 */
  product_name: string;
  /** 商品条码数组 */
  barcodes: string[];
}

export interface IReceiveItem {
  id: number;
  wh_rec_no: string;
  receiver_name: string;
  product_name: string;
}

export interface IStoctQuery {
  goods_id: number;
  warehouse_id: number;
  batch_number: string;
}

export interface IApproveLogType {
  id: number;
  document_type: number;
  document_id: number;
  user_id: number;
  operation_id: number;
  operation_type: string;
  operation_time: string;
  user: {
    id: number;
    name: string;
    dept: {
      id: number;
      name: string;
    };
    warehouse: {
      id: number;
      name: string;
    };
  };
}

/** 请求获取已入库拆零商品api的参数类型  */
export type InSplitQuery = {
  warehouse_id: number;
  keyword?: string;
  /** 是否返回全部默认0大于0,1全部 */
  is_all?: number;
  page?: number;
  size?: number;
};

/* 获取已入库拆零商品api返回的数据类型开始 */
export interface IAssembleGood {
  id: number;
  title: string;
  spec: string;
  barcode: string;
  brand: string;
  company: string;
  price: string;
  img_url: string;
  class_name: string;
  measure_name: string;
  goods_class: string;
  ss_num: string;
  order_point: string;
  purchase_price: string;
  ws_code: string;
  in_wh_date: string;
}

export interface ISplitGood {
  parent_id: number;
  child_id: number;
  quantity: number;
  assemble_goods: IAssembleGood;
}

export interface ISplitPrentGoods {
  id: number;
  title: string;
  spec: string;
  barcode: string;
  brand: string;
  company: string;
  price: string;
  img_url: string;
  class_name: string;
  measure_name: string;
  goods_class: string;
  ss_num: string;
  order_point: string;
  purchase_price: string;
  split_goods: ISplitGood[];
  stock_id: number;
}

export interface ISplitPrentList {
  id?: number;
  inventory_id?: number;
  goods_id: number;
  title: string;
  batch_number: string;
  spec: string;
  barcode: string;
  brand: string;
  company: string;
  stock: number;
  unique: string;
  warehouse_id: number;
  warehouse_name?: string;
  goods: ISplitPrentGoods;
  select_status?: boolean;
  price: string;
  ws_code: string;
  in_wh_date: string;
}

export interface GoodsInSplit {
  list: ISplitPrentList[];
  total: number;
}
/* 获取已入库拆零商品api返回的数据类型结束 */

/**  地点列表类型 */
export interface PlaceListType {
  id: number;
  place_name: string;
  pid: number;
  top_id: number;
  rank: number;
  create_id: number;
  level: number;
  children: PlaceListType[];
}

// 调拨导入货品API返回的数据类型
export interface IAllotImportItem {
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
  unique: string;
  stock_id: number;
  ws_code: string;
  in_wh_date: string;
}
export interface IAllotImport {
  list: IAllotImportItem[];
}

/** 货品管理检查重复api返回的数据类型 */
export interface ICheckBarcodeList {
  barcode: string[];
}

export interface IAllotProcureList {
  id: number;
  procure_no: string;
  product_name: string;
  barcodes: string[];
}

export interface ISupRecType {
  name: string;
  rec_type: number;
}

/** 扫描货品标签,接口返回的货品信息 */
export interface ScanLabelGoodsList {
  id: number;
  barcode: string;
  brand?: any;
  title: string;
  spec: string;
  class_name: string;
  measure_name: string;
  ss_num?: any;
  goods_class?: any;
  order_point?: any;
  price?: any;
  purchase_price?: any;
  split_quantity: number;
  exp_day: string;
}

/** 扫描货品标签,接口返回的数据 */
export interface ScanLabelGoodsType {
  list: ScanLabelGoodsList[];
}

/** 扫描货品标签,库存标签接口返回的数据 */
export interface ScanLabelInfoType {
  list: IinStockItem[];
  code_type: number;
  is_have_unique_code:boolean;
}

/** 通过采购单导入数据返回的数据类型 */
export interface GetImportData {
  list: GetImportList[];
  total: number;
}
export interface GetImportList {
  id: number;
  title: string;
  spec?: any;
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
  is_stop_using: number;
  module_type: number;
  exp_day: number;
  exp_warning_day: number;
  is_unique_identify: number;
  is_expensed_assets: number;
  ct_uid?: any;
  up_uid?: any;
  create_time: string;
  update_time: string;
  purchase_price?: any;
  rem_num: number;
  stock_id: number;
  goods_id: number;
  warehouse_id: number;
  ws_code: string;
  sup_name: string;
  batch_number: string;
  pro_time: string;
  exp_time?: any;
  warehouse_name: string;
  select_status?: boolean;
}

/** 获取库存明细唯一标签码接口返回的labels列表的类型 */
export interface uniqueLabelListType {
  id?:number;
  barcode: string;
  title: string;
  spec: string;
  stock_qty: number;
  batch_number: string;
  in_wh_date: string;
  sup_name: string;
  code: string;
  num: number;
  select_status?: boolean;
}
/** 获取库存明细唯一标签码接口返回的数据类型 */
export interface uniqueLabelDataType {
  total: number;
  labels: uniqueLabelListType[];
}
