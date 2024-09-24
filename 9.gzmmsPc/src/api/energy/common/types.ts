/** 最近一次抄表数据的类型 */
export interface LastMeterRecordType {
  id: number;
  rel_id: number;
  rel_name: string;
  collector: string;
  rule: number;
  eq_type?: any;
  eq_id?: any;
  ct_uid: number;
  ct_name: string;
  up_uid: number;
  up_name: string;
  create_time: string;
  update_time: string;
  bar_title?: any;
  save_addr?: any;
  asset_no?: any;
  use_dept_id?: any;
  save_addr_text: string;
  eq_type_text: string;
  rule_text: string;
  collector_text: string;
  use_dept_text: string;
  assoc_type: any[];
  meter_num: string;
  meter_time: string;
}
