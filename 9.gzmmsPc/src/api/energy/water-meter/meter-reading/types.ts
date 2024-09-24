export interface WaterRecordListType {
  id: number;
  serial_number_no: string;
  type: number;
  rel_id: number;
  rel_name?: any;
  rule: number;
  equipment_id: number;
  bar_title: string;
  is_produce: number;
  equipment_type_id: number;
  equipment_type_name: string;
  start_time?: any;
  end_time?: any;
  asset_no: string;
  class_type: number;
  class_no: number;
  start_num: string;
  end_num: string;
  dosage_num: string;
  multiplier: string;
  purpose: number;
  use_addr: string;
  use_addr_text?: any;
  last_meter_time?: string;
  this_meter_time?: string;
  meter_readings_time?: any;
  meter_readings_id: number;
  time?: any;
  note?: any;
  is_valid: number;
  up_uid?: any;
  up_name?: any;
  ct_uid: number;
  ct_name: string;
  update_time?: string;
  create_time?: string;
  meter_readings_name: string;
}

export interface WaterRecordDataType {
  list: WaterRecordListType[];
  total: number;
}
