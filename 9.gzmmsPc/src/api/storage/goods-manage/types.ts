// 货品管理列表请求参数类型
export interface IGoods {
  keyword: string;
  class_name: string;
  page: number;
  size: number;
}
// 货品管理列表返回数据list的类型 / 添加货品返回的数据类型
export interface IGoodsItem {
  id: number;
  title: string;
  spec: string;
  barcode: string;
  brand: string;
  company: string;
  price: string | number;
  img_url: string;
  class_name: string;
  measure_name: string;
  ss_num: number;
  order_point: number;
  ct_uid?: number;
  up_uid?: number;
  create_time?: string;
  goods_class: string;
  purchase_price: string | number;
}
// 货品管理列表返回数据的类型
export interface IGoodsInfo {
  list: IGoodsItem[];
  total: number;
  page: string;
  size: string;
}

// 货品管理添加API 请求参数类型
export interface IAddGoods {
  id?: number; //货品id
  barcode?: string; //条码
  title: string; //商品名称
  spec: string; //规格
  brand: string; //品牌
  company?: string; //公司
  price?: number | string; //价格
  img_url?: string; //商品图片?
  goods_class?: string; //货品分类
  class_name: string; //分类
  measure_name: string; //单位
  ss_num: number | string; //安全库存
  order_point: number | string; //订货点
  purchase_price: number | string;
}

// 货品管理添加API 请求参数类型
export interface IEditGoods {
  id?: number; //货品id
  barcode: string; //条码
  title: string; //商品名称
  spec: string; //规格
  brand: string; //品牌
  company: string; //公司
  price: string; //价格
  img_url: string; //商品图片?
  goods_class: string; //货品分类
  class_name: string; //分类
  measure_name: string; //单位
  ss_num: string; //安全库存
  order_point: string; //订货点
  purchase_price: string;
  split_barcode?: string;
  split_goods: any[];
  /** 自定义参数:表示接口检测重复的条码 */
  isRepet?: boolean;
  /** 保质期(天) */
  exp_day?: string;
  /** 保质期预警天数 */
  exp_warning_day?: string;
  /** 是否唯一标识管理；0：不是；1：是 */
  is_unique_identify?: number;
  /** 是否费用化资产；0：不是；1：是  */
  is_expensed_assets?: number;
}

export interface IGoodsDetail {
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
  ct_uid: number;
  up_uid: number;
  purchase_price: string;
  split_goods: any[];
}

export interface ICreatBack {
  title: string;
  class_name: string;
  measure_name: string;
  barcode: string;
  id: string;
  ct_uid: string;
}

/** 导出货品明细时的请求参数类型 */
export type exportQueryType = {
  /** id数组 */
  ids?: number[];
  /** 关键字 */
  keyword?: string;
  /** 类型 */
  class_name?: string;
};
