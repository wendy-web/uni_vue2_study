export interface AllotRecordItemType {
	id: number;
	stock_id: number;
	ct_uid: number;
	out_wh_name: string;
	to_wh_name: string;
	to_wh_id: number;
	out_wh_id: number;
	in_time: string;
	out_time: string;
	dept_id: number;
	status: number;
	wh_tra_no: string;
	ct_name: string;
	barcode: string;
	title: string;
	spec?: any;
	brand?: any;
	measure_name: string;
	class_name: string;
	warehouse_name: string;
	rec_num: number;
	warehouse_id: number;
	ph_no: string;
	stock_price: string;
	ws_code: string;
	price: string;
	in_wh_date: string;
	in_wh_no: string;
}

export interface AllotRecordDataType {
	list: AllotRecordItemType[];
	total: number;
	page: string;
	size: string;
}