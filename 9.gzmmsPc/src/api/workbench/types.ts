/** 待办,消息,通知查询参数类型 */
export type INoticeQuery = {
  page: number;
  size: number;
};

/** 消息查询参数类型 */
export type IMessageQuery = INoticeQuery & {
  /** 消息列表api查询参数---是否已读，不传则显示所有的；0：未读；1：已读； */
  is_read?: number;
};

/** 待办API返回的数据类型 */
export type IBacklog = {
  list: IBacklogList[];
  page: number;
  size: number;
  total: number;
  /** 待审批数量 */
  wait_approve_total: number;
  /** 待处理数量 */
  wait_handle_total: number;
  /** 我发起数量 */
  my_initiate_total: number;
};
/** 待办API返回的数据--列表类型 */
export type IBacklogList = {
  /** 统一字段-显示单号 */
  order_no: string;
  /** 统一字段-单据类型名称 */
  document_type_name: string;
  /** 使用部门 */
  use_dept_names: string;
  /** 维修负责人 */
  director_names: string;
  /** 其他维修人 */
  other_names: string;
  /** 保养负责人 */
  repair_names: string;
  /** 其他保养负责人 */
  other_repair_names: string;
  /** 执行人 */
  executor_names: string;
  /** 创建人名称1 */
  create_name: string;
  /** 创建人名称2 */
  ct_name: string;
  /** 创建时间 */
  create_time: string;
  /** 商品明细 */
  goods_details: string;
  /** 单据状态类型 */
  operate_type: number;
  /** 单据类型 */
  document_type: number;
  procure_no: string;
  procure_ret_no: string;
  replacement_no: string;
  wh_in_no: string;
  wh_rec_no: string;
  wh_ret_no: string;
  wh_recin_no: string;
  split_assemble_no: string;
  wh_tra_no: string;
  wh_inv_no: string;
  wh_scr_no: string;
  /** 单据id*/
  id: number;
  warehouse: string;
  /** 指定领取人 */
  ar_names: string;
  /** 领料申请人 */
  rp_names: string;
  document_id: number;
  /** 单据状态 */
  status: number;
};

/** 消息API返回的数据类型 */
export type INews = {
  list: INewsList[];
  page: number;
  size: number;
  total: number;
  /** 未读条数 数量 */
  unread_num: number;
};

/** 消息API返回的数据--列表类型 */
export type INewsList = {
  id: number;
  create_time: string;
  /** 消息内容 */
  msg_content: string;
  jump_type: number;
  /** 是否已读 0：未读；1：已读 */
  is_read: number;
  operate_type: number;
  /** 单据类型 */
  document_type: number;
  /** 单据id */
  document_id: number;
  status: number;
};

/** 消息查询参数类型 */
export type IPlanQuery = {
  main_notice_num: number; // 保养计划待提醒数量
  point_notice_num: number; // 点巡检计划待提醒数量
};
