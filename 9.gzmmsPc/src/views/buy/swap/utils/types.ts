import { IOrderAddTable } from "@/api/buy/order/types";

/* 类型抽离,方便后续扩充 */

/** 新建/编辑页面的标题 枚举 */
export enum EAddTitle {
  "新建采购换货单" = 1,
  "编辑采购换货单",
}

export interface Props {
  listId: number; //采购单id
  editFrom: number; //从哪个组件进入add编辑页的标识, 1是从list组件过去,2是detail组件过去, 0是pre组件返回过去的
}

export interface INewRefundGoods {
  /** 商品编码 */
  barcode: string;
  /** 商品名称 */
  title: string;
  /** 规格 */
  spec: string;
  /** 品牌 */
  brand: string;
  /** 计量单位 */
  measure_name: string;
  /** 分类 */
  class_name: string;
  price?: string;
  goods_id: number;
  dept_id: number;
  dept_name?: string;
  /** 退货数量 */
  return_num: number | string;
  supplier_id: number;
  /** 供应商名称 */
  sup_name?: string;
  note: string;
  /** 采购单商品ID */
  procure_goods_id: number;
  /** 换货单id */
  replacement_id?: number;
  /** 可选的退货数量最大值 */
  old_ret_num?: number; //最大值
}

export interface ISwaoPreInfo {
  id?: number;
  procure_no: string;
  replacement_data: string;
  refundGoods: INewRefundGoods[];
  buyGoods: IOrderAddTable[];
  note: string; //主备注
  file_info: {
    //附件信息
    src: string;
    name: string;
  };
}

export interface IAddEmit {
  val: number;
  preInfo?: ISwaoPreInfo;
}

export interface IPreProps {
  preTableData: ISwaoPreInfo;
}
