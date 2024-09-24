// export interface EquipmentItemType {
//   id: number;
//   pid: number;
//   equipment_no: string;
//   asset_no: string;
//   barcode: string;
//   bar_title: string;
//   brand: string;
//   spec: string;
//   equipment_code: string;
//   equipment_type: string;
//   power: string;
//   sn: string;
//   export_type: number;
//   product_line: number;
//   product_line_text:string;
//   note: string;
//   status: number;
//   use_dept_id: string;
//   duty_dept_id: string;
//   use_duty_user: string;
//   open_date: string;
//   use_year: number;
//   expire_date: string;
//   save_addr: string;
//   scrap_date?: any;
//   scrap_reason: string;
//   supplier_id: number;
//   production_id: number;
//   purchase_uid: number;
//   price: string;
//   spoiled_rate: string;
//   spolied: string;
//   depreciation_type: number;
//   ct_uid: number;
//   up_uid: number;
//   create_time: string;
//   update_time: string;
//   eq_type_text: string;
//   save_addr_text: string;
//   status_text: string;
//   export_type_text: string;
//   depreciation_type_text: string;
//   use_dept_text: string;
//   duty_dept_text: string;
//   use_duty_user_text: string;
//   purchase_uid_text: string;
//   supplier_id_text: string;
//   production_id_text: string;
//   _level: number;
//   _children: any[];
//   select_status?: boolean;
// }

// export interface EquipmentListType {
//   list: EquipmentItemType[];
//   total: number;
//   page: string;
//   size: string;
// }

export type SparePartItemType = {
  good_id: number;
  parts_code: string;
  title: string;
  spec: string;
  note: string;
  stock: number;
};

/** 请求编辑数据返回的 */
export interface EditDataType {
	id: number;
	pid: number;
	equipment_no: string;
	asset_no: string;
	barcode: string;
	bar_title: string;
	brand: string;
	spec: string;
	equipment_code: string;
	equipment_type: string;
  equipment_type_text:string;
	power?: any;
	sn: string;
	export_type?: any;
	product_line?: any;
	note: string;
	status: number;
	use_dept_id?: any;
	duty_dept_id?: any;
	use_duty_user: string;
	open_date?: any;
	use_year?: any;
	expire_date?: any;
	save_addr: string;
	scrap_date?: any;
	scrap_reason: string;
	supplier_id?: any;
	production_id?: any;
	purchase_uid?: any;
	price: string;
	spoiled_rate?: any;
	spolied?: any;
	depreciation_type?: any;
	ct_uid: number;
	up_uid: number;
	create_time: string;
	update_time: string;
	child: any[];
	files_list: any[];
	parts_list: any[];
}