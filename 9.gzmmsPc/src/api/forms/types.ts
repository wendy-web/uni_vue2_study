// 货品库存类型

// 货品库存查询请求类型
export interface IsearchQuery {
  warehouse_id: number | undefined;
  class_name: string | undefined;
  title: string | undefined;
}

// 货品库存列表返回类型
export interface IGoodsStockItem {
  id: number;
  barcode: string;
  title: string;
  spec: string;
  brand: string;
  measure_name: string;
  class_name: string;
  price: string;
  rem_num: number;
  sup_name: string;
  ph_no: string;
  warehouse_id: number;
  warehouse_name: string;
}

/** 详情数据的类型 */
export interface IStockDetail {
  /** 条码 */
  barcode: string;
  /** 批次/日期 */
  batch_number: string;
  /** 品牌 */
  brand: string;
  /** 总库存id */
  inventory_id: number;
  /** 库存数量 */
  quantity: number;
  /** 公司名称 */
  company: string;
  /** 规格 */
  spec: string;
  title: string;
}

/** 新的货品库存列表接口数据响应类型 */
export interface IStockData {
  id: number;
  goods_id: number;
  /**总库存数量 */
  stock: number;
  /** 详情列表 */
  detail: IStockDetail[];
  goods: {
    /** 商品编码 */
    barcode: string;
    /** 品牌 */
    brand: string;
    /** 分类名称 */
    class_name: string;
    /** 公司 */
    company: string;
    /** 货品分类 */
    goods_class: string;
    id: number;
    /** 图片 */
    img_url: string;
    /** 计量单位 */
    measure_name: string;
    /** 订货点 */
    order_point: string;
    /** 参考价格 */
    price: string;
    /** 规格 */
    spec: string;
    /** 安全库存 */
    ss_num: string;
    /** 产品名称 */
    title: string;
  };
  /** 仓库信息 */
  warehouse: {
    id: number;
    name: string;
  };
  warehouse_id: number;
}

export interface IStockList {
  current_page: number;
  data: IStockData[];
  last_page: number;
  per_page: string;
  total: number;
}

export interface IWarehouseData {
  id: number;
  name: string;
}
