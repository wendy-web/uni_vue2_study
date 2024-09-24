// 领料出库单类型

// 列表API返回数据类型
export interface IGetSupItem {
  id: number;
  wh_rec_no: string;
  procure_no: string;
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
  status: number; //0待提审,1待审核,3已完成,4已撤回,5已驳回,6已作废,8待领料,
  create_time: string;
  assoc_type: number;
  /** 领取确认状态 废弃 */
  // receiver_confirm_status: number;
  /** 使用地点 */
  use_places: string;
  /** 指定领取人 */
  ar_names: string;
  ar_uid: string[];
  /** 领料申请人 */
  rp_names: string;
  /** 是否制单人 */
  is_ct_user: number;
  /** 是否部分发料  0：不是；1：部分发料；*/
  is_part_issue: number;
  /** 是否部分领取 是否有领取过；0：不是；1：是； */
  is_have_received: number;
  /** 是否强制完结；0：否；1：是；  */
  is_force_receive: number;
  details: GetSupGoods[];
  out_time: string;
  rec_type_name: string;
}

export interface IGetSupList {
  list: IGetSupItem[];
  total: number;
  page: string;
  size: string;
}

// 详情API返回数据类型
// 单据日志类型
export type GetSupActlog = {
  act: string;
  act_msg: string;
  create_time: string;
  ct_name: string;
  ct_uid: number;
  id: number;
  wh_rec_id: number;
};
// 商品数据类型
export type GetSupGoods = {
  goods_all_id: number;
  barcode: string; //条码
  brand: string;
  class_name: string;
  create_time: string;
  ct_uid: number;
  id: number;
  in_goods: string;
  measure_name: string; //单位
  note: string;
  ph_no: string; //批次/日期
  price: string;
  rec_num: number; //领料数量
  rem_num: number; //剩余数量
  /** 已发数量 */
  issue_num: number;
  /** 本次发料数量 */
  this_num: number;
  /** 已领数量  */
  received_num: number;
  /** 发料状态  */
  issuance_status: number;
  /** 本次领料数量 */
  this_wait_received_num: number;
  spec: string; //规格型号
  sub_total: string;
  sup_name: string;
  title: string; //名称
  unique: string;
  up_uid: number;
  warehouse_confirm: number; //0初始 1确认2驳回
  warehouse_id: number;
  warehouse_name: string; //仓库
  wh_rec_id: number;
  goods_id: number;
  stock: number;
  /** 领料申请人id */
  rp_uid: number;
  /** 指定领取人id */
  ar_uid: string;
  /** 最终审批人id */
  ap_uid: string;
  /** 使用地点数组 */
  use_place_id: number[];
  /** 使用地点名称 */
  use_places: string;
  stock_id: number;
  ws_code: string;
  in_wh_date: string;
  pro_time: string;
  exp_time: string;
  unique_label_detail: uniqueLabelDetailType[];
  is_have_unique: boolean;
};

export interface IGetSupDetail {
  act_log: GetSupActlog[]; //单据日志
  all_num: number;
  all_price: string;
  create_time: string;
  ct_name: string;
  ct_uid: number;
  dept_id: number;
  file_info: { name: string; src: string };
  goods: GetSupGoods[];
  id: number;
  note: string;
  process_arr: string;
  procure_no: string;
  status: number;
  up_uid: number;
  wh_rec_no: string;
  receiver_name: string;
  out_time: string;
  unique: string;
  /** 领料申请人id */
  rp_uid: number;
  rp_names: string;
  /** 指定领取人id */
  ar_uid: string;
  ar_names: string;
  /** 最终审批人id */
  ap_uid: number;
  ap_names: string;
  /** 领取确认状态 */
  receiver_confirm_status: number;
  /** 身份标识 */
  assoc_type: number[];
  /** 是否制单人 */
  is_ct_user: number;
  /** 是否部分发料  0：不是；1：部分发料；*/
  is_part_issue: number;
  /** 是否部分领取 是否有领取过；0：不是；1：是； */
  is_have_received: number;
  /** 是否强制完结；0：否；1：是；  */
  is_force_receive: number;
  /** 二维码地址 */
  receive_qrcode_url: string;
  /** 领料类型 */
  rec_type: number;
  rec_type_name: string;
  warehouse_name: string;
  warehouse_id: number;
}

// 创建/编辑 发送数据类型
// 商品表格数据类型
export interface IGetSupAdd {
  // goods_all_id?: number;
  barcode: string; //货品条码
  title: string; //名称
  spec: string; //规格
  brand: string; //品牌
  measure_name: string; //单位
  class_name: string; //分类
  rec_num: number | undefined; //领料数量
  sup_name?: string; //供应商名称
  ph_no: string; //批次/日期
  warehouse_id: number; //仓库id
  warehouse_name: string; //仓库名称
  note: string; //备注
  /** 自定义参数  领料数量的备份,最大领料数量*/
  old_num: number;
  /** 自定义参数 元素是否可以选择 */
  select_status?: boolean;
  goods_id: number;
  unique: string;
  use_place_id?: number[];
  stock_id: number;
  ws_code: string;
  in_wh_date: string;
  pro_time: string;
  exp_time: string;
  /** 判断是否使用唯一码的方式*/
  is_have_unique?: boolean;
  unique_label_detail?: uniqueLabelDetailType[];
}
type uniqueLabelDetailType = {
  unique_code: string;
};

type GetSupPre = Omit<IGetSupAdd, "old_num">; // 就是在 IGetSupAdd 的基础上，去掉 old_num 属性

export interface IGetSupInfo {
  id?: number;
  warehouse_id?: number;
  warehouse_name?: string;
  receiver_name?: string;
  out_time: string;
  goods: GetSupPre[];
  note: string; //主备注
  file_info: {
    //附件信息
    src: string;
    name: string;
  };
  /** 领料申请人 */
  rp_uid: number;
  /** 领料申请人名称 */
  rp_uname: string;
  /** 指定领取人 */
  ar_uid: string;
  /** 指定领取人名称 */
  ar_uname: string;
  /** 最终审批人 */
  ap_uid: number | undefined;
  /** 最终审批人名称 */
  ap_uname: string;
  /** 所有商品的不重复仓库id,和仓库名称 */
  goodsWarehouseId: any[];
  /** 领取人名称数组 */
  ar_uname_list: string[];
  placeList?: any[];
  rec_type?: number;
  rec_type_name?: string;
}
