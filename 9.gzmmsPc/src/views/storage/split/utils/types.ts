export type goodsType = {
  barcode: string;
  title: string;
  spec: string;
  num: number | undefined;
  note: string;
  measure_name: string;
  brand: string;
  class_name: string;
  goods_id: number;
  quantity: number;
  old_num: number | undefined;
  batch_number: string;
  unique: string;
  stock_id: number;
  price:string;
  ws_code:string;
  in_wh_date:string;
  assemble_goods: {
    barcode: string;
    title: string;
    spec: string;
    num: undefined | number;
    measure_name: string;
    brand: string;
    class_name: string;
    goods_id: number;
    price: string;
    ws_code:string;
    in_wh_date:string;
  };
};

export type preInfoType = {
  id: number;
  goods: goodsType[];
  /** 拆装仓库 */
  split_wh_name: string;
  warehouse_id: number;
  /** 拆装日期 */
  split_date: string;
  /** 主备注 */
  note: string;
  /** 附件信息 */
  file_info: {
    src: string;
    name: string;
  };
};
