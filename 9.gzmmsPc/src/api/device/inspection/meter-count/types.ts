export interface meterCountDataType {
  list: meterCountItemType[];
  total: number;
  page: string;
  size: string;
}

export interface meterCountItemType {
  id: number;
  eq_id: number;
  rel_id: number;
  mult: string;
  num: string;
  ct_uid: number;
  up_uid: number;
  create_time: string;
  update_time: string;
  asset_no: string;
  bar_title: string;
  save_addr: string;
  equipment_type: string;
  equipment_type_text: string;
  save_addr_text: string;
  rel_text: string;
}


export interface meterCountLogItem {
	id: number;
	watch_id: number;
	num: string;
	create_time: string;
	update_time: string;
}

export interface meterCountLogData {
	list: meterCountLogItem[];
	total: number;
	page: string;
	size: string;
}