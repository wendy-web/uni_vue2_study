/** 定量测定原始记录详情数据类型 */
export interface SourceRecordDetailType {
  id: number;
  order_no: string;
  batch_no: string;
  brand: string;
  sku: string;
  pro_id: number;
  pro_name: string;
  insp_id: number;
  insp_name: string;
  inst_id: number;
  inst_name: string;
  heat: string;
  criterion: string;
  check_date: string;
  check_ret: number;
  check_sign?: any;
  check_user_id: number;
  check_user_name: string;
  recheck: any[];
  status: number;
  formula: string;
  curve: string;
  ct_uid: number;
  dept_id: number;
  ct_name: string;
  create_time: string;
  up_uid: number;
  up_name: string;
  update_time: string;
  remark: string;
  check_remark?: any;
  checkinfo: Checkinfo[];
  total: number;
  abnormal: number;
  files: any[];
  logs: Log[];
  brand_name: string;
  sku_name: string;
  status_text: string;
  check_ret_text: string;
}

export interface Check_json {
  amount: string;
  volume: string;
  area: string;
  content_x: string;
}

export interface Checkinfo {
  id: number;
  oid: number;
  sample_no: string;
  make_date: string;
  batch_no: string;
  sample_batch_no: string;
  check_json: Check_json[];
  content_x_avg: string;
  content_x_diff_avg: string;
  dilute?: any;
  content?: any;
  content_x?: any;
  diff_coe?: any;
  emp?: any;
  strength?: any;
  concentration?: any;
  plastid?: any;
  unit?: any;
  form?: any;
  times?: any;
  check_ret: number;
  is_use: number;
  create_time: string;
  update_time: string;
}

export interface Log {
  content: string;
  name: string;
  dept_name: string;
  create_time: string;
}

/** 定量测定原始记录列表页数据类型  */
export interface SourceRecordDataType {
  list: SourceRecordListType[];
  total: number;
  page: string;
  size: string;
}

/** 定量测定原始记录列表页--列表的数据类型  */
export interface SourceRecordListType {
  id: number;
  order_no: string;
  pro_id: number;
  pro_name: string;
  brand: string;
  sku: string;
  batch_no: string;
  check_ret: number;
  check_date: string;
  check_user_name: string;
  status: number;
  ct_name: string;
  remark: string;
  create_time: string;
  assoc_type: number[];
  brand_name: string;
  sku_name: string;
  status_text: string;
  check_ret_text: string;
}
