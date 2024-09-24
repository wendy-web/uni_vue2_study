/** 红牛成品检验结果详情接口数据类型 */
export interface RedbullDetailDataType {
  id: number;
  order_no: string;
  check_date: string;
  inspection_basis_id: number;
  inspection_basis_name: string;
  inspection_basis_val: string;
  pro_date: string;
  brand: string;
  status: number;
  report_user_signature?: any;
  reviewer_user_signature?: any;
  check_result_json: string;
  ph_soluble_signature: string;
  volume_signature?: any;
  seaming_inspection_signature?: any;
  sense_signature?: any;
  microbe_signature?: any;
  functional_signature?: any;
  label_signature?: any;
  composition_analysis_signature?: any;
  conclusion?: any;
  report_uid: number;
  report_user: string;
  dept_id: number;
  process_arr?: any;
  base_val: string;
  note?: any;
  up_uid?: any;
  ct_name: string;
  ct_uid: number;
  create_time: string;
  update_time: string;
  is_delete: number;
  total_samples: number;
  total_abnormal: number;
  up_name: string;
  check_user: string;
  check_result_info: Check_result_info[];
  file_list: any[];
  batch_info: Batch_info[];
  act_log: Act_log[];
  assoc_type: number[];
}
export interface Check_result_info {
  line_id: string;
  line: string;
  ph_res: string;
  soluble_solids_res: string;
}

export interface Batch_detail {
  id: number;
  order_id: number;
  batch_info_id: number;
  check_order_id: number;
  check_detail_id: number;
  batch_no: string;
  batch_number: string;
  sku: string;
  check_res?: any;
  line_id: number;
  line: string;
  type?: any;
  is_send: number;
  up_uid?: any;
  ct_name: string;
  note?: any;
  ct_uid: number;
  update_time: string;
  create_time: string;
}
/** 批次信息类型 */
export interface Batch_info {
  id: number;
  order_id: number;
  batch_no: string;
  line_id: number;
  line: string;
  sku: string;
  up_uid?: any;
  ct_name: string;
  note?: any;
  ct_uid: number;
  update_time: string;
  create_time: string;
  batch_detail: Batch_detail[];
  batch_number_str: string;
}

export interface Act_log {
  id: number;
  order_id: number;
  act: string;
  act_msg?: any;
  ct_name: string;
  ct_uid: number;
  create_time: string;
}


export interface RedbullListType {
	id: number;
	order_no: string;
	check_date: string;
	inspection_basis_id: number;
	inspection_basis_name: string;
	inspection_basis_val: string;
	pro_date: string;
	brand: string;
	status: number;
	report_user_signature: string;
	reviewer_user_signature?: any;
	check_result_json: string;
	ph_soluble_signature?: any;
	volume_signature?: any;
	seaming_inspection_signature?: any;
	sense_signature?: any;
	microbe_signature?: any;
	functional_signature?: any;
	label_signature?: any;
	composition_analysis_signature?: any;
	conclusion?: any;
	report_uid: number;
	report_user: string;
	dept_id: number;
	process_arr: string;
	base_val: string;
	note?: any;
	up_uid: number;
	ct_name: string;
	ct_uid: number;
	create_time: string;
	update_time: string;
	is_delete: number;
	assoc_type: number[];
	brand_name: string;
	line_str: string;
}

export interface RedbullDataType {
	list: RedbullListType[];
	total: number;
	page: string;
	size: string;
}