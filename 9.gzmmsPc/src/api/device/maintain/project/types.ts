export interface MaintainProjectItem {
  id: number;
  name: string;
  equipment_id: number;
  equipment_title: string;
  maintenance_requirements: string;
  maintenance_area: string;
  note: string;
  ct_name: string;
  ct_uid: number;
  up_uid?: any;
  create_time: string;
  update_time: string;
  select_status?: boolean;
}

export interface MaintainProjectList {
  list: MaintainProjectItem[];
  total: number;
  page: string;
  size: string;
}
