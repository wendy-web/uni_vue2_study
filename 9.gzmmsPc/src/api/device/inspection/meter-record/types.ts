export interface MeterRecoedItemType {
  id: number;
  serial_number_no: string;
  equipment_id: number;
  bar_title: string;
  is_produce: number;
  equipment_type_id: number;
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
  last_meter_time: string;
  this_meter_time: string;
  meter_readings_time?: any;
  meter_readings_id: number;
  note: string;
  up_uid?: any;
  ct_uid: number;
  ct_name: string;
  update_time: string;
  create_time: string;
  use_places: string;
  equipment_type_name: string;
  meter_readings_name: string;
}

export interface MeterRecoedDataType {
  list: MeterRecoedItemType[];
  total: number;
  page: string;
  size: string;
}
