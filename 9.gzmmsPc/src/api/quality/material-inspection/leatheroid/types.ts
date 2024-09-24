/** 纸皮检验报告-列表接口返回的数据类型 */
export interface LeatheroidDataType {
  list: LeatheroidListType[];
  total: number;
  page: string;
  size: string;
}
/** 纸皮检验报告-列表接口返回的列表的数据类型 */
export interface LeatheroidListType {
  id: number;
  order_no: string;
  supplier_id: number;
  supplier_name: string;
  batch_no?: any;
  brand: string;
  sku: string;
  status: number;
  version_id: number;
  version?: any;
  class: number;
  check_res?: any;
  system_serial_number: string;
  pro_time?: any;
  num: number;
  check_time: string;
  check_uid: number;
  check_user: string;
  paper_img?: any;
  paper_id: number;
  weight_res: number;
  color_res: number;
  red_bull_res: number;
  warhorse_res?: any;
  printing_quality_res: number;
  opening_crack_res: number;
  barcode_res: number;
  laser_code_res: number;
  laser_qr_code_res: number;
  note: string;
  check_user_signature: string;
  reviewer_user_signature: string;
  check_view: string;
  up_uid: number;
  ct_name: string;
  ct_uid: number;
  create_time: string;
  update_time: string;
  check_info: any[];
  brand_name: string;
  sku_name: string;
  version_no: string;
  assoc_type: any[];
}

/** 纸皮详情接口返回的数据类型 */
export interface LeatheroidDetailData {
  id: number;
  order_no: string;
  supplier_id: number;
  supplier_name?: any;
  batch_no?: any;
  brand: string;
  sku: string;
  status: number;
  version_id: number;
  version: string;
  class: number;
  workshop?: any;
  check_res?: any;
  system_serial_number: string;
  pro_time: string;
  num: number;
  check_time: string;
  check_uid?: any;
  check_user: string;
  paper_img?: any;
  paper_id: number;
  weight_res?: any;
  color_res?: any;
  red_bull_res?: any;
  warhorse_res?: any;
  printing_quality_res?: any;
  opening_crack_res?: any;
  barcode_res?: any;
  laser_code_res?: any;
  laser_qr_code_res?: any;
  note?: any;
  check_user_signature?: any;
  process_arr?: any;
  reviewer_user_signature?: any;
  check_view?: any;
  up_uid?: any;
  dept_id: number;
  ct_name: string;
  ct_uid: number;
  create_time: string;
  update_time: string;
  brand_name: string;
  sku_name: string;
  total_samples: number;
  total_abnormal: number;
  up_name: string;
  reviewer_name: string;
  sup_name: string;
  file_list: any[];
  check_info: TableDataType[];
  act_log: ActLogType[];
  assoc_type: number[];
  weight_res_note: string;
  color_res_note: string;
  red_bull_res_note: string;
  warhorse_res_note: string;
  printing_quality_res_note: string;
  opening_crack_res_note: string;
  barcode_res_note: string;
  laser_code_res_note: string;
  laser_qr_code_res_note: string;
}
/** 新建/编辑/详情--检验信息表格的数据类型 */
export type TableDataType = {
  id: number | string;
  weight_res?: string; //重量
  color_res?: number; //色泽
  printing_quality_res?: number; //印刷质量检测结果
  red_bull_res?: number; //红牛标记检测结果
  warhorse_res?: number; //战马标记检测结果
  opening_crack_res?: number; //开合裂度检测结果
  barcode_res?: number; // 条形码检测结果
  laser_code_res?: number; //激光码检测结果
  laser_qr_code_res?: number; //激光码二维码检测结果
  position_res?: number; //位置检测结果
  scan_reading_res?: number; //扫码检测结果
  barcode_length?: string;
  barcode_width?: string;
  paper_size_v1?: string;
  paper_size_v2?: string;
  paper_size_v3?: string;
  paper_size_v4?: string;
  paper_size_v5?: string;
  paper_size_v6?: string;
  paper_size_v7?: string;
  paper_size_v8?: string;
  paper_size_v9?: string;
  paper_size_v10?: string;
  custom_size_res?: number[];
};

export interface ActLogType {
  id: number;
  order_id: number;
  act: string;
  act_msg?: any;
  ct_name: string;
  ct_uid: number;
  create_time: string;
}
